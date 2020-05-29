import { Monkey, Male, Female } from "../commons/Monkey";
import { ParentsNode, KinshipNode} from '../commons/Kinship';
import * as THREE from 'three'
import { Community } from "../commons/Community";
import { Frame } from "../commons/Frame";
//import fse = require("fs-extra");

// 用于产生的ID
function GEN_ID(){
    var ID = 0;
    return function(){
        let t = ID++;
        return t;
    }
}

// TICK 与ID的性质不同，需要设置读取函数和增加函数，因为同一个TICK值可能需要被多次读取。同样性质的还有TICK_MODE
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

export const enum UNIT_TYPE {
    OMU="OMU",
    AMU="AMU",
    FIU="FIU"
};

export const enum MONKEY_COLOR {
    DEAD=0x990000,
    OUTCOMMUNITY=0x000000,
    REAL=0x000000,
    MIRROR=0xE8E7E5,
    CHILD=0xffcc00,
}

function randomColor(){
    let unitColor = new Array( "0x99FFFF", "0xFFFFCC", "0x99cc33", "0x2059A6", "0x0099CC", "0xCB3398",  
                               "0x88EE99", "0x66ccff", "0x66CC00", "0xff9966", "0xEAB34F", "0xCC3467", 
                               "0x009966", "0x00cc00", "0xFF9966", "0x339999", "0x0066ff", "0xB05C1C" );
    let num = 0;
    function genUnitColor(){
        if(num < unitColor.length)  {
            
            return unitColor[num++];
        }
        let color = "0x";
        let tab = "0123456789abcdef";
        for(let i = 0; i < 6; i++){
            color += tab[Math.floor(Math.random()*16)];
        }
        unitColor.push(color);
        num++;
        return color; 
    }
    
    return genUnitColor;
}

export var GEN_UNIT_COLOR = randomColor();

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

var COM: Community;

export function SET_COMMUNITY(baseData:any){
    COM = new Community(-1, baseData);
    window.community = COM;
}

export function GET_COMMUNITY(){
    if(!COM) {
        COM = new Community(5);
        window.community = COM;
    }
    return COM;
}

// 用于输入文件中的ID与系统内部的ID进行映射
var TICKMAP : Map<number, any>;// = new Map();
var MONKEYIDMAP : Map<number, any>;// = new Map();
var UNITIDMAP : Map<number, any>;// = new Map();

export function GET_TICKMAP() : Map<number, any>{
    if( !TICKMAP ){
        TICKMAP = new Map<number, any>();
    }
    return TICKMAP;
}
export function GET_MONKEYIDMAP() : Map<number, any>{
    if( !MONKEYIDMAP ){
        MONKEYIDMAP = new Map<number, any>();
    }
    return MONKEYIDMAP;
}

