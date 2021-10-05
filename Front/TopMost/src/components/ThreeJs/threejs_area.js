import * as THREE from "three";
const OrbitControls = require('three-orbit-controls')(THREE);


class ThreeJs_Area {
    constructor(){
        this.fov = 60;
        this.container = null; //web id container
        this.scene = null;
        this.width  = 0;
        this.height = 0;
        this.width_inner= 0;
        this.height_inner= 0;
        this.camera =  null;
        this.light = null;
        this.sky = null;
        this.renderer = null;
        this.raycaster = null;
        this.mouse = null;
        this.geometry = null;
        this.loader = null;
        this.mesh_ground = null;
        this.grid = null;
        this.grid_color = null;
        this.otherender =[];
        this.areaInit = false;
        this.id_area =0; //id
        this.border_area =null; //數值
        this.area_ins = null; //模型
        this.pro_ins = null;  //產品
        this.area_height =5;
        this.Material_area        = new THREE.MeshPhongMaterial( {color: new THREE.Color("rgb(50, 50, 50)")} );
        this.Material_project     = new THREE.MeshPhongMaterial( {color: new THREE.Color("rgb(120, 120, 120)")} );
        this.Material_project_select     = new THREE.MeshPhongMaterial( {color: new THREE.Color("rgb(190, 0, 0)")} );
        this.camera_init=[0, 106, 190];
        this.x_off =0;
        this.z_off =0;
       // this.add_ins_mat = new THREE.MeshBasicMaterial( { color: "rgb(255, 255, 0)" } );
    }

 

    init(container,action_init) //id = container
    {

        if(this.container !==null)
        {
            this.container = null;
            this.container = container;
           
            this.container.appendChild(this.renderer.domElement);
 
            this.camera.position.set( this.camera_init[0],this.camera_init[1], this.camera_init[2] );
            this.controls =null;
            this.controls = new OrbitControls(this.camera,this.container);
            this.controls.target.set(0, 0, 0);
            this.controls.rotateSpeed *= 1;
            this.controls.minDistance = 100;
            this.controls.maxDistance = 250;
            this.controls.maxPolarAngle = Math.PI / 2.3;
            this.controls.update();
            this.controls.enabled = true;

            action_init();
        }

        if( this.areaInit) return;

        this.areaInit = false;
        this.container = container;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("rgb(80, 80, 80)"); //#F0FFF0
        this.scene.add(new THREE.AmbientLight(0x404040));

        this.light = new THREE.DirectionalLight(0xdfebff, 0.5);//从正上方（不是位置）照射过来的平行光，0.45的强度
        this.light.position.set(50, 200, 100);
        this.light.position.multiplyScalar(0.1);
        this.light.castShadow = true;
        this.scene.add(this.light);


        //         初始化相机
        // var  value_ = 2 ;
       // this.camera = new THREE.OrthographicCamera( window.innerWidth / - value_, window.innerWidth / value_,  window.innerHeight / value_,   window.innerHeight / -value_, 0, 1000);
         this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, 1, 100000000);
         this.camera.position.set( this.camera_init[0],this.camera_init[1], this.camera_init[2] );
         this.camera.lookAt(this.scene.position);


        //         初始化控制器
        this.controls = new OrbitControls(this.camera,this.container);
        this.controls.target.set(0, 0, 0);
        this.controls.rotateSpeed *= 1;
        this.controls.minDistance = 100;
        this.controls.maxDistance = 250;
        this.controls.maxPolarAngle = Math.PI / 2.3;
        this.controls.update();
        this.controls.enabled = true;


        // 渲染
        this.renderer = new THREE.WebGLRenderer({
          alpha: true,
          sortobjects:false
        });//会在body里面生成一个canvas标签,
        this.renderer.setPixelRatio(window.devicePixelRatio);//为了兼容高清屏幕
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.gammaFactor = 2.2;
        this.container.appendChild(this.renderer.domElement);

