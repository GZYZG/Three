import * as THREE from 'three';
import { UNIT_TYPE, AGE_LEVEL, LAYER_COLOR, JUVENILE_AGE, GENDA, MALE_YOUNG_AGE, FEMALE_YOUNG_AGE, randomInt, MONKEY_GEN_ID, UNIT_GEN_ID, GEN_UNIT_COLOR, GET_TICK, GET_COMMUNITY }from './basis';
import { Monkey, Male, Female } from './Monkey';
import { Kinship} from './Kinship';
import { MeshNormalMaterial } from '../threelibs/three';
import { MOUSE } from 'three';
import { CSS2DObject, CSS2DRenderer } from '../threelibs/CSS2DRenderer';
import { showUnitTickList } from './Dom';



export abstract class Unit extends THREE.Group {
    private _ID : number;
    public EID : any;

    readonly _unitType : UNIT_TYPE;
    private _name : string;
    private _radius : number;

    readonly createdDate : Date;
    public vanishDate : Date;
    private _currentMoment : Date;
    public createTick: number;

    public label : CSS2DObject;
    public color : number;

    public allMembers : Array<Monkey>;      // 曾属于单元的所有成员
    public tickMembers: Map<number, Array<number>>;     // 每个时刻的成员表
    public tickMainMale: Map<number, number>;
    constructor( radius : number, unitType : UNIT_TYPE, createdDate? : Date ) {
        super();
        this.radius = radius;
        // this.name = name;
        //this.currentMembers = new Array<Monkey>();
        this.allMembers = new Array<Monkey>();
        if( !createdDate){
            this.createdDate = createdDate;
        } else {
            this.createdDate = new Date();
        }
        this._unitType = unitType;
        this.ID = UNIT_GEN_ID();
        let container = document.getElementsByClassName('center')[0];

        let laberDiv = document.createElement('div');//创建div容器
        laberDiv.className = 'label';
        laberDiv.setAttribute("unitID", ""+this.ID);
        // let self = this;
        laberDiv.onclick = function(e){
            let COMMUNITY = GET_COMMUNITY();
            console.log(COMMUNITY," : ", e);
            let unitID = parseInt(e.target.getAttribute("unitID") );
            let unit = COMMUNITY.allunits.filter( e => e.ID == unitID)[0];
            let blanks = $("#unit_info li");
            blanks[0].innerText =  "ID: " + unit.ID;
            blanks[0].setAttribute("unitID", unitID+"");
            blanks[1].innerText = "name: " + unit.name;
            blanks[2].innerText = "创建时间: Tick-" + unit.createTick;
            showUnitTickList(unitID);
            $("#collapseTwo").collapse("show");
        }

        laberDiv.textContent = this.name;
        laberDiv.style.marginTop = '-1em';
        laberDiv.style.display = "block";
        let label = new CSS2DObject(laberDiv);  
        label.position.set(this.radius+5, this.position.y-5, 0); 
        this.label = label;
        this.add(label);
        
        this.color = parseInt(GEN_UNIT_COLOR(), 16);
        // 自动获取当前的时刻，作为单元建立的时刻
        this.createTick = GET_TICK();
        
        this.tickMembers = new Map<number, Array<number>>();
        this.tickMainMale = new Map<number, number>();
    
    }

    public set ID( id : number){
        this._ID = id;
    }

    public get ID(){
        return this._ID;
    }

    public get unitType (){
        return this._unitType
    }

    public get adultLayer() {
        return this.allMembers.filter( m => m.ageLevel == AGE_LEVEL.ADULT);
    }

    public get youngLayer() {
        return this.allMembers.filter( m => m.ageLevel == AGE_LEVEL.YOUNG );
    }

    public get juvenileLayer() {
        return this.allMembers.filter( m => m.ageLevel == AGE_LEVEL.JUVENILE );
    }

    public get name(){
        return this.unitType+this.ID;
    }

    public set name( name : string){
        this._name = name;
    }

