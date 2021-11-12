import * as THREE from "three";
import { FontLoader } from 'three';
import Delaunator from 'delaunator'; //三角剖分

class wh_frameless {
    constructor(){
        this.geometry = null;


        this.mesh  = null;
        this.width = 0;
        this.height= 0;
        this.interval = 10;  //間隔
        this.camera= null;
        this.scene = null;
        this.loader_text =  new FontLoader();

        this.area_create_plane =null; //創建區域用的平面

        this.geometry_box= new THREE.PlaneGeometry( 8, 8 );
        this.material_line = new THREE.LineBasicMaterial({
            color: new THREE.Color("rgb(255, 255, 255)")
        });
        this.material_line_area = new THREE.LineBasicMaterial({
            color: new THREE.Color("rgb(255, 255, 0)")
        });

        this.material_project_sort = new THREE.MeshBasicMaterial({
            color: new THREE.Color("rgb(0, 255, 255)"),
        });

        this.material_project_sort_select = new THREE.MeshBasicMaterial({
            color: new THREE.Color("rgb(0, 170, 170)"),
        });

        this.material_project_exit = new THREE.MeshBasicMaterial({
            color: new THREE.Color("rgb(255, 0, 0)"),
        });
        
        this.pointInPolygon  = require('point-in-polygon'); //判断点是否在多边形内

        this.line_WH =[];
        this.line_AREA =[];   //線段區域

        this.line_GROUP =[];  //實體區域
        this.line_GROUP_rectpos =[];  //實體區域_各格位位置

        this.line_project_exit =[];
        this.line_project_sort =[];
        this.line_project_sort_font =[];

        this.axes = 'xzy';
        this.planeAxes = this.axes.substr( 0, 2 );
        this.material_grid = new THREE.ShaderMaterial( {

            side: THREE.DoubleSide,
    
            uniforms: {
                uSize1: {
                    value: 10
                },
                uSize2: {
                    value: 100
                },
                uColor: {
                    value: new  THREE.Color("rgb(255, 255, 0)"),
                },
                uDistance: {
                    value: this.interval
                }
            },
            transparent: true,
            vertexShader: `
               
               varying vec3 worldPosition;
               
               uniform float uDistance;
               
               void main() {
               
                    vec3 pos = position.${this.axes} * uDistance;
                    pos.${this.planeAxes} += cameraPosition.${this.planeAxes};
                    
                    worldPosition = pos;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
               
               }
               `,
            fragmentShader: `
               
               varying vec3 worldPosition;
               
               uniform float uSize1;
               uniform float uSize2;
               uniform vec3 uColor;
               uniform float uDistance;
                
                
                
                float getGrid(float size) {
                
                    vec2 r = worldPosition.${this.planeAxes} / size;
                    
                    
                    vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
                    float line = min(grid.x, grid.y);
                    
                
                    return 1.0 - min(line, 1.0);
                }
                
               void main() {
               
                    
                      float d = 1.0 - min(distance(cameraPosition.${this.planeAxes}, worldPosition.${this.planeAxes}) / uDistance, 1.0);
                    
                      float g1 = getGrid(uSize1);
                      float g2 = getGrid(uSize2);
                      
                      
                      gl_FragColor = vec4(uColor.rgb, mix(g2, g1, g1) * pow(d, 3.0));
                      gl_FragColor.a = mix(0.5 * gl_FragColor.a, gl_FragColor.a, g2);
                    
                      if ( gl_FragColor.a <= 0.0 ) discard;
                    
               
               }
               
               `,
    
            extensions: {
                derivatives: true
            }
    
        } );

        ///文字實體參數
        this.color_text = new THREE.Color("rgb(30, 30, 30)");

        this.matDark = new THREE.LineBasicMaterial( {
            color:  this.color_text,
            side: THREE.DoubleSide
        } );

        this.matLite = new THREE.MeshBasicMaterial( {
            color: this.color_text,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        } );

        this.add_ins_mat = new THREE.MeshBasicMaterial( { color: "rgb(255, 255, 0)" } );
        this.raycaster = new THREE.Raycaster(); 
        this.mouse =null;
        this.offset_project =1;
        this.pallet_height_scale =10;
        this.pallet_height_offset =-0.2;


        // this.area_create_click=0;
        // this.area_create_vertex =
        // [
        //     {
        //         vertex:[]
        //     },
        //     {
        //         vertex:[]
        //     }
        // ];
        // this.areas_ins_add =[];
        

    }
    init(width,height,camera,scene){
        var self = this;
        self.width= width;
        self.height=height;
        self.camera=camera;
        self.scene =scene;

    }


render(){

}

//找出滑鼠在區域的哪一個格位
get_AreaRect_pos(num,point)
{
    var result = null;
    var dis_close = this.interval; 
    var pos = this.line_GROUP_rectpos[num];
    var s_x = -1;
    var s_z = -1;
    for(var i=0;i<pos.length;i++)
    {
        for(var j=0;j<pos[i].length;j++)
        {        
            var dis =  this.distanceVector(point,pos[i][j]);
            if(dis < dis_close)
            {
                dis_close = dis;
                
                result = pos[i][j];
                s_x = i;
                s_z = j;
            }
        }
    }
    return {
        
       'rect': {'x':s_x,'y':s_z},
       'pos': result,
       'init_pos': pos[0][0],
    };
}

distanceVector( v1, v2 )
{
    var dx = v1.x - v2[0];
    var dz = v1.z - (-v2[1]);

    return Math.sqrt( dx * dx  + dz * dz );
}
//生成等距點陣
girlPoint(polygon) {
    var lonArr = [];  //polygon所有的经度坐标
    var latArr = []; //polygon所有的维度坐标
    polygon.forEach(elem => {
        lonArr.push(elem[0]);
        latArr.push(elem[1]);
    });



    const [lonMin, logMax] = this.minMax(lonArr);
    const [latMin, latMax] = this.minMax(latArr);

    // 经纬度极小值和极大值构成一个矩形范围，可以包裹多边形polygon，在矩形范围内生成等间距顶点
    // const interval = 4; //polygon轮廓内填充顶点的经纬度间隔距离，选择一个合适的值，太小，计算量大，太大，国家球面不够光滑
    const row = Math.ceil((logMax - lonMin) / this.interval);
    const col = Math.ceil((latMax - latMin) / this.interval);


    var rectPointsArr = [];//polygon对应的矩形轮廓内生成均匀间隔的矩形网格数据rectPointsArr
    for (var i = 0; i < row + 1; i++) {
        for (var j = 0; j < col + 1; j++) {
            //两层for循环在矩形范围内批量生成等间距的网格顶点数据
            rectPointsArr.push([lonMin + i * this.interval, latMin + j * this.interval]);
        }
    }


    const pointArr = [];
    rectPointsArr.forEach(elem => {
        // 判断点是否在多边形内
        if (this.pointInPolygon(elem, polygon)) {
            pointArr.push(elem);
        }
    });

    return  pointArr; //返回多边形边界和内部的点
}

minMax(arr) {
    arr.sort(this.compareNum);
    return [Math.floor(arr[0]), Math.ceil(arr[arr.length - 1])];
}

compareNum(a, b) {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else {
        return 0;
    }
}

//第一个参数标识多边形轮廓上的点以及内部的等边距的点集
//第二个参数标识多边形轮廓上的点
delaunay(polygonPointsArr, polygonData) {
    // 三角剖分
    const indexArr = Delaunator.from(polygonPointsArr).triangles; //.from(pointsArr).triangles：平面上一系列点集三角剖分，并获取三角形索引值
    /**三角剖分获得的三角形索引indexArr需要进行二次处理，删除多边形polygon轮廓外面的三角形对应索引 */
    var usefulIndexArr = [];//二次处理后三角形索引，也就是保留多边形polygon内部三角形对应的索引
    for (let i = 0; i < indexArr.length; i += 3) {
        const point1 = polygonPointsArr[indexArr[i]];
        const point2 = polygonPointsArr[indexArr[i + 1]];
        const point3 = polygonPointsArr[indexArr[i + 2]];
        // 三角形重心计算
        const triangleCenter = [(point1[0] + point2[0] + point3[0]) / 3, (point1[1] + point2[1] + point3[1]) / 3];
        if (this.pointInPolygon(triangleCenter, polygonData)) {//判断三角形的重心是在多边形polygon内
            // 保留复合条件三角形对应的索引：indexArr[i], indexArr[i+1],indexArr[i+2]
            (usefulIndexArr).push(indexArr[i], indexArr[i + 1], indexArr[i + 2]);//这种情况需要设置three.js材质背面可见THREE.BackSide才能看到球面国家Mesh
        }
    }
    return usefulIndexArr;
}

//找尋每格中心
findRectCenter(posArr)
{
        //先找到同緯度 做頻均
        var  x_value = -1;
        //var  index = 1;  //三次取一次x座標
        var  result =[];
        var  step_y =[];

        posArr.forEach(function(vertice,index) {

            var index_getx = index % 3;

            if(index_getx ===0)
            {
                //獲取
                if(x_value !== vertice)
                {
                    x_value = vertice;
                    var array_y=[];
                    posArr.forEach(function(vertice_2,index_2) {
                        var index_getx_2 = index_2 % 3;
                        if(index_getx_2 ===0  &&  x_value ===vertice_2)
                        {
                            var rect      = index_2+2;
                            var rect_next = rect+3;

                            //防止超過矩陣
                            if(rect_next <posArr.length)
                            {
                                //確認 rect_next 還在同緯度
                                if(posArr[rect_next-2] ===x_value)
                                {
                                    var center_y =  (posArr[rect] + posArr[rect_next])/2;

                                    array_y.push([x_value,center_y]);
                                }
                            }

                        }
                        else  if(index_getx_2 ===0  &&  x_value !==vertice_2)
                        {
                            return;
                        }
    
                    });
                    step_y.push(array_y);
                }
            } 

        })

        step_y.forEach(function(vertice,index) {
              var index_next = index+1;
              //判斷是否超過矩陣
              if(index_next<step_y.length)
              {
                    var result_y =[];

                    vertice.forEach(function(vertice_inx,index_inx) {
                        step_y[index_next].forEach(function(vertice_next_inx,index_nect_inx) {
                                   if(index_inx ==index_nect_inx )
                                   {
                                        var x = (vertice_inx[0] + vertice_next_inx[0])/2;
                                        var z = (vertice_inx[1] + vertice_next_inx[1])/2;
                                        result_y.push([x,z]);
                                        return;
                                   }
                        });
                    });
                    result.push(result_y);

              }
        })

        return result;
}

///計算矩陣區域
Algs_grid(Area)
{
    const polygonPointsArr = this.girlPoint(Area); //多边形边界的点以及内部的点
    const usefulIndexArr = this.delaunay(polygonPointsArr, Area); //三角剖分

    return [polygonPointsArr,usefulIndexArr];
}
//計算矩陣各單位中心
Algs_RectCenter(polygonPointsArr)
{
    const posArr_check = []; //顶点坐标_計算 因為顯示z軸為-
        polygonPointsArr.forEach(elem => {
            posArr_check.push(elem[0],0,elem[1]);
        });

    return   this.findRectCenter(posArr_check); //計算用
}

//儲存用的點位與顯示點位轉換 z=-z
m_createAreaGrid(polygonPointsArr,usefulIndexArr)
{
        const posArr = []; //顶点坐标
        polygonPointsArr.forEach(elem => {
            posArr.push(elem[0],0,-elem[1]);
        });
       

        this.geometry = new  THREE.BufferGeometry();
        this.geometry.index = new THREE.BufferAttribute(new Uint16Array(usefulIndexArr), 1); //设置几何体的索引
        this.geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(posArr), 3); //设置几何体的顶点坐标
        var material = new THREE.MeshBasicMaterial({
            color: new THREE.Color("rgb(255, 255, 0)"),
        });

