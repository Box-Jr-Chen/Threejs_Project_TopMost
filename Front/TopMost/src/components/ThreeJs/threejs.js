import * as THREE from "three";
import "./InfiniteGridHelper";
import MapDesign from './map.js';  // 地圖設計系統
import WH_FrameLess from './wh_frameless.js';  // 地圖設計系統
import {Viewer} from './three-dxf/three-dxf.js';  // dxf匯入
const OrbitControls = require('three-orbit-controls')(THREE);


class ThreeJs_3D {
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

        this.mapDesign = MapDesign.MapDesign;
        this.WH_FrameLess = WH_FrameLess.wh_frameless;
      //  this.threeDxf  = ThreeDxf;
        this.sysInit = false;
    }

    init(container) //id = container
    {
     
        this.sysInit = false;
        this.container = container;
        // console.log(this.container);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("rgb(80, 80, 80)"); //#F0FFF0
        // this.scene.fog = new THREE.Fog( '#F0FFF0', 200, 1000 );
        this.scene.add(new THREE.AmbientLight(0x404040));

        this.light = new THREE.DirectionalLight(0xdfebff, 0.5);//从正上方（不是位置）照射过来的平行光，0.45的强度
        this.light.position.set(50, 200, 100);
        this.light.position.multiplyScalar(0.1);
        this.light.castShadow = true;
        this.scene.add(this.light);

        this.grid = new THREE.InfiniteGridHelper(10, 100,new THREE.Color("rgb(130, 130, 130)"));


        this.scene.add(this.grid);



        //         初始化相机
         var  value_ = 2 ;
         this.camera = new THREE.OrthographicCamera( window.innerWidth / - value_, window.innerWidth / value_,  window.innerHeight / value_,   window.innerHeight / -value_, 0, 1000);
        //this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, 1, 100000000);
         this.camera.position.set(0, 500, 0 );
         this.camera.lookAt(this.scene.position);


        //         初始化控制器
        this.controls = new OrbitControls(this.camera,this.container);
        this.controls.target.set(0, 0, 0);
        this.controls.rotateSpeed *= -1;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 1000;
        this.controls.maxPolarAngle = Math.PI / 2.3;
        this.controls.enableRotate =false;
        this.controls.update();
        this.controls.enabled = true;


        //         渲染
        this.renderer = new THREE.WebGLRenderer({
          alpha: true,
          sortobjects:false
        });//会在body里面生成一个canvas标签,
        this.renderer.setPixelRatio(window.devicePixelRatio);//为了兼容高清屏幕
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.gammaFactor = 2.2;
        this.container.appendChild(this.renderer.domElement);

       //this.animated =  this.animate();
       // this.loader = new GLTFLoader();

    //    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    //    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    //    const cube = new THREE.Mesh( geometry, material );
    //    this.scene.add( cube );

        this.mouse     = new THREE.Vector2(); // create once


        setTimeout(()=>{
            this.width  = this.container.offsetWidth;
            this.height = this.container.offsetHeight;
            this.width_inner = window.innerWidth;
            this.height_inner = window.innerHeight;

           this.animate();


           this.mapDesign.init(
            this.width,
            this.height,
            this.camera,
            this.scene
          );

          this.WH_FrameLess.init(
            this.width,
            this.height,
            this.camera,
            this.scene
          );

       

          this.otherender.push(this.mapDesign);
          this.otherender.push(this.WH_FrameLess);

          this.sysInit = true;

        },1000);

    }

    ScreenAdd(object)
    {
        this.scene.add(object);
    }
   
    render() {
            this.renderer.render(this.scene, this.camera);

            if(this.otherender.length >0)
            {
                this.otherender.forEach(
                    element =>
                    {
                        element.render();
                    }
                )
            }


            this.width  = this.container.clientWidth;
            this.height = this.container.clientHeight;

            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
            this.renderer.render(this.scene, this.camera);
    }

    animate()
    {
        this.render();
    }

    async Load_Model_Data(path,action_sucess,action_loding,action_error)
    {
        await this.loader.load(path,
        function (obj) {

           // console.log(this.fov);
           // this.scene.add(obj);

            if(action_sucess !=null)
                action_sucess(obj);
        },
        function (xhr) {
            if(action_loding !=null)
                action_loding(xhr);
           // console.log((xhr.loaded / xhr.total * 100) + "% loaded")
        },
        function (error) {
            if(action_error !=null)
                    action_error(error);
            //console.error(error, "load error!")
        });
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


    //Mouse
    MouseUp(){
        this.mapDesign.mouseup();
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

    WH_FrameLesscreateMap()
    {
        this.WH_FrameLess.createMap();
    }

    DXFReader(data)
    {
        //data
        //console.log(this.threeDxf);
        Viewer(this.scene,this.camera,this.controls,this.container,this.width,this.height,data);
    }
}

export default {ThreeJs :new ThreeJs_3D()}
