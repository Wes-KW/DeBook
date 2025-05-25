//cart function
function scrollbar(e,direct){
    var l = e.parentElement.children[1];
    l.scrollBy(135*direct,0);
}

function hideNewMsg(){
    var obj = document.getElementById('MsgCon');
    obj.children[0].style.display = "none";
    obj.children[1].style.display = "none";
}

function addToCart(){
    var items = document.getElementById('goodsItemBox').children;
    var addItemId = [];
    for(var i=0;i<items.length;i++){
        if(!items[i].hasAttribute("selected")||!items[i].hasAttribute("goodsid")) continue;
        addItemId[addItemId.length] = items[i].getAttribute("goodsid");
    }
    var strCart = btoa(encodeURI(strJson(addItemId)));
    newXMLHttpRequest("POST",".phtml/cart.php","key=addCart&json="+strCart,function(){
        //load cart page and see
        gotoPage("?cart/newItem/"+strCart);
        putHis("","","?cart");
    },function(){
        netErr2();
    });
}

function reSelectCom(obj){
    var objs = obj.parentElement.children;
    //define click function for each item
    var select = function(obj){
        var selectedNum = 0;
        for(var i=0;i<objs.length;i++){if(objs[i].hasAttribute("selected")&&objs[i].className=="asbox_con") selectedNum++;}
        if(!obj.hasAttribute("selected")){
            if(obj.hasAttribute("null-selected")) obj.removeAttribute("null-selected");
            obj.setAttribute("pre-selected","");
            var newObj = [obj.getAttribute("goodsId")];
            newXMLHttpRequest('POST','.phtml/cart.php',"key=addCart&json="+encodeInfo(newObj),function(){
                obj.removeAttribute("pre-selected");
                obj.setAttribute("selected","");
                //update price

            },function(){
                obj.removeAttribute("pre-selected");
                obj.setAttribute("null-selected","");
                netErr2();
            });
        }else if(selectedNum>1){
            if(obj.hasAttribute("null-selected")) obj.removeAttribute("null-selected");
            if(obj.hasAttribute("selected")) obj.removeAttribute("selected");
            obj.setAttribute("pre-selected","");
            var newObj = [obj.getAttribute("goodsId")];
            newXMLHttpRequest('POST','.phtml/cart.php',"key=deleteCart&json="+encodeInfo(newObj),function(rspt){
                obj.removeAttribute("pre-selected");
                //update price
            },function(){
                obj.removeAttribute("pre-selected");
                obj.setAttribute("null-selected","");
                netErr2();
            });
        }else{
            obj.setAttribute("tips","请按选项框下方的删除按钮将此书移出购物车");
            obj.onmouseleave = function(){hideTooltip();};
            showTooltip(obj,true);
        }
    }
    for(var i=0;i<objs.length;i++){
        objs[i].removeAttribute("onclick");
        if(!objs[i].hasAttribute("disabled")&&objs[i].className=="asbox_con"){
            objs[i].onclick = function(){
                select(this);
            }
        }
    }
    obj.parentElement.removeAttribute("scroll-row");
    obj.parentElement.setAttribute("whole-box","");
}

function deleteCartItem(obj,ids,bookid){
    obj.innerHTML = "<span class=\"bottomA\"></span>";
    obj.removeAttribute("onclick");
    newXMLHttpRequest("POST",".phtml/cart.php","key=deleteCart&json="+encodeInfo(ids),function(){
        var textObj = obj.parentElement.parentElement.parentElement;
        rewritePQ(textObj,bookid,function(){
            var obj2 = obj.parentElement.parentElement.parentElement.parentElement;
            if(obj2.parentElement.children.length==2){
                obj2.outerHTML = "<div class=\"infobox\" style=\"border: 0;padding:6px 0;width:100%;\"><div class=\"chbox\" style=\"top: 6px;\"><input type=\"checkbox\" class=\"asbox\" disabled><span style=\"background-image: url('Image/fatcow/asterisk_yellow.png');\"></span></div><div class=\"text\" style=\"margin-left:25px\"><p class=\"title\">购物车内没有任何书籍</p><p style=\"font-size: 16px;color: #202122;\"><a xhr href=\"?book\">转到书籍主页</a>或<a style=\"cursor:pointer\" onclick=\"focusSearch()\">搜索书籍</a>，以添加一本书籍到购物车。</p></div></div>";
                var btnsp = document.getElementById("chosen_bar").parentElement.children;
                var btns = [btnsp[1],btnsp[2]];
                for(var i=0;i<btns.length;i++){
                    btns[i].outerHTML = "";
                }
                btns = document.getElementsByClassName('shadbox')[0].getElementsByClassName('asbox');
                for(var i=0;i<btns.length;i++){
                    btns[i].setAttribute("disabled","");
                }
            }else{
                obj2.outerHTML = "";
            }
        },function(){
            netErr2();
            obj.innerHTML = "删除";
            obj.setAttribute("onclick","deleteCartItem(this,"+strJson(ids)+")");
        });
    },function(){
        netErr2();
        obj.innerHTML = "删除";
        obj.setAttribute("onclick","deleteCartItem(this,"+strJson(ids)+")");
    });
}