        var mesh = new THREE.Mesh(this.geometry,   material);
        mesh.position.z = -0.01;
        mesh.scale.set(1,-1,1); 


        const mesh2 = mesh.clone();
        
        mesh2.material = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0x009999,
        });


        return [mesh,mesh2]
}
createWaveHouse(WH_borders)
{
    var self = this;

    var points_WH=[];
    WH_borders.forEach(item=>{
        points_WH.push(new THREE.Vector3(item[0],0,-item[1]));
    });
    var geometry = new THREE.BufferGeometry().setFromPoints( points_WH );
    var lineWH = new THREE.Line( geometry, this.material_line );

    self.line_WH.push(lineWH);
    self.scene.add( lineWH );

}

deleteAreaInstance()
{
    //清除線段
    var self = this;
    self.line_AREA.forEach(element =>{
        self.scene.remove(element);
    });

    //清除Mesh
    self.line_GROUP.forEach(element =>{
        self.scene.remove(element);
    });
}

createAreaLine(borders)
{
    var self = this;
    //區域
    var points_area=[];
    borders.forEach(item=>{
        points_area.push(new THREE.Vector3(item[0],0,-item[1]));
    });

    var geometry = new THREE.BufferGeometry().setFromPoints( points_area );
    var line_area = new THREE.Line( geometry, this.material_line_area );

    self.line_AREA.push(line_area);
    self.scene.add( line_area );
}
CreateAreaGrid(area_id,polygonPointsArr,usefulIndexArr)
{
    var self = this;
    //區域格線
    var grid = self.m_createAreaGrid(polygonPointsArr,usefulIndexArr);
    const tGroup = new THREE.Group();
    tGroup.add(grid[0]);
    tGroup.add(grid[1]);
    tGroup.areaid = area_id;
    grid[0].name ="area_"+area_id;
    grid[1].name ="area_line_"+area_id;
    var filter_X= grid[0].geometry.attributes.position.array.filter(function(e,index){
          if(index %3 ===0)
              return e;
    }).sort();
    



    var filter_Z= grid[0].geometry.attributes.position.array.filter(function(e,index){
        if(index %3 ===2)
        return true ;
    }).sort();

    tGroup.borders = 
    [
        filter_X[0],  //X_min
        filter_X[filter_X.length-1],  //X_max
        filter_Z[0],  //Y_min
        filter_Z[filter_Z.length-1], //Y_max
    ];

    self.line_GROUP.push(tGroup);
    self.scene.add( tGroup );


  // self.CreateDemoPlane(0,15,0,15);



}

