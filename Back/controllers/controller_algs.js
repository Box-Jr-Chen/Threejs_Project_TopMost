const db = require('../models/index');
const warehouse = db['warehouse'];
const area = db['area'];
const setting_system = db['setting_system'];
const setting_pallet = db['setting_pallet'];
const setting_project = db['setting_project'];
const pallets = db['pallets'];
const { Op } = require("sequelize");

var interval =0;
var sort_amount =0;
var id_warehouse =null;
function JsonisEmpty(obj) {
    return Object.keys(obj).length === 0;
}

//#region 獲取資訊

//判斷是否有倉庫
async function getWHData(id_warehouse)
{
    var warehouses = await  warehouse.findOne({
        attributes: ['id'],
        where: {id: id_warehouse}
    });

    if(warehouses === null)
        return null;

    return warehouses;
}
//判斷是否有區域
async function getAreasData(id_warehouse)
{
    var areas = await  area.findAll({
        attributes: ['id','width','length','pos_init'],
        where: {id_warehouse: id_warehouse}
      });

    if(areas === null)
        return null;

    return areas;
}

//判斷是否有設定intervals
async function getIntervalData()
{
    var setting_interval = await  setting_system.findOne({
        attributes: ['interval']
    });

    if(setting_interval === null)
        return null;

    return setting_interval;
}

//判斷是否有設定sort_amount (排列數量)
async function getSort_AmountData()
{
   var setting_sort_amount = await  setting_system.findOne({
    attributes: ['sort_amount']
    });

    if(setting_sort_amount === null)
        return null;

    return setting_sort_amount;
}

//判斷是否有設定棧板
async function getSetting_PalletsData()
{
    var setting_pallets = await  setting_pallet.findAll({
        attributes: ['id','width','length']
      });

    if(setting_pallets === null)
        return null;

    return setting_pallets;
}

 //判斷是否有設定貨物
async function getSetting_ProjectsData()
{
    var setting_projects = await  setting_project.findAll({
        attributes: ['id']
      });

    if(setting_projects === null)
        return null;

    return setting_projects;
}

//判斷是否有貨物棧板需要排列
async function getPalletsData()
{
    var palletss = await  pallets.findAll({
        attributes: ['id','id_areas','id_pallet','id_project'],
        limit : sort_amount,
        where: {
            id_warehouse: id_warehouse,
            id_areas:0,
            remove:0,
            id_pallet:{[Op.gt]:0},
            id_project:{[Op.gt]:0}
        }
      });

    if(palletss === null)
        return null;

    return palletss;
}
//#endregion


