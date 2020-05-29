"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("three");
// 用于产生的ID
function GEN_ID() {
    var ID = 0;
    return function () {
        var t = ID++;
        return t;
    };
}
// 用于产生单元的ID
exports.UNIT_GEN_ID = GEN_ID();
// 用于产生猴子的ID
exports.MONKEY_GEN_ID = GEN_ID();
;
;
// 川金丝猴年龄分界
exports.JUVENILE_AGE = 3; // 小于3岁则为少年猴
exports.FEMALE_YOUNG_AGE = 4; // 大于三岁小于等于4岁的为青年雌性
exports.MALE_YOUNG_AGE = 5; // 大于三岁小于等于5岁的为青年雄性
exports.MALE_CUBE_LENGTH = 1.5;
exports.FEMALE_SPHERE_RADIUS = 1;
exports.SHIP_NODE_RADIUS = .4;
exports.PARENTS_LINK_WIDTH = 2;
exports.SHIP_PARENTS_NODE_LINK_WIDTH = 2.5;
exports.KID_SHIP_NODE_LINK_WIDTH = 2.2;
exports.LAYER_COLOR = 0xaaaaaa;
exports.MALE_GEMOMETRY = new THREE.BoxBufferGeometry(exports.MALE_CUBE_LENGTH, exports.MALE_CUBE_LENGTH, exports.MALE_CUBE_LENGTH);
exports.FEMALE_GEOMETRY = new THREE.SphereBufferGeometry(exports.FEMALE_SPHERE_RADIUS, 10, 10);
// 关于单元在社区内布局的参数，所有单元的球心均位于同一平面
// 单元分布在一条条环带上
exports.STARTRADIUS = 15; // 起始的不放置单元的环带的周长
exports.RINGWIDTH = 40; // 每个环带的宽度
// UNIT_RING[i] = j, 表示第 i 个单元放置在第 j 条环带上，i, j 均从0开始计数
exports.UNIT_RING = [0, 0, 0,
    1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2, 2,
    3, 3, 3, 3, 3, 3, 3, 3,
    4, 4, 4, 4, 4, 4, 4, 4, 4,
    5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
// UNITNUM_ON_RING[i] = j 表示第 i 个环带上放置 j 个单元，i 从0开始计数
exports.UNITNUM_ON_RING = [exports.UNIT_RING.filter(function (e) { return e == 0; }).length,
    exports.UNIT_RING.filter(function (e) { return e == 1; }).length,
    exports.UNIT_RING.filter(function (e) { return e == 2; }).length,
    exports.UNIT_RING.filter(function (e) { return e == 3; }).length,
    exports.UNIT_RING.filter(function (e) { return e == 4; }).length,
    exports.UNIT_RING.filter(function (e) { return e == 6; }).length
];
function calcMonkeyCommunityPos(monkey) {
    var unitPos = monkey.unit.position.clone();
    var ret = monkey.position.clone();
    ret.add(unitPos);
    return ret;
}
exports.calcMonkeyCommunityPos = calcMonkeyCommunityPos;
function calcParentsNodePos(father, mother, type) {
    if (type === void 0) { type = "line"; }
    var ret;
    var dadComPos = calcMonkeyCommunityPos(father);
    var momComPos = calcMonkeyCommunityPos(mother);
    switch (type) {
        case "line":
            ret = dadComPos.clone().add(momComPos).divideScalar(2);
            break;
        case "curve":
            ret = dadComPos.clone().add(momComPos).divideScalar(2);
            ret.setY(ret.y * 4 / 3 + 5);
            // ret = dadComPos.clone().add(momComPos ).divideScalar(2);
            break;
    }
    return ret;
}
exports.calcParentsNodePos = calcParentsNodePos;
function calcKinshipNodePos(parentsNode, type) {
    if (type === void 0) { type = "curve"; }
    var ret = parentsNode.position.clone();
    var pPos = parentsNode.position.clone();
    var mPos = calcMonkeyCommunityPos(parentsNode.mother);
    var delta = 8; // 在xz平面上，kinshipnode 沿着father、mother方向行走的距离
    var yDelta = parentsNode.father.unit == parentsNode.mother.unit ? 10 : 6; // kinshipnode在y方向上相对parentsNode的上升高度
    var zSign = mPos.z >= pPos.z ? 1 : -1;
    var xSign = mPos.x >= pPos.x ? 1 : -1;
    switch (type) {
        case "curve":
            // KinshipNode 与father、mother在同一平面内，在xz平面上沿着father、mother方向行走delta距离
            if (mPos.z == pPos.z) {
                ret.x += xSign * delta;
            }
            else {
                var k = Math.abs((mPos.x - pPos.x) / (mPos.z - pPos.z));
                var sinTheta = k / Math.sqrt(1 + k * k);
                var cosTheta = 1 / Math.sqrt(1 + k * k);
                ret.z += delta * cosTheta * zSign;
                ret.x += delta * sinTheta * xSign;
            }
            ret.y += yDelta;
            //console.log("parentsNode pos:", parentsNode.position, "kinshipNode pos:", ret, "mPos: ", mPos);
            break;
    }
    return ret;
}
exports.calcKinshipNodePos = calcKinshipNodePos;
/*
至此，将可视化的层级进一步确定。其中单元和Kinship处于同一级别。
Kinship通过attach 包含
ParentsLink、ParentsNode、KinshipNode、KPNodeLink，其中KinshipNode通过add
包含KidKinshipNodeLink。则单元、ParentsLink、ParentsNode、KinshipNode、KPNodeLink的position均为相对于社群的相对位置，KidKinshipNodeLink的position为相对KinshipNode的相对位置，Monkey的position为相对于Unit的相对位置。

本次完成了KinshipNode的位置的计算，使其与father、mother位于同一平面内。


*/
function calcKidPos(kinshipNode, kid, R, type) {
    if (R === void 0) { R = 5; }
    if (type === void 0) { type = "xz"; }
    // if(  kid.father.unit != kid.mother.unit || kid.unit != kid.father.unit ){
    //     // 父母不在同一个单元或者父母在同一个单元，但是孩子不与父母在同一个单元
    //     return kid.position;
    // }
    // 父母子均在同一单元
    var ret = new THREE.Vector3();
    // N_SEG 表示 父母子均在同一个单元时的KinshipNode上连的孩子结点数量
    var N_SEG = 5;
    var pos = kinshipNode.position.clone();
    var theta = Math.PI * 2 / N_SEG;
    var i = kinshipNode.kids.indexOf(kid);
    kinshipNode.kids.forEach(function (k) {
        if (kid.unit == k.unit) {
            i++;
        }
    });
    switch (type) {
        case 'xz':
            ret.z = Math.sin(i * theta) * R;
            ret.x = Math.cos(i * theta) * R;
            // 将kid以作为kinshipnode的子节点时不需要一下两行代码
            // ret.add(kinshipNode.position.clone().add( kid.getUnit().position.clone().negate() ) );
            // ret.y = pos.y;
            break;
        case 'xy':
            ret.x = Math.sin(i * theta) * R;
            ret.y = Math.cos(i * theta) * R;
            ret.add(kinshipNode.position.clone().add(kid.getUnit().position.clone().negate()));
            ret.z = pos.z;
            break;
    }
    // console.log("kinshipNode.position: ", kinshipNode.position, " kid.getUnit().position: ", kid.getUnit().position, "ret: ", ret);
    // console.log("kid.position: ", ret);
    return ret;
}
exports.calcKidPos = calcKidPos;
function randomInt(minNum, maxNum) {
    if (maxNum <= minNum)
        return minNum;
    return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
}
exports.randomInt = randomInt;
