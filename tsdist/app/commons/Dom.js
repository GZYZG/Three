"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fillBlanks(monkey) {
    //console.log("\n\n", $('.center'),"\n\n\n");
    var blanks = document.getElementById("monkey_info").children;
    var info = new Array();
    var id = monkey.ID;
    info.push("ID: " + id);
    var name = monkey.name;
    info.push("NAME: " + name.replace("-cloned", ""));
    var genda = monkey.genda;
    info.push("GENDA: " + genda);
    var unit = monkey.unit.name;
    info.push("UNIT: " + unit);
    var birth = monkey.birthDate;
    info.push("出生日期: " + birth.toLocaleDateString());
    var kids = monkey.kids;
    var kids_names = "";
    kids.forEach(function (k) {
        kids_names += k.name + " ";
    });
    kids_names = kids_names == "" ? "无" : kids_names;
    info.push("孩子: " + kids_names);
    var dad = monkey.father == null ? "unknown" : monkey.father.name.replace("-cloned", "");
    info.push("父亲: " + dad);
    var mom = monkey.mother == null ? "unknown" : monkey.mother.name.replace("-cloned", "");
    info.push("母亲: " + mom);
    for (var i = 0; i < blanks.length; i++) {
        blanks[i].innerText = info[i];
    }
}
exports.fillBlanks = fillBlanks;
function genFrame() {
    console.log("NEXT FRAME!");
}
exports.genFrame = genFrame;
