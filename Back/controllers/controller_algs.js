const db = require('../models/index');
const warehouse = db['warehouse'];
const area = db['area'];
const setting_area_interval = db['setting_area_interval'];
const setting_pallet = db['setting_pallet'];
const setting_project = db['setting_project'];
const pallets = db['pallets'];

///貨物排列演算法
async function Sorting_prject(req, res) { 

    var res_reuslt = res.status(202)
    var  result_error=
        {
            'result':'error',
            'cause':''
        };


    if(req.body.id_warehouse ===undefined || req.body.id_warehouse ===null ||req.body.id_warehouse ==="")
    {
        result_error.cause ='no id_warehouse';
        return res_reuslt.send(result_error);
    }

    var id_warehouse = req.body.id_warehouse;

   if (!Number.isInteger(id_warehouse))
    {
        result_error.cause ='not integer';
        return res_reuslt.send(result_error);
    }

    //判斷是否有倉庫
   var warehouses = await  warehouse.findOne({
          attributes: ['id'],
          where: {id: id_warehouse}
        });

    if(warehouses === null)
    {
        result_error.cause ='no warehouse';
        return res_reuslt.send(result_error);
    }
  
    
    //判斷是否有區域
    var areas = await  area.findAll({
        attributes: ['id','width','length'],
        where: {id_warehouse: id_warehouse}
      });

    
    if(areas.length <=0)
    {
        result_error.cause ='no areas';
        return res_reuslt.send(result_error);
    }


        var indexs=[];
        areas.forEach(function(area,index) {

            if(area.width ===0 || area.length===0)
            {
                indexs.push(area.id);
            }
        });

        //刪除不能判斷的矩陣
        indexs.forEach(index =>{
            if (index > -1) {
                
                const found = areas.findIndex(area => area.id === index);

                if(found>=0)
                {
                    areas.splice(found,1);
                }
            }
        });


    if(areas.length <=0)
    {
        result_error.cause ='no areas';
        return res_reuslt.send(result_error);
    }

    //判斷是否有設定intervals
    var setting_interval = await  setting_area_interval.findOne({
        attributes: ['interval']
    });
    var interval = setting_interval.interval;


    if(interval <=0)
    {
        result_error.cause =interval;
        return res_reuslt.send(result_error);
    }


    //判斷是否有設定棧板
    var setting_pallets = await  setting_pallet.findAll({
        attributes: ['id','width','length']
      });

      if(setting_pallets.length <=0)
      {
          result_error.cause ='no setting_pallets';
          return res_reuslt.send(result_error);
      }

    //判斷是否有設定貨物
    var setting_projects = await  setting_project.findAll({
        attributes: ['id']
      });

      if(setting_projects.length <=0)
      {
          result_error.cause ='no setting_projects';
          return res_reuslt.send(result_error);
      }



    //判斷是否有貨物棧板需要排列
    var palletss = await  pallets.findAll({
        attributes: ['id','id_areas','id_pallet','id_project'],
        where: {
            id_warehouse: id_warehouse,
            id_areas:0,
            remove:0,
            layout:0
        }
      });

      if(palletss.length <=0)
      {
          result_error.cause ='no pallets need sort';
          return res_reuslt.send(result_error);
      }


      //開始排列
      for(var i=0;i<palletss.length;i++){

            var start_sort = false;

           //從區域陣列開始找
            for(var j=0;j<areas.length;j++){




                //生成area 空間矩陣
                var array_area = [];
                for(var x=0;x<area.width;x++)
                {
                    var  arr_area_y =[];
                    for(var y=0;y<area.length;y++)
                    {
                        arr_area_y.push(0);
                    }
                    array_area.push(arr_area_y);
                }



                //判斷是否有貨物在區域內
                var pallets_inarea = await  pallets.findAll({
                    attributes: ['id','id_areas','id_pallet','id_project','pos','layout'],
                    where: {
                        id_warehouse: id_warehouse,
                        id_areas:areas[j].id,
                        remove:0,
                    }
                  });


                    if(pallets_inarea !== null ||pallets_inarea.length >0)
                    {
                        //將現有的貨物排列上去
                        pallets_inarea.forEach(pallet_area =>{
                                var pos = JSON.parse(pallet_area.pos);
                                pos.forEach(cell=>{
                                    if(cell[0] >=0 && cell[1] >=0 )
                                    {
                                        if(array_area[cell[0]][cell[1]] <=0)
                                             array_area[cell[0]][cell[1]] =1;
                                        else
                                             array_area[cell[0]][cell[1]] ++; 
                                    }
                                });
                        });
                    }


                if(pallets_inarea.length >0)
                {
                    //判斷區域內貨物大部分是否跟自己相同
                    var same_pallet  =0;
                    var other_pallet =0;
                    pallets_inarea.forEach(pallet_check=>{
                        if(pallet_check.id_pallet ==palletss[i].id_pallet)
                        {
                            if(pallet_check.id_project ==palletss[i].id_project)
                            {
                                same_pallet++;
                            }
                            else
                            {
                                other_pallet++;
                            }
                        }
                        else
                        {
                            other_pallet++;
                        }
                    });

                    if(same_pallet >=other_pallet)
                    {
                        //TODO 檢查空間 
                        var result = await SpaceinArea(array_area,palletss[i],interval);
                        
                            //排列
                            start_sort = true;
                        

                          
                    }
                    
                }
                else
                {
                    var result = await SpaceinArea(array_area,palletss[i],interval);
                        
                    return res.status(200).send(result);
                    // //檢查空間
                    // if(Check_SpaceinArea(areas[j],palletss[i]))
                    // {
                    //     //開始排列
                    //     start_sort = true;
                    // }
                }

             };

             //檢查完還是沒排列的情況
             if(start_sort ===false)
             {
                //重新檢查各區域是否還有空間擺放
                for(var j=0;j<areas.length;j++){
                    //TODO 檢查空間
                    var result = await SpaceinArea(array_area,palletss[i],interval);
                        //開始排列
                        start_sort = true;
                }



                //完全排列失敗
                if(start_sort ===false)
                {
                    
                }

             }
             


             //return res_reuslt.send(pallets_inarea);

      };


      return res_reuslt.send(areas);




    return    res.status(200).send(warehouses);

}

//排列貨物 並檢查空間是否可以排列貨物(包括陣列內是否有空間與貨物大小是否符合空間)
async function SpaceinArea(array_area,project,interal) {

    var pallet = setting_pallet.findOne({
        attributes: ['width','length'],
        where: {id: project.id_pallet}
      });


      if(pallet !==null )
      {
        var width = parseInt((pallet.width/100) / interal);

        console.log(pallet['width']);
        if(((pallet.width/100) % interal) > 0)
        {
            width++;
        }

        var height = parseInt((pallet.height/100) / interal);
        console.log(pallet['width']);
        if(((pallet.height/100) % interal) > 0)
        {
            height++;
        }
      }


      return pallet['width'];
    return    width+";"+height;

}
  
module.exports = { Sorting_prject};