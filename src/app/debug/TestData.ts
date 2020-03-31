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
import { Unit, OMU, AMU, FIU } from "../commons/Unit";
import { GENDA, UNIT_TYPE, randomInt } from "../commons/basis";
import { Kinship } from "../commons/Kinship";
import { Monkey, Male, Female } from "../commons/monkey";
import { unitsLayout, OMULayout, AMULayout, FIULayout } from "../commons/PositionCalc";
import * as THREE from "three";

// 单元的信息示例如下：
// ID       name        createdDate         vanishDate
// 1         qhc          1900/1/1              -1
// 2         sx           1900/1/1              -1

var monkeysData = {
    2016:[
        {"ID":1, "name":"", "genda":GENDA.MALE, "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":2, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":3, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":4, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":5, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":6, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":7, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":8, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":9, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":10, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":11, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":12, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":13, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":14, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":15, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":16, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":17, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
    ],
    2017:[
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
    ],
    2018:[
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
    ],
    2019:[
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
    ],
    2020:[
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
    ]

}

var unitsData = {

}

exports.monkeysData = monkeysData;
exports.unitsData = unitsData;

export class Community extends THREE.Object3D{
    public allunits : Array<Unit>;
    public allkinships : Array<Kinship>;
    public allmonkeys : Array<Monkey>;

    constructor(baseUnitNum: number = 12){
        super();

        this.allunits = new Array<Unit>();
        this.allmonkeys = new Array<Monkey>();
        this.allkinships = new Array<Kinship>();
        let base = baseCommunity(baseUnitNum);
        this.allunits = base.baseUnits;
        this.allmonkeys = base.baseMonkeys;
        this.allkinships = base.baseKinships;
        this.allunits.forEach( unit =>{
            this.add(unit);
        });
        this.allkinships.forEach( k => {
            this.add( k);
        });
    
        
    }

    public layout() {
        // 先对单元进行总体布局
        unitsLayout(this.allunits);
        // 再对每个单元内的层进行布局
        this.allunits.forEach( u =>{
            switch( u.unitType ){
                case UNIT_TYPE.OMU:
                    OMULayout( u);
                    break;
                case UNIT_TYPE.AMU:
                    AMULayout(u);
                    break;
                case UNIT_TYPE.FIU:
                    FIULayout(u);
                    break;
            }
        });

        // 再对亲缘关系进行布局
        this.allkinships.forEach(k => {
            k.layout();
        })
       

    }


}

function genParents(units : Array<Unit>){
    let father : Monkey = null;
    let mother : Monkey = null;
    let dadUnit : Unit;
    let momUnit : Unit;
    while( !father){
        let nth = randomInt(0, units.length-1);
        dadUnit = units[nth];
        if( dadUnit.unitType == UNIT_TYPE.OMU){
            father = dadUnit.mainMale;
        }else if( dadUnit.unitType == UNIT_TYPE.AMU){
            let num = dadUnit.currentMembers.length;
            father = dadUnit.currentMembers[ randomInt(0, num-1) ];
        }else {
            let males = dadUnit.currentMembers.filter( e => e.genda == GENDA.MALE);
            if( males.length == 0)  continue;
            father = males[ randomInt(0, males.length-1) ];
        }
    }
    if( dadUnit.unitType == UNIT_TYPE.OMU && Math.random() < .6){
        // 从父亲所在的单元挑选母亲
        let females = dadUnit.adultLayer.filter( e => e.genda == GENDA.FEMALE );
        while(females.length != 0 && !mother){
            let nth = randomInt(0, females.length-1);
            mother = females[nth];
        }
    }

    while( !mother){
        let nth = randomInt(0, units.length-1);
        momUnit = units[nth];
        if( momUnit.unitType == UNIT_TYPE.OMU){
            mother = momUnit.adultLayer[ randomInt(1, momUnit.adultLayer.length-1 ) ];
        }else if( momUnit.unitType == UNIT_TYPE.AMU){
        }else {
            let females = momUnit.currentMembers.filter( e => e.genda == GENDA.FEMALE);
            if( females.length == 0)  continue;
            mother = females[randomInt(0, females.length) ];
        }
    }

    return {
        dad: father,
        mom: mother,
    }
}


function baseCommunity(unitNum : number){
    var units = new Array<Unit>();
    var monkeys = new Array<Monkey>();
    var unit:Unit;
    // 先创建一定数量的单元，但是先不设置坐标
    for(let i = 0; i < unitNum; i++){
        let t = Math.random();
        if( t < 0.8){
            unit = new OMU(10);
        }else if( t < 0.93 ){
            unit = new AMU(8);
        }else{
            unit = new FIU(8);
        }
        units.push(unit);
        unit.allMembers.forEach( m =>{
            monkeys.push(m);
        });
    }

    // 随机挑选父母，生成孩子
    let kinnum = randomInt(5,12);
    let allkids = new Set<Monkey>();
    var allKinships = new Array<Kinship>();
    for(let i = 0; i < kinnum; i++){
        // 挑选一对成年异性猴子
        let parents = genParents(units);
        let father  = parents.dad;
        let mother  = parents.mom;
 
        let kidnum = randomInt(1, 2);
        let kids = new Array<Monkey>();
        while( kids.length < kidnum){
            let nth = randomInt(0, units.length-1 );
            let picked = units[nth];
            let kid : Monkey;
            if( picked.unitType == UNIT_TYPE.OMU){
                kid = picked.juvenileLayer[ randomInt(0, picked.juvenileLayer.length-1 )];
            }else{
                let num = picked.currentMembers.length;
                kid = picked.currentMembers[ randomInt(0, num-1) ];
            }
            if( allkids.has(kid) ) continue;
            allkids.add( kid);
            father.addKid(kid);
            mother.addKid(kid);
            // if(mother.unit != kid.unit || father.unit != kid.unit){
            //     // 跨单元的亲缘关系，则为该孩子生成一个分身
            //     kid = kid.deepCopy();
            //     console.log("cloned: ", kid);
            // }
            // 所有的孩子都用分身表示
            kid = kid.deepCopy();
            kids.push( kid);
        }

        // 如果father、mother已经有孩子了，直接将孩子添加到已有的kinship里
        let t = allKinships.filter(k => k.father == father && k.mother == mother)
        if( t.length == 0){
            let ks = new Kinship(father, mother, kids);
            allKinships.push(ks);
        }else{
            let ks = t[0];
            kids.forEach( k =>{
                ks.addKid(k);
            });
        }
        
    }

    return {
        baseUnits : units,
        baseMonkeys : monkeys,
        baseKinships : allKinships,
    }

}


function genFrame(commu : Community){
    let allmonkeys = commu.allmonkeys;
    let allunits = commu.allunits;
    let allkinships = commu.allkinships;

    // 生成的孩子的数目
    let babeNum : number;
    if(Math.random() < 0.2){
        babeNum = randomInt(4, 8);
    } else if ( Math.random() < .85){
        babeNum = randomInt(9, 15);
    } else{
        babeNum = randomInt(16, 20);
    }

    

}





