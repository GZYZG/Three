import * as THREE from 'three';
import { UNIT_TYPE, AGE_LEVEL, LAYER_COLOR, JUVENILE_AGE, GENDA, MALE_YOUNG_AGE, FEMALE_YOUNG_AGE, randomInt, MONKEY_GEN_ID, UNIT_GEN_ID }from './basis';
import { Monkey, Male, Female } from './Monkey';
import { Kinship} from './Kinship';
import { MeshNormalMaterial } from '../threelibs/three';
import { MOUSE } from 'three';
import { CSS2DObject, CSS2DRenderer } from '../threelibs/CSS2DRenderer';



export abstract class Unit extends THREE.Group {
    private _ID : number;
    readonly _unitType : UNIT_TYPE;
    private _name : string;
    private _radius : number;

    readonly createdDate : Date;
    public vanishDate : Date;
    private _currentMoment : Date;

    public label : CSS2DObject;

    public allMembers : Array<Monkey>;      // 曾属于单元的所有成员
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
        laberDiv.textContent = this.name;
        laberDiv.style.marginTop = '-1em';
        laberDiv.style.display = "block";
        let label = new CSS2DObject(laberDiv);  
        label.position.set(0, this.position.y, 0); 
        this.label = label;
        this.add(label);
        

    
        
    
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
}

export class OMU extends Unit {
    private _mainMale : Male;

    

    constructor (radius : number) {
        //var name = Math.random().toPrecision(4).toString();
        super( radius, UNIT_TYPE.OMU);
        // this.adultLayer = new Array<Monkey>();
        // this.youngLayer = new Array<Monkey>();
        // this.juvenileLayer = new Array<Monkey>();
        
        this._mainMale = new Male(MONKEY_GEN_ID(), this.name+'.'+'主雄', this);
        this._mainMale.ageLevel = AGE_LEVEL.ADULT;
        this._mainMale.isMainMale = true;
        this._mainMale.enterUnit( this);
        //this.adultLayer.push( this._mainMale );
        this.mainMale.position.set( this.position.x, this.position.y, this.position.z );
        this.add(this.mainMale);
        this.currentMembers.push( this.mainMale );
        this.allMembers.push( this.mainMale);

        

    }

    public addMonkeys(){
        this.addLayer_3( randomInt(2, 4), AGE_LEVEL.ADULT);
        this.addLayer_3( randomInt(2, 3), AGE_LEVEL.YOUNG);
        this.addLayer_3( randomInt(2, 4), AGE_LEVEL.JUVENILE);
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

    public addLayer_3(n: number, layerType: AGE_LEVEL) {
        // 为每层随机生成Monkey， 但是不对其进行布局
        var x = 0;
        var y = 0;
        var z = 0;

        var _y : number;
        var rk : number;
        var maleRatio : number;
        let tempLayer;
        switch(layerType) {
            case AGE_LEVEL.ADULT:
                rk = this.radius;
                _y = y;
                maleRatio = .1;
                //tempLayer = this.adultLayer;
                break;
            case AGE_LEVEL.YOUNG:
                rk = this.radius * Math.sqrt(8) / 3;
                _y = -.33 * this.radius;
                maleRatio = .4;
                //tempLayer = this.youngLayer;
                break;
            case AGE_LEVEL.JUVENILE:
                rk = this.radius * Math.sqrt(5) / 3;
                _y = -.67 * this.radius;
                maleRatio = .5;
                //tempLayer = this.juvenileLayer;
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
        // console.log( layerType, " : ", layer.position);
        this.add(layer);

        const t =  0.017453293 ;
        const seg = 360 / n;

        let monkey : Monkey;
        for( var i = 0; i < n; i++) {
            var _x = Math.cos( i * seg * t ) * rk;
            var _z = Math.sin( i * seg * t ) * rk;
            if( Math.random() <= maleRatio){
                // 生成一个雄性
                monkey = new Male(MONKEY_GEN_ID(), this.name+'.'+layerType+'.'+(i+1).toString(), this )
                //console.log( "cube : ", cube.position);
            } else {
                // 生成一个雌性
                monkey = new Female(MONKEY_GEN_ID(), this.name+'.'+layerType+'.'+(i+1).toString(), this );
            }
            monkey.ageLevel = layerType;
            //tempLayer.push(monkey);
            monkey.enterUnit( this);
            // this.add(monkey);
            // this.allMembers.push(monkey);
        }
    }

    public setMemberPosition() {

    }

    
}

export class AMU extends Unit {
    constructor(radius : number) {
        //let name = 'AMU-'+Math.random().toPrecision(4).toString();
        super(radius, UNIT_TYPE.AMU);
        
    }

    public addMonkeys(){
        this.addLayer( randomInt(3, 5) );
    }

    public addLayer( n : number){
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
        // console.log( layerType, " : ", layer.position);
        this.add(layer);

        const t =  0.017453293 ;
        const seg = 360 / n;
        let monkey : Monkey;
        for( var i = 0; i < n; i++) {
            var _x = Math.cos( i * seg * t ) * rk;
            var _z = Math.sin( i * seg * t ) * rk;
            if( Math.random() <= maleRatio){
                // 生成一个雄性
                monkey = new Male(MONKEY_GEN_ID(), this.name+'.M.'+(i+1), this );
            } else {
                // 生成一个雌性
                monkey = new Female(MONKEY_GEN_ID(), this.name+'.F.'+(i+1), this );
            }
            // this.add(monkey);
            // this.allMembers.push( monkey);
            monkey.enterUnit( this);
            monkey.ageLevel = AGE_LEVEL.ADULT;
        }
    }
}

export class FIU extends Unit {
    constructor(radius : number) {
        //let name = 'FIU-'+Math.random().toPrecision(4).toString();
        super(radius, UNIT_TYPE.FIU);
        
    }

    public addMonkeys(){
        this.addLayer( randomInt(2, 4));
    }

    public addLayer( n : number){
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
        // console.log( layerType, " : ", layer.position);
        this.add(layer);

        const t =  0.017453293 ;
        const seg = 360 / n;
        let monkey : Monkey;
        for( var i = 0; i < n; i++) {
            var _x = Math.cos( i * seg * t ) * rk;
            var _z = Math.sin( i * seg * t ) * rk;
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