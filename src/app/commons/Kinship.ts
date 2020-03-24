import { Monkey, Male, Female} from './monkey';
import { ParentsLink, KPNodeLink, KidKinshipNodeLink } from './LineFactory';
import * as THREE from 'three';
import { Colors } from 'three';
import { LineGeometry } from '../threelibs/LineGeometry';
import { LineMaterial } from '../threelibs/LineMaterial';
import { Line2 } from '../threelibs/Line2';
import { SHIP_NODE_RADIUS } from './basis';



export class kinshipNode extends THREE.Mesh {
    public kpNodeLink : KPNodeLink;
    private _kids : Array<Monkey>;
    constructor (kids : Array<Monkey>) {
        super();
        //this.kpNodeLink = link;
        // kids.forEach(kid =>{
        //     this.attach(kid);
        // })
        this.geometry = new THREE.SphereBufferGeometry(SHIP_NODE_RADIUS, 30, 30);
        this.material = new THREE.MeshLambertMaterial( { color: 0x008, vertexColors: true, side: THREE.DoubleSide } );
    }

    public get kids() : Array<Monkey>{
        return this.kids;
    }

    public set kids(kids : Array<Monkey>) {
        this._kids = kids;
    }

    public addKids(kids : Array<Monkey> ){
        this._kids = this._kids.concat(kids);
    }

    
}

export class ParentsNode extends THREE.Mesh {
    public father : Male;
    public mother : Female;
    constructor () {
        super();
        this.geometry = new THREE.SphereBufferGeometry( SHIP_NODE_RADIUS, 30, 30);
        this.material = new THREE.MeshLambertMaterial( { color: 0x008, vertexColors: true, side: THREE.DoubleSide } );
    }
}


export class Kinship extends THREE.Group {
    public father : Male;
    public mother : Female;
    public kids : Array<Monkey>;
    public kinshipNode : kinshipNode;
    public parentsLink : ParentsLink;
    public parentsNode : ParentsNode;
    public KPNodeLink : KPNodeLink;
    public kidLinks : Array<object>;
    public unitRadius : number;

    constructor (father : Male, mother : Female, kids : Array<Monkey>, unitRadius : number = 30) {
        super();
        
        this.father = father;
        this.mother = mother;
        this.kids = kids;
        this.unitRadius = unitRadius;
        
        this.addParentsLink();
        this.addParentsNode();
        this.addKinshipNode();
        this.addKPNodeLink();
        //this.addCurve();
        this.addKidsKinshipLink();
    }
    
    public addParentsLink() {
        var link = new ParentsLink(this.father, this.mother );
        this.parentsLink = link;
        console.log("parentsLink:", this.parentsLink );
        this.add(this.parentsLink);
    }

    public addParentsNode() {
        this.parentsNode = new ParentsNode();
        var pos =  this.calcParentsNodePos() ;
        this.parentsNode.position.set( pos.x, pos.y, pos.z);
        this.parentsLink.add(this.parentsNode);
        console.log("parentsNode:", this.parentsNode );
    }

    public addKinshipNode() {
        this.kinshipNode = new kinshipNode(this.kids);
        let pos = this.calcKinshipNodePos();
        this.kinshipNode.position.set(pos.x, pos.y, pos.z);
        this.add(this.kinshipNode );
    }

    public addKPNodeLink() {
        this.KPNodeLink = new KPNodeLink(this.parentsNode, this.kinshipNode );
        this.parentsLink.attach(this.KPNodeLink);
        this.kinshipNode.kpNodeLink = this.KPNodeLink;
        console.log("KPNodeLink:", this.KPNodeLink);
    }

    public addCurve() {
        var pos1 = this.parentsNode.position.clone();
        var pos2 = this.kinshipNode.position.clone();

        var curve = new THREE.CatmullRomCurve3([
            pos1, new THREE.Vector3(23, 25, 0), pos2
        ]);

        var points = curve.getPoints(50);
        var positions = new Array();
        var colors = new Array();
        points.forEach(p => {
            positions.push( p.x, p.y, p.z );
            colors.push( 0, 0, 1);
        })

        var geo = new LineGeometry();
        geo.setPositions(positions);
        geo.setColors( colors);
        var mat = new LineMaterial({
            linewidth : 2,
            vertexColors : true,
        })
        mat.resolution.set(window.innerWidth, window.innerHeight);

        var line = new Line2(geo, mat);
        this.parentsLink.add(line);

    }

    public addKidsKinshipLink(type="xz") {
        if( this.kids.length == 0) return;
        var R = 5;
        var pos = (new THREE.Vector3()).copy( this.kinshipNode.position );
        let theta = Math.PI * 2 / this.kids.length;
        let i = 0;
        let x = 0, y = 0, z = 0;
        switch( type){
            case 'xz': 
                this.kids.forEach(kid => {
                    z = Math.sin( i * theta ) * R;
                    x = Math.cos( i * theta ) * R;
                    kid.position.set( x + pos.x,  pos.y, z + pos.z );
                    i += 1;
                });
                break;
            case 'xy':
                this.kids.forEach(kid => {
                    x = Math.sin( i * theta ) * R;
                    y = Math.cos( i * theta ) * R;
                    kid.position.set( x + pos.x, y + pos.y, pos.z );
                    i += 1;
                });
                break;
        }

        
        var links = new Array();
        this.kids.forEach(kid =>{
            
            let link = new KidKinshipNodeLink(this.kinshipNode, kid);
            links.push(link);
            //this.kinshipNode.add(link);
        })
        links.forEach(e => {
            this.kinshipNode.add(e);
        });
        
    }

    private calcParentsNodePos() : THREE.Vector3 {
        var mPos = (new THREE.Vector3()).copy( this.mother.position );
        var pos = new THREE.Vector3();
        pos.copy( (new THREE.Vector3()).copy( this.father.position ) );
        pos.add( mPos ).multiplyScalar(2).divideScalar(3);
        return pos;

    }

    private calcKinshipNodePos () : THREE.Vector3 {
        var pos = this.parentsNode.position.clone();
        let scale = Math.abs( 5 / pos.x );
        scale = scale > 3 ? 3: scale;
        var npos = new THREE.Vector3(pos.x * (1 + scale )  , pos.y + 10, pos.z * ( 1 +scale ) );
        console.log("kinshipNode pos:", npos,"  scale:", scale, " pos.z:",pos.z, " pos.x:",pos.x);
        return npos;
    }

}