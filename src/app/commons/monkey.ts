import * as THREE from 'three';
import { UNIT_TYPE, AGE_LEVEL, MALE_CUBE_LENGTH, FEMALE_SPHERE_RADIUS, GENDA } from './basis';
import { Unit} from './Unit';
import { Kinship } from './Kinship';
import { KidKinshipNodeLink } from './LineFactory';

export abstract class Monkey extends THREE.Mesh{
    readonly _ID : number;
    public _name : string;
    private _genda: GENDA;
    //private social_level: string;
    readonly _birthDate : Date;
    public ageLevel : AGE_LEVEL;
    public _father : Male;
    public _mother : Female;
    private _kids : Set<Monkey>;
    public kinship : Array<Kinship>;
    public kidKinshipLink : KidKinshipNodeLink;

    private _unit : Unit;

    constructor( genda:GENDA, id:number, name:string, unit: Unit, father?: Male, mother?: Female, birthDate ?: Date ){
        super();
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


    public abstract selected() : void;

    public abstract unselected() : void;

    
}


export class Male extends Monkey {
    private unselectedMat : THREE.Material;
    private selectedMat : THREE.Material;
    constructor (id:number, name:string,  unit:Unit, birthDate?: Date, /*, social_level:string*/ ) {
        super(GENDA.MALE, id, name, unit/*, social_level*/);
        this.geometry = new THREE.BoxBufferGeometry(MALE_CUBE_LENGTH, MALE_CUBE_LENGTH, MALE_CUBE_LENGTH);
        this.material = new THREE.MeshBasicMaterial( { color: 0x000,  vertexColors: true,  side: THREE.DoubleSide} );
        this.unselectedMat = this.material;
        this.selectedMat = null;
    }

    public selected() {
        if( this.selectedMat == null){
            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00,  side: THREE.DoubleSide} );
            this.selectedMat = material;
        }
        
        this.material = this.selectedMat;
    }

    public unselected () {
        this.material = this.unselectedMat;
    }
}

export class Female extends Monkey {
    private unselectedMat : THREE.Material;
    private selectedMat : THREE.Material;
    constructor (id:number, name:string, unit:Unit, birthDate?: Date/*, social_level:string */) {
        super( GENDA.FEMALE, id, name, unit/*, social_level*/);
        //this.geometry = new THREE.SphereGeometry(2,30,30);
        this.geometry = new THREE.SphereBufferGeometry(FEMALE_SPHERE_RADIUS, 30, 30);
        this.material = new THREE.MeshLambertMaterial( { color: 0x000, side: THREE.DoubleSide } );
        this.unselectedMat = this.material;
        this.selectedMat = null;
    }

    public selected() {
        if( this.selectedMat == null){
            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00,  side: THREE.DoubleSide} );
            this.selectedMat = material;
        }
        this.material = this.selectedMat;
    }

    public unselected () {
        this.material = this.unselectedMat;
    }

}