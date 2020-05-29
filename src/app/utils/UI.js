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