function confirmSelection(obj,bookid){
    obj.innerHTML = "<span class=\"wait\"></span>";
    var con = obj.parentElement.parentElement.parentElement;
    var textObj = con.parentElement.parentElement.parentElement;
    rewritePQ(textObj,bookid,function(){
        con.removeAttribute("whole-box");
        con.setAttribute("scroll-row","");
        var conc = con.children;
        for(var i=0;i<conc.length;i++){
            if((conc[i].hasAttribute("selected")||conc[i].hasAttribute("disabled"))&&conc[i].className=="asbox_con"){
                conc[i].setAttribute("onclick","reSelectCom(this)");
            }
        }
        obj.innerHTML = "<div class=\"big\">确定</div>";
    },function(){
        obj.innerHTML = "<div class=\"big\">再来一次</div>";
    });
}

function rewritePQ(textObj,bookid,fn,errFn){
    newXMLHttpRequest("POST",".phtml/cart.php","key=updateData&bookid="+bookid,function(rspt){
        var data = JSON.parse(rspt);
        var com_icon = textObj;
        var com_ip = com_icon.getElementsByClassName('price')[0];
        var com_ic = com_icon.getElementsByTagName('input')[0];
        var com_topbar = document.getElementById("chosen_bar");
        var com_totalbar = document.getElementById('tcbar');
        var com_pricebar = document.getElementById('tpbar').children[0];
        com_ip.children[2].innerHTML = parseInt(data.item_price);
        com_ip.children[3].innerHTML = Math.round(data.item_price*100%100);
        if(com_ip.children[3].innerHTML.length==1) com_ip.children[3].innerHTML += "0";
        com_ic.value = data.item_count;
        com_topbar.innerHTML = "已选择 "+data.total_count+"/"+data.cart_count+" 件商品";
        com_totalbar.innerHTML = "<b style='font-size: 18px;'>商品小计(共"+data.total_count+"件)</b>";
        com_pricebar.children[1].innerHTML = parseInt(data.total_price);
        com_pricebar.children[2].innerHTML = Math.round(data.total_price*100%100);
        var btns = document.getElementsByClassName('shadbox')[0].getElementsByClassName('asbox');
        if(data.total_count==0){
            btns[0].setAttribute("disabled","");
        }else{
            btns[0].removeAttribute("disabled");
        }
        if(data.cart_count==0){
            btns[1].setAttribute("disabled","");
        }else{
            btns[1].removeAttribute("disabled");
        }
        if(com_pricebar.children[2].innerHTML.length==1) com_pricebar.children[2].innerHTML += "0";
        if(fn!=null) fn();
    },function(){
        netErr2();
        if(errFn!=null) errFn();
    })
}

function infoBoxSelect(infobox){
    if(isPhone()) return;
    var e1 = infobox.getElementsByClassName('k')[0];
    var btns = [];
    var as = infobox.getElementsByTagName('a');
    for(var i=0;i<as.length;i++){
        if(!as[i].hasAttribute("href")) continue;
        btns[btns.length] = as[i];
    }
    btns[btns.length] = e1.children[1].children[0];
    btns[btns.length] = infobox.getElementsByClassName('del')[0];
    btns[btns.length] = infobox.getElementsByTagName('input')[0];
    var inbtnsArea = false;
    for(var i=0;i<btns.length;i++){
        if(btns[i].getClientRects().length==0) continue;
        var x=btns[i].getClientRects()[0].left,w=btns[i].getClientRects()[0].width,y=btns[i].getClientRects()[0].top,h=btns[i].getClientRects()[0].height;
        var x1=x,x2=x+w,y1=y,y2=y+h;
        if(mx>=x1&&mx<=x2&&my>=y1&&my<=y2){
            inbtnsArea = true;
            break;
        }
    }
    if(!inbtnsArea){
        infobox.getElementsByTagName('input')[0].click();
    }
}

