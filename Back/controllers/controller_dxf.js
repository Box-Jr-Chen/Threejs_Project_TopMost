const db = require('../models/index');
var fs = require('fs');

var path_json = './DXF_JSON';
const warehouse = db['warehouse'];

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}


async function GetFileNames(req, res) { 


    var  Flies_DXF = getFiles(path_json);

    var result =[];

    for(var i=0;i<Flies_DXF.length;i++)
    {
        var nameArray = Flies_DXF[i].split('/');
        var name = nameArray[nameArray.length-1].replace('.json','');
        result.push(name);
    }

     return   res.status(200).send({
            'result':'success',
            'meg':result
        })
}

async function   f_read(path,action_finish,action_error) {
    const fsPromises = require('fs').promises;
    const data = await fsPromises.readFile(path);
                    //    .catch((err) => {
                    //     action_error(err);
                    //     return;
                    //    });
  
    action_finish(data.toString());
  }

async function getDxFJson(req, res) { 

    var id_Warehouse = req.query.name;

    var  Flies_DXF = getFiles(path_json);

     var hasJson = false;
     for(var i=0;i<Flies_DXF.length;i++)
     {

        var nameArray = Flies_DXF[i].split('/');
        var name = nameArray[nameArray.length-1].replace('.json','');
        // console.log(name+'--'+id_Warehouse);
        if(name ===id_Warehouse)
        {
            hasJson = true;
        }

    }

     if(hasJson)
     {
        //先把名稱儲存資料庫
        return await  warehouse.findOne({where:{title:id_Warehouse}}).then( async (e)=>{
            if(e ===null)
            {
                await warehouse.create({
                    title:id_Warehouse,
                  });
            }
    


    
               await  f_read(path_json+'/'+id_Warehouse+'.json',(json)=>{
                   res.status(200).send({
                    'result':'success',
                    'index':e.id,
                    'meg':json
                });
            },(error)=>{
                    res.status(200).send({
                        'result':'success',
                        'meg':'error read Json'
                    });
            }); 
        })
        .catch((error)=>{
            res.status(200).send({
                'result':'success',
                'meg':'error read Json'
            });
        });
 

     }

    return   res.status(200).send({
        'result':'success',
        'meg':'no Json'
    })
}


module.exports = { GetFileNames,getDxFJson};