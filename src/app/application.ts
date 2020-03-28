import * as THREE from 'three';
import { OrbitControls } from './controls/OrbitControls'
import { DragControls } from './controls/DragControls';
import { TransformControls } from './controls/TransformControls';
import { TrackballControls } from './controls/TrackballControls';
import { Stats } from './debug/stats.module';
import { OMU, AMU, FIU, Unit } from './commons/Unit';
import { Monkey } from './commons/monkey';
import { LineGeometry} from './threelibs/LineGeometry'
import { LineMaterial} from './threelibs/LineMaterial';
import { Line2} from './threelibs/Line2';
import { GUI } from './threelibs/dat.gui.module';
import { UNIT_RING, UNITNUM_ON_RING, STARTRADIUS, RINGWIDTH } from './commons/basis';
import { unitsLayout } from './commons/PositionCalc';

var monkeys = new Array<Monkey>();
var camera : THREE.PerspectiveCamera;
var scene : THREE.Scene;
var renderer : THREE.WebGLRenderer;
var selected : Monkey;
var raycaster = new THREE.Raycaster();
var states : any;
var matLineUnDashed = new LineMaterial({
    linewidth: 2, // in pixels
    vertexColors: true
});
var self : any;
var rendererContainer : any;


export class Application{
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private axisHelper: THREE.AxesHelper;
    private raycaster : THREE.Raycaster;
    private INTERSECTED : Monkey;
    private mouse : THREE.Vector2;
    private stats : any;
    private trackballControl : any;
    private mouse_X : number;
    private mouse_Y : number;
    private monkeys : Set<Monkey>; 
    // controllers
    private dragControl : any;
    private transformControl : any ;
    private orbitControl : any;
    

    constructor() {
        renderer = this.renderer = new THREE.WebGLRenderer( { antialias: true , alpha: true } );
        camera = this.camera = new THREE.PerspectiveCamera(60, renderer.domElement.width / renderer.domElement.height, 1, 2000);
        scene = this.scene = new THREE.Scene();
        this.camera.position.set(100, 100, 100);
        this.camera.lookAt(0, 0, 0);
        
        //this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio );
        this.raycaster = new THREE.Raycaster();
        this.INTERSECTED = null;
        // this.createTrackballControl();
        
        rendererContainer = document.getElementsByClassName('center')[0];
        console.log("rendererContainer:"+rendererContainer.offsetWidth);
        this.renderer.setSize(rendererContainer.offsetWidth, rendererContainer.offsetHeight);
        rendererContainer.appendChild( this.renderer.domElement );

		var info =	' "W" translate | "E" rotate | "R" scale | "+" increase size | "-" decrease size "Q" toggle world/local space |  Hold "Shift" down to snap to grid "X" toggle X | "Y" toggle Y | "Z" toggle Z | "Spacebar" toggle enabled ';
        console.log( info );

        this.initHelpers();
        this.addUnits();

        var orbitControl = new OrbitControls(this.camera, this.renderer.domElement);
        // 添加惯性
        orbitControl.enableDamping = true;
        this.orbitControl = orbitControl;
        //orbitControl.addEventListener( 'change', this.animate );
        
        this.renderer.domElement.addEventListener( 'mousemove', this.pickObject);
        window.addEventListener('resize', () => this.onWindowResize() );
        rendererContainer.addEventListener('resize', () => this.onWindowResize() );
        self = this;
        this.animate();
    }

