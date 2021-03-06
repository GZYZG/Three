

目录
---
---
---
[TOC]
---
---


### 1.Object3D对象的坐标问题<span id="c1"></span>
Object3D的position属性时相对坐标，指相对于父对象的坐标。若不进行设置，则为parent的坐标。
在group中，向group添加了多个对象后，若不对这些子对象的position进行设置，则会采用group的坐标。

### 2.关于div元素的 width、height 等相关问题<span id="c2"></span>
先来了解了解一下css的盒子模型：
![css盒子模型](./src/assets/box_model.jpg)
>content: 最中间的 628.400 x 25.600 即是content，即可见区、盒子的内容;
>padding: 内边距，清除内容周围的区域，内边距是透明的;
>margin: 外边距，清除边框外的区域，外边距是透明的;
>border: 边框，围绕在内边距和内容外的边框;

参考资料：
- [JS中关于clientWidth offsetWidth scrollWidth 等的含义](https://www.cnblogs.com/fullhouse/archive/2012/01/16/2324131.html)
![](https://images.cnblogs.com/cnblogs_com/nianshi/0928300.gif)

**offsetWidth** = width + padding + border  
**offsetTop** = 元素的上border (border-top) 的外边缘到其上层元素的上border的内边缘的高度   
**offsetLeft** = 元素的左border (border-left) 的外边缘到其上层元素的左border的内边缘的宽度 

**clientWidth** = width + padding  
**clientTop** = 元素的上border (border-top) 的高度  
**clientLeft** = 元素的左border (border-left) 的高度  

**scrollWidth** = 可是区域宽度 + 被隐藏区域宽度  
**scrollTop** = 元素滚动条内被隐藏部分的高度    
**scrollLeft** = 元素滚动条内被隐藏部分的宽度   

### 3. DIV元素不换行方法<span id='c3'></span>
- div是块级元素，默认实惠进行换行的，可以加上 ```white-space: nowrap; ```设置不换行；
- 设置display属性，```display: inline;```;

### 4. 坐标系的问题<span id='c4'></span>
> 屏幕坐标  <br>
> 世界坐标  <br>  

![](https://img-blog.csdn.net/20180904172030185?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXRhbWluZzE=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

### 5. bugs<span id='c5'></span>
<font size=3><b>5.1.Uncaught TypeError: Cannot read property 'boundingSphere' of undefined</b></font>
> 问题出在renderer调用render函数时，scene的物体没有geometry。
参考：[Cannot read property 'boundingSphere' of undefined](https://stackoverflow.com/questions/51057266/cannot-read-property-boundingsphere-of-undefined)  

---
<font size=3><b>5.2.This module is declared with using 'export =', and can only be used with a default import when using the 'esModuleInterop' flag.</b></font>

```typescript 
//在导入jquery时出错，出错的导入方式是：
import $ from "jquery"
//正确的导入方式为：
import $ require("jquery")
```  
---
<font size=3><b>5.3.使用CSS2DObject、CSS2DRenderer 设置标签时，按照 threejs官网的[例子](https://github.com/mrdoob/three.js/blob/master/examples/css2d_label.html) 一直不能正确显示label。</b></font>
>在官网的例子中，.label的样式为：
```typescript
labelRenderer.domElement.style.position = 'absolute';
//按照官网的方法，包含所有label的div一直不能正常显示，
//通过在浏览器中设置包含label的div的position为fixed即可正常显示
```
>解决label的显示问题后，会涉及到OrbitControl的问题，因为创建OrbitControl对象时需要传入一个renderer（渲染其他对象的主renderer或者labelRenderer）的domElement。这时需要将labelRenderer的domElement传入，否则无法使用OrbitControl，<b>绑定在主renderer上的事件也需要进行调整，否则无法监听到事件</b>！！！
---
<font size=3><b>5.4.使多个单选框只有一个能被选中。在使用bootstrap4的 ```.custom-radio```单选框时，因为没注意radio的name属性，修改name后结果变成了可多选的！</b></font>
bug代码为：
```html
<div class="custom-control custom-radio custom-control-inline">
    <input type="radio" id="custom1" name="custom1" class="custom-control-input">
    <label class="custom-control-label" for="custom1">时间单位内的亲缘关系</label>
</div>
<div class="custom-control custom-radio custom-control-inline">
    <input type="radio" id="custom2" name="custom2" class="custom-control-input">
    <label class="custom-control-label" for="custom2">累积时间单位亲缘关系</label>
</div>
```
要解决这个bug只需<b>将需要单选的radio的name属性设置为相同的name</b>即可！

---


### 6.亲缘关系的显示<span id="c6"></span>
当处于时刻 t ，亲缘关系的显示可以分为两种情况：
**a)** 显示从其实时刻到 t 的累积亲缘关系；
**b)** 只显示时刻 t 的亲缘关系。
在以上两种情况中，需要注意的点有：
**a)** 不管以上是那种情况，都需要显示累积到 t 的社群的成员变动，只是根据情况选择 t 之前的亲缘关系是否显示；
**b)** 以上两种情况，从起始时刻到 t 的所有成员变动（进入社群、离开社群、死亡、出生、主雄的替换）都需要显示，只是亲缘关系（具体就是孩子结点）是否需要显示；


### 7. div的内容自动换行
```css
white-space:normal; word-break:break-all;overflow:hidden;
```

### 8. bootstrap4 中的collapse 组件
如果要使需要被折叠的元素每次只有一个显示，可以使这些元素有共同的data-parent。

### 9. 页面元素的样式设计准则：
    - 宽、高尽量用百分比设置
    - 尽量只设置内边距(padding)，不设置外边距(margin)。保证兄弟节点之间没有不可控的间隙出现
    - 使用内边距控制元素内容的显示
    - 设置内边距时（或外边距），尽可能通过控制padding[margin]- - - left、padding[margin]-top 来设置元素的显示位置
    - 使用padding来调节元素内的子元素的偏移，使用margin来调整元素与兄弟元素的偏移


### 10. TS中使用格式字符串
```
`${变量名|函数调用}`
```
eg:
```typescript
var name = "GZY";
console.log( `Hello! My name is ${name}.` );
```
使用 `` 包起来的字符串也可以进行拼接。

### 11. 预期输入数据格式
<b>猴子的数据</b>
每一个年份的数据都可以作为一张表格，每张表格里每一行都代表一只猴子在该年份的数据，每只猴子必须的属性如下：
- ID: 猴子的id，唯一，取值为数字或者字符串
- genda: 猴子的性别，取值为F或M, F为雌性，M为雄性
- name: 猴子的名字，为字符串，若无名字则为""
- ageLevel: 猴子在该年份的年龄阶段，取值为ADULT、YOUNG、JUVENILE
- father: 猴子的父亲，取值为父亲的ID，若不知道父亲，则为-1
- mother: 猴子的母亲，取值为母亲的ID，若不知道母亲，则为-1
- year: 观察时刻
- unit: 猴子在观察时刻的归属单元的ID
- dead: 猴子在year时是否死亡，若死亡则为T，否则为F或不填

>例如2011年的数据:  

|  ID   | genda  | name  | ageLevel  | father  | mother  | unit | year | dead |
|  ----  | ----  | ----  | ----  | ----  | ----  | --- | --- | ---- |
| H001  | F | monkey1 | JUVENILE | H002 | H003 | bzt | 2004 | F |
| H002  | M | monkey2 | ADULT | -1 | -1 | bzt | 2004 |  |
| H003  | F | monkey3 | ADULT | -1 | -1 | bzt | 2004 | T |

<b>单元的数据</b>
每一个年份的数据都可以作为一张表格，每张表格里每一行都代表一个单元在该年份的数据，每个单元必须的属性如下：

- ID: 单元的ID
- name: 单元的名字，若无则为""
- type: 单元类型，取值为OMU、AMU、FIU，分别对应家庭单元、全雄单元、其余单元
- adult: 单元诶成年个体的数量
- young: 单元内青年个体的数量
- juvenile: 单元内少年和幼年的个体的数量
- size: 家庭成员的个数，为数字
- mainMale: 单元的主雄的ID，只针对OMU，其他类型的单元的该属性为-1
-socialClass: 单元的社会等级，如果数据缺失则为-1
>例如2011年的数据:  

|  ID   | type  | name |  mainMale  | adult | young | juvenile |size  | year |
|  ----  | ----  | ----  | ----  | ---- | ---- | ---- | ---- | --- |
| bzt  | OMU | omu1 |  H002 | 4 | 5 | 6 |15 | 2004 |
| bb  | AMU | amu1 | -1 | 3 | 1 | 1 | 5 | 2004 |
| cc  | FIU | fiu1 | -1 | 3 | 1 | 0 | 4 | 2004 |

### 12. html元素显示层级
- **z-index** 仅能在定位元素上奏效（position属性值设置除默认值static以外的元素，包括relative，absolute，fixed样式）内
<br><br><br><br><br>  

---
###附录I &nbsp;Markdown语法参考<span id="markdown-reference"></span>
<font size=4><b>[Markdown 语法](https://www.runoob.com/markdown/md-tutorial.html)
[Markdown 数学公式语法](https://www.jianshu.com/p/e74eb43960a1)
[Markdown CSDN系列文章](https://blog.csdn.net/m0_37167788/category_7293588.html)
[Markdown 常用符号及排版](https://blog.csdn.net/u013914471/article/details/82973812?depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-2&utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-2)</b>
</font>