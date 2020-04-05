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
import { GENDA, UNIT_TYPE, randomInt, MONKEY_GEN_ID, AGE_LEVEL } from "../commons/basis";
import { Kinship } from "../commons/Kinship";
import { Monkey, Male, Female } from "../commons/Monkey";
import { unitsLayout, OMULayout, AMULayout, FIULayout } from "../commons/PositionCalc";
import * as THREE from "three";
import { TextGeometry } from "../threelibs/three";

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

var tick = 0;
exports.monkeysData = monkeysData;
exports.unitsData = unitsData;

export class Community extends THREE.Object3D{
    public allunits : Array<Unit>;
    public allkinships : Array<Kinship>;
    //public allmonkeys : Array<Monkey>;
    public vanishedmonkeys : Array<Monkey>;

    constructor(baseUnitNum: number = 12){
        super();

        this.allunits = new Array<Unit>();
        this.allkinships = new Array<Kinship>();
        let base = baseCommunity(baseUnitNum);
        this.allunits = base.baseUnits;
        //this.allmonkeys = base.baseMonkeys;
        this.allkinships = base.baseKinships;
        this.allunits.forEach( unit =>{
            this.add(unit);
        });
        this.allkinships.forEach( k => {
            this.add( k);
        });
    
        
    }

    public get allmonkeys(){
        let tmp = new Array<Monkey>();
        this.allunits.forEach( u => {
            u.allMembers.forEach( m => {
                tmp.push(m);
            })
        })

        return tmp;
    }

    public addUnit(unit : Unit){
        if(this.allunits.includes(unit))    return;
        this.add(unit);
        this.allunits.push(unit);
    }
    
    public addKinship(kinship : Kinship){
        if( this.allkinships.includes( kinship))    return;
        this.add(kinship);
        this.allkinships.push(kinship);
    }

    public aliveMonkeys(){
        let tmp = this.allmonkeys.filter( m => m.isAlive );
        let s = new Set();
        tmp.forEach( t => s.add(t.ID));
        let ret = new Array<number>();
        s.forEach(e => ret.push(e));
        return ret;
    }

    public commuAliveMonkeys() : Monkey[]{
        // 返回社群中还活着的monkey的ID
        let tmp = this.allmonkeys.filter( m => !m.isMirror && m.isAlive && m.inCommu);
        // let s = new Set<number>();
        // tmp.forEach( t => s.add(t.ID));
        // let ret = new Array<number>();
        // s.forEach(e => ret.push(e));
        return tmp;
    }

    // public adultCommuAliveMonkeys(){
    //     let tmp = this.commuAliveMonkeys();
    //     let ret = new Array();


    // }

    public vanishedMonkeys(){
        return this.allmonkeys.filter( m => !m.inCommu );
    }

    public deadMonkeys(){
        return this.allmonkeys.filter( m => !m.isAlive );
    }

    

    public findMonkeyByID(id : number){
        // 找到社群中所有符合id的monkey，包括分身
        return this.allmonkeys.filter( m => m.ID == id )
    }

    public findRealMonkeyByID(id : number){
        // 找到社群中符合id的monkey的真身，如果已经vanished则返回null
        let tmp = this.findMonkeyByID(id).filter(m => !m.isMirror);
        if( tmp.length == 0)    return null;
        return tmp[0];

    }

    public findKinshipByFather( father : Male){
        let tmp = this.allkinships.filter( m => m.father.ID == father.ID);
        if( tmp.length == 0)    return null;
        return tmp;
    }

    public findKinshipByMother( mother : Female){
        let tmp = this.allkinships.filter( m => m.mother.ID == mother.ID);
        if( tmp.length == 0)    return null;
        return tmp;
    }

