const db = require('../models/index');
const setting_area_interval = db['setting_area_interval'];

async function FindInterval(req, res) { 
    
    return await
    setting_area_interval
      .findOne({
          attributes: ['interval']
            })
      .then((interval) => res.status(200).send(interval))
      .catch((error) => { res.status(400).send(error); })}
  
module.exports = { FindInterval};