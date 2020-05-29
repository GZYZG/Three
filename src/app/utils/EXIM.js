import { resolve2Frame } from "../debug/Benchmark";
import { GET_COMMUNITY } from "./basis";
import { addMonkeyIds2Selecter } from "../commons/Dom";

export function importFile(obj){//1.onchange事件绑定方法出发
    //2.如果没有选中文件则取消
    console.log(obj);
    if (!obj.target.files){
        return
    }
    //3.获得选择的文件对象
    var f = obj.target.files[0]
    //4.初始化新的文件读取对象，浏览器自带，不用导入
    var reader = new FileReader();
    //5.绑定FileReader对象读取文件对象时的触发方法
    reader.onload = function(e){
        //7.获取文件二进制数据流
        var data = e.currentTarget.result;
        //8.利用XLSX解析二进制文件为xlsx对象
        var wb = XLSX.read(data,{type:'binary'})
        //9.利用XLSX把wb第一个sheet转换成JSON对象
        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        //wb.Sheets[Sheet名]获取第一个Sheet的数据
        console.log("workbook:",wb)
        var monkeyData, unitData;
        wb.SheetNames.forEach( ee => {
          let j_data = XLSX.utils.sheet_to_json(wb.Sheets[ee] );
          console.log(`${ee} : `, j_data);
          if(ee=='金丝猴数据'){
            monkeyData = j_data;
          } else{
            unitData = j_data;
          }
        })
        resolve2Frame(monkeyData, unitData);
        console.log(`解析后:`,GET_COMMUNITY());
        addMonkeyIds2Selecter(GET_COMMUNITY());
    }
    //6.使用reader对象以二进制读取文件对象f，
    reader.readAsBinaryString(f)
}
