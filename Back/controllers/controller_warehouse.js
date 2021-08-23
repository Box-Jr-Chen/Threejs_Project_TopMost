const db = require('../models/index');
const warehouse = db['warehouse'];


async function list(req, res) { 

    return await
    warehouse
      .findAll()
      .then((warehouses) => res.status(200).send(warehouses))
      .catch((error) => { res.status(400).send(error); })}
  
  
  
  async function add(req, res) { 
      console.log(req.body);

      return await res.json(
        {
          'result':'none'
        }
      )
         var title = req.body.title;
         var borders = req.body.borders;
        return await
        warehouse
          .create({
            title:title,
            borders:borders,
          })
          .then((warehouses) => res.status(200).send(
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
    var borders = req.body.borders;
  
  
    return await
    warehouse
    .update({
        title:title,
       borders:borders,
    },{where:{id:id}})
    .then((warehouses) => res.status(200).send(warehouses))
    .catch((error) => { res.status(400).send(error); })}
  

  async function deleted(req, res){
    var p_id = req.query.id;
      return await
      warehouse
      .destroy({
        where: {
          id: p_id
         }})
      .then((warehouses) => res.status(200).send(p_id))
      .catch((error) => { res.status(400).send(error); })}
  
module.exports = { list,add,update,deleted};