    public addUnits() {
        var units = new Array<Unit>();
        var unit:Unit;
        // 先创建一定数量的单元，但是先不设置坐标
        for(let i = 0; i < 10; i++){
            let t = Math.random();
            if( t < 0.8){
                unit = new OMU(15);
            }else if( t < 0.93 ){
                unit = new AMU(15);
            }else{
                unit = new FIU(10);
            }
            units.push(unit);
            unit.allMembers.forEach( m =>{
                monkeys.push(m);
            })
        }
        console.log("units:", units);
        // 对 单元的位置进行布局
        unitsLayout(units);
        // let x , z, nth, num, seg, R, theta;
        // for(let i = 0; i < units.length; ){
        //     nth = UNIT_RING[i];
        //     num = UNITNUM_ON_RING[nth];
        //     seg = Math.PI * 2 / num;
        //     R = STARTRADIUS + ( nth + .5 ) * RINGWIDTH ;
        //     theta = Math.random() * Math.PI * 2;
        //     for(let j = 0; j < num && i < units.length; j++){
        //         x = R * Math.cos( (theta + j * seg ) % ( Math.PI * 2) );
        //         z = R * Math.sin( (theta + j * seg ) % ( Math.PI * 2) );
        //         console.log("units[",i,"]: ", units[i]);
        //         units[i].position.set(x, 0, z);
                
        //         i++;
        //     }
            
        // }


        units.forEach( u =>{
            this.scene.add(u);
        })

        // sph.kinships.forEach(ks => {
        //     this.scene.add(ks);
        // })
        // sph2.kinships.forEach(ks => {
        //     this.scene.add(ks);
        // })
        // sph3.kinships.forEach(ks => {
        //     this.scene.add(ks);
        // })
        // sph4.kinships.forEach(ks => {
        //     this.scene.add(ks);
        // })


        
    }

    private initDragControl( objs : Array<object>) {
        this.dragControl = new DragControls(objs, this.camera, this.renderer.domElement );
        
    }

    private initTransformControl(orbitControl : any) {
        var transformControl = new TransformControls(this.camera, this.renderer.domElement);
        // transformControl.attach( sph );
        this.scene.add(transformControl);
        

        transformControl.addEventListener( 'change', this.animate );

        transformControl.addEventListener( 'dragging-changed', function ( event : any ) {

            orbitControl.enabled = ! event.value;

        } );

        window.addEventListener( 'keydown', function ( event ) {
            switch ( event.keyCode ) {

                case 81: // Q
                transformControl.setSpace( transformControl.space === "local" ? "world" : "local" );
                    break;

                case 16: // Shift
                transformControl.setTranslationSnap( 100 );
                transformControl.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
                transformControl.setScaleSnap( 0.25 );
                    break;

                case 87: // W
                transformControl.setMode( "translate" );
                    break;

                // case 69: // E
                // transformControl.setMode( "rotate" );
                //     break;

                case 82: // R
                transformControl.setMode( "scale" );
                    break;

                case 187:
                case 107: // +, =, num+
                transformControl.setSize( transformControl.size + 0.1 );
                    break;

                case 189:
                case 109: // -, _, num-
                transformControl.setSize( Math.max( transformControl.size - 0.1, 0.1 ) );
                    break;

                case 88: // X
                transformControl.showX = ! transformControl.showX;
                    break;

                case 89: // Y
                transformControl.showY = ! transformControl.showY;
                    break;

                case 90: // Z
                transformControl.showZ = ! transformControl.showZ;
                    break;

                case 32: // Spacebar
                transformControl.enabled = ! transformControl.enabled;
                    break;

            }

        } );

        window.addEventListener( 'keyup', function ( event ) {

            switch ( event.keyCode ) {

                case 17: // Ctrl
                transformControl.setTranslationSnap( null );
                transformControl.setRotationSnap( null );
                transformControl.setScaleSnap( null );
                    break;

            }

        } );
        
        this.transformControl = transformControl;

    }

    private initTrackballControl() {
        var controls = new TrackballControls( this.camera, this.renderer.domElement );

        controls.rotateSpeed = 0.3;
        controls.zoomSpeed = 0.2;
        controls.panSpeed = 0.5;

        controls.keys = [ 65, 83, 68 ];
        this.trackballControl = controls;
    }

    public onDocumentMouseDown(e : any) {
        e.preventDefault();
        var mouse = new THREE.Vector2();
        //将鼠标点击位置的屏幕坐标转成threejs中的标准坐标,具体解释见代码释义
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        //新建一个三维单位向量 假设z方向就是0.5
        //根据照相机，把这个向量转换到视点坐标系
       
    
    
    }

