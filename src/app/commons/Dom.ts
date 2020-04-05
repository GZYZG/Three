import {Monkey} from "./Monkey";
import { genFrame} from "../debug/TestData";
import $ = require("jquery");

export function fillBlanks(monkey : Monkey){
    //console.log("fill blanks for: ", monkey);
    let blanks = document.getElementById("monkey_info").children;
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


