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
// 用于测试的数据
// 以一年内的社群的数据为一份，每一份内为一个表，每一行为一直猴子的数据， 每一列为一个猴子的所有属性值
// 除了以上这个表，还有一个表，用于记录所有单元的信息
// 每一只猴子的属性有：ID、name、genda、birthDate、father、mother
// 其中father、mother 均用父、母的ID表示
// 示例：某一个年份的猴子信息
// ID       name        genda       birthDate       father      mother      unit
//  1        zq          FEMALE      1998/7/23         1           4         1
//  2        gzy         MALE        1997/2/5          5           6         2
//  3        zrq         MALE        1974/1/1         -1           -1        2
//  4        yhj         FEMALE      1975/1/1         -1           -1        2
//  5        gsz         MALE        1961/12/30       -1           -1        1
//  6        sjm         FEMALE      1974/1/1         -1           -1        1
var Unit_1 = require("../commons/Unit");
var basis_1 = require("../commons/basis");
var Kinship_1 = require("../commons/Kinship");
var monkey_1 = require("../commons/monkey");
var PositionCalc_1 = require("../commons/PositionCalc");
var THREE = require("three");
// 单元的信息示例如下：
// ID       name        createdDate         vanishDate
// 1         qhc          1900/1/1              -1
// 2         sx           1900/1/1              -1
var monkeysData = {
    2016: [
        { "ID": 1, "name": "", "genda": "male" /* MALE */, "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 2, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 3, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 4, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 5, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 6, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 7, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 8, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 9, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 10, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 11, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 12, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 13, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 14, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 15, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 16, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 17, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
    ],
    2017: [
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
    ],
    2018: [
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
    ],
    2019: [
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
    ],
    2020: [
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
        { "ID": 1, "name": "", "genda": "", "birthDate": "", "father": "", "mother": "", "unit": "" },
    ]
};
var unitsData = {};
exports.monkeysData = monkeysData;
exports.unitsData = unitsData;
var Community = /** @class */ (function (_super) {
    __extends(Community, _super);
    function Community(baseUnitNum) {
        if (baseUnitNum === void 0) { baseUnitNum = 12; }
        var _this = _super.call(this) || this;
        _this.allunits = new Array();
        _this.allmonkeys = new Array();
        _this.allkinships = new Array();
        var base = baseCommunity(baseUnitNum);
        _this.allunits = base.baseUnits;
        _this.allmonkeys = base.baseMonkeys;
        _this.allkinships = base.baseKinships;
        _this.allunits.forEach(function (unit) {
            _this.add(unit);
        });
        _this.allkinships.forEach(function (k) {
            _this.add(k);
        });
        return _this;
    }
    Community.prototype.layout = function () {
        // 先对单元进行总体布局
        PositionCalc_1.unitsLayout(this.allunits);
        // 再对每个单元内的层进行布局
        this.allunits.forEach(function (u) {
            switch (u.unitType) {
                case "OMU" /* OMU */:
                    PositionCalc_1.OMULayout(u);
                    break;
                case "AMU" /* AMU */:
                    PositionCalc_1.AMULayout(u);
                    break;
                case "FIU" /* FIU */:
                    PositionCalc_1.FIULayout(u);
                    break;
            }
        });
        // 再对亲缘关系进行布局
        this.allkinships.forEach(function (k) {
            k.layout();
        });
    };
    return Community;
}(THREE.Object3D));
exports.Community = Community;
function genParents(units) {
    var father = null;
    var mother = null;
    var dadUnit;
    var momUnit;
    while (!father) {
        var nth = basis_1.randomInt(0, units.length - 1);
        dadUnit = units[nth];
        if (dadUnit.unitType == "OMU" /* OMU */) {
            father = dadUnit.mainMale;
        }
        else if (dadUnit.unitType == "AMU" /* AMU */) {
            var num = dadUnit.currentMembers.length;
            father = dadUnit.currentMembers[basis_1.randomInt(0, num - 1)];
        }
        else {
            var males = dadUnit.currentMembers.filter(function (e) { return e.genda == "male" /* MALE */; });
            if (males.length == 0)
                continue;
            father = males[basis_1.randomInt(0, males.length - 1)];
        }
    }
    if (dadUnit.unitType == "OMU" /* OMU */ && Math.random() < .6) {
        // 从父亲所在的单元挑选母亲
        var females = dadUnit.adultLayer.filter(function (e) { return e.genda == "female" /* FEMALE */; });
        while (females.length != 0 && !mother) {
            var nth = basis_1.randomInt(0, females.length - 1);
            mother = females[nth];
        }
    }
    while (!mother) {
        var nth = basis_1.randomInt(0, units.length - 1);
        momUnit = units[nth];
        if (momUnit.unitType == "OMU" /* OMU */) {
            mother = momUnit.adultLayer[basis_1.randomInt(1, momUnit.adultLayer.length - 1)];
        }
        else if (momUnit.unitType == "AMU" /* AMU */) {
        }
        else {
            var females = momUnit.currentMembers.filter(function (e) { return e.genda == "female" /* FEMALE */; });
            if (females.length == 0)
                continue;
            mother = females[basis_1.randomInt(0, females.length)];
        }
    }
    return {
        dad: father,
        mom: mother,
    };
}
function genMonkey() {
    var monkey;
    if (Math.random() < .5) {
        monkey = new monkey_1.Male(basis_1.MONKEY_GEN_ID(), "", null);
    }
    else {
        monkey = new monkey_1.Female(basis_1.MONKEY_GEN_ID(), "", null);
    }
    var rate = Math.random();
    if (rate < .33)
        monkey.ageLevel = "JUV" /* JUVENILE */;
    else if (rate < .67)
        monkey.ageLevel = "YOU" /* YOUNG */;
    else
        monkey.ageLevel = "ADU" /* ADULT */;
    return monkey;
}
function baseCommunity(unitNum) {
    var units = new Array();
    var monkeys = new Array();
    var unit;
    // 先创建一定数量的单元，但是先不设置坐标
    for (var i = 0; i < unitNum; i++) {
        var t = Math.random();
        if (t < 0.8) {
            unit = new Unit_1.OMU(10);
        }
        else if (t < 0.93) {
            unit = new Unit_1.AMU(8);
        }
        else {
            unit = new Unit_1.FIU(8);
        }
        unit.addMonkeys();
        units.push(unit);
        unit.allMembers.forEach(function (m) {
            monkeys.push(m);
        });
    }
    // 随机挑选父母，生成孩子
    var kinnum = basis_1.randomInt(5, 12);
    var allkids = new Set();
    var allKinships = new Array();
    var _loop_1 = function (i) {
        // 挑选一对成年异性猴子
        var parents = genParents(units);
        var father = parents.dad;
        var mother = parents.mom;
        var kidnum = basis_1.randomInt(1, 2);
        var kids = new Array();
        while (kids.length < kidnum) {
            var nth = basis_1.randomInt(0, units.length - 1);
            var picked = units[nth];
            var kid = void 0;
            if (picked.unitType == "OMU" /* OMU */) {
                kid = picked.juvenileLayer[basis_1.randomInt(0, picked.juvenileLayer.length - 1)];
            }
            else {
                var num = picked.currentMembers.length;
                kid = picked.currentMembers[basis_1.randomInt(0, num - 1)];
            }
            if (allkids.has(kid))
                continue;
            allkids.add(kid);
            father.addKid(kid);
            mother.addKid(kid);
            // 所有的孩子都用分身表示
            kid = kid.deepCopy();
            kids.push(kid);
        }
        // 如果father、mother已经有孩子了，直接将孩子添加到已有的kinship里
        var t = allKinships.filter(function (k) { return k.father.ID == father.ID && k.mother.ID == mother.ID; });
        if (t.length == 0) {
            var ks = new Kinship_1.Kinship(father, mother, kids);
            allKinships.push(ks);
        }
        else {
            var ks_1 = t[0];
            kids.forEach(function (k) {
                ks_1.addKid(k);
            });
        }
    };
    for (var i = 0; i < kinnum; i++) {
        _loop_1(i);
    }
    return {
        baseUnits: units,
        baseMonkeys: monkeys,
        baseKinships: allKinships,
    };
}
function genFrame(commu) {
    var allmonkeys = commu.allmonkeys;
    var allunits = commu.allunits;
    var allkinships = commu.allkinships;
    // 从社群中消失的猴子的数量
    var vainshNum = basis_1.randomInt(0, 5);
    for (var i = 0; i < vainshNum; i++) {
        var monkey = void 0;
        var temp = allmonkeys.filter(function (m) { return m.inCommu && m.isAlive; });
        monkey = temp[basis_1.randomInt(0, temp.length - 1)];
        monkey.inCommu = false;
        if (Math.random() < .2) {
            // monkey 死亡
            monkey.isAlive = false;
        }
        else {
            // monkey 离开社群
            monkey.leaveUnit();
        }
    }
    // 进入社群的monkey
    var vansihed = allmonkeys.filter(function (m) { return !m.inCommu && m.isAlive; });
    // 以前消失的猴嘴重回社群
    var reenterNum = basis_1.randomInt(0, vansihed.length);
    var enterMonkeys = new Array();
    for (var i = 0; i < reenterNum; i++) {
        enterMonkeys.push(vansihed[i]);
    }
    var _loop_2 = function (i) {
        var monkey = genMonkey();
        if (Math.random() < .1) {
            var parents_1 = genParents(allunits);
            parents_1.dad.addKid(monkey);
            parents_1.mom.addKid(monkey);
            var kid = monkey.deepCopy();
            var t = allkinships.filter(function (k) { return k.father == parents_1.dad && k.mother == parents_1.mom; });
            if (t.length == 0) {
                var ks = new Kinship_1.Kinship(parents_1.dad, parents_1.mom, new Array(kid));
                allkinships.push(ks);
            }
            else {
                var ks = t[0];
                ks.addKid(kid);
            }
        }
        enterMonkeys.push(monkey);
    };
    // 未知的猴子进入社群
    for (var i = basis_1.randomInt(0, 4); i > 0; i--) {
        _loop_2(i);
    }
    // 为进入社群的猴子分配单元
    enterMonkeys.forEach(function (m) {
        allmonkeys.push(m);
        if (Math.random() < .4) {
            var fiu = new Unit_1.FIU(8);
            m.enterUnit(fiu);
        }
        else {
            var picked = allunits[basis_1.randomInt(0, allunits.length - 1)];
            m.enterUnit(picked);
            if (picked.unitType == "OMU" /* OMU */ && m.ageLevel == "ADU" /* ADULT */ && m.genda == "male" /* MALE */ && Math.random() < .2) {
                // m 挑战主雄成功
                picked.mainMale = m;
                m.isMainMale = true;
            }
        }
    });
    // 成年雌、雄性的迁移
    var migrateMaleNum = basis_1.randomInt(0, 3);
    var migrateFemaleNum = basis_1.randomInt(0, 4);
    var _loop_3 = function (i) {
        var temp = allmonkeys.filter(function (m) { return m.ageLevel == "ADU" /* ADULT */ && m.genda == "male" /* MALE */ && !m.isMainMale; });
        var picked = temp[basis_1.randomInt(0, temp.length - 1)];
        var toUnits = allunits.filter(function (u) { return u != picked.unit; });
        picked.leaveUnit();
        picked.enterUnit(toUnits[basis_1.randomInt(0, toUnits.length - 1)]);
    };
    for (var i = 0; i < migrateMaleNum; i++) {
        _loop_3(i);
    }
    var _loop_4 = function (i) {
        var temp = allmonkeys.filter(function (m) { return m.ageLevel == "ADU" /* ADULT */ && m.genda == "female" /* FEMALE */; });
        var picked = temp[basis_1.randomInt(0, temp.length - 1)];
        var toUnits = allunits.filter(function (u) { return u != picked.unit; });
        picked.leaveUnit();
        picked.enterUnit(toUnits[basis_1.randomInt(0, toUnits.length - 1)]);
    };
    for (var i = 0; i < migrateFemaleNum; i++) {
        _loop_4(i);
    }
    // 生成的孩子的数目
    var babeNum;
    if (Math.random() < 0.2) {
        babeNum = basis_1.randomInt(4, 8);
    }
    else if (Math.random() < .85) {
        babeNum = basis_1.randomInt(9, 15);
    }
    else {
        babeNum = basis_1.randomInt(16, 20);
    }
    // 挑选 babeNum 对parents
    var parentsArr = new Array();
    var kids = new Array();
    var _loop_5 = function (i) {
        var parents = genParents(allunits);
        var kid = void 0;
        var unit = parents.mom.unit;
        if (Math.random() < .5) {
            kid = new monkey_1.Female(basis_1.MONKEY_GEN_ID(), unit.name + '.' + "JUV" /* JUVENILE */ + '.' + unit.juvenileLayer.length.toString(), unit);
        }
        else {
            kid = new monkey_1.Male(basis_1.MONKEY_GEN_ID(), unit.name + '.' + "JUV" /* JUVENILE */ + '.' + unit.juvenileLayer.length.toString(), unit);
        }
        kids.push(kid);
        parents.mom.addKid(kid);
        parents.dad.addKid(kid);
        kid = kid.deepCopy();
        var t = allkinships.filter(function (k) { return k.father == parents.dad && k.mother == parents.mom; });
        if (t.length == 0) {
            var ks = new Kinship_1.Kinship(parents.dad, parents.mom, new Array(kid));
            allkinships.push(ks);
        }
        else {
            var ks = t[0];
            ks.addKid(kid);
        }
    };
    for (var i = 0; i < babeNum; i++) {
        _loop_5(i);
    }
    commu.layout();
}