        this.mouse     = new THREE.Vector2(); // create once


        setTimeout(()=>{
            this.width  = this.container.offsetWidth;
            this.height = this.container.offsetHeight;
            this.width_inner =  this.width;
            this.height_inner = this.height;


           this.areaInit = true;
           this.animate();
           action_init();

        },1000);

    }

    ScreenAdd(object)
    {
        this.scene.add(object);
    }
   
    render() {

            if(!this.areaInit) return;
            this.renderer.render(this.scene, this.camera);

            this.width  = this.container.clientWidth;
            this.height = this.container.clientHeight;

            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
            this.renderer.render(this.scene, this.camera);

            //console.log(this.camera.position);
    }

    animate()
    {
        this.render();
    }

    AddElementListener(stat_act,Action){
        this.container.addEventListener( stat_act, Action );
    }

    RemoveElementListener(){
        this.container.replaceWith(this.container.cloneNode(true));
    }

    //Map_Draw
    Active_PointMove(){
       // console.log(this.mapDesign);
        this.container.addEventListener('pointerdown',(event)=>{
            this.mapDesign.onPointerDown_move(event);
        });
        //this.AddElementListener('pointerup',this.mapDesign.onPointerUp_move);
    }

    //Active Control
    Active_controls()
    {
        this.controls.enabled = true;
    }

    //UnActive Control
    UnActive_controls()
    {
        this.controls.enabled = false;
    }

    //Save Area First
    WaitAreaBorders(id,border)
    {
        var self = this;
        self.border_area = border;
        self.id_area = 0;
        //清除之前的模型
        if(self.area_ins !==null)
                self.scene.remove(self.area_ins);


        self.id_area = id;
    }
    
    //Create Area
    CreateAreaIns()
    {
        if(this.border_area ===null) return;
        const vertices = [
            //上方左三角
            { pos: [this.border_area[0],  this.area_height,   -this.border_area[2]], norm: [ 0,  1,  0], uv: [0, 0],},
            { pos: [this.border_area[1] , this.area_height,  -this.border_area[2]], norm: [ 0,  1,  0], uv: [1, 0],}, 
            { pos: [this.border_area[0] , this.area_height,  -this.border_area[3]], norm: [ 0,  1,  0], uv: [1, 0],},  
            //上方右三角
            { pos: [this.border_area[1] , this.area_height,  -this.border_area[2]], norm: [ 0,  1,  0], uv: [0, 1],}, 
            { pos: [this.border_area[1] , this.area_height,  -this.border_area[3]], norm: [ 0,  1,  0], uv: [1, 1],},       
            { pos: [this.border_area[0] , this.area_height,  -this.border_area[3] ], norm: [ 0,  1,  0], uv: [1, 0],},   
            //前方上三角
            { pos: [this.border_area[0] , this.area_height,  -this.border_area[3]], norm: [ 0,  0,  1], uv: [0, 1],}, 
            { pos: [this.border_area[1] , this.area_height,  -this.border_area[3]], norm: [ 0,  0,  1], uv: [1, 1],},       
            { pos: [this.border_area[1] , 0,   -this.border_area[3] ], norm: [ 0,  0,  1], uv: [1, 0],},
             //前方下三角
             { pos: [this.border_area[0] , this.area_height,  -this.border_area[3]], norm: [ 0,  0,  1], uv: [0, 1],}, 
             { pos: [this.border_area[1] , 0,   -this.border_area[3]], norm: [ 0,  0,  1], uv: [1, 1],},       
             { pos: [this.border_area[0] , 0,   -this.border_area[3] ],norm: [ 0,  0, 1], uv: [1, 0],},

            //左方上三角
            { pos: [this.border_area[0] , this.area_height,  -this.border_area[3]], norm: [ -1,   0,  0], uv: [0, 1],}, 
            { pos: [this.border_area[0] , 0,   -this.border_area[3]], norm: [ -1,   0,  0], uv: [1, 1],},       
            { pos: [this.border_area[0] , this.area_height,  -this.border_area[2]] , norm: [ -1,   0,  0], uv: [1, 0],},
             //左方下三角
             { pos: [this.border_area[0] , 0,   -this.border_area[2]], norm: [ -1,  0,  0], uv: [0, 1],}, 
             { pos: [this.border_area[0] , this.area_height,  -this.border_area[2]], norm: [ -1,  0,  0], uv: [1, 1],},       
             { pos: [this.border_area[0] , 0,   -this.border_area[3] ], norm: [ -1, 0,  0], uv: [1, 0],},

            //右方上三角
            { pos: [this.border_area[1] , this.area_height,  -this.border_area[2]], norm: [ 1,  0,  0], uv: [0, 1],}, 
            { pos: [this.border_area[1] , 0,   -this.border_area[2]], norm: [ 1,  0,  0], uv: [1, 1],},       
            { pos: [this.border_area[1] , this.area_height,  -this.border_area[3]] , norm: [ 1,  0,  0], uv: [1, 0],},
             //右方下三角
             { pos: [this.border_area[1] , 0,   -this.border_area[2]], norm: [ 1,  0,  0], uv: [0, 1],}, 
             { pos: [this.border_area[1] , 0,  -this.border_area[3]], norm: [ 1,  0,  0], uv: [1, 1],},       
             { pos: [this.border_area[1] , this.area_height,   -this.border_area[3] ], norm: [ 1,  0,  0], uv: [1, 0],}, 
             
             
            //後方上三角
            { pos: [this.border_area[0] , this.area_height,  -this.border_area[2]], norm: [ 0,  0,  -1], uv: [0, 1],}, 
            { pos: [this.border_area[1] , 0,  -this.border_area[2]] , norm: [ 0,  0,  -1], uv: [1, 0],},
            { pos: [this.border_area[1] , this.area_height,   -this.border_area[2]], norm: [ 0,  0, -1], uv: [1, 1],},       
             //後方下三角
             { pos: [this.border_area[0] , this.area_height,   -this.border_area[2]], norm: [ 0,  0,  -1], uv: [0, 1],}, 
             { pos: [this.border_area[0] , 0,  -this.border_area[2]], norm: [ 0,  0,  -1], uv: [1, 1],},       
             { pos: [this.border_area[1] , 0,   -this.border_area[2] ], norm: [ 0,  0, -1], uv: [1, 0],}  

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
             0,  1,  2,   3,  4,  5, 6,  7,  8, 9,  10,  11, 12,  13,  14, 15,  16,  17, 18,  19,  20, 21,  22,  23, 24,  25,  26, 27,  28,  29]);  // front
    
        var mesh = new THREE.Mesh(geometry,this.Material_area);
        mesh.scale.set(1,1,1);
        
        this.area_ins = mesh;
        
        // console.log(this.border_area);
    
        this.x_off = -(this.border_area[0] + (this.border_area[1] -this.border_area[0])/2);
        this.z_off =  this.border_area[2] + (this.border_area[3] -this.border_area[2])/2;
        mesh.position.set(this.x_off,0,this.z_off);

        this.scene.add(mesh);
    }

    //Get Project
    GetProject(projects){

        this.pro_ins = projects;

        this.pro_ins.forEach(element => {
            element.select_delect = false;
            element.material = this.Material_project;
            element.position.set(this.x_off,this.area_height,-this.z_off);

            this.scene.add(element);
        });
    }

    SetProject_Select(e){
            e.material = this.Material_project_select;
    }
    SetProject_UnSelect(e){
        e.material = this.Material_project;
    }
    DeleteProject(){
        this.pro_ins.forEach(element => {
            this.scene.remove(element);
        });
    }
}

export default {ThreeJs_Area :new ThreeJs_Area()}
