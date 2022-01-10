const express = require('express');
const router = express.Router();
const fs = require('fs');

const Pool = require('pg').Pool
const pool = new Pool({
    host: 'localhost',
    database: 'Champions',
    password: 'bazepodataka',
    port: 5432,
    secret: 'FERWeb1',
    user: 'postgres'
})

function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

function convertToCSV(args) {

    let data = [];

    args.forEach(function (item) {

        data.push({
            champname: '"' + item.champname + '"',
            title: '"' + item.title + '"',
            lore: '"' + item.lore.replaceAll('"', '') + '"',
            hp: '"' + item.hp + '"',
            armor: '"' + item.armor + '"',
            magicResist: '"' + item.magicresist + '"',
            attackRange: '"' + item.attackrange + '"',
            attackDamage: '"' + item.attackdamage + '"',
            attackSpeed: '"' + item.attackspeed + '"',
            q_name: '"' + item.abilities[0].abilityname + '"',
            q_description: '"' + item.abilities[0].description + '"',
            w_name: '"' + item.abilities[1].abilityname + '"',
            w_description: '"' + item.abilities[1].description + '"',
            e_name: '"' + item.abilities[2].abilityname + '"',
            e_description: '"' + item.abilities[2].description + '"',
            r_name: '"' + item.abilities[3].abilityname + '"',
            r_description: '"' + item.abilities[3].description + '"',
        })

    });
    return data;

}



router.get('/', async function (req, res, next) {
    if (res.locals.isAuthenticated) {
        champs = await pool.query("SELECT champName,title,lore,hp,armor,magicResist,attackRange,attackDamage,attackSpeed, (SELECT array_to_json(array_agg(g)) FROM (SELECT abilityName, description FROM abilities as ab1 where ab1.champId = champions.champId) as g) as abilities FROM champions ORDER BY champName");

        let writeStream = fs.createWriteStream('./public/data/LoLChampions.json');

        writeStream.write(JSON.stringify(champs.rows), 'utf-8');

        writeStream.end();


        let csv = convertArrayOfObjectsToCSV({
            data: convertToCSV(champs.rows)
        });

        writeStream = fs.createWriteStream('./public/data/LoLChampions.csv');

        writeStream.write(csv, 'utf-8');

        writeStream.end();
    }

    res.redirect('/')

});




module.exports = router;