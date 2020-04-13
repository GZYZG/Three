import {Monkey} from "./Monkey";
import { genFrame, Community} from "../debug/TestData";
import $ = require("jquery");
import { GET_TICK } from "./basis";

export function fillBlanks(monkey : Monkey){
    //console.log("fill blanks for: ", monkey);
    let blanks = $("#monkey_info li");//document.getElementById("monkey_info").children;
    let info = new Array();

    info.push("ID: " + monkey.ID);
    info.push("NAME: " + monkey.name.replace("-cloned", ""));
    info.push("GENDA: " + monkey.genda);
    info.push("年龄段: "+ monkey.ageLevel);
    info.push("分身所属单元: " + monkey.unit.name);
    let tmp = monkey.realunit ;
    let real = tmp ? tmp.name : "不在社群中!"
    info.push("当前所属单元: " + real);
    let kids = monkey.kids;
    let kids_names = "";
    kids.forEach( k =>{
        kids_names += k.ID+"  ";
    })
    kids_names = kids_names == "" ? "无" : kids_names;
    info.push("孩子: " + kids_names);
    let dad = monkey.father == null ? "unknown" : monkey.father.name.replace("-cloned", "")+" "+monkey.father.ID;
    info.push("父亲: " + dad );
    let mom = monkey.mother == null ? "unknown" : monkey.mother.name.replace("-cloned", "")+" "+monkey.mother.ID;
    info.push("母亲: " + mom);
    info.push("isAlive: "+ monkey.isAlive );
    info.push("inCommu: "+ monkey.inCommu );
    info.push("isMirror: "+monkey.isMirror);

    for(let i = 1; i < blanks.length; i++){
        blanks[i].innerText = info[i-1];
    }

}


export function addGroupIds2Dropdown( commu : Community){
    let groups = new Map();
    commu.allunits.forEach( e => {
        let realMonkeys = e.allMembers.filter( ee => !ee.isMirror &&  ee.visible);
        groups.set(e.name, realMonkeys.map(e => e.ID));
    })
    
    groups.set("死亡or离群", Array.from( new Set(commu.vanishedMonkeys().filter(e => e.visible).map( e => e.ID) ) ) );

    let menu = $("#idDropdown .dropdown-menu").empty()[0];
    
    let entries = groups.entries();
    let t;
    while( !(t = entries.next()).done){
        let item = document.createElement("button");
        item.className = "dropdown-item disabled";
        item.type="button"
        item.textContent = ""+t.value[0]+ "( "+t.value[1].length+ ")";
        menu.append(item);
        t.value[1].forEach( e => {
            let item = document.createElement("button");
            item.className = "dropdown-item";
            item.type="button"
            item.textContent = ""+e;
            menu.append(item);
        })
    }
   

}

export function addId2Dropdown(commu: Community){
    let tmp = commu.allmonkeys;
    let ids = new Set();
    tmp.forEach( e => {
        ids.add(e.ID);
    })

    // 清空原来的列表，并获得menu菜单
    let menu = $("#idDropdown .dropdown-menu").empty()[0];
    let ida = Array.from(ids);
    ida.sort(function(a:number, b:number){return a - b})
    ida.forEach( e => {
        let item = document.createElement("button");
        item.className = "dropdown-item";
        item.type="button"
        item.textContent = ""+e;
        menu.appendChild(item);
    })
}

export function addTick2Dropdown(tick?:number){
    let menu = $("#tickDropdown .dropdown-menu");
    if( !tick)  tick = GET_TICK();
    let item = $('<button></button>', {
        "class": "dropdown-item",
        type: "button",
        html: ""+tick,
    }).appendTo(menu);

}
