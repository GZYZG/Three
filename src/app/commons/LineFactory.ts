import { LineGeometry} from '../threelibs/LineGeometry';
import { LineMaterial} from '../threelibs/LineMaterial';
import { Line2 } from '../threelibs/Line2';
import * as THREE from 'three';
import { Male, Female, Monkey } from './monkey';
import { ParentsNode, KinshipNode} from './Kinship';
import { Line } from '../threelibs/three';
import { LineSegments } from '../threelibs/three.module';
import { KID_SHIP_NODE_LINK_WIDTH, SHIP_PARENTS_NODE_LINK_WIDTH, PARENTS_LINK_WIDTH, calcMonkeyCommunityPos } from './basis';



export class ParentsLink extends Line2 {
    public father : Male;
    public mother : Female;

    constructor ( dad: Male, mom: Female, linkType:string="line"){
        super();
        this.father = dad;
        this.mother = mom;
        let geo ;
        switch( linkType){
            case "line" :
                geo = this.lineTypeGeometry();
                break;
            case "curve":
                console.log("curve parentslink");
                geo = this.curveTypeGeometry();
                break;
            default:
                geo = this.lineTypeGeometry();
                break;
        }

        var mat = new LineMaterial({
            linewidth: PARENTS_LINK_WIDTH, // in pixels
            vertexColors: true
        });
        mat.resolution.set(window.innerWidth, window.innerHeight);

        this.geometry = geo;
        this.material = mat;
        
    }

    public lineTypeGeometry() {
        var geo = new LineGeometry();
        const fp = calcMonkeyCommunityPos( this.father );
        const mp = calcMonkeyCommunityPos( this.mother );
        geo.setPositions(new Array(fp.x, fp.y, fp.z, mp.x, mp.y, mp.z ) );
        geo.setColors( new Array(  0, 0, 1, 0, 0, 1  ) );
        return geo;
    }

    public curveTypeGeometry() {
        var geo = new LineGeometry();
        let pos1 = calcMonkeyCommunityPos( this.father );
        let pos2 = calcMonkeyCommunityPos( this.mother );
        var mid = pos1.clone().add( pos2) .divideScalar(2);
        mid.setY(mid.y * 4 / 3 + 5);
        var curve = new THREE.CatmullRomCurve3([
            pos1, mid, pos2
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
        
        
        return geo;
    }



}

export class KPNodeLink extends Line2 {
    //public parentsLink : ParentsLink;
    public parentsNode : ParentsNode;
    public kinshipNode : KinshipNode;
    constructor (parentsNode : ParentsNode, kinshipNode : KinshipNode, type:string="curve" ) {
        super();

        this.kinshipNode = kinshipNode;
        this.parentsNode = parentsNode;
        var geo : any;
        switch( type){
            case "line" :
                geo = this.lineTypeGeometry();
                break;
            case "curve":
                geo = this.curveTypeGeometry();
                break;
            default:
                geo = this.curveTypeGeometry();
                break;
        }
        
        var mat = new LineMaterial({
            linewidth: SHIP_PARENTS_NODE_LINK_WIDTH, // in pixels
            vertexColors: true
        });
        mat.resolution.set(window.innerWidth, window.innerHeight);

        this.geometry = geo;
        this.material = mat;

        

    }

    public lineTypeGeometry() {
        var geo = new LineGeometry();
        const pn = this.parentsNode.position;
        const kn = this.kinshipNode.position;
        geo.setPositions(new Array(pn.x, pn.y, pn.z, kn.x, kn.y, kn.z ) );
        geo.setColors( new Array(  0, 0, 0, 1, 2, 3  ) );
        return geo;
    }

    public curveTypeGeometry() {
        var pos1 = this.parentsNode.position.clone();
        var pos2 = this.kinshipNode.position.clone();
        var mid = pos1.clone().add( pos2) .divideScalar(2);
        mid.setY(mid.y * 4 / 3);
        var curve = new THREE.CatmullRomCurve3([
            pos1, mid, pos2
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
        
        return geo;
    }
}

export class KidKinshipNodeLink extends Line2{
    public kinshipNode : KinshipNode;

    constructor( kinshipNode : KinshipNode, kid : Monkey ){
        super();
        this.geometry = geo;
        this.material = mat;
        this.kinshipNode = kinshipNode;
        var geo = new LineGeometry();
        // 将kid的不作为kinshipnode的子节点，所以要计算孩子的社群位置
        // let kn = calcMonkeyCommunityPos(kid);
        // kn.add( this.kinshipNode.position.clone().negate() );
        // 将孩子的分身以add的方法作为kinshipnode的子节点， 所以直接使用孩子的相对位置，即position
        let kn = kid.position;

        //console.log(pn, kn);
        //geo.setPositions(new Array(pn.x, pn.y, pn.z, kn.x, kn.y, kn.z ) );
        geo.setPositions(new Array(0, 0, 0, kn.x, kn.y, kn.z ) );
        geo.setColors( new Array(  0, 1, 0, 0, 1, 0  ) );
        var mat = new LineMaterial({
            linewidth: KID_SHIP_NODE_LINK_WIDTH, // in pixels
            vertexColors: true
        });
        mat.resolution.set(window.innerWidth, window.innerHeight);

        
        this.geometry = geo;
        this.material = mat;
    }
}
