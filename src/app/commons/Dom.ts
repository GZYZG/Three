import {Monkey} from "./Monkey";
import { genFrame} from "../debug/TestData";
import $ = require("jquery");

export function fillBlanks(monkey : Monkey){
    let blanks = document.getElementById("monkey_info").children;
    let info = new Array();
    
    let id = monkey.ID;
    info.push("ID: " + id);
    let name = monkey.name;
    info.push("NAME: " + name.replace("-cloned", ""));
    let genda = monkey.genda;
    info.push("GENDA: " + genda);
    let unit = monkey.unit.name;
    info.push("UNIT: " + unit);
    let birth = monkey.birthDate;
    info.push("出生日期: " + birth.toLocaleDateString());
    let kids = monkey.kids;
    let kids_names = "";
    kids.forEach( k =>{
        kids_names += k.name+" ";
    })
    kids_names = kids_names == "" ? "无" : kids_names;
    info.push("孩子: " + kids_names);
    let dad = monkey.father == null ? "unknown" : monkey.father.name.replace("-cloned", "");
    info.push("父亲: " + dad );
    let mom = monkey.mother == null ? "unknown" : monkey.mother.name.replace("-cloned", "");
    info.push("母亲: " + mom);

    for(let i = 0; i < blanks.length; i++){
        blanks[i].innerText = info[i];
    }

}


