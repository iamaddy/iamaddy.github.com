function Slider(opt){
		this.wrap 		= opt.wrap;
		this.default = {
			index: opt.index || 1,
			horizontal: typeof opt.horizontal !== 'undefined' ? !!opt.horizontal : 1,
			loop: typeof opt.loop !== 'undefined' ? !!opt.loop : 0,
			boundaryTimes: opt.boundaryTimes || 5,
			touchTime: opt.touchTime || 300,
			fastDistance: opt.fastDistance || 50
		};
		this.pannel 	= opt.wrap.getElementsByTagName('ul')[0];
		this.children 	= opt.wrap.getElementsByTagName('li');
		this.init();
	}
	Slider.prototype = {
		init: function(){
			this.initPannel();
			this.bind();
		},
		initPannel: function(){
			this.default.currIndex = this.default.index;
			this.winW = window.innerWidth;
			this.winH = window.innerHeight;

			this.wrap.style.width = this.winW + 'px';
			this.wrap.style.innerHeight = this.winH + 'px';
			this.pannel.style.width = (this.default.horizontal ? this.children.length : 1) * this.winW + 'px';

			for(var i = 0 ; i < this.children.length; i++){
				this.children[i].style.width = this.winW + 'px';
				this.children[i].style.height = this.winH + 'px';
				if(this.default.horizontal){
					this.children[i].className = 'float';
				}
			}
		},
		bind: function(){
			var self = this;

	        var startHandler = function(e){
	            e.preventDefault();
	            self.startTime = new Date() * 1;
	            self.startY = e.touches[0].pageY;
	            self.startX = e.touches[0].pageX;
	            self.offsetY = 0;
	            self.offsetX = 0;
	        };
 
	        var moveHandler = function(e){
	            e.preventDefault();
	            self.offsetY = e.targetTouches[0].pageY - self.startY;
	            self.offsetX = e.targetTouches[0].pageX - self.startX;

	            var offset = self.default.horizontal ? self.offsetX : self.offsetY;
	            self.pannel.style.webkitTransition = '-webkit-transform 0s ease';
	            self.setTransform(self.default.currIndex, offset);
	        };
 
	        var endHandler = function(e){
	            e.preventDefault();
	            // 边界距离 默认屏幕的五分之一
	            var boundary = (self.default.horizontal ? self.winW : self.winH) / self.default.boundaryTimes;
	            var endTime = new Date() * 1;

	            var offset = self.default.horizontal ? self.offsetX : self.offsetY;
	            if(endTime - self.startTime > self.default.touchTime){
	                if(offset >= boundary){
	                    self.goView('-1');
	                }else if(offset < 0 && offset < -boundary){
	                    self.goView('+1');
	                }else{
	                    self.goView('0');
	                }
	            }else{
	                if(offset > self.default.fastDistance){
	                    self.goView('-1');
	                }else if(offset < -self.default.fastDistance){
	                    self.goView('+1');
	                }else{
	                    self.goView('0');
	                }
	            }
	        };
 
	        //绑定事件
	        this.pannel.addEventListener('touchstart', startHandler);
	        this.pannel.addEventListener('touchmove', moveHandler);
	        this.pannel.addEventListener('touchend', endHandler);
	        window.addEventListener('resize', function(){
	        	self.initPannel();
	        });
	        window.addEventListener('orientationchange', function(){
	        	self.initPannel();
	        });
		},
		setTransform: function(currIndex, offset){
			var value = (1 - currIndex) * (this.default.horizontal ? this.winW : this.winH) + (offset || 0);
			console.log(value);
			this.pannel.style.webkitTransform = this.default.horizontal ? 'translate3d('+ value + 'px ,0 ,0)' : 'translate3d(0, '+ value + 'px ,0)';
		},
		goView: function(n){
	        var len = this.children.length,
	            currIndex;

	        //如果传数字之类可以使得直接滑动到该索引
	        if(typeof n === 'number'){
	            currIndex = n;
	        //如果是传字符则为索引的变化
	        }else if(typeof n === 'string'){
	            currIndex = this.default.currIndex + n * 1;
	        }
	        if(currIndex > len){
	            currIndex = this.default.loop ? 1 : len;
	        }else if(currIndex < 1){
	            currIndex = this.default.loop ? len : 1;
	        }

	        this.default.currIndex = currIndex;
	        this.pannel.style.webkitTransition = '-webkit-transform 0.2s ease';
	        this.setTransform(currIndex);
	    }
	};