import { GET_COMMUNITY, GET_TICK } from "./basis";
import { addGroupIds2Dropdown, addMonkeyIds2Selecter } from "./Dom";


export function bindTickRangeStruc(){
    $("#tickRangeStruc").slider({
        formatter: function (value) {
            return  value;
        },
        tooltip_split: true,
        tooltip: "always",
        tooltip_position: "bottom",
    }).on('change', e => {
        //当值发生改变的时候触发
        //console.info("changeEvt:", e);
        //获取旧值和新值
        let COMMUNITY = GET_COMMUNITY();
        console.info("tickRangeStruc:", e.value.oldValue + '--' + e.value.newValue);
        $("#tickLowStruc").html(e.value.newValue[0]);
        $("#tickHighStruc").html(e.value.newValue[1] + " / " + GET_TICK());
        if( e.value.oldValue[1] < e.value.newValue[1]){
            COMMUNITY.forward(e.value.newValue[1] - e.value.oldValue[1] )
            // 按照显示要素显示(e.value.oldValue[1], e.value.newValue[1] ] 中的个体
        } else{
            COMMUNITY.back(e.value.oldValue[1] - e.value.newValue[1]);
        }
        let v1 = $("#tickRange").slider("getValue");
        
        COMMUNITY.showRangeCommunityChange(e.value.newValue[0], e.value.newValue[1] );
        COMMUNITY.showRangeKinship(v1[0], v1[1]);
        // 改变时刻后要及时更新ID列表
        addMonkeyIds2Selecter(COMMUNITY);
    });
}

