
const Pool = require('pg').Pool
const pool = new Pool({
  host: 'localhost',
  database: 'Champions',
  password: 'bazepodataka',
  port: 5432,
  secret: 'FERWeb1',
  user: 'postgres'
})

module.exports = {
  /**
  * Returns the whole collection

  

  */

  


  getChampions: async (options) => {

    // Implement your business logic here...
    //
    // Return all 2xx and 4xx as follows:
    //
    // return {
    //   status: 'statusCode',
    //   data: 'response'
    // }

    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500


    let champs = await pool.query("SELECT champid,champName,title,lore,hp,armor,magicResist,attackRange,attackDamage,attackSpeed FROM champions ORDER BY champid");

    let wrapper = {
        status:"200",
        message:"Successful operation",
        response:champs.rows
    };

    var data = [{
        "armor": "<int64>",
        "attackdamage": "<int64>",
        "attackrange": "<int64>",
        "attackspeed": "<float>",
        "champid": "<int64>",
        "champname": "<string>",
        "hp": "<int64>",
        "lore": "<string>",
        "magicresist": "<int64>",
        "title": "<string>",
      }],
      status = '200';

    return {
      status: status,
      data: wrapper
    };  
  },

  /**
  * Adds a new champion to the collection

  * @param options.champion.armor required
  * @param options.champion.attackdamage required
  * @param options.champion.attackrange required
  * @param options.champion.attackspeed required
  * @param options.champion.champname required
  * @param options.champion.hp required
  * @param options.champion.lore required
  * @param options.champion.magicresist required
  * @param options.champion.title required

  */
  addChampion: async (options) => {

    // Implement your business logic here...
    //
    // Return all 2xx and 4xx as follows:
    //
    // return {
    //   status: 'statusCode',
    //   data: 'response'
    // }

    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500
    if(!Number.isInteger(parseInt(options.champion.armor)) ||
       !Number.isInteger(parseInt(options.champion.attackdamage)) || !Number.isInteger(parseInt(options.champion.attackrange)) ||
       !Number.isInteger(parseInt(options.champion.hp))  ||  !Number.isInteger(parseInt(options.champion.magicresist)) ||
       Number.isNaN(parseFloat(options.champion.attackspeed)) || options.champion.champname == null ||
       options.champion.title == null || options.champion.lore == null){

      let status = '405';
      let wrapper = {
        status:status,
        message:"Invalid input",
        response:null
    };
    
    return {
      status: status,
      data: wrapper
    };  

    }


    let id = await pool.query("INSERT INTO champions(champname,title,lore,hp,armor,magicresist,attackrange,attackdamage,attackspeed) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING champid", 
    [options.champion.champname, options.champion.title, options.champion.lore, parseInt(options.champion.hp), parseInt(options.champion.armor), 
     parseInt(options.champion.magicresist), parseInt(options.champion.attackrange), parseInt(options.champion.attackdamage), parseFloat(options.champion.attackspeed)]);

    let champs = await pool.query("SELECT champid,champName,title,lore,hp,armor,magicResist,attackRange,attackDamage,attackSpeed FROM champions WHERE champid = $1", [parseInt(id.rows[0].champid)]);


    let context = {
      "@context" : {
        "champName": "https://schema.org/name",
        "hp": "https://schema.org/characterAttribute",
        "armor": "https://schema.org/characterAttribute",
        "magicResist": "https://schema.org/characterAttribute",
        "attackRange": "https://schema.org/characterAttribute",
        "attackDamage": "https://schema.org/characterAttribute",
        "attackSpeed": "https://schema.org/characterAttribute",
      }
    }
    let champ = Object.assign(champs.rows[0], context);

    let status = '200';
    let wrapper = {
        status:status,
        message:"Successful operation",
        response:champ
    };
      

    return {
      status: status,
      data: wrapper
    };  
  },

  /**
  * Updates an existing champion in the collection

  * @param options.champion.armor required
  * @param options.champion.attackdamage required
  * @param options.champion.attackrange required
  * @param options.champion.attackspeed required
  * @param options.champion.champid required
  * @param options.champion.champname required
  * @param options.champion.hp required
  * @param options.champion.lore required
  * @param options.champion.magicresist required
  * @param options.champion.title required

  */
  updateChampion: async (options) => {

    // Implement your business logic here...
    //
    // Return all 2xx and 4xx as follows:
    //
    // return {
    //   status: 'statusCode',
    //   data: 'response'
    // }

    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500

    let sendInvalidInput = function(){  
      let status = '405';
      let wrapper = {
        status:status,
        message:"Invalid input",
        response:null
    };
    
    return {
      status: status,
      data: wrapper
    };  
    
    }


    if(options.champion.champid == null || !Number.isInteger(parseInt(options.champion.champid))) {return(sendInvalidInput());}

    let champs = await pool.query("SELECT champid,champName FROM champions WHERE champid = $1", [parseInt(options.champion.champid)]);
    if(champs.rows.length == 0) {
      let status = '404';
      let wrapper = {
        status:status,
        message:"Champion not found",
        response:null
    };

    return {
      status: status,
      data: wrapper
    };  

    }

    let sql = "UPDATE champions SET  ";

    if(options.champion.armor != null) if(Number.isInteger(parseInt(options.champion.armor))) sql += "armor =" + parseInt(options.champion.armor) + ", ";  else return(sendInvalidInput());
    
    if(options.champion.attackdamage != null) if(Number.isInteger(parseInt(options.champion.attackdamage))) sql += "attackdamage =" + parseInt(options.champion.attackdamage) + ", "; else return(sendInvalidInput());

    if(options.champion.attackrange != null) if(Number.isInteger(parseInt(options.champion.attackrange))) sql += "attackrange =" + parseInt(options.champion.attackrange) + ", "; else return(sendInvalidInput());

    if(options.champion.hp != null) if(Number.isInteger(parseInt(options.champion.hp))) sql += "hp =" + parseInt(options.champion.hp) + ", "; else return(sendInvalidInput());

    if(options.champion.magicresist != null) if(Number.isInteger(parseInt(options.champion.magicresist))) sql += "magicresist =" + parseInt(options.champion.magicresist) + ", "; else return(sendInvalidInput());

    if(options.champion.attackspeed != null) if(!Number.isNaN(parseFloat(options.champion.attackspeed))) sql += "attackspeed =" + parseFloat(options.champion.attackspeed) + ", "; else return(sendInvalidInput());

    if(options.champion.champname != null) sql += "champname ='" + options.champion.champname + "', ";

    if(options.champion.lore != null) sql += "lore ='" + options.champion.lore + "', ";

    if(options.champion.title != null) sql += "title ='" + options.champion.title + "', ";

    sql = sql.slice(0, -2);

    sql += " WHERE champid = " + parseInt(options.champion.champid);

    await pool.query(sql);

    let status = '200';
    let wrapper = {
        status:status,
        message:"Successful operation",
        response:null
    };
      

    return {
      status: status,
      data: wrapper
    };   
  },

  /**
  * Returns a single collection resource
  * @param options.champId ID of champion to return 

  */
  getChampion: async (options) => {

    // Implement your business logic here...
    //
    // Return all 2xx and 4xx as follows:
    //
    // return {
    //   status: 'statusCode',
    //   data: 'response'
    // }

    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500

    if(!Number.isInteger(parseInt(options.champId))){

      let status = '400';
      let wrapper = {
        status:status,
        message:"Invalid ID supplied",
        response:null
    };
    
    return {
      status: status,
      data: wrapper
    };  

    }

    let champs = await pool.query("SELECT champid,champName,title,lore,hp,armor,magicResist,attackRange,attackDamage,attackSpeed FROM champions WHERE champid = $1 ORDER BY champid", [parseInt(options.champId)]);

    if(champs.rows.length == 0) {
      let status = '404';
      let wrapper = {
        status:status,
        message:"Champion not found",
        response:null
    };
    
    return {
      status: status,
      data: wrapper
    };  
    }

    let context = {
      "@context" : {
        "champName": "https://schema.org/name",
        "hp": "https://schema.org/characterAttribute",
        "armor": "https://schema.org/characterAttribute",
        "magicResist": "https://schema.org/characterAttribute",
        "attackRange": "https://schema.org/characterAttribute",
        "attackDamage": "https://schema.org/characterAttribute",
        "attackSpeed": "https://schema.org/characterAttribute",
      }
    }
    let champ = Object.assign(champs.rows[0], context);

    let status = '200';
    let wrapper = {
        status:status,
        message:"Successful operation",
        response:champ
    };
      

    return {
      status: status,
      data: wrapper
    };  
  },

  /**
  * Deletes a single collection resource
  * @param options.champId ID of champion to delete 

  */
  deleteChampion: async (options) => {

    // Implement your business logic here...
    //
    // Return all 2xx and 4xx as follows:
    //
    // return {
    //   status: 'statusCode',
    //   data: 'response'
    // }

    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500

    if(!Number.isInteger(parseInt(options.champId))){

      let status = '400';
      let wrapper = {
        status:status,
        message:"Invalid ID supplied",
        response:null
    };
    
    return {
      status: status,
      data: wrapper
    };  

    }

    let champs = await pool.query("SELECT champid,champName,title,lore,hp,armor,magicResist,attackRange,attackDamage,attackSpeed FROM champions WHERE champid = $1 ORDER BY champid", [parseInt(options.champId)]);

    if(champs.rows.length == 0) {
      let status = '404';
      let wrapper = {
        status:status,
        message:"Champion not found",
        response:null
    };
    
    return {
      status: status,
      data: wrapper
    };  
    }

    await pool.query("DELETE FROM champions WHERE champid = $1", [parseInt(options.champId)]);

    let status = '200';
    let wrapper = {
        status:status,
        message:"Successful operation",
        response:null
    };
      


    return {
      status: status,
      data: wrapper
    };  
  },

  /**
  * Returns a single collection resource
  * @param options.champId ID of champion to return 

  */
  getAbilities: async (options) => {

    // Implement your business logic here...
    //
    // Return all 2xx and 4xx as follows:
    //
    // return {
    //   status: 'statusCode',
    //   data: 'response'
    // }

    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500
    if(!Number.isInteger(parseInt(options.champId))){

      let status = '400';
      let wrapper = {
        status:status,
        message:"Invalid ID supplied",
        response:null
    };

    return {
      status: status,
      data: wrapper
    };  

    }

    let champs = await pool.query("SELECT abilityid,abilityname,description FROM abilities WHERE champid = $1 ORDER BY abilityid", [parseInt(options.champId)]);

    if(champs.rows[0] == null) {
      let status = '404';
      let wrapper = {
        status:status,
        message:"Abilities not found",
        response:null
    };

    return {
      status: status,
      data: wrapper
    };  
    }


    let status = '200';
    let wrapper = {
        status:status,
        message:"Successful operation",
        response:champs.rows
    };

    return {
      status: status,
      data: wrapper
    };  
  },

  /**
  * Adds a new ability to the collection
  * @param options.champId ID of champion to return 
  * @param options.ability.abilityname
  * @param options.ability.description

  */
  addAbility: async (options) => {

    // Implement your business logic here...
    //
    // Return all 2xx and 4xx as follows:
    //
    // return {
    //   status: 'statusCode',
    //   data: 'response'
    // }

    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500

    if(!Number.isInteger(parseInt(options.champId))){

      let status = '400';
      let wrapper = {
        status:status,
        message:"Invalid ID supplied",
        response:null
    };
    
    return {
      status: status,
      data: wrapper
    };  

    }



    

    

    let champs = await pool.query("SELECT champid,champName FROM champions WHERE champid = $1", [parseInt(options.champId)]);
    if(champs.rows.length == 0) {
      let status = '404';
      let wrapper = {
        status:status,
        message:"Champion not found",
        response:null
    };
    return {
      status: status,
      data: wrapper
    }; 


  }
  champs = await pool.query("SELECT abilityid,abilityname,description FROM abilities WHERE champid = $1 ORDER BY abilityid", [parseInt(options.champId)]);


    if(champs.rows.length >= 4 || options.ability.abilityname == null || options.ability.description == null) {
      let status = '405';
      let wrapper = {
        status:status,
        message:"Invalid input",
        response:null
    };
    return {
      status: status,
      data: wrapper
    }; 
    }

    let id = await pool.query("INSERT INTO abilities(abilityid, abilityname, description, champid) VALUES($1,$2,$3,$4) RETURNING abilityid", 
    [options.ability.abilityname, options.ability.abilityname, options.ability.description, options.champId]);

    champs = await pool.query("SELECT * FROM abilities WHERE champid = $1 AND abilityid = $2", [parseInt(options.champId), id.rows[0].abilityid]);

    let status = '200';
    let wrapper = {
        status:status,
        message:"Successful operation",
        response:champs.rows[0]
    };

    return {
      status: status,
      data: wrapper
    };  
  },

  /**
  * Updates an existing ability in the collection
  * @param options.champId ID of champion to return 
  * @param options.ability.abilityid
  * @param options.ability.abilityname
  * @param options.ability.description

  */
  updateAbility: async (options) => {

    // Implement your business logic here...
    //
    // Return all 2xx and 4xx as follows:
    //
    // return {
    //   status: 'statusCode',
    //   data: 'response'
    // }

    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500

    if(!Number.isInteger(parseInt(options.champId))){

      let status = '400';
      let wrapper = {
        status:status,
        message:"Invalid ID supplied",
        response:null
    };

    return {
      status: status,
      data: wrapper
    };  

    } 
    let champs = await pool.query("SELECT abilityid,abilityname,description FROM abilities WHERE champid = $1 AND abilityid = $2 ORDER BY abilityid", [parseInt(options.champId), options.ability.abilityid]);

    if(champs.rows.length == 0) {
      let status = '404';
      let wrapper = {
        status:status,
        message:"Ability not found",
        response:null
    };

    return {
      status: status,
      data: wrapper
    };  
    }

    let sql = "UPDATE abilities SET  ";

    if(options.ability.abilityname != null) sql += "abilityname ='" + options.ability.abilityname + "', " + "abilityid ='" + options.ability.abilityname + "', ";

    if(options.ability.description != null) sql += "description ='" + options.ability.description + "', ";

    sql = sql.slice(0, -2);

    sql += " WHERE abilityid = '" + options.ability.abilityid + "'";

    await pool.query(sql);

    let status = '200';
    let wrapper = {
        status:status,
        message:"Successful operation",
        response:null
    };

    return {
      status: status,
      data: wrapper
    };  
  },

  /**
  * Returns a single collection resource
  * @param options.abilityId ID of ability to return   * @param options.champId ID of champion to return 

  */
  getAbility: async (options) => {

    // Implement your business logic here...
    //
    // Return all 2xx and 4xx as follows:
    //
    // return {
    //   status: 'statusCode',
    //   data: 'response'
    // }

    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500

    if(!Number.isInteger(parseInt(options.champId))){

      let status = '400';
      let wrapper = {
        status:status,
        message:"Invalid ID supplied",
        response:null
    };

    return {
      status: status,
      data: wrapper
    };  

    } 
    let champs = await pool.query("SELECT abilityid,abilityname,description FROM abilities WHERE champid = $1 AND abilityid = $2 ORDER BY abilityid", [parseInt(options.champId), options.abilityId]);

    if(champs.rows.length == 0) {
      let status = '404';
      let wrapper = {
        status:status,
        message:"Ability not found",
        response:null
    };

    return {
      status: status,
      data: wrapper
    };  
    }


    let status = '200';
    let wrapper = {
        status:status,
        message:"Successful operation",
        response:champs.rows[0]
    };

    return {
      status: status,
      data: wrapper
    };  
  },

  /**
  * Deletes a single collection resource
  * @param options.abilityId ID of ability to delete   * @param options.champId ID of champion to delete 

  */
  deleteAbility: async (options) => {

    // Implement your business logic here...
    //
    // Return all 2xx and 4xx as follows:
    //
    // return {
    //   status: 'statusCode',
    //   data: 'response'
    // }

    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500
    if(!Number.isInteger(parseInt(options.champId))){

      let status = '400';
      let wrapper = {
        status:status,
        message:"Invalid ID supplied",
        response:null
    };
    
    return {
      status: status,
      data: wrapper
    };  

    }

    let champs = await pool.query("SELECT abilityid,abilityname,description FROM abilities WHERE champid = $1 AND abilityid = $2 ORDER BY abilityid", [parseInt(options.champId), options.abilityId]);

    if(champs.rows.length == 0) {
      let status = '404';
      let wrapper = {
        status:status,
        message:"Ability not found",
        response:null
    };
    
    return {
      status: status,
      data: wrapper
    };  
    }

    await pool.query("DELETE FROM abilities WHERE abilityid = $1", [options.abilityId]);

    let status = '200';
    let wrapper = {
        status:status,
        message:"Successful operation",
        response:null
    };
      


    return {
      status: status,
      data: wrapper
    };   
  },

  /**
  * Returns a single collection resource
  * @param options.champId ID of champion to return 

  */
  getChampionStats: async (options) => {

    // Implement your business logic here...
    //
    // Return all 2xx and 4xx as follows:
    //
    // return {
    //   status: 'statusCode',
    //   data: 'response'
    // }

    // If an error happens during your business logic implementation,
    // you can throw it as follows:
    //
    // throw new Error('<Error message>'); // this will result in a 500

    if(!Number.isInteger(parseInt(options.champId))){

      let status = '400';
      let wrapper = {
        status:status,
        message:"Invalid ID supplied",
        response:null
    };
    
    return {
      status: status,
      data: wrapper
    };  

    }

    let champs = await pool.query("SELECT champName,hp,armor,magicResist,attackRange,attackDamage,attackSpeed FROM champions WHERE champid = $1 ORDER BY champid", [parseInt(options.champId)]);

    if(champs.rows.length == 0) {
      let status = '404';
      let wrapper = {
        status:status,
        message:"Champion not found",
        response:null
    };
    
    return {
      status: status,
      data: wrapper
    };  
    }


    let status = '200';
    let wrapper = {
        status:status,
        message:"Successful operation",
        response:champs.rows[0]
    };
      

    return {
      status: status,
      data: wrapper
    };  
  },
};
