import { Monkey, Male, Female } from "./Monkey";
import { ParentsNode, KinshipNode} from './Kinship';
import * as THREE from 'three'
import { Community } from "../debug/TestData";

// 用于产生的ID
function GEN_ID(){
    var ID = 0;
    return function(){
        let t = ID++;
        return t;
    }
    
}

function GEN_TICK(){
    var tick = 0;
    var GET_TICK = function(){
        return tick;
    }

    var TICK_NEXT = function() {
        tick++;
        return tick;
    }

    var TICK_PREV = function() {
        tick--;
        return tick;
    }

    return {
        getTick : GET_TICK,
        tickNext : TICK_NEXT,
        tickPrev : TICK_PREV,
    }
}

var TICK_OBJ = GEN_TICK();
export var GET_TICK = TICK_OBJ.getTick;
export var TICK_NEXT = TICK_OBJ.tickNext;
export var TICK_PREV = TICK_OBJ.tickPrev;

// 用于产生单元的ID
export var UNIT_GEN_ID = GEN_ID();
// 用于产生猴子的ID
export var MONKEY_GEN_ID = GEN_ID();

export const enum TICK_MODE {
    ACCUMULATE = "accumulate",
    ISOLATE = "isolate",
}

export var NOW_TICK_MODE = "ACCUMULATE";

export var SET_TICK_MODE = function(mode:string){
    NOW_TICK_MODE = mode;
};

export var GET_TICK_MODE = function(){
    return NOW_TICK_MODE;
}

export const enum UNIT_TYPE {
    OMU="OMU",
    AMU="AMU",
    FIU="FIU"
};

export const enum AGE_LEVEL {
    // 将单元分为五层：成年雌性层、成年雄性层（无）、亚成年雄性层、亚成年雌性层（无）、青年猴层、少年猴层、婴幼猴层
    // AF="AF",    // Adult Female
    // AM="AM",    // Adult Male
    // SAM="SAM",  // Sub Adult Male
    // SAF="SAF",  // Sub Adult Female
    // YMonkey="YMonkey",  // Young Monkey
    // JMonkey="JMonkey",  // Juvenile Monkey
    // IMonkey="IMonkey",  // Infant Monkey
    // 将单元分为3层：成年层、青年层、少年层
    ADULT="ADU", // ADULT
    YOUNG="YOU", // YOUNG
    JUVENILE="JUV" // JUVENILE
};

export const enum GENDA {
    MALE="male",
    FEMALE="female",
    UNKNOWN="unknown"
}

// 川金丝猴年龄分界
export const JUVENILE_AGE = 3;  // 小于3岁则为少年猴
export const FEMALE_YOUNG_AGE = 4;  // 大于三岁小于等于4岁的为青年雌性
export const MALE_YOUNG_AGE = 5;    // 大于三岁小于等于5岁的为青年雄性


export const MALE_CUBE_LENGTH = 1.5;

export const FEMALE_SPHERE_RADIUS = 1;

export const SHIP_NODE_RADIUS = .4;

export const PARENTS_LINK_WIDTH = 2;

export const SHIP_PARENTS_NODE_LINK_WIDTH = 2.5;

export const KID_SHIP_NODE_LINK_WIDTH = 2.2;

export const LAYER_COLOR = 0xaaaaaa;

export var MALE_GEMOMETRY = new THREE.BoxBufferGeometry(MALE_CUBE_LENGTH, MALE_CUBE_LENGTH, MALE_CUBE_LENGTH);
export var FEMALE_GEOMETRY = new THREE.SphereBufferGeometry(FEMALE_SPHERE_RADIUS, 10, 10);

// 关于单元在社区内布局的参数，所有单元的球心均位于同一平面
// 单元分布在一条条环带上
export const STARTRADIUS = 15;      // 起始的不放置单元的环带的周长
export const RINGWIDTH = 40;        // 每个环带的宽度
// UNIT_RING[i] = j, 表示第 i 个单元放置在第 j 条环带上，i, j 均从0开始计数
export const UNIT_RING = [0, 0, 0, 
                          1, 1, 1, 1, 1, 1,
                          2, 2, 2, 2, 2, 2, 2,
                          3, 3, 3, 3, 3, 3, 3, 3,
                          4, 4, 4, 4, 4, 4, 4, 4, 4,  
                          5, 5, 5, 5, 5, 5, 5, 5, 5, 5];

// UNITNUM_ON_RING[i] = j 表示第 i 个环带上放置 j 个单元，i 从0开始计数
export const UNITNUM_ON_RING = [UNIT_RING.filter(e => e == 0).length,
                                UNIT_RING.filter(e => e == 1).length,
                                UNIT_RING.filter(e => e == 2).length,
                                UNIT_RING.filter(e => e == 3).length,
                                UNIT_RING.filter(e => e == 4).length,
                                UNIT_RING.filter(e => e == 6).length
                            ];

//export var COMMUNITY = new Community();

export function isNumber(obj: any) {
    return obj === +obj
}

