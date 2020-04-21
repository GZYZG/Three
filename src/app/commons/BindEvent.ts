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
        } else{
            COMMUNITY.back(e.value.oldValue[1] - e.value.newValue[1]);
        }
        //COMMUNITY.showRangeKinship(e.value.newValue[0], e.value.newValue[1]);
        COMMUNITY.showRangeCommunityChange(e.value.newValue[0], e.value.newValue[1] );
        // 改变时刻后要及时更新ID列表
        addGroupIds2Dropdown(COMMUNITY);
        addMonkeyIds2Selecter(COMMUNITY);
    });
}

