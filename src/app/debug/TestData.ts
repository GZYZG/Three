// 用于测试的数据
// 以一年内的社群的数据为一份，每一份内为一个表，每一行为一直猴子的数据， 每一列为一个猴子的所有属性值
// 除了以上这个表，还有一个表，用于记录所有单元的信息
// 每一只猴子的属性有：ID、name、genda、birthDate、father、mother
// 其中father、mother 均用父、母的ID表示
// 示例：某一个年份的猴子信息
// ID       name        genda       birthDate       father      mother      unit
//  1        zq          FEMALE      1998/7/23         1           4         1
//  2        gzy         MALE        1997/2/5          5           6         2
//  3        zrq         MALE        1974/1/1         -1           -1        2
//  4        yhj         FEMALE      1975/1/1         -1           -1        2
//  5        gsz         MALE        1961/12/30       -1           -1        1
//  6        sjm         FEMALE      1974/1/1         -1           -1        1
import { Unit, OMU, AMU, FIU } from "../commons/Unit";
import { GENDA, UNIT_TYPE, randomInt, MONKEY_GEN_ID, AGE_LEVEL, GET_TICK, TICK_NEXT, GET_TICK_MODE, TICK_MODE, logFrame, logBase } from "../commons/basis";
import { Kinship } from "../commons/Kinship";
import { Monkey, Male, Female } from "../commons/Monkey";
import { unitsLayout, OMULayout, AMULayout, FIULayout } from "../commons/PositionCalc";
import * as THREE from "three";
import { Frame} from "../commons/Dynamics";
import { TextGeometry } from "../threelibs/three";

import FruchtermanLayout from  "@antv/g6/lib/layout/fruchterman";
import DagreLayout from "@antv/g6/lib/layout/dagre";
import  ForceLayout from "@antv/g6/lib/layout/force";
import { addId2Dropdown, addGroupIds2Dropdown, addTick2Dropdown } from "../commons/Dom";
import { KidKinshipNodeLink } from "../commons/LineFactory";

var FileSaver = require('file-saver');


// 单元的信息示例如下：
// ID       name        createdDate         vanishDate
// 1         qhc          1900/1/1              -1
// 2         sx           1900/1/1              -1

