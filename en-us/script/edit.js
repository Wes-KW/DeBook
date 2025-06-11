//bugs: multiple images shouldn't be represented in string with ';', use ':' instead

var images = [];
var labels = [];
var searchIndex = {};
var randAddress = "";

var isE = "-1";
var selIndex = -1;
var bookData = Object();
var authorData = Object();
var listData = Object();

function searchLabel(listcon,str){
    var fn = function(){
        listcon.children[0].innerHTML = "";
        listcon.style.opacity = 0;
        listcon.style.height = "0px";
    }
    if(str!=""){
        newXMLHttpRequest("POST",".phtml/search.php","searchKey=label&str=" + str,function(rspt){
            try{
                var d = JSON.parse(rspt);
                listcon.style.height = "auto";
                listcon.style.opacity = 1;
                listcon.children[0].innerHTML = "";
                if(d.length!=0){
                    if(d.length>1||d[0].label_name!=str){
                        for(var i=0;i<d.length;i++){
                            //creat element
                            var mye = d[i];
                            listcon.children[0].innerHTML+="<li id='" + mye.labelid +  "'>" + mye.label_name + "</li>";
                        }
                    }else{
                        fn();
                    }
                }else{
                    fn();
                }
            }catch(e){
                return 0;
            }
        },function(){
            fn();
        });
    }else{
        fn();
    }
}

function searchAuthor(listcon,str){
    var fn = function(){
        listcon.children[0].innerHTML = "";
        listcon.style.opacity = 0;
        listcon.style.height = "0px";
    }
    if(str!=""){
        newXMLHttpRequest("POST",".phtml/search.php","searchKey=author&str=" + str,function(rspt){
            try{
                var d = JSON.parse(rspt);
                listcon.style.height = "auto";
                listcon.style.opacity = 1;
                listcon.children[0].innerHTML = "";
                if(d.length!=0){
                    if(d.length>1||d[0].label_name!=str){
                        for(var i=0;i<d.length;i++){
                            //creat element
                            var mye = d[i];
                            listcon.children[0].innerHTML+="<li id='" + mye.aurid +  "'>" + decodeURI(mye.names) + "</li>";
                        }
                    }else{
                        fn();
                    }
                }else{
                    fn();
                }
            }catch(e){
                return 0;
            }
        },function(){
            fn();
        });
    }else{
        fn();
    }
}

function searchBook(listcon,str){
    var fn = function(){
        listcon.children[0].innerHTML = "";
        listcon.style.opacity = 0;
        listcon.style.height = "0px";
    }
    if(str!=""){
        newXMLHttpRequest("POST",".phtml/search.php","searchKey=book&str=" + str,function(rspt){
            try{
                var d = JSON.parse(rspt);
                listcon.style.height = "auto";
                listcon.style.opacity = 1;
                listcon.children[0].innerHTML = "";
                if(d.length!=0){
                    if(d.length>1||d[0].label_name!=str){
                        for(var i=0;i<d.length;i++){
                            //creat element
                            var mye = d[i];
                            listcon.children[0].innerHTML+="<li id='" + mye.aurid +  "'>" + decodeURI(mye.names) + "</li>";
                        }
                    }else{
                        fn();
                    }
                }else{
                    fn();
                }
            }catch(e){
                return 0;
            }
        },function(){
            fn();
        });
    }else{
        fn();
    }
}

function selectListBox(listcon,direct){
    selIndex += direct;
    var ul = listcon.children[0];
    selIndex = (selIndex+ul.children.length)%ul.children.length;
    ul.setAttribute("selectedIndex",selIndex);
    for(var i=0;i<ul.children.length;i++){
        if(i==selIndex){
            ul.children[i].setAttribute("selected","");
        }else{
            ul.children[i].removeAttribute("selected");
        }
    }
}

