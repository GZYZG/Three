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



### 科学公式 TeX(KaTeX)

$$E=mc^2$$

行内的公式$$E=mc^2$$行内的公式，行内的$$E=mc^2$$公式。

$$\(\sqrt{3x-1}+(1+x)^2\)$$
                    
$$\sin(\alpha)^{\theta}=\sum_{i=0}^{n}(x^i + \cos(f))$$

多行公式：

```math
\displaystyle
\left( \sum\_{k=1}^n a\_k b\_k \right)^2
\leq
\left( \sum\_{k=1}^n a\_k^2 \right)
\left( \sum\_{k=1}^n b\_k^2 \right)
```

```katex
\displaystyle 
    \frac{1}{
        \Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{
        \frac25 \pi}} = 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {
        1+\frac{e^{-6\pi}}
        {1+\frac{e^{-8\pi}}
         {1+\cdots} }
        } 
    }
```

```latex
f(x) = \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi
```

### 绘制流程图 Flowchart

```flow
st=>start: 用户登陆
op=>operation: 登陆操作
cond=>condition: 登陆成功 Yes or No?
e=>end: 进入后台

st->op->cond
cond(yes)->e
cond(no)->op
```

### 绘制序列图 Sequence Diagram

```seq
Andrew->China: Says Hello 
Note right of China: China thinks\nabout it 
China-->Andrew: How are you? 
Andrew->>China: I am good thanks!
```