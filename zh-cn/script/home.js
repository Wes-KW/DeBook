//IE8 pause
if(navigator.userAgent.indexOf("MSIE")>=0){
  if(notCompatible()){
    window.location = "compatibility.html";
  }
}

  function notCompatible(){
    var usrAgnt = navigator.userAgent;
    return usrAgnt.indexOf("MSIE 9")>=0||usrAgnt.indexOf("MSIE 8")>=0||usrAgnt.indexOf("MSIE 7")>=0||usrAgnt.indexOf("MSIE 6")>=0||usrAgnt.indexOf("MSIE 5")>=0;
  }

  //global function
  var mx = 0;
  var my = 0;
  var inbox = 0;
  var hideListConTime = 200;

  function initTooltip(){
    var tooltip = document.getElementById("tips_box");
    tooltip.onmousemove = function(){inbox=1;};
    tooltip.onmouseleave = function(){
      inbox=0;
      window.setTimeout(function(){
        hideTooltip();
      },1000);
    };
  }

  function showTooltip(obj,forced){
    if(isPhone()==false||forced){
      var tooltip = document.getElementById("tips_box");
      if(obj.hasAttribute("tips")){
        tooltip.children[0].innerHTML = obj.getAttribute("tips");
        tooltip.style.zIndex = 100;
        tooltip.style.opacity = 1;
        var tw = tooltip.getClientRects()[0].width;
        var l,t;
        if(mx+45>(window.innerWidth)){
          l = String(window.innerWidth - tw - 30) + "px";
        }else{
          l = String(mx) + "px";
        }
        if(my + 45>(window.innerHeight)){
          var mh = tooltip.getClientRects()[0].height;
          t = String(my - mh -15) + "px";
        }else{
          t = String(my + 15) + "px";
        }
        if(forced){
          l = obj.getClientRects()[0].left + "px";
          t = obj.getClientRects()[0].top + obj.getClientRects()[0].height + "px";
        }
        tooltip.style.left = l;
        tooltip.style.top = t;
        return tooltip;
      }
    }
  }

  function hideTooltip(){
    if(inbox) return;
    var tooltip = document.getElementById("tips_box");
    tooltip.style.zIndex = 100;
    window.setTimeout(function () { tooltip.style.zIndex = -1; }, 0.5);
    tooltip.style.opacity = 0;
    return tooltip;
  }

  function boxstyle(obj,index){
    if(!index){
      obj.style.boxShadow = "";
      obj.style.borderColor = "";
    }else{
      obj.style.boxShadow = "#c5e1a5 0.1px 0.1px 2px 3px";
      obj.style.borderColor = "#228b22";
    }
  }

  window.onmousemove = function (event){
    var event = event || window.event;
    mx = event.clientX;
    my = event.clientY;
  };

  resize();
  window.onresize = function(){resize();};
  window.onload = function(){init();};

  function init(){
    autologin(function(){
      if(usr.usrid!=""&&typeof usr.usrid!="undefined"){
        tita(function(){checkTimeout();},1000);
      }
    });
    initBTN();
    initTooltip();
    if(typeof extraInit!="undefined"){
      extraInit();
    }
  }

  function autologin(fn){
    newXMLHttpRequest('POST','.phtml/vrfylogin.php','direct=jsonUsr',function(rspt){
      var k = JSON.parse(rspt);
      for(var i=0;i<usr.keys.length;i++){
        usr[usr.keys[i]] = k[usr.keys[i]];
      }
      resize();
      if(typeof judgeLoadLogin!="undefined"){
        judgeLoadLogin = true;
      }
      if(fn!=null&&typeof fn!="undefined"){
        fn();
      }
    },function(){});
  }

  initImage();

  function initBTN(){
    var a = document.getElementsByTagName('A');
    for(var i=0;i<a.length;i++){
      if(a[i].hasAttribute('initbtn')){
        a[i].style.display = "inline-block";
      }
    }
  }

  function initImage(){
    var p = new Image(16,16);
    p.src = "Image/src/ajax_clock_small.gif";
  }

  function menuScroll(myint){
    var menu = document.getElementsByClassName("menu")[0];
    if(myint==-1){
      menu.scrollBy(-200,0);
    }else if(myint==1){
      menu.scrollBy(200,0);
    }
  }

  var allData = null;

  function isPhone(){
    var ua = navigator.userAgent;
    var isIphone = ua.indexOf("iPhone")>=0;
    var isAndroid = ua.indexOf("Android")>=0;
    if(isIphone) return 1;
    if(isAndroid) return 2;
    return 0;
  }

  function resize(){
    //phone view
    if(isPhone()==1) {document.body.style.zoom = 0.87;}
    //resize start
    var vy = document.getElementById("topbar").children[0];
    if(document.body.offsetWidth > 825)
    {
      fnbar = vy.children[0].children[2];
      if(document.readyState=="complete"){
        fnbar.children[0].children[2].children[0].innerHTML = (usr.usrid != ""&&typeof usr.usrid!="undefined") ? "账户" : "登录";
        fnbar.children[0].children[2].children[0].href = "?account";
        fnbar.children[0].children[2].children[0].setAttribute('tips',(usr.usrid != ""&&typeof usr.usrid!="undefined") ? "账户" : "登录");
        fnbar.children[0].children[3].children[0].innerHTML = (usr.usrid == ""||typeof usr.usrid=="undefined") ? "注册" : "登出";
        fnbar.children[0].children[3].children[0].href = (usr.usrid == ""||typeof usr.usrid=="undefined") ? "?account#signup" : "javascript:signout();";
        fnbar.children[0].children[3].children[0].setAttribute('tips',(usr.usrid == ""||typeof usr.usrid=="undefined") ? "注册" : "登出");
      }
    }else{
      fnbar = vy.children[0].children[2];
      if(document.readyState=="complete"){
        fnbar.children[0].children[2].children[0].innerHTML = (usr.usrid != ""&&typeof usr.usrid!="undefined") ? "查看账户" : "登录/注册";
        fnbar.children[0].children[2].children[0].href = "?account";
        fnbar.children[0].children[2].children[0].setAttribute('tips',(usr.usrid != ""&&typeof usr.usrid!="undefined") ? "账户" : "登录/注册");
        fnbar.children[0].children[3].children[0].innerHTML = (usr.usrid == ""||typeof usr.usrid=="undefined") ? "注册" : "登出";
        fnbar.children[0].children[3].children[0].href = (usr.usrid == ""||typeof usr.usrid=="undefined") ? "?account" : "javascript:signout();";
        fnbar.children[0].children[3].children[0].setAttribute('tips',(usr.usrid != ""&&typeof usr.usrid!="undefined") ? "注册" : "登出");
        if(window.location.pathname.indexOf("?account")>=0&&!(usr.usrid == ""||typeof usr.usrid=="undefined")){
          fnbar.children[0].children[2].children[0].innerHTML = "登出网页";
          fnbar.children[0].children[2].children[0].href = "javascript:signout();";
          fnbar.children[0].children[2].children[0].setAttribute('tips',"登出");
        }
      }
    }
    
    vy = document.getElementById('sectionBlank');
    var a = document.getElementById("notice_area").parentElement;
    if (a.style.position == "fixed"){
      vy.style.height = a.offsetHeight + "px";
    }

    var menu = document.getElementsByClassName("menu")[0];
    if(location.search.indexOf("?account")==0&&typeof menu!="undefined"){
      if(window.innerWidth<840){
        menu.parentNode.setAttribute("com","");
      }else{
        menu.parentNode.removeAttribute("com");
      }
    }

    var imagebox = document.getElementById("imagebox");
    if(location.search.indexOf("?author")==0&&typeof imagebox!="undefined"&&imagebox!=null){
      var igb = imagebox.children[0].children[0];
      if(window.innerWidth<1130){
        igb.style.width = "20vw";
        igb.style.height = "20vw";
      }else{
        igb.style.width = "";
        igb.style.height = "";
      }
    }
  }

  function hideMsg(obj,id)
  {
    obj.parentElement.parentElement.parentElement.parentElement.style.display = "none";
    resize();
    newXMLHttpRequest("POST",".phtml/msg.php","key=hideMsg&id="+id,null,null);
  }

  function tita(fn, time) { window.setTimeout(fn, time);}

  //style changer
  function shakeBox(obj,direction,times,interval,latitude){
    obj = obj.parentElement;
    for(var i=0;i<times*2;i++){
      fnShake(i,i*interval,direction,obj,latitude);
    }
    window.setTimeout(function(){
      obj.style.left = "";
      obj.style.top = "";
    },(times*2+1)*interval)
  }

  function fnShake(i,time,direction,obj,latitude){
    window.setTimeout(function(){
      if(direction=='upDown'){
        if(i-parseInt(i/2)*2==0){
          //up
          obj.style.top = String(latitude * -1) + "px";
        }else{
          //down
          obj.style.top = String(latitude) + "px";
        }
      }else if(direction=='leftRight'){
        if(i-parseInt(i/2)*2==0){
          //left
          obj.style.left = String(latitude * -1) + "px";
        }else{
          //right
          obj.style.left = String(latitude) + "px";
        }
      }
    },time)
  }

  function getQueryVariable()
  {
    var query = window.location.search.substring(1);
    var key_values = query.split("&");
    var params = {};
    for(var i=0;i<key_values.length;i++){
      var key_val = key_values[i];
      var key_val_arr = key_val.split("=");
      params[key_val_arr[0]] = key_val_arr[1];
    }
    return params;
  }