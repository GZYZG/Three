"use strict";
console.log("hahah");
var _three = require(["./three"]);

var THREE = _interopRequireWildcard(_three);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//import defaultExport from "/three.js"
//import {Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh} from 'three'
//var THREE = require(['three']);


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerHeight / window.innerWidth, 1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 15;

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();