import * as THREE from 'three';
import { AGE_LEVEL, GENDA, MALE_GEMOMETRY, FEMALE_GEOMETRY, GET_TICK, MONKEY_COLOR } from '../utils/basis';
import { Unit, OMU} from './Unit';
import { Kinship } from './Kinship';
import { KidKinshipNodeLink } from './LineFactory';

export interface Selectable {
    selected: () => void;
    unselected : () => void;
}

// class MonkeyInfo{
//     public ID : number;
//     public name : string;
//     public genda : GENDA;
//     public father : MonkeyInfo;
//     public mother : MonkeyInfo;
//     public kids : Array<MonkeyInfo>;
//     public mirror : Array<Monkey>;
//     public birthDate : Date;

//     constructor(id : number, name : string, genda : GENDA, birthDate?:Date){
//         this.ID = id;
//         this.name = name;
//         this.genda = genda;
//         this.father = null;
//         this.mother = null;
//         this.kids = new Array<MonkeyInfo>();
//         this.mirror = new Array<Monkey>();

//         if(birthDate)   this.birthDate = birthDate;
//         else    this.birthDate = new Date();
//     }

//     public addKid(kid : MonkeyInfo){
//         if(this.kids.includes(kid) )    return;
//         this.kids.push(kid);
//     }
// }

export abstract class Monkey extends THREE.Mesh implements Selectable{
    // 金丝猴的内部id
    private _ID : number;
    // 金丝猴的外部id
    public EID : any;

    public _name : string;
    private _genda: GENDA;
    readonly isMonkey : boolean;
    //private social_level: string;
    readonly _birthDate : Date;
    public ageLevel : AGE_LEVEL;
    public _father : Male;
    public _mother : Female;
    private _kids : Set<Monkey>;
    public kinship : Array<Kinship>;
    public kidKinshipLink : KidKinshipNodeLink;

    public isMirror : boolean;
    public mirror : Set<Monkey>;
    private _unit : Unit;
    public inCommu : boolean;
    public isAlive : boolean;
    public isMainMale : boolean;
    public isSampled : boolean;


    public unselectedColor : number;
    public selectedColor : number;
    public SELECTED : boolean;

    // migrateTable至多和leaveTable的长度多1，即离开单元的次数一定小于等于进入单元的次数，且不会超过一次
    // 记录Monkey在进入单元的时刻，由所有分身共享
    public migrateTable: Array<{tick: number, unit: Unit}>;
    // 记录Monkey离开单元的时刻，由所有分身共享
    public leaveTable: Array<{tick: number, unit: Unit}>;
    //public monkey : MonkeyInfo;

    constructor( genda:GENDA, id:number, name:string, unit: Unit, father?: Male, mother?: Female, birthDate ?: Date ){
        super();
        //this.monkey = new MonkeyInfo(id, name, genda, birthDate);
        this.isMonkey = true;
        this.genda = genda;
        this.name = name;
        // this.unit = unit;
        this._ID = id;
        this.EID = this.ID;
        if( birthDate ){
            this._birthDate = birthDate;
        } else {
            this._birthDate = new Date();
        }
        if( father ){ this._father = father; }
        else{ this._father = null; }
        if( mother ){ this._mother = mother; }
        else{ this._mother = mother; }

        this._kids = new Set<Monkey>();
        this.unit = unit;
        this.kinship = new Array<Kinship>();
        this.kidKinshipLink = null;
        
        this.selectedColor = this.unselectedColor = null;
        this.SELECTED = false;
        this.inCommu = true;
        this.isAlive = true;
        this.isMainMale = false;
        this.isSampled = true;

        this.ageLevel = AGE_LEVEL.JUVENILE;

        this.mirror = new Set<Monkey>();
        this.isMirror = true;
        this.migrateTable = new Array();
        this.leaveTable = new Array();
    }

    public changePosition(pos : THREE.Vector3){
        // 当猴子的位置改变时触发的事件
        console.log(" 你在改变 ", this, " 的位置, ", this.position, " ===> ", pos);
        // 调用原生的 .position.set方法完成位置的改变
        var ret = this.position.set(pos.x, pos.y, pos.z);
    }
    
