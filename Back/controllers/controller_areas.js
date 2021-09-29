const db = require('../models/index');
const area = db['area'];
const warehouse = db['warehouse'];

async function list(req, res) { 
    
    var id_Warehouse = req.query.id;

    const parsed_id = parseInt(id_Warehouse);
    if (isNaN(parsed_id)|| parsed_id<1) { res.status(404).send({"error":"id is wrong"}) }

    return await
    area
      .findAll({
          attributes: ['id', 'id_warehouse','title', 'borders','width','length','pos_init','interval'],
          where: {id_warehouse: parsed_id},
          include: [
            {
              model: warehouse,
              attributes: ['title'],
              required:false,
            }],
            })
      .then((areas) => res.status(200).send(areas))
      .catch((error) => { res.status(400).send(error); })}

async function getPosInit(req, res){

  const parsed_id = parseInt(req.query.id);

  if (isNaN(parsed_id)|| parsed_id<1) { res.status(404).send({"error":"id is wrong"}) }

  return await
  area
    .findAll({
        attributes: ['pos_init'],
        where: {id: parsed_id},
          })
    .then((areas) => res.status(200).send(areas))
    .catch((error) => { res.status(400).send(error); })}


async function add(req, res) { 
         var id_warehouse = req.body.id_warehouse;
         var title = req.body.title;
         var borders = req.body.borders;
        return await
        area
          .create({
            id_warehouse:id_warehouse,
            title:title,
            borders:borders,
            data_rect_position :null,
            data_rect :null
          })
          .then((area) => res.status(200).send(
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
    var id_warehouse = req.body.id_warehouse;
    var title = req.body.title;
    var borders = req.body.borders;
    var width = req.body.width;
    var length = req.body.length;
    var pos_init = req.body.pos_init;
    var  interval= req.body.interval;

    return await
    area
    .update({
      id_warehouse:id_warehouse,
       title:title,
       borders:borders,
       width:width,
       length:length,
       pos_init:pos_init,
       interval:interval
    },{where:{id:id}})
    .then((area) => res.status(200).send({'result':'success'}))
    .catch((error) => { res.status(400).send(error); })}

async function deleted(req, res){
  var p_id = req.query.id;
    return await
    area
    .destroy({
      where: {
        id: p_id
        }})
    .then((area) => res.status(200).send(p_id))
    .catch((error) => { res.status(400).send(error); })}




module.exports = { list,getPosInit,add,update,deleted};