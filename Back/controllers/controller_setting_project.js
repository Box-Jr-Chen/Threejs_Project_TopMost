const db = require('../models/index');
const setting_project = db['setting_project'];

async function list(req, res) { 
    return await
    setting_project
      .findAll({order: [['id']]})
      .then((setting_project) => res.status(200).send(setting_project))
      .catch((error) => { res.status(400).send(error); })}
  
  
async function add(req, res) { 

  var id = await setting_project.count();

  if(id <10)
      id = '0'+(id+1);
  else
      id = (id+1);





  var title = '貨物'+id;
  var img  = "";
  var width = req.body.width;
  var length = req.body.length;
  var height = req.body.height;


    if(isNaN(width) || width<=0)
    {
      res.status(200).send(
        res.json(
            {
              'result':'error',
              'msg':'width error'
            }
          ));
    }
    if(isNaN(length) || length<=0)
    {
      res.status(200).send(
        res.json(
            {
              'result':'error',
              'msg':'length error'
            }
          ));
    }
    if(isNaN(height) || height<=0)
    {
      res.status(200).send(
        res.json(
            {
              'result':'error',
              'msg':'height error'
            }
          ));
    }

        return await
        setting_project
          .create({
            title:title,
            img:img,
            width :width,
            length :length,
            height:height
          })
          .then((setting_project) => res.status(200).send(
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
  
  
      if(isNaN(width) || width<=0)
      {
        res.status(200).send(
          res.json(
              {
                'result':'error',
                'msg':'width error'
              }
            ));
      }
      if(isNaN(length) || length<=0)
      {
        res.status(200).send(
          res.json(
              {
                'result':'error',
                'msg':'length error'
              }
            ));
      }
      if(isNaN(height) || height<=0)
      {
        res.status(200).send(
          res.json(
              {
                'result':'error',
                'msg':'height error'
              }
            ));
      }


    return await
    setting_project
    .update({
        title:title,
        img:img,
        width :width,
        length :length,
        height:height
    },{where:{id:id}})
    .then((setting_project) => res.status(200).send({'result':'success'}))
    .catch((error) => { res.status(400).send(error); })}
  

async function deleted(req, res){
    var p_id = req.query.id;
      return await
      setting_project
      .destroy({
        where: {
          id: p_id
         }})
      .then((setting_project) => res.status(200).send(p_id))
      .catch((error) => { res.status(400).send(error); })}
  

module.exports = { list,add,update,deleted};