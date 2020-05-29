import {Community} from '../commons/Community';
import {Unit, OMU, AMU, FIU} from './../commons/Unit';
import { Monkey, Male, Female} from '../commons/Monkey';
import { Frame} from '../commons/Frame';
import { Kinship} from '../commons/Kinship';
import { randomInt, AGE_LEVEL, GENDA, logFrame, MONKEY_GEN_ID, UNIT_TYPE, SET_COMMUNITY, GET_COMMUNITY, TICK_NEXT, GET_TICK, GET_TICKMAP, GET_MONKEYIDMAP, GET_UNITIDMAP} from '../utils/basis';
import { showCommunityTickList } from '../commons/Dom';


function genName(nameLen:number=4){
    let tab = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWKYZ";
    let tabLen = tab.length;
    let name = '';
    for(let i = 0; i < nameLen; i++){
        name += tab[randomInt(0, tabLen-1)];
    }
    return name;
}

function genNum(type:string, max:number){
    let ret = 0;
    switch(type) {
        case 'NB':
            // 生成的孩子的数目
            if(Math.random() < 1.85){
                //ret = randomInt(2, 6);
                ret = randomInt(1,4);
            } else if ( Math.random() < .96){
                ret = randomInt(7, 12);
            } else{
                ret = randomInt(13, 18);
            }
            break;
        case 'IM':
        case 'EM':
        case 'MR':
        case 'M':
        case 'D':
        case 'NU':
            ret = randomInt(0, max);
    }

    return ret;
}

function genMonkey(name?:string, unit?: Unit, ageLevel?: AGE_LEVEL){
    let monkey;
    if(!ageLevel){
        let rate = Math.random();
        if(rate < .33)  ageLevel = AGE_LEVEL.JUVENILE;
        else if(rate < .67) ageLevel = AGE_LEVEL.YOUNG;
        else   ageLevel = AGE_LEVEL.ADULT;
    } 

    if(Math.random() < .5){
        monkey = new Male(MONKEY_GEN_ID(),  name ? name : genName(), unit? unit:null);
    } else {
        monkey = new Female(MONKEY_GEN_ID(), name ? name : genName(), unit? unit:null);
    }
    
    monkey.ageLevel = ageLevel;

    return monkey;

}

function genParents(units : Array<Unit>){
    let father : Monkey = null;
    let mother : Monkey = null;
    let dadUnit : Unit;
    let momUnit : Unit;
    while( !father){
        let nth = randomInt(0, units.length-1);
        dadUnit = units[nth];
        if( dadUnit instanceof OMU && dadUnit.mainMale){
            father = dadUnit.mainMale;
        }else {
            let males = dadUnit.currentMembers.filter( e => e.genda == GENDA.MALE && !e.isMirror);
            if( males.length == 0)  continue;
            father = males[ randomInt(0, males.length-1) ];
        }
    }
    if( dadUnit.unitType == UNIT_TYPE.OMU && Math.random() < .6){
        // 从父亲所在的单元挑选母亲，要注意当前时刻母亲应该在该单元内
        let females = dadUnit.adultLayer.filter( e => e.genda == GENDA.FEMALE && !e.isMirror);
        while(females.length != 0 && !mother){
            let nth = randomInt(0, females.length-1);
            mother = females[nth];
        }
    }

    while( !mother){
        let nth = randomInt(0, units.length-1);
        momUnit = units[nth];
        if( momUnit.unitType == UNIT_TYPE.OMU){
            // 注意，在家庭单元中也有可能有成年雄性，而且要从当前时刻在该单元的雌性中挑选
            let females = momUnit.adultLayer.filter(e => e.genda == GENDA.FEMALE && !e.isMirror);
            mother = females[ randomInt(1, females.length-1 ) ];
        }else {
            let females = momUnit.currentMembers.filter( e => e.genda == GENDA.FEMALE && !e.isMirror);
            if( females.length == 0)  continue;
            mother = females[randomInt(0, females.length) ];
        }
    }

    return {
        dad: father,
        mom: mother,
    }
}

