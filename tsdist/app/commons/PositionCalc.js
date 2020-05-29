"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 布局---即位置计算
// 主要用于计算 Monkey的位置，其他物体（如 ParentsLink、ParentsNode、KinshipNode、KPNodeLink 等）的位置则是通过 Monkey的位置
// 间接或直接计算出来的，所以不需要单独去计算
// 单元的位置也需要单独计算
var THREE = require("three");
var basis_1 = require("./basis");
function unitsLayout(units) {
    // 按照环带对 Unit 进行布局
    var x, z, nth, num, seg, R, theta;
    for (var i = 0; i < units.length;) {
        nth = basis_1.UNIT_RING[i];
        num = basis_1.UNITNUM_ON_RING[nth];
        seg = Math.PI * 2 / num;
        R = basis_1.STARTRADIUS + (nth + .5) * basis_1.RINGWIDTH;
        theta = Math.random() * Math.PI * 2;
        for (var j = 0; j < num && i < units.length; j++) {
            x = R * Math.cos((theta + j * seg) % (Math.PI * 2));
            z = R * Math.sin((theta + j * seg) % (Math.PI * 2));
            //console.log("units[",i,"]: ", units[i]);
            units[i].position.set(x, 0, z);
            i++;
        }
    }
}
exports.unitsLayout = unitsLayout;
function OMULayout(unit) {
    // 对 OMU 中的成员进行布局
    //console.log(" 正在给 ", unit, " 布局！")
    var adult = new Array();
    var young = new Array();
    var juvenile = new Array();
    unit.allMembers.forEach(function (m) {
        switch (m.ageLevel) {
            case "ADU" /* ADULT */:
                adult.push(m);
                break;
            case "YOU" /* YOUNG */:
                young.push(m);
                break;
            case "JUV" /* JUVENILE */:
                juvenile.push(m);
                break;
        }
    });
    adult.splice(adult.indexOf(unit.mainMale), 1);
    layerLayout(adult, "ADU" /* ADULT */);
    layerLayout(young, "YOU" /* YOUNG */);
    layerLayout(juvenile, "JUV" /* JUVENILE */);
    unit.mainMale.position.set(0, 0, 0);
}
exports.OMULayout = OMULayout;
function AMULayout(unit) {
    var members = new Array();
    unit.currentMembers.forEach(function (m) {
        members.push(m);
    });
    layerLayout(members, "ADU" /* ADULT */);
}
exports.AMULayout = AMULayout;
function FIULayout(unit) {
    AMULayout(unit);
}
exports.FIULayout = FIULayout;
// 对 Unit 的每一层的成员进行布局， 并添加层
function layerLayout(layerMembers, layerType) {
    //console.log("Layer: ", layerType, " members: ", layerMembers);
    var n = layerMembers.length;
    if (n <= 0)
        return;
    var x = 0;
    var y = 0;
    var z = 0;
    var _y;
    var rk;
    var unitRadius = layerMembers[0].unit.radius;
    switch (layerType) {
        case "ADU" /* ADULT */:
            rk = unitRadius;
            _y = y;
            //maleRatio = -1;
            break;
        case "YOU" /* YOUNG */:
            rk = unitRadius * Math.sqrt(8) / 3;
            _y = -.33 * unitRadius;
            //maleRatio = .4;
            break;
        case "JUV" /* JUVENILE */:
            rk = unitRadius * Math.sqrt(5) / 3;
            _y = -.67 * unitRadius;
            //maleRatio = .5;
            break;
        default:
            rk = unitRadius;
            _y = y;
            break;
    }
    var lay_geo = new THREE.RingGeometry(rk - .3, rk + .3, 100, 1);
    var lay_mat = new THREE.MeshBasicMaterial({ color: basis_1.LAYER_COLOR, side: THREE.DoubleSide });
    var layer = new THREE.Mesh(lay_geo, lay_mat);
    // 注意是弧度不是角度
    layer.rotateX(-Math.PI / 2);
    layer.position.set(x, y + _y, z);
    // console.log( layerType, " : ", layer.position);
    // 将 layer 添加到单元中
    layerMembers[0].unit.add(layer);
    var t = 0.017453293;
    var seg = 360 / n;
    for (var i = 0; i < n; i++) {
        var _x = Math.cos(i * seg * t) * rk;
        var _z = Math.sin(i * seg * t) * rk;
        layerMembers[i].position.set(x + _x, y + _y, z + _z);
        //console.log(layerMembers[i]," monkey position: ", layerMembers[i].position);
    }
}
function kinshipLayout(kinship) {
}
// 对有明确父母的Monkey 进行布局
function kidsLayout(kids) {
}
