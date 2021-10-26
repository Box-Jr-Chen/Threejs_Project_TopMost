/*
========================================
此程序用來固定時間讀取檔案夾裡是否有模型DXF檔
========================================
*/

var DxfParser = require('dxf-parser');
var fs = require('fs');
const fsextra = require('fs-extra');
var path = require('path');
var parser = new DxfParser();

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


setInterval(() => {
    
  try {
  
    var  Flies_DXF = getFiles('DXF_READ');

    for(var i=0;i<Flies_DXF.length;i++)
    {
        var subfilename = Flies_DXF[i].slice(Flies_DXF[i].length-4, Flies_DXF[i].length);

        ///確認是否是DXF檔
        if(subfilename==='.dxf')
        {
            var filename = Flies_DXF[i].split('/');

            //取得完整路徑
            var  DXF_FILE_PATH = path.join(__dirname, 'DXF_READ', filename[1]);
            var fileText = fs.readFileSync(DXF_FILE_PATH, 'utf8');

            //解析
            var dxf = parser.parseSync(fileText);

            //檔案匯出
            var outPath =  filename[1].replace('.dxf', '.json');

            fs.writeFileSync('DXF_JSON/'+outPath, JSON.stringify(dxf, null, 3));

            //檔案保存至DXF_SAVE
            var  DXF_SAVE_PATH = path.join(__dirname, 'DXF_SAVE', filename[1]);

            fsextra.move(DXF_FILE_PATH, DXF_SAVE_PATH, (err) => { 
                if (err) return console.log(err); 

                console.log(`Tranlated to JSON,and move SAVE!!`); 
              });

        }

    }


}catch(err) {
    console.error(err.stack);
}



}, 5000);
