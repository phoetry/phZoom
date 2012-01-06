/**
 * @name jQuery phZoom Plugin
 * @version 1.292 Final
 * @create 2011.7.10
 * @lastmodified 2012.1.6
 * @description Based on jQuery 1.4+
 * @author Phoetry (http://phoetry.me)
 * @url http://phoetry.me/archives/phzoom.html
 **/
~function($){var
/** 
 * @param LAY:遮罩层, ZOOM:大图容器, PHZOOM:构造主函数
 * @param e:当前对象, x:插件设置, y:当前index, z:对象集合
 **/
W=$(window),D=$(document),
LAY=$('<div id=ph_lay/>'),
ZOOM=$('<div id=ph_zoom/>'),
BOTH=LAY.add(ZOOM),
PHZOOM=function(e,x,y,z){
	this.opt=x;
	this.idx=y;
	this.all=z;
	this.len=z.length;
	// 当前e为对象集合末项时:false
	this.end=this.len>y+1;
	// 获取当前e的小图(返回jQuery)
	this.img=$('img:first',e);
	// 初始化当前e并绑定事件(返回DOM)
	this.lnk=e.addClass('phzoom').unbind('click').bind(this.imgFn())
		.append(this.hov=$('<span class=ph_hover/>').hide())[0];
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
				text:y+1+' / '+this.len
			})[0]
		])
	}).add(
	// nav:上/下一张
	this.nav=$('<div/>',{
		id:'ph_nav',
		css:{color:x.navColor},
		html:(y?'<span id=ph_prev>'+x.prevText+'</span>':'')
			+(this.end?'<span id=ph_next>'+x.nextText+'</span>':'')
	}));
	// 点击页面上随便哪里都能退出(后面会排除大图区域)
	BOTH.click($.proxy(this,'imgQuit'));
	// 尝试Fix IE6下hover可能错位的BUG
	window.XMLHttpRequest||e.height(this.img.height());
};
/** 
 * prototype of PHZOOM function
 * @param B:new Image, $B:B的jQuery对象
 **/
PHZOOM.prototype={
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
	// 为之后动画准备一些必需品, A:小图(jQuery), oW:大图原始宽度, oH:大图原始高度
	imgPos:function(oW,oH){
		var A=this.img,L=W.scrollLeft(),T=W.scrollTop(),
			pos=[
				W.width(),W.height(),
				A.width(),A.height(),
				A.offset().left,A.offset().top
			];
		// 限宽模式下自动调整特大图
		this.opt.limitWidth&&oW>pos[0]&&(oH=oH/oW*(oW=pos[0]));
		return pos.concat(
			oW,oH,
			(pos[0]-oW)/2+L,
			(pos[1]-oH)/2+T,
			(pos[0]-pos[2])/2+L,
			(pos[1]-pos[3])/2+T
		);
	},
	// 开始加载大图
	imgLoad:function(){
		LAY.fadeTo(this.opt.layDur,this.opt.layOpacity);
		var that=this,B=new Image;
		this.hov.addClass('loading');
		B.className='zoomed';
		B.onload=function(){
			B.onload=null;
			// 如果此时已经退出大图, 则停止执行
			that.hov.hasClass('loading')&&(
				// resize之类的事件会影响文档尺寸, 故height一下
				ZOOM.height(D.height()).append(B).show(),
				that.imgAnim(B),that.preLoad()
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
			oFlow=pos[0]<pos[6],
			// 预备好动画后需要绑定的事件
			E=this.evtMon($B,pos[0],pos[0]-pos[6],!oFlow);
		$B.after(this.cap.hide()).css({//定位1
			left:pos[4],top:pos[5],
			width:pos[2],height:pos[3]
		}).animate({//定位2, 动画1
			left:pos[10],top:pos[11]
		},this.opt.animDurA,function(){
			$B.animate({//定位3, 动画2
				left:pos[8],top:pos[9],
				width:pos[6],height:pos[7]
			},that.opt.animDurB,function(){//动画完
				that.hov.removeClass('loading');
				that.cap.css({//定位cap
					top:pos[7]+pos[9],
					left:oFlow?0:pos[8],
					width:oFlow?pos[0]:pos[6]
				}).fadeTo(300,.7);
				//定位nav并绑定鼠标事件
				that.nav.bind(E).css('top',pos[7]/3+pos[9]);
				//绑定快捷键
				that.keyBind();
			}).bind(E);
		});
	},
	// 退出大图, isQuit为undefined时化身为imgChange的过程(将保持遮罩层)
	imgQuit:function(isQuit){
		this.hov.hide().hasClass('loading')?this.hov.removeClass('loading'):D.unbind('.phzoom');
		isQuit&&LAY.fadeOut();
		ZOOM.hide().empty();
		return false;
	},
	// 切换上/下一张, 不传参给imgQuit
	imgChange:function(num){
		this.imgQuit();
		$('.ph_hover',$(this.all[this.idx+num]).click()).show();
		return false;
	},
	// 预加载相邻图片
	preLoad:function(x,y){
		this.idx&&(x=new Image,x.src=this.all[this.idx-1].href,delete x);
		this.end&&(y=new Image,y.src=this.all[this.idx+1].href,delete y);
	},
	// 绑定快捷键, 逃脱键:退出, 左箭头:上一张, 右箭头:下一张
	keyBind:function(){
		var that=this;
		D.bind('keydown.phzoom',function(e){
			e=e.which;
			return e==37&&that.idx?that.imgChange(-1):
				e==39&&that.end?that.imgChange(1):
				e^27||that.imgQuit(1)
		});
	},
	// 大图加载完毕后需要绑定的事件
	evtMon:function($B,a,b,c){
		var that=this,nav=$('span',this.nav).hide();
		return{
			click:function(e){
				return that.len<2||(
					e=e.pageX>a/2,
					that.idx?that.end
					?that.imgChange(e||-1)
					:e||that.imgChange(-1)
					:!e||that.imgChange(1)
				);
			},
			mouseout:function(){nav.hide()},
			mousemove:function(e,i){
				e=e.pageX,i=e>a/2;
				that.idx?(
					nav.eq(i).show(),
					nav.eq(1-i).hide()
				):nav[i?'show':'hide']();
				c||(e=e<a/3?0:e>a*2/3?b:b/2)==$B.position().left||
				$B.not(':animated').animate({left:e},200);
			}
		}
	}
};
/** 
 * 直接扩展jQuery底层方法
 * @param x:插件设置项, y:当前index, Z:初始传入的对象集合, z:过滤后的对象集合
 **/
$.phzoom=function(Z,x,z){
	x=$.extend({
		layOpacity:.7,
		layDur:300,
		animDurA:300,
		animDurB:300,
		navColor:'#cf0',
		capColor:'#cf0',
		prevText:'Prev',
		nextText:'Next',
		limitWidth:false,
		returnOrigin:true
	},x),
	(z=Z.has('img'))[0]&&(
		$('#ph_lay')[0]||
		$('body').append(BOTH),
		z.each(function(y,t){
			$.data(t,'phzoom',new PHZOOM($(t),x,y,z));
		})
	);
	return x.returnOrigin?Z:z;
};
// 插件调用接口, hook me, 完毕.
$.fn.phzoom=function(x){
	return $.phzoom(this,x);
};
function log(z){
	console.log({}.toString.call(z)+' | '+z);
}
}(jQuery);