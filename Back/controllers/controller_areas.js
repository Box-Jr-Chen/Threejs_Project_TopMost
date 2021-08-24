const db = require('../models/index');
const area = db['area'];
const warehouse = db['warehouse'];

async function list(req, res) { 
    
    var id_Wavehouse = req.query.id;

    const parsed_id = parseInt(id_Wavehouse);
    if (isNaN(parsed_id)|| parsed_id<1) { res.status(404).send({"error":"id is wrong"}) }

    return await
    area
      .findAll({
          attributes: ['id', 'id_wavehouse','title', 'borders','data_rect_position','data_rect'],
          where: {id_wavehouse: parsed_id},
          include: [
            {
              model: warehouse,
              attributes: ['title'],
              required:false,
            }],
            })
      .then((areas) => res.status(200).send(areas))
      .catch((error) => { res.status(400).send(error); })}
  

  
async function add(req, res) { 
         var id_wavehouse = req.body.id_wavehouse;
         var title = req.body.title;
         var borders = req.body.borders;
        return await
        area
          .create({
            id_wavehouse:id_wavehouse,
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
    var title = req.body.title;
    var borders = req.body.borders;
    var data_rect_position = req.body.data_rect_position;
    var data_rect = req.body.data_rect;
    return await
    area
    .update({
       title:title,
       borders:borders,
       data_rect_position:data_rect_position,
       data_rect:data_rect,
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
  
module.exports = { list,add,update,deleted};