//創造貨物平面
//index是為了演算法棧板生成實體時顯示數字
//pos = 區域矩陣初始位置
//posArr = 棧板佔據格位
//type = 是演算法排列還是資料表以存在棧板
//area =區域位置號碼
//layout =多少層
CreateProject(index,name,pos,posArr,type,area,layout){
    var self = this;
    var area_zeropoint =[pos[0]-(this.interval/2),pos[1]-(this.interval/2)]
    var x_arraw = [];
    var y_arrow = [];


    if(posArr ===null)
    {
        return;
    }
    posArr.forEach(e=>{
        x_arraw.push(e[0]);
        y_arrow.push(e[1]);
    })
    
    //找出Y 範圍
    x_arraw.sort(this.compareDecimals);

    var x_grid = (x_arraw[x_arraw.length-1] -x_arraw[0]) +1 ; 
    
    //找出X 範圍
    y_arrow.sort(this.compareDecimals);
    var y_grid = (y_arrow[y_arrow.length-1] -y_arrow[0]) +1 ; 

    //找出棧板的左下角點
    var project_zeropoint =[area_zeropoint[0]+this.interval*x_arraw[0],area_zeropoint[1]+this.interval*y_arrow[0]]
        
    //棧板的最右邊x
    var project_border_x = project_zeropoint[0] + this.interval *x_grid;
    //棧板的最上邊y
    var project_border_y  = project_zeropoint[1] + this.interval *y_grid;
    

   //var offset =1;
   var height_max =this.pallet_height_scale *(layout+1) ;
   var height_min =this.pallet_height_scale *(layout) ;


    const vertices = [
        { pos: [project_zeropoint[0] +this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project], norm: [ 0,  1,  0], uv: [0, 0],},  //左下
        { pos: [project_border_x -this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project], norm: [ 0,  1,  0], uv: [1, 0],},      //右下
        { pos: [project_zeropoint[0] +this.offset_project, height_max,  -project_border_y +this.offset_project], norm: [ 0,  1,  0], uv: [1, 0],},       //左上

        { pos: [project_border_x -this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project], norm: [ 0,  1,  0], uv: [0, 1],},      //右下
        { pos: [project_border_x -this.offset_project, height_max,  -project_border_y +this.offset_project], norm: [ 0,  1,  0], uv: [1, 1],},          //右上
        { pos: [project_zeropoint[0] +this.offset_project, height_max,  -project_border_y +this.offset_project], norm: [ 0,  1,  0], uv: [1, 0],},      //左上

       
        //前方上三角
        { pos: [project_zeropoint[0] +this.offset_project, height_max,  -project_border_y +this.offset_project], norm: [ 0,  0,  1], uv: [0, 1],}, 
        { pos: [project_border_x -this.offset_project, height_max,  -project_border_y +this.offset_project], norm: [ 0,  0,  1], uv: [1, 1],},       
        { pos: [project_border_x -this.offset_project, height_min -this.pallet_height_offset,  -project_border_y +this.offset_project], norm: [ 0,  0,  1], uv: [1, 0],},
        //前方下三角
        { pos: [project_zeropoint[0] +this.offset_project, height_max,  -project_border_y +this.offset_project], norm: [ 0,  0,  1], uv: [0, 1],}, 
        { pos:  [project_border_x -this.offset_project, height_min -this.pallet_height_offset,  -project_border_y +this.offset_project], norm: [ 0,  0,  1], uv: [1, 1],},       
        { pos: [project_zeropoint[0] +this.offset_project, height_min -this.pallet_height_offset,  -project_border_y +this.offset_project],norm: [ 0,  0, 1], uv: [1, 0],},

        //左方上三角
        { pos: [project_zeropoint[0] +this.offset_project, height_max,  -project_border_y +this.offset_project], norm: [ -1,   0,  0], uv: [0, 1],}, 
        { pos: [project_zeropoint[0] +this.offset_project, height_min -this.pallet_height_offset,  -project_border_y +this.offset_project] , norm: [ -1,   0,  0], uv: [1, 0],},
        { pos: [project_zeropoint[0] +this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project], norm: [ -1,   0,  0], uv: [1, 1],},       
        //左方下三角
        { pos: [project_zeropoint[0] +this.offset_project, height_min -this.pallet_height_offset,  -project_border_y +this.offset_project], norm: [ -1,  0,  0], uv: [0, 1],}, 
        { pos: [project_zeropoint[0] +this.offset_project, height_min -this.pallet_height_offset,  -project_zeropoint[1] -this.offset_project], norm: [ -1,  0,  0], uv: [1, 1],},       
        { pos: [project_zeropoint[0] +this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project], norm: [ -1, 0,  0], uv: [1, 0],},

        //右方上三角
        { pos: [project_border_x -this.offset_project , height_max,  -project_border_y +this.offset_project], norm: [ 1,  0,  0], uv: [0, 1],}, 
        { pos: [project_border_x -this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project] , norm: [ 1,  0,  0], uv: [1, 0],},
        { pos: [project_border_x -this.offset_project , height_min-this.pallet_height_offset,  -project_border_y +this.offset_project], norm: [ 1,  0,  0], uv: [1, 1],},       
        //右方下三角
        { pos: [project_border_x -this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project], norm: [ 1,  0,  0], uv: [0, 1],}, 
        { pos: [project_border_x -this.offset_project, height_min-this.pallet_height_offset,  -project_zeropoint[1] -this.offset_project], norm: [ 1,  0,  0], uv: [1, 1],},       
        { pos: [project_border_x -this.offset_project ,height_min-this.pallet_height_offset,  -project_border_y +this.offset_project], norm: [ 1,  0,  0], uv: [1, 0],}, 
            
            
        //後方上三角
        { pos: [project_zeropoint[0] +this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project], norm: [ 0,  0,  -1], uv: [0, 1],},
        { pos: [project_border_x -this.offset_project, height_min-this.pallet_height_offset,  -project_zeropoint[1] -this.offset_project], norm: [ 0,  0, -1], uv: [1, 1],},    
        { pos: [project_border_x -this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project] , norm: [ 0,  0,  -1], uv: [1, 0],},
          
        //後方下三角
        { pos: [project_zeropoint[0] +this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project], norm: [ 0,  0,  -1], uv: [0, 1],}, 
        { pos: [project_zeropoint[0] +this.offset_project, height_min-this.pallet_height_offset,  -project_zeropoint[1] -this.offset_project], norm: [ 0,  0,  -1], uv: [1, 1],},       
        { pos: [project_border_x -this.offset_project, height_min-this.pallet_height_offset,  -project_zeropoint[1] -this.offset_project], norm: [ 0,  0, -1], uv: [1, 0],}  

    ]; //顶点坐标


    var positions = [];
    var normals = [];
    var uvs = [];
    for (var vertex of vertices) {
        positions.push(...vertex.pos);
        normals.push(...vertex.norm);
        uvs.push(...vertex.uv);
    }

    var geometry = new  THREE.BufferGeometry();
    var positionNumComponents = 3;
    var normalNumComponents = 3;
    const uvNumComponents = 2;

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
    geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
    geometry.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));

    geometry.setIndex([
         0,  1,  2,   3,  4,  5,6,  7,  8,9,  10,  11,12,  13,  14,15,  16,  17,18,  19,  20,21,  22,  23,24,  25,  26,27,  28,  29]);  
         

    var mesh =null;

    //分排列種類還是已存在種類
    if(type==='sort')
    {    
        mesh = this.mesh_set(name,area,geometry,this.material_project_sort);
        mesh.position.set(mesh.position.x,mesh.position.y+100,mesh.position.z);
   

        var x_offset = ((project_zeropoint[0] ) -(project_border_x ))/4;

        //1稍微有點偏，直接手動修改
        if(index ===1)
        {
            x_offset = ((project_zeropoint[0] ) -(project_border_x ))/3;
        }
        if(index >=10)
        {
            x_offset = ((project_zeropoint[0] ) -(project_border_x ))/1.7;
        }
        var z_offset = ((-project_zeropoint[1] ) - (-project_border_y))/3 ;



        var x = ((project_zeropoint[0] ) +(project_border_x ))/2 +x_offset;
        var y = 12*height_max;
        var z = ((-project_zeropoint[1] ) + (-project_border_y))/2 + z_offset;

        this.loader_text.load( "/helvetiker_regular.typeface.json", function ( font ) {

            const message = index.toString();

            const shapes = font.generateShapes( message, 10 );

            const geometry = new THREE.ShapeGeometry( shapes );

           geometry.computeBoundingBox();

            //const xMid =  0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
            const zMid =  0.5 * ( geometry.boundingBox.max.z - geometry.boundingBox.min.z );
            geometry.translate( 0, 0, -zMid );

            const text = new THREE.Mesh( geometry, self.matLite );
            text.rotateX(- Math.PI / 2, 0, 0);
            text.position.set(x,y,z);
            self.line_project_sort_font.push(text);
            self.scene.add( text );

        } );



        self.line_project_sort.push(mesh);
    }
    else if(type==='exit')
    {
        mesh = this.mesh_set(name,area,geometry,this.material_project_exit);
        self.line_project_exit.push(mesh);
    }

    self.scene.add(mesh);

}