    public set radius( radius : number ){
        this._radius = radius;
    }

    public get radius(){
        return this._radius;
    }

    // 自定义的改变单元的position的setter，与Mesh的 position.set 方法不同
    public changePosition(pos : THREE.Vector3){
        this.position.set(pos.x, pos.y, pos.z);

    }

    public set currentMoment( currentDate : Date){
        this._currentMoment = currentDate;
    }

    public get currentMoment(){
        return this._currentMoment;
    }

    public get currentMembers(){
        return this.allMembers.filter( m => !m.isMirror && m.inCommu && m.isAlive);
    }

    public abstract addMonkeys():void;

    public abstract buildLayer(type:AGE_LEVEL):any;

    public abstract buildUnit():void;

}

export class OMU extends Unit {
    private _mainMale : Male;

    constructor (radius : number, mainMale?:Male) {
        //var name = Math.random().toPrecision(4).toString();
        super( radius, UNIT_TYPE.OMU);
        this._mainMale = mainMale || new Male(MONKEY_GEN_ID(), this.name+'.'+'主雄', this);
        this._mainMale.ageLevel = AGE_LEVEL.ADULT;
        this._mainMale.isMainMale = true;
        this._mainMale.enterUnit( this);
        this.mainMale.position.set( this.position.x, this.position.y, this.position.z );
        
        //this.add(this.mainMale);
        this.buildUnit();
    }

    public addMonkeys(){
        this.addLayer_3( randomInt(2, 3), AGE_LEVEL.ADULT);
        this.addLayer_3( randomInt(2, 3), AGE_LEVEL.YOUNG);
        this.addLayer_3( randomInt(2, 3), AGE_LEVEL.JUVENILE);
    }

    public get mainMale(){
        return this._mainMale;
    }

    public set mainMale( mainMale : Male ){
        if(this._mainMale){
            this._mainMale.isMainMale = false;
            this._mainMale = null;
        }
        this._mainMale = mainMale;
        if(mainMale)
            mainMale.isMainMale = true;
    }

    public buildLayer(type:AGE_LEVEL){
        var x = 0;
        var y = 0;
        var z = 0;
        var _y : number;
        var rk : number;
        switch(type) {
            case AGE_LEVEL.ADULT:
                rk = this.radius;
                _y = 0;
                break;
            case AGE_LEVEL.YOUNG:
                rk = this.radius * Math.sqrt(8) / 3;
                _y = -.33 * this.radius;
                break;
            case AGE_LEVEL.JUVENILE:
                rk = this.radius * Math.sqrt(5) / 3;
                _y = -.67 * this.radius;
                break;
            default:
                break;
        }


        var lay_geo = new THREE.RingGeometry(rk-.3, rk+.3, 100, 1);
        var lay_mat = new THREE.MeshBasicMaterial( { color : LAYER_COLOR,  side: THREE.DoubleSide });
        var layer = new THREE.Mesh( lay_geo, lay_mat);
        // 注意是弧度不是角度
        layer.rotateX(- Math.PI / 2);
        layer.position.set(x, y + _y, z);
        return layer;
    }

    public buildUnit(){
        let layer = this.buildLayer(AGE_LEVEL.ADULT);
        this.add(layer);
        layer = this.buildLayer(AGE_LEVEL.YOUNG);
        this.add(layer);
        layer = this.buildLayer(AGE_LEVEL.JUVENILE);
        this.add(layer);
    }

    public addLayer_3(n: number, layerType: AGE_LEVEL) {
        // 为每层随机生成Monkey， 但是不对其进行布局
        var maleRatio : number;
        switch(layerType) {
            case AGE_LEVEL.ADULT:
                maleRatio = .1;
                break;
            case AGE_LEVEL.YOUNG:
                maleRatio = .4;
                break;
            case AGE_LEVEL.JUVENILE:
                maleRatio = .5;
                break;
            default:
                break;
        }

        let monkey : Monkey;
        for( var i = 0; i < n; i++) {
            if( Math.random() <= maleRatio){
                // 生成一个雄性
                monkey = new Male(MONKEY_GEN_ID(), this.name+'.'+layerType+'.'+(i+1).toString(), this )
                //console.log( "cube : ", cube.position);
            } else {
                // 生成一个雌性
                monkey = new Female(MONKEY_GEN_ID(), this.name+'.'+layerType+'.'+(i+1).toString(), this );
            }
            monkey.ageLevel = layerType;
            monkey.enterUnit( this);
        }
    }