var monkeysData = {
    2016:[
        {"ID":1, "name":"", "genda":GENDA.MALE, "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":2, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":3, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":4, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":5, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":6, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":7, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":8, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":9, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":10, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":11, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":12, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":13, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":14, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":15, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":16, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":17, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
    ],
    2017:[
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
    ],
    2018:[
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
    ],
    2019:[
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
    ],
    2020:[
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
        {"ID":1, "name":"", "genda":"", "birthDate":"", "father":"", "mother":"", "unit":""},
    ]

}

var unitsData = {

}


exports.monkeysData = monkeysData;
exports.unitsData = unitsData;

export class Community extends THREE.Object3D{
    public allunits : Array<Unit>;
    public allkinships : Array<Kinship>;
    //public allmonkeys : Array<Monkey>;
    public frames: Array<Frame>;
    public tick: number;    // 表示当前的时刻
    public basekids: Array<Monkey>;

    public logInfo: Array<string>;

    constructor(baseUnitNum: number = 12){
        super();

        this.allunits = new Array<Unit>();
        this.allkinships = new Array<Kinship>();
        // 获得社群的起点
        let base = baseCommunity(baseUnitNum);
        this.allunits = base.baseUnits;
        this.allkinships = base.baseKinships;
        this.basekids = new Array<Monkey>();
        base.baseKinships.forEach( e => {
            e.kids.forEach( ee => {
                this.basekids.push( ee );
            })
        })
        this.allunits.forEach( unit =>{
            this.add(unit);
        });
        this.allkinships.forEach( k => {
            this.add( k);
        });

        this.frames = new Array<Frame>();
        this.tick = GET_TICK();
    
        this.logInfo = new Array<string>();
        this.logInfo.push( logBase( this));
    }

    public tickNext(){
        this.tick++;
    }

    public tickPrev(){
        if( this.tick != 0){
            this.tick--;
        }
    }

    public get allmonkeys(){
        let tmp = new Array<Monkey>();
        this.allunits.forEach( u => {
            u.allMembers.forEach( m => {
                tmp.push(m);
            })
        })

        return tmp;
    }



    public addFrame(frame: Frame){
        this.frames.push(frame);
    }

    public addUnit(unit : Unit){
        if(this.allunits.includes(unit))    return;
        this.add(unit);
        this.allunits.push(unit);
    }
    
    public addKinship(kinship : Kinship){
        if( this.allkinships.includes( kinship))    return;
        this.add(kinship);
        this.allkinships.push(kinship);
    }

    public aliveMonkeys(){
        let tmp = this.allmonkeys.filter( m => m.isAlive );
        let s = new Set();
        tmp.forEach( t => s.add(t.ID));
        let ret = new Array<number>();
        s.forEach(e => ret.push(e));
        return ret;
    }

    public commuAliveMonkeys() : Monkey[]{
        // 返回社群中还活着的monkey
        let tmp = this.allmonkeys.filter( m => !m.isMirror && m.isAlive && m.inCommu);
        // let s = new Set<number>();
        // tmp.forEach( t => s.add(t.ID));
        // let ret = new Array<number>();
        // s.forEach(e => ret.push(e));
        return tmp;
    }

    // public adultCommuAliveMonkeys(){
    //     let tmp = this.commuAliveMonkeys();
    //     let ret = new Array();


    // }

    public vanishedMonkeys(){
        return this.allmonkeys.filter( m => !m.inCommu  );
    }

    public outCommuMonkeys(){
        return this.vanishedMonkeys().filter( m => m.isAlive );
    }

    public deadMonkeys(){
        return this.allmonkeys.filter( m => !m.isAlive );
    }

    public findMonkeyByID(id : number){
        // 找到社群中所有符合id的monkey，包括分身
        return this.allmonkeys.filter( m => m.ID == id )
    }

    public findRealMonkeyByID(id : number){
        // 找到社群中符合id的monkey的真身，如果已经vanished则返回null
        let tmp = this.findMonkeyByID(id).filter(m => !m.isMirror);
        if( tmp.length == 0)    return null;
        return tmp[0];

    }

    public findKinshipByFather( father : Male){
        let tmp = this.allkinships.filter( m => m.father.ID == father.ID);
        if( tmp.length == 0)    return null;
        return tmp;
    }

    public findKinshipByMother( mother : Female){
        let tmp = this.allkinships.filter( m => m.mother.ID == mother.ID);
        if( tmp.length == 0)    return null;
        return tmp;
    }

    public findKinshipByParents( father : Male, mother : Female){
        let tmp = this.allkinships.filter( m => m.father.ID == father.ID && m.mother.ID == mother.ID);
        if( tmp.length == 0)    return null;
        return tmp[0];
    }

    public layout() {
        // 先对单元进行总体布局
        unitsLayout(this.allunits);
        // 再对每个单元内的层进行布局
        this.allunits.forEach( u =>{
            switch( u.unitType ){
                case UNIT_TYPE.OMU:
                    OMULayout( u);
                    break;
                case UNIT_TYPE.AMU:
                    AMULayout(u);
                    break;
                case UNIT_TYPE.FIU:
                    FIULayout(u);
                    break;
            }
        });
        this.G6Layout("dagre");

        // 再对亲缘关系进行布局
        this.allkinships.forEach(k => {
            k.layout();
        })

        
    }

    // 使用G6的图布局算法计算单元坐标
    public G6Layout(type:string = "dagre"){
        let scene = document.getElementsByClassName('center')[0];
        //let w = scene.offsetWidth, h = scene.offsetHeight;
        let w = window.innerWidth, h = window.innerHeight;
        var layoutCfg = {
            force:{
              type: 'force', // 设置布局算法为 force， 可选 random mds force fruchterman circular radial dagre concentric grid 
              preventOverlap: true, // 设置防止重叠
              center: [ window.innerWidth/2, window.innerHeight/2 ],     // 可选，默认为图的中心，采用屏幕坐标系，即左上角为原点
              linkDistance: 150,         // 可选，边长
              nodeStrength: -60,         // 可选
              nodeSize: 30,
              nodeSpacing: 10,
              edgeStrength: .1,        // 可选
              collideStrength: 1,     // 可选
              alpha: 0.3,               // 可选
              alphaDecay: 0.028,        // 可选
              alphaMin: 0.01,           // 可选
              forceSimulation: null,    // 可选
            },
            darge:{
              type: 'dagre', // 设置布局算法为 force， 可选 random mds force fruchterman circular radial dagre concentric grid 
              preventOverlap: true, // 设置防止重叠
              linkDistance: 100,         // 可选，边长
              nodeSize: 30,
              rankdir: 'LR',
              nodesep: 20,
              ranksep: 30,
              controlPoints: false,
            },
            fruchterman:{
              type: 'fruchterman',
              center: [ 0, 0 ],     // 可选，默认为图的中心
              gravity: 50,              // 可选
              speed: 2,                 // 可选
              clustering: false,         // 可选
              //clusterGravity: 50,       // 可选
              maxIteration: 2000,       // 可选，迭代次数
              workerEnabled: true       // 可选，开启 web-worker  }
            },
            radial:{
              type: 'radial',
              center: [ window.innerWidth/2, window.innerHeight/2 ],     // 可选，默认为图的中心
              linkDistance: 150,         // 可选，边长
              maxIteration: 1000,       // 可选
              //focusNode: 'node11',      // 可选
              unitRadius: 60,          // 可选
              preventOverlap: true,     // 可选，必须配合 nodeSize
              nodeSize: 160,             // 可选
              nodeSpacing: 60,
              strictRadial: true,       // 可选
              sortBy: 'degree',
              sortStrength: 0,
              workerEnabled: true       // 可选，开启 web-worker
            },
            concentric:{
              type: 'concentric',
              center:  [ window.innerWidth/3, window.innerHeight/3 ],     // 可选，
              linkDistance: 150,         // 可选，边长
              preventOverlap: true,     // 可选，必须配合 nodeSize
              nodeSize: 30,             // 可选
              sweep: 10,                // 可选
              equidistant: false,       // 可选
              startAngle: 0,            // 可选
              clockwise: false,         // 可选
              maxLevelDiff: 100,         // 可选
              //sortBy: 'degree',          // 可选
              workerEnabled: true       // 可选，开启 web-worker
            },
            dendrogram:{
                type: 'dendrogram',
                direction: 'LR', // H / V / LR / RL / TB / BT
                radial: true,
                nodeSep: 30,
                rankSep: 100,
           },
          }

        switch(type){
            case "dagre":
                this.dagreLayout();break;
            case "fruchterman":
                this.fruchtermanLayout(); break;
            case "force":
                this.forceLayout(); break;
            default:
                this.dagreLayout(); break;
        }
        
    }

    public fruchtermanLayout(){
        let scene = document.getElementsByClassName('center')[0];
        let w = scene.offsetWidth, h = scene.offsetHeight;
        let myData = this.getJsonData();
        let pos = new Array();
        let fruc = new FruchtermanLayout();
        fruc.width = w;
        fruc.height = h;
        fruc.gravity = 30;
        fruc.maxIteration = 2000;
        fruc.nodes = myData.nodes;
        fruc.edges = myData.edges;
        fruc.execute();
        console.log("Fruc: ", fruc);
        fruc.nodes.forEach( e =>{
            pos.push({id:e.id, x:e.x, y:e.y})})
        console.log("pos: ", pos);
        for(let i = 0; i < pos.length; i++){
            this.allunits[i].position.set( pos[i].x, 0,  pos[i].y);
            console.log(this.allunits[i].name," : ", this.allunits[i].position);
        }
    }

    public dagreLayout(){
        let scene = document.getElementsByClassName('center')[0];
        let w = scene.offsetWidth, h = scene.offsetHeight;
        let myData = this.getJsonData();
        let pos = new Array();
        let dagre = new DagreLayout();
        dagre.nodeSize = 10;
        dagre.nodesep = 15;
        dagre.ranksep = 15;
        dagre.nodes = myData.nodes;
        dagre.edges = myData.edges;
        
        dagre.execute();
        //console.log("DagreLayout: ", dagre);
        dagre.nodes.forEach( e =>{
            pos.push({id:e.id, x:e.x, y:e.y})})
        //console.log("pos: ", pos);
        for(let i = 0; i < pos.length; i++){
            this.allunits[i].position.set( pos[i].x - dagre.width/2 , 0,  pos[i].y - dagre.height/2);
            //console.log(this.allunits[i].name," : ", this.allunits[i].position);
        }
    }

    public forceLayout(){
        let myData = this.getJsonData();
        let pos = new Array();
        let force = new ForceLayout();
        force.preventOverlap = true;
        force.nodeSize = 50;
        // force.nodeSpacing = function(){return 1500};
        // force.nodeStrength = -60;
        force.collideStrength = 1;
        force.edgeStrength = .1;
        force.alpha = 1;
        force.alphaDecay = .028;
        force.alphaMin = .01;
        force.linkDistance = 200;
        force.nodes = myData.nodes;
        force.edges = myData.edges;
        force.execute();
        console.log("ForceLayout: ", force);
        force.nodes.forEach( e =>{
            pos.push({id:e.id, x:e.x, y:e.y})})
        console.log("pos: ", pos);
        for(let i = 0; i < pos.length; i++){
            this.allunits[i].position.set(5* pos[i].x, 0, 5* pos[i].y);
            console.log(this.allunits[i].name," : ", this.allunits[i].position);
        }
    }

    public getJsonData(){
        let _nodes = new Array();
        let _edges = new Array();

        this.allunits.forEach( e => {
            _nodes.push( {id: e.name, label: e.name});
        })

        this.allkinships.forEach( e => {
            if( e.father.unit != e.mother.unit){
                _edges.push({
                    source: e.father.unit.name,
                    target: e.mother.unit.name,
                })
            }
        })

        return {
            nodes: _nodes,
            edges: _edges,
        };

    }

    public forward(step:number=1){ 
        console.log("进入forward，community.tick: ", this.tick);
        if(step <= 0)   return;
        // 向前步进一个时刻，在当前的基础上执行 this.frames[this.tick] 即可到达下一时刻，再更新this.tick
        let tickMode = GET_TICK_MODE();
        switch(tickMode){
            case TICK_MODE.ACCUMULATE:
                //显示累积的亲缘关系
                break;
            case TICK_MODE.ISOLATE:
                //显示当前年份的亲缘关系
                break;
            default:
                //显示累积的亲缘关系
                break;
        }

        let frame = this.frames[this.tick];
        if(!frame)   return;
        frame.vanished.dead.forEach( e  =>{
            e.monkey.die();
        })
        frame.vanished.outCommu.forEach( e => {
            e.monkey.leaveUnit();
        })

        frame.newUnits.forEach( e => {
            if( this.allunits.filter( ee => ee.ID == e.ID).length == 0){
                this.addUnit( e);
            } else {
                e.visible = true;
            }
            
        })

        frame.enterCommu.forEach( e => {
            e.monkey.enterUnit( e.unit);
            let tmp = e.unit.allMembers.filter( ee => ee.ID == e.monkey.ID)[0];
            if(!tmp.visible)
                tmp.visible = true;
        })

        frame.challengeMainMale.forEach( e => {
            //e.winner.enterUnit( e.unit);
            // 在设置主雄之前，主雄应该已经是单元的成员
            e.unit.mainMale = e.unit.allMembers.filter( ee => ee.ID == e.winner.ID)[0];
        })

        frame.migrates.forEach( e => {
            e.monkey.leaveUnit();
            e.monkey.enterUnit( e.targetUnit);
            // 因为可能存在回退，需要设置分身的可见性
            let tmp = e.targetUnit.allMembers.filter( ee => ee.ID == e.monkey.ID)[0];
            if(!tmp.visible)
                tmp.visible = true;
        })

        frame.newKinships.forEach( e => {
            e.parents.dad.addKid(e.kid);
            e.parents.mom.addKid(e.kid);
            // 注意！！！在newKinships中保留的是kid的真身，添加到kinship中前需要先复制
            let kid = e.kid.deepCopy();
            let t = this.findKinshipByParents(e.parents.dad, e.parents.mom);
            if( t == null){
                let ks = new Kinship(e.parents.dad, e.parents.mom, new Array<Monkey>(kid));
                this.addKinship(ks);
            }else{
                t.addKid(kid);
            }
            // 在回退的时候可能已经被设置为不可见了
            // 注意！！！在第一次执行frame时，在kinship的layout之前，kidkinshiplink是没有被创建的！！！
            let ks = this.findKinshipByParents( e.parents.dad, e.parents.mom );
            ks.changeKidVisible( e.kid.ID, true);
        })

        // this.tick 增加1
        this.tickNext();
        this.forward( step-1);
    }

    public back(step:number=1){
        console.log("进入back!", "community.tick: ", this.tick);
        if( this.tick == 0)     return;
        if(step <= 0)   return;
        // 显示回退的亲缘关系
        // 进行回退或者前进之前，不仅与 选择的TICK_MODE 有关，还和当前的 TICK_MODE 有关，
        // 1) 如果当前的mode和之前的mode一致，则不需要重新之前的frame
        // 2) 如果不一致，则需要执行一些操作，
        // 也可以不管mode，先进行回退后，再统一设置亲缘关系的可见性
        // 此时，只需要将需要取消的frame的成员变动取消即可
        let tickMode = GET_TICK_MODE();
        switch(tickMode){
            case TICK_MODE.ACCUMULATE:
                //显示累积的亲缘关系
                break;
            case TICK_MODE.ISOLATE:
                //显示当前年份的亲缘关系
                break;
            default:
                //显示累积的亲缘关系
                break;
        }
        
        // 当 this.tick == 0时，this.frames 是空的
        // 所以当执行回退一个tick时，需要把 this.frames[this.tick-1]的frame回退，所以执行回退后要进行this.tick减1
        
        // 逆向执行 this.frames[this.tick] 的操作
        let frame = this.frames[this.tick-1];
        if(!frame)  return;
        // 处理 newkinships
        // 处理 newKinships的方法：
        // 1) 只设置孩子的可见性，这样forward时需要检测该孩子是否已经添加到了kinship中；
        // 2) 将孩子从kinship中移除，同时还要移除的由monkey.mirror中的对象，以及kidkinshiplink，进行forward时不需要检查，直接正常添加即可；
        frame.newKinships.forEach( e => {
            // 先采用方法1
            let ks = this.findKinshipByParents(e.parents.dad, e.parents.mom);
            ks.maskKid( e.kid.ID);
        })

        // 迁移的需要进行回迁
        // 回迁后，monkey的targetUnit中的分身可以设置为不可见或者直接移除
        frame.migrates.forEach( e => {
            let m = e.monkey;
            let tmp = m.migrateTable.filter(ee => ee.tick < this.tick && ee.unit.ID == e.targetUnit.ID );
            // 找到monkey在targetUnit的分身
            let mirror = Array.from( m.mirror).filter(ee => ee.unit.ID == e.targetUnit.ID)[0];
            if( tmp.length != 0 ){
                // 如果在 this.tick之前monkey就进入过该targetUnit则不需要设置为不可见
                // 则只需要执行leaveUnit、enterUnit即可
                // 注意！！！需要找到再targetUnit里那个分身，令其离开targetUnit，但进入originUnit时则不需要，任意一个分身进入都可以
                mirror.leaveUnit();
            } else {
                // 如果this.tick 是monkey第一次进入targetUnit 单元，则将该分身设置为不可见
                // 应该找到monkey在targetUnit中的那个分身，并令其离开单元，并设置为不可见
                mirror.leaveUnit();
                mirror.visible = false;
            }
            // 再重新进入originUnit，但不需要增加迁记录
            m.enterUnit( e.originUnit, -1, false );
            
        })

        // 挑战主雄的也需要交换
        // 迁移的过程中不会发生主雄交换的情况
        frame.challengeMainMale.forEach( e => {
            if(!e.loser){
                e.unit.mainMale = null;
            } else {
                e.unit.mainMale = e.unit.allMembers.filter( ee => ee.ID == e.loser.ID)[0];
            }
            
        })

        // 进入社群的也需要重新进行处理
        // 如果monkey 是重返社群，且进入的单元为同一个单元，则不需要改变其可见性；如果之前未进入过该单元，则设置为不可见
        frame.enterCommu.forEach( e => {
            let m = e.monkey;
            let tmp = m.migrateTable.filter(ee => ee.tick < this.tick && ee.unit.ID == e.unit.ID );
            let mirror = Array.from( m.mirror).filter(ee => ee.unit.ID == e.unit.ID)[0];
            if( tmp.length == 0){
                mirror.leaveUnit();
                mirror.visible = false;
            } else {
                mirror.leaveUnit();
            }
        })

        // 新建的单元需要处理
        // 新增的单元设置为不可见即可
        frame.newUnits.forEach( e => {
            e.visible  = false;
        })

        // 离开社群的需要重回社群
        // 进入该分身所属的单元即可
        // 注意！！！monkey死亡或者离群时有可能是主雄，所以frame中需要记录！
        frame.vanished.outCommu.forEach( e => {
            e.monkey.enterUnit( e.monkey.unit);
            if(e.isMainMale && e.monkey.unit instanceof OMU)
                e.monkey.unit.mainMale = e.monkey.unit.allMembers.filter( ee => ee.ID == e.monkey.ID)[0];
        })

        // 死亡的也需要复活
        frame.vanished.dead.forEach( e => {
            e.monkey.revive();
            e.monkey.enterUnit( e.monkey.unit);
            if(e.isMainMale && e.monkey.unit instanceof OMU)
                e.monkey.unit.mainMale = e.monkey.unit.allMembers.filter( ee => ee.ID == e.monkey.ID)[0];
        })

        this.tickPrev();

        this.back(step-1);

    }

    public maskKinship(){
        this.basekids.forEach( e => {
            let ks = this.findKinshipByParents( e.father, e.mother );
            ks.changeKidVisible( e.ID, false);
            //console.log("\t在起始时刻的kid: ", e, " 被设置为", true? "可": "不可", "见！");
        })

        for(let i = 0; i < GET_TICK(); i++){
            let f = this.frames[i];
            let newKin = f.newKinships;
            newKin.forEach( e => {
                let ks = this.findKinshipByParents( e.parents.dad, e.parents.mom );
                ks.changeKidVisible( e.kid.ID, false);
                let tmp = ks.kids.filter( ee => ee.ID == e.kid.ID);
                //console.log("\t在 Tick-"+ tick+ " 在frames["+ i+ "] 中，kid: ", tmp[0], " 被设置为",  visible? "可": "不可", "见！");   
            })
        }
    }

    public showRangeKinship(start: number, end: number){
        this.maskKinship();
        if(start==0){
            this.basekids.forEach( e => {
                let ks = this.findKinshipByParents( e.father, e.mother );
                ks.changeKidVisible( e.ID, true);
                //console.log("\t在起始时刻的kid: ", e, " 被设置为", true? "可": "不可", "见！");
            })
            start += 1;
        }
        for(let i = start; i <= end && i<= GET_TICK(); i++){
            let f = this.frames[i-1];
            let newKin = f.newKinships;
            newKin.forEach( e => {
                let ks = this.findKinshipByParents( e.parents.dad, e.parents.mom );
                ks.changeKidVisible( e.kid.ID, true);
                let tmp = ks.kids.filter( ee => ee.ID == e.kid.ID);
                //console.log("\t在 Tick-"+ tick+ " 在frames["+ i+ "] 中，kid: ", tmp[0], " 被设置为",  visible? "可": "不可", "见！");   
            })
        }
        
    }

    public changeTickMode(tarMode: TICK_MODE, t?:number) {
        //根据时间模式改变从起始时刻到this.tick 的亲缘关系的可见性
        let tick: number;
        if(!t){
            tick = this.tick;   // 获取当前社群的tick
        } else{
            tick = t;
        }
        
        console.log("TICK-", tick, "  TICK_MODE: ", tarMode);
        let visible : boolean;
        let baseVis : boolean;
        // 访问各个frame中的newkinships，找到其中的孩子，设置其在kinship中的可见性，
        // 而不是设置在单元中的可见性，因为时间模式的切换不影响tick之前的成员变动的可见性
        if( tarMode == TICK_MODE.ACCUMULATE) {
            visible = true;
            // 从isolate => accumulate，则需要把frames[0]~frames[tick-2]的亲缘关系都设置为可见
            // 需要特别处理的是其实时刻的亲缘关系， 因为其实时刻不是通过frame生成的，但是记录了起始时刻的孩子
            // 再执行frame中的亲缘的可见性
            
        } else {
            visible = false;
            // 从accumulate => isolate。则需要把非frames[tick-1]的亲缘关系都设置为不可见 0~tick-2
            // 类似if 中的情况，需要单独处理起始时刻的kid
        }

        if( tick == 0 && tarMode == TICK_MODE.ISOLATE){
            baseVis = true;
        } else{
            baseVis = visible;
        }

        this.basekids.forEach( e => {
            let ks = this.findKinshipByParents( e.father, e.mother );
            ks.changeKidVisible( e.ID, baseVis);
            console.log("\t在起始时刻的kid: ", e, " 被设置为", baseVis? "可": "不可", "见！");
        })
        for(let i = 0; i < tick-1; i++){
            let f = this.frames[i];
            let newKin = f.newKinships;
            newKin.forEach( e => {
                let ks = this.findKinshipByParents( e.parents.dad, e.parents.mom );
                ks.changeKidVisible( e.kid.ID, visible);
                let tmp = ks.kids.filter( ee => ee.ID == e.kid.ID);
                console.log("\t在 Tick-"+ tick+ " 在frames["+ i+ "] 中，kid: ", tmp[0], " 被设置为",  visible? "可": "不可", "见！");   
            })
        }

        // 要将当前时刻的kinship设置为可见
        let f = this.frames[tick-1];
        if(!f)  return;
        let newKin = f.newKinships;
        newKin.forEach( e => {
            let ks = this.findKinshipByParents( e.parents.dad, e.parents.mom );
            ks.changeKidVisible( e.kid.ID, true);
            let tmp = ks.kids.filter( ee => ee.ID == e.kid.ID);
            console.log("\t在 Tick-"+ tick+ " 在frames["+ i+ "] 中，kid: ", tmp[0], " 被设置为可见！");   
        })
    }

    public traceMonkey(id: number){
        // 追溯一个monkey的足迹，包括其性别、ID、名字、进入社群的时间、迁移的时间和目标单元、在那个时间与那个配偶产生了那个孩子、死亡时间
        
        let tmp = this.findMonkeyByID(id);
        if(tmp.length==0 ) {
            console.error("找不到ID为：" + id + " 的猴子！\n");
            return;
        }
        
        let m = tmp[0];
        let mt = m.migrateTable;
        let life = {
            ID: id,                 // ID
            genda: m.genda,         // 性别
            name: m.name,           // 姓名
            enterCommuTick: -1,     // 进入社群的时间
            deadTick: -1,           // 死亡时间
            belongTo: new Array(),  // 归属，记录各个时刻猴子属于哪个单元
            migrate: new Array<{tick: number, origin: number, target: number}>(),       // 记录monkey的迁移信息
            
        };
        

    }

}

function genParents(units : Array<Unit>){
    let father : Monkey = null;
    let mother : Monkey = null;
    let dadUnit : Unit;
    let momUnit : Unit;
    while( !father){
        let nth = randomInt(0, units.length-1);
        dadUnit = units[nth];
        if( dadUnit instanceof OMU && dadUnit.mainMale){
            father = dadUnit.mainMale;
        }else if( dadUnit.unitType == UNIT_TYPE.AMU){
            let num = dadUnit.currentMembers.length;
            father = dadUnit.currentMembers[ randomInt(0, num-1) ];
        }else {
            let males = dadUnit.currentMembers.filter( e => e.genda == GENDA.MALE && !e.isMirror);
            if( males.length == 0)  continue;
            father = males[ randomInt(0, males.length-1) ];
        }
    }
    if( dadUnit.unitType == UNIT_TYPE.OMU && Math.random() < .6){
        // 从父亲所在的单元挑选母亲，要注意当前时刻母亲应该在该单元内
        let females = dadUnit.adultLayer.filter( e => e.genda == GENDA.FEMALE && !e.isMirror);
        while(females.length != 0 && !mother){
            let nth = randomInt(0, females.length-1);
            mother = females[nth];
        }
    }

    while( !mother){
        let nth = randomInt(0, units.length-1);
        momUnit = units[nth];
        if( momUnit.unitType == UNIT_TYPE.OMU){
            // 注意，在家庭单元中也有可能有成年雄性，而且要从当前时刻在该单元的雌性中挑选
            let females = momUnit.adultLayer.filter(e => e.genda == GENDA.FEMALE && !e.isMirror);
            mother = females[ randomInt(1, females.length-1 ) ];
        }else if( momUnit.unitType == UNIT_TYPE.AMU){
        }else {
            let females = momUnit.currentMembers.filter( e => e.genda == GENDA.FEMALE && !e.isMirror);
            if( females.length == 0)  continue;
            mother = females[randomInt(0, females.length) ];
        }
    }

    return {
        dad: father,
        mom: mother,
    }
}

function genMonkey(name?:string, unit?: Unit, ageLevel?: AGE_LEVEL){
    let monkey;
    if(!ageLevel){
        let rate = Math.random();
        if(rate < .33)  ageLevel = AGE_LEVEL.JUVENILE;
        else if(rate < .67) ageLevel = AGE_LEVEL.YOUNG;
        else   ageLevel = AGE_LEVEL.ADULT;
    } 

    if(Math.random() < .5){
        monkey = new Male(MONKEY_GEN_ID(),  name ? name : "unknown-"+ageLevel+"-Tick-"+GET_TICK(), unit? unit:null);
    } else {
        monkey = new Female(MONKEY_GEN_ID(), name ? name : "unknown-"+ageLevel+"-Tick-"+GET_TICK(), unit? unit:null);
    }
    
    monkey.ageLevel = ageLevel;

    return monkey;

}

function baseCommunity(unitNum : number){
    var units = new Array<Unit>();
    var monkeys = new Array<Monkey>();
    var unit:Unit;
    // 先创建一定数量的单元，但是先不设置坐标
    for(let i = 0; i < unitNum; i++){
        let t = Math.random();
        if( t < 0.8){
            unit = new OMU(10);
        }else if( t < 0.93 ){
            unit = new AMU(8);
        }else{
            unit = new FIU(8);
        }
        unit.addMonkeys();
        units.push(unit);
        unit.allMembers.forEach( m =>{
            monkeys.push(m);
        });
    }

    // 随机挑选父母，生成孩子
    let kinnum = randomInt(2, 2);
    let allkids = new Set<Monkey>();
    var allKinships = new Array<Kinship>();
    for(let i = 0; i < kinnum; i++){
        // 挑选一对成年异性猴子
        let parents = genParents(units);
        let father  = parents.dad;
        let mother  = parents.mom;
 
        let kidnum = randomInt(1, 1);
        let kids = new Array<Monkey>();
        while( kids.length < kidnum){
            let nth = randomInt(0, units.length-1 );
            let picked = units[nth];
            let kid : Monkey;
            if( picked.unitType == UNIT_TYPE.OMU){
                kid = picked.juvenileLayer[ randomInt(0, picked.juvenileLayer.length-1 )];
            }else{
                let num = picked.currentMembers.length;
                kid = picked.currentMembers[ randomInt(0, num-1) ];
            }
            if( allkids.has(kid) ) continue;
            allkids.add( kid);
            father.addKid(kid);
            mother.addKid(kid);
            // 所有的孩子都用分身表示
            //console.log("before deepcopy: ",kid.isMirror, kid);
            kid = kid.deepCopy();
            //console.log("after deepcopy: ",kid.isMirror, kid);
            kids.push( kid);
        }

        // 如果father、mother已经有孩子了，直接将孩子添加到已有的kinship里
        let t = allKinships.filter(k => k.father.ID == father.ID && k.mother.ID == mother.ID)
        if( t.length == 0){
            let ks = new Kinship(father, mother, kids);
            allKinships.push(ks);
        }else{
            let ks = t[0];
            kids.forEach( k =>{
                ks.addKid(k);
            });
        }
        
    }

    addTick2Dropdown();
    $('#tickDropdown button').get()[0].textContent =  ""+GET_TICK();
    return {
        baseUnits : units,
        baseMonkeys : monkeys,
        baseKinships : allKinships,
    }
    

}


export function genFrame(commu : Community){
    let vanished;
    let newUnits = new Array<Unit>(); 
    let enterCommu = new Array();
    let challengeMainMale = new Array();
    let migrates = new Array();
    let newKinships = new Array();
    // 从社群中消失的猴子的数量
    let vainshNum  = randomInt(0, 2);
    let dead = new Array();
    let outCommu = new Array();
    // 注意！！！monkey死亡或者离群时有可能是主雄，所以frame中需要记录！
    for(let i = 0; i < vainshNum; i++){
        let monkey;
        let temp = commu.commuAliveMonkeys();//allmonkeys.filter( m => m.inCommu && m.isAlive);
        monkey = temp[randomInt(0, temp.length-1) ];
        if(Math.random() < .2){
            // monkey 死亡
            //console.log("死亡的Monkey：", monkey, "在", monkey.realunit.name , " 死亡！");
            //monkey.die();
            dead.push({monkey: monkey, isMainMale: monkey.isMainMale});
        } else{
            // monkey 离开单元并且不进入任一单元，则表示离开社群
            //console.log("离群的Monkey：", monkey, "从", monkey.realunit.name , " 离群！");
            //monkey.leaveUnit();
            outCommu.push({monkey: monkey, isMainMale: monkey.isMainMale });
        }
        
    }
    // 通过frame来完成
    vanished = {
        dead: dead,
        outCommu: outCommu,
    }

    

    // 进入社群的monkey
    let tmp = commu.outCommuMonkeys();
    // 以前消失的猴子重回社群
    let reenterNum = randomInt(0, tmp.length);
    let enterMonkeys = new Set<Monkey>();
    for(let i = 0; i < reenterNum; i++){
        enterMonkeys.add( tmp[i]);
    }
    // 未知的猴子进入社群
    for(let i = randomInt(0, 2); i > 0; i--){
        let monkey  = genMonkey("unknown"+i);
        if(Math.random() < .1){
            // 未知的猴子的父母在社群中
            let parents = genParents(commu.allunits);
            // parents.dad.addKid(monkey);
            // parents.mom.addKid(monkey);
            // //console.log("进入社群的Monkey", monkey, "找到父母：", parents);
            // let kid = monkey.deepCopy();
            
            // let t = commu.findKinshipByParents(parents.dad, parents.mom);
            // if( t == null){
            //     let ks = new Kinship(parents.dad, parents.mom, new Array<Monkey>(kid));
            //     commu.allkinships.push(ks);
            // }else{
            //     t.addKid(kid);
            // }

            // 通过frame来完成
            newKinships.push({kid: monkey, parents: parents});
        } 
        enterMonkeys.add(monkey);
    }
    // 为进入社群的猴子分配单元
    enterMonkeys.forEach(m =>{
        if(Math.random() < .4){
            let fiu = new FIU(8); 
            // m.enterUnit(fiu);
            // commu.addUnit(fiu);

            // 通过frame来完成
            enterCommu.push({monkey: m, unit: fiu} );
            newUnits.push(fiu);
            //console.log("进入社群的Monkey：", m, " 建立新FIU并进入", fiu.name);
        } else{
            let picked = commu.allunits[ randomInt(0, commu.allunits.length-1) ];
            // 通过frame来完成
            enterCommu.push({monkey: m, unit: picked});

            //m.enterUnit( picked );
            //console.log("进入社群的Monkey：", m, " 进入单元", picked.name);
            if(picked instanceof OMU && m.ageLevel == AGE_LEVEL.ADULT && m.genda == GENDA.MALE  && Math.random() < .8){
                // m 挑战主雄成功
                // 通过frame来完成
                challengeMainMale.push({unit: picked, winner: m, loser: picked.mainMale });
                console.log("挑战成功！"," unit:", picked.name, "  winner:", m)
                //picked.mainMale = m;
            } else{
                console.log("挑战失败！"," unitType:", picked.unitType, " ageLevel:", m.ageLevel, " genda:", m.genda)
            }
        }
    })
    
    // 成年雌、雄性的迁移
    let migrateMaleNum = randomInt(0, 2);
    let migrateFemaleNum = randomInt(0, 2);
    let migrated = new Array<Monkey>();
    for(let i = 0; i < migrateMaleNum; i++){
        let temp = commu.commuAliveMonkeys().filter(e => e.ageLevel == AGE_LEVEL.ADULT && e.genda == GENDA.MALE && !e.isMainMale && !migrated.includes(e) );
        //console.log("\n\n可挑选迁移的成年雄性:", temp, "\n\n");
        if(temp.length == 0) break;
        let picked = temp[ randomInt(0, temp.length-1) ];
        let toUnits = commu.allunits.filter( u => u != picked.unit );
        let tarUnit = toUnits[randomInt(0, toUnits.length-1) ];
        migrated.push(picked);
        // 通过frame来完成
        migrates.push({monkey: picked, originUnit: picked.realunit, targetUnit: tarUnit});
        // picked.leaveUnit();
        // picked.enterUnit( tarUnit );
    }
    for(let i = 0; i < migrateFemaleNum; i++){
        let temp = commu.commuAliveMonkeys().filter(e => e.ageLevel == AGE_LEVEL.ADULT && e.genda == GENDA.FEMALE && !migrated.includes(e) );
        //console.log("\n\n可挑选迁移的成年雌性:", temp, "\n\n");
        if(temp.length == 0) break;
        let picked = temp[ randomInt(0, temp.length-1) ];
        let toUnits = commu.allunits.filter( u => u != picked.unit );
        let tarUnit = toUnits[randomInt(0, toUnits.length-1) ];
        migrated.push(picked);
        // 通过frame来完成
        migrates.push({monkey: picked, originUnit: picked.realunit, targetUnit: tarUnit});
        // picked.leaveUnit();
        // picked.enterUnit( tarUnit );
    }

    // 生成的孩子的数目
    let babeNum : number;
    if(Math.random() < 1.95){
        babeNum = randomInt(2,2);//randomInt(4, 8);
    } else if ( Math.random() < .99){
        babeNum = randomInt(4, 5);//randomInt(9, 15);
    } else{
        babeNum = randomInt(6,7);//randomInt(16, 20);
    }

    // 挑选 babeNum 对parents
    //let newBabes = new Array();
    for(let i = 0; i < babeNum; i++){
        let parents = genParents(commu.allunits);
        let kid : Monkey;
        let unit = parents.mom.unit;
        kid = genMonkey(unit.name+'.'+AGE_LEVEL.JUVENILE+'.'+unit.juvenileLayer.length.toString()+"-new", unit, AGE_LEVEL.JUVENILE);
        //kid.enterUnit(unit);
        // 通过frame来完成
        enterCommu.push( {monkey: kid, unit: unit});
        newKinships.push({kid: kid, parents: parents});

        // parents.mom.addKid(kid);
        // parents.dad.addKid(kid);
        //console.log("新生的Monkey：", kid, "并进入单元：", unit.name, " parents: ", parents);
        // kid = kid.deepCopy();
        // let t = commu.allkinships.filter(k => k.father == parents.dad && k.mother == parents.mom)
        // if( t.length == 0){
        //     let ks = new Kinship(parents.dad, parents.mom, new Array<Monkey>(kid));
        //     commu.addKinship(ks);
        // }else{
        //     let ks = t[0];
        //     ks.addKid(kid);
        // }

    }
    console.log("消失的: ", vanished,"\n新增的单元: ", newUnits, "\n进入社群的: ", enterCommu, "\n挑战家长成功的: ", challengeMainMale,  "\n迁移的: ", migrates, "\n新增的亲缘关系: ", newKinships);
    let para = {
        vanished: vanished,
        newUnits: newUnits,
        enterCommu: enterCommu,
        challengeMainMale: challengeMainMale,
        migrates: migrates,
        newKinships: newKinships,
        tick: TICK_NEXT(),
    }
    let frame = new Frame(para);
    commu.addFrame(frame);
    commu.forward();
    //commu.tickNext();
    commu.layout();
    // 因为增加了一个TICK，在这过程中可能会改变TICK_MODE，需要根据当前模式将当前TICK之前的亲缘关系可见性进行设置。
    commu.changeTickMode(GET_TICK_MODE() );
    addGroupIds2Dropdown(commu);
    //window.graph = commu.getJsonData();
    addTick2Dropdown();
    $('#tickDropdown button').get()[0].textContent = ""+GET_TICK();
    console.log("Tick 之后的Community：", commu);
    let logStr = logFrame(frame,commu.frames.indexOf(frame));
    commu.logInfo.push(logStr);
    console.log( logStr );
    var blob = new Blob([logStr], {type: "text/plain;charset=utf-8"});
    //FileSaver.saveAs(blob, "hello world.txt");
}








