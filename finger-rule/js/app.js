function hasClass(e, c) {
    return e.className.match(new RegExp('(\\s|^)' + c + '(\\s|$)'));
}

function addClass(e, c) {
    if (!hasClass(e, c)) {
        e.className += " " + c;
    }
}
function removeClass(e, c) {
    if (hasClass(e, c)) {
        var reg = new RegExp('(\\s|^)' + c + '(\\s|$)');
        e.className = e.className.replace(reg, ' ');
    }
}

function $(id) {
	return document.getElementById(id);
}

var cache,
	canvas,
	ctx,
	cWidth = window.innerWidth,
	cHeight = window.innerHeight,
	radius = 5,
	x1, y1, x2, y2, flag;
			
	window.onload = function() {
		main();
		reOrient();
		
	}
	
    window.onorientationchange = function() {
        reOrient();
    };
	
	function main() {
		canvas = $("canvas");
		ctx = canvas.getContext("2d");
		canvas.ontouchstart = function(e) {
			ctx.clearRect(0, 0, cWidth, cHeight);  
			draw(e);
		}
		canvas.ontouchmove = function(e) {
			e.preventDefault();
			draw(e);
		};
		
		canvas.ontouchend = function(e) {
			if (e.targetTouches[0]) {
				flag = true;
				if (Math.abs(e.targetTouches[0].pageX - x2) <= 5 && Math.abs(e.targetTouches[0].pageY - y2) <= 5) {
					var t;
					t = x1;
					x1 = x2;
					x2 = t;
					t = y1;
					y1 = y2;
					y2 = t;
				}
			}
		}
		
		canvas.ongesturestart = function(e) {
			e.preventDefault();
		}
		canvas.ongesturechange = function(e) {
			e.preventDefault();
		}
		var tip = $("help_panel"),
			helpEle = $("help"),
			mark = $("help_panel_mark");
		helpEle.ontouchstart = function(e) {

			addClass(tip, "pZoom");
			removeClass(tip, "hide");
			addClass(tip, "show");
			removeClass(mark, "hide");
			addClass(mark, "show");
			removeClass(helpEle, "help_out");
			addClass(helpEle, "help_over");
		}
		
		helpEle.ontouchend = function(e) {
			removeClass(helpEle, "help_over");
			addClass(helpEle, "help_out");
		}
		
		
		tip.ontouchmove = function(e) {
			e.preventDefault();
		};
		
		mark.ontouchstart = function(e) {
			removeClass(tip, "pZoom");
			removeClass(tip, "show");
			addClass(tip, "hide");
			addClass(mark, "show");
			addClass(mark, "hide");
		}	
		
	}
		
	function draw(e) {
		
		
		if (e.targetTouches[1] || x2) {
			ctx.clearRect(0, 0, cWidth, cHeight);  
			ctx.beginPath();
			x1 = e.targetTouches[0].pageX;
			y1 = e.targetTouches[0].pageY;
			if (e.targetTouches[1]) {
				x2 = e.targetTouches[1].pageX;
				y2 = e.targetTouches[1].pageY;
			}
			
			ctx.arc(x1, y1, radius, 0, 2*Math.PI);  
			ctx.arc(x2, y2, radius, 0, 2*Math.PI);  
			ctx.fill();
			
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
			
		} else {
			x1 = e.targetTouches[0].pageX;
			y1 = e.targetTouches[0].pageY;
			if (!flag) {
				ctx.clearRect(0, 0, cWidth, cHeight);  
				ctx.beginPath();
				ctx.arc(x1, y1, radius, 0, 2*Math.PI);  
				ctx.fill();
			}
		}
		calc()
	}
	
	function calc() {
		if (x1 && x2 && y1 && y2) {
			var distance = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))
			$("result").innerHTML = Math.round(distance/63*100)/100 + "cm";
		}
	}
	
	function reOrient() {
		orientation = window.orientation;
		if (orientation == 90 || orientation == -90) {
			cWidth = window.innerWidth;
			cHeight = window.innerHeight;
			canvas.width = cWidth;
			canvas.height = cHeight; 
			toHori();
		} else {
			cWidth = window.innerWidth;
			cHeight = window.innerHeight;
			canvas.width = cWidth;
			canvas.height = cHeight;
			toVert();
		}
	}
	
	function toVert() {
		var bg = $("bg"),
			result = $("result"),
			help = $("help"),
			help_panel = $("help_panel");
		//removeClass(bg, "bg_hori");
		//addClass(bg, "bg_vert");
		removeClass(result, "result_hori");
		addClass(result, "result_vert");
		removeClass(help, "help_hori");
		addClass(help, "help_vert");
		removeClass(help_panel, "help_panel_hori");
		addClass(help_panel, "help_panel_vert");
	}
	
	function toHori() {
		var bg = $("bg"),
			result = $("result"),
			help = $("help"),
			help_panel = $("help_panel");
		//removeClass(bg, "bg_vert");
		//addClass(bg, "bg_hori");
		removeClass(result, "result_vert");
		addClass(result, "result_hori");
		removeClass(help, "help_vert");
		addClass(help, "help_hori");
		removeClass(help_panel, "help_panel_vert");
		addClass(help_panel, "help_panel_hori");
	}
	
	
    