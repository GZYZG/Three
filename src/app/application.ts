import * as THREE from 'three';
import { OrbitControls } from './controls/OrbitControls'
import { DragControls } from './controls/DragControls';
import { TransformControls } from './controls/TransformControls';
import { TrackballControls } from './controls/TrackballControls';
import { Stats } from './debug/stats.module';
import { OMU, AMU, FIU, Unit } from './commons/Unit';
import { Monkey } from './commons/Monkey';
import { LineGeometry} from './threelibs/LineGeometry'
import { LineMaterial} from './threelibs/LineMaterial';
import { Line2} from './threelibs/Line2';
import { GUI } from './threelibs/dat.gui.module';
import { unitsLayout, OMULayout, AMULayout, FIULayout } from './commons/PositionCalc';
import { Kinship } from './commons/Kinship';
import { Community, genFrame } from './debug/TestData';
import { CSS2DObject, CSS2DRenderer} from "./threelibs/CSS2DRenderer";
import { fillBlanks, addId2Dropdown, addGroupIds2Dropdown } from './commons/Dom';
import { isNumber, calcMonkeyCommunityPos, TICK_MODE, SET_TICK_MODE, GET_TICK, GET_TICK_MODE } from './commons/basis';

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
var COMMUNITY : Community = new Community(5);

// 为元素绑定事件
bindEvents();

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
    private labelRenderer : any;

    constructor() {
        renderer = this.renderer = new THREE.WebGLRenderer( { antialias: true , alpha: true } );
        camera = this.camera = new THREE.PerspectiveCamera(60, renderer.domElement.width / renderer.domElement.height, 1, 5000);
        scene = this.scene = new THREE.Scene();
        this.camera.position.set(100, 100, 100);
        this.camera.lookAt(0, 0, 0);
        
        //this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio );
        this.raycaster = new THREE.Raycaster();
        this.INTERSECTED = null;
        // this.createTrackballControl();
        
        rendererContainer = document.getElementsByClassName('center')[0];
        //console.log("rendererContainer:"+rendererContainer.offsetWidth);
        this.renderer.setSize(rendererContainer.offsetWidth, rendererContainer.offsetHeight);
        rendererContainer.appendChild( this.renderer.domElement );
        this.initLabelRenderer();
    
        var orbitControl = new OrbitControls(this.camera, this.labelRenderer.domElement);
        // 添加惯性
        orbitControl.enableDamping = true;
        this.orbitControl = orbitControl;

		//var info =	' "W" translate | "E" rotate | "R" scale | "+" increase size | "-" decrease size "Q" toggle world/local space |  Hold "Shift" down to snap to grid "X" toggle X | "Y" toggle Y | "Z" toggle Z | "Spacebar" toggle enabled ';
        //console.log( info );

        this.initHelpers();
        var commu = COMMUNITY ;
        this.scene.add(commu);
        commu.layout();
        //addId2Dropdown( commu );
        addGroupIds2Dropdown(commu);

        
        this.labelRenderer.domElement.addEventListener( 'mouseup', this.pickObject);
        
        window.addEventListener('resize', () => this.onWindowResize() );
        rendererContainer.addEventListener('resize', () => this.onWindowResize() );
        self = this;

        this.animate();
    }

    private initLabelRenderer() {
        this.labelRenderer = new CSS2DRenderer(); //新建CSS2DRenderer 
        this.labelRenderer.setSize( rendererContainer.offsetWidth, rendererContainer.offsetHeight);
        this.labelRenderer.domElement.style.position = 'fixed';
        this.labelRenderer.domElement.style.top = "9%";
        rendererContainer.appendChild(this.labelRenderer.domElement);
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
        

        this.axisHelper = new THREE.AxesHelper(5);
        this.scene.add(this.axisHelper);

        // var plane = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), -30 );
        // var phelper = new THREE.PlaneHelper( plane, 10000, 0x222222 );
        // this.scene.add( phelper );

        var origin = new THREE.Vector3( 0, 0, 0 );
        let headLen = 5;
        let len = 10;
        let headWidth = 2;
        var xarrowHelper = new THREE.ArrowHelper( new THREE.Vector3(1, 0, 0), origin, len, 0xff0000, headLen, headWidth );
        var yarrowHelper = new THREE.ArrowHelper( new THREE.Vector3(0, 1, 0), origin, len, 0x00ff00, headLen, headWidth );
        var zarrowHelper = new THREE.ArrowHelper( new THREE.Vector3(0, 0, 1), origin, len, 0x0000ff, headLen, headWidth );
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
        this.labelRenderer.setSize(w, h);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        //this.trackballControl.handleResize();
    }

    private animate() {

        renderer.render( scene, camera );
        this.labelRenderer.render( scene, camera );//渲染
        window.requestAnimationFrame( () => self.animate() );
        this.camera.updateMatrixWorld();
        //this.renderer.render(this.scene, this.camera);
        
        //this.trackballControl.update();
        states.update();
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
        var intersects = raycaster.intersectObjects(scene.children, true);
    
        if (intersects.length > 0 && intersects[0].object instanceof Monkey) {
            if( selected  ){
                selected.unselected();
            }
            console.log("intersected : ", intersects[0].object)
            selected = intersects[0].object;
            
            selected.selected();
            fillBlanks(selected);
           
         }//else if(selected){
        //     selected.unselected();
        // }
    }
    

}

