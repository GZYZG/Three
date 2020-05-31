import {Monkey} from "./Monkey";
import { Community} from "./Community";
import { GET_TICK, GET_COMMUNITY, GET_MONKEYIDMAP } from "../utils/basis";
import { Unit } from "./Unit";

export function fillBlanks(monkey : Monkey){
    /**
     * 当选中金丝猴时，填充右侧的金丝猴信息列表
     * @param monkey: 被选中的金丝猴
     * @returns: 无返回值
     */
    //console.log("fill blanks for: ", monkey);
    let blanks = $("#monkey_info li");//document.getElementById("monkey_info").children;
    let info = new Array();

    info.push("ID: " + monkey.EID  );
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
        kids_names +=  k.EID +"  ";
    })
    kids_names = kids_names == "" ? "无" : kids_names;
    info.push("孩子: " + kids_names);
    let dad = monkey.father == null ? "unknown" : monkey.father.name.replace("-cloned", "")+" "+  monkey.father.EID ;
    info.push("父亲: " + dad );
    let mom = monkey.mother == null ? "unknown" : monkey.mother.name.replace("-cloned", "")+" "+  monkey.mother.EID ;
    info.push("母亲: " + mom);
    info.push("isAlive: "+ monkey.isAlive );
    info.push("inCommu: "+ monkey.inCommu );
    info.push("isMirror: "+monkey.isMirror);

    for(let i = 0; i < blanks.length; i++){
        blanks[i].innerText = info[i];
    }

}

export function addMonkeyIds2Selecter( commu: Community){
    /** 
     * 将社群所处时刻时，每个单元的金丝猴ID添加到列表中
     * @param commu: 社群
     * @return: 无
     */
    let groups = new Map();
    commu.allunits.forEach( e => {
        let realMonkeys = e.allMembers.filter( ee => !ee.isMirror &&  ee.visible);
        groups.set(e, realMonkeys);
    })
    
    groups.set("死亡or离群", Array.from( new Set(commu.vanishedMonkeys().filter(e => e.visible) ) ) );
    //console.log("\ngroup:", groups);
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
                "class":"sepcial",
                label: `${e.ID}`,
                text: `${GET_MONKEYIDMAP().get( e.ID )}`,
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

export function showUnitTickList(id: number){
    /**
     * 将单元在每个时刻的信息添加到右侧列表中
     * @param id: 单元的内部id
     * @return: 无
     */
    var COMMUNITY = GET_COMMUNITY();
    let allTickData = COMMUNITY.unitLifeTreeData(id);
    let unit = COMMUNITY.allunits.filter(e => e.ID == id)[0];

    console.log("allTickData:", allTickData );
    $("#unitTickList").empty();
    for(let i = unit.createTick; i <= GET_TICK(); i++){
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
            data: allTickData[i-unit.createTick],
            levels: 5,
            expandIcon: "glyphicon glyphicon-plus",
            
        })
        t.after( tree )
    }
}

export function showCommunityTickList(commu:Community=GET_COMMUNITY(), tick: number=GET_TICK() ){
    /**
     * 将社群在指定时刻的信息显示到右侧的
     * @param commu: 社群
     * @param tick: 要显示的时刻（内部的时刻）
     */
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