    public get ID (){
        return this._ID;
    }

    public get name (){
        return this._name;
    }

    public set name ( newName : string){
        this._name = newName;
    }

    public get unit () {
        // 只是返回当前分身所在的单元
        return this._unit;
    }

    public set unit ( unit : Unit ){
        this._unit = unit;
    }

    public get realunit() {
        // 返回该ID的monkey当前所在单元
        let tmp : Monkey;
        this.mirror.forEach( e => {
            if( !e.isMirror ){
                tmp = e;
            }
        })
        // 如果tmp为null,则猴子已经vanished，即死亡或者离开了社群
        return tmp ? tmp.unit : null;
    }
    

    public addKid( kid : Monkey ){
        this._kids.add(kid);
        if(this.genda == GENDA.MALE){
            kid.father = this;
        } else{
            kid.mother = this;
        }
    }
    
    public get kids(){
        var ret = new Set<Monkey>();
        this._kids.forEach( kid => {
            ret.add(kid);
        })

        return ret;
    }

    public get genda () {
        return this._genda;
    }

    public set father( father : Male ){
        this._father = father;
    }

    public set mother( mother : Female ){
        this._mother = mother;
    }

    public get father(){
        return this._father;
    }

    public get mother() {
        return this._mother;
    }

    public get real() {
        // 返回ID对应的猴子的真身，若已经vanished则为null
        let ret;
        this.mirror.forEach( e => {
            if( !e.isMirror )   ret = e;
        })
        return ret;
    }

    public set genda( genda : GENDA){
        this._genda = genda;
    }

    public get birthDate() {
        return this._birthDate;
    }

    public deepCopy(){
        // 每一个Monkey共享的信息有：
        // 1) ID、EID;
        // 2) father、mother;
        // 3) kids;
        // 4) mirror;
        // 5) name;
        // 6) isAlive、inCommu、isSampled;
        // 7) selectedColor、unselectedColor、SELECTED;
        // 8) migrateTable;

        // 不共享的信息：
        // 1) 每个分身所在的单元；
        // 2) isMirror 属性，mirror里只能有一个分身的isMirror为false；
        // 3) ageLevel，表示分身最后一次离开单元时的ageLevel
        // 4) isMainMale，表示该分身在分身单元内是否为主雄
        let ret = this.clone();
        ret._ID = this.ID;
        ret.EID = this.EID;
        ret.unit = this.unit;
        ret.father = this.father;
        ret.mother = this.mother;
        ret._kids = this._kids;
        ret.ageLevel = this.ageLevel;
        ret.material = new THREE.MeshLambertMaterial( { color :MONKEY_COLOR.REAL})
        ret.material.emissive.setHex( MONKEY_COLOR.MIRROR);
        this.mirror.add(ret);
        ret.mirror = this.mirror;
        ret.migrateTable = this.migrateTable;
        ret.leaveTable = this.leaveTable;
        ret.isMirror = true;
        ret.isMainMale = false;
        ret.isSampled = this.isSampled;
        return ret;
    }

    public selected() {
        this.mirror.forEach( m => {
            m.selectedColor = 0xff0000;
            m.unselectedColor = m.material.emissive.getHex();
            m.material.emissive.setHex( m.selectedColor);
            m.scale.set(2,2,2);
            m.SELECTED = true;
        });
    }

    public unselected () {
        this.mirror.forEach( m => {
            m.material.emissive.setHex( m.unselectedColor ); 
            m.scale.set(1,1,1);
            m.SELECTED = false;
        } );
    }

    public leaveUnit(tick:number=GET_TICK(), recode:boolean=true){
        // 在任一时刻，只有真身才会调用 leaveUnit 方法
        if( this.unit == null) return;
        this.isMirror = true;
        this.inCommu = false;
        if(tick>=0 && recode && this.leaveTable.filter(e => e.tick == tick && e.unit.ID == this.unit.ID ).length == 0){
            this.leaveTable.push({tick: tick, unit:this.unit})
        }
            
        if( this.isMainMale && this.unit instanceof OMU){
            this.isMainMale = false;
            this.unit.mainMale = null;
        }
        
        this.material.emissive.setHex(MONKEY_COLOR.MIRROR);
        
        this.mirror.forEach( m => {
            m.inCommu = false;
        })
    }

