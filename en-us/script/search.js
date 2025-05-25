var isSellMode = false;
var runFromSell = false;

function loadSearch(str){
    var d = document.getElementById("searchbox").children[0].children[0].children[0];
    d.focus();
    if(str==null){
        d.value="";
        return;
    }
    d.value = str;
}

function focusSearch(str){
    if(!runFromSell&&isSellMode){
        searchSell();
    }
    var d = document.getElementById("searchbox").children[0].children[0].children[0];
    d.focus();
    d.parentElement.parentElement.style.overflow = "visible";
    d.parentElement.parentElement.parentElement.style.overflow = "visible";
    shakeBox(d,"leftRight",4,125,25);
    loadSearch(str);
    runFromSell = false;
}

function searchSell(){
    var ele = document.getElementById('sellbtn');
    var searchbar = document.getElementsByTagName('form')[0].children[0];
    var searchbtn = document.getElementsByTagName('form')[0].children[0].children[1];
    var atHome = window.location.search=="?"||window.location.search=="";
    if(!isSellMode){
        searchbar.style.backgroundColor = "#f9fbe7";
        searchbtn.setAttribute('sell',"");
        if(atHome){
            runFromSell = true;
            ele.innerText = "Press again to exit";
        }
        focusSearch(searchbar.children[0].value);
    }else{
        searchbar.style.backgroundColor = "#fff";
        searchbtn.removeAttribute('sell');
        if(atHome){
            ele.innerText = "Sell a book";
        }
    }
    isSellMode = !isSellMode;
    displayList();
}

function startSearch(){
    var f = document.getElementById("searchbox").children[0];
    var i = f.children[0].children[0];
    var v = i.value;
    var arg = "";
    if(v=="") return;
    if(v.indexOf(":")>=0){
        var fil = v.split(":");
        fil = [fil[0],fil.slice(1).join(":")];
        fil[0] = fil[0].toLocaleLowerCase();
        if(fil[0]=="book"){
            arg = "?search/"+fil[1];
        }else if(fil[0]=="author"){
            arg = "?search/author/"+fil[1];
        }else if(fil[0]=="list"){
            arg = "?search/list/"+fil[1];
        }else if(fil[0]=="label"){
            return;
        }else{
            arg = "?search/"+v;
        }
    }else{
        arg = "?search/"+v;
    }
    if(arg.indexOf("'")>=0||arg.indexOf('"')>=0) return;
    gotoPage(arg);
    putHis("","",arg);
    i.value = "";
    displayList("","",true);
    i.blur();
}