//更新貨物平面
//index為line_project_sort 的point
UpdateProject_sort(index,pos,posArr,area,layout)
{
        //var self = this;
//        console.log(pos);
        var area_zeropoint =[pos[0]-(this.interval/2),pos[1]-(this.interval/2)]
        var x_arraw = [];
        var y_arrow = [];
       // console.log(area_zeropoint);

        if(posArr ===null)
        {
            return;
        }
        posArr.forEach(e=>{
            x_arraw.push(e[0]);
            y_arrow.push(e[1]);
        })
        
        //找出Y 範圍
        x_arraw.sort(this.compareDecimals);

        var x_grid = (x_arraw[x_arraw.length-1] -x_arraw[0]) +1 ; 
        
        //找出X 範圍
        y_arrow.sort(this.compareDecimals);
        var y_grid = (y_arrow[y_arrow.length-1] -y_arrow[0]) +1 ; 

        //找出棧板的左下角點
        var project_zeropoint =[area_zeropoint[0]+this.interval*x_arraw[0],area_zeropoint[1]+this.interval*y_arrow[0]]
            
        //棧板的最右邊x
        var project_border_x = project_zeropoint[0] + this.interval *x_grid;
        //棧板的最上邊y
        var project_border_y  = project_zeropoint[1] + this.interval *y_grid;
        

        //var offset =1;
        var height_max =this.pallet_height_scale *(layout+1) ;
        var height_min =this.pallet_height_scale *(layout) ;

    // console.log(height_max+";"+height_min);
     
        const vertices = [
             project_zeropoint[0] +this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project,  //左下
             project_border_x -this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project,     //右下
             project_zeropoint[0] +this.offset_project, height_max,  -project_border_y +this.offset_project,    //左上

             project_border_x -this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project,      //右下
             project_border_x -this.offset_project, height_max,  -project_border_y +this.offset_project,       //右上
             project_zeropoint[0] +this.offset_project, height_max,  -project_border_y +this.offset_project,     //左上

        
            //前方上三角
             project_zeropoint[0] +this.offset_project, height_max,  -project_border_y +this.offset_project, 
             project_border_x -this.offset_project, height_max,  -project_border_y +this.offset_project,    
             project_border_x -this.offset_project, height_min-this.pallet_height_offset,  -project_border_y +this.offset_project,
            //前方下三角
            project_zeropoint[0] +this.offset_project, height_max,  -project_border_y +this.offset_project,
            project_border_x -this.offset_project, height_min -this.pallet_height_offset,  -project_border_y +this.offset_project,     
            project_zeropoint[0] +this.offset_project, height_min-this.pallet_height_offset,  -project_border_y +this.offset_project,

            //左方上三角
            project_zeropoint[0] +this.offset_project, height_max,  -project_border_y +this.offset_project, 
            project_zeropoint[0] +this.offset_project, height_min-this.pallet_height_offset,  -project_border_y +this.offset_project ,
            project_zeropoint[0] +this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project,     
            //左方下三角
            project_zeropoint[0] +this.offset_project, height_min-this.pallet_height_offset,  -project_border_y +this.offset_project, 
            project_zeropoint[0] +this.offset_project, height_min-this.pallet_height_offset,  -project_zeropoint[1] -this.offset_project,      
            project_zeropoint[0] +this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project,

            //右方上三角
            project_border_x -this.offset_project , height_max,  -project_border_y +this.offset_project,
            project_border_x -this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project ,
            project_border_x -this.offset_project , height_min-this.pallet_height_offset,  -project_border_y +this.offset_project,   
            //右方下三角
            project_border_x -this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project,
            project_border_x -this.offset_project, height_min-this.pallet_height_offset,  -project_zeropoint[1] -this.offset_project,        
            project_border_x -this.offset_project ,height_min-this.pallet_height_offset,  -project_border_y +this.offset_project,
                
                
            //後方上三角
            project_zeropoint[0] +this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project,
            project_border_x -this.offset_project, height_min-this.pallet_height_offset,  -project_zeropoint[1] -this.offset_project,   
            project_border_x -this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project ,
            
            //後方下三角
            project_zeropoint[0] +this.offset_project, height_max,  -project_zeropoint[1] -this.offset_project,  
            project_zeropoint[0] +this.offset_project, height_min-this.pallet_height_offset,  -project_zeropoint[1] -this.offset_project,      
            project_border_x -this.offset_project, height_min-this.pallet_height_offset,  -project_zeropoint[1] -this.offset_project,

        ]; //顶点坐标

        //更新點位置
        for(var i=0;i<this.line_project_sort[index].geometry.attributes.position.array.length;i++)
        {
            this.line_project_sort[index].geometry.attributes.position.array[i] = vertices[i];
        }

        this.line_project_sort[index].area = area;
        this.line_project_sort[index].layout = layout;

        this.line_project_sort[index].geometry.attributes.position.needsUpdate  =  true;


        var x_offset = ((project_zeropoint[0] ) -(project_border_x ))/4;
        //1稍微有點偏，直接手動修改
        if(index ===0)
        {
            x_offset = ((project_zeropoint[0] ) -(project_border_x ))/3;
        }
        if(index >=9)
        {
            x_offset = ((project_zeropoint[0] ) -(project_border_x ))/1.7;
        }
        var z_offset = ((-project_zeropoint[1] ) - (-project_border_y))/3 ;

        var x = ((project_zeropoint[0] ) +(project_border_x ))/2 +x_offset;
        var y = 12*height_max;
        var z = ((-project_zeropoint[1] ) + (-project_border_y))/2 + z_offset;

        this.line_project_sort_font[index].position.set(x,y,z);
}

