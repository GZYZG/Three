import { Unit} from './Unit';
import { Monkey } from './monkey';

export class Frame {
    public id : number;
    public moment : Date;   // Frame 所属的时刻
    public nextFrame : Frame;
    public prevFrame : Frame;
    public newUnits : Array<object>;  // 新增单元
    public vanishUnits : Array<Unit>;   // 消失或者解散的单元
    public newMonkeys : Array<object>;  // 新进入社群的猴子，包括新出生的猴子，都需要进入某个单元
    public vanishMonkeys : Array<Monkey>;   // 从社群中消失的猴子，包括死亡的猴子，死亡或消失的猴子需要离开其所在单元
    public leaveUnit : Array<object>;   // 离开原来单元的猴子
    public enterUnit : Array<object>;   // 进入其他单元的猴子
    public inStage : Array<object>;     // 登上主雄位置的记录
    public step : Array<object>;        // 退下主雄位置的记录
    // public bornMonkeys : Array<Monkey>; // 新出生的猴子
    // public deadMonkeys : Array<Monkey>; // 死亡的猴子
    
    constructor() {
        
    }
}