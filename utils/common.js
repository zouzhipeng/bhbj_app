
let app_config = require('./app_config.js')

function request(p){
	(p.url.substr(0,4)!='http')&&(p.url = app_config.domain+p.url)
	if(!p.method) p.method = 'POST'
	// #ifdef H5
	var user_token = window.user_token||false
	// #endif
	// #ifdef MP
	let app = getApp()
	var user_token = (app&&app.globalData.user_token)||false
	// #endif
	
	if(!p.data)p.data={}
	if (!p.data.user_token) p.data.user_token = user_token
	
	var success_cb = p.success||false
	p.success = (res)=>{
		if(!p.passloading)uni.hideLoading()
		res = res.data || res;
		if (res.err) {
			if(res.err == 233){
				app.globalData.login(()=>{
					request(p)
				})
			}
		    else if(p.fail){
				uni.hideLoading()
				p.fail(res)
			}
		}
		else {
			if (success_cb) success_cb(res);
		}
	}
	
	if (!p.fail) p.fail = function (res) {
		console.log(res)
		uni.showToast({
			title: res.msg||'未知错误！',
			icon: 'none',
			duration: 2000
		})
	}
	
	if(!p.passloading)uni.showLoading({ title: 'loding...' });
	uni.request(p);
}

Date.prototype.format = function (format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
};
function timeToStr(time,format) {
  return time ? (new Date(~~time * 1000)).format(format||'yyyy-MM-dd') : "";
}

let sys_config = false
function getConfig(fn){
	if(!sys_config){
		request({
			url:"index/get_config",
			passloading:1,
			success: (res) => {
				sys_config = res.config
				fn&&fn(sys_config)
			}
		})
	}
	else{
		fn&&fn(sys_config)
	}
}

var ZC = function(k, v, t){
    k='ZC_f_'+k;
    this.active_time = 300000;
    var now_tme = new Date().getTime();
    if(t === -1) t = 999999999999;
    t || (t = this.active_time);
    if (!v || typeof (v) == "function") {//读取缓存
		var cache = uni.getStorageSync(k);
        cache = cache?JSON.parse(cache):0;
        if (cache && cache.expire_time >= now_tme) {
            return cache.value;
        }
        else {
            if (typeof (v) == "function") {
                var value = v();
                if (value) {
                    return this.ZC(k, value) ? value : false;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
    }
    else {//设置缓存
        var cache = {
            "expire_time": now_tme + t,//缓存过期时间
            "value": v,
        };
        try {
			uni.setStorageSync(k, JSON.stringify(cache));
            return true;
        } catch (e) {
            return false;
        }
    }
};
ZC.clear = function(k) {
    if(k){
        k='ZC_'+k;
		uni.removeStorageSync(k);
    }
    else{
        uni.clearStorageSync();
    }
};

function build_poster(p){
	let ctx,bg_img,config
	config = p.config
	ctx = uni.createCanvasContext(p.canvasId)
	uni.showLoading({
		title:"海报制作中"
	})
	load_img(()=>{
		ctx.drawImage(bg_img.path,0, 0)
		
		for(var i in config){
			var item = config[i]
			if(item.type == 'img'){
				ctx.drawImage(item.img.path,item.x, item.y, item.w,item.h)
			}
			else if(item.type == 'text'){
				ctx.setFillStyle(item.color)
				ctx.setFontSize(item.size)
				ctx.setTextAlign(item.align)
				ctx.fillText(item.text,item.x, item.y,)
			}
		}
		
		
		ctx.draw(false,()=>{
			if(p.success){
				uni.canvasToTempFilePath({
					canvasId: p.canvasId,
					success: function(res) {
						p.success(res.tempFilePath)
					},
					complete(){
						uni.hideLoading()
					}
				})
			}else{
				uni.hideLoading()
			}
		})
	})
	
	function load_img(fn){
		let img_num = 1
		uni.getImageInfo({
		    src: p.bg_img.replace('http://','https://'), //仅为示例，并非真实的资源
		    success: (res) => {
				bg_img = res
		    },
			complete() {
				img_num--
				if(img_num<=0)fn&&fn()
			}
		});
		
		for(let i in config){
			if(config[i].type == 'img'){
				img_num++
				uni.getImageInfo({
				    src: config[i].url.replace('http://','https://'), //仅为示例，并非真实的资源
				    success: (res) => {
						console.log(i,config)
				        config[i].img = res
				    },
					complete() {
						img_num--
						if(img_num<=0)fn&&fn()
					}
				});
			}
		}
	}
}

function decodeScene(scene) {
	var res = {}
    if (scene){
		var s_arr = decodeURIComponent(scene).split("&")
		for (var i = 0; i < s_arr.length; i++) {
			var o = s_arr[i].split("=")
			res[o[0]] = o[1]
		}
	}
    return res;
}

module.exports = {
  app_config: app_config,
  request: request,
  timeToStr:timeToStr,
  ZC:ZC,
  getConfig:getConfig,
  build_poster:build_poster,
  decodeScene:decodeScene,
}