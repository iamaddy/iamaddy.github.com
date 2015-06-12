var qApiSrc = {
	lower: "http://3gimg.qq.com/html5/js/qb.js",
	higher: "http://jsapi.qq.com/get?api=app.share"
},
	bLevel = {
		qq: {
			forbid: 0,
			lower: 1,
			higher: 2
		},
		uc: {
			forbid: 0,
			allow: 1
		}
	},
	UA = navigator.appVersion,
	isqqBrowser = (UA.split("MQQBrowser/").length > 1) ? bLevel.qq.higher : bLevel.qq.forbid,
	isucBrowser = (UA.split("UCBrowser/").length > 1) ? bLevel.uc.allow : bLevel.uc.forbid,
	version = {
		uc: "",
		qq: ""
	},
	platform_os, shareBasePath = "http://mjs.sinaimg.cn/wap/module/share/201504071745/",
	localhref = window.location.href,
	cur_domain = localhref.split("//")[1].split("/")[0].split(".")[0],
	isWeixin = false;
window.ishare = true;
if (typeof(__docConfig) == "undefined" || !window.__docConfig) {
	window.__docConfig = {
		__domain: cur_domain,
		__docId: "",
		__docUrl: localhref.split("?")[0],
		__cmntId: "",
		__cmntTotal: 0,
		__isGetUserInfo: "",
		__surveyId: "",
		__flvId: "",
		__mainPic: "",
		__cmntListUrl: "",
		__gspsId: "",
		__tj_ch: "news"
	}
}
if (typeof(__userConfig__) == "undefined" || !window.__userConfig__) {
	window.__userConfig__ = {
		__uid: "",
		__unick: "",
		__uface: "",
		__isLogin: false
	}
}
if (typeof(readConfig) == "undefined" || !window.readConfig) {
	window.readConfig = {
		isArt: true,
		share: {
			sharenum: 0,
			hotnum: 10000,
			imgid: "j_ishare_pic",
			shorttitle: "",
			content: "",
			targeturl: "http://o.share.sina.cn/ajshare?vt=4",
			shareurl: localhref,
			isdoc: 0
		},
		originpic: ""
	}
}
cur_domain = __docConfig.__domain || cur_domain;

