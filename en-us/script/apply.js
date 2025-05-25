var global_bookid = -1;
var slideStep = 0;
var global_qua = 0;
var sliderBox = {};
var pagesImage = {};
var randApplyAddress = "";
var currentApply = {};
var quesBank = {
    mainQues:["书本版本属于","书本掉色情况","书本撕毁情况","书本褶皱情况","书本泛黄情况","书内额外书写笔记"],
    mainAnswer:[
        ["精装书","平装书","线装书","其他书"],
        ["没有掉色","有点掉色","掉色较多","掉色严重"],
        ["没有撕毁","3页或以下有撕毁","3页以上10页或以下有撕毁","10页以上有撕毁"],
        ["没有褶皱","10页或以下有褶皱","10页以上25页或以下有褶皱","25页以上有褶皱"],
        ["没有泛黄","轻微泛黄","中等泛黄","严重泛黄"],
        ["没有","仅有工整的阅读笔迹","有轻微影响阅读的笔迹","有严重影响阅读的笔迹"]
    ]
};

function netErr2(){
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox,'<h3 style="margin-bottom:5px;width:100%">访问网络失败</h3><style> div.asbox_con{margin-bottom:5px;} div.asbox_con:last-child{margin-bottom:0px;}</style><div class="line" style="margin-top: 5px;"></div><p>您的网络不可用，请检查网络并确保可用后重试。</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right="" onclick="hideMsgbox(this.parentElement.parentElement)">好的</a>');
}

function initApply(){
    randApplyAddress = "";
    if(document.getElementById('continue')==null) return;
    var str = window.location.search;
    var funcFail = function(){
        var msgbox = document.getElementsByClassName("MsgBox")[0];
        showMsgbox(msgbox,"<h3 style=\"width:100%\">选择一本需要供货的书</h3><p style=\"width:100%\"></p><p>按一下“好的”按钮，然后在聚焦的搜索框内输入关键词。选择一本您需要供货的书籍以继续提供完整信息。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);searchSell();\" right=\"\">好的</a>");
    }
    var loadForms = function(){
        var form2input = document.getElementsByTagName("form")[2].getElementsByTagName("input");
        var div3input = document.getElementById("slider").children[6].getElementsByTagName("input");
        var submit0 = document.getElementById("submit0");
        var cancel0 = document.getElementById("cancel0");
        var submit1 = document.getElementById("submit1");
        var cancel1 = document.getElementById("cancel1");
        for(var i=0;i<form2input.length;i++){
            addEvent("keydown",function(e){if(e.keyCode==13||e.keyCode==10){e.preventDefault();}},form2input[i]);
        }
        for(var i=0;i<div3input.length;i++){
            addEvent("keydown",function(e){if(e.keyCode==13||e.keyCode==10){e.preventDefault();}},div3input[i]);
        }
        cancel0.onclick = function(){NATerm(0);};
        submit0.onclick = function(){NATerm(1);};
        cancel1.onclick = function(){npPage(-1);};
        submit1.onclick = function(){checkForms(function(){npPage(1);});};
        var d = document.getElementById("termsBox");
        d.onscroll = function(){  
            if(d.getClientRects()[0]["height"] + d.scrollTop > d.scrollHeight-20){
                submit0.removeAttribute("disabled");
            }
        }
    }
    var cancelOperation = function(){
        var h = location.hash;
        if(h!=""&&h.indexOf("from=")>=0){
            var from = h.substr(6);
            gotoPage(from);
            putHis("","",from);
        }else{
            goHome();
            putHis("","","?");
        }
        if(randApplyAddress=="") return;
        newXMLHttpRequest("POST",".phtml/more/readDir.mode.phtml","key=delete&prlg=allow&path=" + "Image/apply/" + randApplyAddress,function(){},function(){});
    }
    if(str.indexOf("?apply")>=0){
        if(str.indexOf("/")!=-1&&str.substr(str.indexOf("/")+1)!=""){
            var bookid = str.substr(str.indexOf("/")+1);
            loadForms();
            global_bookid = bookid;
        }else{
            funcFail();
        }
    }
    //create new folder for apply
    var submits = document.getElementsByClassName('asbox_submit');
    for(var i=0;i<submits.length;i++){
        if(!submits[i].hasAttribute("button-type")) continue;
        if(submits[i].getAttribute("button-type")!="cancel") continue;
        submits[i].onclick = function(){cancelOperation();};
    }
    /*
    $(window).bind("beforeunload",function(){
        return "Leaving the site may not save any changes. Are you sure to continue?";
    });
    window.onunload = function(){
        alert("Leaving the site may not save any changes. Are you sure to continue?");
    }*/
}

function addAplinfo(id){
    if(typeof usr.usrid=="undefined"||usr.usrid==""){
        gotoPage("?account");
        putHis("","","?account#continue=?apply/"+id + "#from="+location.search);
    }else{
        gotoPage("?apply/"+id);
        putHis("","","?apply/"+id + "#from=" + location.search);
    }
}

function selectRadio(obj){
    obj.children[0].checked = true;
    var c = obj.parentElement.children;
    var i = in_array(c,obj);
    var o2 = obj.parentElement.parentElement.parentElement;
    var c2 = o2.parentElement.children;
    var i2 = in_array(c2,o2);
    obj.parentElement.parentElement.setAttribute("selectedIndex",i);
    for(var x=0;x<c.length;x++){
        if(x==i){
            c[x].setAttribute("selected","");
        }else{
            c[x].removeAttribute("selected");
        }
    }
    var key = obj.parentElement.getAttribute("name");
    sliderBox[key] = i;
    npSlide(i2+1);
}

function npPage(in4){
    var menuCon = document.getElementById("applymenu");
    var pageCon = document.getElementById("applycon");
    var pageCount = pageCon.childElementCount;
    var step = parseInt(pageCon.getAttribute("step"));
    if(in4!=1&&in4!=-1) return;
    step += in4;
    if(step<0||step>=pageCount) return;
    for(var i=0;i<pageCount;i++){
        if(i==step){
            menuCon.children[i].style = "font-weight:bold";
            pageCon.children[i].style.display = "block";
        }else{
            menuCon.children[i].style = "";
            pageCon.children[i].style.display = "none";
        }
    }
    pageCon.setAttribute("step",step);
}

function npSlide(n){
    var ind = document.getElementsByClassName("progressInner")[0];
    var slider = document.getElementById("slider");
    slider.children[slideStep].style.opacity = 0;
    if(n==="-1"||n==="+1"){
        if(slideStep<=0&&n=="-1") return;
        if(slideStep>=6&&n=="+1") return;
        slideStep += parseInt(n);
    }else{
        if(n>6||n<0) return;
        slideStep = n;
    }
    p = slideStep*100;
    i = p/6;
    window.setTimeout(function(){
        slider.children[slideStep].style.opacity = 1;
        ind.style.width = i.toString() + "%";
        slider.style.left = "-" + p.toString() + "%";
    },300);
}

function goPage(in4){
    var menuCon = document.getElementById("applymenu");
    var pageCon = document.getElementById("applycon");
    var pageCount = pageCon.childElementCount;
    var step = in4;
    if(step<0||step>=pageCount) return;
    for(var i=0;i<pageCount;i++){
        if(i==step){
            menuCon.children[i].style = "font-weight:bold";
            pageCon.children[i].style.display = "block";
        }else{
            menuCon.children[i].style = "";
            pageCon.children[i].style.display = "none";
        }
    }
    pageCon.setAttribute("step",step);
}

function NATerm(in4){
    var termNoMsg = document.getElementById("check0");
    if(in4==0){
        putHis("","","?");
        goHome();
    }else{
        npPage(1);
        var asgi = termNoMsg.checked?1:0;
        newXMLHttpRequest("POST",".phtml/usr.php","key=noSellMsg&val="+asgi,function(rspt){},function(){})
    }
}

function syncInput(){
    var names = ["translator","publish","isbn","lang","page","retail_price"];
    var c = [];
    for(var i=0;i<names.length;i++){
        c[i] = document.getElementsByName(names[i]);
    }
    for(var i=0;i<c.length;i++){
        var obj = c[i][0];
        var myName = obj.getAttribute("name");
        document.getElementsByName(myName)[1].value = obj.value;
    }
    var inputB = document.getElementsByName("quality")[0];
    inputB.value = generateQuaText(global_qua);
}