export  function calcMonkeyCommunityPos (monkey : Monkey) : THREE.Vector3{
    let unitPos = monkey.unit.position.clone();
    var ret = monkey.position.clone();
    ret.add( unitPos );
    return ret;
}

export function calcParentsNodePos(father : Male, mother : Female, type:string="line" ): THREE.Vector3{
    var ret: THREE.Vector3;
    let dadComPos = calcMonkeyCommunityPos(father);
    let momComPos = calcMonkeyCommunityPos(mother);
    switch( type ){
        case "line":
            ret = dadComPos.clone().add(momComPos ).divideScalar(2);
            break;
        case "curve":
            ret = dadComPos.clone().add(momComPos ).divideScalar(2);
            ret.setY(ret.y * 4 / 3 + 5 );
            // ret = dadComPos.clone().add(momComPos ).divideScalar(2);
            break;
    }

    return ret;
}

export function calcKinshipNodePos(parentsNode : ParentsNode, type:string="curve") : THREE.Vector3 {
    var ret = parentsNode.position.clone();
    let pPos = parentsNode.position.clone();
    let mPos = calcMonkeyCommunityPos( parentsNode.mother );

    let delta = 8;  // 在xz平面上，kinshipnode 沿着father、mother方向行走的距离
    let yDelta = parentsNode.father.unit == parentsNode.mother.unit ? 10 : 6;    // kinshipnode在y方向上相对parentsNode的上升高度
    let zSign = mPos.z >= pPos.z ? 1 : -1;
    let xSign = mPos.x >= pPos.x ? 1 : -1;
    switch( type ){
        case "curve":
            // KinshipNode 与father、mother在同一平面内，在xz平面上沿着father、mother方向行走delta距离
            if( mPos.z == pPos.z ){
                ret.x += xSign * delta;
            }else{
                let k = Math.abs( ( mPos.x - pPos.x ) / ( mPos.z - pPos.z ) );
                let sinTheta = k / Math.sqrt( 1 + k*k );
                let cosTheta = 1 / Math.sqrt( 1 + k*k );
                ret.z += delta * cosTheta * zSign;
                ret.x += delta * sinTheta * xSign;
            }
            
            ret.y += yDelta;
            //console.log("parentsNode pos:", parentsNode.position, "kinshipNode pos:", ret, "mPos: ", mPos);
            break;
    }

    return ret;
}
/*
至此，将可视化的层级进一步确定。其中单元和Kinship处于同一级别。
Kinship通过attach 包含
ParentsLink、ParentsNode、KinshipNode、KPNodeLink，其中KinshipNode通过add
包含KidKinshipNodeLink。则单元、ParentsLink、ParentsNode、KinshipNode、KPNodeLink的position均为相对于社群的相对位置，KidKinshipNodeLink的position为相对KinshipNode的相对位置，Monkey的position为相对于Unit的相对位置。

本次完成了KinshipNode的位置的计算，使其与father、mother位于同一平面内。


*/
export function calcKidPos(kinshipNode : KinshipNode, kid : Monkey, R:number=5, type:string="xz") : THREE.Vector3{
    // if(  kid.father.unit != kid.mother.unit || kid.unit != kid.father.unit ){
    //     // 父母不在同一个单元或者父母在同一个单元，但是孩子不与父母在同一个单元
    //     return kid.position;
    // }
    // 父母子均在同一单元
    var ret = new THREE.Vector3();
    // N_SEG 表示 父母子均在同一个单元时的KinshipNode上连的孩子结点数量，这里预设了不会超过六个孩子
    let N_SEG = 6;
    var pos =  kinshipNode.position.clone();
    let theta = Math.PI * 2 / N_SEG;
    let i = kinshipNode.kids.indexOf(kid);
    // kinshipNode.kids.forEach( k => {
    //     if(kid.unit == k.unit){
    //         i++;
    //     }
    // })
    switch( type){
        case 'xz': 
            ret.z = Math.sin( i * theta ) * R;
            ret.x = Math.cos( i * theta ) * R;
            // 将kid以作为kinshipnode的子节点时不需要一下两行代码
            // ret.add(kinshipNode.position.clone().add( kid.getUnit().position.clone().negate() ) );
            // ret.y = pos.y;
            break;
        case 'xy':
            ret.x = Math.sin( i * theta ) * R;
            ret.y = Math.cos( i * theta ) * R;
            ret.add(kinshipNode.position.clone().add( kid.unit.position.clone().negate() ) );
            ret.z = pos.z;
            break;
    }
    // console.log("kinshipNode.position: ", kinshipNode.position, " kid.getUnit().position: ", kid.getUnit().position, "ret: ", ret);
    
    // console.log("kid.position: ", ret);

    return ret;
}

export function randomInt(minNum: number, maxNum: number){
    if( maxNum <= minNum)
        return minNum;
    return Math.floor(Math.random()*(maxNum - minNum + 1)+minNum ); 
}

export function cleanCache( obj : any ){
    //if( !( obj instanceof THREE.Object3D ) )    return;
    if(!obj) return;
    obj.geometry.dispose();
    obj.material.dispose();
}