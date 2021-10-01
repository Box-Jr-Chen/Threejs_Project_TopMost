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

       // this.add_ins_mat = new THREE.MeshBasicMaterial( { color: "rgb(255, 255, 0)" } );
    }

    init(container,action_init) //id = container
    {

        if(this.container !==null)
        {
            this.container = null;
            this.container = container;
           
            this.container.appendChild(this.renderer.domElement);
 
            this.camera.position.set(0, 750, 350 );
            this.controls =null;
            this.controls = new OrbitControls(this.camera,this.container);
            this.controls.target.set(0, 0, 0);
            this.controls.rotateSpeed *= 1;
            this.controls.minDistance = 10;
            this.controls.maxDistance = 1000;
            this.controls.maxPolarAngle = Math.PI / 2.3;
            this.controls.update();
            this.controls.enabled = true;


           // console.log(this.controls);
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
         this.camera.position.set(0, 750, 350 );
         this.camera.lookAt(this.scene.position);


        //         初始化控制器
        this.controls = new OrbitControls(this.camera,this.container);
        this.controls.target.set(0, 0, 0);
        this.controls.rotateSpeed *= 1;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 1000;
        this.controls.maxPolarAngle = Math.PI / 2.3;
        this.controls.update();
        this.controls.enabled = true;

        //BOX
        const geometry = new THREE.BoxGeometry( 100, 100, 100 );
        const material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
        const cube = new THREE.Mesh( geometry, material );
        this.scene.add( cube );


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




    CreateArea_Add_01()
    {
        const geometry = new THREE.BufferGeometry();

        const vertices = new Float32Array( [
            0.0, 5.0,  0.0,
            0.0, 5.0,  -30.0,
            30.0, 5.0,  0.0,


            0.0, 5.0,  -30.0,
            30.0, 5.0,  -30.0,
            30.0, 5.0,  0.0,
        ] );

        // itemSize = 3 because there are 3 values (components) per vertex
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        const material = this.add_ins_mat;
        const mesh = new THREE.Mesh( geometry, material );
        this.areas_ins_add.push(mesh);
        mesh.scale.set(1,-1,1);
        mesh.position.set(mesh.position.x,10,mesh.position.z);
        mesh.geometry.attributes.position.dynamic =true;
        this.scene.add(mesh);

        
    }

    CreateArea_Delete_01(){
            this.scene.remove(this.areas_ins_add[0]);
            this.areas_ins_add[0] =null;
            this.areas_ins_add =[];
    }

    ModifyArea_01(L_X,L_Z,R_X,R_Z)
    {
        this.areas_ins_add =[];

        for(var i=0;i<this.WH_FrameLess.line_AREA.length;i++)
        {
            this.WH_FrameLess.line_AREA[i].visible = false ;
            this.WH_FrameLess.line_GROUP[i].visible = false ;
        }

        const geometry = new THREE.BufferGeometry();

        const vertices = new Float32Array( [
            L_X, 5.0,  R_Z,
            L_X, 5.0,   L_Z,
            R_X, 5.0,  R_Z,


            L_X, 5.0,  L_Z,
            R_X, 5.0,  L_Z,
            R_X, 5.0,  R_Z,
        ] );

        // itemSize = 3 because there are 3 values (components) per vertex
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        const material = this.add_ins_mat;
        const mesh = new THREE.Mesh( geometry, material );
        this.areas_ins_add.push(mesh);
        mesh.scale.set(1,-1,1);
        mesh.position.set(mesh.position.x,10,mesh.position.z);
        mesh.geometry.attributes.position.dynamic =true;
        this.scene.add(mesh);


    }

    ModifyArea_cancel_01()
    {
        for(var i=0;i<this.WH_FrameLess.line_AREA.length;i++)
        {
            this.WH_FrameLess.line_AREA[i].visible = true ;
            this.WH_FrameLess.line_GROUP[i].visible = true ;
        }
    }


    Areas_DeleteAll()
    {
        for(var i=0;i<this.areas_ins.length;i++)
        {
            this.scene.remove(this.areas_ins[i]);
            this.areas_ins[i] =null;
        }

        this.areas_ins =[];

    }

    
}

export default {ThreeJs_Area :new ThreeJs_Area()}
