$(function(){
	bridgeReady();
	function bridgeReady(){
    hideTopNavigate();//隐藏顶导航
    observeA(); //对所有A链接的点击监听并通知native
    var hash = location.hash;
    if(hash == "#/"){//首页
      hideHomeBottom();//隐藏首页底部的“关于老虎金融”和"合作伙伴"模块
    }
    if(hash == "#/invest/current"){
      hideTradeTopBottom();//隐藏交易页顶部信息和底部入金出金
    }
    if(hash == "#/master/list"){
      $(".nav-tabs-wrapper").livequery(function(){
        $(this).css('margin-top', '-48px');
      });
    }
  }
  //隐藏交易页顶部信息和底部入金出金
  function hideTradeTopBottom(){
    $(".asset-detail").livequery(function(){
      $(this).remove();
    });
    $(".bt-button").livequery(function(){
      $(this).remove();
    });
  }
  //隐藏首页底部的“关于老虎金融”和"合作伙伴"模块
  function hideHomeBottom(){
    $(".aboutus").livequery(function(){
      $(this).parents('.home__wrap_bg').remove();
    });
    $(".footer").livequery(function(){
      $(this).parent().remove();
    });
  }
  //隐藏顶导航
  function hideTopNavigate(){
		$(".navbar").livequery(function(){
			$(this).hide();
		});
		$("body").css('margin-top','-49px');
		$(".return_header").livequery(function(){
			$(this).hide();
		});
  }
  //对a链接的点击进行监听，阻止并通知native
  function observeA(){
		$("a").livequery(function(){
			$(this).click(function(){
				var href = $(this).attr('href');
				console.log("a is clicked,and it's href is" + href);
				if(!/^#.*/.test(href)){
					return;
				}
				var url =location.href.replace(/#.*/g,href);
				var oAction = {
					"type" : "openUrl",
					"url" : url
				};
				callNative(oAction);
				return false;
			});
		});
	}
	function callNative(oAction){
		var sAction = JSON.stringify(oAction);
		if(isIOS()){
			TigerwitNative(sAction);
		}else{
			TigerwitNative.jsCall(sAction);
		}
	}
	function isIOS(){
		return /like Mac OS X/.test(navigator.userAgent);
	}

});
