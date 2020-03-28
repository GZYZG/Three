// 布局---即位置计算
// 主要用于计算 Monkey的位置，其他物体（如 ParentsLink、ParentsNode、KinshipNode、KPNodeLink 等）的位置则是通过 Monkey的位置
// 间接或直接计算出来的，所以不需要单独去计算
// 单元的位置也需要单独计算

import { Unit, OMU } from "./Unit";
import { Monkey } from './monkey';
import { UNIT_RING, UNITNUM_ON_RING, STARTRADIUS, RINGWIDTH, AGE_LEVEL } from "./basis";

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
            console.log("units[",i,"]: ", units[i]);
            units[i].position.set(x, 0, z);
            
            i++;
        }
        
    }
}

export function OMULayout( unit : OMU){
    // 对 OMU 中的成员进行布局
    unit.mainMale.position.set(0, 0, 0);
    

    let adult = new Array<Monkey>();
    let young = new Array<Monkey>();
    let juvenile = new Array<Monkey>();

    unit.currentMembers.forEach(m => {
        switch(m.ageLevel) {
            case AGE_LEVEL.ADULT:
                adult.push(m);
                break;
            case AGE_LEVEL.YOUNG:
                young.push(m);
                break;
            case AGE_LEVEL.JUVENILE:
                juvenile.push(m);
                break;
        }
    });

    

}
