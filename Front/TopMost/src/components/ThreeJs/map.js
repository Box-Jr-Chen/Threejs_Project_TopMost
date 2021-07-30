import * as THREE from "three";
class Map {
    constructor(){
        this.width=0;
        this.height=0;
        this.camera=0;
        this.geometry = new THREE.BufferGeometry();
        this.splinePointsLength = 0; //需要多少點
        this.splines={};
        this.splineHelperObjects = [];
    }
    init(width,height,camera){

        this.width=width;
        this.height=height;
        this.camera=camera;

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(self.ARC_SEGMENTS*3),3));
   
        let curve = new THREE.CatmullRomCurve3(self.positions);
        curve.curveType = 'catmullrom';
        curve.mesh = new THREE.Line( self.geometry.clone(), new THREE.LineBasicMaterial( {
            color: 0xff0000,
            opacity: 1
        } ) );
        curve.mesh.castShadow = false;

        self.splines.uniform = curve;
        for ( const k in self.splines ) {

            const spline = self.splines[ k ];
            self.scene.add(spline.mesh);
        }

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

    updateSplineOutline(){
        var self =this;
        for ( const k in self.splines ) {

            const spline = self.splines[ k ];

            const splineMesh = spline.mesh;
            const position = splineMesh.geometry.attributes.position;

            for ( let i = 0; i < self.ARC_SEGMENTS; i ++ ) {

                const t = i / ( self.ARC_SEGMENTS - 1 );
                spline.getPoint( t, self.point );
                position.setXYZ( i, self.point.x, self.point.y, self.point.z );

            }

            position.needsUpdate = true;

        }
    }

    addSplineObject(position) {
        var self =this;

        const object = new THREE.Mesh( self.geometry, self.material );
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