Mat_Active_SelectSortPallet(index)
{
    this.line_project_sort[index].material  = this.material_project_sort_select ;
}
Mat_Enactive_SelectSortPallet()
{
    this.line_project_sort.forEach(e=>{
        e.material  = this.material_project_sort ;
    });
}

CreateDemoPlane(X_min,X_max,Y_min,Y_max)
{
    Y_max
    const vertices = [
        { pos: [X_min, 20,  Y_min], norm: [ 0,  1,  0], uv: [0, 0],},       //左下
        { pos: [X_min, 20,  Y_max], norm: [ 0,  1,  0], uv: [1, 0],},       //右下
        { pos: [X_max, 20,  Y_max], norm: [ 0,  1,  0], uv: [1, 0],},       //左上

        { pos: [X_min, 20,  Y_min], norm: [ 0,  1,  0], uv: [0, 1],},       //右下
        { pos: [X_max, 20,  Y_max], norm: [ 0,  1,  0], uv: [1, 1],},       //右上
        { pos: [X_max, 20,  Y_min], norm: [ 0,  1,  0], uv: [1, 0],},       //左上


    ]; //顶点坐标


    var positions = [];
    var normals = [];
    var uvs = [];
    for (var vertex of vertices) {
        positions.push(...vertex.pos);
        normals.push(...vertex.norm);
        uvs.push(...vertex.uv);
    }

    var geometry = new  THREE.BufferGeometry();
    var positionNumComponents = 3;
    var normalNumComponents = 3;
    const uvNumComponents = 2;

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
    geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
    geometry.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));

    geometry.setIndex([
         0,1,2,3,4,5,6]);  
    
    var material = new THREE.LineBasicMaterial({
    color: new THREE.Color("rgba(0, 255, 0,0.5)")
    });
    material.transparent = true;
    material.opacity =0.5;

    var mesh = new THREE.Mesh(geometry,material);
    mesh.scale.set(1,1,1);
    mesh.position.set(11,0,-82.45);
    this.scene.add(mesh);         
}

