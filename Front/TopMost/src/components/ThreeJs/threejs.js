import * as THREE from "three";
import "./InfiniteGridHelper";
// import { error } from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);
// import shader_glow from '@js/threejs/glow_shader.js';
// import shader_phong from "@js/threejs/Phong.js";


class ThreeJs_3D {
    constructor(){
        this.fov = 40;
        this.container = null; //web id container
        this.scene = null;
        this.width  = 0;
        this.height = 0;
        this.camera =  null;
        this.light = null;
        this.sky = null;
        this.renderer = null;
        this.raycaster = null;
        this.geometry = null;
        this.loader = null;
        this.mesh_ground = null;
        this.grid = null;
        this.grid_color = null;
        this.otherender =[];
    }

    init(container,action_Map) //id = container
    {
        this.container = container;

        this.width  = this.container.clientWidth;
        this.height = this.container.clientHeight;


        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("rgb(150, 150, 150)"); //#F0FFF0
        // this.scene.fog = new THREE.Fog( '#F0FFF0', 200, 1000 );
        this.scene.add(new THREE.AmbientLight(0x404040));

        this.light = new THREE.DirectionalLight(0xdfebff, 0.5);//从正上方（不是位置）照射过来的平行光，0.45的强度
        this.light.position.set(50, 200, 100);
        this.light.position.multiplyScalar(0.1);
        this.light.castShadow = true;
        this.scene.add(this.light);

        this.grid = new THREE.InfiniteGridHelper(10, 100);


        this.scene.add(this.grid);


        //         初始化相机
        var  value_ = 2 ;
        this.camera = new THREE.OrthographicCamera( window.innerWidth / - value_, window.innerWidth / value_,  window.innerHeight / value_,   window.innerHeight / -value_, 0, 1000);
        this.camera.position.set(0, 300, 0 );
        this.camera.lookAt(this.scene.position);


        //         初始化控制器
        this.controls = new OrbitControls(this.camera);
        this.controls.target.set(0, 0, 0);
        this.controls.minDistance = 0;
        this.controls.maxDistance = 100;
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


       this.animate();

       if(action_Map !=null)
        {
            action_Map();
        }

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


}

export default {ThreeJs :new ThreeJs_3D()}
