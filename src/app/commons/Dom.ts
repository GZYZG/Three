import {Monkey} from "./Monkey";
import { genFrame, Community} from "../debug/TestData";
//import $ = require("jquery");
import { GET_TICK, GET_COMMUNITY } from "./basis";
import { Unit } from "./Unit";

export function fillBlanks(monkey : Monkey){
    //console.log("fill blanks for: ", monkey);
    let blanks = $("#monkey_info li");//document.getElementById("monkey_info").children;
    let info = new Array();

    info.push("ID: " + monkey.ID);
    info.push("NAME: " + monkey.name.replace("-cloned", ""));
    info.push("GENDA: " + monkey.genda);
    info.push("入群时间: Tick-" + monkey.migrateTable[0].tick);
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

    for(let i = 0; i < blanks.length; i++){
        blanks[i].innerText = info[i];
    }

}

export function addMonkeyIds2Selecter( commu: Community){
    let groups = new Map();
    commu.allunits.forEach( e => {
        let realMonkeys = e.allMembers.filter( ee => !ee.isMirror &&  ee.visible);
        groups.set(e, realMonkeys);
    })
    
    groups.set("死亡or离群", Array.from( new Set(commu.vanishedMonkeys().filter(e => e.visible) ) ) );
    console.log("\ngroup:", groups);
    let selecter = $("#monkeySelecter").empty();
    
    let entries = groups.entries();
    let t;
    while( !(t = entries.next()).done){
        let optGroup = $("<optgroup>", {
            "class": "",
            label: `${t.value[0] instanceof Unit ?t.value[0].name: "死亡or离群"}(${t.value[1].length})`,
        });
        let unitColor = t.value[0] instanceof Unit ? "#"+ (t.value[0].color).toString(16) : "lightgray"  
        
        
        selecter.append(optGroup);
        t.value[1].forEach( e => {
            let item = $("<option>", {
                label: `${e.ID}`,
                text: `${e.ID}`,
                monkeyID: ""+e.ID,
            }).attr({
                "data-subtext": `${e.name}`
            })

            item.css({
                "background-color":unitColor,
                "width":"90%",
                "padding": "0 5%",
                "margin": "2px 5%",
                "border-radius": "6px",
                "opacity": ".8",
            })
            optGroup.append(item);
        })
    }
    selecter.selectpicker("refresh");
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


export function showUnitTickList(id: number){
    var COMMUNITY = GET_COMMUNITY();
    let allTickData = COMMUNITY.unitLifeTreeData(id);
    console.log("allTickData:", allTickData );
    $("#unitTickList").empty();
    for(let i = 0; i <= GET_TICK(); i++){
        if($("#unitTick_"+i).length != 0){
            continue;
        }
        let t = $("<a>", {
            "class": "list-group-item  list-group-item-success",
            text: "Tick-" + i,
        });
        t.attr({
            "data-toggle": "collapse",
            "data-target": "#unitTick_"+i,
            "href": "#unitTick_"+i,
            "role": "button",
        })
        $("#unitTickList").append(t);
        
        let tree = $("<div>",{
            text: "123",
            "class": "collapse",
            id: "unitTick_"+i,
        });
        tree.treeview({ 
            data: allTickData[i],
            levels: 5,
            expandIcon: "glyphicon glyphicon-plus",
            
        })
        t.after( tree )
    }
}

export function showCommunityTickList(commu:Community=GET_COMMUNITY(), tick: number=GET_TICK() ){
    if(!commu)  commu = GET_COMMUNITY();
    let t = $("<a>", {
        "class": "list-group-item  list-group-item-success",
        text: "Tick-"+tick,
    });
    t.attr({
        "data-toggle": "collapse",
        "data-target": "#Tick_" + tick,
        "href": "#Tick_" + tick,
        "role": "button",
    })

    $("#tickList").append(t);

    let tree = $("<div>",{
        text: "123",
        "class": "collapse",
        id: "Tick_" + tick,
    });
    tree.treeview({ 
        data: commu.tickTreeData( tick ),
        levels: 5,
        expandIcon: "glyphicon glyphicon-plus",
    })
    t.after( tree )
}

export function selectMonkeyID(){

}