    public findKinshipByParents( father : Male, mother : Female){
        let tmp = this.allkinships.filter( m => m.father.ID == father.ID && m.mother.ID == mother.ID);
        if( tmp.length == 0)    return null;
        return tmp[0];
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

function genMonkey(name?:string, unit?: Unit, ageLevel?: AGE_LEVEL){
    let monkey;
    if(Math.random() < .5){
        monkey = new Male(MONKEY_GEN_ID(), name+"-Tick-"+tick? name : "next"+"-Tick-"+tick, unit? unit:null);
    } else {
        monkey = new Female(MONKEY_GEN_ID(), name+"-Tick-"+tick ? name : "next"+"-Tick-"+tick, unit? unit:null);
    }
    if(!ageLevel){
        let rate = Math.random();
        if(rate < .33)  ageLevel = AGE_LEVEL.JUVENILE;
        else if(rate < .67) ageLevel = AGE_LEVEL.YOUNG;
        else   ageLevel = AGE_LEVEL.ADULT;
    } 

    monkey.ageLevel = ageLevel;

    return monkey;

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
        unit.addMonkeys();
        units.push(unit);
        unit.allMembers.forEach( m =>{
            monkeys.push(m);
        });
    }

    // 随机挑选父母，生成孩子
    let kinnum = randomInt(3,6);
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
            // 所有的孩子都用分身表示
            //console.log("before deepcopy: ",kid.isMirror, kid);
            kid = kid.deepCopy();
            //console.log("after deepcopy: ",kid.isMirror, kid);
            kids.push( kid);
        }