function generateQuaText(num){
    if(num>=1) return "全新";
    num = Math.round(num*20)/20;
    num *= 100;
    var fstr = parseInt(num/10);
    var bstr = num - fstr*10;
    var str = fstr + "成";
    if(bstr!=0) str += bstr;
    str += "新";
    return str;
}

function checkForms(fn){
    if(fn!=null&&typeof fn=="function"){
        var pub = document.getElementsByName("publish")[0];
        var lang = document.getElementsByName("lang")[0];
        if(pub.value!=""&&lang.value!=""){
            fn();
        }else{
            var msgbox = document.getElementsByClassName("MsgBox")[0];
            showMsgbox(msgbox,"<h3 style=\"width:100%\">未填写必要信息</h3><p style=\"width:100%\">请检查以下输入框是否已经填写完整</p><ul><li>出版社</li><li>书本语言</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right=\"\">好的</a>");
        }
    }
}

function vrfy(){
    var bpn = parseInt(document.getElementById("bookPageNum").value);
    var bp = parseFloat(document.getElementById("bookPrice").value);
    var qua = 1;
    var pageCount = 0;
    var pages = [];
    var wrongfn = function(){
        var msgbox = document.getElementsByClassName("MsgBox")[0];
        showMsgbox(msgbox,"<h3 style=\"width:100%\">未填写必要信息或信息填写错误</h3><p style=\"width:100%\">请检查以下输入框是否已经填写完整并且没有明显的错误</p><ul><li>书本页数</li><li>参考价或买入价</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right=\"\">好的</a>");
    }
    if(isNaN(bpn)||isNaN(bp)||bpn<5||bp<=0){
        wrongfn();
    }else{
        //vrfy quality
        var bookPc = 0.75;
        qua -= sliderBox.bookPageMiss*0.2;
        qua -= sliderBox.bookCoverColor*0.045;
        qua -= sliderBox.bookPageNote*0.02;
        qua -= sliderBox.bookPageWrinkle*0.02;
        qua -= sliderBox.bookPageYellow*0.02;
        var mul = 1 - sliderBox.bookType*0.05;
        qua *= mul;
        global_qua = qua;
        //select pages randomly
        if(bpn<10){
            pageCount = bpn;
        }else if(bpn<300){
            pageCount = 5;
        }else if(bpn<1000){
            pageCount = 8;
        }else{
            pageCount = 10;
        }
        //show msgbox
        var qual = Math.round(qua*1000)/10;
        var qualStr = qual + "%";
        var highP = qua*bookPc*bp*(1.1);
        highP = parseInt(Math.round(highP*100)/100)+".00";
        var lowP = qua*bookPc*bp*(0.9);
        lowP = parseInt(Math.round(lowP*100)/100)+".00";
        while(pages.length<pageCount){
            var f = false;
            var n = Math.round(Math.random()*(bpn-1)+1);
            for(var i=0;i<pages.length;i++){
                if(n==pages[i]){
                    f = true;
                    break;
                }
            }
            if(!f){
                pages[pages.length] = n;
            }
        }
        for(var i=0;i<pages.length;i++){
            var min = i;
            for(var x=i+1;x<pages.length;x++){
                if(pages[x]<pages[min]){
                    min = x;
                }
            }
            var tmp = pages[min];
            pages[min] = pages[i];
            pages[i] = tmp;
        }
        var myPagesImage = {};
        for(var i=0;i<pages.length;i++){
            myPagesImage[pages[i].toString()] = null;
        }
        myPagesImage["0"] = null;
        myPagesImage["-1"] = null;
        pagesImage = myPagesImage;
        //add images for the next page
        var str = "请上传<b>封面</b>，第";
        var od = document.getElementById('pageUploaders');
        od.innerHTML = "";
        od.innerHTML += '<a onclick="uploadApplyImage(this,0)" tips="添加图像" onmouseover="showTooltip(this)" onmouseleave="hideTooltip(this)"><span alt="page_cover"></span><span>封面</span></a>';
        for(var i=0;i<pages.length;i++){
            str+="<b>"+pages[i]+"</b>";
            od.innerHTML += '<a onclick="uploadApplyImage(this,' + pages[i] + ')" tips="添加图像" onmouseover="showTooltip(this)" onmouseleave="hideTooltip(this)"><span alt="page_cover"></span><span>' + pages[i] + '页</span></a>';
            if(i!=pages.length-1) str+= "、";
        }
        od.innerHTML += '<a onclick="uploadApplyImage(this,-1)" tips="添加图像" onmouseover="showTooltip(this)" onmouseleave="hideTooltip(this)"><span alt="page_cover"></span><span>背面</span></a>';
        str += "页和<b>背面</b>的照片";
        document.getElementById('pageNum').innerHTML = str;
        var msgbox = document.getElementsByClassName("MsgBox")[0];
        showMsgbox(msgbox,"<h3 style=\"width:100%\">建议售卖价</h3><p style=\"width:100%\"><a xhr href=\"?help/apply/price/price_confirmation\">了解建议售卖价是如何确定的</a></p><p style=\"width:100%\">按照我们的评估，您的书质量是原来的" + qualStr + "，我们建议您将此书的价格确定在<b>" + lowP +"</b>和<b>"+ highP + "</b>之间。请在下面填写您的售卖价。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><div class=\"asbox_con\" edit style=\"margin-bottom: 8px;\"><p title>&nbsp;售卖价*</p><input class=\"asbox\" placeholder=\"销售价\" type=\"number\" min=\"5\" onfocus=\"boxstyle(this.parentElement,1)\" onblur=\"boxstyle(this.parentElement,0)\" autocomplete=\"off\" pattern=\"[0-9]*\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);confirmPrice()\" right=\"\">继续</a><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right=\"\">取消</a>");
        var inputA = msgbox.getElementsByTagName("input")[0];
        var btn = msgbox.getElementsByClassName("btn")[0];
        addEvent("keyup",function(e){
            if(e.keyCode==10||e.keyCode==13){
                document.getElementsByName("final_price")[0].value = this.value;
            }
        },inputA);
        addEvent("click",function(){
            document.getElementsByName("final_price")[0].value = inputA.value;
        },btn);
    }
}

function confirmPrice(){
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    var inputA = msgbox.getElementsByTagName("input")[0];
    var val = parseFloat(inputA.value);
    if(val&&val>=0){
        npPage(1);
    }else{
        showMsgbox(msgbox,"<h3 style=\"width:100%\">未填写必要信息或信息填写错误</h3><p style=\"width:100%\">请检查以下输入框是否已经填写完整并且没有明显的错误</p><ul><li>售卖价</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right=\"\">好的</a>")
    }
}

