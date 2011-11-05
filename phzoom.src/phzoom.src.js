/**
 * @name jQuery phZoom Plugin
 * @version 1.23 RC
 * @create 2011-7-10
 * @lastmodified 2011-11-05
 * @description Based on jQuery 1.4+
 * @author Phoetry (http://phoetry.me)
 * @url http://phoetry.me/archives/phzoom.html
 **/
~function($){var
/** 
 * @param $lay:遮罩层, $zoom:大图容器, phZoom:构造主函数
 * @param e:当前对象, x:插件设置项, y:当前index, z:对象集合
 **/
$w=$(window),$d=$(document),
$lay=$('<div id="ph_lay"/>'),
$zoom=$('<div id="ph_zoom"/>'),
$both=$lay.add($zoom),
phZoom=function(e,x,y,z){
	var that=this;
	this.opt=x;
	this.idx=y;
	this.all=z;
	this.len=z.length;
	// 当前e为对象集合末项时:false
	this.end=this.len>1+y;
	// 获取当前e的小图(返回jQuery)
	this.img=$('img:first',e);
	// 初始化当前e并绑定事件(返回DOM)
	this.lnk=e.addClass('phzoom').unbind('click').bind(this.imgFn())
		.append(this.hov=$('<span class="ph_hover"/>').hide())[0];
	// cap:大图底部的标题+索引+上/下一张(合体)
	this.cap=$('<div/>',{
		css:{color:x.capColor},
		id:'ph_cap',
		html:$([
			$('<span/>',{//标题
				id:'ph_txt',
				text:this.img[0].title||this.lnk.title||'No title'
			})[0],
			$('<span/>',{//索引
				id:'ph_idx',
				text:1+y+' / '+this.len
			})[0]
		])
	}).add(
	// nav:上/下一张
	this.nav=$('<div/>',{
		id:'ph_nav',
		css:{color:x.navColor},
		html:(y?'<span id="ph_prev">Prev</span>':'')
			+(this.end?'<span id="ph_next">Next</span>':'')
	}));
	// 点击页面上随便哪里都能退出(后面会排除大图区域)
	$both.click(function(){that.imgQuit()});
	// 尝试Fix IE6下hover可能错位的BUG(未完美)
	window.XMLHttpRequest||e.height(this.img.height());
};
/** 
 * prototype of phZoom function
 * @param B:new Image(), $B:B的jQuery对象
 **/
phZoom.prototype={
	// 当前对象绑定的事件
	imgFn:function(){
		var that=this,
			s=function(){
				return that.hov.not('.loading').stop(0,1);
			};
		return{
			mouseover:function(){s().fadeIn()},
			mouseout:function(){s().fadeOut()},
			click:function(){
				that.imgLoad();
				return false;
			}
		}
	},
	// 为之后动画准备一些必需品, A:小图(jQuery)
	imgPos:function(oriW,oriH){
		var A=this.img,
			pos=[
				oriW,oriH,A.width(),A.height(),
				A.offset().left,A.offset().top,
				$w.scrollLeft(),$w.scrollTop(),
				$w.width(),$w.height()
			];
		// 限宽模式下自动调整特大图
		this.opt.limitWidth&&pos[0]>pos[8]&&(
			pos[1]=pos[8]*pos[1]/pos[0],
			pos[0]=pos[8]
		);
		pos.push(
			(pos[8]-pos[2])/2+pos[6],
			(pos[9]-pos[3])/2+pos[7],
			(pos[8]-pos[0])/2+pos[6],
			(pos[9]-pos[1])/2+pos[7]
		);
		return pos;
	},
	// 开始加载大图
	imgLoad:function(){
		$lay.fadeTo(this.opt.layDur,this.opt.layOpacity);
		var that=this,B=new Image();
		this.hov.addClass('loading');
		B.className='zoomed';
		B.onload=function(){
			B.onload=null;
			// 如果此时已经退出大图, 则停止执行
			that.hov.is('.loading')&&(
			// resize之类的事件会影响文档尺寸, 故height一下
			$zoom.height($d.height())
				.show().append(B),
			that.imgAnim(B),
			that.preLoad()
			);
		};
		B.src=this.lnk.href;
	},
	// 大图执行两次动画, 动画完毕后绑定事件
	imgAnim:function(B){
		var that=this,$B=$(B),
			// 获取动画所需的尺寸与位置, 传参:大图的原始宽度和高度
			pos=this.imgPos(
				B.width||+$B.attr('width'),
				B.height||+$B.attr('height')
			),
			// 当前大图溢出Body宽度时:true
			oFlow=pos[0]>pos[8],
			// 预备好动画后需要绑定的事件
			eMon=(function(){
				return that.eMon(
					pos[8],pos[8]-pos[0],!oFlow,
					$('span',that.nav).hide(),$B
				);
			}());
		$B.after(this.cap.hide()).css({//定位1
			left:pos[4],top:pos[5],
			width:pos[2],height:pos[3]
		}).animate({//定位2, 动画1
			left:pos[10],top:pos[11]
		},that.opt.animDurA,function(){
			$B.animate({//定位3, 动画2
				left:pos[12],top:pos[13],
				width:pos[0],height:pos[1]
			},that.opt.animDurB,function(){//动画完
				that.hov.removeClass('loading');
				that.cap.css({//定位cap
					top:pos[1]+pos[13],
					left:oFlow?0:pos[12],
					width:oFlow?pos[8]:pos[0]
				}).fadeTo(300,.7);
				that.nav.css({//定位nav并绑定事件
					top:pos[1]/3+pos[13]
				}).bind(eMon);
				that.keyBind();
			}).bind(eMon);
		});
	},
	// 退出大图, bool为true时则化身为imgChange的过程(保持遮罩层)
	imgQuit:function(bool){
		this.hov.hide().is('.loading')?this.hov.removeClass('loading'):$d.unbind('.ph');
		$zoom.hide().empty();
		bool||$lay.fadeOut();
		return false;
	},
	// 切换上/下一张, 传参true给imgQuit
	imgChange:function(num){
		this.imgQuit(1);
		$('.ph_hover',$(this.all[this.idx+num]).click()).show();
		return false;
	},
	// 预加载相邻图片
	preLoad:function(){
		var x,y;
		this.idx&&(x=new Image(),x.src=this.all[this.idx-1].href,delete x);
		this.end&&(y=new Image(),y.src=this.all[this.idx+1].href,delete y);
	},
	// 绑定快捷键, 逃脱键:退出, 左箭头:上一张, 右箭头:下一张
	keyBind:function(){
		var that=this,k;
		$d.bind('keydown.ph',function(e){
			k=e.which;
			return 27===k?that.imgQuit()
				:39===k&&that.end?that.imgChange(1)
				:37===k&&that.idx?that.imgChange(-1)
				:true;
		});
	},
	// 大图加载完毕后需要绑定的事件
	eMon:function(a,b,bool,nav,$B){
		var that=this,i;
		return{
			click:function(e){
				e=e.pageX>a/2;
				return 1===that.len||(
					that.idx?that.end
					?that.imgChange(e||-1)
					:e||that.imgChange(-1)
					:!e||that.imgChange(1)
				);
			},
			mouseout:function(){nav.hide()},
			mousemove:function(e){
				e=e.pageX;i=e>a/2;
				e=e<a/3?0:e>2*a/3?b:b/2;
				that.idx?(
					nav.eq(i).show(),
					nav.eq(1-i).hide()
				):nav[i?'show':'hide']();
				bool||e===$B[0].offsetLeft||
				$B.not(':animated').animate({left:e},200);
			}
		}
	}
};
/** 
 * 直接扩展jQuery底层方法
 * @param x:插件设置项, y:当前index, z:对象集合
 **/
$.phzoom=function(z,x){
	if(!z.length)return;
	x=$.extend({
		layOpacity:.7,
		layDur:300,
		animDurA:300,
		animDurB:300,
		navColor:'#cf0',
		capColor:'#cf0',
		limitWidth:false
	},x);
	$('#ph_lay')[0]||
	$('body').append($both);
	return z.each(function(y){
		$('img',this)[0]&&new phZoom($(this),x,y,z);
	});
};
// 插件调用接口, hook me, 完毕.
$.fn.phzoom=function(x){
	return $.phzoom(this,x);
};
}(jQuery);