function MyShareClass() {
	var Y = {
		login: 0,
		platlist: 1,
		share: 2,
		fade: 3
	},
		I = {
			sweibo: ["SinaWeibo", "新浪微博"],
			friend: ["WechatFriends", "微信好友"],
			fsircle: ["WechatTimeline", "微信朋友圈"]
		},
		F = {
			voteNum: 0,
			voteStatus: false,
			favorStatus: false
		},
		s = {
			isInit: false,
			isAdd: true
		},
		N = {
			contentRows: [4, 6],
			contentMax: 88,
			basePath: shareBasePath,
			cssPath: shareBasePath + "css/addShare.min.css",
			userInfoUrl: "http://interface.sina.cn/wap_api/wap_get_user_info.d.api?jsoncallback=",
			animate: ["platformShow", "sinaShow"],
			headimgsrc: "images/headimg.png",
			shareimgsrc: "http://u1.sinaimg.cn/upload/2014/12/08/101778.png"
		},
		M = {
			iTitle: "",
			iContent: "",
			iImgsrc: "",
			iUrl: "",
			iBackurl: "",
			isdoc: 0
		},
		v = {
			findClass: {
				shareIcon: "j_splat_ico",
				shareContentZone: "j_icontent",
				shareBtn: "j_shareBtn",
				platforms_big: "j_platforms_big",
				sinaShareContent: "j_sinaShareContent",
				praiseBtn: "j_vote_btn",
				submitBtn: "j_isunbmit",
				addFavor: "j_iadd_btn",
				sinaInfo: "sinaInfo",
				forbid: "forbid",
				opPraise: "op_praise "
			},
			findId: {
				sharefloat: "j_sharebox",
				floatCross: "j_sharecross",
				shareContentid: "j_ishare_content",
				sharetitle: "j_shareTitle",
				sharecnum: "j_ishare_num",
				spicid: "j_ishare_pic",
				userInfo: "j_sinaInfo",
				userName: "j_user_name",
				userImg: "j_user_img",
				shareImg: "j_ishare_img",
				insertDom: ["j_com_pics_op", "j_com_art_op"]
			}
		},
		aa = {
			iweibo: "kSinaWeibo",
			ifriend: "kWeixin",
			ifcircle: "kWeixinFriend",
			asweibo: "SinaWeibo",
			afriend: "WechatFriends",
			afcircle: "WechatTimeline"
		},
		f, i = this,
		a = (typeof(WapLogin) == "function") ? (new WapLogin()) : this;
	personal_url = "http://my.sina.cn/?vt=4", _fromPlat = {
		qqfriend: "qqfriend",
		qqweichat: "qqweichat",
		ucfriend: "ucfriend",
		ucweichat: "ucweichat"
	}, _frompre = readConfig.share.shareurl.indexOf("?") >= 0 ? "&" : "?", _shareDocUrl = __docConfig.__gspsId ? "http://doc.sina.cn/?id=" + __docConfig.__gspsId : __docConfig.__docUrl;

	function j(ae, ah, af, ab, ac) {
		if (isucBrowser) {
			var ad = {
				getTop: function(ak) {
					var al = ak.offsetTop;
					if (ak.offsetParent != null) {
						al += ad.getTop(ak.offsetParent)
					}
					return al
				},
				getLeft: function(ak) {
					var al = ak.offsetLeft;
					if (ak.offsetParent != null) {
						al += ad.getLeft(ak.offsetParent)
					}
					return al
				},
				getCss3offsetTop: function(am) {
					var ak = getComputedStyle(am, null).webkitTransform;
					if (ak == "none") {
						var al = 0
					} else {
						var al = parseInt(ak.split(",")[5].replace(")", ""))
					}
					if (am.parentNode.tagName != "BODY") {
						al += ad.getCss3offsetTop(am.parentNode)
					}
					return al
				},
				getCss3offsetLeft: function(am) {
					var al = getComputedStyle(am, null).webkitTransform;
					if (al == "none") {
						var ak = 0
					} else {
						var ak = parseInt(al.split(",")[4])
					}
					if (am.parentNode.tagName != "BODY") {
						ak += ad.getCss3offsetLeft(am.parentNode)
					}
					return ak
				},
				getNodeInfoById: function(al) {
					var ak = document.getElementById(al);
					if (ak) {
						var am = [ad.getLeft(ak) + ad.getCss3offsetLeft(ak), ad.getTop(ak) + ad.getCss3offsetTop(ak), ak.offsetWidth, ak.offsetHeight];
						return (am)
					} else {
						return ""
					}
				}
			};
			if (typeof(ucweb) != "undefined") {
				var ai = ucweb.startRequest("shell.page_share", [ah, af, ab, ac, "", "我们正在看【" + ah + "】，一起来看吧", ad.getNodeInfoById(ae)])
			} else {
				if (typeof(ucbrowser) != "undefined") {
					if (ac == I.sweibo[0]) {
						ac = aa.iweibo
					} else {
						if (ac == I.friend[0]) {
							ac = aa.ifriend;
							ab += _frompre + "from=" + _fromPlat.ucfriend
						} else {
							if (ac == I.fsircle[0]) {
								ac = aa.ifcircle;
								ab += _frompre + "from=" + _fromPlat.ucweichat
							}
						}
					}
					ucbrowser.web_share(ah, af, ab, ac, "", "@手机新浪网", ae)
				} else {}
			}
		} else {
			if (isqqBrowser && !isWeixin) {
				if (ac == I.friend[0]) {
					ac = 1;
					ab += _frompre + "from=" + _fromPlat.qqfriend
				} else {
					if (ac == I.fsircle[0]) {
						ac = 8;
						ab += _frompre + "from=" + _fromPlat.qqweichat
					} else {
						ac = ""
					}
				}
				var ag = {
					url: ab,
					title: ah,
					description: af,
					img_url: M.iImgsrc,
					img_title: ah,
					to_app: ac,
					cus_txt: "请输入此时此刻想要分享的内容"
				},
					aj = -1;
				if (typeof(browser) != "undefined") {
					if (typeof(browser.app) != "undefined" && isqqBrowser == bLevel.qq.higher) {
						aj = browser.app.share(ag)
					}
				} else {
					if (typeof(window.qb) != "undefined" && isqqBrowser == bLevel.qq.lower) {
						window.qb.share(ag)
					} else {}
				}
			} else {}
		}
		m(Y.fade);
		return
	}
	this.login = function(ab, af, ac, ad) {
		var ae = arguments.length;
		if (window.SINA_OUTLOGIN_LAYER && !ab) {
			f = window.SINA_OUTLOGIN_LAYER;
			f.set("sso", {
				entry: "wapsso"
			}).init();
			f.show();
			f.register("login_success", function(ag) {
				i.updateUserInfo(ag);
				switch (ae) {
				case 2:
					af();
					break;
				case 3:
					af(ac);
					break;
				case 4:
					af(ac, ad);
					break;
				default:
					window.location.href = window.location.href;
					break
				}
			});
			f.register("layer_hide", function() {
				if (typeof(af) != "undefined") {
					af = null
				}
			})
		}
		return
	};
	this.updateUserInfo = function(ab) {
		if (typeof(ab) != "undefined" && typeof(ab.nick) != "undefined") {
			if (typeof(__userConfig__) == "undefined" || !window.__userConfig__) {
				window.__userConfig__ = {}
			}
			__userConfig__.__isLogin = true;
			__userConfig__.__unick = ab.nick;
			__userConfig__.__uface = ab.portrait;
			__userConfig__.__uid = ab.uid;
			if (!window.globalConfig || typeof(globalConfig) != "undefined") {
				globalConfig = {}
			}
			globalConfig.isLogin = true;
			if ($("#loginImg").find("img").length > 0) {
				$("#loginImg").find("img").attr("src", portrait)
			}
			return
		}
	};

	function O() {
		var ab = readConfig.share.targeturl,
			ac = "",
			ai = __docConfig.__tj_ch ? __docConfig.__tj_ch : "news";
		if ( !! ab == false) {
			return false
		}
		if (ab.indexOf("?") == -1) {
			ab = ab + "?"
		}
		var ak = parseInt(new Date().getTime() / 1000),
			ad = ak + "85e47ac07ac9d6416" + __userConfig__.__uid,
			ah = hex_md5(ad),
			aj = encodeURIComponent(M.iTitle),
			ag = encodeURIComponent(M.iContent),
			ae = encodeURIComponent(M.iImgsrc),
			af = encodeURIComponent(M.iUrl);
		ac = ab + "&csrftime=" + ak + "&csrfcode=" + ah + "&title=" + aj + "&content=" + ag + "&pic=" + ae + "&url=" + af + "&isdoc=" + M.isdoc + "&jsoncallback=shareCallback&tj_ch=" + ai;
		r(ac);
		m(Y.fade);
		return
	}
	window.shareCallback = function(ac) {
		var ab = "";
		switch (ac.code) {
		case -3:
			ab = "分享失败!";
			break;
		case -2:
			ab = "未登录!";
			break;
		case -1:
			ab = "请求非法！";
			break;
		case 1:
			ab = "分享成功！";
			break;
		default:
			ab = "未知状态码 " + ac.code;
			break
		}
		Z(ab, true);
		x("public_sinashare_success")
	};
	var E = null;

	function t() {
		var ab = [];
		if ($(".re_box").length < 1) {
			ab.push("<section>");
			ab.push('<div class="re_box">');
			ab.push('<div class="resault_f re_simple">收藏失败!</div>');
			ab.push('<div class="resault_f re_notice">');
			ab.push("<div>");
			ab.push("<p>您已收藏，请到个人中心查看</p>");
			ab.push("</div>");
			ab.push('<span class="re_cancel">知道了</span>');
			ab.push('<span class="re_ok" data-url="' + personal_url + '">去看看</span>');
			ab.push("</div>");
			ab.push("</div>");
			ab.push("</section>");
			$("body").append(ab.join(""));
			u()
		}
		return
	}
	function Z(ac, ab) {
		if ($(".re_box").length <= 0) {
			t()
		}
		if (E) {
			clearTimeout(E)
		}
		if ($(".resault_f").eq(0).hasClass("showFadeAnimate")) {
			$(".resault_f").eq(0).html("").hide().removeClass("showFadeAnimate")
		}
		if ($(".resault_f").eq(1).hasClass("showAnimate")) {
			$(".resault_f").eq(1).find("p").html("");
			$(".resault_f").eq(1).hide().removeClass("showAnimate")
		}
		if (typeof(ab) == "undefined") {
			return
		} else {
			if (ab) {
				$(".resault_f").eq(0).show().html(ac).addClass("showFadeAnimate");
				E = setTimeout(function() {
					$(".resault_f").eq(0).html("").hide().removeClass("showFadeAnimate")
				}, 5000)
			} else {
				if (!ab) {
					$(".resault_f").eq(1).show().addClass("showAnimate").find("p").html(ac)
				}
			}
		}
	}
	function u() {
		$(".re_cancel").each(function() {
			$(this).on("click", function() {
				Z()
			})
		});
		$(".re_ok").each(function() {
			$(this).on("click", function() {
				Z();
				window.location.href = $(this).data("url")
			})
		})
	}
	function d() {
		var ab = [],
			ad = 1,
			af = [],
			ae = [];
		var ac = __docConfig.__cmntTotal || 0;
		af.push(__docConfig.__cmntListUrl ? __docConfig.__cmntListUrl : "javascript:void(0)");
		af.push(ac > 10000 ? (parseInt(ac / 10000) + "万") : ac);
		ae.push(readConfig.originpic ? readConfig.originpic : "javascript:void(0)");
		if (readConfig.isArt) {
			ad = 1;
			if (isqqBrowser || isucBrowser) {
				ab.push('<div class="platforms_small">');
				ab.push("<ul>");
				ab.push('<li class="shareText"> 分享</li>');
				ab.push("<li>");
				ab.push("<ul>");
				ab.push("<li></li>");
				ab.push('<li><span class="' + v.findClass.shareIcon + ' splat_ico sina_samll" data-platform="' + I.sweibo[0] + '"  data-sudaclick="public_sinaweibo"></span></li>');
				ab.push('<li><span class="' + v.findClass.shareIcon + ' splat_ico friend_small" data-platform="' + I.friend[0] + '"  data-sudaclick="public_wechatfriends"></span></li>');
				ab.push('<li><span class="' + v.findClass.shareIcon + ' splat_ico fcircle_small" data-platform="' + I.fsircle[0] + '" data-sudaclick="public_wechattimeline"></span></li>');
				ab.push("<li></li>");
				ab.push("</ul>");
				ab.push("</li>");
				ab.push("</ul>");
				ab.push("</div>");
				ab.push('<div class="share_op">');
				ab.push("<ul>")
			} else {
				ab.push('<div class="share_op">');
				ab.push("<ul>");
				ab.push('<li><span class="share_ico art_share ' + v.findClass.shareBtn + '" data-sudaclick="public_new_share">分享</span></li>')
			}
			ab.push('<li><a href="' + af[0] + '" class="share_ico art_comment" data-sudaclick="public_comment">' + af[1] + "</a></li>");
			ab.push('<li><a class="share_ico op_praise art_praise" data-sudaclick="public_praise">赞</a></li>');
			ab.push('<li class="favor"><a class="share_ico art_collect ' + v.findClass.addFavor + '" href="javascript:void(0);"  data-sudaclick="public_favor">收藏</a></li>');
			ab.push("</ul>");
			ab.push("</div>")
		} else {
			ad = 0;
			ab.push("<ul >");
			ab.push('<li><a id="weibo_share" href="javascript:void(0);" class="share_ico pic_share ' + v.findClass.shareBtn + '" data-sudaclick="picShare">分享</a></li>');
			ab.push('<li><a id="comment" href="' + af[0] + '" class="share_ico pic_comment " data-sudaclick="public_comment">' + af[1] + "</a></li>");
			ab.push('<li><a id="updown" href="javascript:void(0);" class="share_ico op_praise pic_praise" data-sudaclick="public_praise">赞</a></li>');
			ab.push('<li><a id="down" href="' + ae[0] + '" class="share_ico pic_original" target="_blank" data-sudaclick="public_origin">原图</a></li>');
			ab.push("</ul>")
		}
		setTimeout(function() {
			$("#" + v.findId.insertDom[ad]).append(ab.join(""))
		}, 2000);
		return
	}
	function r(ac) {
		var ad = document.getElementsByTagName("head")[0],
			ab = document.createElement("script");
		ab.src = ac;
		ab.charset = "utf-8";
		ad.appendChild(ab)
	}
	function U() {
		if (typeof __pkeys != "undefined" && typeof __pValue != "undefined") {
			var ad = "http://data.api.sina.cn/api/count/count.php?act=",
				ae = __docConfig.__docUrl || localhref.split("?")[0] || "",
				ag = "&backurl=" + ae + "&tj_ch=" + cur_domain + "&ch=&type=1&pkey=" + __pkeys + "&p=" + __pValue + "&channel=" + cur_domain + "&jsonpcallback=",
				ac = ad + "show" + ag + "getPraise",
				ab = ad + "add&tj_type=praise" + ag + "addPraise",
				af = $("." + v.findClass.opPraise);
			if (af.length > 0) {
				af.data("url", ac).data("status", 0);
				r(ac)
			}
			af.each(function() {
				$(this).on("click tap", function() {
					Z();
					var ah = $(this);
					if (ah.hasClass("on") || ah.data("loading") == "yes") {
						return
					} else {
						$(this).data("url", ab).data("status", 1);
						r(ab)
					}
				})
			})
		}
	}
	window.getPraise = function(ac) {
		var ab = ac.count > 0 ? (ac.count > 10000 ? (parseInt(ac.count / 10000) + "万") : ac.count) : "赞";
		$("." + v.findClass.opPraise).html(ab).data("loading", "no");
		F.voteNum = ac.count
	};
	window.addPraise = function(ab) {
		if (ab.status == 0) {
			$("." + v.findClass.opPraise).each(function() {
				if ($("." + v.findClass.opPraise).data("loading") == "no") {
					var ac = ab.count > 0 ? (ab.count > 10000 ? (parseInt(ab.count / 10000) + "万") : ab.count) : "赞";
					$("." + v.findClass.opPraise).text(ac).addClass("on");
					F.voteNum = ab.count
				}
			})
		} else {}
	};

	function S() {
		$("." + v.findClass.addFavor).each(function() {
			D($(this), s.isInit);
			$(this).on("click tap", function() {
				Z();
				D($(this), s.isAdd)
			})
		})
	}
	function D(ah, ab) {
		if (typeof __colleid != "undefined" && typeof __collekey != "undefined") {
			var ae = sudaMapConfig.uid || "",
				ac = __docConfig.__gspsId || "",
				ag = __docConfig.__docUrl || localhref.split("?")[0] || "",
				ai = "",
				ab = (typeof(ab) != "undefined") ? (ab ? s.isAdd : s.isInit) : s.isAdd;
			if (__userConfig__.__isLogin) {
				if (ah.hasClass("on")) {
					if (ab && s.isAdd) {
						var af = "您已收藏，请到个人中心查看";
						Z(af, false)
					}
					return
				}
				if (!ab && !s.isInit) {
					ai = "&op=isFav&jsoncallback=initFavorCallback"
				} else {
					ai = "&tj_type=favor&jsoncallback=addFavorCallback"
				}
				var ad = "http://o.my.sina.cn/favorite?uid=" + ae + "&docid=" + ac + "&backurl=" + ag + "&tj_ch=" + cur_domain + "&ch=&csrftime=" + __colleid + "&csrfcode=" + __collekey + "&channel=" + cur_domain + ai;
				r(ad)
			} else {
				if (ab && s.isAdd) {
					m(Y.login, D, ah, true)
				}
			}
		}
	}
	window.addFavorCallback = function(ac) {
		var ad = $("." + v.findClass.addFavor).eq(0);
		ad.data("loading", "no");
		if (ac && ac.code == 1) {
			ad.addClass("on");
			ad.addClass("on").html("已收藏");
			var ab = "您已收藏，请到个人中心查看";
			Z(ab, false)
		} else {
			if (ac && ac.code == 2) {
				document.location.href = ac.data
			} else {
				var ab = "收藏失败!";
				Z(ab, true)
			}
		}
	};
	window.initFavorCallback = function(ab) {
		var ac = $("." + v.findClass.addFavor).eq(0);
		if (ab && ab.code == 1 && ab.data.id) {
			ac.addClass("on").html("已收藏")
		}
	};

	function J() {
		var ab = [],
			ac = [],
			ad = [];
		ad.push((N.contentMax - readConfig.share.content.length < 0) ? "notice" : "");
		ad.push(N.contentMax - readConfig.share.content.length);
		if (typeof(__userConfig__) != "undefined") {
			if (typeof(__userConfig__.__uface) != "undefined" && typeof(__userConfig__.__unick) != "undefined") {
				ac.push(__userConfig__.__uface ? __userConfig__.__uface : N.basePath + N.headimgsrc);
				ac.push(__userConfig__.__unick ? __userConfig__.__unick : "新浪用户")
			} else {
				ac.push(N.basePath + N.headimgsrc);
				ac.push("新浪用户")
			}
		} else {
			ac.push(N.basePath + N.headimgsrc);
			ac.push("新浪用户")
		}
		ab.push("<section>");
		ab.push('<div class="shareBg" id="' + v.findId.sharefloat + '">');
		ab.push('<div class="sharebox">');
		ab.push('<div class="float_cross fTitle" id="' + v.findId.floatCross + '" data-sudaclick="public_share_close"></div>');
		ab.push('<div class="shareTitle fTitle" id="' + v.findId.sharetitle + '">分享至微博</div>');
		ab.push('<div class="shareZone">');
		ab.push('<div class="platforms_big ' + v.findClass.platforms_big + '">');
		ab.push("<ul>");
		ab.push("<li>");
		ab.push('<span class="' + v.findClass.shareIcon + ' splat_ico sina_big" data-platform="' + I.sweibo[0] + '" data-sudaclick="public_sinaweibo"></span>');
		ab.push("<p>" + I.sweibo[1] + "</p>");
		ab.push("</li>");
		ab.push("<li>");
		ab.push('<span class="' + v.findClass.shareIcon + ' splat_ico friend_big" data-platform="' + I.friend[0] + '" data-sudaclick="public_wechatfriends"></span>');
		ab.push("<p>" + I.friend[1] + "</p>");
		ab.push("</li>");
		ab.push("<li>");
		ab.push('<span class="' + v.findClass.shareIcon + ' splat_ico fcircle_big" data-platform="' + I.fsircle[0] + '" data-sudaclick="public_wechattimeline"></span>');
		ab.push("<p>" + I.fsircle[1] + "</p>");
		ab.push("</li>");
		ab.push("</ul>");
		ab.push("</div>");
		ab.push('<div class="sinaShareContent ' + v.findClass.sinaShareContent + '">');
		ab.push('<div class="sinaInfo" id="' + v.findId.userInfo + '">');
		ab.push('<span class="user_img" id="' + v.findId.userImg + '">');
		ab.push('<img src="' + ac[0] + '"  style="width:100%;height:100%;"/>‘');
		ab.push("</span>");
		ab.push('<span class="user_name" id="' + v.findId.userName + '">' + ac[1] + "</span>");
		ab.push("</div>");
		ab.push('<div class="icontent ' + v.findClass.shareContentZone + '">');
		ab.push('<textarea class="ishare_content" id="' + v.findId.shareContentid + '">' + (readConfig.share.content ? readConfig.share.content : readConfig.share.shorttitle) + "</textarea>");
		ab.push('<span class="ishare_img">');
		ab.push('<img class="shareimg_style" src="' + (__docConfig.__mainPic ? __docConfig.__mainPic : N.shareimgsrc) + '" id="' + v.findId.shareImg + '" style="width:32px;height:32px"/>');
		ab.push("</span>");
		ab.push('<span class="ishare_num"><span class="  ' + ad[0] + '" id="' + v.findId.sharecnum + '">' + ad[1] + "</span>字</span>");
		ab.push("</div>");
		ab.push('<button class="isubmit ' + v.findClass.submitBtn + '" data-sudaclick="public_sinashare_submit">立即分享</button>');
		ab.push("</div>");
		ab.push("</div>");
		ab.push("</div>");
		ab.push("</div>");
		ab.push("</section>");
		$("body").append(ab.join(""));
		X();
		return
	}
	function X() {
		p();
		y();
		z(true);
		o();
		$(".shareBg").css("height", (q + 50) + "px")
	}
	function W() {
		if (document.all) {
			return window.event
		}
		func = W.caller;
		while (func != null) {
			var ab = func.arguments[0];
			if (ab) {
				if ((ab.constructor == Event || ab.constructor == MouseEvent) || (typeof(ab) == "object" && ab.preventDefault && ab.stopPropagation)) {
					return ab
				}
			}
			func = func.caller
		}
		return null
	}
	this.wantShare = function(ab) {
		if (ab) {
			V()
		}
		if ($(".shareBg").length <= 0) {
			J()
		}
		Z();
		if ((isqqBrowser > bLevel.qq.lower || isucBrowser) && !isWeixin) {
			m(Y.platlist)
		} else {
			C()
		}
	};

	function p() {
		$("." + v.findClass.shareIcon).on("click", function() {})
	}
	function b() {
		window.addEventListener("click", function(ad) {
			var af = ad.target || W().target,
				ae = V($(af));
			if (($(af).hasClass(v.findClass.shareBtn) || $(af).parents(".j_share_btn").length > 0 || $(af).parents("." + v.findClass.shareBtn).length > 0) && window.ishare) {
				K(ad);
				i.wantShare()
			} else {
				if ($(af).hasClass(v.findClass.shareIcon)) {
					if ($(".shareBg").length <= 0) {
						J()
					}
					Z();
					if (ae._platform == I.sweibo[0]) {
						C()
					} else {
						if (isucBrowser) {
							$("#j_comment_nav").hide();
							setTimeout(function() {
								j(ae._obj, ae._title, ae._content, localhref, ae._platform)
							}, 300);
							setTimeout(function() {
								$("#j_comment_nav").show()
							}, 600)
						} else {
							j(ae._obj, ae._title, ae._content, localhref, ae._platform)
						}
					}
				}
			}
			var ac = $("#ST_outLogin_mask"),
				ab = $("#j_sharebox");
			if (ac.length > 0 && ab.length > 0 && ab.css("display") != "none") {
				if (ac.css("display") != "none") {
					P(true)
				} else {
					if (ac.css("display") == "none") {
						P(false)
					}
				}
			}
		})
	}
	function P(ab) {
		if (ab) {
			$("#j_sharecross").hide()
		} else {
			$("#j_sharecross").show()
		}
	}
	function V(ab) {
		var ac = {
			_obj: v.findId.spicid,
			_title: readConfig.share.shorttitle ? readConfig.share.shorttitle : $("title").html(),
			_content: readConfig.share.content ? readConfig.share.content : $("title").html(),
			_url: _shareDocUrl ? _shareDocUrl : __docConfig.__docUrl,
			_platform: ab ? ab.data("platform") : ""
		};
		M.iTitle = ac._title;
		M.iContent = ac._content;
		M.iImgsrc = __docConfig.__mainPic ? __docConfig.__mainPic : ($("#" + ac._obj).attr("src") ? $("#" + ac._obj).attr("src") : N.shareimgsrc);
		M.iUrl = ac._url;
		M.iBackurl = ac._url;
		M.isdoc = readConfig.share.isdoc ? readConfig.share.isdoc : 0;
		return ac
	}
	function C() {
		var ab = N.contentMax - M.iContent.length;
		$("#" + v.findId.shareContentid).text(M.iContent);
		$("#" + v.findId.sharecnum).html(ab);
		if (ab < 0) {
			$("#" + v.findId.sharecnum).addClass("notice");
			$("." + v.findClass.submitBtn).addClass(v.findClass.forbid)
		} else {
			$("#" + v.findId.sharecnum).removeClass("notice");
			$("." + v.findClass.submitBtn).removeClass(v.findClass.forbid)
		}
		$("#" + v.findId.shareImg).attr("src", M.iImgsrc);
		m(Y.share)
	}
	function y() {
		$("#" + v.findId.floatCross).on("click ", function() {
			m(Y.fade)
		});
		return
	}
	var Q = "",
		q = document.documentElement.clientHeight;

	function z(ah) {
		var ai = $("." + v.findClass.sinaShareContent),
			ac = $("." + v.findClass.shareContentZone),
			ad = $("#" + v.findId.shareContentid),
			ae = $("." + v.findClass.sinaInfo),
			ag = $("#" + v.findId.sharefloat),
			af = $("#" + v.findId.sharecnum),
			aj = $("." + v.findClass.submitBtn);
		var ab = function() {
				if (ai.css("display") == "block") {
					var al = document.getElementById(v.findId.shareContentid).value,
						ak = N.contentMax - al.length;
					af.html(ak);
					if (ak < 0 || ak == N.contentMax) {
						af.addClass("notice");
						aj.addClass(v.findClass.forbid)
					} else {
						af.removeClass("notice");
						aj.removeClass(v.findClass.forbid)
					}
					M.iContent = al
				}
			};
		if (!ah) {
			ac.css({
				height: "140px"
			});
			ad.attr("rows", N.contentRows[1])
		} else {
			$("#" + v.findId.shareContentid).on("click tap", function() {
				var ak = ad.html();
				Z();
				ad.focus()
			}).on("keyup", ab).focus(function() {
				ac.css({
					height: "85px"
				});
				$(this).attr("rows", N.contentRows[0]);
				$(".sharebox").css({
					"margin-top": "40px"
				});
				$(".shareBg").css("height", (q + 50) + "px")
			}).blur(function() {
				$(this).attr("rows", N.contentRows[1]);
				$(".sharebox").css({
					"margin-top": "10px"
				});
				$(".shareBg").css("height", (q + 10) + "px")
			});
			document.addEventListener("touchend", ab, false)
		}
		return
	}
	function o() {
		$("." + v.findClass.submitBtn).each(function() {
			$(this).on("click", function() {
				Z();
				if (!$(this).hasClass(v.findClass.forbid)) {
					O()
				}
			})
		});
		return
	}
	var B = function(ab) {
			ab.preventDefault()
		};

	function w(ab) {
		var ac = document.body;
		if (ab) {
			$(document.body).css({
				overflow: "hidden",
				position: "absolute",
				top: "0px"
			})
		} else {
			$(document.body).css({
				overflow: "auto",
				position: "relative"
			})
		}
		return
	}
	var L = document.body.scrollTop,
		G = document.getElementsByName("viewport")[0],
		l = {
			hide: "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui",
			show: "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
		},
		c = false;

	function m(ac, ad, ab) {
		ac = ac ? ac : Y.login;
		switch (ac) {
		case Y.login:
			H(ad, ab);
			break;
		case Y.platlist:
			if (!c) {
				L = document.body.scrollTop
			}
			G.content = l.hide;
			setTimeout(function() {
				window.scrollTo(0, 1)
			}, 200);
			c = true;
			g(true);
			n(v.findId.sharefloat, true);
			A(v.findId.floatCross, true);
			A(v.findId.sharetitle, false);
			R("." + v.findClass.platforms_big, true, Y.platlist);
			R("." + v.findClass.sinaShareContent, false, Y.share);
			break;
		case Y.share:
			if (__userConfig__.__isLogin) {
				if (!c) {
					L = document.body.scrollTop
				}
				G.content = l.hide;
				setTimeout(function() {
					window.scrollTo(0, 1)
				}, 200);
				c = true;
				g(true);
				n(v.findId.sharefloat, true);
				A(v.findId.floatCross, true);
				A(v.findId.sharetitle, true);
				T();
				if ($("#j_user_img").find("img").attr("src") == window.location.href || $("#j_user_img").find("img").attr("src") == "") {
					h()
				}
				R("." + v.findClass.platforms_big, false, Y.platlist);
				R("." + v.findClass.sinaShareContent, true, Y.share)
			} else {
				e(__userConfig__.__isLogin, m, Y.share)
			}
			break;
		case Y.fade:
			G.content = l.show;
			g(false);
			n(v.findId.sharefloat, false);
			A(v.findId.floatCross, true);
			R("." + v.findClass.platforms_big, false, Y.platlist);
			R("." + v.findClass.sinaShareContent, false, Y.share);
			z(false);
			D($("." + v.findClass.addFavor), false);
			if (c) {
				document.body.scrollTop = L
			}
			c = false;
			break;
		default:
			break
		}
		return
	}
	function e(ab, ae, ac, ad) {
		if (!__userConfig__.__isLogin) {
			a.login(ab, ae, ac, ad)
		}
	}
	function K(ab) {
		if (ab && ab.preventDefault) {
			ab.preventDefault()
		} else {
			window.event.returnValue = false
		}
		return false
	}
	function g(ac) {
		var ad = $(document.body),
			ab = ad.children();
		for (var ae = 0; ae < ab.length; ae++) {
			if (ab[ae].tagName != "SCRIPT" && ab[ae].tagName != "NOSCRIPT" && $(ab[ae]).find(".shareBg").length <= 0) {
				if (ac && $(ab[ae]).css("display") != "none") {
					$(ab[ae]).data("show", "show");
					$(ab[ae]).hide()
				} else {
					if (!ac) {
						if ($(ab[ae]).data("show") == "show" && $(ab[ae]).css("display") == "none") {
							$(ab[ae]).show()
						} else {
							$(ab[ae]).data("show", "")
						}
					}
				}
			}
		}
	}
	function T() {
		$("#" + v.findId.userImg).find("img").attr("src", __userConfig__.__uface);
		$("#" + v.findId.userName).html(__userConfig__.__unick)
	}
	function R(ah, ag, ac) {
		var ai = $(ah),
			ad = (ac == Y.platlist) ? ai.find("li") : ai,
			ab = ag ? 1 : 0,
			ae = ag ? N.animate[0] : "",
			af = ag ? "block" : "none";
		if (ag) {
			ai.css({
				opacity: 0
			});
			setTimeout(function() {
				ai.css({
					opacity: ab
				})
			}, 250);
			ad.css({
				"-webkit-animation-name": ae,
				opacity: ab,
				display: af
			});
			if (ad != ai) {
				ai.css({
					display: af
				})
			}
		} else {
			ad.css({
				"-webkit-animation-name": ae,
				opacity: ab,
				display: af
			});
			ai.css({
				opacity: ab,
				display: af
			})
		}
		return
	}
	function n(ae, ab) {
		var ac = $("#" + ae),
			ad = ac.css("display");
		if (ad == "none" && ab) {
			ac.show(3000)
		} else {
			if (ad != "none" && !ab) {
				ac.hide("fast")
			}
		}
		return
	}
	function A(ac, ab) {
		if (!ab) {
			$("#" + ac).hide()
		} else {
			$("#" + ac).show()
		}
		return
	}
	function H(ac, ab) {
		n(v.findId.sharefloat, false);
		if (typeof(ac) != "undefined" && typeof(ab) != "undefined") {
			e(__userConfig__.__isLogin, ac, ab)
		} else {
			if (typeof(ac) != "undefined") {
				e(__userConfig__.__isLogin, ac)
			} else {
				e(__userConfig__.__isLogin)
			}
		}
	}
	function h() {
		var ab = N.userInfoUrl + "userCallback";
		r(ab);
		return
	}
	window.userCallback = function(ab) {
		__userConfig__.__uface = ab.result.data.userface;
		__userConfig__.__unick = ab.result.data.uname;
		$("#" + v.findId.userImg).find("img").attr("src", __userConfig__.__uface);
		$("#" + v.findId.userName).html(__userConfig__.__unick);
		return
	};

	function x(ab) {
		var ac = {
			name: ab,
			type: "",
			title: "",
			index: "",
			href: ""
		};
		if (typeof(window.suds_count) == "function" || window.suds_count) {
			window.suds_count && window.suds_count(ac)
		}
	}
	function k() {
		$("head").append('<link rel="stylesheet" type="text/css" href="' + N.cssPath + '"></link>');
		d();
		return
	}
	this.init = function() {
		k();
		setTimeout(function() {
			p();
			b();
			U();
			S()
		}, 2200);
		return
	};
	return
}
function isloadqqApi() {
	var c = new MyShareClass();
	if (isqqBrowser) {
		var b = (version.qq < 5.4) ? qApiSrc.lower : qApiSrc.higher,
			d = document.createElement("script"),
			a = document.getElementsByTagName("body")[0];
		d.onload = function() {
			c.init()
		};
		d.setAttribute("src", b);
		a.appendChild(d)
	} else {
		c.init()
	}
	return
}
function getPlantform() {
	ua = navigator.userAgent;
	if ((ua.indexOf("iPhone") > -1 || ua.indexOf("iPod") > -1)) {
		return "iPhone"
	}
	return "Android"
}
function is_weixin() {
	var a = UA.toLowerCase();
	if (a.match(/MicroMessenger/i) == "micromessenger") {
		return true
	} else {
		return false
	}
}
function getVersion(c) {
	var a = c.split("."),
		b = parseFloat(a[0] + "." + a[1]);
	return b
}
function init() {
	platform_os = getPlantform();
	version.qq = isqqBrowser ? getVersion(UA.split("MQQBrowser/")[1]) : 0;
	version.uc = isucBrowser ? getVersion(UA.split("UCBrowser/")[1]) : 0;
	isWeixin = is_weixin();
	if ((isqqBrowser && version.qq < 5.4 && platform_os == "iPhone") || (isqqBrowser && version.qq < 5.3 && platform_os == "Android")) {
		isqqBrowser = bLevel.qq.forbid
	} else {
		if (isqqBrowser && version.qq < 5.4 && platform_os == "Android") {
			isqqBrowser = bLevel.qq.lower
		} else {
			if (isucBrowser && ((version.uc < 10.2 && platform_os == "iPhone") || (version.uc < 9.7 && platform_os == "Android"))) {
				isucBrowser = bLevel.uc.forbid
			}
		}
	}
	isloadqqApi();
	return
}
setTimeout(function() {
	init()
}, 300);
(function() {
	var j = 0;
	var s = "";
	var d = 8;
	window.hex_md5 = function(w) {
		return k(g(l(w), w.length * d))
	};

	function h(w) {
		return p(g(l(w), w.length * d))
	}
	function i(w) {
		return t(g(l(w), w.length * d))
	}
	function q(w, x) {
		return k(m(w, x))
	}
	function f(w, x) {
		return p(m(w, x))
	}
	function u(w, x) {
		return t(m(w, x))
	}
	function v() {
		return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72"
	}
	function g(H, C) {
		H[C >> 5] |= 128 << ((C) % 32);
		H[(((C + 64) >>> 9) << 4) + 14] = C;
		var G = 1732584193;
		var F = -271733879;
		var E = -1732584194;
		var D = 271733878;
		for (var z = 0; z < H.length; z += 16) {
			var B = G;
			var A = F;
			var y = E;
			var w = D;
			G = b(G, F, E, D, H[z + 0], 7, -680876936);
			D = b(D, G, F, E, H[z + 1], 12, -389564586);
			E = b(E, D, G, F, H[z + 2], 17, 606105819);
			F = b(F, E, D, G, H[z + 3], 22, -1044525330);
			G = b(G, F, E, D, H[z + 4], 7, -176418897);
			D = b(D, G, F, E, H[z + 5], 12, 1200080426);
			E = b(E, D, G, F, H[z + 6], 17, -1473231341);
			F = b(F, E, D, G, H[z + 7], 22, -45705983);
			G = b(G, F, E, D, H[z + 8], 7, 1770035416);
			D = b(D, G, F, E, H[z + 9], 12, -1958414417);
			E = b(E, D, G, F, H[z + 10], 17, -42063);
			F = b(F, E, D, G, H[z + 11], 22, -1990404162);
			G = b(G, F, E, D, H[z + 12], 7, 1804603682);
			D = b(D, G, F, E, H[z + 13], 12, -40341101);
			E = b(E, D, G, F, H[z + 14], 17, -1502002290);
			F = b(F, E, D, G, H[z + 15], 22, 1236535329);
			G = e(G, F, E, D, H[z + 1], 5, -165796510);
			D = e(D, G, F, E, H[z + 6], 9, -1069501632);
			E = e(E, D, G, F, H[z + 11], 14, 643717713);
			F = e(F, E, D, G, H[z + 0], 20, -373897302);
			G = e(G, F, E, D, H[z + 5], 5, -701558691);
			D = e(D, G, F, E, H[z + 10], 9, 38016083);
			E = e(E, D, G, F, H[z + 15], 14, -660478335);
			F = e(F, E, D, G, H[z + 4], 20, -405537848);
			G = e(G, F, E, D, H[z + 9], 5, 568446438);
			D = e(D, G, F, E, H[z + 14], 9, -1019803690);
			E = e(E, D, G, F, H[z + 3], 14, -187363961);
			F = e(F, E, D, G, H[z + 8], 20, 1163531501);
			G = e(G, F, E, D, H[z + 13], 5, -1444681467);
			D = e(D, G, F, E, H[z + 2], 9, -51403784);
			E = e(E, D, G, F, H[z + 7], 14, 1735328473);
			F = e(F, E, D, G, H[z + 12], 20, -1926607734);
			G = n(G, F, E, D, H[z + 5], 4, -378558);
			D = n(D, G, F, E, H[z + 8], 11, -2022574463);
			E = n(E, D, G, F, H[z + 11], 16, 1839030562);
			F = n(F, E, D, G, H[z + 14], 23, -35309556);
			G = n(G, F, E, D, H[z + 1], 4, -1530992060);
			D = n(D, G, F, E, H[z + 4], 11, 1272893353);
			E = n(E, D, G, F, H[z + 7], 16, -155497632);
			F = n(F, E, D, G, H[z + 10], 23, -1094730640);
			G = n(G, F, E, D, H[z + 13], 4, 681279174);
			D = n(D, G, F, E, H[z + 0], 11, -358537222);
			E = n(E, D, G, F, H[z + 3], 16, -722521979);
			F = n(F, E, D, G, H[z + 6], 23, 76029189);
			G = n(G, F, E, D, H[z + 9], 4, -640364487);
			D = n(D, G, F, E, H[z + 12], 11, -421815835);
			E = n(E, D, G, F, H[z + 15], 16, 530742520);
			F = n(F, E, D, G, H[z + 2], 23, -995338651);
			G = a(G, F, E, D, H[z + 0], 6, -198630844);
			D = a(D, G, F, E, H[z + 7], 10, 1126891415);
			E = a(E, D, G, F, H[z + 14], 15, -1416354905);
			F = a(F, E, D, G, H[z + 5], 21, -57434055);
			G = a(G, F, E, D, H[z + 12], 6, 1700485571);
			D = a(D, G, F, E, H[z + 3], 10, -1894986606);
			E = a(E, D, G, F, H[z + 10], 15, -1051523);
			F = a(F, E, D, G, H[z + 1], 21, -2054922799);
			G = a(G, F, E, D, H[z + 8], 6, 1873313359);
			D = a(D, G, F, E, H[z + 15], 10, -30611744);
			E = a(E, D, G, F, H[z + 6], 15, -1560198380);
			F = a(F, E, D, G, H[z + 13], 21, 1309151649);
			G = a(G, F, E, D, H[z + 4], 6, -145523070);
			D = a(D, G, F, E, H[z + 11], 10, -1120210379);
			E = a(E, D, G, F, H[z + 2], 15, 718787259);
			F = a(F, E, D, G, H[z + 9], 21, -343485551);
			G = o(G, B);
			F = o(F, A);
			E = o(E, y);
			D = o(D, w)
		}
		return Array(G, F, E, D)
	}
	function c(C, z, y, w, B, A) {
		return o(r(o(o(z, C), o(w, A)), B), y)
	}
	function b(z, y, D, C, w, B, A) {
		return c((y & D) | ((~y) & C), z, y, w, B, A)
	}
	function e(z, y, D, C, w, B, A) {
		return c((y & C) | (D & (~C)), z, y, w, B, A)
	}
	function n(z, y, D, C, w, B, A) {
		return c(y ^ D ^ C, z, y, w, B, A)
	}
	function a(z, y, D, C, w, B, A) {
		return c(D ^ (y | (~C)), z, y, w, B, A)
	}
	function m(y, B) {
		var A = l(y);
		if (A.length > 16) {
			A = g(A, y.length * d)
		}
		var w = Array(16),
			z = Array(16);
		for (var x = 0; x < 16; x++) {
			w[x] = A[x] ^ 909522486;
			z[x] = A[x] ^ 1549556828
		}
		var C = g(w.concat(l(B)), 512 + B.length * d);
		return g(z.concat(C), 512 + 128)
	}
	function o(w, B) {
		var A = (w & 65535) + (B & 65535);
		var z = (w >> 16) + (B >> 16) + (A >> 16);
		return (z << 16) | (A & 65535)
	}
	function r(w, x) {
		return (w << x) | (w >>> (32 - x))
	}
	function l(z) {
		var y = Array();
		var w = (1 << d) - 1;
		for (var x = 0; x < z.length * d; x += d) {
			y[x >> 5] |= (z.charCodeAt(x / d) & w) << (x % 32)
		}
		return y
	}
	function t(y) {
		var z = "";
		var w = (1 << d) - 1;
		for (var x = 0; x < y.length * 32; x += d) {
			z += String.fromCharCode((y[x >> 5] >>> (x % 32)) & w)
		}
		return z
	}
	function k(y) {
		var x = j ? "0123456789ABCDEF" : "0123456789abcdef";
		var z = "";
		for (var w = 0; w < y.length * 4; w++) {
			z += x.charAt((y[w >> 2] >> ((w % 4) * 8 + 4)) & 15) + x.charAt((y[w >> 2] >> ((w % 4) * 8)) & 15)
		}
		return z
	}
	function p(z) {
		var y = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var B = "";
		for (var x = 0; x < z.length * 4; x += 3) {
			var A = (((z[x >> 2] >> 8 * (x % 4)) & 255) << 16) | (((z[x + 1 >> 2] >> 8 * ((x + 1) % 4)) & 255) << 8) | ((z[x + 2 >> 2] >> 8 * ((x + 2) % 4)) & 255);
			for (var w = 0; w < 4; w++) {
				if (x * 8 + w * 6 > z.length * 32) {
					B += s
				} else {
					B += y.charAt((A >> 6 * (3 - w)) & 63)
				}
			}
		}
		return B
	}
})();xin