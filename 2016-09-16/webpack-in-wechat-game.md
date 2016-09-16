##webpack在微信游戏前端中的运用


### 工程化
微信游戏有前端吗？
有的，除了首页外，其他页面基本都是H5页面，主要分为平台页面和活动页面。

微信游戏有多少前端开发？多少业务呢？
人最多的时候也才9个前端（加上实习生），除去活动页面有多少页面（平台页面）呢？起码有30+，日常版本的也有10+，而且还有不断的新需求呀，还有几个运营系统需要开发维护，还有一直做不完的非标准活动。高效的工作流程成了迫切的需求。

经过一番改造后，只需要三个gulp命令来支撑。新流程爽的让大家不要不要的。

**初始化**   
<img src="http://iamaddy.github.io/img/webpack-in-wechat-game/0.png" height="100">

**开发**   
<img src="http://iamaddy.github.io/img/webpack-in-wechat-game/1.png" height="100">

**发布**   
<img src="http://iamaddy.github.io/img/webpack-in-wechat-game/2.png" height="300">

剩下的流程就是走发单系统，同步HTML文件到测试环境，测试完毕，则发布到外网。

**结果**：一个版本，从开发到发布，非开发时间大大缩减，不需要关心流程。以前一个页面（哪怕是改动小小的功能），非开发调试时间，保守估计都得花上**30分钟左右**在折腾环境，如今呢，**分分钟吧**。

新的流程到底是怎样的呢？

优化后的整体流程如下：   
<img src="http://iamaddy.github.io/img/webpack-in-wechat-game/8.png" height="300">

欲知详情，且听我慢慢道来。

