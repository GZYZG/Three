import { Monkey, Male, Female} from './monkey';
import { ParentsLink, KPNodeLink, KidKinshipNodeLink } from './LineFactory';
import * as THREE from 'three';
import { Colors } from 'three';
import { LineGeometry } from '../threelibs/LineGeometry';
import { LineMaterial } from '../threelibs/LineMaterial';
import { Line2 } from '../threelibs/Line2';
import { SHIP_NODE_RADIUS, calcParentsNodePos, calcKinshipNodePos, calcKidPos } from './basis';



export class KinshipNode extends THREE.Mesh {
    public kpNodeLink : KPNodeLink;
    //private _kids : Array<Monkey>;
    private _kids : Array<Monkey>;
    constructor () {
        super();
        this._kids = new Array<Monkey>();
        this.geometry = new THREE.SphereBufferGeometry(SHIP_NODE_RADIUS, 30, 30);
        this.material = new THREE.MeshLambertMaterial( { color: 0x000088, vertexColors: true, side: THREE.DoubleSide } );
    } 

    public get kids() {
        return this._kids;
    }

    public addKid( kid : Monkey ){
        this._kids.push( kid );
    }
}

export class ParentsNode extends THREE.Mesh {
    public father : Male;
    public mother : Female;
    constructor (father : Male, mother : Female) {
        super();
        this.father = father;
        this.mother = mother;
        this.geometry = new THREE.SphereBufferGeometry( SHIP_NODE_RADIUS, 30, 30);
        this.material = new THREE.MeshLambertMaterial( { color: 0x000088, vertexColors: true, side: THREE.DoubleSide } );
    }
}


export class Kinship extends THREE.Group {
    // 一个Kinship对象代表一对夫妇及其所生的所有孩子
    public father : Male;
    public mother : Female;
    public kids : Array<Monkey>;
    public kinshipNode : KinshipNode;
    public parentsLink : ParentsLink;
    public parentsNode : ParentsNode;
    public KPNodeLink : KPNodeLink;
    public kidLinks : Array<object>;

    constructor (father : Male, mother : Female, kids : Array<Monkey>, unitRadius : number = 30) {
        super();
        
        this.father = father;
        this.mother = mother;
        this.kids = new Array<Monkey>();
        
        
        this.addParentsLink();
        this.addParentsNode();
        this.addKinshipNode();

        this.addKPNodeLink();
        kids.forEach( kid => {
            this.kids.push(kid);
            this.addKid(kid);
        });
        this.addKidsKinshipLink();
    }
    
    

    public addParentsLink() {
        let link : ParentsLink;
        if( this.father.unit == this.mother.unit){
            link = new ParentsLink(this.father, this.mother, "curve" );
        }else{
            link = new ParentsLink(this.father, this.mother );
        }
        
        this.parentsLink = link;
        //console.log("parentsLink:", this.parentsLink );
        this.attach( this.parentsLink );
    }

    public addParentsNode() {
        
        this.parentsNode = new ParentsNode(this.father, this.mother);
        var pos =  calcParentsNodePos(this.father, this.mother) ;
        this.parentsNode.position.set( pos.x, pos.y, pos.z);
        this.attach(this.parentsNode);
        //console.log("parentsNode:", this.parentsNode );
    }

    public addKinshipNode() {
        this.kinshipNode = new KinshipNode();
        let pos = calcKinshipNodePos(this.parentsNode);
        this.kinshipNode.position.set(pos.x, pos.y, pos.z);
        this.attach(this.kinshipNode );
    }

    public addKPNodeLink() {
        this.KPNodeLink = new KPNodeLink(this.parentsNode, this.kinshipNode );
        this.attach(this.KPNodeLink);
        this.kinshipNode.kpNodeLink = this.KPNodeLink;
        console.log("KPNodeLink:", this.KPNodeLink);
    }

    public addKid( kid : Monkey ){
        // 当父母子均在同一单元时会重新计算孩子的位置
        this.kids.push( kid );
        this.kinshipNode.kids.push(kid);
        let pos = calcKidPos(this.kinshipNode, kid);
        kid.position.set(pos.x, pos.y, pos.z);
        this.kinshipNode.addKid(kid);
        
    }

    public addKidsKinshipLink(type="xz") {
        /*
            这里会涉及到孩子的位置的计算，孩子的位置是会受到其父母的单元归属及孩子的单元归属的影响的，情况分类如下：
            1、父母在同一个单元：
               1）子与父母在同一个单元
               2）子与父母不在同一个单元
            2、父母不在同一个单元：
                1）子与父在同一单元
                2）子与母在同一单元
                3）子在父、母之外的单元 
        */
        if( this.kids.length == 0) return;
        // 以下代码为计算孩子的位置
        // var R = 5;
        // var pos =  this.kinshipNode.position.clone();
        // let theta = Math.PI * 2 / this.kids.length;
        // let i = 0;
        // let x = 0, y = 0, z = 0;
        // this.kids.forEach(kid => {
        //     let pos = calcKidPos(this.kinshipNode, kid);
        //     //console.log("kid:", kid, " kid pos:", pos);
        //     kid.position.set(pos.x, pos.y, pos.z);
        //     this.kinshipNode.addKid(kid);
        // })
        
        // 创建孩子Monkey 与 KinshipNode的连接线
        this.kids.forEach(kid =>{
            let link = new KidKinshipNodeLink(this.kinshipNode, kid);
            this.kinshipNode.add(link);
            kid.kidKinshipLink = link;
            
        })
        // links.forEach(e => {
        //     this.kinshipNode.add(e);
        // });
        
    }

}