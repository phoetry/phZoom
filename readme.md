# phZoom.js
### phZoom是一个小巧的jQuery看图灯箱插件
* 当前版本: 1.292 Final  
* 更新时间: 2012.1.6

### 使用方法
1. 加载jQuery库 (需**1.4+**)
2. 加载 `phZoom.css` , 请保证压缩包内的两张小图片与 `phzoom.css` 同级目录
3. 加载 `phzoom.js` , 请保证其加载于jQuery库之后
4. 调用接口: `$node.phzoom({/* 此处为设置选项, 可留空 */})`  
请将 `$node` 改为所需的jQuery选择器, 如: `$('#content a')`

### 设置选项
```js
{
	layOpacity:0.7,     // 遮罩层不透明度应为0到1之间的某个小数, 默认0.7即为70%不透明
	layDur:300,         // 遮罩层渐显的时间, 纯数字, 单位毫秒
	animDurA:300,       // 图片从原位飞到荧幕中间的时间, 纯数字, 单位毫秒
	animDurB:300,       // 图片从小到大的变化时间, 纯数字, 单位毫秒
	navColor:'#cf0',    // 上/下一张按钮的文本颜色, 需要引号
	capColor:'#cf0',    // 大图底部标题与索引的文本颜色, 需要引号
	prevText:'Prev',    // 上一张按钮的显示文本, 需要引号
	nextText:'Next',    // 下一张按钮的显示文本, 需要引号
	limitWidth:false,   // 默认为false, 大图使用原始宽度; 若设为true, 特大图将不会宽于窗口
	returnOrigin:true   // 默认为true, 此时返回初始对象集合; 若设为false, 则仅返回包含img元素的对象集合
}
```

如果你对这个插件感兴趣, 敬请关注:   
* * *
[On GitHub](https://github.com/phoetry/phZoom)
* * *
感谢你的支持与反馈 :)   
作者: [phoetry]
