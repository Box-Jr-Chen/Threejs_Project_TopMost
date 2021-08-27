const db = require('../models/index');
const pallets = db['pallets'];
const setting_system = db['setting_system'];


async function list(req, res) { 

    var id_Warehouse = req.query.id;

    var setting_interval = await  setting_system.findOne({
        attributes: ['sort_amount']
    });
    var sort_amount = setting_interval.sort_amount;
    if(sort_amount <=0)
    {
        result_error.cause ="sort_amount less 0";
        return res_reuslt.send(result_error);
    }

   const parsed_id = parseInt(id_Warehouse);
    if (isNaN(parsed_id)|| parsed_id<1) { res.status(404).send({"error":"id is wrong"}) }

    return await
    pallets
      .findAll({ offset: (id_Warehouse-1)*sort_amount, limit: sort_amount })
      .then((areas) => res.status(200).send(areas))
      .catch((error) => { res.status(400).send(error); })}
  

  
async function add(req, res) { 
         var id_warehouse = req.body.id_warehouse;
         var id_areas = 0;
         var id_pallet = req.body.id_pallet;
         var id_project = req.body.id_project;
         var pos="";
         var layout=0;
         var remove=0;


         const parsed_id = parseInt(id_warehouse);
         if (isNaN(parsed_id)|| parsed_id<1) { res.status(404).send({"error":"id is wrong"}) }
         const parsed_pallet = parseInt(id_pallet);
         if (isNaN(parsed_pallet)|| parsed_pallet<1) { res.status(404).send({"error":"pallet is wrong"}) }
         const parsed_project = parseInt(id_project);
         if (isNaN(parsed_project)|| parsed_project<1) { res.status(404).send({"error":"project is wrong"}) }

        return await
        pallets
          .create({
            id_warehouse:parsed_id,
            id_areas:id_areas,
            id_pallet:parsed_pallet,
            id_project:parsed_project,
            pos :pos,
            layout :layout,
            remove:remove
          })
          .then((pallets) => res.status(200).send(
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
        var id_warehouse = req.body.id_warehouse;
         var id_areas = req.body.id_areas;
         var id_pallet = req.body.id_pallet;
         var id_project = req.body.id_project;
         var pos=req.body.pos;
         var layout=req.body.layout;
         var remove=req.body.remove;


         const parsed_id = parseInt(id_warehouse);
         if (isNaN(parsed_id)|| parsed_id<1) { res.status(404).send({"error":"id is wrong"}) }
         const parsed_pallet = parseInt(id_pallet);
         if (isNaN(parsed_pallet)|| parsed_pallet<1) { res.status(404).send({"error":"pallet is wrong"}) }
         const parsed_project = parseInt(id_project);
         if (isNaN(parsed_project)|| parsed_project<1) { res.status(404).send({"error":"project is wrong"}) }
         const parsed_areas = parseInt(id_areas);
         if (isNaN(parsed_areas)|| parsed_areas<1) { res.status(404).send({"error":"areas is wrong"}) }
         if (isNaN(pos)) { pos="";}
         const parsed_layout = parseInt(layout);
         if (isNaN(parsed_layout)|| parsed_layout<0) { res.status(404).send({"error":"layout is wrong"}) }
         const parsed_remove = parseInt(remove);
         if (isNaN(parsed_remove)|| parsed_remove<0) { res.status(404).send({"error":"remove is wrong"}) }

         
    return await
    pallets
    .update({
        id_warehouse:parsed_id,
        id_areas:parsed_areas,
        id_pallet:parsed_pallet,
        id_project:parsed_project,
        pos :pos,
        layout :parsed_layout,
        remove:parsed_remove,
    })
    .then((pallets) => res.status(200).send({'result':'success'}))
    .catch((error) => { res.status(400).send(error); })}
  

  async function deleted(req, res){
    var p_id = req.query.id;
      return await
      pallets
      .destroy({
        where: {
          id: p_id
         }})
      .then((area) => res.status(200).send(p_id))
      .catch((error) => { res.status(400).send(error); })}
  
module.exports = { list,add,update,deleted};