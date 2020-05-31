import { Unit, OMU} from './Unit';
import { Monkey } from './Monkey';
import { GET_TICK } from '../utils/basis';

export class Frame {
    /**
     * 社群的时间切片
     */
    public ID : number;
    public tick : number;   // Frame 所属的时刻
    //public nextFrame : Frame;
    //public prevFrame : Frame;
    
    public vanished: {dead:Array<{monkey:Monkey, isMainMale: boolean} >, outCommu: Array<{monkey:Monkey, isMainMale: boolean}>};     //消失的猴子，包括进入死亡的和离开社群的猴子
    public newUnits : Array<Unit>;    // 新增单元
    public enterCommu: Array<{monkey:Monkey, unit:Unit}>;   // 进入社群的，包括第一次进入社群的猴子（非婴猴）、重返社群的猴子、新出生的猴子（婴猴）
    public challengeMainMale: Array<{unit:OMU, winner: Monkey, loser: Monkey}>;   // 挑战主雄成功
    public migrates: Array<{monkey: Monkey, originUnit: Unit, targetUnit: Unit}>;     // 在单元之间迁移的猴子
    public newKinships: Array<{kid: Monkey, parents:{dad:Monkey, mom:Monkey} }>;  // 新增的亲缘关系，包括婴猴的、首次入群找到父母的
    
    
    constructor(parameters:any) {
        let vanished = parameters.vanished || {dead:new Array<Monkey>(), outCommu: new Array<Monkey>()}
        let newUnits = parameters.newUnits || new Array<Unit>();
        let enterCommu = parameters.enterCommu ||  new Array<{monkey:Monkey, unit:Unit}>();
        let challengeMainMale = parameters.challengeMainMale || new Array<{unit:OMU, winner: Monkey, loser: Monkey}>();
        let migrates = parameters.migrates || new Array<{monkey: Monkey, originUnit: Unit, targetUnit: Unit}>();
        let newKinships = parameters.newKinships || new Array<{kid: Monkey, parents:{dad:Monkey, mom:Monkey} }>();
        let tick = parameters.tick || GET_TICK();

        this.tick = tick;
        this.vanished = vanished;
        this.newUnits = newUnits;
        this.enterCommu = enterCommu;
        this.challengeMainMale = challengeMainMale;
        this.migrates = migrates;
        this.newKinships = newKinships;
    }


}