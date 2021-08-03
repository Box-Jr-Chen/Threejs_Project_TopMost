import * as THREE from "three";
class Map {
    constructor(){
        this.width=0;
        this.height=0;
        this.camera=0;
        this.material_select= new THREE.MeshLambertMaterial( { color:  "rgb(225, 225, 0)" } );
        this.material = new THREE.MeshLambertMaterial( { color:  "rgb(0, 0, 0)" } );
        this.geometry_box= new THREE.PlaneGeometry( 8, 8 );
        this.scene =null;
        this.raycaster = null;
        this.splinePointsLength = 3; //需要多少點
        this.splines={};
        this.splineHelperObjects = [];
        this.positions = [];
        this.ARC_SEGMENTS = 200;
        this.point = new THREE.Vector3();

        
        //Move
        this.pointer = new THREE.Vector2(),
        this.onUpPosition = new THREE.Vector2();
        this.onDownPosition = new THREE.Vector2();
    }
    init(width,height,camera,scene,raycaster){
        var self = this;
        self.width=width;
        self.height=height;
        self.camera=camera;
        self.scene =scene;
        self.raycaster =raycaster;


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
        curve.mesh = new THREE.Line( self.geometry.clone(), new THREE.LineBasicMaterial( {
            color: 0xff0000,
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

        self.raycaster.setFromCamera(self.pointer, self.camera);
        self.raycaster.linePrecision =0.1;
        const intersects = self.raycaster.intersectObjects( self.splineHelperObjects );
        
        if ( intersects.length > 0 ) {

            const object = intersects[0].object;

            self.splineHelperObjects.forEach(element => {
                if(element == object)
                {
                    element.material = self.material_select;
                    self.spline_Object_select.main = element;
                }
                else
                {
                    element.material = self.material;
                }
            });
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
        self.updateSplineOutline();
    }
    getScreenPos(Mesh){
        var self = this;

        var widthHalf = self.width / 2, heightHalf = self.height / 2;

        var pos = Mesh.position.clone();
        pos.project(self.camera);
        pos.x = ( pos.x * widthHalf ) + widthHalf;
        pos.y = - ( pos.y * heightHalf ) + heightHalf;
        return pos;
    }

    ScreenToWorldPos(pos){
        var self = this;

        var coords = new THREE.Vector3;
        var worldPosition = new THREE.Vector3()
        var plane = new THREE.Plane(new THREE.Vector3(0.0, 1.0, 0.0))
        var raycaster = new THREE.Raycaster()

        coords.set(
            (pos.x / self.width) * 2 - 1,
            -(pos.y / self.height) * 2 + 1,
            0.5
        );

        raycaster.setFromCamera(coords, self.camera);
	    return raycaster.ray.intersectPlane(plane, worldPosition);
    }
}

export default {Map :new Map()}