import * as THREE from 'three';
import { UNIT_TYPE, LAYER_TYPE, LAYER_COLOR }from './basis';
import { Monkey, Male, Female } from './monkey';
import { Kinship} from './Kinship';


abstract class Unit extends THREE.Group {
    public startMembers : Array<Monkey>;
    public allMembers : Array<Monkey>;
    public currentMoment : Date;
    public startMoment : Date;
    public unitType : UNIT_TYPE;
    public name : string;
    public radius : number;

    constructor( radius : number, name : string) {
        // var sp_geo = new THREE.SphereGeometry(radius,100,100, 0, Math.PI*2, Math.PI / 2, Math.PI);
        // var sp_mat = new THREE.MeshLambertMaterial( { color: 0x000, transparent: true, opacity: 0.2, wireframe: false } )
        // super(sp_geo, sp_mat);
        super();
        this.radius = radius;
        this.name = name;
        this.startMembers = new Array<Monkey>();

    }

    public getName() : string{ return this.name; }

}

export class OMU extends Unit {
    public mainMale : Male;
    public mom: Female;

    constructor (radius : number) {
        var name = Math.random().toPrecision(4).toString();
        super( radius, "OMU-"+name);
        this.unitType = UNIT_TYPE.AMU;
        //var geometry = new THREE.BoxGeometry(2,2,2);
        //var material = new THREE.MeshBasicMaterial( { color: 0x000,  side: THREE.DoubleSide} );
        // var cube = new THREE.Mesh( geometry, material );
        this.mainMale = new Male(0, "主雄" );
        this.mainMale.position.set( this.position.x, this.position.y, this.position.z );
        this.add(this.mainMale);
        this.startMembers.push( this.mainMale );
        this.addLayer(1 + Math.floor( Math.random() * 7 ), LAYER_TYPE.AF);
        this.addLayer(1 + Math.floor( Math.random() * 2 ), LAYER_TYPE.SAM);
        this.addLayer(1 + Math.floor( Math.random() * 4 ), LAYER_TYPE.YMonkey);
        this.addLayer(1 + Math.floor( Math.random() * 3 ), LAYER_TYPE.JMonkey);
        this.addLayer(1 + Math.floor( Math.random() * 3 ), LAYER_TYPE.IMonkey);
    }

    public addLayer(n: number, layerType: LAYER_TYPE) {
        var x = this.position.x;
        var y = this.position.y;
        var z = this.position.z;

        var _y : number;
        var rk : number;
        var maleRatio : number;
        switch(layerType) {
            case LAYER_TYPE.AF:
                rk = this.radius;
                _y = y;
                maleRatio = -1;
                break;
            case LAYER_TYPE.SAM:
                rk = this.radius * Math.sqrt(24) / 5;
                _y = -.2 * this.radius;
                maleRatio = 2;
                break;
            case LAYER_TYPE.YMonkey:
                rk = this.radius * Math.sqrt(21) / 5;
                _y = -.4 * this.radius;
                maleRatio = .5;
                break;
            case LAYER_TYPE.JMonkey:
                _y = -.6 * this.radius;
                rk = this.radius * .8;
                maleRatio = .5;
                break;
            case LAYER_TYPE.IMonkey:
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

        for( var i = 0; i < n; i++) {
            var _x = Math.cos( i * seg * t ) * rk;
            var _z = Math.sin( i * seg * t ) * rk;
            if( Math.random() <= maleRatio){
                // 生成一个雄性
                var cube = new Male(i+1, this.name+'.'+layerType+'.'+(i+1).toString() )
                cube.position.set( x + _x, y + _y, z + _z);
                this.add(cube);
                this.startMembers.push(cube);
                //console.log( "cube : ", cube.position);
            } else {
                // 生成一个雌性
                var sph = new Female(i+1, this.name+'.'+layerType+'.'+(i+1).toString() );
                sph.position.set( x + _x, y + _y, z + _z);
                this.add(sph);
                this.startMembers.push( sph);
                //console.log( "sphere : ", sph.position);
                if( layerType == LAYER_TYPE.AF) {
                    let n = Math.floor( Math.random() * 3 );
                    if( n <= 0) return;
                    var ks = new Kinship(this.mainMale, sph, this.createKids( n ) );
                    console.log('ks:',ks);
                    this.add(ks);

                    
                    //console.log(line );
                }
            }
        }
    }


    public createKids(n : number ){
        var kids = new Array<Monkey>();
        let maleRatio = 0.4;
        for( var i = 0; i < n; i++) {
            if( Math.random() <= maleRatio){
                // 生成一个雄性
                let kid = new Male(i+1, this.name+'.Babe.Boy.'+(i+1).toString() )
                kids.push(kid);
            } else {
                // 生成一个雌性
                let kid = new Female(i+1, this.name+'.Babe.Girl.'+(i+1).toString() );
                kids.push(kid);
            }
            
        }
        this.startMembers = this.startMembers.concat( kids );
        this.add(...kids);
        console.log( this.startMembers );
        return kids;
    }

    
}

export class AMU extends Unit {
    constructor(radius : number) {
        let name = 'AMU-'+Math.random().toPrecision(4).toString();
        super(radius, name);
        this.unitType = UNIT_TYPE.AMU

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

        for( var i = 0; i < n; i++) {
            var _x = Math.cos( i * seg * t ) * rk;
            var _z = Math.sin( i * seg * t ) * rk;
            if( Math.random() <= maleRatio){
                // 生成一个雄性
                var cube = new Male(i+1, this.name+'.Male.'+(i+1) );
                cube.position.set( x + _x, y + _y, z + _z);
                this.add(cube);
                this.startMembers.push(cube);
                //console.log( "cube : ", cube.position);
            } else {
                // 生成一个雌性
                var sph = new Female(i+1, this.name+'.Female.'+(i+1) );
                sph.position.set( x + _x, y + _y, z + _z);
                this.add(sph);
                this.startMembers.push( sph);
                //console.log( "sphere : ", sph.position);
                
            }
        }
    }
}

export class FIU extends Unit {
    constructor(radius : number) {
        let name = 'FIU-'+Math.random().toPrecision(4).toString();
        super(radius, name);
        this.unitType = UNIT_TYPE.FIU;

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

        for( var i = 0; i < n; i++) {
            var _x = Math.cos( i * seg * t ) * rk;
            var _z = Math.sin( i * seg * t ) * rk;
            if( Math.random() <= maleRatio){
                // 生成一个雄性
                var cube = new Male(i+1, this.name+'.Male.'+(i+1) )
                cube.position.set( x + _x, y + _y, z + _z);
                this.add(cube);
                this.startMembers.push(cube);
                //console.log( "cube : ", cube.position);
            } else {
                // 生成一个雌性
                var sph = new Female(i+1, this.name+'.Female.'+(i+1) );
                sph.position.set( x + _x, y + _y, z + _z);
                this.add(sph);
                this.startMembers.push( sph);
                //console.log( "sphere : ", sph.position);
            }
        }
    }
}