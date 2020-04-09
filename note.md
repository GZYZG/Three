
---
[TOC]
---
##目录
>* [1. Object3D对象的坐标问题](#c1)
>* [2. 关于div元素的 width、height 等相关问题](#c2)
>* [3. DIV元素不换行的方法](#c3)
>* [4. 坐标系的问题](#c4)
>* [5. bugs](#c5)
>* [6. 亲缘关系的显示](#c6)
>* [附录I &nbsp;Markdown 语法参考](#markdown-reference)

### 1.Object3D对象的坐标问题<span id="c1"></span>
Object3D的position属性时相对坐标，指相对于父对象的坐标。若不进行设置，则为parent的坐标。
在group中，向group添加了多个对象后，若不对这些子对象的position进行设置，则会采用group的坐标。

### 2.关于div元素的 width、height 等相关问题<span id="c2"></span>
先来了解了解一下css的盒子模型：
![alt css盒子模型](http://img.smyhvae.com/2015-10-03-css-27.jpg)

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




<br><br><br><br><br>  

---
###附录I &nbsp;Markdown语法参考<span id="markdown-reference"></span>
<font size=4><b>[Markdown 语法](https://www.runoob.com/markdown/md-tutorial.html)
[Markdown 数学公式语法](https://www.jianshu.com/p/e74eb43960a1)
[Markdown CSDN系列文章](https://blog.csdn.net/m0_37167788/category_7293588.html)
[Markdown 常用符号及排版](https://blog.csdn.net/u013914471/article/details/82973812?depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-2&utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-2)</b>
</font>