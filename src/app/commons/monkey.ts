import * as THREE from 'three';
import { UNIT_TYPE, AGE_LEVEL, MALE_CUBE_LENGTH, FEMALE_SPHERE_RADIUS, GENDA, MALE_GEMOMETRY, FEMALE_GEOMETRY } from './basis';
import { Unit} from './Unit';
import { Kinship } from './Kinship';
import { KidKinshipNodeLink } from './LineFactory';

export interface Selectable {
    selected: () => void;
    unselected : () => void;
}

export abstract class Monkey extends THREE.Mesh implements Selectable{
    readonly _ID : number;
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
    public mirror : Set<Monkey>;
    private _unit : Unit;

    public unselectedMat : THREE.Material | THREE.Material[];
    public selectedMat : THREE.Material | THREE.Material[];

    constructor( genda:GENDA, id:number, name:string, unit: Unit, father?: Male, mother?: Female, birthDate ?: Date ){
        super();
        this.isMonkey = true;
        this.genda = genda;
        this.name = name;
        // this.unit = unit;
        this._ID = id;
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
        this.mirror = new Set<Monkey>();
        this.selectedMat = this.unselectedMat = null;
    }

    public changePosition(pos : THREE.Vector3){
        // 当猴子的位置改变时触发的事件
        console.log(" 你在改变 ", this, " 的位置, ", this.position, " ===> ", pos);
        // 调用原生的 .position.set方法完成位置的改变
        var ret = this.position.set(pos.x, pos.y, pos.z);

        
       
    }

    public getUnit():Unit { return this.unit; }
    
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
        return this._unit;
    }
    
    public set unit ( unit : Unit ){
        this._unit = unit;
    }

    public addKid( kid : Monkey ){
        this._kids.add(kid);
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

    public set genda( genda : GENDA){
        this._genda = genda;
    }

    public get birthDate() {
        return this._birthDate;
    }

    public deepCopy(){
        let ret = this.clone();
        ret.unit = this.unit;
        ret.name += "-cloned";
        ret.material = new THREE.MeshBasicMaterial( { color : 0x333333})
        return ret;
    }

    public selected() {
        if( this.selectedMat == null){
            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            this.selectedMat = material;
            this.unselectedMat = this.material;
        }
        
        this.material = this.selectedMat;
    }

    public unselected () {
        this.material = this.unselectedMat;
    }
    
}


export class Male extends Monkey {
    constructor (id:number, name:string,  unit:Unit, birthDate?: Date, /*, social_level:string*/ ) {
        super(GENDA.MALE, id, name, unit/*, social_level*/);
        this.geometry = MALE_GEMOMETRY//new THREE.BoxBufferGeometry(MALE_CUBE_LENGTH, MALE_CUBE_LENGTH, MALE_CUBE_LENGTH);//;
        this.material =  new THREE.MeshBasicMaterial( { color: 0x000,  vertexColors: true } );
    }

    
}

export class Female extends Monkey {
    constructor (id:number, name:string, unit:Unit, birthDate?: Date/*, social_level:string */) {
        super( GENDA.FEMALE, id, name, unit/*, social_level*/);
        this.geometry = FEMALE_GEOMETRY;//new THREE.SphereBufferGeometry(FEMALE_SPHERE_RADIUS, 30, 30);// 
        this.material = new THREE.MeshLambertMaterial( { color: 0x000  } );
    }
}