mesh_set(name,area,geometry,material)
{
    var mesh = new THREE.Mesh(geometry,material);
    mesh.scale.set(1,1,1);
    mesh.name = name;
    mesh.area = area;
    return mesh;
}

//將排列完的結果轉成已上架
PutSortToExit()
{
    this.line_project_sort.map((e)=>{
            e.material =this.material_project_exit;
            return e;
    });


    this.line_project_exit.push(...this.line_project_sort);


    //clear  line_project_sort
    this.line_project_sort.splice(0, this.line_project_sort.length);
    this.line_project_sort =[];

    //clear word 
    this.line_project_sort_font.forEach((e)=>{
        this.scene.remove(e);
    });

    this.line_project_sort_font.splice(0, this.line_project_sort_font.length);
    this.line_project_sort_font =[];


}

DeleteProject_sort()
{
    if(this.line_project_sort.length >0)
     {
        this.line_project_sort.forEach(element=>{
            this.scene.remove(element);
        });

        this.line_project_sort_font.forEach(element=>{
            this.scene.remove(element);
        });

        this.line_project_sort.splice(0, this.line_project_sort.length);
        this.line_project_sort =[];

        this.line_project_sort_font.splice(0, this.line_project_sort_font.length);
        this.line_project_sort_font =[];
     }
}

