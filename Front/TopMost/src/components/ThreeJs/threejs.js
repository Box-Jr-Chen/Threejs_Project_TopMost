import * as THREE from "three";
import * as THREE from "three";
// import { error } from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);
// import shader_glow from '@js/threejs/glow_shader.js';
// import shader_phong from "@js/threejs/Phong.js";


class ThreeJs_3D {
    constructor(){
        this.fov = 40;
        this.container = null; //web id container
        this.scene = null;
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
    }

    init(container) //id = container
    {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( '#F0FFF0');
        this.scene.fog = new THREE.Fog( '#F0FFF0', 200, 1000 );
        this.scene.add(new THREE.AmbientLight(0x404040));

        this.light = new THREE.DirectionalLight(0xdfebff, 0.5);//从正上方（不是位置）照射过来的平行光，0.45的强度
        this.light.position.set(50, 200, 100);
        this.light.position.multiplyScalar(0.1);
        this.light.castShadow = true;
        this.scene.add(this.light);

        // this.sky = new THREE.Sky();
        // this.sky.scale.setScalar( 450000 );
        // this.scene.add( this.sky );

        // var effectController = {
        //     turbidity: 10,
        //     rayleigh: 2,
        //     mieCoefficient: 0.005,
        //     mieDirectionalG: 0.8,
        //     inclination: 0.49, // elevation / inclination
        //     azimuth: 0.25, // Facing front,
        //     sun: ! true
        // };
        //     var uniforms = this.sky.material.uniforms;

        //     uniforms[ "turbidity" ].value = effectController.turbidity;
        //     uniforms[ "rayleigh" ].value = effectController.rayleigh;
        //     uniforms[ "mieCoefficient" ].value = effectController.mieCoefficient;
        //     uniforms[ "mieDirectionalG" ].value = effectController.mieDirectionalG;
        //     uniforms[ "sunPosition" ].value.set(400000, 400000, 400000);


        
        // ground
        // this.mesh_ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: '#FFFAFA', depthWrite: false } ) );
        // this.mesh_ground.rotation.x = - Math.PI / 2;
        // this.mesh_ground.position.y = -100;
        // this.mesh_ground.receiveShadow = true;
        // this.scene.add( this.mesh_ground );

        this.grid = new THREE.InfiniteGridHelper(10, 100); 
        this.grid_color = {
            value: 0xffffff
          };
        // this.grid.material.opacity = 0.2;
        // this.grid.material.transparent = true;
        this.scene.add( this.grid );

        this.grid.material.uniforms.uSize1 =20;
        this.grid.material.uniforms.uSize2 =151;
        //         初始化相机
        this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(-200, 50, 400 );
        this.camera.lookAt(this.scene.position);


        //         初始化控制器
        this.controls = new OrbitControls(this.camera);
        this.controls.target.set(0, 0, 0);
        this.controls.minDistance = 30;
        this.controls.maxDistance = 400;
        this.controls.maxPolarAngle = Math.PI / 2.3;
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
       // const container = document.getElementById('container');
       this.container = container;
       this.container.appendChild(this.renderer.domElement);

       //this.animated =  this.animate();

       this.animate();

      // this.loader = new GLTFLoader();

    }

    render() {
            this.renderer.render(this.scene, this.camera);

            var width  = this.container.clientWidth;
            var height = this.container.clientHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
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
