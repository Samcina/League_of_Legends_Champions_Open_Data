const express = require('express');
const router = express.Router();

const Pool = require('pg').Pool
const pool = new Pool({
  host: 'localhost',
  database: 'Champions',
  password: 'bazepodataka',
  port: 5432,
  secret: 'FERWeb1',
  user: 'postgres'
})


router.get('/', async function (req, res, next) {

    champs = await pool.query("SELECT champName FROM champions ORDER BY champName");

    res.render('index', {
        auth:res.locals.isAuthenticated,
        champs: champs.rows,

    });
});

module.exports = router;