function loadBookTemplate(){
    var p = document.getElementById('title_edit')
    var input_label_con = p.children[1];
    var input_label = input_label_con.children[1];
    var input_aur_con = p.children[2];
    var input_aur = input_aur_con.children[1];
    var ul = input_label_con.children[2].children[0];
    var ul2 = input_aur_con.children[2].children[0];
    //auto search_label
    input_label.onkeyup = function(ent){
        var e = ent||window.event;
        if(e.keyCode!=222&&e.keyCode!=8){
            if(e.keyCode!=38&&e.keyCode!=40&&e.keyCode!=10&&e.keyCode!=13){
                selIndex = -1;
                if(input_label.value!=""){
                    var myval = input_label.value.split(";");
                    searchLabel(input_label_con.children[2],myval[myval.length-1]);
                }else{
                    searchLabel(input_label_con.children[2],"");
                }
            }else if(e.keyCode==38||e.keyCode==40){
                var dir = e.keyCode==38?-1:1;
                selectListBox(input_label_con.children[2],dir);
            }else if(input_label.value!=""&&ul.childElementCount!=0){
                if(selIndex==-1) return;
                var val = input_label.value;
                val = val.substr(0,val.lastIndexOf(";")+1);
                val += ul.children[selIndex].innerHTML += ";";
                input_label.value = val;
                searchLabel(input_label_con.children[2],"");
            }
        }
    }
    input_aur.onkeyup = function(ent){
        var e = ent||window.event;
        if(e.keyCode!=222&e.keyCode!=8){
            if(e.keyCode!=38&&e.keyCode!=40&&e.keyCode!=10&&e.keyCode!=13){
                selIndex = -1;
                if(input_aur.value!=""){
                    var myval = input_aur.value.split(";");
                    searchAuthor(input_aur_con.children[2],myval[myval.length-1]);
                }else{
                    searchAuthor(input_aur_con.children[2],"");
                }
            }else if(e.keyCode==38||e.keyCode==40){
                var dir = e.keyCode==38?-1:1;
                selectListBox(input_aur_con.children[2],dir);
            }else if(input_aur.value!=""&&ul2.childElementCount!=0){
                if(selIndex==-1) return;
                var val = input_aur.value;
                val = val.substr(0,val.lastIndexOf(";")+1);
                val += ul2.children[selIndex].innerHTML += ";";
                input_aur.value = val;
                searchAuthor(input_aur_con.children[2],"");
            }
        }
    }
    input_label.onkeydown = function(ent){
        var e = ent||window.event;
        if(e.keyCode==222){
            e.preventDefault();
        }
    }
    input_aur.onkeydown = function(ent){
        var e = ent||window.event;
        if(e.keyCode==222){
            e.preventDefault;
        }
    }
    addEvent("blur",function(){
        window.setTimeout(function(){
            searchLabel(input_label_con.children[2],"");
        },200);
    },input_label);
    addEvent("blur",function(){
        window.setTimeout(function(){
            searchAuthor(input_aur_con.children[2],"");
        },200)
    },input_aur);
    input_label_con.children[2].onmouseover = function(){
        var labelListClick = function(ele){
            var val = input_label.value;
            val = val.substr(0,val.lastIndexOf(";")+1);
            var i = in_array(ul.children,ele);
            val += ul.children[i].innerHTML += ";";
            input_label.value = val;
            searchLabel(input_label_con.children[2],"");
            input_label.focus();
        }
        selIndex = -1;
        for(var i=0;i<ul.children.length;i++){
            ul.children[i].removeAttribute("selected");
            ul.children[i].onclick = function(){
                labelListClick(this);
            }
        }
    }
    input_aur_con.children[2].onmouseover = function(){
        var aurListClick = function(ele){
            var val = input_aur.value;
            val = val.substr(0,val.lastIndexOf(";")+1);
            var i = in_array(ul2.children,ele);
            val += ul2.children[i].innerHTML += ";";
            input_aur.value = val;
            searchAuthor(input_aur_con.children[2],"");
            input_aur.focus();
        }
        selIndex = -1;
        for(var i=0;i<ul2.children.length;i++){
            ul2.children[i].removeAttribute("selected");
            ul2.children[i].onclick = function(){
                aurListClick(this);
            }
        }
    }
    //auto search author
    //initialize the button
    var butc = document.getElementById("but_continue");
    butc.onclick = function(){
        recordBook();
    }
}

function loadAuthorTemplate(){
    var p = document.getElementById('title_edit');
    var input_book_con = p.children[0];
    var input_book = input_book_con.children[1];
    var ul2 = input_book_con.children[2].children[0];
    //auto search_label
    input_book.onkeyup = function(ent){
        var e = ent||window.event;
        if(e.keyCode!=222&&e.keyCode!=8){
            if(e.keyCode!=38&&e.keyCode!=40&&e.keyCode!=10&&e.keyCode!=13){
                selIndex = -1;
                if(input_book.value!=""){
                    var myval = input_book.value.split(";");
                    searchBook(input_book_con.children[2],myval[myval.length-1]);
                }else{
                    searchBook(input_book_con.children[2],"");
                }
            }else if(e.keyCode==38||e.keyCode==40){
                var dir = e.keyCode==38?-1:1;
                selectListBox(input_book_con.children[2],dir);
            }else if(input_book.value!=""&&ul2.childElementCount!=0){
                if(selIndex==-1) return;
                var val = input_book.value;
                val = val.substr(0,val.lastIndexOf(";")+1);
                val += ul2.children[selIndex].innerHTML += ";";
                input_book.value = val;
                searchBook(input_book_con.children[2],"");
            }
        }
    }
    input_book.onkeydown = function(ent){
        var e = ent||window.event;
        if(e.keyCode==222){
            e.preventDefault();
        }
    }
    addEvent("blur",function(){
        window.setTimeout(function(){
            searchBook(input_book_con.children[2],"");
        },200);
    },input_book);
    input_book_con.children[2].onmouseover = function(){
        var labelListClick = function(ele){
            var val = input_book.value;
            val = val.substr(0,val.lastIndexOf(";")+1);
            var i = in_array(ul2.children,ele);
            val += ul2.children[i].innerHTML += ";";
            input_book.value = val;
            searchBook(input_book_con.children[2],"");
            input_book.focus();
        }
        selIndex = -1;
        for(var i=0;i<ul2.children.length;i++){
            ul2.children[i].removeAttribute("selected");
            ul2.children[i].onclick = function(){
                labelListClick(this);
            }
        }
    }
    var butc = document.getElementById("but_continue");
    butc.onclick = function(){
        recordAuthor();
    }
}