function genBase(unitNum:number){
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
    let kinnum = randomInt(2, 2);
    let allkids = new Set<Monkey>();
    var allKinships = new Array<Kinship>();
    for(let i = 0; i < kinnum; i++){
        // 挑选一对成年异性猴子
        let parents = genParents(units);
        let father  = parents.dad;
        let mother  = parents.mom;
 
        let kidnum = randomInt(1, 1);
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

export function genSlice(commu : Community, param?:any ){
    if(!param)  param = {};
    let deadMax = param.deadMax || 2;   // 死亡的最大数量
    let emMax = param.emMax || 2;       // 迁出的最大数量
    let imMax = param.imMax || 4;       // 迁入的最大数量
    let maleMigrateMax = param.maleMigrateMax || 3;         // 雄性迁移的最大数量
    let femaleMigrateMax = param.femaleMigrateMax || 3;     // 雌性迁移的最大数量
    let imHasParentsRate = param.imHasParentsRate || .15;   // 迁入的个体中，其父母在群中的概率
    let mrRate = param.mrRate || .8;    // 挑战主雄成功的概率

    let vanished;
    let newUnits = new Array<Unit>(); 
    let enterCommu = new Array();
    let challengeMainMale = new Array();
    let migrates = new Array();
    let newKinships = new Array();
    // 从社群中消失的猴子的数量
    let deadNum = genNum('D', deadMax);
    let outNum = genNum('EM', emMax);
    let dead = new Array();
    let outCommu = new Array();
    // 注意！！！monkey死亡或者离群时有可能是主雄，所以frame中需要记录！
    for(let i = 0; i < deadNum; i++){
        let monkey;
        let temp = commu.commuAliveMonkeys();
        monkey = temp[randomInt(0, temp.length-1) ];
        dead.push({monkey: monkey, isMainMale: monkey.isMainMale});
    }
    for(let i = 0; i < outNum; i++){
        let monkey;
        let temp = commu.commuAliveMonkeys().filter( e => !dead.includes(e) );
        if(temp.length == 0)    break;
        monkey = temp[randomInt(0, temp.length-1) ];
        outCommu.push({monkey: monkey, isMainMale: monkey.isMainMale });
    }
    vanished = {
        dead: dead,
        outCommu: outCommu,
    }

    // 进入社群的monkey
    let tmp = commu.outCommuMonkeys();
    // 以前消失的猴子重回社群
    let reenterNum = randomInt(0, tmp.length);
    let enterMonkeys = new Set<Monkey>();
    for(let i = 0; i < reenterNum; i++){
        enterMonkeys.add( tmp[i]);
    }
    // 未知的猴子进入社群
    let IMNum = genNum('IM', imMax);
    for(let i = 0; i < IMNum; i++){
        let monkey  = genMonkey("unknown"+i);
        if(Math.random() < imHasParentsRate){
            // 未知的猴子的父母在社群中
            let parents = genParents(commu.allunits);
            // //console.log("进入社群的Monkey", monkey, "找到父母：", parents);
            // 通过frame来完成
            newKinships.push({kid: monkey, parents: parents});
        } 
        enterMonkeys.add(monkey);
    }
    // 为进入社群的猴子分配单元
    enterMonkeys.forEach(m =>{
        if(Math.random() < .3 && m.genda == GENDA.MALE && m.ageLevel == AGE_LEVEL.ADULT){
            let omu = new OMU(10, m);
            enterCommu.push({monkey: m, unit: omu});
            newUnits.push(omu);
        } else if( Math.random() < .3 && m.genda == GENDA.MALE){
            let amu = new AMU(8);
            enterCommu.push({monkey: m, unit: amu} );
            newUnits.push(amu);
        } else if(Math.random() < .4){
            let fiu = new FIU(8); 
            // 通过frame来完成
            enterCommu.push({monkey: m, unit: fiu} );
            newUnits.push(fiu);
            //console.log("进入社群的Monkey：", m, " 建立新FIU并进入", fiu.name);
        } else{
            let picked = commu.allunits[ randomInt(0, commu.allunits.length-1) ];
            // 通过frame来完成
            enterCommu.push({monkey: m, unit: picked});
            //console.log("进入社群的Monkey：", m, " 进入单元", picked.name);
            if(picked instanceof OMU && m.ageLevel == AGE_LEVEL.ADULT && m.genda == GENDA.MALE  && Math.random() < mrRate){
                // m 挑战主雄成功
                // 通过frame来完成
                challengeMainMale.push({unit: picked, winner: m, loser: picked.mainMale });
                console.log("挑战成功！"," unit:", picked.name, "  winner:", m)
                //picked.mainMale = m;
            } else{
                console.log("挑战失败！"," unitType:", picked.unitType, " ageLevel:", m.ageLevel, " genda:", m.genda)
            }
        }
    })
    
    // 成年雌、雄性的迁移
    let migrateMaleNum = genNum('M', maleMigrateMax);
    let migrateFemaleNum = genNum('M', femaleMigrateMax);
    let migrated = new Array<Monkey>();
    for(let i = 0; i < migrateMaleNum; i++){
        let temp = commu.commuAliveMonkeys().filter(e => e.ageLevel == AGE_LEVEL.ADULT && e.genda == GENDA.MALE && !e.isMainMale && !migrated.includes(e) && !dead.includes(e) );
        //console.log("\n\n可挑选迁移的成年雄性:", temp, "\n\n");
        if(temp.length == 0) break;
        let picked = temp[ randomInt(0, temp.length-1) ];
        let toUnits = commu.allunits.filter( u => u != picked.unit ).concat(newUnits);
        let tarUnit = toUnits[randomInt(0, toUnits.length-1) ];
        migrated.push(picked);
        // 通过frame来完成
        migrates.push({monkey: picked, originUnit: picked.realunit, targetUnit: tarUnit});
    }
    for(let i = 0; i < migrateFemaleNum; i++){
        let temp = commu.commuAliveMonkeys().filter(e => e.ageLevel == AGE_LEVEL.ADULT && e.genda == GENDA.FEMALE && !migrated.includes(e) && !dead.includes(e) );
        //console.log("\n\n可挑选迁移的成年雌性:", temp, "\n\n");
        if(temp.length == 0) break;
        let picked = temp[ randomInt(0, temp.length-1) ];
        let toUnits = commu.allunits.filter( u => u != picked.unit ).concat(newUnits);
        let tarUnit = toUnits[randomInt(0, toUnits.length-1) ];
        migrated.push(picked);
        // 通过frame来完成
        migrates.push({monkey: picked, originUnit: picked.realunit, targetUnit: tarUnit});
    }

    // 生成的孩子的数目
    let babeNum = genNum('NB', -1);
    // 挑选 babeNum 对parents
    //let newBabes = new Array();
    for(let i = 0; i < babeNum; i++){
        let parents = genParents(commu.allunits);
        let kid : Monkey;
        let unit = parents.mom.unit;
        kid = genMonkey(unit.name+'.'+AGE_LEVEL.JUVENILE+'.'+unit.juvenileLayer.length.toString()+"-new", unit, AGE_LEVEL.JUVENILE);
        // 通过frame来完成
        enterCommu.push( {monkey: kid, unit: unit});
        newKinships.push({kid: kid, parents: parents});
        //console.log("新生的Monkey：", kid, "并进入单元：", unit.name, " parents: ", parents);
    }
    console.log("消失的: ", vanished,"\n新增的单元: ", newUnits, "\n进入社群的: ", enterCommu, "\n挑战家长成功的: ", challengeMainMale,  "\n迁移的: ", migrates, "\n新增的亲缘关系: ", newKinships);
    let para = {
        vanished: vanished,
        newUnits: newUnits,
        enterCommu: enterCommu,
        challengeMainMale: challengeMainMale,
        migrates: migrates,
        newKinships: newKinships,
        tick: GET_TICK(),
    }
    let frame = new Frame(para);
    //let logStr = logFrame(frame,commu.frames.indexOf(frame));
    // commu.logInfo.push(logStr);
    //console.log( logStr );

    return frame;
}


    


export function resolve2Frame( monkeyData:Array<any>, unitData:Array<any>){
    // let monkeyHead = monkeyData[0]; //[	'ID', 'genda', 'name', 'ageLevel', 'father', 'mother', 'unit', 'dead' , 'year']
    // let idxID = monkeyHead.indexOf('ID');
    // let idxGenda = monkeyHead.indexOf('geanda');
    // let idxName = monkeyHead.indexOf('name');
    // let idxAgeLevel = monkeyHead.indexOf('ageLevel');
    // let idxFather = monkeyHead.indexOf('father');
    // let idxMother = monkeyHead.indexOf('mother');
    // let idxUnit = monkeyHead.indexOf('unit');
    // let idxDead = monkeyHead.indexOf('dead');
    // let idxYear = monkeyHead.indexOf('year');

    let pre = null;
    let cur = null;
    let ticks = Array.from( new Set( monkeyData.map(e => e.year)) ).sort(function(a,b){return a-b} );
    let monkeyIDs = Array.from(new Set(monkeyData.map(e => e.ID) ) ).sort(function(a,b){return a-b} );
    let unitIDs = Array.from(new Set( unitData.map(e => e.ID ) ) ).sort(function(a,b) {return a-b} );
    let tickMap = GET_TICKMAP();// new Map();
    let monkeyIDMap = GET_MONKEYIDMAP();// new Map();
    let unitIDMap = GET_UNITIDMAP();// new Map();

    ticks.forEach((e, idx) => tickMap.set(idx, e) );
    // monkeyIDs.forEach( (e,idx) => monkeyIDMap.set(idx, e) );
    // unitIDs.forEach( (e, idx) => unitIDMap.set(idx, e) );
    
    let _baseMembers = monkeyData.filter(e => e.year == ticks[0] );
    let _baseUnits = unitData.filter(e => e.year == ticks[0] );
    let _baseKids = _baseMembers.filter(e => e.father || e.mother );
    let baseMonkeys = Array<Monkey>();
    let baseUnits = Array<Unit>();
    let baseKinships = Array<Kinship>();

    let baseData = {
        baseUnits : baseUnits,
        baseMonkeys : baseMonkeys,
        baseKinships : baseKinships,
    }
    
    _baseMembers.forEach(e => {
        let m;
        if(e.genda == 'male'){
            m = new Male(MONKEY_GEN_ID(), e.name, null);
        }else{
            m = new Female(MONKEY_GEN_ID(), e.name, null);
        }
        switch(e.ageLevel){
            case 'ADU': m.ageLevel = AGE_LEVEL.ADULT; break;
            case 'YOU': m.ageLevel = AGE_LEVEL.YOUNG; break;
            case 'JUV': m.ageLevel = AGE_LEVEL.JUVENILE; break;
        }
        m.EID = e.ID;
        monkeyIDMap.set(m.ID, e.ID );
        baseMonkeys.push(m);
    })


    _baseUnits.forEach(e => {
        let u;
        switch(e.type.toLowerCase()){
            case 'omu':
                u = new OMU(12, baseMonkeys.filter(ee => ee.ID == e.mainMale)[0] );  
                break;
            case 'amu':
                u = new AMU(10);
                break;
            case 'fiu':
                u = new FIU(10);
                break;
        }
        u.EID = e.ID;
        unitIDMap.set(u.ID, e.ID);
        baseUnits.push(u);
    })

    for(let i = 0; i < baseMonkeys.length; i++){
        let u = baseUnits.filter(e => unitIDMap.get(e.ID) == _baseMembers[i].unit)[0];
        baseMonkeys[i].enterUnit(u, ticks[0] );
    }
    for(let i = 0; i < baseUnits.length; i++){
        if( baseUnits[i] instanceof OMU){
            let m = baseMonkeys.filter( e => monkeyIDMap.get(e.ID) == _baseUnits[i].mainMale)[0];
            baseUnits[i].mainMale = m;
        }
    }
    _baseKids.forEach( e => {
        let kid = baseMonkeys.filter(ee => monkeyIDMap.get(ee.ID) == e.ID)[0];
        let dad = baseMonkeys.filter(ee => monkeyIDMap.get(ee.ID) == e.father)[0];
        let mom = baseMonkeys.filter(ee => monkeyIDMap.get(ee.ID) == e.mother)[0];
        dad.addKid(kid);
        mom.addKid(kid);
        let tmp = baseKinships.filter( ee => ee.father.ID == dad.ID && ee.mother.ID == mom.ID);
        if(tmp.length == 0){
            let k = new Kinship(dad, mom, [kid]);
            baseKinships.push(k);
        } else {
            tmp[0].addKid(kid);
        }

    })
    SET_COMMUNITY(baseData);
    let community = GET_COMMUNITY();
    community.layout();


    for(let i = 1; i < ticks.length; i++){
        TICK_NEXT();
        let tickMembers = monkeyData.filter(e => e.year == tickMap.get(i) );
        let tickUnits = unitData.filter(e => e.year == tickMap.get(i) );
        let dead = tickMembers.filter( e => e.dead == 'T' ).map(e => e.ID);
        let prevMembers = new Set(monkeyData.filter(e => e.year == tickMap.get(i-1) && !dead.includes(e) ).map(e => e.ID) );
        let curtMembers = new Set(tickMembers.filter(e => !dead.includes(e.ID)  ).map( e => e.ID ) );
        let prevUnits = unitData.filter(e => e.year == tickMap.get(i-1) );
        let curtUnits = tickUnits;
        let enterMonkeys = new Array();
        let IM = new Array<{monkey: Monkey, unit: Unit}>();
        let outMonkeys = new Array();
        let EM = new Array<{monkey: Monkey, isMainMale: boolean}>();
        let D = new Array<{monkey: Monkey, isMainMale: boolean}>();
        let NB = new Array();
        let newKinships = new Array<{kid: Monkey, parents:{dad:Male, mom:Female}}>();
        let MR = new Array<{unit:Unit, winner:Monkey, loser:Monkey}>();
        let NU = new Array();
        let M = new Array<{monkey:Monkey, originUnit:Unit, targetUnit:Unit}>();
        let union = new Array();
        curtMembers.forEach( e => {
            if(!prevMembers.has(e) ){
                let info = tickMembers.filter( ee => ee.ID == e)[0];
                let m;
                if(info.genda == 'male'){
                    m = new Male(MONKEY_GEN_ID(), info.name, null);
                } else{
                    m = new Female(MONKEY_GEN_ID(), info.name, null);
                }
                m.EID = e;
                monkeyIDMap.set(m.ID, e);
                m.ageLevel = info.ageLevel;
                enterMonkeys.push(m);
                if(info.father || info.mother){
                    NB.push(e);
                }
            }
            else    union.push(e);
        })

        curtUnits.forEach( e => {
            if(prevUnits.filter(ee => ee.ID == e.ID).length == 0 ){
                let info = tickUnits.filter(ee => ee.ID == e.ID)[0];
                let u;
                switch( info.type.toLowerCase()){
                    case 'omu':
                    u = new OMU(12, community.commuAliveMonkeys().concat(enterMonkeys).filter(ee => monkeyIDMap.get(ee.ID) == info.mainMale)[0] );  
                    break;
                case 'amu':
                    u = new AMU(10);
                    break;
                case 'fiu':
                    u = new FIU(10);
                    break;
                }
                u.EID = e.ID;
                unitIDMap.set(u.ID, e.ID);
                NU.push(u);
            }
        })
        enterMonkeys.forEach( e => {
            let info = tickMembers.filter( ee => ee.ID == monkeyIDMap.get(e.ID) )[0];
            IM.push({ monkey: e, unit: community.allunits.concat(NU).filter(ee => unitIDMap.get(ee.ID) == info.unit )[0] } );
        })
        dead.forEach(e => {
            let m = community.commuAliveMonkeys().filter(ee => monkeyIDMap.get(ee.ID) == e)[0];
            D.push({monkey: m, isMainMale: m.isMainMale });
        })

        community.allunits.forEach(e => {
            if( e instanceof OMU ){
                let oriID = prevUnits.filter(ee => ee.ID == unitIDMap.get(e.ID) )[0].mainMale;
                let tarID = curtUnits.filter(ee => ee.ID == unitIDMap.get(e.ID) )[0].mainMale;
                if( oriID != tarID ){
                    MR.push({unit: e, winner: community.commuAliveMonkeys().concat().filter(ee => monkeyIDMap.get(ee.ID) == tarID )[0] ,
                            loser: community.commuAliveMonkeys().filter(ee => monkeyIDMap.get(ee.ID) == oriID)[0] })
                }
            }
        })
        //NB = curtMembers.filter(e => e.father || e.mother);
        NB.forEach(e => {
            let m = enterMonkeys.filter(ee => monkeyIDMap.get(ee.ID) == e)[0];
            let info = tickMembers.filter(ee => ee.ID == e)[0];
            let dad = community.commuAliveMonkeys().concat(enterMonkeys).filter(ee => monkeyIDMap.get(ee.ID) == info.father)[0];
            let mom = community.commuAliveMonkeys().concat(enterMonkeys).filter(ee => monkeyIDMap.get(ee.ID) == info.mother)[0];
            if(i == 2){
                info;
            }
            newKinships.push({kid:m, parents:{dad:dad, mom:mom}} );
        })


        prevMembers.forEach( e => {
            if(!curtMembers.has(e))     outMonkeys.push(community.findRealMonkeyByID(e) );
        })

        union.forEach( e => {
            let m = community.commuAliveMonkeys().filter(ee => monkeyIDMap.get(ee.ID) == e)[0];
            let tarInfo = tickMembers.filter(ee => ee.ID == e )[0];
            if(tarInfo.unit != unitIDMap.get( m.unit.ID ) ){
                let oriUnit = community.allunits.filter(ee => ee.ID == m.unit.ID)[0];
                let tarUnit = community.allunits.concat(NU).filter(ee => unitIDMap.get(ee.ID) == tarInfo.unit)[0];
                M.push({monkey:m, originUnit: oriUnit, targetUnit: tarUnit}) ;
            }
        })
        let para = {
            vanished: {
                dead:D,
                outCommu: EM,
            },
            newUnits: NU,
            enterCommu: IM,
            challengeMainMale: MR,
            migrates: M,
            newKinships: newKinships,
            tick: GET_TICK(),
        }
        let frame = new Frame(para);
        console.log(`${i}-------\n`,frame);
        community.addFrame(frame);
        community.forward();
        community.layout();
        let logStr = logFrame(frame,community.frames.indexOf(frame));
        community.logInfo.push(logStr);
        console.log( `----------TOUCH----------\n${logStr}` );
        showCommunityTickList();
        
    }

}


