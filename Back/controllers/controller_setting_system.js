const db = require('../models/index');
const setting_system = db['setting_system'];

async function FindInterval(req, res) { 
    
    return await
    setting_system
      .findOne({
          attributes: ['interval']
            })
      .then((interval) => res.status(200).send(interval))
      .catch((error) => { res.status(400).send(error); })}

async function FindSortAmount(req, res) { 
    
    return await
    setting_system
      .findOne({
          attributes: ['sort_amount']
            })
      .then((sort_amount) => res.status(200).send(sort_amount))
      .catch((error) => { res.status(400).send(error); })}

module.exports = { FindInterval,FindSortAmount};