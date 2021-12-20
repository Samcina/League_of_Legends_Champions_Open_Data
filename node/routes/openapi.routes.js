const express = require('express');
const router = express.Router();
const openapi = require('../public/data/openapi.json');

router.get('/', async (req, res, next) => {
    try {
      res.status(200).send(openapi);
    }
    catch (err) {
      return res.status(500).send({
        error: err || 'Something went wrong.'
      });
    }
  });

module.exports = router;