function loadListTemplate(){
    var p = document.getElementById('title_edit');
    var input_label_con = p.children[1];
    var input_label = input_label_con.children[1];
    var ul = input_label_con.children[2].children[0];
    var input_book_con = p.children[4];
    var input_book = input_book_con.children[1];
    var ul2 = input_book_con.children[2].children[0];
    //auto search_label
    input_label.onkeyup = function(ent){
        var e = ent||window.event;
        if(e.keyCode!=222&&e.keyCode!=8){
            if(e.keyCode!=38&&e.keyCode!=40&&e.keyCode!=10&&e.keyCode!=13){
                selIndex = -1;
                if(input_label.value!=""){
                    var myval = input_label.value.split(";");
                    searchLabel(input_label_con.children[2],myval[myval.length-1]);
                }else{
                    searchLabel(input_label_con.children[2],"");
                }
            }else if(e.keyCode==38||e.keyCode==40){
                var dir = e.keyCode==38?-1:1;
                selectListBox(input_label_con.children[2],dir);
            }else if(input_label.value!=""&&ul.childElementCount!=0){
                if(selIndex==-1) return;
                var val = input_label.value;
                val = val.substr(0,val.lastIndexOf(";")+1);
                val += ul.children[selIndex].innerHTML += ";";
                input_label.value = val;
                searchLabel(input_label_con.children[2],"");
            }
        }
    }
    input_label.onkeydown = function(ent){
        var e = ent||window.event;
        if(e.keyCode==222){
            e.preventDefault();
        }
    }
    addEvent("blur",function(){
        window.setTimeout(function(){
            searchLabel(input_label_con.children[2],"");
        },200);
    },input_label);
    input_label_con.children[2].onmouseover = function(){
        var labelListClick = function(ele){
            var val = input_label.value;
            val = val.substr(0,val.lastIndexOf(";")+1);
            var i = in_array(ul.children,ele);
            val += ul.children[i].innerHTML += ";";
            input_label.value = val;
            searchLabel(input_label_con.children[2],"");
            input_label.focus();
        }
        selIndex = -1;
        for(var i=0;i<ul.children.length;i++){
            ul.children[i].removeAttribute("selected");
            ul.children[i].onclick = function(){
                labelListClick(this);
            }
        }
    }
    //auto search_book
    input_book.onkeyup = function(ent){
        var e = ent||window.event;
        if(e.keyCode!=222&&e.keyCode!=8){
            if(e.keyCode!=38&&e.keyCode!=40&&e.keyCode!=10&&e.keyCode!=13){
                selIndex = -1;
                if(input_book.value!=""){
                    var myval = input_book.value.split(";");
                    searchBook(input_book_con.children[2],myval[myval.length-1]);
                }else{
                    searchBook(input_book_con.children[2],"");
                }
            }else if(e.keyCode==38||e.keyCode==40){
                var dir = e.keyCode==38?-1:1;
                selectListBox(input_book_con.children[2],dir);
            }else if(input_book.value!=""&&ul2.childElementCount!=0){
                if(selIndex==-1) return;
                var val = input_book.value;
                val = val.substr(0,val.lastIndexOf(";")+1);
                val += ul2.children[selIndex].innerHTML += ";";
                input_book.value = val;
                searchBook(input_book_con.children[2],"");
            }
        }
    }
    input_book.onkeydown = function(ent){
        var e = ent||window.event;
        if(e.keyCode==222){
            e.preventDefault();
        }
    }
    addEvent("blur",function(){
        window.setTimeout(function(){
            searchBook(input_book_con.children[2],"");
        },200);
    },input_book);
    input_book_con.children[2].onmouseover = function(){
        var labelListClick = function(ele){
            var val = input_book.value;
            val = val.substr(0,val.lastIndexOf(";")+1);
            var i = in_array(ul2.children,ele);
            val += ul2.children[i].innerHTML += ";";
            input_book.value = val;
            searchBook(input_book_con.children[2],"");
            input_book.focus();
        }
        selIndex = -1;
        for(var i=0;i<ul2.children.length;i++){
            ul2.children[i].removeAttribute("selected");
            ul2.children[i].onclick = function(){
                labelListClick(this);
            }
        }
    }
    //auto search author
    //initialize the button
    var butc = document.getElementById("but_continue");
    butc.onclick = function(){
        recordList();
    }
}

