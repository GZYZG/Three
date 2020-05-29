$('#tickRangeStruc').slider({
    formatter: function (value) {
        return  value;
    },
    tooltip_split: true,
    tooltip: "always",
    tooltip_position: "bottom",
})


var tree = [
    {
      text: "社会变动要素",
      selectable: false,
      selectedIcon: "",
      nodeKey: "strucKey",
      state: {
            checked: true,
      },
      nodes: [
        {
          text: "入群",
          nodeKey: "enterCommu",
          selectable: false,
          state: {
            checked: window.VIEW_KEYS["strucKey"]["enterCommu"]
          },
        }, {
          text: "退群",
          nodeKey: "outCommu",
          selectable: false,
          state: {
            checked: window.VIEW_KEYS["strucKey"]["outCommu"]
          },
        }, {
          text: "迁移",
          nodeKey: "migrate",
          selectable: false,
          state: {
            checked: window.VIEW_KEYS["strucKey"]["migrate"]
          },
        }, {
          text: "主雄变更",
          nodeKey: "mainMaleChange",
          selectable: false,
          state: {
            checked: window.VIEW_KEYS["strucKey"]["mainMaleChange"]
          },
        }, {
          text: "新增单元",
          nodeKey: "newUnit",
          selectable: false,
          state: {
            checked: window.VIEW_KEYS["strucKey"]["newUnit"]
          },
        }, {
          text: "死亡",
          nodeKey: "dead",
          selectable: false,
          state: {
            checked: window.VIEW_KEYS["strucKey"]["dead"]
          },
        }, {
          text: "其他分身",
          nodeKey: "involvedMirror",
          selectable: false,
          state: {
            checked: window.VIEW_KEYS["strucKey"]["involvedMirror"]
          }
        }
        
      ]
    }, {
      text: "亲缘关系",
      nodeKey:"kinship",
      selectable: false,
      state: {
            checked: window.VIEW_KEYS["kinship"]
      },
    },  {
      text: "未涉及个体",
      nodeKey: "uninvolved",
      selectable: false,
      state: {
            checked: window.VIEW_KEYS["uninvolved"],
      },
    },
  ];

  $('#customKeyCollapse').treeview({
    data: tree,         // data is not optional
    levels: 5,
    backColor: 'green',
    multiSelect: true,
    checkedIcon: "glyphicon glyphicon-check",
    //selectedIcon: "glyphicon glyphicon-check",
    showCheckbox: true,
  });

  $('#customKeyCollapse').on('nodeChecked',function(event, data){
    console.log(" data:", data);
    let tree = $('#customKeyCollapse');
    // 判断被check的node是否有子节点
    if(!data.nodes) {
       // 判断被被check的node是否有父节点
       if(data.parentId != undefined){
         window.VIEW_KEYS[tree.treeview("getNode", data.parentId).nodeKey][data.nodeKey] = true;
         // 如果某个结点的子节点都被check，则该结点也被check
         let siblings = tree.treeview("getSiblings", data.nodeId).map( e => e.state.checked ? 1: 0).reduce((a, b) =>  a+b);
         if( siblings == tree.treeview("getSiblings", data.nodeId).length ){
           tree.treeview("checkNode", [ data.parentId, {silent: true} ]);
         }
       } else {
         window.VIEW_KEYS[data.nodeKey] = true;
       }
     } else{
       data.nodes.forEach( e => {
         tree.treeview('checkNode', [ e.nodeId, { silent: true } ]);
         window.VIEW_KEYS[data.nodeKey][e.nodeKey] = true;
       })
     }
    
   console.log("显示要素发生变化!", window.VIEW_KEYS)
   let v = $("#tickRangeStruc").slider("getValue");
   
   window.community.showRangeCommunityChange( v[0], v[1] );
   

   //if(data.nodeKey = "kinship" ){
     let v1 = $("#tickRange").slider("getValue");
     window.community.showRangeKinship(v1[0], v1[1] );
     if(!window.VIEW_KEYS['kinship']){
       window.community.maskKinship();
     }
   //}
})