///貨物排列演算法--平排
async function Sorting_prject(req, res) { 

    var res_reuslt = res.status(202)
    var  result_error=
        {
            'result':'error',
            'cause':''
        };
    var  result_success=
        {
            'result':'success',
            'cause':''
        };
    interval =0;
    sort_amount =0;
    if(req.body.id_warehouse ===undefined || req.body.id_warehouse ===null ||req.body.id_warehouse ==="")
    {
        result_error.cause ='no id_warehouse';
        return res_reuslt.send(result_error);
    }

    id_warehouse = req.body.id_warehouse;

   if (!Number.isInteger(id_warehouse))
    {
        result_error.cause ='not integer';
        return res_reuslt.send(result_error);
    }

    //判斷是否有倉庫
   var warehouses =   await getWHData(id_warehouse); 

    if(warehouses === null)
    {
        result_error.cause ='no warehouse';
        return res_reuslt.send(result_error);
    }
  
    
    //判斷是否有區域
    var areas = await  getAreasData(id_warehouse);
    
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
        else if(area.width=== null||area.length=== null )
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
    var setting_interval = await getIntervalData();

    interval = setting_interval.interval;
    if(interval ===null || interval <=0)
    {
        result_error.cause ="interval less 0";
        return res_reuslt.send(result_error);
    }

    //判斷是否有設定sort_amount (排列數量)
    var setting_sort_amount = await getSort_AmountData();

    sort_amount = setting_sort_amount.sort_amount;
    if(sort_amount <=0)
    {
        result_error.cause ="sort_amount less 0";
        return res_reuslt.send(result_error);
    }
    //判斷是否有設定棧板
    var setting_pallets = await  getSetting_PalletsData();

      if(setting_pallets.length <=0)
      {
          result_error.cause ='no setting_pallets';
          return res_reuslt.send(result_error);
      }

    //判斷是否有設定貨物
    var setting_projects = await  getSetting_ProjectsData();

      if(setting_projects.length <=0)
      {
          result_error.cause ='no setting_projects';
          return res_reuslt.send(result_error);
      }

    //判斷是否有貨物棧板需要排列
     var palletss = await  getPalletsData();

      if(palletss.length <=0)
      {
          result_error.cause = 'warehoue:'+id_warehouse+ ' has  no pallets_sort';
          return res_reuslt.send(result_error);
      }



    //生成3D地圖(所有的地圖放置這裡)
    var list_array_area_3d=[];
    //排列結果
    var result_sortpallet =[]
    //開始排列
    for(var i=0;i<palletss.length;i++){

            var start_sort = false;
            //結果
            var result_pallet ={
                'pallet':palletss[i].id,
                'type':palletss[i].id_pallet+'-'+ palletss[i].id_project,
                'area':0,
                'init':[-999,-999,-999],
                'layout':0,
                'pos':[]
            };
            
            var setting_pallet_id =    palletss[i].id_pallet ;
            var pallet_data       =    setting_pallets.find(element => element.id === setting_pallet_id);
     
            //判斷有沒有資料
            if(pallet_data ===null || pallet_data ===undefined)
            {
                result_error.cause ="error read pallet setting";
                return res_reuslt.send(result_error);
            }

            //人工設定棧板尺寸轉為系統尺吋
            var pallet_width =   pallet_data.width/100;
            var pallet_length =  pallet_data.length/100;


            var width  = parseInt((pallet_width) / interval);
            var height = parseInt((pallet_length) / interval);
            if((pallet_width % interval) > 0)
            {
               width++;
            }
   
            if((pallet_length % interval) > 0)
            {
               height++;
            }
            
            palletss[i]['width_rect'] = width;
            palletss[i]['height_rect'] = height;
            //---------------------------------


            for(var j=0;j<areas.length;j++){

                var array_area_3dindex  = -1;
                if(list_array_area_3d.length >0)
                     array_area_3dindex  = list_array_area_3d.findIndex(element =>element.id_area ===areas[j].id );

                if(array_area_3dindex <0)
                {
                    //生成area 空間矩陣--單層
                    var array_area_3d = [];
                    var array_area = [];
                    for(var x=0;x<areas[j].width;x++)
                    {
                        var  arr_area_y =[];
                        for(var y=0;y<areas[j].length;y++)
                        {
                            arr_area_y.push(null);
                        }
                        array_area.push(arr_area_y);
                    }
                    array_area_3d.push(array_area);

                    list_array_area_3d.push({
                        'id_area':areas[j].id,
                        'array_area_3d' :array_area_3d
                    });
                }    


                //先判斷資料表裡是否有之前的貨物已經在區域內
                var pallets_inarea = await  pallets.findAll({
                    attributes: ['id','id_areas','id_pallet','id_project','pos','layout'],
                    where: {
                        id_warehouse: id_warehouse,
                        id_areas:areas[j].id,
                        remove:0,
                    }
                  });
                

                //演算法內是否有排列的貨物
                var pallets_inarea_sort = result_sortpallet.filter(e=>{
                    if(areas[j].id === e.area)
                    {
                        return e;
                    }
                });


                //之前貨物資料中有排放到區域內先排放裡面以免演算法錯誤
                if(pallets_inarea !== null ||pallets_inarea.length >0 )
                {
                    array_area_3dindex  = list_array_area_3d.findIndex(element =>element.id_area ===areas[j].id );

                    
                    //這裡單一區域生成多層區域
                    //原本看資料庫裏面有的棧板資料生成高度，
                    //現在改為直接升成三層
                    var layout_max =2;

                    if(layout_max>0 && list_array_area_3d[array_area_3dindex].array_area_3d.length <=layout_max)
                    {

                        for(var f=0;f<layout_max;f++)
                        {
                            var array_area2 = [];
                            for(var q=0;q<list_array_area_3d[array_area_3dindex].array_area_3d[0].length;q++)
                            {
                                var onecol =[];
                                for(var q2=0;q2<list_array_area_3d[array_area_3dindex].array_area_3d[0][0].length;q2++)
                                {
                                    onecol.push(null);
                                }

                                array_area2.push(onecol);
                            }

                            list_array_area_3d[array_area_3dindex].array_area_3d.push(array_area2);
                        }
                    }

                    //將之前已經有的貨物排列上去
                    pallets_inarea.forEach(pallet_area =>{
                            var pos = JSON.parse(pallet_area.pos);
                            pos.forEach(cell=>{
                                if(cell[0] >=0 && cell[1] >=0 )
                                {
                                    //需要它的id_pallet,id_project
                                    list_array_area_3d[array_area_3dindex].array_area_3d[pallet_area.layout][cell[0]][cell[1]] ={
                                            'id':pallet_area.id,
                                            'pallet':pallet_area.id_pallet,
                                            'project':pallet_area.id_project
                                    };
                                }
                            });
                    });
                }

                //區域有東西2
                if(pallets_inarea.length >0 || pallets_inarea_sort.length >0)
                {
                    //判斷區域內貨物大部分是否跟自己相同
                    var same_pallet  =0;
                    var other_pallet =0;

                    pallets_inarea.forEach(pallet_check=>{


                        var  id_pallet  = pallet_check.id_pallet;
                        var  id_project = pallet_check.id_project;


                        if(id_pallet ==palletss[i].id_pallet)
                        {
                            if(id_project ==palletss[i].id_project)
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


                    pallets_inarea_sort.forEach(pallet_check=>{

                        var types = pallet_check.type.split('-');
                        var  id_pallet = parseInt(types[0]);
                        var  id_project = parseInt(types[1]);


                        if(id_pallet ==palletss[i].id_pallet)
                        {
                            if(id_project ==palletss[i].id_project)
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
                    //主體貨物數量是否跟貨物一致
                    //(same_pallet和 other_pallet如果都是0的話就排列此區域)
                    if(same_pallet >=other_pallet)
                    {
                        
                        //主體一致時區域排列

                        var result = await SpaceinArea( list_array_area_3d[array_area_3dindex].array_area_3d,palletss[i]);
                            //是否排列成功
                            if(JsonisEmpty(result) ===false)
                            {
                                result_pallet.id     = palletss[i].id,
                                result_pallet.init = areas[j].pos_init;
                                result_pallet.area = areas[j].id;
                                result_pallet.layout = result.layout;
                                result_pallet.pos = result.pos;
                                
                                start_sort = true;
                                break;
                            }
                            else
                            {
                                console.log("pallet :"+i+";area :"+j+" 排列失敗" );
                            }
                        
                    }
                    
                }
                else
                {
                    //空區域排列
                    var result = await SpaceinArea( list_array_area_3d[array_area_3dindex].array_area_3d,palletss[i]);

                    //是否排列成功
                    if(JsonisEmpty(result) ===false)
                    {
                        result_pallet.id     = palletss[i].id,
                        result_pallet.init = areas[j].pos_init;
                        result_pallet.area = areas[j].id;
                        result_pallet.layout = result.layout;
                        result_pallet.pos = result.pos;

                        start_sort = true;
                        break;
                    }

                }

            };


             //檢查完還是沒排列的情況
             if(start_sort ===false)
             {
                //重新檢查各區域是否還有空間擺放
                for(var j=0;j<areas.length;j++){
                    

                    //當找不到同樣時回頭找區域空間排列
                    var result = await SpaceinArea( list_array_area_3d[j].array_area_3d,palletss[i]);
                    //是否排列成功
                    if(result.pos.length>0)
                    {
                        if(JsonisEmpty(result) ===false)
                        {
                            result_pallet.id     = palletss[i].id,
                            result_pallet.init   = areas[j].pos_init;
                            result_pallet.area   = areas[j].id;
                            result_pallet.layout = result.layout;
                            result_pallet.pos    = result.pos;
    
                            start_sort = true;
                            break;
                        }
                    }
                }
             }

             //排列演算法結束　確認排列結果
             result_sortpallet.push(result_pallet);
      };

      result_success.cause = result_sortpallet;
   
      return res_reuslt.send(result_success);
}

///貨物排列演算法-單一先堆高
async function Sorting_prject_singlefirst(req, res) { 

    var res_reuslt = res.status(202)
    var  result_error=
        {
            'result':'error',
            'cause':''
        };
    var  result_success=
        {
            'result':'success',
            'cause':''
        };
    interval =0;
    sort_amount =0;
    if(req.body.id_warehouse ===undefined || req.body.id_warehouse ===null ||req.body.id_warehouse ==="")
    {
        result_error.cause ='no id_warehouse';
        return res_reuslt.send(result_error);
    }

    id_warehouse = req.body.id_warehouse;

   if (!Number.isInteger(id_warehouse))
    {
        result_error.cause ='not integer';
        return res_reuslt.send(result_error);
    }

    //判斷是否有倉庫
   var warehouses =   await getWHData(id_warehouse); 

    if(warehouses === null)
    {
        result_error.cause ='no warehouse';
        return res_reuslt.send(result_error);
    }
  
    
    //判斷是否有區域
    var areas = await  getAreasData(id_warehouse);
    
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
        else if(area.width=== null||area.length=== null )
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
    var setting_interval = await getIntervalData();

    interval = setting_interval.interval;
    if(interval ===null || interval <=0)
    {
        result_error.cause ="interval less 0";
        return res_reuslt.send(result_error);
    }

    //判斷是否有設定sort_amount (排列數量)
    var setting_sort_amount = await getSort_AmountData();

    sort_amount = setting_sort_amount.sort_amount;
    if(sort_amount <=0)
    {
        result_error.cause ="sort_amount less 0";
        return res_reuslt.send(result_error);
    }
    //判斷是否有設定棧板
    var setting_pallets = await  getSetting_PalletsData();

      if(setting_pallets.length <=0)
      {
          result_error.cause ='no setting_pallets';
          return res_reuslt.send(result_error);
      }

    //判斷是否有設定貨物
    var setting_projects = await  getSetting_ProjectsData();

      if(setting_projects.length <=0)
      {
          result_error.cause ='no setting_projects';
          return res_reuslt.send(result_error);
      }

    //判斷是否有貨物棧板需要排列
     var palletss = await  getPalletsData();

      if(palletss.length <=0)
      {
          result_error.cause = 'warehoue:'+id_warehouse+ ' has  no pallets_sort';
          return res_reuslt.send(result_error);
      }



    //生成3D地圖(所有的地圖放置這裡)
    var list_array_area_3d=[];
    //排列結果
    var result_sortpallet =[]
    //開始排列
    for(var i=0;i<palletss.length;i++){

            var start_sort = false;
            //結果
            var result_pallet ={
                'pallet':palletss[i].id,
                'type':palletss[i].id_pallet+'-'+ palletss[i].id_project,
                'area':0,
                'init':[-999,-999,-999],
                'layout':0,
                'pos':[]
            };
            
            var setting_pallet_id =    palletss[i].id_pallet ;
            var pallet_data       =    setting_pallets.find(element => element.id === setting_pallet_id);
     
            //判斷有沒有資料
            if(pallet_data ===null || pallet_data ===undefined)
            {
                result_error.cause ="error read pallet setting";
                return res_reuslt.send(result_error);
            }

            //人工設定棧板尺寸轉為系統尺吋
            var pallet_width =   pallet_data.width/100;
            var pallet_length =  pallet_data.length/100;


            var width  = parseInt((pallet_width) / interval);
            var height = parseInt((pallet_length) / interval);
            if((pallet_width % interval) > 0)
            {
               width++;
            }
   
            if((pallet_length % interval) > 0)
            {
               height++;
            }
            
            palletss[i]['width_rect'] = width;
            palletss[i]['height_rect'] = height;
            //---------------------------------


            for(var j=0;j<areas.length;j++){

                var array_area_3dindex  = -1;
                if(list_array_area_3d.length >0)
                     array_area_3dindex  = list_array_area_3d.findIndex(element =>element.id_area ===areas[j].id );

                if(array_area_3dindex <0)
                {
                    //生成area 空間矩陣--單層
                    var array_area_3d = [];
                    var array_area = [];
                    for(var x=0;x<areas[j].width;x++)
                    {
                        var  arr_area_y =[];
                        for(var y=0;y<areas[j].length;y++)
                        {
                            arr_area_y.push(null);
                        }
                        array_area.push(arr_area_y);
                    }
                    array_area_3d.push(array_area);

                    list_array_area_3d.push({
                        'id_area':areas[j].id,
                        'array_area_3d' :array_area_3d
                    });
                }    


                //先判斷資料表裡是否有之前的貨物已經在區域內
                var pallets_inarea = await  pallets.findAll({
                    attributes: ['id','id_areas','id_pallet','id_project','pos','layout'],
                    where: {
                        id_warehouse: id_warehouse,
                        id_areas:areas[j].id,
                        remove:0,
                    }
                  });
                

                //演算法內是否有排列的貨物
                var pallets_inarea_sort = result_sortpallet.filter(e=>{
                    if(areas[j].id === e.area)
                    {
                        return e;
                    }
                });


                //之前貨物資料中有排放到區域內先排放裡面以免演算法錯誤
                if(pallets_inarea !== null ||pallets_inarea.length >0 )
                {
                    array_area_3dindex  = list_array_area_3d.findIndex(element =>element.id_area ===areas[j].id );

                    
                    //這裡單一區域生成多層區域
                    //原本看資料庫裏面有的棧板資料生成高度，
                    //現在改為直接升成三層
                    var layout_max =2;

                    if(layout_max>0 && list_array_area_3d[array_area_3dindex].array_area_3d.length <=layout_max)
                    {

                        for(var f=0;f<layout_max;f++)
                        {
                            var array_area2 = [];
                            for(var q=0;q<list_array_area_3d[array_area_3dindex].array_area_3d[0].length;q++)
                            {
                                var onecol =[];
                                for(var q2=0;q2<list_array_area_3d[array_area_3dindex].array_area_3d[0][0].length;q2++)
                                {
                                    onecol.push(null);
                                }

                                array_area2.push(onecol);
                            }

                            list_array_area_3d[array_area_3dindex].array_area_3d.push(array_area2);
                        }
                    }

                    //將之前已經有的貨物排列上去
                    pallets_inarea.forEach(pallet_area =>{
                            var pos = JSON.parse(pallet_area.pos);
                            pos.forEach(cell=>{
                                if(cell[0] >=0 && cell[1] >=0 )
                                {
                                    //需要它的id_pallet,id_project
                                    list_array_area_3d[array_area_3dindex].array_area_3d[pallet_area.layout][cell[0]][cell[1]] ={
                                            'id':pallet_area.id,
                                            'pallet':pallet_area.id_pallet,
                                            'project':pallet_area.id_project
                                    };
                                }
                            });
                    });
                }

                //區域有東西2
                if(pallets_inarea.length >0 || pallets_inarea_sort.length >0)
                {
                    //判斷區域內貨物大部分是否跟自己相同
                    var same_pallet  =0;
                    var other_pallet =0;

                    pallets_inarea.forEach(pallet_check=>{


                        var  id_pallet  = pallet_check.id_pallet;
                        var  id_project = pallet_check.id_project;


                        if(id_pallet ==palletss[i].id_pallet)
                        {
                            if(id_project ==palletss[i].id_project)
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


                    pallets_inarea_sort.forEach(pallet_check=>{

                        var types = pallet_check.type.split('-');
                        var  id_pallet = parseInt(types[0]);
                        var  id_project = parseInt(types[1]);


                        if(id_pallet ==palletss[i].id_pallet)
                        {
                            if(id_project ==palletss[i].id_project)
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
                    //主體貨物數量是否跟貨物一致
                    //(same_pallet和 other_pallet如果都是0的話就排列此區域)
                    if(same_pallet >=other_pallet)
                    {
                        
                        //主體一致時區域排列 -- 往上堆

                        var result = await SpaceinArea_singleLay3( list_array_area_3d[array_area_3dindex].array_area_3d,palletss[i]);
                            //是否排列成功
                            if(JsonisEmpty(result) ===false)
                            {
                                result_pallet.id     = palletss[i].id,
                                result_pallet.init = areas[j].pos_init;
                                result_pallet.area = areas[j].id;
                                result_pallet.layout = result.layout;
                                result_pallet.pos = result.pos;
                                
                                start_sort = true;
                                break;
                            }
                            else
                            {
                                console.log("pallet :"+i+";area :"+j+" 排列失敗" );
                            }
                        
                    }
                    
                }
                else
                {
                    //空區域排列
                    var result = await SpaceinArea( list_array_area_3d[array_area_3dindex].array_area_3d,palletss[i]);

                    //是否排列成功
                    if(JsonisEmpty(result) ===false)
                    {
                        result_pallet.id     = palletss[i].id,
                        result_pallet.init = areas[j].pos_init;
                        result_pallet.area = areas[j].id;
                        result_pallet.layout = result.layout;
                        result_pallet.pos = result.pos;

                        start_sort = true;
                        break;
                    }

                }

            };


             //檢查完還是沒排列的情況
             if(start_sort ===false)
             {
                //重新檢查各區域是否還有空間擺放
                for(var j=0;j<areas.length;j++){
                    

                    //當找不到同樣時回頭找區域空間排列
                    var result = await SpaceinArea_singleLay3( list_array_area_3d[j].array_area_3d,palletss[i]);
                    //是否排列成功
                    if(result.pos.length>0)
                    {
                        if(JsonisEmpty(result) ===false)
                        {
                            result_pallet.id     = palletss[i].id,
                            result_pallet.init   = areas[j].pos_init;
                            result_pallet.area   = areas[j].id;
                            result_pallet.layout = result.layout;
                            result_pallet.pos    = result.pos;
    
                            start_sort = true;
                            break;
                        }
                    }
                }
             }

             //排列演算法結束　確認排列結果
             result_sortpallet.push(result_pallet);
      };

      result_success.cause = result_sortpallet;
   
      return res_reuslt.send(result_success);
}



//排列貨物 並檢查空間是否可以排列貨物(包括陣列內是否有空間與貨物大小是否符合空間)
async function SpaceinArea(array_area_3d,project) {

    var result={};
    var pallet_w =project['width_rect'];
    var pallet_h =project['height_rect'];


    //從橫向找
    var fin_space = false;
    for(var a_a_n=0;a_a_n <array_area_3d.length;a_a_n++){

        var array_area = array_area_3d[a_a_n];
        var layout = a_a_n;



        var array_area_w = array_area.length;
        var array_area_h = array_area[0].length;
    

        for(var h=0;h<array_area_h;h++)
        {
            for(var w=0;w<array_area_w;w++)
            {
                //找到未放置空間
                if(array_area[w][h] ===null || array_area[w][h] ===undefined)
                {   
       
                    //下一格
                    var pallet_width = (w + pallet_w -1);
                    var pallet_height = (h + pallet_h -1);
        
                    //超過範圍　不用計算
                    if(pallet_width >= array_area_w || pallet_height >=array_area_h)
                        continue;




                    //判斷貨物要放置的空間有沒有其他貨物
                    var  isOtherPallet = false;
                         result={
                             'layout':layout,
                             pos:[]
                         };

              
                    var id_lastlayout = -1;
                    
                    for(var h_check=h;h_check<=pallet_height;h_check++)  
                    {
                        for(var w_check=w;w_check<=pallet_width;w_check++)
                        {
                                //從第二層開始要判斷第一層的貨物種類是不是一致，並要判斷不是跨貨物區域
                                if(layout >0)
                                {
                                    if(id_lastlayout <=0)
                                    {
                                        if(array_area_3d[0][w_check][h_check] !== null)
                                        {
                                            id_lastlayout = array_area_3d[0][w_check][h_check].id
                                        }
                                        else
                                        {
                                            isOtherPallet = true; //底下沒東西不用擺
                                        }
                                    }
                                      

                                    //判斷是否跨貨物擺放
                                    if( id_lastlayout !== array_area_3d[0][w_check][h_check].id)
                                    {
                                        isOtherPallet = true;
                                    }

                                    //判斷是否跟底下一樣
                                    if(project.id_pallet !== array_area_3d[0][w_check][h_check].pallet)
                                    {
                                        isOtherPallet = true;
                                    }

                                    if(project.id_project !== array_area_3d[0][w_check][h_check].project)
                                    {
                                        isOtherPallet = true;
                                    }     
                                }

                                if(array_area[w_check][h_check] !==null)
                                {
                                    isOtherPallet = true;
                                }

                                //紀錄點位置
                                var point =[w_check,h_check];
                                result.pos.push(point);

                              

                        }
                    }


                    if(isOtherPallet ===true)
                    {
                        result={};
                        continue;
                    }
                    else
                    {
                        fin_space = true;
                        break;   
                    } 
                    
                }
            }

            if(fin_space===true)
            {
                break;
            }

        }

        //如果找到位置，重新把貨物的編碼放置回找到的區域位置
        //以便下一個貨物不會重複排列(但不存資料庫)

        if( (JsonisEmpty(result) === false) && result.pos.length >0)
        {
                var array_pos = [];
                result.pos.forEach(e=>{
                        var s = [e[0],e[1]];
                        array_pos.push(s);
                });
                

                var set = {
                　  'id':project.id,
                    'pallet':project.id_pallet,
                    'project':project.id_project
                };

                for(var pos_n=0;pos_n<array_pos.length;pos_n++)
                {
                    var x =array_pos[pos_n][0];
                    var z =array_pos[pos_n][1];
                    array_area_3d[layout][x][z] = set;
                }

        }


        if(fin_space ===true)
        {
            break ;
        }
    }

    return    result;

}

//排列貨物 並檢查空間是否可以排列貨物(包括陣列內是否有空間與貨物大小是否符合空間) _ 單一空間先疊三層
async function SpaceinArea_singleLay3(array_area_3d,project)
{
    var result={};
    var pallet_w =project['width_rect'];
    var pallet_h =project['height_rect'];


    //從橫向找
    var fin_space = false;
    for(var a_a_n=0;a_a_n <array_area_3d.length;a_a_n++){

        var array_area = array_area_3d[a_a_n];
        var layout = a_a_n;



        var array_area_w = array_area.length;
        var array_area_h = array_area[0].length;
    

        for(var h=0;h<array_area_h;h++)
        {
            for(var w=0;w<array_area_w;w++)
            {
                //找到未放置空間 --判斷是不是同一產品 如果是往上堆
                if(array_area[w][h] ===null || array_area[w][h] ===undefined)
                {   
                    
                    if(project.id ===7)
                    {
                        console.log("a");
                    }

                    //下一格
                    var pallet_width = (w + pallet_w -1);
                    var pallet_height = (h + pallet_h -1);
        
                    //超過範圍　不用計算
                    if(pallet_width >= array_area_w || pallet_height >=array_area_h)
                        continue;


                    //判斷貨物要放置的空間有沒有其他貨物
                    var  isOtherPallet = false;
                         result={
                             'layout':layout,
                             pos:[]
                         };

              
                    var id_lastlayout = -1;
                    
                    for(var h_check=h;h_check<=pallet_height;h_check++)  
                    {
                        for(var w_check=w;w_check<=pallet_width;w_check++)
                        {
                                //從第二層開始要判斷第一層的貨物種類是不是一致，並要判斷不是跨貨物區域
                                if(layout >0)
                                {
                                    if(id_lastlayout <=0)
                                    {
                                        if(array_area_3d[0][w_check][h_check] !== null)
                                        {
                                            id_lastlayout = array_area_3d[0][w_check][h_check].id
                                        }
                                        else
                                        {
                                            isOtherPallet = true; //底下沒東西不用擺
                                        }
                                    }
                                      
                                    //判斷是否跨貨物擺放
                                    if( id_lastlayout !== array_area_3d[0][w_check][h_check].id)
                                    {
                                        isOtherPallet = true;
                                    }

                                    //判斷是否跟底下一樣
                                    if(project.id_pallet !== array_area_3d[0][w_check][h_check].pallet)
                                    {
                                        isOtherPallet = true;
                                    }

                                    if(project.id_project !== array_area_3d[0][w_check][h_check].project)
                                    {
                                        isOtherPallet = true;
                                    }     
                                }

                                if(array_area[w_check][h_check] !==null)
                                {
                                    isOtherPallet = true;
                                }

                                //紀錄點位置
                                var point =[w_check,h_check];
                                result.pos.push(point);

                              

                        }
                    }


                    if(isOtherPallet ===true)
                    {
                        result={};
                        continue;
                    }
                    else
                    {
                        fin_space = true;
                        break;   
                    } 
                    
                }
                else  
                {
                    //是不是同產品 如果是往上疊

                    //下一格
                    var pallet_width = (w + pallet_w -1);
                    var pallet_height = (h + pallet_h -1);
        
                    //超過範圍　不用計算
                    if(pallet_width >= array_area_w || pallet_height >=array_area_h)
                        continue;


                    //判斷貨物要放置的空間有沒有其他貨物
                    var  isOtherPallet = false;
                    result={
                        'layout':layout,
                        pos:[]
                    };
                    var id_lastlayout = -1;
                    
                    //檢查階層是否有東西
                    //var check_layout_hasCell  = false  ;

                    //檢查階層層數
                    var layout_check = layout + 1;
              

                    for(var h_check=h;h_check<=pallet_height;h_check++)  
                    {
                        var check_one = false;

                        for(var w_check=w;w_check<=pallet_width;w_check++)
                        {
                                if(array_area[w_check][h_check] ===null || array_area[w_check][h_check].pallet !==project.id_pallet || array_area[w_check][h_check].project !==project.id_project)
                                {
                                    isOtherPallet = true;
                                    check_one = true;
                                    break;
                                }
                               // console.log(project.id+";"+w_check+";"+h_check);


                               
                                //檢查往上一層是否有東西
                                while(layout_check <3)
                                {
                                    var  area_up  =  array_area_3d[layout_check];

                                    if(area_up[w_check][h_check] !==null)
                                    {
                                        layout_check = layout_check +1;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }

                                //紀錄點位置
                                var point =[w_check,h_check];
                                result.pos.push(point);

                                

                        }

                        if(check_one)
                        {
                            break;
                        }
                    }

                    //如果超過第三層就跳過
                    if(layout_check>=3)
                    {
                        isOtherPallet =true;
                    }



                    if(isOtherPallet ===true)
                    {
                        result={};
                        continue;
                    }
                    else
                    {
                        fin_space = true;

                       //往上疊
                       //console.log(project.id+"----"+layout_check);
                       if(layout_check <=2)
                       {
                            result.layout = layout_check;
                            layout        = layout_check;
                       }

                        break;   
                    } 


                }
            }

            if(fin_space===true)
            {
                break;
            }

        }

        //如果找到位置，重新把貨物的編碼放置回找到的區域位置
        //以便下一個貨物不會重複排列(但不存資料庫)
        if( (JsonisEmpty(result) === false) && result.pos.length >0)
        {
                var array_pos = [];
                result.pos.forEach(e=>{
                        var s = [e[0],e[1]];
                        array_pos.push(s);
                });
                

                var set = {
                　  'id':project.id,
                    'pallet':project.id_pallet,
                    'project':project.id_project
                };

                for(var pos_n=0;pos_n<array_pos.length;pos_n++)
                {
                    var x =array_pos[pos_n][0];
                    var z =array_pos[pos_n][1];
                    array_area_3d[layout][x][z] = set;
                }

        }


        if(fin_space ===true)
        {
            break ;
        }
    }


    return    result;
}


module.exports = { Sorting_prject,Sorting_prject_singlefirst};