function bindEvents(){
    var btn = $("#next")[0];
    btn.onclick = function(){
        genFrame(COMMUNITY);
    }

    $('#prev').on('click', function(e){
        console.log("你想回退？想得美！")
        //回退一个时间单位
        COMMUNITY.back(1);
    })

    // 为ID选择下拉列表增加事件
    $("#idDropdown").on('hidden.bs.dropdown',function(e){
        let id = +e.clickEvent.target.textContent;
        if( !isNumber(id))  return;
        let monkey = COMMUNITY.findMonkeyByID(id)[0];
        if(!monkey)     return;
        if( selected  ){
            selected.unselected();
        }
        console.log("intersected : ", monkey)
        selected = monkey;
        // 看向选中的Monkey，首先计算相机的位置，然后设置相机看向的位置
        let pos = calcMonkeyCommunityPos(monkey);
        let dist = pos.distanceTo(new THREE.Vector3(0, 0, 0));
        let cosAlpha = dist !=0 ? pos.x / dist : 1;
        // let cosBeta = dist !=0 ? pos.y / dist : 1;   // 为了保持相机在被观察物体的上方，所以不再y 方向上乘以步长
        let cosTheta = dist !=0 ? pos.z / dist : 1;
        camera.position.set(pos.x + cosAlpha * 60, pos.y +  60, pos.z + cosTheta * 60);
        camera.lookAt( pos);
        selected.selected();
        fillBlanks(selected);
        e.relatedTarget.textContent=e.clickEvent.target.textContent; //你点击的那个选项值：Value1或Value2
    });

    // 为时间选择列表绑定事件
    $("#tickDropdown").on('hidden.bs.dropdown',function(e){
        let tick = +e.clickEvent.target.textContent;
        let prev = +e.relatedTarget.textContent;
        if( !isNumber(tick) )   return;
        if( !isNumber(prev) )   return;
        
        console.log("从 Tick-" + prev +" => Tick-"+ tick);
        e.relatedTarget.textContent = e.clickEvent.target.textContent; //你点击的那个选项值：Value1或Value2
        if( prev >= tick){
            // 进行回退
            COMMUNITY.back(prev-tick);
            COMMUNITY.changeTickMode(GET_TICK_MODE());
        } else {
            // 前进
            COMMUNITY.forward(tick-prev);
            COMMUNITY.changeTickMode(GET_TICK_MODE());
        }
        
    });

    // 时间模式单选框，单独/累积
    // 当时间模式改变时才出发，所以可以根据触发的模式来推断上一个模式
    $('#mode input[type="radio"]').on('change', function(e){
        console.log(e.target)
        let prevMode = GET_TICK_MODE();
        
        switch( e.target.id){
            case "isolateTick":
                SET_TICK_MODE(TICK_MODE.ISOLATE);       break;
            case "accumulateTick":
                SET_TICK_MODE(TICK_MODE.ACCUMULATE);    break;
            default:
                SET_TICK_MODE(TICK_MODE.ACCUMULATE);    break;
        }
        console.log("从时间模式 " + prevMode + " => " + GET_TICK_MODE() );
        COMMUNITY.changeTickMode(GET_TICK_MODE() );
    })
}