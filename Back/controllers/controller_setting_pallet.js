const db = require('../models/index');
const setting_pallet = db['setting_pallet'];

async function list(req, res) { 
    return await
    setting_pallet
      .findAll()
      .then((setting_pallets) => res.status(200).send(setting_pallets))
      .catch((error) => { res.status(400).send(error); })}
  
  
async function add(req, res) { 

         var title = req.body.title;
         var img  = "";
         var width = req.body.width;
         var length = req.body.length;
         var height = req.body.height;
        return await
        setting_pallet
          .create({
            title:title,
            img:img,
            width :width,
            length :length,
            height:height
          })
          .then((setting_pallet) => res.status(200).send(
                res.json(
                    {
                      'result':'success'
                    }
                  )
              )
            )
          .catch((error) => { res.status(400).send(
                res.json(
                  {
                    'result':error
                  }
                )
); })}


async function update(req, res){
    var id = req.body.id;
    var title = req.body.title;
    var img  = "";
    var width = req.body.width;
    var length = req.body.length;
    var height = req.body.height;

    return await
    setting_pallet
    .update({
        title:title,
        img:img,
        width :width,
        length :length,
        height:height
    },{where:{id:id}})
    .then((setting_pallet) => res.status(200).send({'result':'success'}))
    .catch((error) => { res.status(400).send(error); })}
  

async function deleted(req, res){
    var p_id = req.query.id;
      return await
      setting_pallet
      .destroy({
        where: {
          id: p_id
         }})
      .then((setting_pallet) => res.status(200).send(p_id))
      .catch((error) => { res.status(400).send(error); })}
  

module.exports = { list,add,update,deleted};