    public setMemberPosition() {

    }

    
}

export class AMU extends Unit {
    constructor(radius : number) {
        //let name = 'AMU-'+Math.random().toPrecision(4).toString();
        super(radius, UNIT_TYPE.AMU);
        this.buildUnit()
    }

    public addMonkeys(){
        this.addLayer( randomInt(3, 4) );
    }

    public buildLayer(type:AGE_LEVEL){
        var x = this.position.x;
        var y = this.position.y;
        var z = this.position.z;

        var _y = 0;
        var rk = this.radius;
        var maleRatio = 2;

        var lay_geo = new THREE.RingGeometry(rk-.3, rk+.3, 100, 1);
        var lay_mat = new THREE.MeshBasicMaterial( { color : LAYER_COLOR,  side: THREE.DoubleSide });
        var layer = new THREE.Mesh( lay_geo, lay_mat);
        // 注意是弧度不是角度
        layer.rotateX(- Math.PI / 2);
        layer.position.set(x, y + _y, z);
        return layer;
    }

    public buildUnit(){
        let layer = this.buildLayer(AGE_LEVEL.ADULT);
        this.add(layer);
    }

    public addLayer( n : number){
        var maleRatio = 2;
    
        let monkey : Monkey;
        for( var i = 0; i < n; i++) {
            if( Math.random() <= maleRatio){
                // 生成一个雄性
                monkey = new Male(MONKEY_GEN_ID(), this.name+'.M.'+(i+1), this );
            } else {
                // 生成一个雌性
                monkey = new Female(MONKEY_GEN_ID(), this.name+'.F.'+(i+1), this );
            }
            monkey.enterUnit( this);
            monkey.ageLevel = AGE_LEVEL.ADULT;
        }
    }
}

export class FIU extends Unit {
    constructor(radius : number) {
        //let name = 'FIU-'+Math.random().toPrecision(4).toString();
        super(radius, UNIT_TYPE.FIU);
        this.buildUnit()
    }

    public addMonkeys(){
        this.addLayer( randomInt(2, 3));
    }

    public buildLayer(type:AGE_LEVEL){
        var x = this.position.x;
        var y = this.position.y;
        var z = this.position.z;

        var _y = 0;
        var rk = this.radius;
        var maleRatio = .5;

        var lay_geo = new THREE.RingGeometry(rk-.3, rk+.3, 100, 1);
        var lay_mat = new THREE.MeshBasicMaterial( { color : LAYER_COLOR,  side: THREE.DoubleSide });
        var layer = new THREE.Mesh( lay_geo, lay_mat);
        // 注意是弧度不是角度
        layer.rotateX(- Math.PI / 2);
        layer.position.set(x, y + _y, z);
        return layer;
    }

    public buildUnit(){
        let layer = this.buildLayer(AGE_LEVEL.ADULT);
        this.add(layer);
    }

    public addLayer( n : number){
        var maleRatio = .5;

        let monkey : Monkey;
        for( var i = 0; i < n; i++) {
            if( Math.random() <= maleRatio){
                // 生成一个雄性
                monkey = new Male(MONKEY_GEN_ID(), this.name+'.M.'+(i+1), this )
            } else {
                // 生成一个雌性
                monkey = new Female(MONKEY_GEN_ID(), this.name+'.F.'+(i+1), this );
            }
            // this.add(monkey);
            // this.allMembers.push(monkey);
            monkey.enterUnit( this );
            monkey.ageLevel = AGE_LEVEL.ADULT;
        }
    }


}