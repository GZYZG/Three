import * as THREE from 'three';
import { UNIT_TYPE, LAYER_TYPE, MALE_CUBE_LENGTH, FEMALE_SPHERE_RADIUS, GENDA } from './basis';
import { Unit} from './Unit';

export abstract class Monkey extends THREE.Mesh{
    readonly _ID : number;
    public _name : string;
    private _genda: GENDA;
    //private social_level: string;
    public birthDate : Date;
    readonly _father : Male;
    readonly _mother : Female;
    public kids : Array<Monkey>;

    public _unit : Unit;

    constructor( genda:GENDA, id:number, name:string, unit : Unit ){
        super();
        this.genda = genda;
        this.name = name;
        this.unit = unit;
        this._ID = id;

        this.kids = new Array<Monkey>();
    }

    // public getSocialLevel():string { return this.social_level; }

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

    public get genda () {
        return this._genda;
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

    public abstract selected() : void;

    public abstract unselected() : void;

    
}

export class Male extends Monkey {
    private unselectedMat : THREE.Material;
    private selectedMat : THREE.Material;
    constructor (id:number, name:string, unit:Unit /*, social_level:string*/ ) {
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
    constructor (id:number, name:string, unit:Unit/*, social_level:string */) {
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