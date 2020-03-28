import * as THREE from 'three';
import { UNIT_TYPE, AGE_LEVEL, LAYER_COLOR, JUVENILE_AGE, GENDA, MALE_YOUNG_AGE, FEMALE_YOUNG_AGE }from './basis';
import { Monkey, Male, Female } from './monkey';
import { Kinship} from './Kinship';
import { MeshNormalMaterial } from '../threelibs/three';
import { MOUSE } from 'three';


export abstract class Unit extends THREE.Group {
    private _ID : number;
    readonly _unitType : UNIT_TYPE;
    private _name : string;
    private _radius : number;

    readonly createdDate : Date;
    public vanishDate : Date;
    private _currentMoment : Date;

    public currentMembers : Set<Monkey>;  // 单元当前的成员
    public allMembers : Set<Monkey>;      // 曾属于单元的所有成员
    constructor( radius : number, name : string, unitType : UNIT_TYPE, createdDate? : Date ) {
        super();
        this.radius = radius;
        this.name = name;
        this.currentMembers = new Set<Monkey>();
        this.allMembers = new Set<Monkey>();
        if( !createdDate){
            this.createdDate = createdDate;
        } else {
            this.createdDate = new Date();
        }
        this._unitType = unitType;
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

    public get name(){
        return this._name;
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

    public pushMonkey( monkey : Monkey){
        this.currentMembers.add( monkey );
        monkey.unit = this;
    }

    public popMonkey( monkey : Monkey ){
        this.currentMembers.add(monkey);
        monkey.unit = null;
    }
}

export class OMU extends Unit {
    private _mainMale : Male;

    public adultLayer : Set<Monkey>;
    public youngLayer : Set<Monkey>;
    public juvenileLayer : Set<Monkey>;

    constructor (radius : number) {
        var name = Math.random().toPrecision(4).toString();
        super( radius, "OMU-"+name, UNIT_TYPE.OMU);
        
        this._mainMale = new Male(0, "主雄", this);
        this.mainMale.position.set( this.position.x, this.position.y, this.position.z );
        this.add(this.mainMale);
        this.currentMembers.add( this.mainMale );
        this.allMembers.add( this.mainMale);
        
        // this.addLayer_5(1 + Math.floor( Math.random() * 7 ), AGE_LEVEL.AF);
        // this.addLayer_5(1 + Math.floor( Math.random() * 2 ), AGE_LEVEL.SAM);
        // this.addLayer_5(1 + Math.floor( Math.random() * 4 ), AGE_LEVEL.YMonkey);
        // this.addLayer_5(1 + Math.floor( Math.random() * 3 ), AGE_LEVEL.JMonkey);
        // this.addLayer_5(1 + Math.floor( Math.random() * 3 ), AGE_LEVEL.IMonkey);

        this.addLayer_3(1 + Math.floor( Math.random() * 7 ), AGE_LEVEL.ADULT);
        this.addLayer_3(1 + Math.floor( Math.random() * 2 ), AGE_LEVEL.YOUNG);
        this.addLayer_3(1 + Math.floor( Math.random() * 4 ), AGE_LEVEL.JUVENILE);

    }

    public get mainMale(){
        return this._mainMale;
    }

    public set mainMale( mainMale : Male ){
        this._mainMale = mainMale;
    }

    public pushMonkey(monkey : Monkey ){
        super.pushMonkey(monkey);
        // 判断猴子的年龄，并进入相应的层
        let timedelta = this.currentMoment.getTime() - monkey.birthDate.getTime();
        let age = timedelta / 1000 / 60 / 60 / 24 / 365;
        if( age <  JUVENILE_AGE){
            this.juvenileLayer.add( monkey );
        } else if( (monkey.genda == GENDA.MALE && age <= MALE_YOUNG_AGE)  || 
                   (monkey.genda == GENDA.FEMALE && age <= FEMALE_YOUNG_AGE ) ) {
            this.youngLayer.add(monkey);
        } else {
            this.adultLayer.add(monkey );
        }

        
    }

    public addLayer_5(n: number, layerType: AGE_LEVEL) {
        var x = 0;//this.position.x;
        var y = 0;//this.position.y;
        var z = 0;//this.position.z;

        var _y : number;
        var rk : number;
        var maleRatio : number;
        switch(layerType) {
            case AGE_LEVEL.AF:
                rk = this.radius;
                _y = y;
                maleRatio = -1;
                break;
            case AGE_LEVEL.SAM:
                rk = this.radius * Math.sqrt(24) / 5;
                _y = -.2 * this.radius;
                maleRatio = 2;
                break;
            case AGE_LEVEL.YMonkey:
                rk = this.radius * Math.sqrt(21) / 5;
                _y = -.4 * this.radius;
                maleRatio = .5;
                break;
            case AGE_LEVEL.JMonkey:
                _y = -.6 * this.radius;
                rk = this.radius * .8;
                maleRatio = .5;
                break;
            case AGE_LEVEL.IMonkey:
                _y = -.8 * this.radius;
                rk = this.radius * .6;
                maleRatio = .5;
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
                monkey = new Male(i+1, this.name+'.'+layerType+'.'+(i+1).toString(), this )
                //console.log( "cube : ", cube.position);
            } else {
                // 生成一个雌性
                monkey = new Female(i+1, this.name+'.'+layerType+'.'+(i+1).toString(), this );
                if( layerType == AGE_LEVEL.AF) {
                    let n = Math.floor( Math.random() * 3 );
                    if( n <= 0) break;
                    var ks = new Kinship(this.mainMale, monkey, this.createKids( n ) );
                    //this.kinships.push(ks);
                    this.mainMale.kinship.push(ks);
                    monkey.kinship.push(ks);
                    console.log('ks:',ks);
                    //this.add(ks);
                    //console.log(line );
                }
            }
            monkey.ageLevel = layerType;
            monkey.position.set( x + _x, y + _y, z + _z);
            this.add(monkey);
            this.allMembers.add(monkey);
        }
    }

    public addLayer_3(n: number, layerType: AGE_LEVEL) {
        var x = 0;
        var y = 0;
        var z = 0;

        var _y : number;
        var rk : number;
        var maleRatio : number;
        switch(layerType) {
            case AGE_LEVEL.ADULT:
                rk = this.radius;
                _y = y;
                maleRatio = -1;
                break;
            case AGE_LEVEL.YOUNG:
                rk = this.radius * Math.sqrt(8) / 3;
                _y = -.33 * this.radius;
                maleRatio = .4;
                break;
            case AGE_LEVEL.JUVENILE:
                rk = this.radius * Math.sqrt(5) / 3;
                _y = -.67 * this.radius;
                maleRatio = .5;
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
                monkey = new Male(i+1, this.name+'.'+layerType+'.'+(i+1).toString(), this )
                //console.log( "cube : ", cube.position);
            } else {
                // 生成一个雌性
                monkey = new Female(i+1, this.name+'.'+layerType+'.'+(i+1).toString(), this );
            }
            monkey.position.set( x + _x, y + _y, z + _z);
            //monkey.changePosition( new THREE.Vector3(x + _x, y + _y, z + _z) );
            this.add(monkey);
            this.allMembers.add(monkey);
        }
    }