function selectItem(obj,num){
    window.setTimeout(function(){
        var bob = obj.parentElement.parentElement;
        var cmd = obj.checked?"addCartSel":"delCartSel";
        newXMLHttpRequest("POST",".phtml/cart.php","key="+cmd+"&bookid="+num,function(rspt){
            rewritePQ(obj.parentElement.parentElement.children[2],num,function(){
                if(obj.checked){
                    bob.setAttribute("selected","");
                }else{
                    bob.removeAttribute("selected");
                }
            },function(){netErr2();});
        },function(){
            netErr2();
        });
    },100);
}

function selectAllItem(obj){
    var allchecked = true;
    var infoboxes = document.getElementsByClassName('mleft')[0].getElementsByClassName("infobox");
    for(var i=0;i<infoboxes.length;i++){
        if(!infoboxes[i].hasAttribute("selected")){
            allchecked = false;
        }
    }
    for(var i=0;i<infoboxes.length;i++){
        if(infoboxes[i].hasAttribute("selected")==allchecked){
            infoboxes[i].children[0].children[0].click();
        }
    }
    obj.innerHTML = allchecked?"选中所有商品":"取消选中所有商品";
}

function deleteAllSelected(){
    var infoboxes = document.getElementsByClassName('mleft')[0].getElementsByClassName("infobox");
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    var count = 0;
    for(var i=0;i<infoboxes.length;i++){
        if(infoboxes[i].hasAttribute("selected")){
            count++;
        }
    }
    if(count==0){
        showMsgbox(msgbox,"<h3 style=\"margin-bottom:5px;width:100%\">没有选中任何商品</h3><p>请选择想要移出购物车的商品后再试一次。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">好的</a>");    
        return;
    }
    showMsgbox(msgbox,"<h3 style=\"margin-bottom:5px;width:100%\">确认删除购物车内选中的商品？</h3><p>此操作无法撤回。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>确认</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">取消</a>");
    msgbox.getElementsByClassName("btn")[0].onclick = function(){
        skipMsgDeleteCartSel();
        hideMsgbox(msgbox);
    }
}

function skipMsgDeleteCartSel(){
    var infoboxes = document.getElementsByClassName('mleft')[0].getElementsByClassName("infobox");
    for(var i=0;i<infoboxes.length;i++){
        if(infoboxes[i].hasAttribute("selected")){
            infoboxes[i].getElementsByClassName('del')[0].click();
        }
    }
}

function clearCart(){
    var infoboxes = document.getElementsByClassName('mleft')[0].getElementsByClassName("infobox");
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox,"<h3 style=\"margin-bottom:5px;width:100%\">确认删除购物车内的所有商品？</h3><p>此操作无法撤回</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>确认</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">取消</a>");
    msgbox.getElementsByClassName("btn")[0].onclick = function(){
        newXMLHttpRequest("POST",".phtml/cart.php","key=clearCart",function(){
            var com_topbar = document.getElementById("chosen_bar");
            var com_totalbar = document.getElementById('tcbar');
            var com_pricebar = document.getElementById('tpbar').children[0];
            com_topbar.innerHTML = "已选择 0/0 件商品";
            com_totalbar.innerHTML = "<b style='font-size: 18px;'>商品小计(共0件)</b>";
            com_pricebar.children[1].innerHTML = 0;
            com_pricebar.children[2].innerHTML = "00";
            var btns = document.getElementsByClassName('shadbox')[0].getElementsByClassName('asbox');
            for(var i=0;i<btns.length;i++) btns[i].setAttribute("disabled","");
            var par = infoboxes[0].parentElement;
            for(var i=0;i<infoboxes.length;i++) infoboxes[i].outerHTML = "";
            par.innerHTML += "<div class=\"infobox\" style=\"border: 0;padding:6px 0;width:100%;\"><div class=\"chbox\" style=\"top: 6px;\"><input type=\"checkbox\" class=\"asbox\" disabled><span style=\"background-image: url('Image/fatcow/asterisk_yellow.png');\"></span></div><div class=\"text\" style=\"margin-left:25px\"><p class=\"title\">购物车内没有任何书籍</p><p style=\"font-size: 16px;color: #202122;\"><a xhr href=\"?book\">转到书籍主页</a>或<a style=\"cursor:pointer\" onclick=\"focusSearch()\">搜索书籍</a>，以添加一本书籍到购物车。</p></div></div>";
            hideMsgbox(msgbox);
        },function(){
            netErr2();
        });
    }
}