$('#customKeyCollapse').on('nodeUnchecked',function(event, data){
    console.log( " data:", data);
    let tree = $('#customKeyCollapse');
    if(!data.nodes) {
       if(data.parentId != undefined){
           window.VIEW_KEYS[tree.treeview("getNode", data.parentId).nodeKey][data.nodeKey] = false;
           tree.treeview("uncheckNode", [ data.parentId, {silent: true} ]);
       } else {
           window.VIEW_KEYS[data.nodeKey] = false;
       }
       
    } else {
     data.nodes.forEach( e => {
       tree.treeview('uncheckNode', [ e.nodeId, { silent: true } ]);
       window.VIEW_KEYS[data.nodeKey][e.nodeKey] = false;
     })
    }
    
   let v = $("#tickRangeStruc").slider("getValue");
   let v1 = $("#tickRange").slider("getValue");
   window.community.showRangeCommunityChange( v[0], v[1] );
   if(data.nodeKey == "kinship" || !window.VIEW_KEYS['kinship']){
     window.community.maskKinship();
     window.community.showRangeCommunityChange( v[0], v[1] );
   } else {
     window.community.showRangeCommunityChange( v[0], v[1] );
     window.community.showRangeKinship(v1[0], v1[1] );
   }
   
})



// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheets, sheetNames) {
    sheetNames = sheetNames || sheets.map((e, idx) => 'sheet'+idx);
      var workbook = {
          SheetNames: sheetNames,
          Sheets: {}
    };
    workbook.SheetNames.forEach( (e, idx) => {
      workbook.Sheets[e] = sheets[idx];
    })
      //workbook.Sheets[sheetName] = sheet;
      // 生成excel的配置项
      var wopts = {
          bookType: 'xlsx', // 要生成的文件类型
          bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
          type: 'binary'
      };
      var wbout = XLSX.write(workbook, wopts);
      var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
      // 字符串转ArrayBuffer
      function s2ab(s) {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
          return buf;
      }
      return blob;
  }

  /**
 * 打开下载对话框方法
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
 function openDownloadDialog(url, saveName){
	if(typeof url == 'object' && url instanceof Blob){
		url = URL.createObjectURL(url); // 创建blob地址
	}
	var aLink = document.createElement('a');
	aLink.href = url;
	aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
	var event;
	if(window.MouseEvent) event = new MouseEvent('click');
	else
	{
		event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	}
	aLink.dispatchEvent(event);
}

function getMonkeyData(){
    var community = window.community;
    var data = new Array([	'ID',	'genda',	'name',	'ageLevel',	'father',	'mother',	'unit',	'dead' , 'year']);
    for(let i = 0; i <= community.frames.length; i++){
       community.allunits.forEach( e => {
         if(e.tickMembers.get(i)){
           e.tickMembers.get(i).forEach(ee => {
             let monkey = community.findMonkeyByID(ee)[0];
             let row = [ee, monkey.genda, monkey.name, monkey.ageLevel, monkey.father ? monkey.father.ID : '', monkey.mother ? monkey.mother.ID : '', e.ID, '', i]
             data.push(row);
           });
         }
       })
       if(i > 0 ){
         community.frames[i-1].vanished.dead.forEach( e => {
           let m = e.monkey;
           let row = [m.ID, m.genda, m.name, m.ageLevel, m.father ? m.father.ID : '', m.mother ? m.mother.ID : '', m.unit.ID, 'T', i];
           data.push(row);
         })
       }
     
    }
    return data;
 }

 function getUnitData(){
    var data = new Array(['ID', 'type', 'Rank', 'mainMale','adultFemale','young','juvenile','size','year']);
    community = window.community;
    for(let i = 0; i <= community.frames.length; i++){
      community.allunits.forEach( e => {
        if(e.tickMembers.get(i)){
          let row = [e.ID, e.unitType, '', e.unitType=='OMU' && e.mainMale ? e.mainMale.ID : '', '', '', '', e.tickMembers.get(i).length, i ];
          data.push(row);
        }
      })
    }
    return data;
  }
  
  function exportCommunityData(){
    var monkeyData = getMonkeyData();
    var unitData = getUnitData();
    var monkeySheet = XLSX.utils.aoa_to_sheet(monkeyData);
    var unitSheet = XLSX.utils.aoa_to_sheet(unitData);
    openDownloadDialog(sheet2blob([monkeySheet, unitSheet], ['金丝猴数据', '单元数据']), '金丝猴社群数据.xlsx');
  }
  
  function exportFrameData(){
  
    var content = "";
    window.community.logInfo.forEach( e => {
      content += `${e}\n`;
    })
    // any kind of extension (.txt,.cpp,.cs,.bat)
    var filename = "时间切片数据.txt";
    
    var blob = new Blob([content], {
    type: "text/plain;charset=utf-8"
    });
   
    openDownloadDialog(blob, filename);
  }