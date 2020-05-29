"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("three");
var OrbitControls_1 = require("./controls/OrbitControls");
var DragControls_1 = require("./controls/DragControls");
var TransformControls_1 = require("./controls/TransformControls");
var TrackballControls_1 = require("./controls/TrackballControls");
var stats_module_1 = require("./debug/stats.module");
var monkey_1 = require("./commons/monkey");
var LineMaterial_1 = require("./threelibs/LineMaterial");
var dat_gui_module_1 = require("./threelibs/dat.gui.module");
var TestData_1 = require("./debug/TestData");
var monkeys = new Array();
var camera;
var scene;
var renderer;
var selected;
var raycaster = new THREE.Raycaster();
var states;
var matLineUnDashed = new LineMaterial_1.LineMaterial({
    linewidth: 2,
    vertexColors: true
});
var self;
var rendererContainer;
var Application = /** @class */ (function () {
    function Application() {
        var _this = this;
        renderer = this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        camera = this.camera = new THREE.PerspectiveCamera(60, renderer.domElement.width / renderer.domElement.height, 1, 5000);
        scene = this.scene = new THREE.Scene();
        this.camera.position.set(100, 100, 100);
        this.camera.lookAt(0, 0, 0);
        //this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.raycaster = new THREE.Raycaster();
        this.INTERSECTED = null;
        // this.createTrackballControl();
        rendererContainer = document.getElementsByClassName('center')[0];
        console.log("rendererContainer:" + rendererContainer.offsetWidth);
        this.renderer.setSize(rendererContainer.offsetWidth, rendererContainer.offsetHeight);
        rendererContainer.appendChild(this.renderer.domElement);
        var info = ' "W" translate | "E" rotate | "R" scale | "+" increase size | "-" decrease size "Q" toggle world/local space |  Hold "Shift" down to snap to grid "X" toggle X | "Y" toggle Y | "Z" toggle Z | "Spacebar" toggle enabled ';
        console.log(info);
        this.initHelpers();
        var commu = new TestData_1.Community(12);
        this.scene.add(commu);
        commu.layout();
        var orbitControl = new OrbitControls_1.OrbitControls(this.camera, this.renderer.domElement);
        // 添加惯性
        orbitControl.enableDamping = true;
        this.orbitControl = orbitControl;
        //orbitControl.addEventListener( 'change', this.animate );
        this.renderer.domElement.addEventListener('mousemove', this.pickObject);
        window.addEventListener('resize', function () { return _this.onWindowResize(); });
        rendererContainer.addEventListener('resize', function () { return _this.onWindowResize(); });
        self = this;
        this.animate();
    }
    Application.prototype.initDragControl = function (objs) {
        this.dragControl = new DragControls_1.DragControls(objs, this.camera, this.renderer.domElement);
    };
    Application.prototype.initTransformControl = function (orbitControl) {
        var transformControl = new TransformControls_1.TransformControls(this.camera, this.renderer.domElement);
        // transformControl.attach( sph );
        this.scene.add(transformControl);
        transformControl.addEventListener('change', this.animate);
        transformControl.addEventListener('dragging-changed', function (event) {
            orbitControl.enabled = !event.value;
        });
        window.addEventListener('keydown', function (event) {
            switch (event.keyCode) {
                case 81: // Q
                    transformControl.setSpace(transformControl.space === "local" ? "world" : "local");
                    break;
                case 16: // Shift
                    transformControl.setTranslationSnap(100);
                    transformControl.setRotationSnap(THREE.MathUtils.degToRad(15));
                    transformControl.setScaleSnap(0.25);
                    break;
                case 87: // W
                    transformControl.setMode("translate");
                    break;
                // case 69: // E
                // transformControl.setMode( "rotate" );
                //     break;
                case 82: // R
                    transformControl.setMode("scale");
                    break;
                case 187:
                case 107: // +, =, num+
                    transformControl.setSize(transformControl.size + 0.1);
                    break;
                case 189:
                case 109: // -, _, num-
                    transformControl.setSize(Math.max(transformControl.size - 0.1, 0.1));
                    break;
                case 88: // X
                    transformControl.showX = !transformControl.showX;
                    break;
                case 89: // Y
                    transformControl.showY = !transformControl.showY;
                    break;
                case 90: // Z
                    transformControl.showZ = !transformControl.showZ;
                    break;
                case 32: // Spacebar
                    transformControl.enabled = !transformControl.enabled;
                    break;
            }
        });
        window.addEventListener('keyup', function (event) {
            switch (event.keyCode) {
                case 17: // Ctrl
                    transformControl.setTranslationSnap(null);
                    transformControl.setRotationSnap(null);
                    transformControl.setScaleSnap(null);
                    break;
            }
        });
        this.transformControl = transformControl;
    };
    Application.prototype.initTrackballControl = function () {
        var controls = new TrackballControls_1.TrackballControls(this.camera, this.renderer.domElement);
        controls.rotateSpeed = 0.3;
        controls.zoomSpeed = 0.2;
        controls.panSpeed = 0.5;
        controls.keys = [65, 83, 68];
        this.trackballControl = controls;
    };
    Application.prototype.onDocumentMouseDown = function (e) {
        e.preventDefault();
        var mouse = new THREE.Vector2();
        //将鼠标点击位置的屏幕坐标转成threejs中的标准坐标,具体解释见代码释义
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        //新建一个三维单位向量 假设z方向就是0.5
        //根据照相机，把这个向量转换到视点坐标系
    };
    Application.prototype.initHelpers = function () {
        // var helper = new THREE.CameraHelper( this.camera );
        // this.scene.add( helper );
        var gridHelper = new THREE.GridHelper(1000, 10);
        gridHelper.position.setY(-50);
        this.scene.add(gridHelper);
        states = this.stats = new stats_module_1.Stats();
        var container = document.createElement('div');
        container.appendChild(this.stats.domElement);
        document.getElementsByClassName('center')[0].appendChild(container);
        //document.body.appendChild( container );
        this.axisHelper = new THREE.AxesHelper(5);
        this.scene.add(this.axisHelper);
        // var plane = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), -30 );
        // var phelper = new THREE.PlaneHelper( plane, 10000, 0x222222 );
        // this.scene.add( phelper );
        var origin = new THREE.Vector3(0, 0, 0);
        var headLen = 5;
        var len = 10;
        var headWidth = 2;
        var xarrowHelper = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, len, 0xff0000, headLen, headWidth);
        var yarrowHelper = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), origin, len, 0x00ff00, headLen, headWidth);
        var zarrowHelper = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, len, 0x0000ff, headLen, headWidth);
        this.scene.add(xarrowHelper);
        this.scene.add(yarrowHelper);
        this.scene.add(zarrowHelper);
        // this.initGui();
    };
    Application.prototype.onMouseMove = function (event) {
        event.preventDefault();
        this.mouse_X = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse_Y = -(event.clientY / window.innerHeight) * 2 + 1;
        // this.mouse_X = event.clientX;
        // this.mouse_Y = event.clientY;
    };
    Application.prototype.onWindowResize = function () {
        var w = rendererContainer.offsetWidth;
        var h = rendererContainer.offsetHeight;
        // this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderer.setSize(w, h);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        //this.trackballControl.handleResize();
    };
    Application.prototype.animate = function () {
        renderer.render(scene, camera);
        window.requestAnimationFrame(function () { return self.animate(); });
        this.camera.updateMatrixWorld();
        //this.renderer.render(this.scene, this.camera);
        //this.trackballControl.update();
        states.update();
    };
    Application.prototype.initGui = function () {
        var gui = new dat_gui_module_1.GUI();
        var param = {
            'width (px)': 5,
            'dashed': false,
            'dash scale': 1,
            'color': [0, 0, 0],
        };
        gui.add(param, 'width (px)', 1, 10).onChange(function (val) {
        });
    };
    Application.prototype.pickObject = function (event) {
        var canvas = document.querySelector('.center canvas');
        //console.log("e.cX:"+event.clientX+"    e.cY:"+event.clientY );
        var mouse_X = ((event.clientX - canvas.getBoundingClientRect().left) / canvas.clientWidth) * 2 - 1;
        var mouse_Y = -((event.clientY - canvas.getBoundingClientRect().top) / canvas.clientHeight) * 2 + 1;
        //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
        //raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        raycaster.setFromCamera({ x: mouse_X, y: mouse_Y }, camera);
        //射线和模型求交，选中一系列直线
        var intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0 && intersects[0].object instanceof monkey_1.Monkey) {
            if (selected) {
                selected.unselected();
            }
            console.log("intersected : ", intersects[0].object);
            selected = intersects[0].object;
            selected.selected();
        }
        else if (selected) {
            selected.unselected();
        }
    };
    return Application;
}());
exports.Application = Application;