    public enterUnit( unit : Unit, tick:number=GET_TICK(), recode:boolean=true){
        // Monkey进入unit
        let temp = unit.allMembers.filter( m => m.ID == this.ID );
        let mirror;
        if( temp.length != 0){
            // 将进入的单元中包含了这个猴子的分身，则只改变分身的属性
            mirror = temp[0];
            mirror.isMirror = false;
            // 注意！！！需要检查是否已经有相同时刻进入某单元的记录，放置在back/forward 时产生重复的记录
            if( recode && mirror.migrateTable.filter( e => e.tick == tick && e.unit.ID == unit.ID).length == 0)
                mirror.migrateTable.push({tick: tick, unit: unit} );  // 记录该分身进入了单元unit
            mirror.material.emissive.setHex( MONKEY_COLOR.REAL + unit.color);
            
        } else {
            // 将进入的单元中无这个猴子的分身，则创建一个mirror加入到该单元
            if( this.mirror.size == 0){
                // 该ID的Monkey第一次进入一个unit，则无需创建mirror，将其本身作为mirror即可
                // 因为第一次进入单元，所以肯定是unselectedColor = 0x000
                this.mirror.add(this);
                this.isMirror = false;
                this.unit = unit;
                
                if( recode && this.migrateTable.filter( e => e.tick == tick && e.unit.ID == unit.ID).length == 0)
                    this.migrateTable.push( {tick: tick, unit: unit} );
                this.material.emissive.setHex(MONKEY_COLOR.REAL + unit.color);
                unit.allMembers.push(this);
                unit.add(this);
            } else{
                mirror = this.deepCopy();
                mirror.material.emissive.setHex( MONKEY_COLOR.REAL + unit.color );
                mirror.isMirror = false;
                mirror.unit = unit;
                if( recode && mirror.migrateTable.filter( e => e.tick == tick && e.unit.ID == unit.ID).length == 0)
                    mirror.migrateTable.push( {tick: tick, unit: unit} );
                unit.allMembers.push(mirror);
                unit.add( mirror);
            }
            
        }

        this.mirror.forEach( m => {
            m.inCommu = true;
        })
        
        
        
    }

    public die(){
        
        this.mirror.forEach( m => {
            m.isAlive = false;
            m.inCommu = false;
            m.isMirror = true;
            // 死亡的统一设置成灰色和线框
            m.material.emissive.setHex(MONKEY_COLOR.DEAD);
            m.material.wireframe = true;
            if(m.isMainMale && m.unit instanceof OMU){
                m.isMainMale = false;
                m.unit.mainMale = null;
            }
        })
    }
    
    public revive() {
        this.mirror.forEach( m => {
            m.isAlive = true;
            m.inCommu = true;
            // 复活后统一设置成分身的颜色
            m.material.emissive.setHex(MONKEY_COLOR.MIRROR);
            m.material.wireframe = false;
        })
    }
    
}


export class Male extends Monkey {
    constructor (id:number, name:string,  unit:Unit, birthDate?: Date, /*, social_level:string*/ ) {
        super(GENDA.MALE, id, name, unit/*, social_level*/);
        this.geometry = MALE_GEMOMETRY;//new THREE.BoxBufferGeometry(MALE_CUBE_LENGTH, MALE_CUBE_LENGTH, MALE_CUBE_LENGTH);//;
        this.material =  new THREE.MeshLambertMaterial( { color: 0x000,  vertexColors: true} );
    }

    
}

export class Female extends Monkey {
    constructor (id:number, name:string, unit:Unit, birthDate?: Date/*, social_level:string */) {
        super( GENDA.FEMALE, id, name, unit/*, social_level*/);
        this.geometry = FEMALE_GEOMETRY;
        this.material = new THREE.MeshLambertMaterial( { color: 0x000, vertexColors: true  } );
    }
}