import { Monkey, Male, Female} from './Monkey';
import { ParentsLink, KPNodeLink, KidKinshipNodeLink } from './LineFactory';
import * as THREE from 'three';
import { SHIP_NODE_RADIUS, calcParentsNodePos, calcKinshipNodePos, calcKidPos, cleanCache, MONKEY_COLOR } from '../utils/basis';

export class KinshipNode extends THREE.Mesh {
    public kpNodeLink : KPNodeLink;
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
        this.attach(kid);
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

    constructor (father : Male, mother : Female, kids : Array<Monkey>) {
        super();
        
        this.father = father;
        this.mother = mother;
        this.kids = new Array<Monkey>();
        kids.forEach(e => {
            this.addKid(e);
        })
        //this.kids = kids;
        
        this.parentsLink = null;
        this.parentsNode = null;
        this.kinshipNode = null;
        this.KPNodeLink = null;
        this.kidLinks = null;
        
    }
    
    public layout(){
        if(this.parentsLink != null){
            cleanCache( this.parentsLink);
            this.remove( this.parentsLink );
        }
        if( this.parentsNode != null){
            cleanCache( this.parentsNode );
            this.remove( this.parentsNode );
        }
        if( this.kinshipNode != null){
            cleanCache( this.kinshipNode );
            this.remove( this.kinshipNode );
        }
        if( this.KPNodeLink != null){
            cleanCache( this.KPNodeLink );
            this.remove( this.KPNodeLink );
        }
        if( this.kidLinks != null){
            this.kidLinks.forEach( link => {
                cleanCache(link);
                this.remove(link);
            });
        }
        this.addParentsLink();
        this.addParentsNode();
        this.addKinshipNode();

        this.addKPNodeLink();
        this.addKidsKinshipLink();
    }
    
    public addParentsLink() {
        let link : ParentsLink;
        if( this.father.unit != this.mother.unit || !this.father.isMainMale){
            link = new ParentsLink(this.father, this.mother, "curve" );
        }else{
            link = new ParentsLink(this.father, this.mother, "line" );
        }
        
        this.parentsLink = link;
        //console.log("parentsLink:", this.parentsLink );
        this.attach( this.parentsLink );
    }

    public addParentsNode() {
        this.parentsNode = new ParentsNode(this.father, this.mother );
        let pos;
        if( this.father.unit != this.mother.unit || !this.father.isMainMale){
            pos =  calcParentsNodePos(this.father, this.mother, "curve") ;
        }else{
            pos =  calcParentsNodePos(this.father, this.mother, "line") ;
        }
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
        //console.log("KPNodeLink:", this.KPNodeLink);
    }

    public addKid( kid : Monkey ){
        if(this.kids.filter( k => k.ID == kid.ID ).length > 0 ) return;
        kid.material.emissive.setHex( MONKEY_COLOR.CHILD );
        this.kids.push( kid );
    }

    public addKidsKinshipLink(type="xz") {
        if( this.kids.length == 0) return;
        this.kids.forEach( kid =>{
            this.kinshipNode.addKid(kid);
            let pos = calcKidPos(this.kinshipNode, kid);
            kid.position.set(pos.x, pos.y, pos.z);
        });
        // 创建孩子Monkey 与 KinshipNode的连接线
        this.kids.forEach(kid =>{
            let link = new KidKinshipNodeLink(this.kinshipNode, kid);
            this.kinshipNode.add(link);
            kid.kidKinshipLink = link;
            
        })
        
    }




    public maskKid(kidID: number){
        let tmp = this.kids.filter( e => e.ID == kidID);
        if( tmp.length == 0){

        } else{
            let kid = tmp[0];
            kid.visible = false;
            kid.kidKinshipLink.visible = false;
        }
        if( this.kids.filter( e => e.visible).length == 0 ){
            // 该kinship中的所有kid都不可见，则整个亲缘关系都不可见
            this.visible = false;
        }
    }

    public showKid(kidID: number){
        let tmp = this.kids.filter( e => e.ID == kidID);
        if( tmp.length == 0){
            
        } else {
            if( !this.visible){
                this.visible = true;
            }
            let kid  = tmp[0];
            kid.visible = true;
            kid.father.visible = true;
            kid.mother.visible = true;
            if(!kid.mother.unit.visible)    kid.mother.unit.visible = true;
            if(!kid.father.unit.visible)    kid.father.unit.visible = true;
            if( kid.kidKinshipLink)
                kid.kidKinshipLink.visible = true;
        }
        
    }

    public changeKidVisible(kidID: number, visible: boolean){
        // 如果该亲缘关系中无该孩子则直接返回
        if(this.kids.filter( e => e.ID == kidID).length == 0){
            return;
        }
        if( visible)    this.showKid(kidID)
        else    this.maskKid( kidID);
    }

}