function showEdit(id){
    var showInterface = function(){
        var sec = document.getElementsByClassName("section")[0];
        sec.children[0].style.display = "none";
        sec.children[1].style.display = "block";
        if(window.location.hash.indexOf("#edit")<0){
            putHis("","","#edit");
        }
    }
    images = [];
    labels = [];
    searchIndex = {};
    randAddress = "";
    if(editMode==0){
        if(id==null){
            isE = "-1";
            loadBookTemplate();
            showInterface();
        }else{
            newXMLHttpRequest("POST",".phtml/dataRes.php","res=0&id=" + id,function(rspt){
                //load picture from picpath
                var data = JSON.parse(rspt);
                if(data["picpath"]!=""){
                    var _image = document.getElementById("uploadImage");
                    var _images_con = document.getElementById("uploadImageCon");
                    if(_images_con.hasAttribute("edit")){
                        cancelEditAllPic();
                    }
                    var sp = data["picpath"].split(":");
                    var ls = '<a edit="" tips="Add Photos" onmouseover="showTooltip(this)" onmouseleave="hideTooltip(this)" href="javascript:addMulImage();"><img src="Image/src/add.jpg" alt="book_name_picture"></a>';
                    _images_con.innerHTML = "";
                    var pic0 = sp[0];
                    randAddress = pic0;
                    for(var i=1;i<sp.length;i++){
                        _images_con.innerHTML += "<div tips='Edit all images' onmouseover='showTooltip(this)' onmouseleave='hideTooltip(this)'><img alt='Photos of the Book' onclick='editAllPicture()'><a img_delete><div></div><div></div></a></div>";
                        var ele = _images_con.children[i-1];
                        ele.children[0].src = "Image/tmp/" + pic0 + "/" + sp[i];
                        ele.setAttribute("nas",sp[i]);
                        ele.children[1].setAttribute("onclick","deleteMulImage(this)");
                    }
                    _images_con.innerHTML += ls;
                    _image.children[0].children[0].src = "Image/tmp/" + pic0 + "/" + sp[sp.length-1];
                    //add to array
                    for(var i=1;i<sp.length;i++){
                        images[i-1] = sp[i];
                    }
                }
                //load text content
                var input_book = document.getElementById("book_name");
                var input_label = document.getElementById("label_id");
                var input_author = document.getElementById("author_name");
                var contents = document.getElementById("contents");
                var search_index = document.getElementById("search_index");
                input_book.value = decodeURI(data["names"]);
                input_author.value = decodeURI(data["authorid"]);
                input_label.value = decodeURI(data["label"]);
                contents.value = decodeURI(data["contents"]);
                search_index.value = decodeURI(data["search_index"]);
                loadBookTemplate();
                showInterface();
                isE = id;
            },function(){
                badNet();
            });
        }
    }else if(editMode==1){
        if(id==null){
            isE = "-1";
            loadAuthorTemplate();
            showInterface();
        }else{
            newXMLHttpRequest("POST",".phtml/dataRes.php","res=1&id=" + id,function(rspt){
                //load picture from picpath
                var data = JSON.parse(rspt);
                if(data["picpath"]!=""){
                    var _image = document.getElementById("imagebox");
                    var sp = data["picpath"].split(":");
                    var pic0 = sp[0];
                    randAddress = pic0;
                    _image.children[0].children[0].src = "Image/tmp/" + pic0 + "/" + sp[1];
                    //add to array
                    images[0] = sp[1];
                }
                //load text content
                var input_author = document.getElementById("author_name");
                var contents = document.getElementById("contents");
                var search_index = document.getElementById("search_index");
                input_author.value = decodeURI(data["names"]);
                contents.value = decodeURI(data["contents"]);
                search_index.value = decodeURI(data["search_index"]);
                loadAuthorTemplate();
                showInterface();
                isE = id;
            },function(){
                badNet();
            });
        }
    }else if(editMode==2){
        isE = 0;
        if(id==null){
            isE = "-1";
            loadListTemplate();
            showInterface();
        }else{
            newXMLHttpRequest("POST",".phtml/dataRes.php","res=2&id=" + id,function(rspt){
                //load picture from picpath
                var data = JSON.parse(rspt);
                if(data["picpath"]!=""){
                    var _image = document.getElementById("imagebox");
                    var sp = data["picpath"].split(":");
                    var pic0 = sp[0];
                    randAddress = pic0;
                    _image.children[0].children[0].src = "Image/tmp/" + pic0 + "/" + sp[1];
                    //add to array
                    images[0] = sp[1];
                }
                //load text content
                var list_name = document.getElementById("list_name");
                var label_name = document.getElementById("label_name");
                var book_name = document.getElementById("book_name");
                var contents = document.getElementById("contents");
                var search_index = document.getElementById("search_index");
                list_name.value = decodeURI(data["names"]);
                label_name.value = decodeURI(data["label"]);
                book_name.value = decodeURI(data["bookid"])
                contents.value = decodeURI(data["contents"]);
                search_index.value = decodeURI(data["search_index"]);
                loadListTemplate();
                showInterface();
                isE = id;
            },function(){
                badNet();
            });
        }
    }
}

function hideEdit(isCancel){
    var sec = document.getElementsByClassName("section")[0];
    sec.children[0].style.display = "block";
    sec.children[1].style.display = "none";
    if(window.location.hash=="#edit"){
        putHis("","",window.location.search);
    }
    resize();
    //delete pictures
    if(isCancel!=null&&isCancel==true){
        if(randAddress!=""){
            var path = "Image/tmp/"; //for secure reason
            newXMLHttpRequest("POST",".phtml/more/readDir.mode.phtml","key=delete&prlg=allow&path=" + path + randAddress + "/",function(){},function(){});
        }
    }
    images = [];
    //clear interface
    if(editMode==0){
        //book
        var _image = document.getElementById("uploadImage");
        var _images_con = document.getElementById("uploadImageCon");
        _image.children[0].children[0].src = "Image/src/add.jpg";
        _images_con.innerHTML = '<a edit="" tips="Add Photos" onmouseover="showTooltip(this)" onmouseleave="hideTooltip(this)" href="javascript:addMulImage();"><img src="Image/src/add.jpg" alt="book_name_picture"></a>';
        //delete content
        document.getElementById("book_name").value = "";
        document.getElementById("label_id").value = "";
        document.getElementById("author_name").value = "";
        document.getElementById("contents").value = "";
        document.getElementById("search_index").value = "";
    }else if(editMode==1){
        //author
        var _image = document.getElementById("imagebox");
        _image.children[0].children[0].src = "Image/src/add2.jpg";
        //delete content
        document.getElementById("author_name").value = "";
        document.getElementById("contents").value = "";
        document.getElementById("books").value = "";
        document.getElementById("search_index").value = "";
    }else if(editMode==2){
        //list
        var _image = document.getElementById("imagebox");
        _image.children[0].children[0].src = "Image/src/add.jpg";
        //delete content
        document.getElementById("list_name").value = "";
        document.getElementById("label_name").value = "";
        document.getElementById("contents").value = "";
        document.getElementById("book_name").value = "";
        document.getElementById("search_index").value = "";
    }
}

function putHis(arg0,arg1,href){
    if(typeof window.history.pushState!="undefined"){
        if(href.indexOf("javascript")>=0){
            var cmd = href.substring(href.indexOf(":")+1,href.indexOf("("));
            window[cmd]();
        }else{
            history.pushState(arg0,arg1,href);
        }
      }else{
        if(href.indexOf("#")<0){
            History.pushState(arg0,arg1,href);
        }else{
            window.location = href;
        }
      }
}