function uploadApplyImage(obj,pageNum){
    var fn = function(Inobj){
        var o = document.getElementById("_ld");
        var xhr = new XMLHttpRequest();
        xhr.open("POST",'.phtml/more/readDir.mode.phtml',true);
        var formData = new FormData();
        for(var i=0;i<input.files.length;i++){
            if(images.indexOf(input.files[i].name)<0){
                formData.append("files[]",input.files[i]);
            }
        }
        xhr.onreadystatechange = function(){
            var msgbox = document.getElementsByClassName("MsgBox")[0];
            if(this.readyState==4&&this.status==200){
                var data = "['']";
                try{
                    data = JSON.parse(this.responseText);
                }catch(e){
                    no_err = false;
                }
                var no_err = false;
                var err_text = "";
                for(var i=0;i<data.length;i++){
                    if(data[i]==""){
                        no_err = true;
                    }else{
                        err_text = "上传（部分）文件时出现一下错误。<br />" + data[i] + "<br />";
                    }
                }
                if(no_err){
                    var name = Inobj.files[0].name;
                    obj.children[0].style.backgroundImage = "url('Image/apply/" + randApplyAddress + "/" + name +"')";
                    pagesImage[pageNum.toString()] = name;
                }else{
                    if(this.responseText=="[]"){
                        showMsgbox(msgbox,'<h3 style="margin-bottom:5px;width:100%">上传文件时出现错误</h3><p>上传单个或多个文件出现以下错误</p><style> div.asbox_con{margin-bottom:5px;} div.asbox_con:last-child{margin-bottom:0px;}</style><div class="line" style="margin-top: 5px;"></div><p><b>上传了相同文件名的图像。</b><br/>请不要重复上传文件或上传同一个文件名的两个不同文件。</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right="" onclick="hideMsgbox(this.parentElement.parentElement)">好的</a>');
                    }else{
                        showMsgbox(msgbox,'<h3 style="margin-bottom:5px;width:100%">上传文件时出现错误</h3><p>上传单个或多个文件出现以下错误</p><style> div.asbox_con{margin-bottom:5px;} div.asbox_con:last-child{margin-bottom:0px;}</style><div class="line" style="margin-top: 5px;"></div><p>' + this.responseText + '</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right="" onclick="hideMsgbox(this.parentElement.parentElement)">好的</a>');
                    }
                }
            }else if(this.status==0){
                netErr();
            }
            if(in_array(document.body.children,input)>=0){
                document.body.removeChild(input);
            }
            o.removeAttribute("infinite");
        }
        xhr.send(formData);
    }
    var input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";
    input.accept = "image/*";
    input.id = "ifs2";
    document.body.appendChild(input);
    input.onchange = function(){
        if(randApplyAddress==""){
            newXMLHttpRequest("POST",".phtml/more/readDir.mode.phtml","key=mkRandDir&path=Image/apply",function(rspt){
                randApplyAddress = rspt;
                newXMLHttpRequest("POST",".phtml/more/readDir.mode.phtml","key=setDes&path=Image/apply/" + randApplyAddress + "/",function(){
                    fn(input);
                },function(){
                    netErr2();
                    document.body.removeChild(input);
                    o.removeAttribute("infinite");
                });
            },function(){
                netErr2();
                document.body.removeChild(input);
                o.removeAttribute("infinite");
            });
        }else{
            fn(input);
        }
    }
    $("#ifs2").click();
}

function vrfyPic(){
    for(var key in pagesImage){
        if(pagesImage[key]==null||pagesImage[key]==""){
            var msgbox = document.getElementsByClassName("MsgBox")[0];
            showMsgbox(msgbox,"<h3 style=\"width:100%\">请务必上传所有指定页数的真实照片。</h3><p style=\"width:100%\">请检查是否已经上传所有指定页面的真实照片。若是网络问题未能上传成功，请重新尝试上传。若网络持续出现问题，请刷新此页。请在保证所有图片已经上传成功后再点击“下一步”按钮。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right=\"\">好的</a>")
            return;
        }
    }
    syncInput();
    npPage(1);
}

function reverifyqua(){
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox,"<h3 style=\"width:100%\">是否重新验证质量并定价？</h3><p style=\"width:100%\">重新验证质量并定价将意味着重新填写一张新的质量验证表单，以及上传书籍图片。是否确定重新验证质量并定价？</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right=\"\">是</a><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right=\"\">否</a>");
    msgbox.getElementsByClassName("btn")[0].onclick = function(){
        goPage(2);
        npSlide(0);
        hideMsgbox(msgbox);
    }
}

function finish(){
    var inputs = document.getElementsByClassName('confirm')[0].getElementsByTagName('input');
    var bookid = global_bookid;
    var trans = encodeText(inputs[2].value);
    var pub = encodeText(inputs[3].value);
    var isbn = encodeText(inputs[4].value);
    var lang = encodeText(inputs[5].value);
    var price = inputs[9].value;
    var pages = parseInt(inputs[6].value);
    if(isNaN(price)||isNaN(pages)){
        var msgbox = document.getElementsByClassName("MsgBox")[0];
        showMsgbox(msgbox,"<h3></h3>");
        showMsgbox(msgbox,"<h3 style=\"width:100%\">填写错误</h3><p style=\"width:100%\">请检查您的页面和价格空是否正确填写。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right>好的</a>");
        return;
    }
    var usrid = usr.usrid;
    var quaObj = encodeInfo({
        "pages":pages,
        "quality_options":sliderBox,
        "quality_value":global_qua,
        "original_price":inputs[8].value,
    })
    var img = encodeInfo({
        "Path":randApplyAddress,
        "Images":pagesImage
    });
    newXMLHttpRequest('POST','.phtml/apply.php','key=recordApply&bookid='+bookid+'&trans='+trans+'&pub='+pub+'&lang='+lang+'&isbn='+isbn+'&price=' + price + '&usrid='+usrid+'&qua='+quaObj+'&img='+img,function(rspt){
        document.getElementById('lastAddressBox').href = window.location.search;
        npPage(1);
    },function(err){
        netErr2();
    });
}

//bookPageFunction
var allAplOpt = false;

function showAllAplOpt(obj){
    var con = obj.parentElement.parentElement;
    if(allAplOpt){
        con.setAttribute("h","");
        obj.innerHTML = "↓";
        obj.setAttribute("tips","显示所有供货");
    }else{
        con.removeAttribute("h");
        obj.innerHTML = "↑";
        obj.setAttribute("tips","收起所有供货");
    }
    allAplOpt = !allAplOpt;
}

function selectApply(id,obj){
    var objcon = document.getElementById("numAprice");
    var objNum = objcon.children[0];
    var objPrice = objcon.children[1].children[0];
    var c2btnscon = objcon.children[3].children;
    var c2btns = [c2btnscon[1].children[0],c2btnscon[2].children[0]];
    obj.setAttribute("pre-selected","");
    newXMLHttpRequest('POST','.phtml/apply.php','key=getPrice&id='+id,function(rspt){
        if(rspt!=""){
            obj.removeAttribute("pre-selected");
            if(obj.hasAttribute("selected")){
                obj.removeAttribute("selected");
                var objVal = parseFloat(objPrice.value) - parseFloat(rspt);
                objPrice.value = objVal.toFixed(2);
            }else{
                obj.setAttribute("selected","");
                var objVal = parseFloat(objPrice.value) + parseFloat(rspt);
                objPrice.value = objVal.toFixed(2);
            }
            var selectedNum = 0;
            var objs = obj.parentElement.children;
            for(var i=0;i<objs.length;i++){
                if(objs[i].hasAttribute("selected")) selectedNum++;
            }
            objNum.innerHTML = "选中数量:" + selectedNum + " | 价格";
            if(selectedNum==0){
                c2btns[0].setAttribute("disabled","");
                c2btns[0].removeAttribute("onclick");
                c2btns[1].setAttribute("disabled","");
                c2btns[1].removeAttribute("onclick");
            }else{
                if(c2btns[0].hasAttribute("disabled")) c2btns[0].removeAttribute("disabled");
                if(c2btns[1].hasAttribute("disabled")) c2btns[1].removeAttribute("disabled");
                if(!c2btns[0].hasAttribute("onclick")) c2btns[0].setAttribute("onclick","addToCart()");
                if(!c2btns[1].hasAttribute("onclick")) c2btns[1].setAttribute("onclick","buy()");
            }
        }else{
            obj.removeAttribute("pre-selected");
            netErr2();
        }
    },function(){
        obj.removeAttribute("pre-selected");
        netErr2();
    });
}

