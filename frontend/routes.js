const express = require('express')
const router = express.Router()
const querystring = require('querystring');

const http = require('http');
let options = {
  hostname: 'localhost',
  port: 3000,
  path: '/taches',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
};

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

let state = {"state" : "init_page"};
let req_response = {"null" : "null"};
router.get('/', (req, res) => {
  res.render('index', {state : state, req_response : req_response})
});

router.get('/formGET', function (req, res) {
  let tache = {};
  tache.id = req.query.id_tache; //retourne le id_tache du query
  http.get('http://localhost:3000/taches/'+ tache.id, (resp) => {
    let data = '';
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      req_response = JSON.parse(data.toString());
      console.log(req_response);
      state.state = "[OK] GET"
      res.render('index', {state : state, req_response : req_response})
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
});

// TODO : méthode post
// router.get('/formPOST', function (req, res) {

//   let tache = {};
//   tache.title_tache = req.query.title_tache; 
//   tache.dateBegin_tache = req.query.dateBegin_tache; 
//   tache.dateEnd_tache = req.query.dateEnd_tache; 
//   tache.statut_tache = req.query.statut_tache; 
//   tache.tags_tache = req.query.tags_tache;
  
//   console.log(tache)
//   let post_data = JSON.stringify(tache)

//   options.method = 'POST';
//   options.headers['Content-Length'] = post_data.length;

//   console.log(options);

//   var post_req = http.request(options, (resp) => {
//     console.log('post_req')
//     let data = '';
//     // A chunk of data has been recieved.
//     resp.on('data', (chunk) => {
//       console.log(data)
//       data += chunk;
//     });
//     // The whole response has been received. Print out the result.
//     resp.on('end', () => {
//       state = JSON.parse(data.toString());
//       console.log(state);
//       res.render('index', {state : state});
//     });
//   }).on("error", (err) => {
//     console.log("Error: " + err.message);
//   });

//   post_req.write(post_data);
//   post_req.end();

// });

// TODO : méthode put

// TODO : méthode delete

// TODO : méthode getAll

module.exports = router;
