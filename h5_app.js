$(function() {
  bridgeReady();

  function bridgeReady() {
    hideTopNavigate(); //隐藏顶导航
    observeA(); //对所有A链接的点击监听并通知native
    var hash = location.hash;
    if (hash == "#/") { //首页
      hideHomeBottom(); //隐藏首页底部的“关于老虎金融”和"合作伙伴"模块
    }
    if (hash == "#/invest/current") {
      hideTradeTopBottom(); //隐藏交易页顶部信息和底部入金出金
    }
    if (hash == "#/master/list") {
      $(".nav-tabs-wrapper").livequery(function() {
        $(this).css('margin-top', '-48px');
      });
    }
    if (hash.indexOf("#/master/detail/") != -1) { //高手详情页,调整当前投资和历史投资的位置:https://www.tigerwit.com/wap_app/#/master/detail/1220299/history?back=%2F
      addStyleSheet([
        ".nav-tabs-fixed{margin-top:-48px;}"
      ].join(''));
    }
    if (hash.indexOf("#/setting/index") != -1) { //账户设置资料 ，底部的退出按钮做掉
      hideSettingLogout();
    }
    if(hash.indexOf("#/web/faq") != -1){
      $(".faq__callme").livequery(function(){
        $(this).parent().remove();
      });
    }
  }
  //给页面添加style
  function addStyleSheet(styles) {
    var style = document.createElement('style');
    document.body.appendChild(style);
    style.appendChild(document.createTextNode(styles));
  }
  //隐藏交易页顶部信息和底部入金出金
  function hideTradeTopBottom() {
    $(".asset-detail").livequery(function() {
      $(this).remove();
    });
    $(".bt-button").livequery(function() {
      $(this).remove();
    });
  }
  //隐藏首页底部的“关于老虎金融”和"合作伙伴"模块
  function hideHomeBottom() {
    $(".aboutus").livequery(function() {
      $(this).parents('.home__wrap_bg').remove();
    });
    $(".footer").livequery(function() {
      $(this).parent().remove();
    });
  }
  //隐藏顶导航
  function hideTopNavigate() {
    $(".navbar").livequery(function() {
      $(this).hide();
    });
    $("body").css('margin-top', '-49px');
    $(".return_header").livequery(function() {
      $(this).hide();
    });
  }

  function hideSettingLogout() {
    $(".setting > .container").livequery(function() {
      $(this).hide();
    });
  }
  //对a链接的点击进行监听，阻止并通知native
  function observeA() {
    $("a").livequery(function() {
      $(this).click(function() {
        var href = $(this).attr('href');
        console.log("a is clicked,and it's href is" + href);
        if (!/^#.*/.test(href)) {
          return;
        }
        var url = location.href.replace(/#.*/g, href);
        if (isIgnoreUrl(url)) { //不做处理的url
          console.log('忽略掉当前url,不做任何处理：', url);
          return;
        }
        var oAction = convertAction(url);
        console.log('convertAction finish:', oAction);
        callNative(oAction);
        return false;
      });
    });
  }

  function isIgnoreUrl(url) {
    var isIgnore = false;
    var aIgnorehash = [
      '#/invest/history', //交易里的当前和历史切换
      '#/invest/current'
    ];
    $.each(aIgnorehash, function(index, hash) {
      if (url.indexOf(hash) != -1) {
        isIgnore = true;
      }
    });
    //高手详情里的当前和历史切换 https://www.tigerwit.com/wap/#/master/detail/525105/history?back=%2F
    if (location.href.indexOf('#/master/detail') != -1 && url.indexOf('#/master/detail') != -1) {
      isIgnore = true;
    }
    return isIgnore;
  }

  function convertAction(url) {
    var type = "openUrl";
    var oAction = {
      "type": type,
      "url": url
    };
    if (url.indexOf('#/account/login') != -1) {
      oAction = {
        "type": "login"
      };
    }
    if (url.indexOf('#/setting/verify') != -1) {
      oAction = {
        "type": 'verifyRealname'
      };
    }
    if (url.indexOf('#/setting/avatar') != -1) {
      oAction = {
        "type": "uploadAvatar"
      };
    }
    return oAction;
  }

  function callNative(oAction) {
    var sAction = JSON.stringify(oAction);
    if (isIOS()) {
      TigerwitNative(sAction);
    } else {
      TigerwitNative.jsCall(sAction);
    }
  }

  function isIOS() {
    return /like Mac OS X/.test(navigator.userAgent);
  }
});
