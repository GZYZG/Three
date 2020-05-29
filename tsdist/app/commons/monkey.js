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
var THREE = require("three");
var basis_1 = require("./basis");
var Dom_1 = require("./Dom");
var Monkey = /** @class */ (function (_super) {
    __extends(Monkey, _super);
    function Monkey(genda, id, name, unit, father, mother, birthDate) {
        var _this = _super.call(this) || this;
        _this.isMonkey = true;
        _this.genda = genda;
        _this.name = name;
        // this.unit = unit;
        _this._ID = id;
        if (birthDate) {
            _this._birthDate = birthDate;
        }
        else {
            _this._birthDate = new Date();
        }
        if (father) {
            _this._father = father;
        }
        else {
            _this._father = null;
        }
        if (mother) {
            _this._mother = mother;
        }
        else {
            _this._mother = mother;
        }
        _this._kids = new Set();
        _this.unit = unit;
        _this.kinship = new Array();
        _this.kidKinshipLink = null;
        _this.selectedMat = _this.unselectedMat = null;
        _this.SELECTED = false;
        _this.inCommu = true;
        _this.isAlive = true;
        _this.isMainMale = false;
        _this.ageLevel = "JUV" /* JUVENILE */;
        _this.mirror = new Set();
        _this.isMirror = false;
        return _this;
    }
    Monkey.prototype.changePosition = function (pos) {
        // 当猴子的位置改变时触发的事件
        console.log(" 你在改变 ", this, " 的位置, ", this.position, " ===> ", pos);
        // 调用原生的 .position.set方法完成位置的改变
        var ret = this.position.set(pos.x, pos.y, pos.z);
    };
    Object.defineProperty(Monkey.prototype, "ID", {
        //public getUnit():Unit { return this.unit; }
        get: function () {
            return this._ID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Monkey.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (newName) {
            this._name = newName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Monkey.prototype, "unit", {
        get: function () {
            return this._unit;
        },
        set: function (unit) {
            this._unit = unit;
        },
        enumerable: true,
        configurable: true
    });
    Monkey.prototype.addKid = function (kid) {
        if (this._kids.has(kid))
            return;
        this._kids.add(kid);
        if (this.genda == "male" /* MALE */) {
            kid.father = this;
        }
        else {
            kid.mother = this;
        }
    };
    Object.defineProperty(Monkey.prototype, "kids", {
        get: function () {
            var ret = new Set();
            this._kids.forEach(function (kid) {
                ret.add(kid);
            });
            return ret;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Monkey.prototype, "genda", {
        get: function () {
            return this._genda;
        },
        set: function (genda) {
            this._genda = genda;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Monkey.prototype, "father", {
        get: function () {
            return this._father;
        },
        set: function (father) {
            this._father = father;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Monkey.prototype, "mother", {
        get: function () {
            return this._mother;
        },
        set: function (mother) {
            this._mother = mother;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Monkey.prototype, "birthDate", {
        get: function () {
            return this._birthDate;
        },
        enumerable: true,
        configurable: true
    });
    Monkey.prototype.deepCopy = function () {
        var ret = this.clone();
        ret._ID = this.ID;
        ret.unit = this.unit;
        ret.name += "-cloned";
        ret.father = this.father;
        ret.mother = this.mother;
        ret._kids = this.kids;
        ret.material = new THREE.MeshBasicMaterial({ color: 0x333333 });
        this.mirror.add(ret);
        ret.mirror = this.mirror;
        ret.isMirror = true;
        return ret;
    };
    Monkey.prototype.selected = function () {
        if (this.selectedMat == null) {
            var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            this.selectedMat = material;
            this.unselectedMat = this.material;
        }
        this.material = this.selectedMat;
        Dom_1.fillBlanks(this);
        this.SELECTED = true;
        this.mirror.forEach(function (m) {
            if (!m.SELECTED) {
                m.selected();
                m.SELECTED = true;
            }
        });
    };
    Monkey.prototype.unselected = function () {
        this.material = this.unselectedMat;
        this.SELECTED = false;
        this.mirror.forEach(function (m) {
            if (m.SELECTED) {
                m.unselected();
                m.SELECTED = false;
            }
        });
    };
    Monkey.prototype.leaveUnit = function () {
        if (this.unit == null)
            return;
        this.isMirror = true;
    };
    Monkey.prototype.enterUnit = function (unit) {
        var _this = this;
        var temp = unit.allMembers.filter(function (m) { return m.ID == _this.ID; });
        var mirror;
        if (temp.length != 0) {
            // 将进入的单元中包含了这个猴子的分身，则只改变分身的属性
            mirror = temp[0];
            mirror.isMirror = false;
            //mirror.unit = unit;
        }
        else {
            // 将进入的单元中无这个猴子的分身，则创建一个mirror加入到该单元
            if (this.mirror.size == 0) {
                this.mirror.add(this);
                this.isMirror = false;
                this.unit = unit;
                unit.allMembers.push(this);
                unit.add(this);
            }
            else {
                mirror = this.deepCopy();
                mirror.isMirror = false;
                mirror.unit = unit;
                unit.allMembers.push(mirror);
                unit.add(mirror);
            }
        }
    };
    return Monkey;
}(THREE.Mesh));
exports.Monkey = Monkey;
var Male = /** @class */ (function (_super) {
    __extends(Male, _super);
    function Male(id, name, unit, birthDate) {
        var _this = _super.call(this, "male" /* MALE */, id, name, unit /*, social_level*/) || this;
        _this.geometry = basis_1.MALE_GEMOMETRY; //new THREE.BoxBufferGeometry(MALE_CUBE_LENGTH, MALE_CUBE_LENGTH, MALE_CUBE_LENGTH);//;
        _this.material = new THREE.MeshBasicMaterial({ color: 0x000, vertexColors: true });
        return _this;
    }
    return Male;
}(Monkey));
exports.Male = Male;
var Female = /** @class */ (function (_super) {
    __extends(Female, _super);
    function Female(id, name, unit, birthDate /*, social_level:string */) {
        var _this = _super.call(this, "female" /* FEMALE */, id, name, unit /*, social_level*/) || this;
        _this.geometry = basis_1.FEMALE_GEOMETRY; //new THREE.SphereBufferGeometry(FEMALE_SPHERE_RADIUS, 30, 30);// 
        _this.material = new THREE.MeshLambertMaterial({ color: 0x000 });
        return _this;
    }
    return Female;
}(Monkey));
exports.Female = Female;