function initSearch(){
    var f = document.getElementById("searchbox").children[0];
    f.removeAttribute("onsubmit");
    f.onsubmit = function(e){
        e.preventDefault();
        startSearch();
    }
    var x = document.getElementById("searchbox").children[0].children[0].children[0];
    var m = x.parentElement.parentElement.children[1].children[4];
    var clearFn = function(){
        for(var i=0;i<m.childElementCount;i++){
            m.children[i].removeAttribute("selected");
        }
    };
    x.setAttribute("onfocus","boxstyle(this.parentElement,1);extendBox(this.parentElement.parentElement.parentElement,'auto',1);showListCon();");
    x.setAttribute("onblur","boxstyle(this.parentElement,0);extendBox(this.parentElement.parentElement.parentElement,'',0);hideListCon();");
    var btn = document.getElementsByClassName("button");
    for(var i=0;i<btn.length;i++){
        btn[i].setAttribute("onmouseover","showTooltip(this)");
        btn[i].setAttribute("onmouseleave","hideTooltip(this)");
    }
    btn = document.getElementsByClassName("text_btn_default");
    for(var i=0;i<btn.length;i++){
        btn[i].setAttribute("onmouseover","showTooltip(this)");
        btn[i].setAttribute("onmouseleave","hideTooltip(this)");
    }
    btn = document.getElementsByClassName("text_btn");
    for(var i=0;i<btn.length;i++){
        btn[i].setAttribute("onmouseover","showTooltip(this)");
        btn[i].setAttribute("onmouseleave","hideTooltip(this)");
    }
    x.onkeydown = function(e){
        if(e.keyCode===13||e.keyCode===10){
            e.preventDefault();
            if(list_con_index==-1){
                if(!isSellMode){
                    startSearch();
                }else{
                    msgbox = document.getElementsByClassName('MsgBox')[0];
                    showMsgbox(msgbox,'<h3 style="width:100%">请选择其中一本书以继续</h3><p>在选择模式下必须选择一本书才可以继续。按下‘Esc’键退出。</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>好的</a>');
                }
                hideListConTime = 1;
            }else{
                if(m.childElementCount==0){
                    startSearch();
                    return;
                }
                var href = m.children[list_con_index].children[0].getAttribute("href");
                putHis("","",href);
                gotoPage(href);
                hideListConTime = 1;
                x.value = "";
                displayList("","",true);
                x.blur();
            }
        }
    }
    var timeout = null;
    x.onclick = function(){
        list_con_index = -1;
        clearFn();
    }
    m.onmouseover = function(){
        clearFn();
    }
    m.onclick = function(){
        hideListConTime = 1;
        x.blur();
    }
    x.onkeyup = function(e){
        var ml = m.childElementCount;
        if(e.keyCode==13||e.keyCode==10){
            return;
        }else if(e.keyCode==40){
            if(ml==0) return;
            list_con_index = (list_con_index+1)%ml;
            selectListItem();
            return;
        }else if(e.keyCode==38){
            if(ml==0) return;
            if(ml>0&&list_con_index==-1) list_con_index = 0;
            list_con_index = (list_con_index-1+ml)%ml;
            selectListItem();
            return;
        }else if(e.keyCode==27){
            if(isSellMode){
                searchSell();
            }
        }else if(e.keyCode==120){
            searchSell();
        }else if(x.value==""){
            displayList();
        return;
        }
        clearTimeout(timeout);
        timeout = setTimeout(function(){
        tmp_text = x.value;
        var v = x.value;
        var arg = "";
        var typeK = "";
        if(v=="") return;
        if(v.indexOf(":")>=0){
            var fil = v.split(":");
            fil = [fil[0],fil.slice(1).join(":")];
            fil[0] = fil[0].toLocaleLowerCase();
            var filtype = ["book","author","list","label"];
            if(in_array(filtype,fil[0])>-1){
                arg = fil[1];
                typeK = fil[0];
            }else{
                arg = fil[0]+":"+fil[1];
                typeK = "book";
            }
        }else{
            arg = v;
            typeK = "book";
        }
        if(arg.trim()==""){
            displayList();
            return;
        }
        newXMLHttpRequest("POST","search.i.html","cmd=xml&type="+typeK+"&searchkey="+arg,function(rspt){
            try{
                displayList(JSON.parse(rspt),arg);
                list_con_index = -1;
            }catch(e){
            displayList();
            }
        },function(){
            displayList();
        });
        },500);
    }
    }

    var list_con_index = -1;
    var tmp_text = "";

function selectListItem(){
    var x = document.getElementsByTagName("form")[0].children[1];
    var input = document.getElementsByTagName("form")[0].children[0].children[0];
    var list = x.children[4];
    var ml = list.childElementCount;
    if(ml==0) return;
    for(var i=0;i<ml;i++){
        if(i==list_con_index){
            list.children[i].setAttribute("selected","");
        }else{
            list.children[i].removeAttribute("selected");
        }
    }
    if(list_con_index==ml-1){
        input.value = tmp_text;
    }else if(list_con_index>-1){
        var x_pre = tmp_text.indexOf(":");
        var i_pre = x_pre>-1?tmp_text.substr(0,x_pre+1):"";
        input.value = i_pre + list.children[list_con_index].children[0].children[1].children[0].innerText;
    }
    }

