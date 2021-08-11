import * as THREE from "three";
class MapDesign {
    constructor(){
        this.Sys_MapStatus={
            'none':0,
            'select':1,
            'addpoint':2,
            'removepoint':3
        };
        this.Sys_Status_now = this.Sys_MapStatus.select;
        this.width=0;
        this.height=0;
        this.camera=0;
        this.mouseMove_x =false;
        this.mouseMove_y =false;
        this.mouseEnter_x=false,
        this.mouseEnter_y=false,
        this.mouse_x_offsetX =0,
        this.mouse_x_offsetY =0,
        this.material_select= new THREE.MeshLambertMaterial( { color:  "rgb(225, 225, 0)" } );
        this.material = new THREE.MeshLambertMaterial( { color:  "rgb(00, 0, 0)" } );
        this.geometry_box= new THREE.PlaneGeometry( 8, 8 );
        this.scene =null;
        this.splinePointsLength = 3; //需要多少點
        this.splines={};
        this.splineHelperObjects = [];
        this.positions = [];
        this.ARC_SEGMENTS = 200;
        this.point = new THREE.Vector3();
        this.spline_Object_select = {
            main:null,
            pos_screen:null,
        };
        //Move
        this.pointer = new THREE.Vector2(),
        this.onUpPosition = new THREE.Vector2();
        this.onDownPosition = new THREE.Vector2();
    }
    init(width,height,camera,scene){
        var self = this;
        self.width= width;
        self.height=height;
        self.camera=camera;
        self.scene =scene;


        // console.log(self.width);
        // console.log(self.height);

        for ( let i = 0; i < self.splinePointsLength; i ++ ) {
            self.addSplineObject(self.positions[i]);
        }

        self.positions.length = 0;

        for ( let i = 0; i < self.splinePointsLength; i ++ ) {
            self.positions.push( self.splineHelperObjects[i].position );
        }

        self.geometry = new THREE.BufferGeometry();
        self.geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(self.ARC_SEGMENTS*3),3));
   
        let curve = new THREE.CatmullRomCurve3(self.positions);
        curve.curveType = 'catmullrom';
        var linecolor =  new THREE.Color("rgb(225, 225, 225)");
        curve.mesh = new THREE.Line( self.geometry.clone(), new THREE.LineBasicMaterial( {
            // color: 0xff0000,
            color: linecolor,
            opacity: 1
        } ) );
        curve.mesh.castShadow = false;

        self.splines.uniform = curve;


       // console.log(self.splines.uniform);

        for ( const k in self.splines ) {

            const spline = self.splines[k];
            self.scene.add(spline.mesh);
        }

        self.load( 
            [
                new THREE.Vector3( 0, 0,13 ),
                new THREE.Vector3( 13, 0, 0 ),
                new THREE.Vector3( -13, 0, - 13 )
            ] 
            ); 

        self.splines.uniform.tension = 0;
    }

    addPoint(){
        var self =this;
        self.splinePointsLength ++;

        self.positions.push( self.addSplineObject().position );
        
        self.updateSplineOutline();
    }

    removePoint() {
        var self =this;
        if ( self.splinePointsLength <= 4 ) {
            return;
        }

        const point = self.splineHelperObjects.pop();
        self.splinePointsLength --;
        self.positions.pop();

        if (self.transformControl.object === point) 
                        self.transformControl.detach();

        self.scene.remove(point);

        self.updateSplineOutline();

    }

    onPointerDown_move( event ) {
        var self =this;


        self.onDownPosition.x = event.clientX;
        self.onDownPosition.y = event.clientY;

        self.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
         self.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  

        // console.log(self.onDownPosition.x+";"+self.onDownPosition.y);
        // console.log(self.pointer.x+";"+self.pointer.y);
        var raycaster = new THREE.Raycaster(); // create once

        raycaster.setFromCamera(self.pointer, self.camera);
       // this.raycaster.linePrecision =0.1;

        // console.log(this.raycaster);
        // console.log(this.pointer);
        // console.log(this.camera);

        const intersects = raycaster.intersectObjects( this.splineHelperObjects );
       // console.log(intersects);
        if ( intersects.length > 0 ) {

            const object = intersects[0].object;

            console.log(object);

            self.splineHelperObjects.forEach(element => {
                // console.log(element);
                if(element == object)
                {
                    element.material = self.material_select;
                    self.spline_Object_select.main = element;
                    self.spline_Object_select.pos_screen = self.getScreenPos(self.spline_Object_select.main);
                    //console.log(self.spline_Object_select.pos_screen);
                }
                else
                {
                    element.material = self.material;
                }
            });
        }
        else
        {
            if(this.mouseEnter_x == false && this.mouseEnter_y == false)
            {
                //如果沒有點選東西 把點選的東西取消掉
                if(this.spline_Object_select.main !=null)
                {
                    this.spline_Object_select.main.material = self.material;
                    this.spline_Object_select.main =null;
                    this.spline_Object_select.pos_screen =null;
                }
            }
    
        }
    }

    onPointerUp_move() {
        var self =this;
        self.onUpPosition.x = event.clientX;
        self.onUpPosition.y = event.clientY;

       // if ( self.onDownPosition.distanceTo( self.onUpPosition ) === 0 ) self.transformControl.detach();

    }

    updateSplineOutline(){
        var self =this;
        for ( const k in self.splines ) {

            const spline = self.splines[k];

            const splineMesh = spline.mesh;
            const position = splineMesh.geometry.attributes.position;

            //console.log(self.ARC_SEGMENTS);

            for ( let i = 0; i < self.ARC_SEGMENTS; i ++ ) {

                const t = i / ( self.ARC_SEGMENTS - 1 );
                spline.getPoint( t, self.point );
                position.setXYZ( i, self.point.x, self.point.y, self.point.z );
            }
            position.needsUpdate = true;

            //console.log(position);
        }
    }

    addSplineObject(position) {
        var self =this;
        //console.log(position);
        const object = new THREE.Mesh( self.geometry_box, self.material );
        object.rotation.x = THREE.Math.degToRad( -90 );
        object.geometry.computeBoundingBox();
        if ( position ) {
            object.position.copy( position );
        } 

        self.scene.add(object);
        self.splineHelperObjects.push(object);

        return object;
    }

    load( new_positions ) {

        var self =this;
 
        while ( new_positions.length > self.positions.length ) {
            self.addPoint();
        }

        while ( new_positions.length < self.positions.length ) {
            self.removePoint();
        }

        for ( let i = 0; i < self.positions.length; i ++ ) {
            self.positions[ i ].copy( new_positions[ i ] );
        }

        self.updateSplineOutline();
    }
    render() {
       var self = this;
        self.splines.uniform.mesh.visible = true;

        self.getSelectPos_Main();
        self.updateSplineOutline();

    }
    getScreenPos(Mesh){
        var self = this;

        var widthHalf = self.width / 2, heightHalf = self.height / 2;

        // console.log(self.width);
        // console.log(self.height);

        var pos = Mesh.position.clone();
        pos.project(self.camera);
        pos.x = ( pos.x * widthHalf ) + widthHalf;
        pos.y = - ( pos.y * heightHalf ) + heightHalf;
        return pos;
    }
    getSelectPos_Main()
    {
        var self =this;
        if(self.spline_Object_select.main !=null)
        {
            
            self.spline_Object_select.pos_screen = self.getScreenPos(self.spline_Object_select.main );
            //console.log(self.spline_Object_select.main);
        }
  
    }
    ScreenToWorldPos(pos){
        var self = this;

        var coords = new THREE.Vector3;
        var worldPosition = new THREE.Vector3()
        var plane = new THREE.Plane(new THREE.Vector3(0.0, 1.0, 0.0))
        var raycaster_worldPos = new THREE.Raycaster()

        coords.set(
            (pos.x / self.width) * 2 - 1,
            -(pos.y / self.height) * 2 + 1,
            0.5
        );

        raycaster_worldPos.setFromCamera(coords, self.camera);
	    return raycaster_worldPos.ray.intersectPlane(plane, worldPosition);
    }
    mousemove(X,Y)
    {
        if(this.mouseMove_x)
        {
            // this.controls.enabled = false;
            var move_x =0;
            if(this.mouse_x_offsetX !=0)
            {
                move_x = X - this.mouse_x_offsetX ;
                // console.log(move);
                move_x = this.normalize(move_x,0,10) *10;
                // console.log(move);
            }            

            this.mouse_x_offsetX = X;

            this.spline_Object_select.pos_screen.x = this.spline_Object_select.pos_screen.x + move_x;
            var  screentoworldpos_x =  this.ScreenToWorldPos(this.spline_Object_select.pos_screen);
            this.spline_Object_select.main.position.x = screentoworldpos_x.x;
            this.spline_Object_select.main.position.y = screentoworldpos_x.y;
        }

        if(this.mouseMove_y)
        {
            // this.controls.enabled = false;
            var move_y =0;
            if(this.mouse_x_offsetY !=0)
            {
                move_y = Y - this.mouse_x_offsetY ;
                move_y = this.normalize(move_y,0,10) *8;
            }            

            this.mouse_x_offsetY = Y;
            this.spline_Object_select.pos_screen.y = this.spline_Object_select.pos_screen.y + move_y;
            var  screentoworldpos_y =  this.ScreenToWorldPos(this.spline_Object_select.pos_screen);
            this.spline_Object_select.main.position.x = screentoworldpos_y.x;
            this.spline_Object_select.main.position.z = screentoworldpos_y.z;
        }
    }
    mouseup(){
        this.mouseMove_x  = false;
        this.mouseMove_y  = false;
        this.mouseEnter_x = false;
        this.mouseEnter_y = false;
    }
    normalize(val, min, max){
        // Shift to positive to avoid issues when crossing the 0 line
        if(min < 0){
          max += 0 - min;
          val += 0 - min;
          min = 0;
        }
        // Shift values from 0 - max
        val = val - min;
        max = max - min;
        return Math.max(-1, Math.min(1, val / max));
    }
}

export default {MapDesign :new MapDesign()}