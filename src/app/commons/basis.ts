import { Monkey, Male, Female } from "./monkey";
import { ParentsNode, KinshipNode} from './Kinship';
import * as THREE from 'three'

export const enum UNIT_TYPE {
    OMU="OMU",
    AMU="AMU",
    FIU="FIU"
};

export const enum AGE_LEVEL {
    // 将单元分为五层：成年雌性层、成年雄性层（无）、亚成年雄性层、亚成年雌性层（无）、青年猴层、少年猴层、婴幼猴层
    AF="AF",
    AM="AM",
    SAM="SAM",
    SAF="SAF",
    YMonkey="YMonkey",
    JMonkey="JMonkey",
    IMonkey="IMonkey",
    // 将单元分为3层：成年层、青年层、少年层
    ADULT="ADULT",
    YOUNG="YOUNG",
    JUVENILE="JUVENILE"
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

// 关于单元在社区内布局的参数，所有单元的球心均位于同一平面
// 单元分布在一条条环带上
export const STARTRADIUS = 15;      // 起始的不放置单元的环带的周长
export const RINGWIDTH = 40;        // 每个环带的宽度
// UNIT_RING[i] = j, 表示第 i 个单元放置在第 j 条环带上，i, j 均从0开始计数
export const UNIT_RING = [0, 0, 0, 
                                1, 1, 1, 1, 1,
                                2, 2, 2, 2, 2, 2,
                                3, 3, 3, 3, 3, 3, 3,
                                4, 4, 4, 4, 4, 4, 4, 4, 
                                5, 5, 5, 5, 5, 5, 5, 5, 5];
// UNITNUM_ON_RING[i] = j 表示第 i 个环带上放置 j 个单元，i 从0开始计数
export const UNITNUM_ON_RING = [3, 5, 6, 7, 8, 9];

export  function calcMonkeyCommunityPos (monkey : Monkey) : THREE.Vector3{
    let unitPos = monkey.getUnit().position.clone();
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

            break;
    }

    return ret;
}

export function calcKinshipNodePos(parentsNode : ParentsNode, type:string="curve") : THREE.Vector3 {
    var ret = parentsNode.position.clone();
    let pPos = parentsNode.position.clone();
    let mPos = calcMonkeyCommunityPos( parentsNode.mother );

    let delta = 8;  // 在xz平面上，kinshipnode 沿着father、mother方向行走的距离
    let yDelta = 10;    // kinshipnode在y方向上的上升高度
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
            console.log("parentsNode pos:", parentsNode.position, "kinshipNode pos:", ret, "mPos: ", mPos);
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
    var ret = new THREE.Vector3();
    let N_SEG = 6;
    var pos =  kinshipNode.position.clone();
    let theta = Math.PI * 2 / N_SEG;
    let i = kinshipNode.kids.length;
    switch( type){
        case 'xz': 
            ret.z = Math.sin( i * theta ) * R;
            ret.x = Math.cos( i * theta ) * R;
            ret.add(kinshipNode.position.clone().add( kid.getUnit().position.clone().negate() ) );
            ret.y = pos.y;
            break;
        case 'xy':
            ret.x = Math.sin( i * theta ) * R;
            ret.y = Math.cos( i * theta ) * R;
            ret.add(kinshipNode.position.clone().add( kid.getUnit().position.clone().negate() ) );
            ret.z = pos.z;
            break;
    }
    // console.log("kinshipNode.position: ", kinshipNode.position, " kid.getUnit().position: ", kid.getUnit().position, "ret: ", ret);
    
    // console.log("kid.position: ", ret);

    return ret;
}