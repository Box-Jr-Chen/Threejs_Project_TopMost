import * as THREE from "three";
import "./InfiniteGridHelper";
import MapDesign from './map.js';  // 地圖設計系統
import WH_FrameLess from './wh_frameless.js';  // 地圖設計系統
import Threejs_Area from './threejs_area.js';  // 地圖設計系統
import {Viewer} from './three-dxf/three-dxf.js';  // dxf匯入
// import { Color } from "three";
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


        //新增區域參數
        this.area_create_click=0;
        this.area_create_vertex =
        [
            {
                vertex:[]
            },
            {
                vertex:[]
            }
        ];
        this.areas_ins_add =[];
        //顯示區域的點
        this.area_create_points=[];
        //顯示區域的線
        this.area_create_lines=[];



        this.mapDesign = MapDesign.MapDesign;
        this.WH_FrameLess = WH_FrameLess.wh_frameless;
        this.Threejs_Area = Threejs_Area.ThreeJs_Area;
        this.sysInit = false;


        this.add_ins_mat = new THREE.MeshBasicMaterial( { color: "rgb(255, 255, 0)" } );
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

      //  this.grid = new THREE.InfiniteGridHelper(10, 100,new THREE.Color("rgb(130, 130, 130)"));


        this.scene.add(this.grid);

        //         初始化相机
         var  value_ = 2 ;
         this.camera = new THREE.OrthographicCamera( window.innerWidth / - value_, window.innerWidth / value_,  window.innerHeight / value_,   window.innerHeight / -value_, 0, 1000);
       //  this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, 1, 100000000); //看物件用
         this.camera.position.set(0, 500, 0 );
         this.camera.lookAt(this.scene.position);


        //         初始化控制器
        this.controls = new OrbitControls(this.camera,this.container);
        // this.controls.touches.ONE = THREE.TOUCH.PAN;
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
          this.otherender.push(this.Threejs_Area);

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
        Viewer(this.scene,this.camera,this.controls,this.container,this.width,this.height,data);

        
        
        const geometry = new THREE.PlaneGeometry( 100000, 100000 );
        const material = new THREE.MeshBasicMaterial
        ( 
            {
                 color: new THREE.Color("rgba(180, 80, 80)"),
                 side: THREE.DoubleSide,
                 transparent:true,
                 opacity:0
            } 
        );
        this.WH_FrameLess.area_create_plane = new THREE.Mesh( geometry, material );
        this.WH_FrameLess.area_create_plane.position.y = -0.1;
        this.WH_FrameLess.area_create_plane.rotation.x = -Math.PI/2;
        this.WH_FrameLess.area_create_plane.name = "area_create";
        this.scene.add( this.WH_FrameLess.area_create_plane );
        
        
    }

    //新增區域_點擊
    add_clickEvent_Area(event)
    {
       this.WH_FrameLess.add_clickEvent_Area(event,(point)=>{


                this.area_create_click ++;

                if(this.area_create_points.length ===0)
                {
                    var p =0;
                    while(p<2)
                    {
                        const geometry = new THREE.PlaneGeometry( 5, 5);
                        const material = new THREE.MeshBasicMaterial( {color: new THREE.Color("rgba(220, 220, 220)"), side: THREE.DoubleSide} );
                        const plane    = new THREE.Mesh( geometry, material );
                        plane.scale.set(1,1,1);
                        plane.rotation.x = -Math.PI/2;
                        this.area_create_points.push(plane);
                        this.scene.add( plane );
                        p++;
                    }

                }


                if(this.area_create_lines.length ===0)
                {
                    //然後畫線
                    var i = 0;
                    while(i<4)
                    {
                        const points = [];
                        points.push( new THREE.Vector3( point.x, point.y, point.z ) );
                        points.push( new THREE.Vector3( point.x, point.y, point.z ) );

                        const geometry = new THREE.BufferGeometry().setFromPoints( points );
                        const material = new THREE.LineBasicMaterial({
                            color: new THREE.Color("rgba(220, 220, 0)")
                        });
                        
                        const line = new THREE.Line( geometry, material );
                        this.area_create_lines.push(line);
                        this.scene.add( line );

                        i++;
                    }

                }


                if(this.area_create_click ===1)
                {
                    //直接給點
                    this.area_create_vertex[0].vertex.push(point.x);
                    this.area_create_vertex[0].vertex.push(point.y);
                    this.area_create_vertex[0].vertex.push(point.z);

                    this.area_create_vertex[1].vertex.push(point.x);
                    this.area_create_vertex[1].vertex.push(point.y);
                    this.area_create_vertex[1].vertex.push(point.z);


                    this.scene.add( this.area_create_points[0] );
                    this.scene.add( this.area_create_points[1] );

                    this.scene.add( this.area_create_lines[0] );
                    this.scene.add( this.area_create_lines[1] );
                    this.scene.add( this.area_create_lines[2] );
                    this.scene.add( this.area_create_lines[3] );

                    this.area_create_points[0].position.set(point.x);
                    this.area_create_points[0].position.set(point.y);
                    this.area_create_points[0].position.set(point.z);

                    this.area_create_points[1].position.set(point.x);
                    this.area_create_points[1].position.set(point.y);
                    this.area_create_points[1].position.set(point.z);

                    this.area_create_lines[0].geometry.attributes.position.array[0] = point.x;
                    this.area_create_lines[0].geometry.attributes.position.array[1] = point.y;
                    this.area_create_lines[0].geometry.attributes.position.array[2] = point.z;
                    this.area_create_lines[0].geometry.attributes.position.array[3] = point.x;
                    this.area_create_lines[0].geometry.attributes.position.array[4] = point.y;
                    this.area_create_lines[0].geometry.attributes.position.array[5] = point.z;
                    this.area_create_lines[1].geometry.attributes.position.array[0] = point.x;
                    this.area_create_lines[1].geometry.attributes.position.array[1] = point.y;
                    this.area_create_lines[1].geometry.attributes.position.array[2] = point.z;
                    this.area_create_lines[1].geometry.attributes.position.array[3] = point.x;
                    this.area_create_lines[1].geometry.attributes.position.array[4] = point.y;
                    this.area_create_lines[1].geometry.attributes.position.array[5] = point.z;
                    this.area_create_lines[2].geometry.attributes.position.array[0] = point.x;
                    this.area_create_lines[2].geometry.attributes.position.array[1] = point.y;
                    this.area_create_lines[2].geometry.attributes.position.array[2] = point.z;
                    this.area_create_lines[2].geometry.attributes.position.array[3] = point.x;
                    this.area_create_lines[2].geometry.attributes.position.array[4] = point.y;
                    this.area_create_lines[2].geometry.attributes.position.array[5] = point.z;
                    this.area_create_lines[3].geometry.attributes.position.array[0] = point.x;
                    this.area_create_lines[3].geometry.attributes.position.array[1] = point.y;
                    this.area_create_lines[3].geometry.attributes.position.array[2] = point.z;
                    this.area_create_lines[3].geometry.attributes.position.array[3] = point.x;
                    this.area_create_lines[3].geometry.attributes.position.array[4] = point.y;
                    this.area_create_lines[3].geometry.attributes.position.array[5] = point.z;
                    this.area_create_lines[0].geometry.attributes.position.needsUpdate  =  true;
                    this.area_create_lines[1].geometry.attributes.position.needsUpdate  =  true;
                    this.area_create_lines[2].geometry.attributes.position.needsUpdate  =  true;
                    this.area_create_lines[3].geometry.attributes.position.needsUpdate  =  true;

                    this.area_create_points[0].position.set(point.x,point.y,point.z);
                }
                else  if(this.area_create_click ===2)
                {
                    this.area_create_points[1].position.set(point.x,point.y,point.z);

                    //清除點跟線
                    this.clear_area_tip();

                    this.CreateArea_Add();
                
                }
       });
    }

    //新增區域_滑鼠連動
    add_clickMove_Area(event)
    {
        this.WH_FrameLess.add_clickMove_Area(event,(point)=>{
            if(this.area_create_click ===1)
            {
                this.area_create_vertex[1].vertex[0] = point.x;
                this.area_create_vertex[1].vertex[1] = point.y;
                this.area_create_vertex[1].vertex[2] = point.z;
                this.area_create_points[1].position.set(point.x,point.y,point.z);

               // console.log(this.area_create_lines);

                this.area_create_lines[0].geometry.attributes.position.array[0] = this.area_create_vertex[0].vertex[0];
                this.area_create_lines[0].geometry.attributes.position.array[1] = this.area_create_vertex[0].vertex[1];
                this.area_create_lines[0].geometry.attributes.position.array[2] = this.area_create_vertex[0].vertex[2];
                this.area_create_lines[0].geometry.attributes.position.array[3] = this.area_create_vertex[0].vertex[0];
                this.area_create_lines[0].geometry.attributes.position.array[4] = point.y;
                this.area_create_lines[0].geometry.attributes.position.array[5] = point.z;
                this.area_create_lines[0].geometry.attributes.position.needsUpdate  =  true;

                this.area_create_lines[1].geometry.attributes.position.array[0] = this.area_create_vertex[0].vertex[0];
                this.area_create_lines[1].geometry.attributes.position.array[1] = point.y;
                this.area_create_lines[1].geometry.attributes.position.array[2] = point.z;
                this.area_create_lines[1].geometry.attributes.position.array[3] = point.x;
                this.area_create_lines[1].geometry.attributes.position.array[4] = point.y;
                this.area_create_lines[1].geometry.attributes.position.array[5] = point.z;
                this.area_create_lines[1].geometry.attributes.position.needsUpdate  =  true;

                this.area_create_lines[2].geometry.attributes.position.array[0] = this.area_create_vertex[0].vertex[0];
                this.area_create_lines[2].geometry.attributes.position.array[1] = this.area_create_vertex[0].vertex[1];
                this.area_create_lines[2].geometry.attributes.position.array[2] = this.area_create_vertex[0].vertex[2];
                this.area_create_lines[2].geometry.attributes.position.array[3] = point.x;
                this.area_create_lines[2].geometry.attributes.position.array[4] = point.y;
                this.area_create_lines[2].geometry.attributes.position.array[5] = this.area_create_vertex[0].vertex[2];
                this.area_create_lines[2].geometry.attributes.position.needsUpdate  =  true;

                this.area_create_lines[3].geometry.attributes.position.array[0] = point.x;
                this.area_create_lines[3].geometry.attributes.position.array[1] = point.y;
                this.area_create_lines[3].geometry.attributes.position.array[2] = this.area_create_vertex[0].vertex[2];
                this.area_create_lines[3].geometry.attributes.position.array[3] = point.x;
                this.area_create_lines[3].geometry.attributes.position.array[4] = point.y;
                this.area_create_lines[3].geometry.attributes.position.array[5] = point.z;
                this.area_create_lines[3].geometry.attributes.position.needsUpdate  =  true;

            }
        });
    }

    
    clear_area_tip()
    {
        //清除點跟線
        this.area_create_points.forEach(e=>{
            this.scene.remove(e);
        });
        this.area_create_lines.forEach(e=>{
            this.scene.remove(e);
        });
    }


    CreateArea_Add()
    {
    
        const geometry = new THREE.BufferGeometry();
    
        const vertices = new Float32Array( [
            this.area_create_vertex[0].vertex[0], 5.0,   this.area_create_vertex[1].vertex[2],
            this.area_create_vertex[0].vertex[0], 5.0,  this.area_create_vertex[0].vertex[2],
            this.area_create_vertex[1].vertex[0], 5.0,  this.area_create_vertex[0].vertex[2],
    
    
            this.area_create_vertex[1].vertex[0], 5.0,  this.area_create_vertex[0].vertex[2],
            this.area_create_vertex[1].vertex[0], 5.0,  this.area_create_vertex[1].vertex[2],
            this.area_create_vertex[0].vertex[0], 5.0,  this.area_create_vertex[1].vertex[2],
        ] );
    
        
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        const material = this.add_ins_mat;
        const mesh = new THREE.Mesh( geometry, material );
        this.areas_ins_add.push(mesh);
    
    
        if( 
            this.area_create_vertex[0].vertex[0] >this.area_create_vertex[1].vertex[0] &&
            this.area_create_vertex[0].vertex[2] <this.area_create_vertex[1].vertex[2]
            )
        {
            mesh.scale.set(1,1,1);
        }
        else  if( 
            this.area_create_vertex[0].vertex[0] <this.area_create_vertex[1].vertex[0] &&
            this.area_create_vertex[0].vertex[2] >this.area_create_vertex[1].vertex[2]
        )
        {
            mesh.scale.set(1,1,1);
        }
        else
        {
            mesh.scale.set(1,-1,1);
        }
    
        mesh.position.set(mesh.position.x,10,mesh.position.z);
        mesh.geometry.attributes.position.dynamic =true;
        this.scene.add(mesh);
    
    
    
    }

    // CreateArea_Add_01()
    // {
    //     const geometry = new THREE.BufferGeometry();

    //     const vertices = new Float32Array( [
    //         0.0, 5.0,  0.0,
    //         0.0, 5.0,  -30.0,
    //         30.0, 5.0,  0.0,


    //         0.0, 5.0,  -30.0,
    //         30.0, 5.0,  -30.0,
    //         30.0, 5.0,  0.0,
    //     ] );

    //     // itemSize = 3 because there are 3 values (components) per vertex
    //     geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    //     const material = this.add_ins_mat;
    //     const mesh = new THREE.Mesh( geometry, material );
    //     this.areas_ins_add.push(mesh);
    //     mesh.scale.set(1,-1,1);
    //     mesh.position.set(mesh.position.x,10,mesh.position.z);
    //     mesh.geometry.attributes.position.dynamic =true;
    //     this.scene.add(mesh);

        
    // }

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

export default {ThreeJs :new ThreeJs_3D()}