function selectAplDsc(id,obj){
    var c = obj.parentElement.children;
    var idx = in_array(c,obj);
    for(var i=0;i<c.length;i++){
        var iobj = c[i];
        if(i==idx){
            obj.setAttribute("pre-selected","");
        }else{
            if(iobj.hasAttribute("selected")){
                iobj.removeAttribute("selected");
            }
            if(iobj.hasAttribute("pre-selected")){
                iobj.removeAttribute("pre-selected");
            }
            if(iobj.hasAttribute("null-selected")){
                iobj.removeAttribute("null-selected");
            }
        }
    }
    newXMLHttpRequest('POST','.phtml/apply.php','key=getApply&id='+id,function(rspt){
        var aObj = JSON.parse(rspt);
        currentApply = aObj;
        var starClassList = ["star0d0","star0d5","star1d0","star1d5","star2d0","star2d5","star3d0","star3d5","star4d0","star4d5","star5d0"];
        var evaWordList = ["非常差","很差","差","较差","中等偏差","中等","中等偏好","较好","良好","非常好","一级棒"];
        var detailBoxHtml = "<div class=\"detail\" whiteboard><div class=\"whiteboard\"><div class=\"row\" half><a class=\"sword\">语言</a><p class=\"sword\">" + aObj.lang + "</p></div><div class=\"row\" half><a class=\"sword\">出版社</a><p class=\"sword\">" +aObj.publish  + "</p></div>";
        detailBoxHtml += "<div class=\"row\" half><a class=\"sword\">书本页数</a><p class=\"sword\">"+aObj.quality.pages+"</p></div>";
        if(aObj.ISBN!="") detailBoxHtml += "<div class=\"row\" half><a class=\"sword\">ISBN</a><p class=\"sword\">" + aObj.ISBN + "</p></div>";
        if(aObj.translator!="") detailBoxHtml += "<div class=\"row\" half><a class=\"sword\">译者</a><p class=\"sword\">" + aObj.translator + "</p></div>";
        var oindex = Math.round(aObj.evanum);
        var usrcls = starClassList[oindex];
        var usrwd = aObj.empty_eva?"暂无评价":evaWordList[oindex];
        var usreva = aObj.empty_eva?"(无)":(aObj.evanum/2).toFixed(1);
        var dlvAddr = aObj.udlvinfo.address;
        var tel = aObj.udlvinfo.phone_number;
        var email = aObj.email;
        var sch = aObj.udlvinfo.sch_allow?"允许":"不可用";
        var schHTML = "";
        if(aObj.udlvinfo.sch_allow) schHTML = "<div class=\"row\" half><a class=\"sword\">学校发货地址</a><p class=\"sword\">" + aObj.udlvinfo.sch + "</p></div>"
        var sdays = aObj.udlvinfo.sdays?"<div class=\"row\" half><a class=\"sword\" green-white>七天无理由退货</a></div>":"";
        var qua = aObj.quality.quality_value;
        var fsStr = "";
        if(qua>=1){
            fsStr = "全新";
        }else{
            qua = Math.round(qua*20)*5;
            var f = parseInt(qua/10);
            var s = qua%10;
            var fsStr = f + "成";
            if(s!=0) fsStr += s;
            fsStr += "新";
        }
        var imgHTML = "";
        var imgPath = aObj.images.Path;
        for (imgkey in aObj.images.Images){
            var imgName = aObj.images.Images[imgkey];
            imgHTML += "<img src=\"Image/apply/" + imgPath + "/" + imgName + "\">";
        }
        var evaHtml = aObj.empty_eva?"<p style='position:relative;float:left;margin-left:5px;color:#202122;'>暂无评价</font>":"";
        if(!aObj.empty_eva){
            var aplEva = aObj["evaluations"];
            var usrid = aObj["evaluations"][0]["usrid"];
            for(x=0;x<aplEva.length;x++){
                var com = decodeURI(aplEva[x]["contents"]);
                if(com=="") com = "(此用户未写评价内容)";
                var usrname2 = aplEva[x]["usrname"];
                if(usrname2=="") usrname2 = "<font style='color:#757575'>(匿名用户)</font>";
                var evanum = parseInt(aplEva[x]["evanum"]);
                var className = starClassList[evanum];
                var starHtml = "<i class='"+className+"'></i>";
                var confirmHtml = aplEva[x]["confirmed"]==1?"<font style='color:#800080;font-weight:bold'>确认收货</font>":"";
                evaHtml += "<div class=\"row\" style=\"margin-top:5px;\"><div><a class=\"sword\">"+usrname2+"</a>"+starHtml+" "+confirmHtml+"</div><p>"+com+"</p></div>";
            }
            var Tp = aObj["evaluation_page"];
            var Cp = 1;
            var Np = Cp+1;
            var Pp = Cp-1;
            var PagePrevAttr = Cp>1?"onclick=\"showAplBookEva('"+usrid+"',"+Pp+")\"":"disabled";
            var PageNextAttr = Cp<Tp?"onclick=\"showAplBookEva('"+usrid+"',"+Np+")\"":"disabled";
            var PageLastAttr = Cp<Tp?"onclick=\"showAplBookEva('"+usrid+"',"+Tp+")\"":"disabled";
            evaHtml += "<div class=\"row\" page style=\"margin-top: 10px\"><a "+PagePrevAttr+">上一页</a><a style=\"color:#202122\">第1页 共"+Tp+"页</a><a "+PageNextAttr+">下一页</a>&nbsp;<a "+PageLastAttr+">转到最后一页</a></div>";
            evaHtml = "<div class='evaluation' id='evaluation0'>"+evaHtml+"</div>";
        }
        var abuseHtml = "";
        if(typeof usr.usrid!="undefined"&&usr.usrid!=""){
            if(usr.usrid!=aObj.usrid) abuseHtml = "&nbsp;<a href=\"javascript:;\" style=\"color:#800080\" onclick=\"reportAbuse('" + aObj.email + "',"+id+")\">投诉商家</a>";   
        }
        detailBoxHtml += "<div class=\"line\" style=\"margin-top: 0px;\"></div><div class=\"row\" half><a class=\"sword\">供货商</a><p class=\"sword\">" + aObj.udlvinfo.name + "</p><a><i class=\"" + usrcls + "\"></i>&nbsp;" + usreva + " 分 " + usrwd + "</a></div><div class=\"row\" half><a class=\"sword\">发货地址</a><p class=\"sword\">" + dlvAddr + "</p></div><div class=\"row\" half><a class=\"sword\">相同学校收货</a><p class=\"sword\">" + sch + "</p></div>" + schHTML + sdays + "<div class=\"row\" half><a class=\"sword\">新旧程度</a><p class=\"sword\">" + fsStr + "</p></div><div class=\"row\" half><a class=\"sword\">联系方式 - 电话</p><a class=\"sword\">" + tel + "</a></div><div class=\"row\" half><a class=\"sword\">联系方式 - 电子邮件</p><a class=\"sword\">" + email + "</a></div><div class=\"row\" style=\"line-height: normal;\"><p class=\"sword\">实物图片&nbsp;<a href=\"javascript:;\" onclick=\"showApplyPicture('"+id+"')\">查看书本图片及细则</a>"+abuseHtml+"</p><div class=\"_all_image\" style=\"width:99.5%;margin-top: 0px;float: right;\"><div class=\"_images_con2\" onclick=\"showApplyPicture("+id+")\">" + imgHTML + "</div></div></div><div class=\"line\" style=\"margin-top: 0px;\"></div><div class=\"row\"><a class=\"sword\" style='margin-left:0'>客户对供货商的评价</a><p class=\"sword\">" + aObj.udlvinfo.name + "</p></div>" + evaHtml + "</div>";
        detailBoxHtml += "</div>";
        document.getElementById("detailCon").innerHTML = detailBoxHtml;
        for(var i=0;i<c.length;i++){
            var iobj = c[i];
            if(i==idx){
                obj.removeAttribute("pre-selected");
                obj.setAttribute("selected","");
            }else{
                if(iobj.hasAttribute("selected")){
                    iobj.removeAttribute("selected");
                }
                if(iobj.hasAttribute("pre-selected")){
                    iobj.removeAttribute("pre-selected");
                }
                if(iobj.hasAttribute("null-selected")){
                    iobj.removeAttribute("null-selected");
                }
            }
        }
    },function(){
        obj.removeAttribute("pre-selected");
        obj.setAttribute("null-selected","");
        netErr2();
    });
}