DeleteProject_exit()
{
    if(this.line_project_exit.length >0)
     {
        this.line_project_exit.forEach(element=>{
            this.scene.remove(element);
        });

        this.line_project_exit.splice(0, this.line_project_exit.length);
        this.line_project_exit =[];
     }
}

ResetProject_exit(area,area_pro)
{
    var project_exit = this.line_project_exit.filter(e=>{
         if(e.area ===area)
         {
            var item  =  area_pro.findIndex(p=>{
                if(p.name === e.name)
                {
                    return p;
                }
            });

            if(item >=0)
                return e;
         }

    });

    project_exit.forEach(e=>{
        e.material = this.material_project_exit ;
        e.position.set(0,0,0);
        this.scene.add(e);
    });
}

///比對大小
compareDecimals(a, b) {
    if (a === b) 
         return 0;

    return a < b ? -1 : 1;
}


//選擇的棧板，上方的棧板改色
change_Material(index,array_sort_finish)
{
    var pallet_same_pos_index =[];
    var pallet_same_pos = array_sort_finish.filter(function(e, i_same){
        if(JSON.stringify(e.pos) === JSON.stringify(array_sort_finish[index].pos ) &&
           e.layout > array_sort_finish[index].layout  &&
           index !== i_same
           )
        {
            pallet_same_pos_index.push(i_same);
            return e;
        }
    }); 

    if(pallet_same_pos.length >0)
    {
        var self=this;
        pallet_same_pos.forEach(function(e,index_2){

            self.line_project_sort[pallet_same_pos_index[index_2]].material = self.material_project_sort_select;
        })
    }
}

