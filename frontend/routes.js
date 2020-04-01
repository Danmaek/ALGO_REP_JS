const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

// Redirection vers l'index, c'est à dire la page contenant les formulaires
router.get('/', (req, res) => {
  const state = {"state" : "init_page"};
  const req_response = {"null" : "null"};
  res.render('index', {state : state, req_response : req_response});
});

module.exports = router;