    public setMemberPosition() {

    }

    public createKids(n : number ){
        var kids = new Array<Monkey>();
        let maleRatio = 0.4;
        for( var i = 0; i < n; i++) {
            if( Math.random() <= maleRatio){
                // 生成一个雄性
                let kid = new Male(i+1, this.name+'.Babe.Boy.'+(i+1).toString(), this );
                kids.push(kid);
            } else {
                // 生成一个雌性
                let kid = new Female(i+1, this.name+'.Babe.Girl.'+(i+1).toString(), this );
                kids.push(kid);
            }
            
        }
        kids.forEach(kid => {
            this.allMembers.add( kid );
        })
        this.add(...kids);
        console.log( this.allMembers );
        return kids;
    }

    
}

export class AMU extends Unit {
    constructor(radius : number) {
        let name = 'AMU-'+Math.random().toPrecision(4).toString();
        super(radius, name, UNIT_TYPE.AMU);
        this.addLayer( 1 + Math.floor( Math.random() * 7 ));
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
                monkey = new Male(i+1, this.name+'.Male.'+(i+1), this );
            } else {
                // 生成一个雌性
                monkey = new Female(i+1, this.name+'.Female.'+(i+1), this );
            }
            monkey.position.set( x + _x, y + _y, z + _z);
            this.add(monkey);
            this.allMembers.add( monkey);
        }
    }
}

export class FIU extends Unit {
    constructor(radius : number) {
        let name = 'FIU-'+Math.random().toPrecision(4).toString();
        super(radius, name, UNIT_TYPE.FIU);
        this.addLayer( 1 + Math.floor( Math.random() * 7 ));
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
                monkey = new Male(i+1, this.name+'.Male.'+(i+1), this )
            } else {
                // 生成一个雌性
                monkey = new Female(i+1, this.name+'.Female.'+(i+1), this );
            }
            monkey.position.set( x + _x, y + _y, z + _z);
            this.add(monkey);
            this.allMembers.add(monkey);
        }
    }
}