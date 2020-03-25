import * as THREE from 'three';
import { UNIT_TYPE, LAYER_TYPE, MALE_CUBE_LENGTH, FEMALE_SPHERE_RADIUS } from './basis';
import { Unit} from './Unit';

export abstract class Monkey extends THREE.Mesh{
    private genda: string;
    private unit: Unit;
    private social_level: string;
    public birth : Date;
    public father : Male;
    public mother : Female;

    constructor( unit: Unit, genda:string, id:number, name:string, /* unit:object, social_level:string */ ){
        super();
        this.unit = unit;
        this.genda = genda;
        //this.id = id;
        this.name = name;
        // this.unit = unit;
        // this.social_level = social_level;
    }

    public getName():string{ return this.name; }

    public getGebda():string { return this.genda; }

    public getSocialLevel():string { return this.social_level; }

    public getUnit():Unit { return this.unit; }
    
    public abstract selected() : void;

    public abstract unselected() : void;
    
}

export class Male extends Monkey {
    private unselectedMat : THREE.Material;
    private selectedMat : THREE.Material;
    constructor (id:number, name:string, unit:Unit /*, social_level:string*/ ) {
        super(unit, 'male', id, name/*, unit, social_level*/);
        // this.geometry = new THREE.BoxGeometry(2,2,2);
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
        super(unit, 'female', id, name/*, unit, social_level*/);
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