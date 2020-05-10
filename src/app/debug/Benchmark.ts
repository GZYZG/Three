import {Community} from './TestData';
import {Unit, OMU, AMU, FIU} from './../commons/Unit';
import { Monkey, Male, Female} from '../commons/Monkey';
import { Frame} from '../commons/Dynamics';
import { randomInt, AGE_LEVEL, GENDA, logFrame, MONKEY_GEN_ID, UNIT_TYPE} from '../commons/basis';


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
            if(Math.random() < .85){
                ret = randomInt(2, 6);
            } else if ( Math.random() < .96){
                ret = randomInt(7, 12);
            } else{
                ret = randomInt(13, 18);
            }
            break;
        case '_IM':
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

export function genSlice(commu : Community){
    let vanished;
    let newUnits = new Array<Unit>(); 
    let enterCommu = new Array();
    let challengeMainMale = new Array();
    let migrates = new Array();
    let newKinships = new Array();
    // 从社群中消失的猴子的数量
    let deadNum = genNum('D', 2);
    let outNum = genNum('EM', 2);
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
    let _IMNum = genNum('_IM', 3);
    for(let i = 0; i < _IMNum; i++){
        let monkey  = genMonkey("unknown"+i);
        if(Math.random() < .1){
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
        if(Math.random() < .4){
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
            if(picked instanceof OMU && m.ageLevel == AGE_LEVEL.ADULT && m.genda == GENDA.MALE  && Math.random() < .8){
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
    let migrateMaleNum = genNum('M', 3);
    let migrateFemaleNum = genNum('M', 3);
    let migrated = new Array<Monkey>();
    for(let i = 0; i < migrateMaleNum; i++){
        let temp = commu.commuAliveMonkeys().filter(e => e.ageLevel == AGE_LEVEL.ADULT && e.genda == GENDA.MALE && !e.isMainMale && !migrated.includes(e) && !dead.includes(e) );
        //console.log("\n\n可挑选迁移的成年雄性:", temp, "\n\n");
        if(temp.length == 0) break;
        let picked = temp[ randomInt(0, temp.length-1) ];
        let toUnits = commu.allunits.filter( u => u != picked.unit );
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
        let toUnits = commu.allunits.filter( u => u != picked.unit );
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
        tick: -1,
    }
    let frame = new Frame(para);
    let logStr = logFrame(frame,commu.frames.indexOf(frame));
    // commu.logInfo.push(logStr);
    console.log( logStr );

    return frame;
}

