const express = require('express');
const champions = require('../services/champions');
const router = new express.Router();

router.get('/', async (req, res, next) => {
  let options = { 
  };


  try {
    const result = await champions.getChampions(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    return res.status(500).send({
      status:500,
      message:"Internal server error",
      response:null
    });
  }
});
 
router.post('/', async (req, res, next) => {
  let options = { 
  };

  options.champion = req.body;

  try {
    const result = await champions.addChampion(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    return res.status(500).send({
      status:500,
      message:"Internal server error",
      response:null
    });
  }
});
 
router.put('/', async (req, res, next) => {
  let options = { 
  };

  options.champion = req.body;

  try {
    const result = await champions.updateChampion(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    return res.status(500).send({
      status:500,
      message:"Internal server error",
      response:null
    });
  }
});
 
router.get('/:champId', async (req, res, next) => {
  let options = { 
    "champId": req.params.champId,
  };


  try {
    const result = await champions.getChampion(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    return res.status(500).send({
      status:500,
      message:"Internal server error",
      response:null
    });
  }
});
 
router.delete('/:champId', async (req, res, next) => {
  let options = { 
    "champId": req.params.champId,
  };


  try {
    const result = await champions.deleteChampion(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    return res.status(500).send({
      status:500,
      message:"Internal server error",
      response:null
    });
  }
});
 
router.get('/:champId/abilities', async (req, res, next) => {
  let options = { 
    "champId": req.params.champId,
  };


  try {
    const result = await champions.getAbilities(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    return res.status(500).send({
      status:500,
      message:"Internal server error",
      response:null
    });
  }
});
 
router.post('/:champId/abilities', async (req, res, next) => {
  let options = { 
    "champId": req.params.champId,
  };

  options.ability = req.body;

  try {
    const result = await champions.addAbility(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    return res.status(500).send({
      status:500,
      message:"Internal server error",
      response:null
    });
  }
});
 
router.put('/:champId/abilities', async (req, res, next) => {
  let options = { 
    "champId": req.params.champId,
  };

  options.ability = req.body;

  try {
    const result = await champions.updateAbility(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    return res.status(500).send({
      status:500,
      message:"Internal server error",
      response:null
    });
  }
});
 
router.get('/:champId/abilities/:abilityId', async (req, res, next) => {
  let options = { 
    "abilityId": req.params.abilityId,
    "champId": req.params.champId,
  };


  try {
    const result = await champions.getAbility(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    return res.status(500).send({
      status:500,
      message:"Internal server error",
      response:null
    });
  }
});
 
router.delete('/:champId/abilities/:abilityId', async (req, res, next) => {
  let options = { 
    "abilityId": req.params.abilityId,
    "champId": req.params.champId,
  };


  try {
    const result = await champions.deleteAbility(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    return res.status(500).send({
      status:500,
      message:"Internal server error",
      response:null
    });
  }
});
 
router.get('/:champId/stats', async (req, res, next) => {
  let options = { 
    "champId": req.params.champId,
  };


  try {
    const result = await champions.getChampionStats(options);
    res.status(result.status || 200).send(result.data);
  }
  catch (err) {
    return res.status(500).send({
      status:500,
      message:"Internal server error",
      response:null
    });
  }
});

module.exports = router;