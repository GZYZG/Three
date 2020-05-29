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
var LineFactory_1 = require("./LineFactory");
var THREE = require("three");
var basis_1 = require("./basis");
var KinshipNode = /** @class */ (function (_super) {
    __extends(KinshipNode, _super);
    function KinshipNode() {
        var _this = _super.call(this) || this;
        _this._kids = new Array();
        _this.geometry = new THREE.SphereBufferGeometry(basis_1.SHIP_NODE_RADIUS, 30, 30);
        _this.material = new THREE.MeshLambertMaterial({ color: 0x000088, vertexColors: true, side: THREE.DoubleSide });
        return _this;
    }
    Object.defineProperty(KinshipNode.prototype, "kids", {
        get: function () {
            return this._kids;
        },
        enumerable: true,
        configurable: true
    });
    KinshipNode.prototype.addKid = function (kid) {
        this._kids.push(kid);
        this.attach(kid);
    };
    return KinshipNode;
}(THREE.Mesh));
exports.KinshipNode = KinshipNode;
var ParentsNode = /** @class */ (function (_super) {
    __extends(ParentsNode, _super);
    function ParentsNode(father, mother) {
        var _this = _super.call(this) || this;
        _this.father = father;
        _this.mother = mother;
        _this.geometry = new THREE.SphereBufferGeometry(basis_1.SHIP_NODE_RADIUS, 30, 30);
        _this.material = new THREE.MeshLambertMaterial({ color: 0x000088, vertexColors: true, side: THREE.DoubleSide });
        return _this;
    }
    return ParentsNode;
}(THREE.Mesh));
exports.ParentsNode = ParentsNode;
var Kinship = /** @class */ (function (_super) {
    __extends(Kinship, _super);
    function Kinship(father, mother, kids) {
        var _this = _super.call(this) || this;
        _this.father = father;
        _this.mother = mother;
        _this.kids = kids;
        return _this;
    }
    Kinship.prototype.layout = function () {
        this.addParentsLink();
        this.addParentsNode();
        this.addKinshipNode();
        this.addKPNodeLink();
        this.addKidsKinshipLink();
    };
    Kinship.prototype.addParentsLink = function () {
        var link;
        if (this.father.unit != this.mother.unit) {
            link = new LineFactory_1.ParentsLink(this.father, this.mother, "curve");
        }
        else {
            link = new LineFactory_1.ParentsLink(this.father, this.mother, "line");
        }
        this.parentsLink = link;
        console.log("parentsLink:", this.parentsLink);
        this.attach(this.parentsLink);
    };
    Kinship.prototype.addParentsNode = function () {
        this.parentsNode = new ParentsNode(this.father, this.mother);
        var pos;
        if (this.father.unit != this.mother.unit) {
            pos = basis_1.calcParentsNodePos(this.father, this.mother, "curve");
        }
        else {
            pos = basis_1.calcParentsNodePos(this.father, this.mother, "line");
        }
        this.parentsNode.position.set(pos.x, pos.y, pos.z);
        this.attach(this.parentsNode);
        console.log("parentsNode:", this.parentsNode);
    };
    Kinship.prototype.addKinshipNode = function () {
        this.kinshipNode = new KinshipNode();
        var pos = basis_1.calcKinshipNodePos(this.parentsNode);
        this.kinshipNode.position.set(pos.x, pos.y, pos.z);
        this.attach(this.kinshipNode);
    };
    Kinship.prototype.addKPNodeLink = function () {
        this.KPNodeLink = new LineFactory_1.KPNodeLink(this.parentsNode, this.kinshipNode);
        this.attach(this.KPNodeLink);
        this.kinshipNode.kpNodeLink = this.KPNodeLink;
        console.log("KPNodeLink:", this.KPNodeLink);
    };
    Kinship.prototype.addKid = function (kid) {
        this.kids.push(kid);
    };
    Kinship.prototype.addKidsKinshipLink = function (type) {
        var _this = this;
        if (type === void 0) { type = "xz"; }
        if (this.kids.length == 0)
            return;
        this.kids.forEach(function (kid) {
            _this.kinshipNode.addKid(kid);
            var pos = basis_1.calcKidPos(_this.kinshipNode, kid);
            kid.position.set(pos.x, pos.y, pos.z);
        });
        // 创建孩子Monkey 与 KinshipNode的连接线
        this.kids.forEach(function (kid) {
            var link = new LineFactory_1.KidKinshipNodeLink(_this.kinshipNode, kid);
            _this.kinshipNode.add(link);
            kid.kidKinshipLink = link;
        });
    };
    return Kinship;
}(THREE.Group));
exports.Kinship = Kinship;
