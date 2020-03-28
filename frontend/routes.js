const express = require('express')
const router = express.Router()
const querystring = require('querystring');


const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
  const state = {"state" : "init_page"};
  const req_response = {"null" : "null"};
  res.render('index', {state : state, req_response : req_response})
});





// TODO : méthode put

// TODO : méthode delete

// TODO : méthode getAll

module.exports = router;
