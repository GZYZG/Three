// 布局---即位置计算
// 主要用于计算 Monkey的位置，其他物体（如 ParentsLink、ParentsNode、KinshipNode、KPNodeLink 等）的位置则是通过 Monkey的位置
// 间接或直接计算出来的，所以不需要单独去计算
// 单元的位置也需要单独计算
import * as THREE from 'three';
import { Unit, OMU, AMU, FIU } from "../commons/Unit";
import { Monkey, Male, Female } from '../commons/Monkey';
import { UNIT_RING, UNITNUM_ON_RING, STARTRADIUS, RINGWIDTH, AGE_LEVEL, LAYER_COLOR } from "./basis";
import { Kinship } from '../commons/Kinship';

export function unitsLayout(units : Array<Unit>){
    // 按照环带对 Unit 进行布局
    let x , z, nth, num, seg, R, theta;
    for(let i = 0; i < units.length; ){
        nth = UNIT_RING[i];
        num = UNITNUM_ON_RING[nth];
        seg = Math.PI * 2 / num;
        R = STARTRADIUS + ( nth + .5 ) * RINGWIDTH ;
        theta = Math.random() * Math.PI * 2;
        for(let j = 0; j < num && i < units.length; j++){
            x = R * Math.cos( (theta + j * seg ) % ( Math.PI * 2) );
            z = R * Math.sin( (theta + j * seg ) % ( Math.PI * 2) );
            //console.log("units[",i,"]: ", units[i]);
            units[i].position.set(x, 0, z);
            
            i++;
        }
        
    }
}

export function OMULayout( unit : OMU){
    // 对 OMU 中的成员进行布局
    
    //console.log(" 正在给 ", unit, " 布局！")

    let adult = unit.allMembers.filter( e => e.ageLevel == AGE_LEVEL.ADULT);//new Array<Monkey>();
    let young = unit.allMembers.filter( e => e.ageLevel == AGE_LEVEL.YOUNG);//new Array<Monkey>();
    let juvenile = unit.allMembers.filter( e => e.ageLevel == AGE_LEVEL.JUVENILE);//new Array<Monkey>();
    // 有可能没有主雄
    if(unit.mainMale){
        //console.log("\n", unit.name, "  主雄：", unit.mainMale, "\n");
        adult.splice( adult.indexOf( unit.mainMale ), 1);
        unit.mainMale.position.set(0, 0, 0);
    } else {
        //console.log("\n没有主雄\n");
    }
    
    layerLayout(adult, AGE_LEVEL.ADULT);
    layerLayout(young, AGE_LEVEL.YOUNG);
    layerLayout(juvenile, AGE_LEVEL.JUVENILE);
    
        
}

export function AMULayout( unit : Unit ){
    let members = new Array<Monkey>();
    unit.allMembers.forEach( m => {
        members.push( m );
    })
    layerLayout( members, AGE_LEVEL.ADULT);
}

export function FIULayout( unit : Unit ) {
    AMULayout( unit );
}

// 对 Unit 的每一层的成员进行布局， 并添加层
function layerLayout(layerMembers : Array<Monkey>,  layerType? : AGE_LEVEL){
    //console.log("Layer: ", layerType, " members: ", layerMembers);
    let n = layerMembers.length;
    if( n <= 0) return;
    var x = 0;
    var y = 0;
    var z = 0;

    var _y : number;
    var rk : number;
    let unitRadius = layerMembers[0].unit.radius;
    
    switch(layerType) {
        case AGE_LEVEL.ADULT:
            rk = unitRadius;
            _y = y;
            //maleRatio = -1;
            break;
        case AGE_LEVEL.YOUNG:
            rk = unitRadius * Math.sqrt(8) / 3;
            _y = -.33 * unitRadius;
            //maleRatio = .4;
            break;
        case AGE_LEVEL.JUVENILE:
            rk = unitRadius * Math.sqrt(5) / 3;
            _y = -.67 * unitRadius;
            //maleRatio = .5;
            break;
        default:
            rk = unitRadius
            _y = y;
            break;
    }


    var lay_geo = new THREE.RingGeometry(rk-.3, rk+.3, 100, 1);
    var lay_mat = new THREE.MeshBasicMaterial( { color : LAYER_COLOR,  side: THREE.DoubleSide });
    var layer = new THREE.Mesh( lay_geo, lay_mat);
    // 注意是弧度不是角度
    layer.rotateX(- Math.PI / 2);
    layer.position.set(x, y + _y, z);
    // console.log( layerType, " : ", layer.position);
    // 将 layer 添加到单元中
    layerMembers[0].unit.add(layer);

    const t =  0.017453293 ;
    const seg = 360 / n;

    for(let i = 0; i < n; i++){
        var _x = Math.cos( i * seg * t ) * rk;
        var _z = Math.sin( i * seg * t ) * rk;
        layerMembers[i].position.set( x + _x, y + _y, z + _z);
        //console.log(layerMembers[i]," monkey position: ", layerMembers[i].position);
    }
    
}

function kinshipLayout( kinship : Kinship ){
    
}

// 对有明确父母的Monkey 进行布局
function kidsLayout(kids : Array<Monkey> ){

}
