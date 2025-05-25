var selectedBuyIndex = -1;
var buyOrderSta = -1;
var sellOrderSta = -1;
var global_hideCan1 = null;
var global_hideCan2 = null;
var sta1 = "";

function initStarContainer(container,extraFn){
    container.setAttribute("value",0);
    var c = container.children;
    var setFn = function(obj){
        var idx = in_array(c,obj);
        var last = false;
        var lastidx = -1;
        for(var i=0;i<c.length;i++){
            if(!c[i].hasAttribute("selected")) break;
            lastidx = i;
        }
        last = lastidx==idx;
        if(last) idx=-1;
        for(var i=0;i<c.length;i++){
            if(i>idx){
                c[i].removeAttribute("selected");
            }else{
                c[i].setAttribute("selected","");
            }
        }
        container.setAttribute("value",idx+1);
        if(extraFn!=null){
            extraFn(idx);
        }
    };
    for(var i=0;i<c.length;i++){
        c[i].onclick = function(){      
            setFn(this);
        }
    }
}

function buy(){
    var h = window.location.search;
    if(typeof usr.usrid=="undefined"||usr.usrid==""){
        gotoPage("?account");
        putHis("","","?account#continue="+h);
        return;
    }
    var buyItems = [];
    if(location.search.indexOf("?cart")==0){
        var infoboxes = document.getElementsByClassName("infobox");
        for(var i=0;i<infoboxes.length;i++){
            if(!infoboxes[i].hasAttribute("selected")) continue;
            var k = infoboxes[i].getElementsByClassName("k")[0];
            var asbox_con = k.getElementsByClassName("asbox_con");
            for(var x=0;x<asbox_con.length;x++){
                if(!asbox_con[x].hasAttribute("goodsid")) continue;
                if(!asbox_con[x].hasAttribute("selected")) continue;
                buyItems[buyItems.length] = asbox_con[x].getAttribute("goodsid");
            }
        }
    }else if(location.search.indexOf("?book")==0){
        var items = document.getElementById('goodsItemBox').children;
        for(var i=0;i<items.length;i++){
            if(!items[i].hasAttribute("selected")||!items[i].hasAttribute("goodsid")) continue;
            buyItems[buyItems.length] = items[i].getAttribute("goodsid");
        }
    }
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
        var defInfo = "<span style='font-size:16px'>" + data.address + " (<b>"+data.name+"</b>收)" + "<br/>联系方式: <b>"+data.tele+"</b>(电话); <b>"+data.email+"</b>(电子邮件)" + "</span>";
        addrHtml += "<a class=\"radioBox\" tips=\""+defInfo+"\" onmouseover=\"showTooltip(this)\" onmouseleave=\"hideTooltip(this)\" href=\"javascript:;\" onclick=\"selectDlvRadio(this)\""+selectedStr+" id='"+data.id+"'><input class=\"asbox\" type=\"radio\" onclick=\"selectDlvRadio(this.parentElement)\" "+selectedStr2+"><span></span><p>"+address+" (<b>"+data.name+"</b>收)"+defaultStr+"<br/>联系方式: <b>"+tele+"</b>(电话); <b>"+email+"</b>(电子邮件)";
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
    var updateDlv = function(receipt){
        newXMLHttpRequest("POST",".phtml/deliver.php","key=generateOrder&id="+strJson(buyItems)+"&receipt="+receipt,function(rspt){
            if(location.search.indexOf("?cart")==0){
                skipMsgDeleteCartSel();
            }else if(location.search.indexOf("?book")==0){
                clearBookSel(buyItems);
            }
            window.setTimeout(function(){
                if(rspt!="[]"){
                    var data = JSON.parse(rspt);
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
                    showMsgbox(msgbox,"<h3 style=\"width:100%\">购买商品失败</h3><p style=\"width:100%\">购买以下商品时失败，因为以下商品已经被其他顾客购买或已被销售者删除。<a xhr style=\"float:none\" href=\"?help/purchase/consumer_conflict\">点击这里查看详细信息</a>。</p><div class=\"radioCon\" style=\"margin-top:5px\">"+missListHtml+"</div><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">好</a>");
                }else{
                    showMsgbox(msgbox,"<h3 style=\"width:100%\">商品购买成功</h3><p style=\"width:100%\">DeBook将不会自动发起付款。请点击每件购买的商品下的详细信息联系销售商，并进行付款。付款前请务必检查商品的实际图片是否与其描述一致，如果存在图文不符的情况请勿进行付款。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">好</a>");
                }
                gotoPage("?account");
                putHis("","","?account");
            },100);
        },function(){
            netErr2();
        });
    }
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

function clearBookSel(items){
    var fnbox = document.getElementById('goodsItemBox').children;
    var pricebox = document.getElementsByClassName('fnBox')[1];
    pricebox.children[0].innerHTML = "选中数量:0 | 价格";
    pricebox.children[1].children[0].value = "0.00";
    pricebox.getElementsByClassName("asbox_con")[1].setAttribute("disabled","");
    pricebox.getElementsByClassName("asbox_con")[2].setAttribute("disabled","");
    var fnbox2 = document.getElementsByClassName('fnBox')[2].children;
    for(var i=0;i<items.length;i++){
        if(!(fnbox[i].hasAttribute("goodsId")&&fnbox[i].hasAttribute("selected"))) continue;
        fnbox[i].outerHTML = "";
        fnbox2[i].outerHTML = "";
    }
    if(fnbox2.length==0){
        var fnbox = document.getElementById('goodsItemBox');
        var fnbox2 = document.getElementsByClassName('fnBox')[2];
        fnbox.innerHTML += "<div class=\"asbox_con\" style=\"margin:0px 10px 8px 0px\" null=\"\"><div><a class=\"tag\"><b>无货</b><font class=\"tag\"></font></a><a class=\"price\">没有销售商</a></div></div>";
        fnbox2.innerHTML += "<div class=\"asbox_con\" tab=\"\" style=\"margin-bottom:0;border-bottom:0\"><div><a class=\"tag\"><b>无货</b><font class=\"tag\"></font></a><a class=\"price\">没有销售商</a></div></div>";
    }
}

function selectDlvRadio(obj){
    var objc = obj.parentElement.children;
    var index = in_array(objc,obj);
    for(var i=0;i<objc.length;i++){
        if(i==index) continue;
        objc[i].removeAttribute("selected");
        objc[i].children[0].checked = false;
    }
    obj.setAttribute("selected","");
    obj.children[0].checked = true;
}

function selectDlvApl(id,obj,opt){
    if(typeof usr.usrid=="undefined") return;
    if(usr.usrid=="") return;
    var tr = obj.parentElement.parentElement;
    var trpc = tr.parentElement.children;
    var tri = in_array(trpc,tr);
    if(tr.hasAttribute("selected")){
        if(tr.getAttribute("selected")=="true"){
            tr.children[0].children[0].removeAttribute("checked");
            tr.removeAttribute("selected");
            var node = trpc[tri+1].children[0].children[0];
            var autoh = node.getClientRects()[0].height;
            node.style.height = autoh+"px";
            window.setTimeout(function(){
                node.style.height = "0px";
                window.setTimeout(function(){
                    trpc[tri+1].outerHTML = "";
                },500);
            },1);
            return;
        }
    }
    newXMLHttpRequest('POST','.phtml/deliver.php','key=getOrderInfo&id='+id,function(rspt){
        var data = JSON.parse(rspt);
        var aObj = data.aplinfo;
        if(aObj.usrid=='SPECIAL') aObj.udlvinfo.name = "DeBook 官方";
        var bObj = decodeInfo(data.rcpt_info);
        var aplid = data.aplid;
        var starClassList = ["star0d0","star0d5","star1d0","star1d5","star2d0","star2d5","star3d0","star3d5","star4d0","star4d5","star5d0"];
        var evaWordList = ["非常差","很差","差","较差","中等偏差","中等","中等偏好","较好","良好","非常好","一级棒"];
        var addHtml = "";
        if(data.status==0){
            if(opt==null){
                addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">此订单未支付或销售商未发货，请通过联系售卖商'<b>"+aObj.udlvinfo.name+"</b>'(电话: <a href=\"tel:"+aObj.udlvinfo.phone_number+"\">"+aObj.udlvinfo.phone_number+"</a>, 电子邮件: <a href=\"mailto:"+aObj.email+"\">"+aObj.email+"</a>)，使用微信支付或支付宝付款，并等待售卖商发货。如果商家迟迟联系不上且不发货，请取消订单。</div>";
                if(aObj.usrid=="SPECIAL") addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">DeBook官方正在为您发货，请耐心等待。如有疑问可以通过以下方式联系：'<b>"+aObj.udlvinfo.name+"</b>'(电话: <a href=\"tel:"+aObj.udlvinfo.phone_number+"\">"+aObj.udlvinfo.phone_number+"</a>, 电子邮件: <a href=\"mailto:"+aObj.email+"\">"+aObj.email+"</a>)。</div>";
            }else{
                addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">此订单未支付，请通过联系买家'<b>"+bObj.name+"</b>'(电话: <a href=\"tel:"+bObj.tele+"\">"+bObj.tele+"</a>, 电子邮件: <a href=\"mailto:"+bObj.email+"\">"+bObj.email+"</a>)，使用微信支付或支付宝收款。如果确认商家已付款，<a onclick=\"setDlvUID("+id+")\">点击这里</a>获取<u tips=\"DeBook唯一识别码(DeBook UID)是一种可以识别商品唯一性的号码，此号码将作为买家评价此商品的认证码。\" onmouseover='showTooltip(this,true)' onmouseleave='hideTooltip()'>DeBook唯一识别码</u>并开始发货。如果买家迟迟联系不上或不付款，请取消订单。</div>";
                if(aObj.usrid=="SPECIAL") addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">商家已付款，<a onclick=\"setDlvUID("+id+")\">点击这里</a>获取<u tips=\"DeBook唯一识别码(DeBook UID)是一种可以识别商品唯一性的号码，此号码将作为买家评价此商品的认证码。\" onmouseover='showTooltip(this,true)' onmouseleave='hideTooltip()'>DeBook唯一识别码</u>并开始发货。如果买家迟迟联系不上或不付款，请取消订单。</div>";
            }
        }else if(data.status==1){
            if(opt==null){
                addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">此订单已支付&发货，请通过联系售卖商'<b>"+aObj.udlvinfo.name+"</b>'(电话: <a href=\"tel:"+aObj.udlvinfo.phone_number+"\">"+aObj.udlvinfo.phone_number+"</a>, 电子邮件: <a href=\"mailto:"+aObj.email+"\">"+aObj.email+"</a>)，获取更多信息。商品快递进度可以通过<a xhr href='?help/delivery/software_and_website'>特定网站或软件</a>查到。</div>";
            }else{
                addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">此订单已支付&发货，请等待买家收货，收货后需要您和买家同时确认收货。您的DeBook唯一识别码是：<b>"+data.uid+"</b>，此识别码仅用于确认买家已收货，请勿提前将此码发送给买家。</div>";
            }
        }else if(data.status==2){
            if(opt==null){
                addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">此订单已经完成。</div>";
            }else{
                addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">此订单已经完成。请等待买家评价。若买家一个月内不评价，系统将自动评为5星。</div>";
            }
        }else if(data.status==3){
            if(data.returnStatus==0){
                if(opt==null){
                    addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">您已申请退回此货。请耐心等待卖家在网站上操作。</div>";
                }else{
                    addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">买家申请退回此货。在确认前请与买家联系并确认，确认时需要检查书籍情况。</div>";
                }
            }else if(data.returnStatus==1){
                if(opt==null){
                    addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">请联系卖家并确认货物退回的地点。运费承担人请您与卖家沟通后确认。</div>";
                }else{
                    addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">请联系买家并确认货物退回的地点。运费承担人请您与买家沟通后确认。</div>";
                }
            }else if(data.returnStatus==2){
                if(opt==null){
                    addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">请联系卖家并退回支付的款数。额数为<b>￥"+aObj.price+"</b>。确认已经退款后则按‘确认’即可。</div>";
                }else{
                    addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">请联系买家并退回支付的款数。额数为<b>￥"+aObj.price+"</b>。确认已经退款后等待买家按‘确认’即可。</div>";
                }
            }else if(data.returnStatus==3){
                if(opt==null){
                    addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">此订单已成功退货。</div>";
                }else{
                    addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">此订单已成功退货。</div>";
                }
            }
        }
        //seller
        var detailBoxHtml = "<tr detailbox><td colspan=\"6\" class=\"whiteboard\" style=\"background-color:white\"><div class=\"whiteboard\">"+addHtml+"<div class=\"row\" half><a class=\"sword\">语言</a><p class=\"sword\">" + aObj.lang + "</p></div><div class=\"row\" half><a class=\"sword\">出版社</a><p class=\"sword\">" +aObj.publish  + "</p></div>";
        detailBoxHtml += "<div class=\"row\" half><a class=\"sword\">书本页数</a><p class=\"sword\">"+aObj.quality.pages+"</p></div>";
        if(aObj.ISBN!="") detailBoxHtml += "<div class=\"row\" half><a class=\"sword\">ISBN</a><p class=\"sword\">" + aObj.ISBN + "</p></div>";
        if(aObj.translator!="") detailBoxHtml += "<div class=\"row\" half><a class=\"sword\">译者</a><p class=\"sword\">" + aObj.translator + "</p></div>";
        var usrcls = starClassList[aObj.evanum];
        var usrwd = aObj.empty_eva?"暂无评价":evaWordList[aObj.evanum];
        var usreva = aObj.empty_eva?"(无)":(aObj.evanum/2).toFixed(1);
        var dlvAddr = aObj.udlvinfo.address;
        var tel = aObj.udlvinfo.phone_number;
        var email = aObj.email;
        var sch = aObj.udlvinfo.sch_allow?"允许":"不可用";
        var schHTML = "";
        if(aObj.udlvinfo.sch_allow) schHTML = "<div class=\"row\" half><a class=\"sword\">学校发货地址</a><p class=\"sword\">" + aObj.udlvinfo.sch + "</p></div>";
        var sdays = aObj.udlvinfo.sdays?"<div class=\"row\" half><a class=\"sword\" green-white>七天无理由退货</a></div>":"";
        var qua = aObj.quality.quality_value;
        var qua = Math.round(qua*20)*5;
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
        var evaHtml = aObj.empty_eva?"<p style='position:relative;float:left;color:#202122;'>暂无评价</font>":"";
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
        detailBoxHtml += "<div class=\"line\" style=\"margin-top: 0px;\"></div><div class=\"row\" half><a class=\"sword\">供货商</a><p class=\"sword\">" + aObj.udlvinfo.name + "</p><a><i class=\"" + usrcls + "\"></i>&nbsp;" + usreva + " 分 " + usrwd + "</a></div><div class=\"row\" half><a class=\"sword\">发货地址</a><p class=\"sword\">" + dlvAddr + "</p></div><div class=\"row\" half><a class=\"sword\">相同学校收货</a><p class=\"sword\">" + sch + "</p></div>" + schHTML + sdays + "<div class=\"row\" half><a class=\"sword\">新旧程度</a><p class=\"sword\">" + fsStr + "</p></div><div class=\"row\" half><a class=\"sword\">联系方式 - 电话</p><a class=\"sword\">" + tel + "</a></div><div class=\"row\" half><a class=\"sword\">联系方式 - 电子邮件</p><a class=\"sword\">" + email + "</a></div><div class=\"row\" style=\"line-height: normal;margin-bottom:0\"><p class=\"sword\">实物图片&nbsp;<a href=\"javascript:;\" onclick=\"showApplyPicture('"+aplid+"')\">查看书本图片及细则</a>&nbsp;<a href=\"javascript:;\" style=\"color:#800080\" onclick=\"reportAbuse('" + aObj.email + "',"+aplid+")\">投诉商家</a></p><div class=\"_all_image\" style=\"width:99.5%;margin-top: 0px;float: right;\"><div class=\"_images_con2\" onclick=\"showApplyPicture("+aplid+")\">" + imgHTML + "</div></div></div><div class=\"line\" style=\"margin-top: 0px;\"></div><div class=\"row\"><a class=\"sword\" style='margin-left:0'>客户对供货商的评价</a><p class=\"sword\">" + aObj.udlvinfo.name + "</p></div>" + evaHtml + "</div>";
        detailBoxHtml += "</td></tr>";
        //buyer
        var detailBoxHtml2 = "<tr detailbox><td colspan=\"6\" class=\"whiteboard\" style=\"background-color:white\"><div class=\"whiteboard\">"+addHtml+"<div class=\"row\" half><a class=\"sword\">语言</a><p class=\"sword\">" + aObj.lang + "</p></div><div class=\"row\" half><a class=\"sword\">出版社</a><p class=\"sword\">" +aObj.publish  + "</p></div>";
        detailBoxHtml2 += "<div class=\"row\" half><a class=\"sword\">书本页数</a><p class=\"sword\">"+aObj.quality.pages+"</p></div>";
        if(aObj.ISBN!="") detailBoxHtml2 += "<div class=\"row\" half><a class=\"sword\">ISBN</a><p class=\"sword\">" + aObj.ISBN + "</p></div>";
        if(aObj.translator!="") detailBoxHtml2 += "<div class=\"row\" half><a class=\"sword\">译者</a><p class=\"sword\">" + aObj.translator + "</p></div>";
        dlvAddr = bObj.address;
        tel = bObj.tele;
        email = bObj.email;
        var imgHTML = "";
        var imgPath = aObj.images.Path;
        for (imgkey in aObj.images.Images){
            var imgName = aObj.images.Images[imgkey];
            imgHTML += "<img src=\"Image/apply/" + imgPath + "/" + imgName + "\">";
        }
        detailBoxHtml2 += "<div class=\"line\" style=\"margin-top: 0px;\"></div><div class=\"row\" half><a class=\"sword\">买家名称</a><p class=\"sword\">" + bObj.name + "</p></div><div class=\"row\" half><a class=\"sword\">收货地址</a><p class=\"sword\">" + dlvAddr + "</p></div><div class=\"row\" half><a class=\"sword\">联系方式 - 电话</p><a class=\"sword\">" + tel + "</a></div><div class=\"row\" half><a class=\"sword\">联系方式 - 电子邮件</p><a class=\"sword\">" + email + "</a></div><div class=\"row\" style=\"line-height: normal;margin-bottom:0\"><p class=\"sword\">实物图片&nbsp;<a href=\"javascript:;\" onclick=\"showApplyPicture('"+aplid+"')\">查看书本图片及细则</a></p><div class=\"_all_image\" style=\"width:99.5%;margin-top: 0px;float: right;\"><div class=\"_images_con2\" onclick=\"showApplyPicture("+aplid+")\">" + imgHTML + "</div></div></div><div class=\"line\" style=\"margin-top: 0px;\"></div><div class=\"row\"><a class=\"sword\" style='margin-left:0'>客户对供货商的评价</a><p class=\"sword\">" + aObj.udlvinfo.name + "</p></div>" + evaHtml;
        detailBoxHtml2 += "</td></tr>";
        //table
        for(var i=0;i<trpc.length;i++){
            if(trpc[i].hasAttribute("selected")){
                if(trpc[i].getAttribute("selected")=="true"){
                    trpc[i].removeAttribute("selected");
                    trpc[i].children[0].children[0].removeAttribute("checked");
                    if(trpc[i+1].hasAttribute("detailbox")){
                        trpc[i+1].outerHTML = "";
                        tr = obj.parentElement.parentElement;
                        trpc = tr.parentElement.children;
                        tri = in_array(trpc,tr);
                    }
                }
            }
        }
        tr.setAttribute("selected","true");
        tr.children[0].children[0].setAttribute("checked","");
        var trinHtml = "";
        for(var i=tri+1;i<trpc.length;i++){
            trinHtml += trpc[i].outerHTML;
        }
        for(var i=trpc.length-1;i>tri;i--){
            trpc[i].outerHTML = "";
        }
        tr.parentElement.innerHTML += opt==null?detailBoxHtml + trinHtml:detailBoxHtml2 + trinHtml;
        var node = trpc[tri+1].children[0].children[0];
        node.style.height = "auto";
        window.setTimeout(function(){
            var autoh = node.getClientRects()[0].height;
            node.style.height = "0px";
            node.style.transition = "height 0.5s ease 0s";
            window.setTimeout(function(){
                node.style.height = autoh + "px";
                window.setTimeout(function(){
                    node.style.height = "auto";
                },200);
            },1);
        },10);
    },function(){
        netErr2();
    });
}

function getOptionTime(sel){
    for(var i=0;i<sel.children.length;i++){
        if(i==sel.selectedIndex){
            sel.children[i].setAttribute("selected","");
        }else{
            sel.children[i].removeAttribute("selected");
        }
    }
    var opt = sel.selectedIndex;
    var minusT = 0;
    if(opt==0){
        minusT = 3*30*24*60*60;
    }else if(opt==1){
        minusT = 6*30*24*60*60;
    }else if(opt==2){
        minusT = 365*24*60*60;
    }else if(opt==3){
        minusT = parseInt(new Date().getTime()/1000);
    }
    var nowPhpT = parseInt(new Date().getTime()/1000);
    var tp = nowPhpT - minusT;

    return tp;
}

function showBuyOrder(obj,sta,page,time,hideCan){
    if(typeof hideCan=="undefined"){
        hideCan = global_hideCan1;
    }
    var clearTable = function(){
        var table = document.getElementById("buy_item_table");
        table.children[1].innerHTML = "";
    }
    var selControl = function(sel,index){
        for(var i=0;i<sel.children.length;i++){
            if(i==index){
                sel.children[i].setAttribute("selected","");
            }else{
                sel.children[i].removeAttribute("selected");
            }
        }
    }
    var toTwo = function(n){
        var nStr = n.toString();
        if(nStr.length==1){
            return "0"+nStr;
        }else{
            return nStr;
        }
    }
    var getCnDate = function(date){
        var dat = new Date(date*1000);
        var month = dat.getMonth()+1;
        return dat.getFullYear()+"年"+month+"月"+dat.getDate()+"日"+" "+toTwo(dat.getHours())+":"+toTwo(dat.getMinutes())+":"+toTwo(dat.getSeconds());
    }
    if(typeof usr.usrid=="undefined") return;
    if(usr.usrid=="") return;
    if(page==null) page=1;
    if(time==null) time=0;
    if(time==0) selControl(document.getElementById("select1"),3);
    if(obj===null){
        var cns = buyOrderSta;
        if(buyOrderSta==-1){
            cns = 0;
            sta = "";
        }else{
            sta = buyOrderSta;
            cns = sta+1;
        }
        obj = document.getElementById("buyOrderCon").children[1].children[cns].children[0];
    }else{
        if(typeof sta==="undefined"){
            sta = "";
            buyOrderSta = -1;
        }else if(sta===null||sta===""){
            sta = "";
            buyOrderSta = -1;
        }else{
            buyOrderSta = sta;
        }
    }
    var table = document.getElementById("buy_item_table");
    var emptyRowHtml = "<td colspan=\"6\" style=\"text-align: center;background-color: #f2f4f6;\">(没有订单)</td>";
    var waitRowHtml = "<td colspan=\"6\" style=\"text-align: center;background-color: #f2f4f6;\"><span class=\"bottomA\"></span></td>";
    var retryRowHtml = "<td colspan=\"6\" style=\"text-align: center;background-color: #f2f4f6;\">没有网络连接，<a class='retry'>点击这里重试</a>。</td>";
    //wait
    clearTable();
    table.children[1].innerHTML += waitRowHtml;
    //afterward
    var c = obj.parentElement.parentElement.children;
    var i = in_array(c,obj.parentElement);
    for(var x=0;x<c.length;x++){
        if(i==x){
            c[x].setAttribute("selected","");
            c[x].children[0].removeAttribute("tab");
            c[x].children[0].setAttribute("tab-selected","");
        }else{
            c[x].removeAttribute("selected");
            c[x].children[0].removeAttribute("tab-selected");
            c[x].children[0].setAttribute("tab","")
        }
    }
    page = page-1;
    newXMLHttpRequest("POST",".phtml/deliver.php","key=getToUsrDlv&toUsrid="+usr.usrid+"&sta="+sta+"&page="+page+"&time="+time,function(rspt){
        var data = JSON.parse(rspt);
        clearTable();
        var date = "";
        var hideCount = 0;
        for(var x=0;x<data.rlen;x++){
            if(data[x]["status"]==-1) hideCount++;
            if(hideCan==null&&data[x]["status"]==-1) continue;
            var idate = data[x]["date"];
            var dateObj = new Date(idate*1000);
            var month = dateObj.getMonth()+1;
            var cdate = dateObj.getFullYear()+"_"+month+"_"+dateObj.getDate();
            if(cdate!=date){
                var dateStr = dateObj.getFullYear()+"年"+month+"月"+dateObj.getDate()+"日";
                table.children[1].innerHTML += "<td colspan=\"6\" style=\"text-align: center;background-color: #0366d6;color:#fff;padding:3px 0\">下单时间: "+dateStr+"</td>";
                date = cdate;
            }
            var bookid = data[x]["bookid"];
            var bookname = data[x]["names"];
            var bookAuthor = data[x]["author"][0];
            var bookAurLink = data[x]["authorLink"][0];
            var bookAuthorHtml = bookAurLink==""?bookAuthor:"<a xhr href=\"?author/"+bookAurLink+"\">"+bookAuthor+"</a>";
            if(data[x]["author"].length>1) bookAuthorHtml+="等";
            var lang = data[x]["aplinfo"]["lang"];
            var dlvid = data[x]["dlvid"];
            var dlvonclick = data[x]["status"]==-1?"disabled":"onclick=\"selectDlvApl("+dlvid+",this)\"";
            var comj = data[x]["evaid"]==""||data[x]["evaid"].indexOf("auto_")>=0;
            var comonclick = comj?"onclick='comment("+dlvid+")'":"";
            var comstyle = comj?"":"style='color:#757575'";
            var comstr = comj?"评价":"已评价";
            var buyConfirm = "onclick=\"buyConfirm("+dlvid+")\"";
            var name = data[x]["aplinfo"]["usrid"]!="SPECIAL"?data[x]["aplinfo"]["udlvinfo"]["name"]:"DeBook 官方";
            staHtml = "";
            cmdHtml = "";
            if(data[x]["status"]==-1){
              staHtml = "已取消";
              cmdHtml = "<a style='color:#757575'>已取消</a>";
            }else if(data[x]["status"]==0){
              staHtml = "待支付&发货";
              cmdHtml = "<a onclick='cancelOrder("+dlvid+")'>取消订单</a><br/><a "+dlvonclick+">查看详情</a>";
            }else if(data[x]["status"]==1){
              staHtml = "待收货";
              cmdHtml = "<a "+buyConfirm+">确认收货</a><br/><a "+dlvonclick+">查看详情</a>";
            }else if(data[x]["status"]==2){
              staHtml = "已完成";
              cmdHtml = "<a "+comstyle+" "+comonclick+">"+comstr+"</a>|<a onclick='returnOrder("+dlvid+")'>申请退货</a><br/><a "+dlvonclick+">查看详情</a>";
            }else if(data[x]["status"]==3){
                if(data[x].returnStatus==0){
                    staHtml = "退货申请中";
                    cmdHtml = "<a onclick='canReturnOrder("+dlvid+")'>取消退货</a><br/><a "+dlvonclick+">查看详情</a>";
                }else if(data[x].returnStatus==1){
                    staHtml = "退货中";
                    cmdHtml = "<a style='color:#757575'>处理退货中</a><br/><a "+dlvonclick+">查看详情</a>";
                  }else if(data[x].returnStatus==2){
                    staHtml = "退货中";
                    cmdHtml = "<a onclick='cfmPayback("+dlvid+","+data[x]["aplinfo"]["price"]+")'>确认卖家退款</a><br/><a "+dlvonclick+">查看详情</a>";
                  }else if(data[x].returnStatus==3){
                    staHtml = "退货完成";
                    cmdHtml = "<a "+dlvonclick+">查看详情</a>";
                }
            }
            var ostyle = data[x]["status"]==-1?"disabled style='background-color:#e0e0e0;color:#757575'":"";
            table.children[1].innerHTML += "<tr "+ostyle+"><td><input type=\"checkbox\" class=\"asbox\" type=\"checkbox\" "+dlvonclick+"><span></span></td><td><a xhr href=\"?book/"+bookid+"\">"+bookname+"</a>("+lang+")&nbsp;"+bookAuthorHtml+"(著)</td><td><a class=\"contact\">"+name+"</a></td><td>"+getCnDate(data[x]["date"])+"</td><td>"+staHtml+"</td><td>"+cmdHtml+"</td></tr>";   
        }
        if(data.rlen-hideCount==0&&hideCan==null||data.rlen==0&&hideCan!=null) table.children[1].innerHTML += emptyRowHtml;
        var buyTp = parseInt(data.len/10);
        buyTp += parseInt(data.len)%10==0?0:1;
        var buyCp = page+1;
        var buyNp = buyCp+1;
        var buyPp = buyCp-1;
        var buyPagePrevAttr = buyCp>1?"onclick='showBuyOrder(null,null,"+buyPp+","+time+")'":"disabled";
        var buyPageNextAttr = buyCp<buyTp?"onclick='showBuyOrder(null,null,"+buyNp+","+time+")'":"disabled";
        var pageCon = document.getElementById("buyOrderCon");
        pageCon = pageCon.children[pageCon.childElementCount-1];
        var lastChildHtml = pageCon.children[pageCon.children.length-1].outerHTML;
        var hideCountHtml = hideCan==null?"<a onclick=\"showBuyOrder(null,null,null,null,1);\">显示已取消的"+hideCount+"个订单</a>":"<a onclick=\"showBuyOrder(null,null,null,null,null);\">隐藏已取消的"+hideCount+"个订单</a>";
        if(buyOrderSta!==-1){
            hideCountHtml = "";
        }
        pageCon.innerHTML = "<a "+buyPagePrevAttr+">上一页</a><a style=\"color:#202122\">第"+buyCp+"页 共"+buyTp+"页</a><a "+buyPageNextAttr+">下一页</a>"+hideCountHtml+lastChildHtml;
        global_hideCan1 = hideCan;
        initAllLink();
    },function(){
        netErr2();
        clearTable();
        table.children[1].innerHTML += retryRowHtml;
        var cn = sta+1;
        if(sta=="") cn = 0;
        table.getElementsByClassName("retry")[0].setAttribute("onclick","showBuyOrder(this.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children["+cn+"].children[0],"+sta+","+page+1+","+time+")")
    });
}

function showSellOrder(obj,sta,page,time,hideCan){
    if(typeof hideCan=="undefined"){
        hideCan = global_hideCan2;
    }
    var clearTable = function(){
        var table = document.getElementById("sell_item_table");
        table.children[1].innerHTML = "";
    }
    var selControl = function(sel,index){
        for(var i=0;i<sel.children.length;i++){
            if(i==index){
                sel.children[i].setAttribute("selected","");
            }else{
                sel.children[i].removeAttribute("selected");
            }
        }
    }
    var toTwo = function(n){
        var nStr = n.toString();
        if(nStr.length==1){
            return "0"+nStr;
        }else{
            return nStr;
        }
    }
    var getCnDate = function(date){
        var dat = new Date(date*1000);
        var month = dat.getMonth()+1;
        return dat.getFullYear()+"年"+month+"月"+dat.getDate()+"日"+" "+toTwo(dat.getHours())+":"+toTwo(dat.getMinutes())+":"+toTwo(dat.getSeconds());
    }
    if(typeof usr.usrid=="undefined") return;
    if(usr.usrid=="") return;
    if(page==null) page=1;
    if(time==null) time=0;
    if(time==0) selControl(document.getElementById("select2"),3);
    if(obj===null){
        var cns = sellOrderSta;
        if(sellOrderSta==-1){
            cns = 0;
            sta = "";
        }else{
            sta = sellOrderSta;
            cns = sta+1;
        }
        obj = document.getElementById("sellOrderCon").children[1].children[cns].children[0];
    }else{
        if(typeof sta==="undefined"){
            sta = "";
            sellOrderSta = -1;
        }else if(sta===null||sta===""){
            sta = "";
            sellOrderSta = -1;
        }else{
            sellOrderSta = sta;
        }
    }
    var table = document.getElementById("sell_item_table");
    var emptyRowHtml = "<td colspan=\"6\" style=\"text-align: center;background-color: #f2f4f6;\">(没有订单)</td>";
    var waitRowHtml = "<td colspan=\"6\" style=\"text-align: center;background-color: #f2f4f6;\"><span class=\"bottomA\"></span></td>";
    var retryRowHtml = "<td colspan=\"6\" style=\"text-align: center;background-color: #f2f4f6;\">没有网络连接，<a class='retry'>点击这里重试</a>。</td>";
    //wait
    clearTable();
    table.children[1].innerHTML += waitRowHtml;
    //afterward
    var c = obj.parentElement.parentElement.children;
    var i = in_array(c,obj.parentElement);
    for(var x=0;x<c.length;x++){
        if(i==x){
            c[x].setAttribute("selected","");
            c[x].children[0].removeAttribute("tab");
            c[x].children[0].setAttribute("tab-selected","");
        }else{
            c[x].removeAttribute("selected");
            c[x].children[0].removeAttribute("tab-selected");
            c[x].children[0].setAttribute("tab","")
        }
    }
    page = page-1;
    newXMLHttpRequest("POST",".phtml/deliver.php","key=getFromUsrDlv&fromUsrid="+usr.usrid+"&sta="+sta+"&page="+page+"&time="+time,function(rspt){
        var data = JSON.parse(rspt);
        clearTable();
        var date = "";
        var hideCount = 0;
        for(var x=0;x<data.rlen;x++){
            if(data[x]["status"]==-1) hideCount++;
            if(hideCan==null&&data[x]["status"]==-1) continue;
            var idate = data[x]["date"];
            var dateObj = new Date(idate*1000);
            var month = dateObj.getMonth()+1;
            var cdate = dateObj.getFullYear()+"_"+month+"_"+dateObj.getDate();
            if(cdate!=date){
                var dateStr = dateObj.getFullYear()+"年"+month+"月"+dateObj.getDate()+"日";
                table.children[1].innerHTML += "<td colspan=\"6\" style=\"text-align: center;background-color: #0366d6;color:#fff;padding:3px 0\">下单时间: "+dateStr+"</td>";
                date = cdate;
            }
            var bookid = data[x]["bookid"];
            var bookname = data[x]["names"];
            var bookAuthor = data[x]["author"][0];
            var bookAurLink = data[x]["authorLink"][0];
            var bookAuthorHtml = bookAurLink==""?bookAuthor:"<a xhr href=\"?author/"+bookAurLink+"\">"+bookAuthor+"</a>";
            if(data[x]["author"].length>1) bookAuthorHtml+="等";
            var lang = data[x]["aplinfo"]["lang"];
            var dlvid = data[x]["dlvid"];
            var dlvonclick = data[x]["status"]==-1?"disabled":"onclick=\"selectDlvApl("+dlvid+",this,1)\"";
            var name = decodeInfo(data[x]["rcpt_info"])["name"];
            staHtml = "";
            cmdHtml = "";
            if(data[x]["status"]==-1){
              staHtml = "已取消";
              cmdHtml = "<a style='color:#757575'>已取消</a>";
            }else if(data[x]["status"]==0){
              staHtml = "待支付&发货";
              cmdHtml = "<a onclick=\"setDlvUID("+dlvid+")\">确认发货</a>|<a onclick='cancelOrder("+dlvid+")'>取消订单</a><br/><a "+dlvonclick+">查看详情</a>";
            }else if(data[x]["status"]==1){
              staHtml = "待收货";
              cmdHtml = "<a style='color:#757575'>等待买家确认</a><br/><a "+dlvonclick+">查看详情</a>";
            }else if(data[x]["status"]==2){
              staHtml = "已完成";
              cmdHtml = "<a "+dlvonclick+">查看详情</a>";
            }else if(data[x]["status"]==3){
                if(data[x].returnStatus==0){
                    staHtml = "退货申请中";
                    cmdHtml = "<a onclick='cfmReturnOrder("+dlvid+")'>确认退货</a>|<a onclick='canReturnOrder("+dlvid+")'>拒绝退货</a><br/><a "+dlvonclick+">查看详情</a>";
                }else if(data[x].returnStatus==1){
                    staHtml = "退货中";
                    cmdHtml = "<a onclick='cfmRcvRtnOrder("+dlvid+")'>确认收货</a><br/><a "+dlvonclick+">查看详情</a>";
                  }else if(data[x].returnStatus==2){
                    staHtml = "退货中";
                    cmdHtml = "<a style='color:#757575'>处理退款中</a><br/><a "+dlvonclick+">查看详情</a>";
                  }else if(data[x].returnStatus==3){
                    staHtml = "退货完成";
                    cmdHtml = "<a "+dlvonclick+">查看详情</a>";
                } 
            }
            var ostyle = data[x]["status"]==-1?"disabled style='background-color:#e0e0e0;color:#757575'":"";
            table.children[1].innerHTML += "<tr "+ostyle+"><td><input type=\"checkbox\" class=\"asbox\" type=\"checkbox\" "+dlvonclick+"><span></span></td><td><a xhr href=\"?book/"+bookid+"\">"+bookname+"</a>("+lang+")&nbsp;"+bookAuthorHtml+"(著)</td><td><a class=\"contact\">"+name+"</a></td><td>"+getCnDate(data[x]["date"])+"</td><td>"+staHtml+"</td><td>"+cmdHtml+"</td></tr>";   
        }
        if(data.rlen-hideCount==0&&hideCan==null||data.rlen==0&&hideCan!=null) table.children[1].innerHTML += emptyRowHtml;
        var sellTp = parseInt(data.len/10);
        sellTp += parseInt(data.len)%10==0?0:1;
        var sellCp = page+1;
        var sellNp = sellCp+1;
        var sellPp = sellCp-1;
        var sellPagePrevAttr = sellCp>1?"onclick='showSellOrder(null,null,"+sellPp+","+time+")'":"disabled";
        var sellPageNextAttr = sellCp<sellTp?"onclick='showSellOrder(null,null,"+sellNp+","+time+")'":"disabled";
        var pageCon = document.getElementById("sellOrderCon");
        pageCon = pageCon.children[pageCon.childElementCount-1];
        var lastChildHtml = pageCon.children[pageCon.children.length-1].outerHTML;
        var hideCountHtml = hideCan==null?"<a onclick=\"showSellOrder(null,null,null,null,1);\">显示已取消的"+hideCount+"个订单</a>":"<a onclick=\"showSellOrder(null,null,null,null,null);\">隐藏已取消的"+hideCount+"个订单</a>";
        if(sellOrderSta!==-1){
            hideCountHtml = "";
        }
        pageCon.innerHTML = "<a "+sellPagePrevAttr+">上一页</a><a style=\"color:#202122\">第"+sellCp+"页 共"+sellTp+"页</a><a "+sellPageNextAttr+">下一页</a>"+hideCountHtml+lastChildHtml;
        global_hideCan2 = hideCan;
        initAllLink();
    },function(){
        netErr2();
        clearTable();
        table.children[1].innerHTML += retryRowHtml;
        var cn = sta+1;
        if(sta=="") cn = 0;
        table.getElementsByClassName("retry")[0].setAttribute("onclick","showSellOrder(this.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children["+cn+"].children[0],"+sta+","+page+1+","+time+")")
    });
}

function showTrsinfo(usrid,page){
    var con = document.getElementById("trsinfo")
    var dom = con.getElementsByTagName("table")[0].children[0];
    var clearTable = function(){
        for(var i=dom.children.length-1;i>0;i--){
            dom.children[i].outerHTML = "";
        }
    }
    var getCnDate = function(date){
        var dat = new Date(date*1000);
        var month = dat.getMonth()+1;
        return dat.getFullYear()+"年"+month+"月"+dat.getDate()+"日"+" "+toTwo(dat.getHours())+":"+toTwo(dat.getMinutes())+":"+toTwo(dat.getSeconds());
    }
    var toTwo = function(n){
        var nStr = n.toString();
        if(nStr.length==1){
            return "0"+nStr;
        }else{
            return nStr;
        }
    }
    var waitSpan = "<td colspan=\"6\" style=\"text-align: center;background-color: #f2f4f6;\"><span class='bottomA' style='width:100%;'></span></td>";
    var internetSpan = "<td colspan=\"\" style=\"text-align: center;background-color: #f2f4f6;\>没有网络连接，尝试<a style='float:none' onclick='showTrsinfo('"+usrid+"',"+page+")'>重新加载</a>。</td>";
    var noSpan = "<td colspan=\"\" style=\"text-align: center;background-color: #f2f4f6;\>(没有收付款记录)</td>";
    clearTable();
    dom.innerHTML += waitSpan;
    var rpage = page-1;
    newXMLHttpRequest("POST",".phtml/deliver.php","key=getTransaction&id="+usrid+"&page="+rpage,function(rspt){
        clearTable();
        var data = JSON.parse(rspt);
        var trans = data["trans"];
        var c = 0;
        for(i=0;i<trans.length;i++){
            var contents = decodeURI(trans[i]["content"]);
            var value = trans[i]["value"];
            if(!trans[i]["toUsrid"]==usr["usrid"]) value*=-1;
            value = parseFloat(value).toFixed(2);
            var mdate = getCnDate(trans[i]["date"]);
            var type = trans[i]["toUsrid"]==usr["usrid"]?"收款":"付款";
            dom.innerHTML += "<tr><td><input type=\"checkbox\" class=\"asbox\" onclick=\"edSelect(this)\"><span style=\"top:3px\"></span></td><td>"+contents+"</td><td style=\"width:140px\">"+type+"</td><td style=\"width:140px\">"+value+"</td><td style=\"width:390px\">"+mdate+"</td><td style=\"width:100px\"><font style='color:#757575'>(无可用操作)</font></td></tr>";
            c++;
        }
        if(c==0) dom.innerHTML += noSpan;
        //page control
        var Tp = data["page_count"];
        var Cp = page;
        var Np = Cp+1;
        var Pp = Cp-1;
        var PagePrevAttr = Cp>1?"onclick=\"showTrsinfo('"+usrid+"',"+Pp+")\"":"disabled";
        var PageNextAttr = Cp<Tp?"onclick=\"showTrsinfo('"+usrid+"',"+Np+")\"":"disabled";
        var cc = con.children;
        cc[cc.length-1].outerHTML = "<div class=\"line\" style=\"margin: 0 0 10px 0;\"><a "+PagePrevAttr+">上一页</a><a style=\"color:#202122\">第"+page+"页 共"+Tp+"页</a><a "+PageNextAttr+">下一页</a></div>";
    },function(){
        dom.innerHTML += internetSpan;
        netErr2();
    });
}

function setDlvUID(dlvid){
    newXMLHttpRequest("POST",".phtml/deliver.php","key=setDlvUID&id="+dlvid,function(rspt){
        var msgbox = document.getElementsByClassName("MsgBox")[0];
        showMsgbox(msgbox,"<h3 style=\"width:100%\">DeBook订单状态即将改变</h3><div class='line' style='margin-top: 5px;'></div><ul style=\"padding-left:20px;width:calc(100% - 20px)\"><li>您即将将选中商品状态从‘待支付&发货’改变为‘待收货’。</li><li>此订单的DeBook唯一识别码是<b>"+rspt+"</b>。请将DeBook唯一识别码<b>正确</b>地写在纸条上，并将纸条夹入书中的任意一页。任何（有意的或无意的）填写错误将影响您的诚信度。</li><li>请勿将此识别码发送给买家。</li><li>在按确认按钮前请确保买家已付款，且您已经将商品打包寄到指定地址，否则请按取消。</li><li>订单状态一旦确认转变为待收货，则无法退回到当前状态！</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>确认</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">取消</a>");
        var btn = msgbox.getElementsByClassName("btn")[0];
        btn.onclick = function(){
            newXMLHttpRequest("POST",".phtml/deliver.php","key=updateStatus&sta=1&id="+dlvid,function(){
                showSellOrder(null,null,null,null);
                showMsgbox(msgbox,"<h3 style=\"width:100%\">DeBook订单状态已改变</h3><div class='line' style='margin-top: 5px;'></div><p>您已成功将选中订单状态调整为‘待收货’。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">好的</a>")
            },function(){
                netErr2();
            });
        }
    },function(){
        netErr2();
    });
}

function buyConfirm(dlvid){
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox,"<h3 style=\"width:100%\">DeBook订单状态即将改变</h3><div class='line' style='margin-top: 5px;'></div><ul style=\"padding-left:20px;width:calc(100% - 20px)\"><li>您即将将选中商品状态从‘待收货’改变为‘已完成’。</li><li>在按确认按钮前请确保您已经收货，否则请按取消。</li><li>订单状态一旦确认转变为已收货，则无法退回到当前状态！</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>确认</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">取消</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    btn.onclick = function(){
        newXMLHttpRequest("POST",".phtml/deliver.php","key=buyConfirm&id="+dlvid,function(rspt){
            showBuyOrder(null,null,null,null);
            showMsgbox(msgbox,"<h3 style=\"width:100%\">DeBook订单状态已改变</h3><div class='line' style='margin-top: 5px;'></div><p>您已成功将选中订单状态调整为‘已完成’。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">好的</a>")
        },function(){
            netErr2();
        });
    }
}

function cancelOrder(dlvid){
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox,"<h3 style=\"width:100%\">确认是否取消DeBook订单</h3><div class='line' style='margin-top: 5px;'></div><ul style=\"padding-left:20px;width:calc(100% - 20px)\"><li>您即将取消选中商品。订单一旦确认取消，则无法复原！</li><li>取消订单前请与对方（买家或卖家）联系并确认。</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>确认</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">取消</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    btn.onclick = function(){
        newXMLHttpRequest("POST",".phtml/deliver.php","key=cancelOrder&id="+dlvid,function(rspt){
            showBuyOrder(null,null,null,null);
            showSellOrder(null,null,null,null);
            showMsgbox(msgbox,"<h3 style=\"width:100%\">DeBook订单已取消</h3><div class='line' style='margin-top: 5px;'></div><p>您已成功将选中订单取消。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">好的</a>")
        },function(){
            netErr2();
        });
    }
}

function comment(dlvid){
    var uid = "";
    var confirmed = 0;
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    var filterStr = function(str){
        while(str.indexOf("-")>=0){
            str = str.replace("-","");
        }
        return str;
    }
    showMsgbox(msgbox,"<h3 style=\"width:100%\">输入DeBook唯一识别码</h3><p>输入DeBook唯一识别码已确认您已经收到商家的商品。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><div class=\"asbox_con\" style=\"width:98.4%;background-color:#fff\"><p>&nbsp;DeBook唯一识别码</p><input class=\"asbox\" onfocus=\"boxstyle(this.parentElement,1)\" onblur=\"boxstyle(this.parentElement,0)\" placeholder=\"DeBook唯一识别码\" autocomplete=\"off\"></div><div class=\"line\" style=\"margin-top: 5px;\"></div><a id='nouid' style='margin-top:1px' href='javascript:;'>跳过</a><a class=\"btn\" right>确认</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">取消</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    var btn2 = document.getElementById("nouid");
    var input = msgbox.getElementsByTagName("input")[0];
    input.onkeydown = function(evt){
        var e = evt||window.event;
        if(e.keyCode==8||e.keyCode>=35&&e.keyCode<=40||e.ctrlKey||e.altKey||e.shiftKey){
        }else if(e.keyCode>=65&&e.keyCode<=90||e.keyCode>=97&&e.keyCode<=122||e.keyCode>=48&&e.keyCode<=57||e.keyCode==189){
            this.value += e.key.toLocaleUpperCase();
            return false;
        }else if(e.keyCode==10||e.keyCode==13){
            btn.onclick();
        }else{
            return false;
        }
    }
    btn2.onclick = function(){
        run();
    }
    var run = function(){
        hideTooltip();
        var real_index = 0;
        showMsgbox(msgbox,"<h3 style=\"width:100%\">请对您购买的商品进行评价</h3><p>您的评分 <a id='msgEvaNum' style='float:none'>0.0</a></p><div class='starContainer' style='margin:5px 0'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><p>填写要评价的内容</p><div class='line' style='margin-top: 5px;'></div><div class=\"asbox_con\"><textarea style=\"font-family:consolas;min-height:180px;\" onfocus=\"boxstyle(this.parentElement,1)\" onblur=\"boxstyle(this.parentElement,0)\" placeholder=\"评价内容(可留空)\" autocomplete=\"off\"></textarea></div><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>确认</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">取消</a>");
        var btn = msgbox.getElementsByClassName("btn")[0];
        initStarContainer(msgbox.getElementsByClassName("starContainer")[0],function(index){
            var textarea = msgbox.getElementsByTagName("textarea")[0];
            real_index = index+1;
            document.getElementById("msgEvaNum").innerHTML = (real_index/2).toFixed(1);
            msgbox.getElementsByClassName("starContainer")[0].setAttribute("value",real_index);
            if(real_index<8){
                textarea.setAttribute("placeholder","评价内容(评分小于4星时必须给出20字的文字评论)");
            }else{
                textarea.setAttribute("placeholder","评价内容(可留空)");
            }
        });
        btn.onclick = function(){
            var textarea = msgbox.getElementsByTagName("textarea")[0];
            var comments = textarea.value;
            if(real_index<8&&comments.length<20){
                shakeBox(textarea,"leftRight",4,100,20);
                textarea.setAttribute('tips','<font size="4" err>评分小于4星时需要给出20字的文字评论。</font>');
                mx = textarea.getClientRects()[0].left;
                my = textarea.getClientRects()[0].top + 20;
                showTooltip(textarea);
                btn.innerText = "再试一次";
                return;
            }else{
                hideTooltip();
                comments = encodeURI(comments);
                newXMLHttpRequest("POST",".phtml/deliver.php","key=comment&id="+dlvid+"&comments="+comments+"&num="+real_index+"&confirmed="+confirmed,function(rspt){
                    showMsgbox(msgbox,"<h3 style=\"width:100%\">感谢您对此商品的评价</h3><p>感谢您对此商品的评价。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">好的</a>");
                    showBuyOrder(null,null,null,null);
                },function(){
                    netErr2();
                });
            }
        }
    }
    btn.onclick = function(){
        uid = $.md5(filterStr(input.value));
        newXMLHttpRequest("POST",".phtml/deliver.php","key=getUID&id="+dlvid,function(rspt){
            var btn = msgbox.getElementsByClassName("btn")[0];
            if(uid!=$.md5(filterStr(rspt))){
                shakeBox(input,"leftRight",4,100,20);
                input.setAttribute('tips','<font size="4" err>DeBook唯一识别码错误。</font>');
                mx = input.getClientRects()[0].left;
                my = input.getClientRects()[0].top + 20;
                showTooltip(input);
                window.setTimeout(function(){
                    hideTooltip();
                },2000);
                btn.innerText = "再试一次";
                return;
            }else{
                hideTooltip();
                confirmed = 1;
                run();
            }
        },function(){
            netErr2();
        });
    }
}

function returnOrder(dlvid){
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox,"<h3 style=\"width:100%\">确认是否退货</h3><div class='line' style='margin-top: 5px;'></div><ul style=\"padding-left:20px;width:calc(100% - 20px)\"><li>您即将退回选中商品，退货前请与卖家联系并确认。</li><li>如您未与卖家联系并确认，卖家可能会拒绝您的退货申请。</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>确认</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">取消</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    btn.onclick = function(){
        newXMLHttpRequest("POST",".phtml/deliver.php","key=returnOrder&id="+dlvid,function(rspt){
            showBuyOrder(null,null,null,null);
            showMsgbox(msgbox,"<h3 style=\"width:100%\">已经向对方申请退货</h3><div class='line' style='margin-top: 5px;'></div><p>您已成功向对方申请退货。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">好的</a>")
        },function(){
            netErr2();
        });
    }
}

function canReturnOrder(dlvid){
    newXMLHttpRequest("POST",".phtml/deliver.php","key=canReturnOrder&id="+dlvid,function(rspt){
        showBuyOrder(null,null,null,null);
        showSellOrder(null,null,null,null);
    },function(){
        netErr2();
    });
}

function cfmReturnOrder(dlvid){
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox,"<h3 style=\"width:100%\">确认是否同意退货</h3><div class='line' style='margin-top: 5px;'></div><ul style=\"padding-left:20px;width:calc(100% - 20px)\"><li>请在同意退货前确保您的书籍与发货时的状况一样，否则请取消退货。</li><li>如您未与卖家联系并确认书籍状况，请按下‘取消’按钮。</li><li>您一旦确认同意退货，则无法撤回！</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>确认</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">取消</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    btn.onclick = function(){
        newXMLHttpRequest("POST",".phtml/deliver.php","key=cfmReturnOrder&id="+dlvid,function(rspt){
            hideMsgbox(msgbox);
            showSellOrder(null,null,null,null);
        },function(){
            netErr2();
        });
    }
}

function cfmRcvRtnOrder(dlvid){
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox,"<h3 style=\"width:100%\">确认是否收回买家的退货</h3><div class='line' style='margin-top: 5px;'></div><ul style=\"padding-left:20px;width:calc(100% - 20px)\"><li>您即将确认收到买家的退货，在按下‘确认’按钮请确保您已经收货并确认书籍状况与发货前一样。</li><li>如您未收到买家退回的货，请按下‘取消’按钮。</li><li>确认收货后将无法退回未收货的状态！</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>确认</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">取消</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    btn.onclick = function(){
        newXMLHttpRequest("POST",".phtml/deliver.php","key=cfmRcvRtnOrder&id="+dlvid,function(rspt){
            hideMsgbox(msgbox);
            showSellOrder(null,null,null,null);
        },function(){
            netErr2();
        });
    }
}

function cfmPayback(dlvid,price){
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox,"<h3 style=\"width:100%\">确认是否收回所有付款</h3><div class='line' style='margin-top: 5px;'></div><ul style=\"padding-left:20px;width:calc(100% - 20px)\"><li>您即将确认收到卖家的退款，在按下‘确认’按钮请确保您已经收到卖家的退款共计<b>￥"+price.toFixed(2)+"</b>。</li><li>如您未收到卖家的退款，或收回的退款额数不正确，请按下‘取消’按钮。</li><li>确认收款后将无法退回未收款的状态！</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>确认</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">取消</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    btn.onclick = function(){
        newXMLHttpRequest("POST",".phtml/deliver.php","key=cfmPayback&id="+dlvid,function(rspt){
            hideMsgbox(msgbox);
            showBuyOrder(null,null,null,null);
        },function(){
            netErr2();
        });
    }
}