import { Monkey, Male, Female } from "./monkey";
import { ParentsNode} from './Kinship';
import * as THREE from 'three'

export const enum UNIT_TYPE {
    OMU="OMU",
    AMU="AMU",
    FIU="FIU"
};

export const enum LAYER_TYPE {
    AF="AF",
    AM="AM",
    SAM="SAM",
    SAF="SAF",
    YMonkey="YMonkey",
    JMonkey="JMonkey",
    IMonkey="IMonkey"
};

export const MALE_CUBE_LENGTH = 1.5;

export const FEMALE_SPHERE_RADIUS = 1;

export const SHIP_NODE_RADIUS = .6;

export const PARENTS_LINK_WIDTH = 2;

export const SHIP_PARENTS_NODE_LINK_WIDTH = 2.5;

export const KID_SHIP_NODE_LINK_WIDTH = 2.2;

export const LAYER_COLOR = 0xaaaaaa;

export  function calcMonkeyCommunityPos (monkey : Monkey) : THREE.Vector3{
    let unitPos = monkey.getUnit().position.clone();
    var ret = monkey.position.clone();
    ret.add( unitPos );
    return ret;
}

export function calcParentsNodePos(father : Male, mother : Female, type:string="line" ): THREE.Vector3{
    var ret: THREE.Vector3;

    switch( type ){
        case "line":
            let dadComPos = calcMonkeyCommunityPos(father);
            let momComPos = calcMonkeyCommunityPos(mother);
            ret = dadComPos.clone().add(momComPos );
            break;
        case "curve":

            break;
    }

    return ret;
}

export function calcKinshipNodePos(parentsNode : ParentsNode, type:string="curve") : THREE.Vector3 {
    var ret : THREE.Vector3;
    switch( type ){
        case "curve":
            let pPos = parentsNode.position.clone();
            let scale = Math.abs( 5 / pPos.x );
            scale = scale > 3 ? 3: scale;
            ret = new THREE.Vector3(pPos.x * (1 + scale )  , pPos.y + 10, pPos.z * ( 1 +scale ) );
            console.log("kinshipNode pos:", ret,"  scale:", scale, " pPos.z:",pPos.z, " pPos.x:",pPos.x);
            break;
    }

    return ret;
}
