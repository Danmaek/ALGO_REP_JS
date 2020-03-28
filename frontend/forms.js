const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser');
router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({ extended: true }));

const http = require('http');


router.get('/form-get', function (req, res) {    
    http.get('http://localhost:3000/taches/'+ req.query.id_tache, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
        data += chunk;
    });
    resp.on('end', () => {
        let parsed = JSON.parse(data.toString());
        state = parsed.state;
        req_response = parsed.req_response;
        console.log(req_response)
        res.render('index', {state : state, req_response : req_response})
    });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        res.render('index', {state : state, req_response : req_response})
    });
});

router.get('/form-get-all', function (req, res) {    
    console.log("test")
    http.get('http://localhost:3000/taches', (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
        data += chunk;
    });
    resp.on('end', () => {
        let parsed = JSON.parse(data.toString());
        state = parsed.state;
        req_response = parsed.req_response;
        res.render('index', {state : state, req_response : req_response})
    });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        res.render('index', {state : state, req_response : req_response})
    });
});

// TODO : méthode post
router.get('/form-post', function (req, res) {
    
    let tache = 
    {
        tache : {
            title : req.query.title_tache,
            dateBegin : req.query.dateBegin_tache,
            dateEnd : req.query.dateEnd_tache,
            statut : req.query.statut_tache,
            tags : req.query.tags_tache
        }
    }

    console.log(tache)
    
    let post_data = JSON.stringify(tache)
    
    let options = {
        host: '127.0.0.1',
        port: 3000,
        path: '/taches',
        method : 'post',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length' : Buffer.byteLength(post_data, "utf8")
        }
    };
    
    const request = http.request('http://localhost:3000/taches', options, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
        console.log(data)
        data += chunk;
    });
    resp.on('end', () => {
        console.log(data)
        let parsed = JSON.parse(data.toString());
        state = parsed.state;
        req_response = parsed.req_response;
        console.log(state);
        console.log(req_response)
        res.render('index', {state : state, req_response : req_response});
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
request.write(post_data);
request.end();
});

router.get('/form-put', function (req, res) {
    
    let tache = 
    {
        tache : {
            id : parseInt(req.query.id_tache),
            title : req.query.title_tache,
            dateBegin : req.query.dateBegin_tache,
            dateEnd : req.query.dateEnd_tache,
            statut : req.query.statut_tache,
            tags : req.query.tags_tache
        }
    }

    console.log(tache)
    
    let post_data = JSON.stringify(tache)
    
    let options = {
        host: '127.0.0.1',
        port: 3000,
        method : 'put',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length' : Buffer.byteLength(post_data, "utf8")
        }
    };
    
    const request = http.request('http://localhost:3000/taches', options, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
        console.log(data)
        data += chunk;
    });
    resp.on('end', () => {
        let parsed = JSON.parse(data.toString());
        state = parsed.state;
        req_response = parsed.req_response;
        console.log(state);
        console.log(req_response)
        res.render('index', {state : state, req_response : req_response});
    });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
request.write(post_data);
request.end();
});

router.get('/form-delete', function (req, res) {
    
    let options = {
        host: '127.0.0.1',
        port: 3000,
        method : 'delete',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        }
    };
    
    const request = http.request('http://localhost:3000/taches/' + req.query.id_tache, options, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
        console.log(data)
        data += chunk;
    });
    resp.on('end', () => {
        console.log(data)
        let parsed = JSON.parse(data.toString());
        state = parsed.state;
        console.log(state);
        res.render('index', {state : state, req_response : null});
    });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

    request.end();
});



module.exports = router;