function addMulImage(){
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    var _image = document.getElementById("uploadImage");
    var _images_con = document.getElementById("uploadImageCon");
    if(_images_con.hasAttribute("edit")){
        cancelEditAllPic();
    }
    var input = document.createElement("input");
    var o = document.getElementById("_ld");
    o.removeAttribute("style");
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
            if(this.readyState==4&&this.status==200){
                var data = "['']";
                try{
                    data = JSON.parse(this.responseText);
                }catch(e){
                    no_err = false
                }
                var no_err = false;
                var err_text = "";
                for(var i=0;i<data.length;i++){
                    if(data[i]==""){
                        no_err = true;
                    }else{
                        err_text = "Unable to upload file(s)<br/>" + data[i] + "<br/>";
                    }
                }
                if(no_err){
                    //echo
                    //display add element
                    var ls = '<a edit="" tips="Add Image" onmouseover="showTooltip(this)" onmouseleave="hideTooltip(this)" href="javascript:addMulImage();"><img src="Image/src/add.jpg" alt="book_name_picture"></a>';
                    _images_con.lastElementChild.outerHTML = "";
                    for(var i=0;i<input.files.length;i++){
                        if(images.indexOf(input.files[i].name)<0){
                            _images_con.innerHTML += "<div tips='Edit all images' onmouseover='showTooltip(this)' onmouseleave='hideTooltip(this)'><img alt='Book image' onclick='editAllPicture()'><a img_delete><div></div><div></div></a></div>";
                            var ele= _images_con.children[images.length+i];
                            ele.children[0].src = "Image/tmp/" + randAddress + "/" + input.files[i].name;
                            ele.setAttribute("nas",input.files[i].name);
                            ele.children[1].setAttribute("onclick","deleteMulImage(this)");
                        }
                    }
                    _images_con.innerHTML += ls;
                    _image.children[0].children[0].src = "Image/tmp/" + randAddress + "/" + input.files[input.files.length-1].name;
                    //add to the array;
                    for(var i=0;i<input.files.length;i++){
                        if(images.indexOf(input.files[i].name)<0){
                            images[images.length] = input.files[i].name;
                        }
                    }
                }else{
                    if(this.responseText=="[]"){
                        showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">Error uploading file</h3><p>An error occur when uploading file(s)</p><style> div.asbox_con{margin-bottom:5px;} div.asbox_con:last-child{margin-bottom:0px;}</style><div class="line" style="margin-top: 5px;"></div><p><b>Some files have the same file name</b><br/>Do not upload files of the same file name</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right="" onclick="hideMsgbox(this.parentElement.parentElement)">OK</a>');
                    } else {
                        showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">Error uploading file</h3><p>An error occur when uploading file(s)</p><style> div.asbox_con{margin-bottom:5px;} div.asbox_con:last-child{margin-bottom:0px;}</style><div class="line" style="margin-top: 5px;"></div><p>' + this.responseText + '</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right="" onclick="hideMsgbox(this.parentElement.parentElement)">OK</a>');
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
    input.style.display = "none";
    document.body.appendChild(input);
    input.type = "file";
    input.id = "ifs";
    input.accept = "image/*";
    input.setAttribute("multiple","");
    input.onchange = function(){
        o.setAttribute("infinite","");
        if(randAddress==""){
            newXMLHttpRequest("POST",".phtml/more/readDir.mode.phtml","key=mkRandDir&path=Image/tmp",function(rspt){
                randAddress = rspt;
                newXMLHttpRequest("POST",".phtml/more/readDir.mode.phtml","key=setDes&path=Image/tmp/" + randAddress + "/",function(rspt2){
                    fn(input);
                },function(){
                    netErr();
                    document.body.removeChild(input);
                    o.removeAttribute("infinite");
                });    
            },function(){
                netErr();
                document.body.removeChild(input);
                o.removeAttribute("infinite");
            });
        }else{
            var rAddress = "Image/tmp/" + randAddress + "/";
            newXMLHttpRequest("POST",".phtml/more/readDir.mode.phtml","key=setDes&path=Image/tmp/" + rAddress + "/",function(rspt2){
                fn(input);
            },function(){
                netErr();
                document.body.removeChild(input);
                o.removeAttribute("infinite");
            });
        }
    }
    $("#ifs").click();
}

function deleteMulImage(obj){
    var name = obj.parentElement.getAttribute("nas");
    var _i = document.getElementById("uploadImage").children[0].children[0];
    if(images.length>0){
        var i = images.indexOf(name);
        newXMLHttpRequest("POST",".phtml/more/readDir.mode.phtml","key=delete&prlg=allow&path=Image/tmp/" + randAddress + "/" +name,null,null);
        images = array_del(images,i);
    }
    if(images.length!=0){
        _i.src = "Image/tmp/" + randAddress + "/" + images[images.length-1];
    }else{
        _i.src = "Image/src/add.jpg";
    }
    obj.parentElement.outerHTML = "";
}

function addSinImage(){
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    var _images_con = document.getElementById("imagebox").children[0].children[0];
    var input = document.createElement("input");
    var o = document.getElementById("_ld");
    o.removeAttribute("style");
    input.style.display = "none";
    input.type = "file";
    input.id = "ifs2";
    input.accept = "image/*";
    document.body.appendChild(input);
    var upload = function(input){
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
            if(this.readyState==4&&this.status==200){
                var data = "['']";
                try{
                    data = JSON.parse(this.responseText);
                }catch(e){
                    no_err = false
                }
                var no_err = false;
                var err_text = "";
                for(var i=0;i<data.length;i++){
                    if(data[i]==""){
                        no_err = true;
                    }else{
                        err_text = "Unable to upload file(s)<br/>" + data[i] + "<br/>";
                    }
                }
                if(no_err){
                    //回显
                    images[0] = input.files[0].name;
                    _images_con.src = "Image/tmp/" + randAddress + "/" + images[0];
                }else{
                    if(this.responseText=="[]"){
                        showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">Error uploading file</h3><p>An error occur when uploading file(s)</p><style> div.asbox_con{margin-bottom:5px;} div.asbox_con:last-child{margin-bottom:0px;}</style><div class="line" style="margin-top: 5px;"></div><p><b>Some files have the same file name</b><br/>Do not upload files of the same file name</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right="" onclick="hideMsgbox(this.parentElement.parentElement)">OK</a>');
                    } else {
                        showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">Error uploading file</h3><p>An error occur when uploading file(s)</p><style> div.asbox_con{margin-bottom:5px;} div.asbox_con:last-child{margin-bottom:0px;}</style><div class="line" style="margin-top: 5px;"></div><p>' + this.responseText + '</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right="" onclick="hideMsgbox(this.parentElement.parentElement)">OK</a>');
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
    };
    input.onchange = function(){
        o.setAttribute("infinite","");
        if(randAddress==""){
            newXMLHttpRequest("POST",".phtml/more/readDir.mode.phtml","key=mkRandDir&path=Image/tmp",function(rspt){
                randAddress = rspt;
                newXMLHttpRequest("POST",".phtml/more/readDir.mode.phtml","key=setDes&path=Image/tmp/" + randAddress + "/",function(){
                    upload(input);
                },function(stOb){
                    netErr();
                    document.body.removeChild(input);
                    o.removeAttribute("infinite");
                });    
            },function(stObj){
                netErr();
                document.body.removeChild(input);
                o.removeAttribute("infinite");
            });
        }else{
            newXMLHttpRequest("POST",".phtml/more/readDir.mode.phtml","key=setDes&path=Image/tmp/" + randAddress + "/",function(){
                upload(input);
            },function(stOb){
                netErr();
                document.body.removeChild(input);
                o.removeAttribute("infinite");
            });  
        }
    }
    $("#ifs2").click();
}

function checkPic(obj){
    if(obj.hasAttribute("checked")){
        obj.removeAttribute("checked");
    }else{
        obj.setAttribute("checked","");
    }
}

function editAllPicture(){
    var _images_con = document.getElementById("uploadImageCon");
    _images_con.setAttribute("edit","");
    for(var i=0;i<_images_con.children.length-1;i++){
        var c = _images_con.children[i];
        c.setAttribute("tips","Select this image");
        c.children[0].removeAttribute("onclick");
        c.children[1].removeAttribute("onclick");
        c.setAttribute("onclick","checkPic(this)");
    }
    var l = _images_con.parentElement;
    l.lastElementChild.innerHTML = "Remove selected images";
    l.lastElementChild.setAttribute("href","javascript:;");
    l.lastElementChild.setAttribute("onclick","deleteMulImages(this)");
    l.innerHTML+="<a href='javascript:cancelEditAllPic();'>Quit</a>";
}

function cancelEditAllPic(){
    var _images_con = document.getElementById("uploadImageCon");
    _images_con.removeAttribute("edit");
    for(var i=0;i<_images_con.children.length-1;i++){
        var c = _images_con.children[i];
        c.setAttribute("tips","Edit all images");
        c.children[0].setAttribute("onclick","editAllPicture()");
        c.children[1].setAttribute("onclick","deleteMulImage(this)");
        c.removeAttribute("onclick");
    }
    var l = _images_con.parentElement;
    l.lastElementChild.outerHTML = "";
    l.lastElementChild.setAttribute("onclick","editAllPicture()");
    l.lastElementChild.innerHTML = "Edit all images";
}

function deleteMulImages(obj){
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox,'<h3 style="margin-bottom:5px;width:100%">Delete all selected images?</h3><p>Please confirm whether to delete the selected pictures.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right="">OK</a><a class="btn" right="" onclick="hideMsgbox(this.parentElement.parentElement)">Cancel</a>');
    var ma = msgbox.children[0].children;
    ma[ma.length-2].onclick = function(){
        var con = obj.parentElement.children[0];
        for(var i=con.children.length-1;i>=0;i--){
            var f = con.children[i];
            if(f.hasAttribute("checked")){
                deleteMulImage(f.children[1]);
            }
        }
        hideMsgbox(msgbox);
    }
}

function boxstyleF(obj){
    obj.style.boxShadow = "#ffcdd2 0.1px 0.1px 2px 3px";
    obj.style.borderColor = "#f44336";
    obj.style.backgroundColor = "#ffffff";
}

function startRecord(data,extraFn){
    // initialize user information
    var tmpUsr = new Object();
    tmpUsr.loggedIn = typeof usr.usrid!="undefined"&&usr.usrid!="";
    tmpUsr.email = tmpUsr.loggedIn?usr.email:"";
    tmpUsr.usrid = tmpUsr.loggedIn?usr.usrid:"";
    var fnRec = function(recData,usrinfo){
        recData = strJson(recData);
        usrinfo = encodeInfo(usrinfo);
        var dn = parseInt(new Date().getTime()/1000);
        newXMLHttpRequest("POST",'.phtml/record.php','recordKey=record&data=' + recData + "&usrinfo=" + usrinfo + "&date=" + dn ,function(rspt){
            var msgbox = document.getElementsByClassName('MsgBox')[0];
            showMsgbox(msgbox,'<h3 style="margin-bottom:5px;width:100%">Thank you for adding/editting a book entry</h3><p>The entry will be posted after auditing</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">好的</a>');
            window.setTimeout(function(){
                hideMsgbox(msgbox);
                hideEdit();
                if(extraFn!=null){
                    if(typeof extraFn=="function"){
                        extraFn();
                    }
                }
            },3000);
            //problem: ask if the user wants to continue to add a book
        },function(){
            badNet();
        });
    }
    if(!tmpUsr.loggedIn){
        var msgbox = document.getElementsByClassName('MsgBox')[0];
        showMsgbox(msgbox,'<h3 style="margin-bottom:5px;width:100%">Leave an email address</h3><p>Since you have not logged in, please leave your email address so that we can inform you of the auditing progress. You can also choose not to fill it in, just leave it blank and press the OK button, after which you will not receive notifications related to the progress of auditing. If you are adding a booklist, not logging in will also mean that you will not be able to modify the booklist in the future.</p><div class="line" style="margin-top: 5px;"></div><div class="asbox_con" style="width:98.4%;"><p title style="width:100%;">&nbsp;电子邮箱</p><input class="asbox" onblur="boxstyle(this.parentElement,0)" onfocus="boxstyle(this.parentElement,1)" autocomplete="off" placeholder="电子邮箱" id=\'eml\'></div><div class="line" style="margin-top: 5px;"></div><a class="btn" right >OK</a><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">Cancel</a>');
        var btn = msgbox.getElementsByClassName("btn")[0];
        btn.onclick = function(){
            tmpUsr.email = "!"+msgbox.getElementsByTagName("input")[0].value;
            fnRec(data,tmpUsr);
        }
        msgbox.getElementsByTagName("input")[0].onkeydown = function(en){
            var e = en||window.event;
            if(e.keyCode==10||e.keyCode==13){
                tmpUsr.email = "!"+msgbox.getElementsByTagName("input")[0].value;
                fnRec(data,tmpUsr);
            }
        }
    }else{
        fnRec(data,tmpUsr);
    }
}

function recordBook(){
    var ic = document.getElementById("uploadImageCon");
    var bn = document.getElementById("book_name");
    var bl = document.getElementById("label_id");
    var an = document.getElementById("author_name");
    var cn = document.getElementById("contents");
    var si = document.getElementById("search_index");
    bookData.book_name = encodeText(bn.value);
    bookData.book_label = encodeText(bl.value);
    bookData.author_name = encodeText(an.value);
    bookData.contents = encodeText(cn.value);
    bookData.searchIndex = encodeText(si.value);
    bookData.images = randAddress + ":";
    if(isE!="-1") bookData.editId = isE;
    for(var i=0;i<images.length;i++){
        bookData.images += btoa(encodeURI(images[i])) + ":";
    }
    bookData.images = bookData.images.substr(0,bookData.images.length-1);
    var c = true;
    var msgText = "<p>The following content is required and cannot be empty.</p><br/><div class='line line-invisible'></div><p>";
    if(images.length==0){
        c = false;
        msgText += "At least one photo of the book cover, ";
        shakeBox(ic.children[0],"leftRight",3,200,20);
        boxstyleF(ic);
    }
    if(bookData.book_name==""){
        c = false;
        msgText += "title of the book, ";
        shakeBox(bn,"leftRight",3,200,20);
        boxstyleF(bn.parentElement);
    }
    if(bookData.author_name==""){
        c = false;
        msgText += "name of the author, ";
        shakeBox(an,"leftRight",3,200,20);
        boxstyleF(an.parentElement);
    }
    if(bookData.contents==""){
        c = false;
        msgText += "a description of the book, ";
        shakeBox(cn,"leftRight",3,200,40);
        boxstyleF(cn.parentElement);
    }
    msgText = msgText.substr(0,msgText.length-2);
    msgText += ".</p><br/><div class='line line-invisible'></div><p>Please check all of the above before continuing.</p>";
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    if(c){
        startRecord(bookData);
    }else{
        showMsgbox(msgbox,'<h3 style="margin-bottom:5px;width:100%">Please fill in the book information completely</h3><p>' + msgText + '</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">OK</a>');
    }
}

function recordAuthor(){
    var an = document.getElementById("author_name");
    var cn = document.getElementById("contents");
    var bn = document.getElementById("books");
    var si = document.getElementById("search_index");
    authorData.author_name = encodeText(an.value);
    authorData.contents = encodeText(cn.value);
    authorData.books = encodeText(bn.value);
    authorData.searchIndex = encodeText(si.value);
    authorData.images = randAddress + ":" + btoa(encodeURI(images[0]));
    if(isE!="-1") authorData.editId = isE;
    var c = true;
    var msgText = "<p>The following content is required and cannot be empty.</p><br/><div class='line line-invisible'></div><p>";
    if(authorData.author_name==""){
        c = false;
        msgText += "Name of the author, ";
        shakeBox(an,"leftRight",3,200,20);
        boxstyleF(an.parentElement);
    }
    if(authorData.contents==""){
        c = false;
        msgText += "a description of the author, ";
        shakeBox(cn,"leftRight",3,200,20);
        boxstyleF(cn.parentElement);
    }
    msgText = msgText.substr(0,msgText.length-2);
    msgText += ".</p><br/><div class='line line-invisible'></div><p>Please check all of the above before continuing.</p>";
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    if(c){
        startRecord(authorData);
    }else{
        showMsgbox(msgbox,'<h3 style="margin-bottom:5px;width:100%">Please fill in the author information completely</h3><p>' + msgText + '</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">好的</a>');
    }
}

function recordList(){
    var an = document.getElementById("list_name");
    var ln = document.getElementById("label_name");
    var cn = document.getElementById("contents");
    var si = document.getElementById("search_index");
    var di = document.getElementById("book_name");
    listData.list_name = encodeText(an.value);
    listData.label_name = encodeText(ln.value);
    listData.book_name = encodeText(di.value);
    listData.contents = encodeText(cn.value);
    listData.searchIndex = encodeText(si.value);
    listData.images = randAddress + ":" + btoa(encodeURI(images[0]));
    if(isE!="-1") listData.editId = isE;
    var c = true;
    var msgText = "<p>The following content is required and cannot be empty.</p><br/><div class='line line-invisible'></div><p>";
    if(listData.list_name==""){
        c = false;
        msgText += "Name of the booklist, ";
        shakeBox(an,"leftRight",3,200,20);
        boxstyleF(an.parentElement);
    }
    if(listData.contents==""){
        c = false;
        msgText += "books you wish to add, ";
        shakeBox(cn,"leftRight",3,200,20);
        boxstyleF(cn.parentElement);
    }
    msgText = msgText.substr(0,msgText.length-2);
    msgText += ".</p><br/><div class='line line-invisible'></div><p>Please check all of the above before continuing.</p>";
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    if(c){
        startRecord(listData);
    }else{
        showMsgbox(msgbox,'<h3 style="margin-bottom:5px;width:100%">Please fill in the booklist information completely</h3><p>' + msgText + '</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">OK</a>');
    }
}

function array_del(array,index){
    var arr = array;
    var d = [];
    for(var i=0;i<arr.length;i++){
        if(i!=index){
            d[d.length] = arr[i];
        }
    }
    return d;
}

function netErr(){
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox,'<h3 style="margin-bottom:5px;width:100%">Error uploading file</h3><style> div.asbox_con{margin-bottom:5px;} div.asbox_con:last-child{margin-bottom:0px;}</style><div class="line" style="margin-top: 5px;"></div><p>You are not connected to the Internet. Please try again after checking the Internet connection</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right="" onclick="hideMsgbox(this.parentElement.parentElement)">OK</a>');
}

function badNet(){
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox,'<h3 style="margin-bottom:5px;width:100%">Check your Internet Conenction</h3><style> div.asbox_con{margin-bottom:5px;} div.asbox_con:last-child{margin-bottom:0px;}</style><div class="line" style="margin-top: 5px;"></div><p>You are not connected to the Internet. Please try again after checking the Internet connection</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right="" onclick="hideMsgbox(this.parentElement.parentElement)">OK</a>');
}

function clearImage(){
    for(var i=0;i<images.length;i++){
        images.pop();
    }
}

function feedback(){
    var webpath = window.location.search+window.location.hash;
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox,"<h3 style=\"width:100%\">Provide a feedback</h3><p>Current URL: <a style='float:none;' target='_blank' href="+webpath+">"+window.location.href+"</a><br/>&nbsp;Describe the problem you have encountered</p><div class='line' style='margin-top: 5px;'></div><div class=\"asbox_con\" style=\"width:calc(100% - 2px)\"><textarea style=\"font-family:consolas;min-height:180px;\" onfocus=\"boxstyle(this.parentElement,1)\" onblur=\"boxstyle(this.parentElement,0)\" placeholder=\"Describe the problem you have encountered\" autocomplete=\"off\"></textarea></div><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>OK</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Cancel</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    var handle = function(email,data){
        data = encodeInfo({"location":webpath,"problem":data});
        newXMLHttpRequest("POST",".phtml/record.php","recordKey=recordFbk&email="+email+"&data="+data)
        var msgbox = document.getElementsByClassName("MsgBox")[0];
        showMsgbox(msgbox,"<h3 style=\"width:100%\">Feedback Received</h3><div class='line' style='margin-top: 5px;'></div><p>Your feedback is received. Thank you for your support to DeBook。</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">OK</a>");
        hideMsgbox(msgbox,3000);
    }
    btn.onclick = function(){
        var textarea = msgbox.getElementsByTagName("textarea")[0];
        var data = textarea.value;
        if(data.length>10){
            hideTooltip();
            if(typeof usr.usrid=="undefined"||usr.usrid==""){
                showMsgbox(msgbox,'<h3 style="margin-bottom:5px;width:100%">Leave your email address</h3><p>Since you have not logged in yet, please leave your email address so that we can promptly notify you of the progress we deal with the issue. You can also choose not to fill it in, just leave it blank and press the confirmation button, and you will no longer receive notifications about it.</p><div class="line" style="margin-top: 5px;"></div><div class="asbox_con" style="width:98.4%;"><p title style="width:100%;">&nbsp;Email</p><input class="asbox" onblur="boxstyle(this.parentElement,0)" onfocus="boxstyle(this.parentElement,1)" autocomplete="off" placeholder="Email" id=\'eml\'></div><div class="line" style="margin-top: 5px;"></div><a class="btn" right >OK</a><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">Cancel</a>');
                var btn = msgbox.getElementsByClassName("btn")[0];
                var input = msgbox.getElementsByTagName("input")[0];
                btn.onclick = function(){
                    handle("!"+input.value,data);
                }
                input.onkeydown = function(e){
                    if(e.keyCode==10||e.keyCode==13){
                        handle("!"+input.value,data);
                    }
                }
                return;
            }
            handle(usr.email,data);
        }else{
            shakeBox(textarea,"leftRight",4,100,20);
            textarea.setAttribute('tips','<font size="4" style="color:red">Please give a detailed description of more than 10 words.</font>');
            mx = textarea.getClientRects()[0].left;
            my = textarea.getClientRects()[0].top + 20;
            var tooltip = showTooltip(textarea);
            var btn = msgbox.getElementsByClassName("btn")[0];
            btn.innerText = "Try again";
            tooltip.onclick = function(){hideTooltip();}
            tooltip.onmouseleave = function(){hideTooltip();}
        }
    }
}