import { GET_COMMUNITY, GET_TICK, GET_TICKMAP, TICK_NEXT, logFrame } from "../utils/basis";
import { addMonkeyIds2Selecter, showCommunityTickList, showUnitTickList } from "./Dom";
import { genSlice } from "../debug/Benchmark";
import {Community} from "./Community";


export function bindKinshipTickRange() {
    /**
     * 亲缘关系时间范围发生改变时的事件
     */
    $('#tickRange').slider({
        formatter: function (value) {
            return  value;
        },
        tooltip_split: true,
        tooltip: "always",
        tooltip_position: "bottom",
    }).on('slide',  slideEvt => {
        //当滚动时触发，可能有重复
        //console.info("slideEvt:", slideEvt);
    }).on('change', e => {
        var COMMUNITY = GET_COMMUNITY();
        //当值发生改变的时候触发
        //console.info("changeEvt:", e);
        //获取旧值和新值
        //console.info(e.value.oldValue + '--' + e.value.newValue);
        //$("#tickLow").html(e.value.newValue[0]);
        $("#tickLow").html( GET_TICKMAP().get( e.value.newValue[0] ) || e.value.newValue[0] );
        //$("#tickHigh").html(e.value.newValue[1] + " / " + GET_TICK());
        $("#tickHigh").html( GET_TICKMAP().get( e.value.newValue[1] ) || e.value.newValue[1] + " / " + ( GET_TICKMAP().get( GET_TICK() ) || GET_TICK() ) );
        if( e.value.oldValue[1] != e.value.newValue[1] ){
            //console.log("重布局！");
            COMMUNITY.layout(e.value.newValue[1]);
        }

        let v1 = $("#tickRangeStruc").slider("getValue");
        COMMUNITY.showRangeKinship(e.value.newValue[0], e.value.newValue[1]);
        COMMUNITY.showRangeCommunityChange(v1[0], v1[1]);
        COMMUNITY.showRangeKinship(e.value.newValue[0], e.value.newValue[1]);

        if(!window.VIEW_KEYS['kinship']){
            COMMUNITY.maskKinship();
            COMMUNITY.showRangeCommunityChange( v1[0], v1[1] );
        }
        //COMMUNITY.maskNewUnit(Math.max(e.value.newValue[1], v1[1]), GET_TICK() );
    });
}


export function bindStrucTickRange(){
    /**
     * 社会组成时间范围发生改变时触发的事件
     */
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
        $("#tickLowStruc").html( GET_TICKMAP().get( e.value.newValue[0] ) || e.value.newValue[0] );
        $("#tickHighStruc").html( GET_TICKMAP().get( e.value.newValue[1] ) || e.value.newValue[1] + " / " + ( GET_TICKMAP().get( GET_TICK() ) || GET_TICK() ) );
        if( e.value.oldValue[1] < e.value.newValue[1]){
            COMMUNITY.forward(e.value.newValue[1] - e.value.oldValue[1] );
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


export function bindNextSlice(){
    /**
     * 社群演变至下一时刻时触发的事件
     */
    $("#next").on("click", e => {
        if(!window.community){
            var commu = GET_COMMUNITY();
            window.scene.add(commu);
            commu.layout();
            //addId2Dropdown( commu );
            addMonkeyIds2Selecter(commu);
            return;
        }
        var COMMUNITY = GET_COMMUNITY();
        TICK_NEXT();
        let frame = genSlice(COMMUNITY);
        
        frame.tick = GET_TICK();
    
        COMMUNITY.addFrame(frame);
        COMMUNITY.forward();
        COMMUNITY.layout();
        addMonkeyIds2Selecter(COMMUNITY);
        //console.log("Tick 之后的Community：", COMMUNITY);
        let logStr = logFrame(frame);
        COMMUNITY.logInfo.push(logStr);
        console.log( logStr );
    
        let old = $("#tickRange").slider("getValue");
        $('#tickRange').slider({max:GET_TICK()})
        $("#tickRange").slider("setValue", [old[0], GET_TICK()]);
        
        $("#tickHigh").html( ( GET_TICKMAP().get(GET_TICK()) || GET_TICK() ) + " / " + ( GET_TICKMAP().get( GET_TICK() ) || GET_TICK() ));
        // 要进行刷新
        $("#tickRange").slider('refresh', { useCurrentValue: true });
        
        old = $("#tickRangeStruc").slider("getValue");
        $('#tickRangeStruc').slider({max:GET_TICK()})
        $("#tickRangeStruc").slider("setValue", [old[0], GET_TICK()]);
        $("#tickHighStruc").html(  ( GET_TICKMAP().get(GET_TICK()) || GET_TICK() ) + " / " + ( GET_TICKMAP().get( GET_TICK() ) || GET_TICK()));
        // 要进行刷新
        $("#tickRangeStruc").slider('refresh', { useCurrentValue: true });
    
        // 显示社群的历史变更信息，增加一个年份的信息
        showCommunityTickList();
        if($("#unit_info > li:nth-child(1)").attr("unitID") ){
            let unitID =  +$("#unit_info > li:nth-child(1)").attr("unitID");
            showUnitTickList(unitID );
        }
    })
     
}

export function bindShow(){
    /**
     * 点击SHOW时触发的事件
     */
    $('#showData').on('click', e => {
        let COMMUNITY = GET_COMMUNITY();
        
        console.log('SHOW COMMUNITY');
        if(!COMMUNITY){

        } else{
            // 如果社群已经创建好，则把window.scene中的社群移除
            window.scene.children.forEach(ee => {
                if(ee instanceof Community) {
                    window.scene.remove(ee);
                }
            })
        }

        $('#tickRange').slider({max:GET_TICK()})
        $("#tickRange").slider("setValue", [0, GET_TICK()]);
        $("#tickHigh").html(GET_TICK() + " / " + GET_TICK());
        // 要进行刷新
        $("#tickRange").slider('refresh', { useCurrentValue: true });

        $('#tickRangeStruc').slider({max:GET_TICK()})
        $("#tickRangeStruc").slider("setValue", [0, GET_TICK()]);
        $("#tickHighStruc").html( GET_TICKMAP().get( GET_TICK() ) || GET_TICK() + " / " +( GET_TICKMAP().get( GET_TICK() ) || GET_TICK() ));
        // 要进行刷新
        $("#tickRangeStruc").slider('refresh', { useCurrentValue: true });

        // 显示社群的历史变更信息，增加一个年份的信息
        // showCommunityTickList();
        if($("#unit_info > li:nth-child(1)").attr("unitID") ){
            let unitID =  +$("#unit_info > li:nth-child(1)").attr("unitID");
            showUnitTickList(unitID );
        }
        window.scene.add(COMMUNITY);
    })
}