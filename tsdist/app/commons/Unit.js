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
var monkey_1 = require("./monkey");
var Unit = /** @class */ (function (_super) {
    __extends(Unit, _super);
    function Unit(radius, unitType, createdDate) {
        var _this = _super.call(this) || this;
        _this.radius = radius;
        // this.name = name;
        //this.currentMembers = new Array<Monkey>();
        _this.allMembers = new Array();
        if (!createdDate) {
            _this.createdDate = createdDate;
        }
        else {
            _this.createdDate = new Date();
        }
        _this._unitType = unitType;
        _this.ID = basis_1.UNIT_GEN_ID();
        return _this;
    }
    Object.defineProperty(Unit.prototype, "ID", {
        get: function () {
            return this._ID;
        },
        set: function (id) {
            this._ID = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Unit.prototype, "unitType", {
        get: function () {
            return this._unitType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Unit.prototype, "name", {
        get: function () {
            return this.unitType + this.ID;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Unit.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        set: function (radius) {
            this._radius = radius;
        },
        enumerable: true,
        configurable: true
    });
    // 自定义的改变单元的position的setter，与Mesh的 position.set 方法不同
    Unit.prototype.changePosition = function (pos) {
        this.position.set(pos.x, pos.y, pos.z);
    };
    Object.defineProperty(Unit.prototype, "currentMoment", {
        get: function () {
            return this._currentMoment;
        },
        set: function (currentDate) {
            this._currentMoment = currentDate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Unit.prototype, "currentMembers", {
        get: function () {
            return this.allMembers.filter(function (m) { return !m.isMirror && m.inCommu && m.isAlive; });
        },
        enumerable: true,
        configurable: true
    });
    return Unit;
}(THREE.Group));
exports.Unit = Unit;
var OMU = /** @class */ (function (_super) {
    __extends(OMU, _super);
    function OMU(radius) {
        var _this = 
        //var name = Math.random().toPrecision(4).toString();
        _super.call(this, radius, "OMU" /* OMU */) || this;
        _this.adultLayer = new Array();
        _this.youngLayer = new Array();
        _this.juvenileLayer = new Array();
        _this._mainMale = new monkey_1.Male(basis_1.MONKEY_GEN_ID(), _this.name + '.' + '主雄', _this);
        _this._mainMale.ageLevel = "ADU" /* ADULT */;
        _this._mainMale.isMainMale = true;
        _this.adultLayer.push(_this._mainMale);
        _this.mainMale.position.set(_this.position.x, _this.position.y, _this.position.z);
        _this.add(_this.mainMale);
        _this.currentMembers.push(_this.mainMale);
        _this.allMembers.push(_this.mainMale);
        return _this;
    }
    OMU.prototype.addMonkeys = function () {
        this.addLayer_3(basis_1.randomInt(2, 5), "ADU" /* ADULT */);
        this.addLayer_3(basis_1.randomInt(2, 4), "YOU" /* YOUNG */);
        this.addLayer_3(basis_1.randomInt(3, 5), "JUV" /* JUVENILE */);
    };
    Object.defineProperty(OMU.prototype, "mainMale", {
        get: function () {
            return this._mainMale;
        },
        set: function (mainMale) {
            this._mainMale = mainMale;
        },
        enumerable: true,
        configurable: true
    });
    // public pushMonkey(monkey : Monkey ){
    //     super.pushMonkey(monkey);
    //     // 判断猴子的年龄，并进入相应的层
    //     let timedelta = this.currentMoment.getTime() - monkey.birthDate.getTime();
    //     let age = timedelta / 1000 / 60 / 60 / 24 / 365;
    //     if( age <  JUVENILE_AGE){
    //         this.juvenileLayer.push( monkey );
    //     } else if( (monkey.genda == GENDA.MALE && age <= MALE_YOUNG_AGE)  || 
    //                (monkey.genda == GENDA.FEMALE && age <= FEMALE_YOUNG_AGE ) ) {
    //         this.youngLayer.push(monkey);
    //     } else {
    //         this.adultLayer.push(monkey );
    //     }
    // }
    OMU.prototype.addLayer_3 = function (n, layerType) {
        // 为每层随机生成Monkey， 但是不对其进行布局
        var x = 0;
        var y = 0;
        var z = 0;
        var _y;
        var rk;
        var maleRatio;
        var tempLayer;
        switch (layerType) {
            case "ADU" /* ADULT */:
                rk = this.radius;
                _y = y;
                maleRatio = -1;
                tempLayer = this.adultLayer;
                break;
            case "YOU" /* YOUNG */:
                rk = this.radius * Math.sqrt(8) / 3;
                _y = -.33 * this.radius;
                maleRatio = .4;
                tempLayer = this.youngLayer;
                break;
            case "JUV" /* JUVENILE */:
                rk = this.radius * Math.sqrt(5) / 3;
                _y = -.67 * this.radius;
                maleRatio = .5;
                tempLayer = this.juvenileLayer;
                break;
            default:
                break;
        }
        var lay_geo = new THREE.RingGeometry(rk - .3, rk + .3, 100, 1);
        var lay_mat = new THREE.MeshBasicMaterial({ color: basis_1.LAYER_COLOR, side: THREE.DoubleSide });
        var layer = new THREE.Mesh(lay_geo, lay_mat);
        // 注意是弧度不是角度
        layer.rotateX(-Math.PI / 2);
        layer.position.set(x, y + _y, z);
        // console.log( layerType, " : ", layer.position);
        this.add(layer);
        var t = 0.017453293;
        var seg = 360 / n;
        var monkey;
        for (var i = 0; i < n; i++) {
            var _x = Math.cos(i * seg * t) * rk;
            var _z = Math.sin(i * seg * t) * rk;
            if (Math.random() <= maleRatio) {
                // 生成一个雄性
                monkey = new monkey_1.Male(basis_1.MONKEY_GEN_ID(), this.name + '.' + layerType + '.' + (i + 1).toString(), this);
                //console.log( "cube : ", cube.position);
            }
            else {
                // 生成一个雌性
                monkey = new monkey_1.Female(basis_1.MONKEY_GEN_ID(), this.name + '.' + layerType + '.' + (i + 1).toString(), this);
            }
            monkey.ageLevel = layerType;
            tempLayer.push(monkey);
            monkey.enterUnit(this);
            // this.add(monkey);
            // this.allMembers.push(monkey);
        }
    };
    OMU.prototype.setMemberPosition = function () {
    };
    return OMU;
}(Unit));
exports.OMU = OMU;
var AMU = /** @class */ (function (_super) {
    __extends(AMU, _super);
    function AMU(radius) {
        //let name = 'AMU-'+Math.random().toPrecision(4).toString();
        return _super.call(this, radius, "AMU" /* AMU */) || this;
    }
    AMU.prototype.addMonkeys = function () {
        this.addLayer(1 + Math.floor(Math.random() * 7));
    };
    AMU.prototype.addLayer = function (n) {
        var x = this.position.x;
        var y = this.position.y;
        var z = this.position.z;
        var _y = 0;
        var rk = this.radius;
        var maleRatio = 2;
        var lay_geo = new THREE.RingGeometry(rk - .3, rk + .3, 100, 1);
        var lay_mat = new THREE.MeshBasicMaterial({ color: basis_1.LAYER_COLOR, side: THREE.DoubleSide });
        var layer = new THREE.Mesh(lay_geo, lay_mat);
        // 注意是弧度不是角度
        layer.rotateX(-Math.PI / 2);
        layer.position.set(x, y + _y, z);
        // console.log( layerType, " : ", layer.position);
        this.add(layer);
        var t = 0.017453293;
        var seg = 360 / n;
        var monkey;
        for (var i = 0; i < n; i++) {
            var _x = Math.cos(i * seg * t) * rk;
            var _z = Math.sin(i * seg * t) * rk;
            if (Math.random() <= maleRatio) {
                // 生成一个雄性
                monkey = new monkey_1.Male(basis_1.MONKEY_GEN_ID(), this.name + '.M.' + (i + 1), this);
            }
            else {
                // 生成一个雌性
                monkey = new monkey_1.Female(basis_1.MONKEY_GEN_ID(), this.name + '.F.' + (i + 1), this);
            }
            // this.add(monkey);
            // this.allMembers.push( monkey);
            monkey.enterUnit(this);
            monkey.ageLevel = "ADU" /* ADULT */;
        }
    };
    return AMU;
}(Unit));
exports.AMU = AMU;
var FIU = /** @class */ (function (_super) {
    __extends(FIU, _super);
    function FIU(radius) {
        //let name = 'FIU-'+Math.random().toPrecision(4).toString();
        return _super.call(this, radius, "FIU" /* FIU */) || this;
    }
    FIU.prototype.addMonkeys = function () {
        this.addLayer(1 + Math.floor(Math.random() * 7));
    };
    FIU.prototype.addLayer = function (n) {
        var x = this.position.x;
        var y = this.position.y;
        var z = this.position.z;
        var _y = 0;
        var rk = this.radius;
        var maleRatio = .5;
        var lay_geo = new THREE.RingGeometry(rk - .3, rk + .3, 100, 1);
        var lay_mat = new THREE.MeshBasicMaterial({ color: basis_1.LAYER_COLOR, side: THREE.DoubleSide });
        var layer = new THREE.Mesh(lay_geo, lay_mat);
        // 注意是弧度不是角度
        layer.rotateX(-Math.PI / 2);
        layer.position.set(x, y + _y, z);
        // console.log( layerType, " : ", layer.position);
        this.add(layer);
        var t = 0.017453293;
        var seg = 360 / n;
        var monkey;
        for (var i = 0; i < n; i++) {
            var _x = Math.cos(i * seg * t) * rk;
            var _z = Math.sin(i * seg * t) * rk;
            if (Math.random() <= maleRatio) {
                // 生成一个雄性
                monkey = new monkey_1.Male(basis_1.MONKEY_GEN_ID(), this.name + '.M.' + (i + 1), this);
            }
            else {
                // 生成一个雌性
                monkey = new monkey_1.Female(basis_1.MONKEY_GEN_ID(), this.name + '.F.' + (i + 1), this);
            }
            // this.add(monkey);
            // this.allMembers.push(monkey);
            monkey.enterUnit(this);
            monkey.ageLevel = "ADU" /* ADULT */;
        }
    };
    return FIU;
}(Unit));
exports.FIU = FIU;
