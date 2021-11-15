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

    champs = await pool.query("SELECT champName,title,lore,hp,armor,magicResist,attackRange,attackDamage,attackSpeed, (SELECT array_to_json(array_agg(g)) FROM (SELECT abilityName, description FROM abilities as ab1 where ab1.champId = champions.champId) as g) as abilities FROM champions ORDER BY champName");
  
    res.json(champs.rows);
  
  });




module.exports = router;