function showApplyPicture(aplid){
    newXMLHttpRequest("POST",".phtml/apply.php","key=getApplyPic&id="+aplid,function(rspt){
        var d = JSON.parse(rspt);
        var name = decodeURI(d["names"]);
        while(name.indexOf("%2F")>=0) name = name.replace("%2F","/");
        var dh = decodeInfo(d["images"]);
        var picpath = dh.Path;
        var pan = document.getElementById("picture_panel");
        var vb = document.getElementById("viewBox");
        var titlebox = document.getElementById("consBox").children[0].children[0];
        titlebox.innerHTML = name;
        var pb = document.getElementsByClassName("picboxes")[0];
        pb.innerHTML = "";
        for(var k in dh.Images){
            var word = "";
            if(k==0){
                word="封面";
            }else if(k==-1){
                word="背面";
            }else{
                word="第"+k+"页";
            }
            pb.innerHTML += "<a class=\"picbox\" onclick=\"selectAplPic(this)\" pageNum='"+k+"'><img src=\"Image/apply/" + picpath + "/" + dh.Images[k]+"\"><span class='pageNum'>" + word + "</span></a>";
        }
        //start combining word
        var echi = decodeInfo(d["quality"])["quality_options"];
        var echiArr = [echi.bookType,echi.bookCoverColor,echi.bookPageMiss,echi.bookPageWrinkle,echi.bookPageYellow,echi.bookPageNote];
        var descriHtml = "";
        for(var i=0;i<echiArr.length;i++){
            descriHtml += "<span row>" + quesBank.mainQues[i] + ":<span val>" + quesBank.mainAnswer[i][echiArr[i]] + "</span></span>";
        }
        document.getElementsByClassName("descri")[0].innerHTML = descriHtml;
        //end combining word
        pb.children[0].click();
        vb.children[0].children[0].src = pb.children[0].children[0].src;
        var warn = document.getElementsByClassName('warning');
        warn[0].parentElement.style.display = "block";
        warn[0].style.display = "none";
        warn[1].style.display = "block";
        warn[1].children[0].setAttribute("onclick","reportAbuse('"+d.usrid+"',"+aplid+")");
        if(d.usrid==usr.usrid){
            warn[1].children[0].style.display = "none";
        }else{
            warn[1].children[0].style.display = "";
        }
        pan.style.display = "block";
        document.body.style.overflow = "hidden";
    },function(stObj){
        if(stObj.status==0){
            advice="请确保您已经联网";
        }else if(stObj.status==403){
            advice="请确保您有权限访问此页面";
        }else if(stObj.status==404||stObj.status==500){
            advice="请确保所访问路径没有错误";
        }
        showMsgbox(msgbox,'<h3 style="width:100%">网络错误</h3><p>访问网络时遇到错误，页面返回代码：' + stObj.status + '，' + advice + '。</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>好的</a>');
    });
}

function selectAplPic(obj){
    var p = obj.parentElement.children;
    var ind = in_array(p,obj);
    for(var i=0;i<p.length;i++){
        if(i==ind){
            p[i].setAttribute("selected","");
        }else{
            p[i].removeAttribute("selected");
        }
    }
    var vb = document.getElementById("viewBox");
    vb.children[0].children[0].src = obj.children[0].src;
    var word = "";
    if(obj.getAttribute("pageNum")==0){
        word="封面";
    }else if(obj.getAttribute("pageNum")==-1){
        word="背面";
    }else{
        word="第"+obj.getAttribute("pageNum")+"页";
    }
}

function delApply(obj,id){
    newXMLHttpRequest("POST",".phtml/apply.php","key=delApply&id="+id+"&prlg=allow",function(rspt){
        var table = obj.parentElement.parentElement.parentElement;
        obj.parentElement.parentElement.outerHTML = "";
        if(table.childElementCount==0){
            table.innerHTML += "<td colspan=\"7\" style=\"text-align: center;background-color: #f2f4f6;\">(没有供货)</td>";
        }
    },function(){
        netErr2();
    });
}