        // 如果father、mother已经有孩子了，直接将孩子添加到已有的kinship里
        let t = allKinships.filter(k => k.father.ID == father.ID && k.mother.ID == mother.ID)
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


export function genFrame(commu : Community){
    // let allmonkeys = commu.allmonkeys;
    // let allunits = commu.allunits;
    // let allkinships = commu.allkinships;

    // 从社群中消失的猴子的数量
    let vainshNum  = randomInt(0, 4);
    let vanished = new Array<Monkey>();
    for(let i = 0; i < vainshNum; i++){
        let monkey;
        let temp = commu.commuAliveMonkeys();//allmonkeys.filter( m => m.inCommu && m.isAlive);
        monkey = temp[randomInt(0, temp.length-1) ];
        if(Math.random() < .2){
            // monkey 死亡
            console.log("死亡的Monkey：", monkey, "在", monkey.realunit.name , " 死亡！");
            monkey.die();
            
        } else{
            // monkey 离开单元并且不进入任一单元，则表示离开社群
            console.log("离群的Monkey：", monkey, "从", monkey.realunit.name , " 离群！");
            monkey.leaveUnit();
        }
        vanished.push(monkey);
    }
    

    // 进入社群的monkey
    let vansihed = commu.vanishedMonkeys().filter(m => m.isAlive);
    // 以前消失的猴子重回社群
    let reenterNum = randomInt(0, vansihed.length);
    let enterMonkeys = new Array<Monkey>();
    for(let i = 0; i < reenterNum; i++){
        enterMonkeys.push( vansihed[i]);
    }
    // 未知的猴子进入社群
    for(let i = randomInt(0, 3); i > 0; i--){
        let monkey  = genMonkey("unknown"+i);
        if(Math.random() < .1){
            // 未知的猴子的父母在社群中
            let parents = genParents(commu.allunits);
            parents.dad.addKid(monkey);
            parents.mom.addKid(monkey);
            console.log("进入社群的Monkey", monkey, "找到父母：", parents);
            let kid = monkey.deepCopy();
            let t = commu.findKinshipByParents(parents.dad, parents.mom);
            if( t == null){
                let ks = new Kinship(parents.dad, parents.mom, new Array<Monkey>(kid));
                commu.allkinships.push(ks);
            }else{
                t.addKid(kid);
            }
        } 
        enterMonkeys.push(monkey);
    }
    // 为进入社群的猴子分配单元
    enterMonkeys.forEach(m =>{
        if(Math.random() < .4){
            let fiu = new FIU(8);
            m.enterUnit(fiu);
            commu.addUnit(fiu);
            console.log("进入社群的Monkey：", m, " 建立新FIU并进入", fiu.name);
        } else{
            let picked = commu.allunits[ randomInt(0, commu.allunits.length-1) ];
            m.enterUnit( picked );
            console.log("进入社群的Monkey：", m, " 进入单元", picked.name);
            if(picked.unitType == UNIT_TYPE.OMU && m.ageLevel == AGE_LEVEL.ADULT && m.genda == GENDA.MALE && Math.random() < .2){
                // m 挑战主雄成功
                picked.mainMale.isMainMale = false;
                picked.mainMale = m;
                m.isMainMale = true;
                console.log("\n\nchallenge success!\n\n");
            } 
        }
    })
    


    // 成年雌、雄性的迁移
    let migrateMaleNum = randomInt(0, 3);
    let migrateFemaleNum = randomInt(0, 4);
    let migrates = new Array<Monkey>();
    for(let i = 0; i < migrateMaleNum; i++){
        let temp = commu.commuAliveMonkeys().filter(e => e.ageLevel == AGE_LEVEL.ADULT && e.genda == GENDA.MALE && !e.isMainMale && !migrates.includes(e) );
        console.log("\n\n可挑选迁移的成年雄性:", temp, "\n\n");
        if(temp.length == 0) break;
        let picked = temp[ randomInt(0, temp.length-1) ];
        migrates.push(picked);
        let toUnits = commu.allunits.filter( u => u != picked.unit );
        let tarUnit = toUnits[randomInt(0, toUnits.length-1) ];
        console.log("发生了迁移的雄性Monkey：", picked, "  ", picked.realunit.name, " => ", tarUnit.name);
        picked.leaveUnit();
        picked.enterUnit( tarUnit );
    }
    for(let i = 0; i < migrateFemaleNum; i++){
        let temp = commu.commuAliveMonkeys().filter(e => e.ageLevel == AGE_LEVEL.ADULT && e.genda == GENDA.FEMALE && !migrates.includes(e) );
        console.log("\n\n可挑选迁移的成年雌性:", temp, "\n\n");
        if(temp.length == 0) break;
        let picked = temp[ randomInt(0, temp.length-1) ];
        let toUnits = commu.allunits.filter( u => u != picked.unit );
        let tarUnit = toUnits[randomInt(0, toUnits.length-1) ];
        console.log("发生了迁移的雌性Monkey：", picked, "  ", picked.realunit.name, " => ", tarUnit.name);
        picked.leaveUnit();
        picked.enterUnit( tarUnit );
    }
    //console.log("发生了迁移的Monkey：", migrates);

    // 生成的孩子的数目
    let babeNum : number;
    if(Math.random() < 0.95){
        babeNum = randomInt(1,3);//randomInt(4, 8);
    } else if ( Math.random() < .99){
        babeNum = randomInt(4, 5);//randomInt(9, 15);
    } else{
        babeNum = randomInt(6,7);//randomInt(16, 20);
    }

    // 挑选 babeNum 对parents
    let kids = new Array<Monkey>();
    for(let i = 0; i < babeNum; i++){
        let parents = genParents(commu.allunits);
        let kid : Monkey;
        let unit = parents.mom.unit;
        kid = genMonkey(unit.name+'.'+AGE_LEVEL.JUVENILE+'.'+unit.juvenileLayer.length.toString()+"-new", unit, AGE_LEVEL.JUVENILE);
        kid.enterUnit(unit);
        kids.push(kid);
        parents.mom.addKid(kid);
        parents.dad.addKid(kid);
        console.log("新生的Monkey：", kid, "并进入单元：", unit.name, " parents: ", parents);
        kid = kid.deepCopy();
        let t = commu.allkinships.filter(k => k.father == parents.dad && k.mother == parents.mom)
        if( t.length == 0){
            let ks = new Kinship(parents.dad, parents.mom, new Array<Monkey>(kid));
            commu.addKinship(ks);
        }else{
            let ks = t[0];
            ks.addKid(kid);
        }

    }
    //console.log("新生的Monkey：", kids)

    tick++;
    commu.layout();
    console.log("Tick 之后的Community：", commu);

}