    public initHelpers() {
        // var helper = new THREE.CameraHelper( this.camera );
        // this.scene.add( helper );

        var gridHelper = new THREE.GridHelper( 1000, 10 );
        gridHelper.position.setY(-50);
        this.scene.add( gridHelper );

        states = this.stats = new Stats();
        var container = document.createElement( 'div' );
        container.appendChild( this.stats.domElement );
        document.getElementsByClassName('center')[0].appendChild(container);
        //document.body.appendChild( container );
        

        this.axisHelper = new THREE.AxesHelper(15);
        this.scene.add(this.axisHelper);

        // var plane = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), -30 );
        // var phelper = new THREE.PlaneHelper( plane, 10000, 0x222222 );
        // this.scene.add( phelper );

        var origin = new THREE.Vector3( 0, 0, 0 );
        var xarrowHelper = new THREE.ArrowHelper( new THREE.Vector3(1, 0, 0), origin, 29, 0xff0000, 8, 6 );
        var yarrowHelper = new THREE.ArrowHelper( new THREE.Vector3(0, 1, 0), origin, 29, 0x00ff00, 8, 6  );
        var zarrowHelper = new THREE.ArrowHelper( new THREE.Vector3(0, 0, 1), origin, 29, 0x0000ff, 8, 6  );
        this.scene.add( xarrowHelper );
        this.scene.add( yarrowHelper );
        this.scene.add( zarrowHelper );
        // this.initGui();

    }

    private onMouseMove( event : any ) {
        event.preventDefault();
        this.mouse_X = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse_Y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        // this.mouse_X = event.clientX;
        // this.mouse_Y = event.clientY;

    }


    private onWindowResize(){
        let w = rendererContainer.offsetWidth;
        let h = rendererContainer.offsetHeight;
        // this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderer.setSize( w, h);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        //this.trackballControl.handleResize();
    }

    private animate() {

        renderer.render( scene, camera );
        window.requestAnimationFrame( () => self.animate() );
        this.camera.updateMatrixWorld();
        //this.renderer.render(this.scene, this.camera);
        
        //this.trackballControl.update();
        states.update();
    }

    public createFatLineGeometry () {
        /*
        reference: https://dustinpfister.github.io/2018/11/07/threejs-line-fat-width/
        */ 
        
        // Position and Color Data
        var positions = [], colors = [], geo;

        // return geo
        positions = [0,0,0,30,0,0];
        colors = [0,0,0,0,0,0];
        geo = new LineGeometry();
        geo.setPositions(positions);
        geo.setColors(colors);
        return geo;
     
    }

    public createFatLine  () {
        // LINE MATERIAL
        var matLine = new LineMaterial({
                linewidth: 2, // in pixels
                vertexColors: true
            });
        matLine.resolution.set(window.innerWidth, window.innerHeight);
        var geo = this.createFatLineGeometry();
        var line = new Line2(geo, matLine);
        var geometry = new THREE.SphereBufferGeometry(.5,30,30);
        var material = new THREE.MeshLambertMaterial( { color: 0xff0000, side: THREE.DoubleSide } );
        var node = new THREE.Mesh(geometry, material );
        node.position.set(15, 0, 0);
        line.add( node );

        return line;
     
    }


    public initGui() {

        var gui = new GUI();

        var param = {
            'width (px)': 5,
            'dashed': false,
            'dash scale': 1,
            'color': [0,0,0],
        };

        gui.add( param, 'width (px)', 1, 10 ).onChange( function ( val : any ) {

        } );

    }

    public pickObject( event : any){
        let canvas = document.querySelector('.center canvas');
        //console.log("e.cX:"+event.clientX+"    e.cY:"+event.clientY );
        let mouse_X = ( ( event.clientX - canvas.getBoundingClientRect().left ) / canvas.clientWidth ) * 2 -1;
        let mouse_Y = - ( ( event.clientY - canvas.getBoundingClientRect().top ) / canvas.clientHeight ) * 2 + 1;

        //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
        //raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        raycaster.setFromCamera({x: mouse_X, y: mouse_Y} , camera);
        //射线和模型求交，选中一系列直线
        var intersects = raycaster.intersectObjects(monkeys);
    
        if (intersects.length > 0) {
            //选中第一个射线相交的物体
            //SELECTED = intersects[0].object;
            if( selected  ){
                selected.unselected();
            }
            selected = intersects[0].object;
            selected.selected();
            console.log(intersects[0].object)
        }else if(selected){
            selected.unselected();
        }
    }
    

}

var addRandomUnit = function(){

}