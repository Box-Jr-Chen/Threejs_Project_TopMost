import * as THREE from "three";
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


        this.geometry_box= new THREE.PlaneGeometry( 8, 8 );
        this.material_line = new THREE.LineBasicMaterial({
            color: new THREE.Color("rgb(255, 255, 255)")
        });
        this.material_line_area = new THREE.LineBasicMaterial({
            color: new THREE.Color("rgb(255, 0, 0)")
        });

        this.pointInPolygon  = require('point-in-polygon'); //判断点是否在多边形内

        this.line_WH =[];
        this.line_AREA =[];

        this.vertices_WH = 
        [
               [-420,     60],  //point1
               [-420,    -140],  //point2
               [ 320,    -140],  //point3
               [ 320,    60],   //point4
               [ 280,    60],   //point5
               [ 280,    200],   //point6
               [ 130,    200],   //point7
               [ 130,    60],   //point8
               [-420,    60],  //point9 back
        ];


        this.areas_WH = 
        [
            {
                "area":"area_01",
                "vertices": [
                    [-410,     50],  //point1
                    [-410,    -130],  //point2
                    [-200,    -130],  //point3
                    [ -200,    50],   //point4
                    [-410,     50]  //point5
                ]             
            },
            // {
            //     "area":"area_02",
            //     "vertices": [
            //         [-160,     50],  //point1
            //         [-160,    -130],  //point2
            //         [20,    -130],  //point3
            //         [20,    50],   //point4
            //         [-160,     50]  //point5
            //     ]             
            // },
            // {
            //     "area":"area_03",
            //     "vertices": [
            //         [60,     50],  //point1
            //         [60,    -130],  //point2
            //         [280,    -130],  //point3
            //         [280,    50],   //point4
            //         [60,     50]  //point5
            //     ]             
            // }
        ];


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
    }
    init(width,height,camera,scene){
        var self = this;
        self.width= width;
        self.height=height;
        self.camera=camera;
        self.scene =scene;

    }
    createMap()
    {
        var self = this;

        var points_WH=[];
        self.vertices_WH.forEach(item=>{
            points_WH.push(new THREE.Vector3(item[0],0,-item[1]));
        });
        var geometry = new THREE.BufferGeometry().setFromPoints( points_WH );
        var lineWH = new THREE.Line( geometry, this.material_line );

        self.line_WH.push(lineWH);
        self.scene.add( lineWH );

        //區域
        self.areas_WH.forEach(area=>{
            var points_area=[];
            area.vertices.forEach(item=>{
                points_area.push(new THREE.Vector3(item[0],0,-item[1]));
            });

            var geometry = new THREE.BufferGeometry().setFromPoints( points_area );
            var line_area = new THREE.Line( geometry, this.material_line_area );

            self.line_AREA.push(line_area);
            self.scene.add( line_area );
        });

        //區域格線
        self.areas_WH.forEach(item=>{
            var grid = self.CreateAreaGrid(item.vertices);

         const tGroup = new THREE.Group();
            tGroup.add(grid[0]);
            tGroup.add(grid[1]);
            self.scene.add( tGroup );
        });
    }

    render(){
  

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

CreateAreaGrid(Area)
{
        //console.log(Area);

        const polygonPointsArr = this.girlPoint(Area); //多边形边界的点以及内部的点
        const usefulIndexArr = this.delaunay(polygonPointsArr, Area); //三角剖分


        const posArr = []; //顶点坐标
        const posArr_check = []; //顶点坐标_計算 因為顯示z軸為-
        polygonPointsArr.forEach(elem => {
            posArr.push(elem[0],0,-elem[1]);
            posArr_check.push(elem[0],0,elem[1]);
        });


        var Rect = this.findRectCenter(posArr_check); //計算用

        console.log("Rect");
        console.log(Rect);

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


findRectCenter(posArr)
{
        //先找到同緯度 做頻均
        var  x_value = -1;
        //var  index = 1;  //三次取一次x座標
        var  result =[];
        var  result_y =[];

        posArr.forEach(function(vertice,index) {

            var index_getx = index % 3;
            //console.log(index_getx);

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
                    result_y.push(array_y);
                }
            } 

        })

        result_y.forEach(function(vertice,index) {
            
        })



        
        return result_y;
}

}


export default {wh_frameless :new wh_frameless()}