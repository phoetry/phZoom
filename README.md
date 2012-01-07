# phZoom.js
* * *
#### phZoom是一个小巧的jQuery看图灯箱插件
* 更新时间: 2012.1.6  
* 当前版本: phZoom 1.292 Final  
* 查看Demo: http://phoetry.me/archives/phzoom.html

#### 使用方法
1. 加载jQuery库(需**1.4+**)
2. 加载 `phZoom.css` , 请保证压缩包内的两张小图片与 `phzoom.css` 同级目录
3. 加载 `phzoom.js` , 请保证其加载于jQuery库之后
4. 调用接口如下:

```js
	$node.phzoom({  
	// 此处为设置项, 亦可留空  
	});
```
请把 `$node` 改为所需的jQuery选择器, 如: `$('#content a')`

#### 设置选项
```js
{
	layOpacity:0.7,      // 遮罩层不透明度应为0到1之间的某个小数, 默认0.7即为70%不透明
	layDur:300,          // 遮罩层渐显的时间, 纯数字, 单位毫秒
	animDurA:300,        // 图片从原位飞到荧幕中间的时间, 纯数字, 单位毫秒
	animDurB:300,        // 图片从小到大的变化时间, 纯数字, 单位毫秒
	navColor:'#cf0',     // 上/下一张按钮的文本颜色, 需要引号
	capColor:'#cf0',     // 大图底部标题与索引的文本颜色, 需要引号
	prevText:'Prev',     // 上一张按钮的显示文本, 需要引号
	nextText:'Next',     // 下一张按钮的显示文本, 需要引号
	limitWidth:false,    // 默认为false, 大图使用原始宽度; 若设为true, 特大图将不会宽于窗口
	returnOrigin:true    // 默认为true, 此时返回初始对象集合; 若设为false, 则仅返回包含img元素的对象集合
}
```

#### 更新历史
2012.1.6 | 1.292 Final  
1. 继续强化pos数组, 提高其效率  
2. 调整了一些重要变量的命名  

2012.1.5 | 1.291 Final  
1. 修复IE(6|7|8)下无法创建小图hover的BUG  
2. 设置项 `returnOrigin` 现在可以完全正常工作了  

2012.1.2 | 1.29 Final  
1. 精简pos数组, 减少两个item  
2. 略微提升大图loading阶段的性能  
3. 希望1.30将是phZoom的第一个稳定版  

2011.12.22 | 1.28 Final  
1. 现在完全无需使用 :has(img) 选择器来调用phZoom了  
2. 新增设置项: `prevText` 和 `nextText`  
3. 新增设置项: `returnOrigin`  
4. 其它一些无关性能的细节改进  

2011.12.17 | 1.27 Final  
1. 修复当原图极大时可能溢出容器100%宽度的BUG  

2011.12.11 | 1.26 Final  
1. 修复IE(6|7|8)下导致新窗口打开的BUG  

2011.12.06 | 1.25 Final  
1. 使用 `jQuery.data` 缓存对象  
2. 一些命名调整与细节优化  
3. 终于正式版了  

2011.11.05 | 1.23 RC  
1. 修正某些页面大图无法居中的问题  
2. 中止载入后, 大图不会再自动弹出了  
3. 防止重复生成遮罩层与大图层  
4. 其它一些细节完善  

2011.10.18 | Beta 1.22  
1. 修复新版Chrome下无法正确读取缓存图片尺寸的BUG  
2. 精简掉几个变量与方法, 改用接力棒法传递参数  

2011.10.15 | Beta 1.21  
1. 修复IE6下Body高度过小时的遮罩层问题  

2011.09.28 | Beta 1.20  
0. 插件基本重写, 并追加了代码注释  
1. 加快图片载入速度, 提高插件执行效率  
2. 点击图片不再是单一的退出大图(自己体验)  
3. 上/下一张的操作变得相当自由了  
4. 遮罩层改用固定定位  
5. Firefox下不会卡了  
6. 对老版Opera作了兼容  
7. 去除了防迷路模式  

2011.07.15 | Beta 1.02  
1. 查看特大图超出荧幕部分时使用最小量动画  
2. 修复一个Opera下的神奇BUG  

2011.07.14  
1. 修复大图Caption为空时的BUG  
2. 现在大图展示更流畅了  
3. 更精确的大图层高度  

2011.07.13 | Beta 1.01  
1. 修复IE(6|7|8)下一个函数执行顺序的BUG  
2. 优化大图标题创建方式  
3. 预加载前一张与后一张

* * *

如果你对这个插件有兴趣, 敬请关注:  
[作者的博客](http://phoetry.me)  
[插件发布页](http://phoetry.me/archives/phzoom.html)  
[On GitHub](https://github.com/phoetry/phZoom)

* * *

感谢你的支持与反馈.  
作者: [Phoetry](http://phoetry.me)