function displayList(data,v,hide){
    var x = document.getElementsByTagName("form")[0].children[1];
    var list = x.children[4];
    if(hide===true){
        x.style.display = "none";
    }
    if(data==null||data.length==0){
        for(var i=2;i<4;i++){
            x.children[i].style.display = "block";
        }
        if(isSellMode){
            x.children[1].style.display = "block";
            x.children[0].style.display = "none";
        }else{
            x.children[1].style.display = "none";
            x.children[0].style.display = "block";
        }
        x.children[4].style.display = "none";
        list.innerHTML = "";
    }else{
        list.innerHTML = "";
        for(var i=0;i<4;i++){
            x.children[i].style.display = "none";
        }
        x.children[4].style.display = "block";
        var othertype = false;
        var max = data.length>5?5:data.length;
        var b = false;
        var label_search = false;
        for(var i=0;i<max;i++){
            var d = data[i];
            var img = "";
            var big_text = "";
            var small_text = "";
            var link = "";
            var link2 = "";
            var addStyle = "";
            var booktype = false;
            if(typeof d["bklid"]!="undefined"){
                img = d["picpath"]==""?"Image/fatcow/"+d["fatpic"]+".png":"Image/list/"+d["picpath"];
                addStyle = d["picpath"]==""?"background-size:24px 24px":"";
                link = "?list/"+d["bklid"];
                link2 = "list/";
                b = true;
                big_text = decodeURI(d["names"]);
                if(typeof d["ultra-lang"]!="undefined") big_text += "("+decodeURI(d["ultra-lang"]+")");
                var td = new Date(d["date"]*1000);
                var tdstr = td.getFullYear()+"年"+(td.getMonth()+1)+"月"+td.getDate()+"日";
                small_text = "#书单 由" + d["creator"] + "创建于" + tdstr;
            }else if(typeof d["bookid"]!="undefined"){
                booktype = true;
                img = d["picpath"]==""?"Image/fatcow/book_picture.png":"Image/book/"+d["picpath"];
                addStyle = d["picpath"]==""?"background-size:24px 24px":"";
                var from = location.search;
                link = isSellMode?"?apply/"+d["bookid"]+"#from="+from:"?book/"+d["bookid"];
                b = true;
                big_text = decodeURI(d["names"]);
                if(typeof d["ultra-lang"]!="undefined") big_text += "("+decodeURI(d["ultra-lang"]+")");
                big_text = big_text.replace(new RegExp("%2F","gm"), "/");
                small_text = "#书籍";
            }else if(typeof d["aurid"]!="undefined"){
                img = d["picpath"]==""?"Image/fatcow/user.png":"Image/author/"+d["picpath"];
                addStyle = d["picpath"]==""?"background-size:24px 24px":"";
                link = "?author/"+d["aurid"];
                link2 = "author/";
                b = true;
                big_text = decodeURI(d["names"]);
                if(typeof d["ultra-lang"]!="undefined") big_text += "("+decodeURI(d["ultra-lang"]+")");
                small_text = "#作者";
            }else if(typeof d["labelid"]!="undefined"){
                var img_back = ["yellow","red","purple","pink","orange","green","blue"];
                img = "Image/fatcow/tag_"+img_back[parseInt(Math.random()*7)]+".png";
                addStyle = "background-size:24px 24px"
                link = "?search/labelid/"+d["labelid"];
                big_text = decodeURI(d["label_name"]);
                small_text = "#标签";
                label_search = true;
            }else{
                othertype = true;
                break;
            }
            if(!isSellMode||booktype){
                list.innerHTML += "<li><a xhr href=\""+link+"\"><span img style=\"background-image:url('"+img+"');"+addStyle+"\"></span><p><span>"+big_text+"</span><br/><font class=\"small\">"+small_text+"</font></p></a></li>";
            }
        }
        if(b&&!isSellMode){
            link2 += v;
            link2 = encodeURI(link2);
            list.innerHTML += "<li><a xhr=\"\" href=\"?search/"+link2+"\"><span img style=\"background-image:url('Image/fatcow/magnifier.png');background-size: 20px;height: 27px;\"></span><p style=\"margin:2px 0 20px 32px;\"><span>显示完整搜索结果</span></p></a></li>"; 
        }
        if(label_search&&!isSellMode){
            list.innerHTML += "<li><a xhr href=\"?search/label/all\"><span img style=\"background-image:url('Image/fatcow/magnifier.png');background-size: 20px;height: 27px;\"></span><p style=\"margin:2px 0 20px 32px;\"><span>显示所有标签</span></p></a></li>"
        }
        if(othertype||list.childElementCount==0){
            displayList();
            return;
        }
        initAllLink();
        hideListConTime = 1000;
    }
}

function extendBox(obj,widthd,mode){
    if(window.innerWidth<840){
        if(mode){
            obj.style.zIndex = "2";
            if(widthd=="auto"){
                var p = document.getElementById("topbar").getElementsByClassName("button")[1].getClientRects()[0];
                var d = p.left + p.width - obj.getClientRects()[0].left;
                obj.style.width = d + "px";
            }else{
                obj.style.width = widthd;
            }
        }
    }
    if(force_stay){
        force_stay = false;
        return;
    }
    if(!mode){
        obj.style.position = "";
        obj.style.zIndex = "";
        obj.style.width = "";
    }
}

function showListCon(){
    document.getElementsByClassName("asboxList_con")[0].style.display = "block";
}

function hideListCon(){
    window.setTimeout(function(){
        var b1 = document.getElementsByClassName('asboxList_con')[0] === document.activeElement;
        var b2 = document.getElementsByTagName('form')[0].children[0].children[0] === document.activeElement;
        var b3 = document.getElementsByClassName('asboxList_con')[0].children[2].children[0] === document.activeElement;
        if(!b1&&!b2&&!b3){
            document.getElementsByClassName("asboxList_con")[0].style.display = "none";
        }
        hideListConTime = 200;
    },hideListConTime);
}