export function GET_UNITIDMAP() : Map<number, any>{
    if( !UNITIDMAP ){
        UNITIDMAP = new Map<number, any>();
    }
    return UNITIDMAP;
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
export var FEMALE_GEOMETRY = new THREE.SphereBufferGeometry(FEMALE_SPHERE_RADIUS, 8, 8);

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

export var VIEW_KEYS = {
    strucKey:{
        enterCommu: true,
        outCommu  : true,
        migrate   : true,
        mainMaleChange: true,
        newUnit   : true,
        dead      : true,
        involvedMirror: true,
    },
    uninvolved    : false,
    kinship       : true,
    //allmirror     : true,
    unSampled     : false,
}
window.VIEW_KEYS = VIEW_KEYS;


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

export function logFrame(frame: Frame, idx: number){
    //let logFilName = "./demo0/src/app/debug/log.txt";
    let tmp = ""
    let logStr = `++++++++++ 时刻-${GET_TICKMAP().get(frame.tick) ? GET_TICKMAP().get(frame.tick) : frame.tick } ++++++++++`//+ "  frameIdx: "+ idx+ "\n";
    logStr += "\n===>离开社群的猴子<===\n";
    logStr += "ID     name     单元     是否主雄\n"
    frame.vanished.dead.forEach( e => {
        tmp = `${e.monkey.EID}     ${e.monkey.name}     ${e.monkey.unit.EID}     ${e.isMainMale? 'T' : 'F'}\n`;
        logStr += tmp;
    })

    logStr += "\n===>死亡的猴子<===\n";
    logStr += "ID     name     单元     是否主雄\n"
    frame.vanished.outCommu.forEach( e => {
        tmp = `${e.monkey.EID}     ${e.monkey.name}     ${e.monkey.unit.EID}     ${e.isMainMale? 'T' : 'F'}\n`;
        logStr += tmp;
    })

    logStr += "\n===>新增单元<===n";
    logStr += "单元ID     单元类型     创建时刻     成员数量\n"
    frame.newUnits.forEach( e => {
        tmp = `${e.EID}     ${e.unitType}     ${e.createTick}     ${e.tickMembers.get(frame.tick).length}\n`;
        logStr += tmp;
    })

    logStr += "\n===>进入社群<===\n";
    logStr += "ID     name     性别     父ID     母ID     单元\n";
    frame.enterCommu.forEach( e => {
        tmp = `${e.monkey.EID}     ${e.monkey.name}     ${e.monkey.genda}     ${e.monkey.father?e.monkey.father.EID : '---'}     ${e.monkey.mother? e.monkey.mother.EID : '---'}     ${e.unit.EID}\n`;
        logStr += tmp;
    })

    logStr += "\n===>挑战主雄成功<===\n";
    logStr += "单元     原主雄     现主雄你\n";
    frame.challengeMainMale.forEach( e => {
        tmp = `${e.unit.EID}     ${e.loser? e.loser.EID : '---'}     ${e.winner.EID}\n`;
        logStr += tmp;
    })

    logStr += "\n===>迁移<===\n";
    logStr += "ID     name     原单元     现单元\n";
    frame.migrates.forEach( e => {
        tmp = `${e.monkey.EID}     ${e.monkey.name}     ${e.originUnit.EID}     ${e.targetUnit.EID}\n`;
        logStr += tmp;
    })

    logStr += "\n===>newKinships<===\n";
    logStr += "ID     name     性别     父ID     母ID     单元\n";
    frame.newKinships.forEach( e => {
        tmp =  tmp = `${e.kid.EID}     ${e.kid.name}     ${e.kid.genda}     ${e.parents.dad?e.parents.dad.EID : '---'}     ${e.parents.mom? e.parents.mom.EID : '---'}     ${e.kid.unit.EID}\n`;
        logStr += tmp;
    })
    
    logStr += "==============================\n\n";

    // fse.writeFile(logFilName, logStr, (err) => {
    //     if (err) throw err;
    //     console.log('\n\nlog保存出错！\n\n');
    // });

    return logStr;
}

export function logBase(comm: Community){
    let logStr = "++++++++++社群的起始信息++++++++++\n";
    let tmp = "";
    let tmpKids = comm.basekids;
    let tmpMembers = comm.basemember;
    let tmpUnits = comm.baseunits;
    logStr += "===>起始时刻的亲缘关系<===\n"
    logStr += "ID     name     性别     父ID     母ID     单元\n";
    tmpKids.forEach( e => {
        tmp =  tmp = `${e.EID}     ${e.name}     ${e.genda}     ${e.father?e.father.EID : '---'}     ${e.mother? e.mother.EID : '---'}     ${e.unit.EID}\n`;
        logStr += tmp;
    })
    
    
    logStr += "\n===>起始时刻的单元<===\n";
    logStr += "单元ID     单元类型     创建时刻     成员数量\n"
    tmpUnits.forEach( e => {
        tmp = `${e.EID}     ${e.unitType}     ${e.createTick}     ${tmpMembers.filter(ee => ee.unit.ID == e.ID).length}\n`;
        logStr += tmp;
    })

    
    logStr += "\n===>起始时刻的社群成员<===\n";
    logStr += "ID     name     性别     父ID     母ID     单元     是否死亡\n";
    tmpMembers.forEach( e => {
        tmp = `${e.EID}     ${e.name}     ${e.genda}     ${e.father?e.father.EID : '---'}     ${e.mother? e.mother.EID : '---'}     ${e.unit.EID}     ${e.isAlive?'F' : 'T'}\n`;
        logStr += tmp;
    })
    logStr += "==============================\n\n";
    return logStr;
}


export abstract class Slice{
    public enterUnit: Array<{ monkey: number, origin: number }>;
    public leaveUnit: Array<{ monkey: number, target: number }>;
    public newBabes: Array<{ monkey: number, father: Male, mother: Female}>;
    public dead: Array<{monkey: number}>;
    public tickMembers: Array<number>;

    constructor(){
        this.enterUnit = new Array<{ monkey: number, origin: number }>();
        this.leaveUnit = new Array<{ monkey: number, target: number }>();
        this.newBabes = new Array<{ monkey: number, father: Male, mother: Female}>();
        this.dead = new Array<{monkey: number}>();
        this.tickMembers = new Array<number>();
    }

    abstract clone():Slice;
}

export class OMUSlice extends Slice{
    public mainMale: number;

    constructor(){
        super();
        this.mainMale = null;
    }

    public clone(){
        return new OMUSlice();
    }

}

export class AMUSlice extends Slice{
    constructor(){
        super();
    }

    public clone(){
        return new AMUSlice();
    }
}

export class FIUSlice extends Slice{
    constructor(){
        super();
    }
    
    public clone(){
        return new FIUSlice();
    }
}