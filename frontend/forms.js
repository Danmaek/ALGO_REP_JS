const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser');
router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({ extended: true }));

const http = require('http');

router.get('/form-get-all', function (req, res) {    
    console.log("[GET] /form-get-all => redirect [GET] /taches");

    http.get('http://localhost:3000/taches', (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
        data += chunk;
    });
    resp.on('end', () => {
        const parsed = JSON.parse(data.toString());
        console.log(parsed)
        state = parsed.state;
        req_response = parsed.req_response;
        res.render('index', {state : state, req_response : req_response})
    });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        res.render('index', {state : state, req_response : req_response})
    });
});

router.get('/form-get', function (req, res) {    
    console.log("[GET] /form-get-all => redirect [GET] /taches/" + req.query.id_tache);

    http.get('http://localhost:3000/taches/id/'+ req.query.id_tache, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
        data += chunk;
    });
    resp.on('end', () => {
        const parsed = JSON.parse(data.toString());
        console.log(parsed)
        state = parsed.state;
        req_response = parsed.req_response;
        res.render('index', {state : state, req_response : req_response})
    });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        res.render('index', {state : state, req_response : req_response})
    });
});

router.get('/form-get-by-state', function (req, res) {    
    console.log("[GET] /form-get-by-state => redirect [GET] /taches/state" );

    http.get('http://localhost:3000/taches/state/', (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
        data += chunk;
    });
    resp.on('end', () => {
        const parsed = JSON.parse(data.toString());
        console.log(parsed)
        state = parsed.state;
        req_response = parsed.req_response;
        res.render('index', {state : state, req_response : req_response})
    });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        res.render('index', {state : state, req_response : req_response})
    });
});

router.get('/form-get-by-tag', function (req, res) {    
    console.log("[GET] /forms/form-get-by-tag => redirect [GET] /taches/tag/" + req.query.tag);

    http.get('http://localhost:3000/taches/tag/'+ req.query.tag, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
        data += chunk;
    });
    resp.on('end', () => {
        const parsed = JSON.parse(data.toString());
        console.log(parsed)
        state = parsed.state;
        req_response = parsed.req_response;
        res.render('index', {state : state, req_response : req_response})
    });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        res.render('index', {state : state, req_response : req_response})
    });
});

router.get('/form-post', function (req, res) {
    console.log("[GET] /form-post => redirect [POST] /taches");

    const tache = 
    {
        tache : {
            title : req.query.title_tache,
            dateBegin : req.query.dateBegin_tache,
            dateEnd : req.query.dateEnd_tache,
            statut : req.query.statut_tache,
            tags : req.query.tags_tache
        }
    }
    
    const post_data = JSON.stringify(tache)
    
    const options = {
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
        data += chunk;
    });
    resp.on('end', () => {
        const parsed = JSON.parse(data.toString());
        console.log(parsed)
        state = parsed.state;
        req_response = parsed.req_response;
        res.render('index', {state : state, req_response : req_response});
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
request.write(post_data);
request.end();
});

router.get('/form-put', function (req, res) {
    console.log("[GET] /form-put => redirect [PUT] /taches/" + req.query.id_tache);

    const tache = 
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

    const post_data = JSON.stringify(tache)
    
    const options = {
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
        data += chunk;
    });
    resp.on('end', () => {
        const parsed = JSON.parse(data.toString());
        console.log(parsed)
        state = parsed.state;
        req_response = parsed.req_response;
        res.render('index', {state : state, req_response : req_response});
    });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
    request.write(post_data);
    request.end();
});

router.get('/form-delete', function (req, res) {
    console.log("[GET] /form-delete => redirect [DELETE] /taches/" + req.query.id_tache);

    const options = {
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
        data += chunk;
    });
    resp.on('end', () => {
        const parsed = JSON.parse(data.toString());
        console.log(parsed)
        state = parsed.state;
        res.render('index', {state : state, req_response : null});
    });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

    request.end();
});

module.exports = router;