function updateAplPrice(obj,id){
    var oriprice = 0;
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    showMsgbox(msgbox,"<h3 style=\"width:100%\">商品原价</h3><p style=\"width:100%\">填写商品原始价格或书籍在其他购物网站的价格。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><div class=\"asbox_con\" edit style=\"margin-bottom: 8px;\"><p title>&nbsp;售卖价*</p><input class=\"asbox\" placeholder=\"销售价\" type=\"number\" pattern=\"[0-9]*\" min=\"5\" onfocus=\"boxstyle(this.parentElement,1)\" onblur=\"boxstyle(this.parentElement,0)\" autocomplete=\"off\" pattern=\"[0-9]*\"></div><a class=\"btn\">确认</a><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right>取消</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    var input = msgbox.getElementsByTagName("input")[0];
    btn.onclick = function(){
        oriprice = parseFloat(input.value);
        if(isNaN(oriprice)||oriprice<=0){
            shakeBox(input,"leftRight",4,100,20);
            input.setAttribute('tips','<font size="4" err>价格格式不正确且价格不能为空</font>');
            mx = input.getClientRects()[0].left;
            my = input.getClientRects()[0].top + 20;
            showTooltip(input);
            btn.innerText = "再试一次";
            return;
        }else{
            hideTooltip();
            input.removeAttribute("tips");
        }
        newXMLHttpRequest('POST',".phtml/apply.php","key=getAplQua&id="+id,function(rspt){
            var d = JSON.parse(rspt);    
            var qua = d.quality_value;
            var bookPc = 0.75;
            var bp = oriprice;
            var qual = Math.round(qua*1000)/10;
            var qualStr = qual + "%";
            var highP = qua*bookPc*bp*(1.1);
            highP = parseInt(Math.round(highP*100)/100)+".00";
            var lowP = qua*bookPc*bp*(0.9);
            lowP = parseInt(Math.round(lowP*100)/100)+".00";
            showMsgbox(msgbox,"<h3 style=\"width:100%\">建议售卖价</h3><p style=\"width:100%\"><a xhr href=\"?help/apply/price/price_confirmation\">了解建议售卖价是如何确定的</a></p><p style=\"width:100%\">按照我们的评估，您的书质量是原来的" + qualStr + "，我们建议您将此书的价格确定在<b>" + lowP +"</b>和<b>"+ highP + "</b>之间。请在下面填写您的售卖价。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><div class=\"asbox_con\" edit style=\"margin-bottom: 8px;\"><p title>&nbsp;售卖价*</p><input class=\"asbox\" placeholder=\"销售价\" type=\"number\" min=\"5\" onfocus=\"boxstyle(this.parentElement,1)\" onblur=\"boxstyle(this.parentElement,0)\" autocomplete=\"off\" pattern=\"[0-9]*\"></div><a class=\"btn\">确认</a><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right>取消</a>");
            btn = msgbox.getElementsByClassName("btn")[0];
            input = msgbox.getElementsByTagName("input")[0];
            var confirm = function(){
                var rprice = parseFloat(input.value);
                if(isNaN(rprice)||rprice<=0){
                    shakeBox(input,"leftRight",4,100,20);
                    input.setAttribute('tips','<font size="4" err>价格格式不正确且价格不能为空</font>');
                    mx = input.getClientRects()[0].left;
                    my = input.getClientRects()[0].top + 20;
                    showTooltip(input);
                    btn.innerText = "再试一次";
                    return;
                }else{
                    hideTooltip();
                    input.removeAttribute("tips");
                }
                newXMLHttpRequest("POST",".phtml/apply.php","key=updateAplPrice&id="+id+"&price="+rprice,function(){
                    obj.parentElement.parentElement.children[4].innerHTML = "￥"+rprice.toFixed(2);
                    hideMsgbox(msgbox);
                },function(){
                    netErr2();
                });
                hideMsgbox(obj)
            }
            btn.onclick = function(){confirm()};
            input.onkeydown = function(e){
                var evt = e || window.event;
                if(evt.keyCode==13||evt.keyCode==10){
                    confirm();
                }
            }
        },function(){
            netErr2();
        });
    }
    input.onkeydown = function(e){
        var evt = e || window.event;
        if(evt.keyCode==13||evt.keyCode==10){
            btn.onclick();
        }
    }
}

function updateAplPic(aplid){
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    var vrfyPic = function(){
        for(var key in pagesImage){
            if(pagesImage[key]==null||pagesImage[key]==""){
                var msgbox = document.getElementsByClassName("MsgBox")[0];
                showMsgbox(msgbox,"<h3 style=\"width:100%\">请务必上传所有指定页数的真实照片。</h3><p style=\"width:100%\">请检查是否已经上传所有指定页面的真实照片。若是网络问题未能上传成功，请重新尝试上传。若网络持续出现问题，请刷新此页。请在保证所有图片已经上传成功后再点击“下一步”按钮。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right=\"\">好的</a>")
                return;
            }
        }
        var imageObj = {"Path":randApplyAddress,"Images":pagesImage};
        var imageInfo = encodeInfo(imageObj);
        newXMLHttpRequest("POST",".phtml/apply.php","key=updateApplyPic&id="+aplid+"&images="+imageInfo,function(){
            var msgbox = document.getElementsByClassName('MsgBox')[0];
            showMsgbox(msgbox,"<h3 style=\"width:100%\">成功更改供货图片</h3><p style=\"width:100%\">成功更供货的图片。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right>好的</a>");
        },function(){
            netErr2();
        });
    }
    newXMLHttpRequest("POST",".phtml/apply.php","key=getApplyPic&id="+aplid,function(rspt){
        var data = JSON.parse(rspt);
        imageData = decodeInfo(data.images);
        pagesImage = imageData.Images;
        randApplyAddress = imageData.Path;
        newXMLHttpRequest("POST",".phtml/more/readDir.mode.phtml","key=setDes&path=Image/apply/" + randApplyAddress + "/",function(){
            var pageUpHtml = "";
            for(var key in pagesImage){
                var pageStr = "";
                var img = pagesImage[key];
                if(key==0){
                    pageStr = "封面";
                }else if(key==-1){
                    pageStr = "背面";
                }else{
                    pageStr = key+"页";
                }
                pageUpHtml += '<a onclick="uploadApplyImage(this,' + key + ')" tips="更改图像" onmouseover="showTooltip(this)" onmouseleave="hideTooltip(this)"><span alt="page_cover" style=\'background-image:url("Image/apply/'+randApplyAddress+'/'+img+'")\'></span><span>' + pageStr + '</span></a>';
            }
            showMsgbox(msgbox,"<h3 style=\"width:100%\">更改供货图片</h3><p style=\"width:100%\">当前正在更改名为 <strong>"+data.names+"</strong> 的供货，在您要更改的页面上点击一下以上传图片。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><div class=\"rinnerCon\" upload id=\"pageUploaders\">"+pageUpHtml+"</div><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\">确认</a><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right>取消</a>");
            var btn = msgbox.getElementsByClassName("btn")[0];
            btn.onclick = function(){
                vrfyPic();
            }
        },function(){
            netErr2();
        });
    },function(){
        netErr2();
    });
}

function deleteAplSelect(){
    var st = document.getElementById('apply_table').getElementsByTagName("tr");
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    var count = 0;
    for(var i=0;i<st.length;i++){
        if(!(st[i].hasAttribute("id")&&st[i].getAttribute("selected")=="true")) continue;
        count++;
    }
    if(count==0){
        showMsgbox(msgbox,"<h3 style=\"margin-bottom:5px;width:100%\">没有选中任何供货</h3><p>请选择想要删除的供货后再试一次。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">好的</a>");    
        return;
    }
    showMsgbox(msgbox,"<h3 style=\"margin-bottom:5px;width:100%\">确认删除选中的所有供货？</h3><p>此操作无法撤回。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>确认</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">取消</a>");
    msgbox.getElementsByClassName("btn")[0].onclick = function(){
        var fault = false;
        for(var i=0;i<st.length;i++){
            if(!(st[i].hasAttribute("id")&&st[i].getAttribute("selected")=="true")) continue;
            var p = st[i].getElementsByClassName('del');
            if(p.length>0){
                p[0].click();
            }else{
                fault = true;
            }
        }
        if(!fault){
            hideMsgbox(msgbox);
        }else{
            showMsgbox(msgbox,"<h3 style=\"margin-bottom:5px;width:100%\">删除时出现一个或多个错误</h3><p>一个或多个选中供货已售出，无法删除。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">好的</a>");
        }

    }
}

function showBookEva(bookid,page){
    var dom = document.getElementById("evaluation1");
    dom.innerHTML = "<span class='bottomA'></span>";
    var rpage = page-1;
    newXMLHttpRequest("POST",".phtml/apply.php","key=getBookEvaluation&id="+bookid+"&page="+rpage,function(rspt){
        dom.innerHTML = "";
        var data = JSON.parse(rspt);
        var evaData = data["data"];
        var starClassList = ["star0d0","star0d5","star1d0","star1d5","star2d0","star2d5","star3d0","star3d5","star4d0","star4d5","star5d0"];
        for(var i=0;i<evaData.length;i++){
            var com = decodeURI(evaData[i]["contents"]);
            if(com=="") com = "(此用户未写评价内容)";
            var usrname = evaData[i]["usrname"];
            if(usrname=="") usrname = "<font style='color:#757575'>(匿名用户)</font>";
            var evanum = parseInt(evaData[i]["evanum"]);
            var className = starClassList[evanum];
            starHtml = "<i class='"+className+"'></i>";
            dom.innerHTML += "<div class=\"row\" style=\"margin-top:5px;\"><div><a class=\"sword\">"+usrname+"</a>"+starHtml+"</div><p>"+com+"</p></div>";
        }
        //page control
        var Tp = data["page_count"];
        var Cp = page;
        var Np = Cp+1;
        var Pp = Cp-1;
        var PagePrevAttr = Cp>1?"onclick='showBookEva("+bookid+","+Pp+")'":"disabled";
        var PageNextAttr = Cp<Tp?"onclick='showBookEva("+bookid+","+Np+")'":"disabled";
        var PageLastAttr = Cp<Tp?"onclick='showBookEva("+bookid+","+Tp+")'":"disabled";
        dom.innerHTML += "<div class=\"row\" page style=\"margin-top: 10px\" id='evabookpage'><a "+PagePrevAttr+">上一页</a><a style=\"color:#202122\">第"+page+"页 共"+Tp+"页</a><a "+PageNextAttr+">下一页</a>&nbsp;<a "+PageLastAttr+">转到最后一页</a></div>";
    },function(){
        dom.innerHTML = "";
        dom.innerHTML = "<div class='row' style='width:100%;text-align:center'>没有网络，尝试<a style='float:none' onclick='showBookEva("+bookid+","+page+")'>重新加载</a>。</div>";
        netErr2();
    });
}

function showAplBookEva(usrid,page){
    var dom = document.getElementById("evaluation0");
    dom.innerHTML = "<span class='bottomA'></span>";
    var rpage = page-1;
    newXMLHttpRequest("POST",".phtml/apply.php","key=getApplyEvaluation&id="+usrid+"&page="+rpage,function(rspt){
        dom.innerHTML = "";
        var data = JSON.parse(rspt);
        var evaData = data["data"];
        var starClassList = ["star0d0","star0d5","star1d0","star1d5","star2d0","star2d5","star3d0","star3d5","star4d0","star4d5","star5d0"];
        for(var i=0;i<evaData.length;i++){
            var com = decodeURI(evaData[i]["contents"]);
            if(com=="") com = "(此用户未写评价内容)";
            var usrname = evaData[i]["usrname"];
            if(usrname=="") usrname = "<font style='color:#757575'>(匿名用户)</font>";
            var evanum = parseInt(evaData[i]["evanum"]);
            var className = starClassList[evanum];
            starHtml = "<i class='"+className+"'></i>";
            dom.innerHTML += "<div class=\"row\" style=\"margin-top:5px;\"><div><a class=\"sword\">"+usrname+"</a>"+starHtml+"</div><p>"+com+"</p></div>";
        }
        //page control
        var Tp = data["page_count"];
        var Cp = page;
        var Np = Cp+1;
        var Pp = Cp-1;
        var PagePrevAttr = Cp>1?"onclick=\"showAplBookEva('"+usrid+"',"+Pp+")\"":"disabled";
        var PageNextAttr = Cp<Tp?"onclick=\"showAplBookEva('"+usrid+"',"+Np+")\"":"disabled";
        var PageLastAttr = Cp<Tp?"onclick=\"showAplBookEva('"+usrid+"',"+Tp+")\"":"disabled";
        dom.innerHTML += "<div class=\"row\" page style=\"margin-top: 10px\" id='evabookpage'><a "+PagePrevAttr+">上一页</a><a style=\"color:#202122\">第"+page+"页 共"+Tp+"页</a><a "+PageNextAttr+">下一页</a>&nbsp;<a "+PageLastAttr+">转到最后一页</a></div>";
    },function(){
        dom.innerHTML = "";
        dom.innerHTML = "<div class='row' style='width:100%;text-align:center'>没有网络，尝试<a style='float:none' onclick='showBookEva("+bookid+","+page+")'>重新加载</a>。</div>";
        netErr2();
    });
}

function redeemBook(bookid){
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    var selectedData = [];
    var updateDlv = function(receipt){
        //check if there is a pay passcodev
        var paypasscode = usr.pwd.split(":")[1];
        if(paypasscode==""){
            showMsgbox(msgbox,"<h3 style=\"width:100%\">您未有支付密码，请新增支付密码以继续。</h3><p style=\"width:100%\">使用DeCoins积分需要支付密码，请点击‘确定’按钮新建支付密码后继续完成兑换操作。<a xhr style=\"float:none\" href=\"?help/purchase/consumer_conflict\">点击这里查看详细信息</a>。</p><div class=\"radioCon\" style=\"margin-top:5px\">"+missListHtml+"</div><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>确认</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">取消</a>");
            showUpdatePassword1(function(){
                updateDlv2(receipt);
            });
        }else{
            showMsgbox(msgbox,'<h3 style="margin-bottom:5px;width:100%">输入支付密码</h3><p>输入支付密码以支付DeCoins积分</p><div class="line" style="margin-top: 5px;"></div>\<div class="split_input"><div class="asbox_con"><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1"></div><div class="asbox_con"><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1"></div><div class="asbox_con"><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1"></div><div class="asbox_con"><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1"></div><div class="asbox_con"><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1"></div><div class="asbox_con"><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1"></div></div><div class="line" style="margin-top: 5px;"></div><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">取消</a>');
            var d = msgbox.getElementsByClassName('split_input')[0];
            makeSplitInput(d);
            var l = d.lastElementChild.children[0];
            l.onkeyup = function(){
                if(l.value.length>0){
                    var pwdp = $.md5(getSplitInputValue(d));
                    if(pwdp==paypasscode){
                        updateDlv2(receipt);
                    }else{
                        shakeBox(d.children[0],"leftRight",3,50,10);
                        btn.innerHTML = "再试一次";
                        d.setAttribute('tips','<font size="4" err>密码不正确</font>');
                        mx = d.getClientRects()[0].left;
                        my = d.getClientRects()[0].top + 20;
                        showTooltip(d);
                        window.setTimeout(function(){
                            hideTooltip(input);
                        },1000);
                    }
                }
            }
        }
    }
    var updateDlv2 = function(receipt){
        newXMLHttpRequest("POST",".phtml/deliver.php","key=generateSpecialOrder&id="+strJson(selectedData)+"&receipt="+receipt+"&usrid="+usr.usrid,function(rspt){
            var dat = JSON.parse(rspt);
            if(dat["coins_err"]==1){
                showMsgbox(msgbox,"<h3 style=\"width:100%\">兑换商品失败</h3><p style=\"width:100%\">兑换以下商品时失败，因为您的DeCoins积分仅有"+dat["coins_me"]+"，而兑换所有选中的书籍需要"+dat["coins_needed"]+"DeCoins积分。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">好</a>");
                return;
            }
            window.setTimeout(function(){
                var data = dat["miss"];
                if(data.length>0){ 
                    var missListHtml = "";
                    for(var i=0;i<data.length;i++){
                        var aurstr = "";
                        var count = 0;
                        if(!data[i].hasOwnProperty("bookAuthor")) continue;
                        for(var x=0;x<data[i].bookAuthor.length;x++){
                            count++;
                            if(x>3) continue;
                            aurstr+=data[i].bookAuthor[x]+";";
                        }
                        if(count>3){
                            aurstr+=aurstr.substr(0,aurstr.length-1)+"等";
                        }
                        missListHtml += "<a class=\"radioBox\" href=\"javascript:;\"><input class=\"asbox\" type=\"radio\" onclick=\"selectDlvRadio(this.parentElement)\"><span style=\"background-image:url('Image/fatcow/error.png')\"></span><p>"+data[i].bookName+" "+aurstr+"著 ("+data[i].lang+" "+data[i].publish+")<br/>价格: <b>"+parseFloat(data[i].price).toFixed(2)+"</b>; 供货人 <b>"+data[i].udlvinfo.name+"</b></p></a>";
                    }
                    showMsgbox(msgbox,"<h3 style=\"width:100%\">兑换商品失败</h3><p style=\"width:100%\">兑换以下商品时失败，因为以下商品已经被其他顾客购买或已被销售者删除。<a xhr style=\"float:none\" href=\"?help/purchase/consumer_conflict\">点击这里查看详细信息</a>。</p><div class=\"radioCon\" style=\"margin-top:5px\">"+missListHtml+"</div><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">好</a>");
                }else{
                    showMsgbox(msgbox,"<h3 style=\"width:100%\">商品兑换成功</h3><p style=\"width:100%\">已支付DeCoins积分 <span class=\"price\">"+dat["coins"]+"</span>。兑换的商品不需要手动联系卖家，请耐心等待DeBook为您发货。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">好</a>");
                }
                gotoPage("?account");
                putHis("","","?account");
            },100);
        },function(){
            netErr2();
        });
    }
    var loadSelectedData = function(){
        var obj = msgbox.getElementsByClassName("row")[0];
        selectedData = [];
        var p = 0;
        var q = 0;
        var c = obj.children;
        for(var i=0;i<c.length;i++){
            if(c[i].hasAttribute("selected")){
                selectedData[selectedData.length] = c[i].getAttribute("dataid");
                p+=parseFloat(c[i].getAttribute("data-price"));
                q++;
            }
        }
        var pqbox = document.getElementById("redeemPQ");
        pqbox.innerHTML = p.toFixed(2)+" DeCoins积分 ("+q+"件), <font style='color:#0366d6'>余额:"+parseInt(usr.coins).toFixed(2)+"</font>";
        var btn = msgbox.getElementsByClassName("btn")[0];
        if(q==0||p>usr.coins){
            btn.setAttribute("disabled","");
            btn.onclick = null;
        }else{
            btn.removeAttribute("disabled");
            btn.onclick = function(){
                //select a location and generate order
                var addr = usr.receipt_info;
                var addrHtml = "";
                addr = addr.split(":");
                var count=0;
                for(var i=0;i<addr.length;i++){
                    if(addr[i]=="") continue;
                    var data = decodeInfo(addr[i]);
                    var address = data.address.length>16?data.address.substr(0,3)+"..."+data.address.substr(data.address.length-10):data.address
                    var isDefault = data.id.indexOf("|A")==1;
                    var defaultStr = isDefault?" <font default>(默认)</font>":"";
                    var selectedStr = isDefault?"selected":"";
                    var selectedStr2 = isDefault?"checked":"";
                    var tele = data.tele.substr(0,3)+"****"+data.tele.substr(7);
                    var email = "***"+data.email.substr(data.email.indexOf("@")-4,4)+"@"+data.email.substr(data.email.indexOf("@")+1);
                    addrHtml += "<a class=\"radioBox\" href=\"javascript:;\" onclick=\"selectDlvRadio(this)\""+selectedStr+" id='"+data.id+"'><input class=\"asbox\" type=\"radio\" onclick=\"selectDlvRadio(this.parentElement)\" "+selectedStr2+"><span></span><p>"+address+" (<b>"+data.name+"</b>收)"+defaultStr+"<br/>联系方式: <b>"+tele+"</b>(电话); <b>"+email+"</b>(电子邮件)";
                    addrHtml += "</p></a>";
                    count++;
                }
                addrHtml += "<a class=\"radioBox\"><input class=\"asbox\" type=\"radio\"><span style=\"background-image:url('Image/fatcow/add.png')\"></span><p>点击这里添加新的收货地址以及收货人信息</p></a>";
                var msgbox = document.getElementsByClassName("MsgBox")[0];
                var confirmBtn = count>0?"<a class=\"btn\" right>确认</a>":"";
                showMsgbox(msgbox,"<h3 style=\"width:100%\">选择收货地址</h3><p style=\"width:100%\">选择您的收货地址</p><div class=\"radioCon\" style=\"margin-top:5px\">"+addrHtml+"</div><div class=\"line\" style=\"margin-top: 5px;\"></div>"+confirmBtn+"<a class=\"btn\" right=\"\" onclick=\"hideMsgbox(this.parentElement.parentElement)\">取消</a>");
                var binput = msgbox.getElementsByTagName("input");
                for(var i=0;i<binput.length;i++){
                    binput[i].onclick = function(){
                        return false;
                    }
                }
                var btn = msgbox.getElementsByClassName("btn")[0];
                var laddrBtn = msgbox.getElementsByClassName("radioBox");
                laddrBtn = laddrBtn[laddrBtn.length-1];
                laddrBtn.onclick = function(){
                    showUpdateReceiptMethod(null,function(rspt){
                        updateDlv(rspt);
                    });
                }
                if(count==0) return;
                btn.onclick = function(){
                    var con = msgbox.getElementsByClassName("radioCon")[0].children;
                    var conid = "";
                    for(var i=0;i<con.length;i++){
                        if(con[i].hasAttribute("selected")){
                            conid = con[i].getAttribute("id");
                            break;
                        }
                    }
                    if(conid=="") return
                    var receipt_info = "";
                    for(var i=0;i<addr.length;i++){
                        if(addr[i]=="") continue;
                        if(decodeInfo(addr[i]).id==conid){
                            receipt_info = addr[i];
                            break;
                        }
                    }
                    updateDlv(receipt_info);
                }
            }
        }
    }
    var selectRedeem = function(obj){
        if(obj.hasAttribute("selected")){
            obj.removeAttribute("selected");
        }else{
            obj.setAttribute("selected","");
        }
        loadSelectedData();
    }
    newXMLHttpRequest("POST",".phtml/apply.php","key=getRedeem&bookid="+bookid,function(rspt){
        var data = JSON.parse(rspt);
        var aplHTML = "";
        for(var i=0;i<data.length;i++){
            var aplinfo = data[i];
            var imgData = decodeInfo(aplinfo.images);
            var publish = decodeText(aplinfo.publish);
            var lang = decodeText(aplinfo.lang);
            var price = aplinfo.price;
            var quality = generateQuaText(decodeInfo(aplinfo.quality)["quality_value"]);
            var aplid = aplinfo.aplid;
            aplHTML += "<div class=\"bokinfo\" dataid='"+aplid+"' data-price='"+price+"'><a img_select><div></div><div></div></a><a style=\"cursor:pointer\"><img src=\"Image/apply/"+imgData.Path+"/"+imgData.Images[0]+"\" alt=\"书籍图片\"></a><a style=\"cursor:pointer\"><p bok-title><font>"+lang+"</font> "+publish+"</p></a><div class=\"price\">"+quality+" <font>"+price+"</font></div></div>";
        }
        //show msg
        showMsgbox(msgbox,"<h3 style=\"margin-bottom:5px;width:100%\">选择您想要兑换的版本</h3><p>从以下书籍中选择要兑换的版本</p><div class=\"line\" style=\"margin-top: 5px;\"></div><div class=\"rinnerCon\" upload id=\"pageUploaders\"><div class=\"row\" scroll-row>"+aplHTML+"</div></div><div class=\"line\" style=\"margin-top: 5px;\"></div><p id='redeemPQ'>0.00 DeCoins积分 (0件), <font style='color:#0366d6'>余额:"+parseFloat(usr.coins).toFixed(2)+"</font></p><a class=\"btn\" right disabled>确认</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">取消</a>");    
        var obj = msgbox.getElementsByClassName("row")[0];
        var c = obj.children;
        for(var i=0;i<c.length;i++){
            c[i].onclick = function(){
                selectRedeem(this);
            }
        }
    },function(){
        netErr2();
    });
}

function reportAbuse(email,aplid){
    var code1 = "";
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    var problemStr = "";
    var sm = function(email,data){
        var input = document.getElementsByTagName("input")[0];
        var btn = document.getElementById("confirm_btn");
        btn.innerHTML = "<span class='wait'></span>";
        if($.md5(input.value.toLocaleUpperCase())==code1){
            btn.onclick = null;
            var bookStr = data.bookName;
            var sub = "DeBook 商品投诉";
            var rec = email;
            var HTML = "<style>h3,h2,p,a{margin:0px;}h2{font-weight:normal;}</style><h3>DeBook 商品投诉</h3><h2>我们收到了来自买家的商品投诉。您在DeBook上注册的商品<b>"+bookStr+"</b>被投诉，您的商品存在以下问题：<b>"+problemStr+"</b>，请尽快纠正此问题以继续销售。请在DeBook网页继续操作。</h2><p>如果您的商品细则已经更改或没有问题，请忽略此邮件。</p><p>感谢您的联系</p><p>- Nawaski.com</p>";
            var direct = "MAIL=" + rec + "&SUBJECT=" + sub + "&HTML=" + HTML + "&ALT=" + getHTMLText(HTML);
            newXMLHttpRequest('POST','.phtml/sendMail.phtml',direct,function(rspt){
                if(rspt==""){
                    showMsgbox(msgbox,"<h3 style=\"width:100%\">成功投诉商家</h3><p style=\"width:100%\">您的投诉已经采纳，我们将会与商家联系并处理。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right>好的</a>");
                }else{
                    netErr2();
                    btn.onclick = function(){
                        sm(email,data);
                    }
                    input.removeAttribute("disabled");
                }
            },function(){
                netErr2();
                btn.onclick = function(){
                    sm(email,data);
                }
                input.removeAttribute("disabled");
            });
        }else{
            input.removeAttribute("disabled");
            shakeBox(input,"leftRight",4,100,20);
            input.setAttribute('tips','<font size="4" err>验证码不正确</font>');
            mx = input.getClientRects()[0].left;
            my = input.getClientRects()[0].top + 20;
            showTooltip(input);
            btn.innerText = "再试一次";
            return;
        }
    }
    newXMLHttpRequest("POST",".phtml/apply.php","key=getApply&id="+aplid,function(rspt){
        var data = JSON.parse(rspt);
        var optionHtml = "<option>商品真实图片与细则不符</option>";
        if(data.aplSta==0){
            optionHtml += "<option>商家没有提供(正确)的DeBook唯一验证码</option>";
        }
        showMsgbox(msgbox,"<h3 style=\"margin-bottom:5px;width:100%\">选择投诉原因</h3><p>请从下面选择一个投诉商家的原因</p><div class=\"line\" style=\"margin-top: 5px;\"></div><div class=\"asbox_con\" style=\"width:calc(100% - 2px);\"><p>&nbsp;商品投诉原因</p><select class=\"asbox\" style=\"max-width:none\" onfocus=\"boxstyle(this.parentElement,1);\" onblur=\"boxstyle(this.parentElement,0)\">"+optionHtml+"</select><span class='sel' onclick=\"this.parentElement.children[1].focus();\">⇲</span></div><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>确认</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">取消</a>");
        var select = msgbox.getElementsByTagName("select")[0];
        select.onchange = function(){
            problemStr = select.children[select.selectedIndex].innerText;
        }
        var btn = msgbox.getElementsByClassName("btn")[0];
        btn.onclick = function(){
            showMsgbox(msgbox,'<h3 style="margin-bottom:5px;width:100%">验证码</h3><p>输入验证码以确认你不是机器人。(不区分大小写)</p><div class="line" style="margin-top: 5px;"></div><div style="width: 100%;"><div class="asbox_con" style="width:28%;margin-right:1%"><canvas style="width:73%;height:28px;position:relative;float:left;"></canvas><a tips="刷新代码" onmouseover="showTooltip(this)" onmouseleave="hideTooltip()" class="btn" id="refresh_btn" style="width:20px;height:20px;padding:3px;border-radius:0px;background-size:24px;background-position:2px;background-repeat:no-repeat;background-image:url(\'Image/fatcow/arrow_refresh.png\')"></a></div><div class="asbox_con" style="width:69%;margin-left:1%"><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%" autocomplete="off"></div></div><div class="line" style="margin-top: 5px;"></div><a class="btn" id="confirm_btn" right>确认</a><a class="btn" right onclick="cancelVrfyCode(this,document.getElementById(\'submit1\'));chgLockForm(1,0);">取消</a>');
            code1 = newCode();
            var btn = document.getElementById("refresh_btn");
            btn.onclick = function(){
                clearCode();
                code1 = newCode();
            }
            var confirmBtn = document.getElementById("confirm_btn");
            confirmBtn.onclick = function(){
                var input = document.getElementsByTagName("input")[0];
                input.setAttribute("disabled","");
                sm(email,data);
            }
            msgbox.getElementsByClassName("asbox")[0].onkeydown = function(e){
                var e1 = e || window.event;
                if(e1.keyCode==10||e1.keyCode==13){
                    this.setAttribute("disabled","");
                    sm(email,data);
                }else if(e1.keyCode==27){
                    hideMsgbox(msgbox);
                }
            }
        }
    },function(){
        netErr2();
    });
}