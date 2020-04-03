#### [Markdown 语法](https://www.runoob.com/markdown/md-tutorial.html)

### 1.Object3D对象的坐标问题
Object3D的position属性时相对坐标，指相对于父对象的坐标。若不进行设置，则为parent的坐标。
在group中，向group添加了多个对象后，若不对这些子对象的position进行设置，则会采用group的坐标。

### 2.关于div元素的 width、height 等相关问题
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

### 3. div是块级元素，默认实惠进行换行的，可以加上 white-space: nowrap; 设置不换行；

### 4. 坐标系的问题
> 屏幕坐标  <br>
> 世界坐标  <br>  

![](https://img-blog.csdn.net/20180904172030185?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXRhbWluZzE=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

### 5. bugs
1.Uncaught TypeError: Cannot read property 'boundingSphere' of undefined
> 问题出在renderer调用render函数时，scene的物体没有geometry。
---
2.This module is declared with using 'export =', and can only be used with a default import when using the 'esModuleInterop' flag.

```typescript 
//在导入jquery时出错，出错的导入方式是：
import $ from "jquery"
//正确的导入方式为：
import $ require("jquery")
```  
---
3.使用CSS2DObject、CSS2DRenderer 设置标签时，按照 threejs官网的[例子](https://github.com/mrdoob/three.js/blob/master/examples/css2d_label.html) 一直不能正确显示label。
>在官网的例子中，.label的样式为：
```typescript
labelRenderer.domElement.style.position = 'absolute';
//按照官网的方法，包含所有label的div一直不能正常显示，
//通过在浏览器中设置包含label的div的position为fixed即可正常显示
```
>解决label的显示问题后，会涉及到OrbitControl的问题，因为创建OrbitControl对象时需要传入一个renderer（渲染其他对象的主renderer或者labelRenderer）的domElement。这时需要将labelRenderer的domElement传入，否则无法使用OrbitControl，<b>绑定在主renderer上的事件也需要进行调整，否则无法监听到事件<b>！！！

参考：[Cannot read property 'boundingSphere' of undefined](https://stackoverflow.com/questions/51057266/cannot-read-property-boundingsphere-of-undefined)  