//點擊事件
//直接傳入pallet index  
//直接傳入array_sort_finish
add_clickEvent(event,index,array_sort_finish,pallet_exit,action_error)
{
    var mouse = new THREE.Vector2();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    this.raycaster.setFromCamera( mouse, this.camera );

    if(this.line_GROUP.length <=0) return;

    for(var i =0 ;i<this.line_GROUP.length;i++)
    {
        var intersects = this.raycaster.intersectObjects( this.line_GROUP[i].children );

        if ( intersects.length > 0 )
        {
           var result =   this.get_AreaRect_pos(i,intersects[0].point);
        
           //先將陣列轉換到(0,0)為初始，然後再移位
            var x_sub = array_sort_finish[index].pos[0][0];
            var z_sub = array_sort_finish[index].pos[0][1];

            var rect_move =[];
            array_sort_finish[index].pos.forEach(e=>{
                var cell =[e[0],e[1]];
                rect_move.push(cell);
            });
            rect_move.map((e)=>{
                e[0] = e[0] -x_sub;
                e[1] = e[1] -z_sub;
                e[0] =e[0] +result.rect.x;
                e[1] =e[1] +result.rect.y;
                return e;
            });

            //判斷是否超出點選區域範圍
            var rect_move_outline = rect_move.filter(e=>{
                
                if(e[0] >this.line_GROUP_rectpos[i].length-1)
                    return e
                    
                if(e[1] >this.line_GROUP_rectpos[i][0].length-1)
                    return e
            });
            if(rect_move_outline.length >0)
            {
                return;
            }


           //如果點擊的位置跟現在的位置一樣不用改變
            if (JSON.stringify(rect_move) === JSON.stringify(array_sort_finish[index].pos))
            {
                action_error("位置一樣");
                return;
            }
        



            var cross_rent = false;
            var wrong_type = false;
            var over_layout = false;
            var pass_overlapping = false;
            var layout_last =0 ;//之前的高度
            //判斷是否有與演算法排列的棧板重疊或是錯位
            //如果完全重疊 同時是相同種類就疊上去
           
            var  areaid =  this.line_GROUP[i].areaid;
            array_sort_finish.forEach(function(e,i_a){

                //是否同個區域
                if(e.area !==areaid)
                    return;

                var rect_array =[];
                
                //不可以找自己
                rect_array = rect_move.filter(rect_e=>{
                        for(var i=0;i<e.pos.length;i++)
                            if(rect_e[0] ==e.pos[i][0] && 
                                rect_e[1] ==e.pos[i][1]  &&
                                i_a !==index)
                                return rect_e;
                });
                
               
                //是否有重疊
                if(rect_array.length >0)
                {
                    if(rect_array.length ===rect_move.length)
                    {
                        if(e.pallet ===array_sort_finish[index].pallet)
                            return;

                        //是否種類一樣  
                        if(array_sort_finish[index].type ===e.type)
                        {
                            //是否超出高度
                            if(e.layout <2)
                            {
                                pass_overlapping = true; //通過
                              
                                if(layout_last < e.layout)
                                        layout_last = e.layout;

                            }
                            else
                            {
                                over_layout = true;//超出高度
                            }
                        }
                        else
                        {
                            wrong_type = true; //種類不一致
                        }
                    }
                    else
                    {
                        cross_rent = true; //錯位
                    }
                }

            });

            if(cross_rent)
            {
                action_error("錯位!");
                return;
            }
            if(wrong_type)
            {
                action_error("種類不一致!");
                return;
            }
            if(over_layout)
            {
                action_error("超過高度!");
                return;
            }



            //做更新之前找出之前相同位置不同高度的棧板，上面的棧板要做高度更新
            var pallet_same_pos_index=[];
            var pallet_same_pos = array_sort_finish.filter(function(e, i_same){
                if(JSON.stringify(e.pos) === JSON.stringify(array_sort_finish[index].pos ) &&
                   e.layout > array_sort_finish[index].layout  &&
                   index !== i_same
                   )
                {
                    pallet_same_pos_index.push(i_same);
                    return e;
                }
            }); 

            if(pallet_same_pos.length >0)
            {
                var self=this;
                pallet_same_pos.forEach(function(e,index2){
                    e.layout = e.layout -1;
                    // console.log(array_sort_finish[index]);
                    // console.log(e.init);

                    var init = JSON.parse(e.init);
                    self.line_project_sort[pallet_same_pos_index[index2]].material = self.material_project_sort;
                    self.UpdateProject_sort(pallet_same_pos_index[index2],init,e.pos,self.line_GROUP[i].areaid,e.layout);
                })
            }


            //高度判斷
            if(pass_overlapping)
            {
                //有重疊直接更新 不必找尋存在的棧板
                var init_pos_str = "["+result.init_pos[0]+","+result.init_pos[1]+"]";
                array_sort_finish[index].init =init_pos_str;
                array_sort_finish[index].pos = rect_move;
                array_sort_finish[index].area = this.line_GROUP[i].areaid;
                array_sort_finish[index].layout = layout_last+1;
                this.UpdateProject_sort(index,result.init_pos,rect_move,this.line_GROUP[i].areaid,array_sort_finish[index].layout);
                return;
            }
     
            layout_last =0 ;//之前的高度
            array_sort_finish[index].layout =0 ; //回到高度
            

            //判斷是否有與資料表排列的棧板重疊或是錯位
            //如果完全重疊 同時是相同種類就疊上去
            pallet_exit.forEach(e=>{
                    //是否同個區域
                    if(e.id_areas !==areaid)
                    return;

                var rect_array =[];
                
                var pos = JSON.parse(e.pos);
             

                rect_array = rect_move.filter(rect_e=>{
                    for(var i=0;i<pos.length;i++)
                        if(rect_e[0] ==pos[i][0] && rect_e[1] ==pos[i][1])
                            return rect_e;
            });
        
                //是否有重疊
                if(rect_array.length >0)
                {
                    if(rect_array.length ===rect_move.length)
                    {
                        var type = e.id_pallet+"-"+e.id_project;

                        //是否種類一樣  
                        if(array_sort_finish[index].type ===type)
                        {
                            //是否超出高度
                            if(e.layout <2)
                            {
                                pass_overlapping = true; //通過

                                if(layout_last < e.layout)
                                        layout_last = e.layout;
                            }
                            else
                            {
                                over_layout = true;//超出高度
                            }
                        }
                        else
                        {
                            wrong_type = true; //種類不一致
                        }
                    }
                    else
                    {
                        cross_rent = true; //錯位
                    }
                }
            });

            if(cross_rent)
            {
                action_error("錯位!");
                return;
            }
            if(wrong_type)
            {
                action_error("種類不一致!");
                return;
            }
            if(over_layout)
            {
                action_error("超過高度!");
                return;
            }


             init_pos_str = "["+result.init_pos[0]+","+result.init_pos[1]+"]";
             array_sort_finish[index].init =init_pos_str;
             array_sort_finish[index].pos = rect_move;
             array_sort_finish[index].area = this.line_GROUP[i].areaid;

             if(pass_overlapping)
             {
                array_sort_finish[index].layout = layout_last+1;
             }
             else
             {
                array_sort_finish[index].layout =0 ; //回到高度
             }
            // console.log(array_sort_finish[index].layout);
             this.UpdateProject_sort(index,result.init_pos,rect_move,this.line_GROUP[i].areaid,array_sort_finish[index].layout);
        }
    }
}

//點擊事件
//區域選擇
add_clickEvent_Area(event,event_addpoint){
    var mouse = new THREE.Vector2();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    this.raycaster.setFromCamera( mouse, this.camera );

    
    var intersects = this.raycaster.intersectObjects( this.scene.children );
    if ( intersects.length > 0 )
    {
        if(intersects[0].object.name ==="area_create")
        {
            event_addpoint(intersects[0].point);
        }

    }
}

//連動事件
//區域選擇
add_clickMove_Area(event,event_addpoint)
{
    var mouse = new THREE.Vector2();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    this.raycaster.setFromCamera( mouse, this.camera );

    
    var intersects = this.raycaster.intersectObjects( this.scene.children );
    if ( intersects.length > 0 )
    {
        if(intersects[0].object.name ==="area_create")
        {
            event_addpoint(intersects[0].point);
        }

    }
}


}

export default {wh_frameless :new wh_frameless()}