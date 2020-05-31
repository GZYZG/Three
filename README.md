本项目是我的的本科毕设项目。  

目标：针对我设计的面向金丝猴社群的亲缘结构模型实现一个金丝猴社群可视化系统。

解决方案：基于three.js，以3D的形式展示金丝猴社群的亲缘关系。处理展示亲缘关系，还可以模拟金丝猴社会及其发展，能够模拟社会的演变和回退。

---
#### 一些关键概念：
- 时间区间
    > 分为亲缘关系和社会组成时间区间。  
    亲缘关系的显示由亲缘关系时间区间控制，只显示亲缘关系时间区间内产生的亲缘关系。社会组成的显示由社会组成时间区间控制，只显示社会组成时间区间内的社会组成。
- 社会组成
    > 包括六种类型的事件：进入社群（包括新生婴猴）、离开社群、迁移、死亡、主雄变更、新增单元。每种类型的发生时刻作为其所属的时刻。每种事件包含涉及该事件的个体。
- 亲缘关系
    > 父、母、子。
- 分身
    > 由于金丝猴存在迁移的现象，某只金丝猴在某个采样时刻可能属于单元1，在下一次采样时刻可能属于单元2。采用分身这个概念有以下几个原因：
    a) 体现金丝猴的迁移现象；
    b) 保留迁移个体在不同时刻所参与的事件，例如在时刻1，个体x与其他个体生成了亲缘关系，在时刻2迁移到其他单元，在时刻3由生成了亲缘关系。这个时候需要x在时刻1的分身表示其在时刻1产生的亲缘关系，需要时刻3的分身表示x在时刻3的产生的亲缘关系；
    同一个个体的分身会共享一些信息，如ID、name、genda、father、mother等，共享的信息主要是个体的一些静态信息，不会随时间改变。各个分身私有的信息包括归属单元、是否为分身的标识属性等。
- 真身
    > 在时刻t，个体x所属的单元中的分身即是x在时刻t的真身。
- 时间切片
    > 包含社会组成的六种类型的事件。时间切片是相邻时刻的社群的差异，即时刻t+1时刻的社群与t时刻的社群的差异。每个时刻都有对应的时间切片，时刻t+1的切片作用在时刻t的社群上，则社群会演变到时刻t+1。



#### 开发环境介绍：
- OS：win10
- IDE：vscode
- 包管理器：npm
- 3D引擎：three.js [three.js官网](https://threejs.org/)
- 实现技术：Typescript、JavaScript
- 前端用到的框架：Bootstrap4、Jquery
- 前端插件：[Bootstrap-slider](https://github.com/seiyria/bootstrap-slider)、[Bootstrap-select](https://developer.snapappointments.com/bootstrap-select/)、[Bootstrap-treeview](https://github.com/jonmiles/bootstrap-treeview)、[xlsx](https://github.com/SheetJS/sheetjs)