###青铜时代
来到项目组的时候，对于当时前端的作业方式表示有点吃惊。从我以前的[这篇文章](http://km.oa.com/articles/view/235734)看来，之前项目已经基本达到工程化的目的，无论是模块化还是自动化基本满足了高效开发部署的需要。而现在，从黄金时代一下子回到青铜时代，有点无所适从。前端流程如下：   
<img src="http://iamaddy.github.io/img/webpack-in-wechat-game/9.png" height="100">

以前的流程有以下槽点：
- config文件（又臭又长）需要人工维护，每新增一个文件，需要**手动**添加配置
- 统一在开发机构建，每个人都在消耗开发机的资源，不可控因素多，**慢、不稳定**等等
- release后的文件没有hash化，每次都得**手动**修改html引用
- 模块化很粗暴，都挂靠在window对象上
- 代码分块很难做
- 发布繁琐，需要在开发机敲命令提交svn，然后在编译机svn up，然后再同步测试环境……
- 因为合并后的文件在开发机，fiddler本地代理无从谈起。

总之来说这样的开发流程很蛋疼。个人强烈建议不要在服务器上统一构建，除非构建系统做的相当快速、稳定，否则这将耗费所有人大量的精力与时间，而且效率低下。

工程化的首要目的就是要打造**好的开发体验**，提高开发效率。基于以前的经验，总结出以下几点可以改善体验的地方：

- **几乎不需要人工维护配置文件**
- 发布文件名全部 md5 版本化，**支持自动化发布**
- 支持多种模块化策略
- **自动替换 html/js 内部资源引用路径**，替换为 cdn 路径
- 支持 js/css资源内嵌到页面
- 随时且能够简单切换开发和发布模式

但之前的开发流程一点都没做到，体验不好，那就需要动刀子改。

那如何选型？

### 构建工具
由于之前已经有了FIS的实践经验和研究，可以轻车熟路的把脚手架搭建起来。但是还是有以下几点感觉到不爽：
- 配置文件又臭又长，晦涩难懂，而且部分需要人工维护
- 模块化加载依赖seajs，感觉冗余
- 资源文件分包不灵活，需要人工配置

那么在组内的一番讨论，有选gulp的，有选grunt的，也有fis，当然还有webpack。最终的方案是gulp+webpack。
#### webpack
为模块而生。如果对webpack陌生，我觉得可以直接看看[官网](https://webpack.github.io/)了解，一张图也足以说明到底能够做什么：   
<img src="http://iamaddy.github.io/img/webpack-in-wechat-game/10.png" height="150">
>一切皆模块

**第一点，webpack很好的解决了我们模块化/组件化的需求。**
```
// moduleA
var tpl = require('html!../tpl/topic.html');
var css = require('css!../css/index.css');

var img = document.createElement('img');
img.src = require('../img/example.png');


// more

module.exports = {
	...
}
```
四种资源都能够灵活的被require，可以满足组件化的需求，模块化/组件化的目的：**复用、可维护**。

**第二点，webpack支持同步和异步。**
```
// 同步
require('moduleA');
// 异步
require.ensure([], function () {
   	var ModuleB = require('moduleB');
});
```
webpack的模块加载原理很简单，**为每个模块编号，放入数组中**
```
/* 0 */
/***/ function(module, exports, __webpack_require__) {
__webpack_require__(1);
__webpack_require__(2);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(7);
module.exports = __webpack_require__(5);
/***/ },
```
这是webpack编译之后的代码，\__webpack_require__替换了原来的require，而模块名已经变成了数组序号。

异步的原理也很简单：

```
// more

script.src = __webpack_require__.p + "" + chunkId + "../test/js/" + ({"1":"index"}[chunkId]||chunkId) + ".js";
head.appendChild(script);
```
这是异步模块的src路径，webpack构建后生成的，最终通过appendChild方法将script异步加载。(`__webpack_require__.p`为CDN的根路径）
```
 __webpack_require__.e/* nsure */(1, function(require){
var Video = __webpack_require__(17);
var btn = document.getElementById('j_video_div');
// ....
```
上面是编译后的代码，`__webpack_require__.e`是异步加载的function，1表示chunkid，被分割出来的代码块的名称（1_chunk.js）。   
<img src="http://iamaddy.github.io/img/webpack-in-wechat-game/6.jpg" height="100">   


发布之后   
<img src="http://iamaddy.github.io/img/webpack-in-wechat-game/7.png" height="100">   

当然我们可以拆分更多的代码块，这将有益于性能优化。简单灵活的做到模块化、按需加载，这简直就是利器。

现在可以为seajs/requirejs立起一块墓碑了。
####gulp
webpack可以压缩，可以md5化脚本、可以做许多工程化的事情。

为什么用了webpack还要gulp？理由是gulp比webpack更擅长完成构建任务（task），而个人认为webpack在模块化代码分块方面更加擅长。因为构建不只是模块化而已，HTML还要内嵌资源，还要自动发布脚本，还要监听上传等等。


编写gulp插件以支持我们的工程化任务，下图是我们的工程流，每个方块都是gulp的一个task：   
<img src="http://iamaddy.github.io/img/webpack-in-wechat-game/11.png" height="180">   
以上是我们发布的流程，只要在项目的根路径下执行命令`gulp release`。
当然，还有一个`gulp watch`命令对于开发的流程：      
<img src="http://iamaddy.github.io/img/webpack-in-wechat-game/12.png" height="100">   
那么基本只要这两个命令即可满足开发工程化的需要。当然在没有项目的时候也有一个命令，`gulp init -p projectName`，初始化一个项目，所有的配置都初始化好，脚手架搭建好了，剩下的就是开开心心的去撸代码。

在完成gulp的task时，我们也自定义了一些插件：
#####内嵌资源插件
内嵌资源的场景：
- 页面本身的代码量不是很多，可以考虑内嵌。
- CGI请求提前，可以单独内嵌ajax请求代码到html头部。

内嵌资源的实现借鉴了fis，如果有资源url含`?__inline`查询参数，则把资源内嵌到页面。
```
<link rel="styleSheet" href="../css/index.css?__inline" />
<script src="../js/index.js?__inline"></script>
```



#### 项目目录
在这里有必要说下项目的目录：

```
src/
	js/
	widget/
	css/
	img/
	project_tpl/
	gulpfile.js
	app/
		js/
		css/
		img/
		index.html
		tpl/
		webpack.config.js
		gulpfile.js
app/
```		 
- src是整个源代码，src/app/为一个项目，为了尽量避免冲突，尽量少的人开发并维护一个项目下的代码。

- project_tpl为项目模板，通过gulp init新建项目，完成一些初始化配置。

- js/css/img为站点的一些公共资源模块，widget为公共基础组件。

- app项目下为业务的css、js、html模板目录

- gulpfile.js、webpack.config.js 为配置文件，初始化项目的时候已经生成。

现在一个项目的资源都在一起，原来的项目结构是html和js分离，所有js在一起。我想弊端不言而喻。
<img src="http://iamaddy.github.io/img/webpack-in-wechat-game/5.png" height="200">


目录结构清晰，项目本身的扩展性也强，我们可以灵活引入别人项目的组件。借助现有的基础组件和轮子，完成一个新的需求可节省大量时间。

### 优化结果

2016-01-02 至 2016-06-13，html模块共**248**条发布记录。

**开发**

开发，包括维护配置文件的时间，构建工具的耗时，代码可维护性等等，保守估计新的流程要比原来的要节省20分钟/每版本，**20 * 248  = 4960 min**。

**测试**

fixed bug平均需要5次同步流程，非开发时间比以前要节省1分钟/每次，那就是**5 * 1 * 248  = 1240 min 。**

**发布**
由于html和js是两个独立的模块，优化前需要单独发JS模块，优化后自动发可省去这部分时间。从测试完成到发布需要多少时间呢？

保守估计20min（开发机构建，修改引用，提交svn，同步，发布系统灰度，正式发布）。

**节省 20 * 248 = 4960 min。**
这里还不算上版本上线时出现问题，重新fixed的时间基本跟新发布一样，压根无法做到快速修复。


 一共节省**11160 min / 60 = 186 h，186 h / 8 = 23.25 d** ，差不多一个月的工时。

2015-06-01 至 2016-01-01， html模块共**160**条发布记录。后面的半年时间发单比优化前多了**88**单，**但开发人却比之前要少**，每个人的发单量增加了不少，得益于现在的工作流程。

### 总结

工程化，这几年在前端的出镜率很高了，主要是因为前端已经不在是几个简单脚本东拼西凑了。随着业务逐渐复杂，工程化也迫在眉睫。工程化应当贯彻项目的整个生命周期：开发、体验、测试、部署，做到让项目高效稳定的运作。



