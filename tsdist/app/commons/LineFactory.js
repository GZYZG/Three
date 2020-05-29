"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var LineGeometry_1 = require("../threelibs/LineGeometry");
var LineMaterial_1 = require("../threelibs/LineMaterial");
var Line2_1 = require("../threelibs/Line2");
var THREE = require("three");
var basis_1 = require("./basis");
var ParentsLink = /** @class */ (function (_super) {
    __extends(ParentsLink, _super);
    function ParentsLink(dad, mom, linkType) {
        if (linkType === void 0) { linkType = "line"; }
        var _this = _super.call(this) || this;
        _this.father = dad;
        _this.mother = mom;
        var geo;
        switch (linkType) {
            case "line":
                geo = _this.lineTypeGeometry();
                break;
            case "curve":
                console.log("curve parentslink");
                geo = _this.curveTypeGeometry();
                break;
            default:
                geo = _this.lineTypeGeometry();
                break;
        }
        var mat = new LineMaterial_1.LineMaterial({
            linewidth: basis_1.PARENTS_LINK_WIDTH,
            vertexColors: true
        });
        mat.resolution.set(window.innerWidth, window.innerHeight);
        _this.geometry = geo;
        _this.material = mat;
        return _this;
    }
    ParentsLink.prototype.lineTypeGeometry = function () {
        var geo = new LineGeometry_1.LineGeometry();
        var fp = basis_1.calcMonkeyCommunityPos(this.father);
        var mp = basis_1.calcMonkeyCommunityPos(this.mother);
        geo.setPositions(new Array(fp.x, fp.y, fp.z, mp.x, mp.y, mp.z));
        geo.setColors(new Array(0, 0, 1, 0, 0, 1));
        return geo;
    };
    ParentsLink.prototype.curveTypeGeometry = function () {
        var geo = new LineGeometry_1.LineGeometry();
        var pos1 = basis_1.calcMonkeyCommunityPos(this.father);
        var pos2 = basis_1.calcMonkeyCommunityPos(this.mother);
        var mid = pos1.clone().add(pos2).divideScalar(2);
        mid.setY(mid.y * 4 / 3 + 5);
        var curve = new THREE.CatmullRomCurve3([
            pos1, mid, pos2
        ]);
        var points = curve.getPoints(50);
        var positions = new Array();
        var colors = new Array();
        points.forEach(function (p) {
            positions.push(p.x, p.y, p.z);
            colors.push(0, 0, 1);
        });
        var geo = new LineGeometry_1.LineGeometry();
        geo.setPositions(positions);
        geo.setColors(colors);
        return geo;
    };
    return ParentsLink;
}(Line2_1.Line2));
exports.ParentsLink = ParentsLink;
var KPNodeLink = /** @class */ (function (_super) {
    __extends(KPNodeLink, _super);
    function KPNodeLink(parentsNode, kinshipNode, type) {
        if (type === void 0) { type = "curve"; }
        var _this = _super.call(this) || this;
        _this.kinshipNode = kinshipNode;
        _this.parentsNode = parentsNode;
        var geo;
        switch (type) {
            case "line":
                geo = _this.lineTypeGeometry();
                break;
            case "curve":
                geo = _this.curveTypeGeometry();
                break;
            default:
                geo = _this.curveTypeGeometry();
                break;
        }
        var mat = new LineMaterial_1.LineMaterial({
            linewidth: basis_1.SHIP_PARENTS_NODE_LINK_WIDTH,
            vertexColors: true
        });
        mat.resolution.set(window.innerWidth, window.innerHeight);
        _this.geometry = geo;
        _this.material = mat;
        return _this;
    }
    KPNodeLink.prototype.lineTypeGeometry = function () {
        var geo = new LineGeometry_1.LineGeometry();
        var pn = this.parentsNode.position;
        var kn = this.kinshipNode.position;
        geo.setPositions(new Array(pn.x, pn.y, pn.z, kn.x, kn.y, kn.z));
        geo.setColors(new Array(0, 0, 0, 1, 2, 3));
        return geo;
    };
    KPNodeLink.prototype.curveTypeGeometry = function () {
        var pos1 = this.parentsNode.position.clone();
        var pos2 = this.kinshipNode.position.clone();
        var mid = pos1.clone().add(pos2).divideScalar(2);
        mid.setY(mid.y * 4 / 3);
        var curve = new THREE.CatmullRomCurve3([
            pos1, mid, pos2
        ]);
        var points = curve.getPoints(50);
        var positions = new Array();
        var colors = new Array();
        points.forEach(function (p) {
            positions.push(p.x, p.y, p.z);
            colors.push(0, 0, 1);
        });
        var geo = new LineGeometry_1.LineGeometry();
        geo.setPositions(positions);
        geo.setColors(colors);
        return geo;
    };
    return KPNodeLink;
}(Line2_1.Line2));
exports.KPNodeLink = KPNodeLink;
var KidKinshipNodeLink = /** @class */ (function (_super) {
    __extends(KidKinshipNodeLink, _super);
    function KidKinshipNodeLink(kinshipNode, kid) {
        var _this = _super.call(this) || this;
        _this.geometry = geo;
        _this.material = mat;
        _this.kinshipNode = kinshipNode;
        var geo = new LineGeometry_1.LineGeometry();
        // 将kid的不作为kinshipnode的子节点，所以要计算孩子的社群位置
        // let kn = calcMonkeyCommunityPos(kid);
        // kn.add( this.kinshipNode.position.clone().negate() );
        // 将孩子的分身以add的方法作为kinshipnode的子节点， 所以直接使用孩子的相对位置，即position
        var kn = kid.position;
        //console.log(pn, kn);
        //geo.setPositions(new Array(pn.x, pn.y, pn.z, kn.x, kn.y, kn.z ) );
        geo.setPositions(new Array(0, 0, 0, kn.x, kn.y, kn.z));
        geo.setColors(new Array(0, 1, 0, 0, 1, 0));
        var mat = new LineMaterial_1.LineMaterial({
            linewidth: basis_1.KID_SHIP_NODE_LINK_WIDTH,
            vertexColors: true
        });
        mat.resolution.set(window.innerWidth, window.innerHeight);
        _this.geometry = geo;
        _this.material = mat;
        return _this;
    }
    return KidKinshipNodeLink;
}(Line2_1.Line2));
exports.KidKinshipNodeLink = KidKinshipNodeLink;
