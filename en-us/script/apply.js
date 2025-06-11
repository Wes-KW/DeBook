var global_bookid = -1;
var slideStep = 0;
var global_qua = 0;
var sliderBox = {};
var pagesImage = {};
var randApplyAddress = "";
var currentApply = {};
var quesBank = {
    mainQues: ["Book Format", "Page Discoloration", "Page Wear", "Wrinkles", "Paper Yellowing", "Writing Traces"],
    mainAnswer: [
        ["Hardcover", "Paperback", "Thread-bound books", "Other"],
        ["Not at all", "A little", "Quite a bit", "A lot"],
        ["No", "3 pages or less are missing or damaged", "More than 3 pages but less than 10 pages are missing or damaged", "More than 10 pages are missing or damaged"],
        ["No wrinkles or creases", "10 pages or less with wrinkles or creases", "More than 10 pages, 25 pages or less with wrinkles or creases", "More than 25 pages have wrinkles or creases"],
        ["No", "Slightly", "Quite a bit", "A lot"],
        ["No", "Neat notes or drawings that do not affect reading", "Some traces of irrelevant drawings in the book", "A lot of irrelevant drawings in the book"]
    ]
};

function initApply() {
    randApplyAddress = "";
    if (document.getElementById('continue') == null) return;
    var str = window.location.search;
    var funcFail = function () {
        var msgbox = document.getElementsByClassName("MsgBox")[0];
        showMsgbox(msgbox, "<h3 style=\"width:100%\">Select a book to sell</h3><p style=\"width:100%\"></p><p>Press 'OK', type a keyword, hit enter and select a book to continue</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);searchSell();\" right=\"\">OK</a>");
    }
    var loadForms = function () {
        var form2input = document.getElementsByTagName("form")[2].getElementsByTagName("input");
        var div3input = document.getElementById("slider").children[6].getElementsByTagName("input");
        var submit0 = document.getElementById("submit0");
        var cancel0 = document.getElementById("cancel0");
        var submit1 = document.getElementById("submit1");
        var cancel1 = document.getElementById("cancel1");
        for (var i = 0; i < form2input.length; i++) {
            addEvent("keydown", function (e) { if (e.keyCode == 13 || e.keyCode == 10) { e.preventDefault(); } }, form2input[i]);
        }
        for (var i = 0; i < div3input.length; i++) {
            addEvent("keydown", function (e) { if (e.keyCode == 13 || e.keyCode == 10) { e.preventDefault(); } }, div3input[i]);
        }
        cancel0.onclick = function () { NATerm(0); };
        submit0.onclick = function () { NATerm(1); };
        cancel1.onclick = function () { npPage(-1); };
        submit1.onclick = function () { checkForms(function () { npPage(1); }); };
        var d = document.getElementById("termsBox");
        d.onscroll = function () {
            if (d.getClientRects()[0]["height"] + d.scrollTop > d.scrollHeight - 20) {
                submit0.removeAttribute("disabled");
            }
        }
    }
    var cancelOperation = function () {
        var h = location.hash;
        if (h != "" && h.indexOf("from=") >= 0) {
            var from = h.substr(6);
            gotoPage(from);
            putHis("", "", from);
        } else {
            goHome();
            putHis("", "", "?");
        }
        if (randApplyAddress == "") return;
        newXMLHttpRequest("POST", ".phtml/more/readDir.mode.phtml", "key=delete&prlg=allow&path=" + "Image/apply/" + randApplyAddress, function () { }, function () { });
    }
    if (str.indexOf("?apply") >= 0) {
        if (str.indexOf("/") != -1 && str.substr(str.indexOf("/") + 1) != "") {
            var bookid = str.substr(str.indexOf("/") + 1);
            loadForms();
            global_bookid = bookid;
        } else {
            funcFail();
        }
    }
    //create new folder for apply
    var submits = document.getElementsByClassName('asbox_submit');
    for (var i = 0; i < submits.length; i++) {
        if (!submits[i].hasAttribute("button-type")) continue;
        if (submits[i].getAttribute("button-type") != "cancel") continue;
        submits[i].onclick = function () { cancelOperation(); };
    }
    /*
    $(window).bind("beforeunload",function(){
        return "Leaving the site may not save any changes. Are you sure to continue?";
    });
    window.onunload = function(){
        alert("Leaving the site may not save any changes. Are you sure to continue?");
    }*/
}

function addAplinfo(id) {
    if (typeof usr.usrid == "undefined" || usr.usrid == "") {
        gotoPage("?account");
        putHis("", "", "?account#continue=?apply/" + id + "#from=" + location.search);
    } else {
        gotoPage("?apply/" + id);
        putHis("", "", "?apply/" + id + "#from=" + location.search);
    }
}

function selectRadio(obj) {
    obj.children[0].checked = true;
    var c = obj.parentElement.children;
    var i = in_array(c, obj);
    var o2 = obj.parentElement.parentElement.parentElement;
    var c2 = o2.parentElement.children;
    var i2 = in_array(c2, o2);
    obj.parentElement.parentElement.setAttribute("selectedIndex", i);
    for (var x = 0; x < c.length; x++) {
        if (x == i) {
            c[x].setAttribute("selected", "");
        } else {
            c[x].removeAttribute("selected");
        }
    }
    var key = obj.parentElement.getAttribute("name");
    sliderBox[key] = i;
    npSlide(i2 + 1);
}

function npPage(in4) {
    var menuCon = document.getElementById("applymenu");
    var pageCon = document.getElementById("applycon");
    var pageCount = pageCon.childElementCount;
    var step = parseInt(pageCon.getAttribute("step"));
    if (in4 != 1 && in4 != -1) return;
    step += in4;
    if (step < 0 || step >= pageCount) return;
    for (var i = 0; i < pageCount; i++) {
        if (i == step) {
            menuCon.children[i].style = "font-weight:bold";
            pageCon.children[i].style.display = "block";
        } else {
            menuCon.children[i].style = "";
            pageCon.children[i].style.display = "none";
        }
    }
    pageCon.setAttribute("step", step);
}

function npSlide(n) {
    var ind = document.getElementsByClassName("progressInner")[0];
    var slider = document.getElementById("slider");
    slider.children[slideStep].style.opacity = 0;
    if (n === "-1" || n === "+1") {
        if (slideStep <= 0 && n == "-1") return;
        if (slideStep >= 6 && n == "+1") return;
        slideStep += parseInt(n);
    } else {
        if (n > 6 || n < 0) return;
        slideStep = n;
    }
    p = slideStep * 100;
    i = p / 6;
    window.setTimeout(function () {
        slider.children[slideStep].style.opacity = 1;
        ind.style.width = i.toString() + "%";
        slider.style.left = "-" + p.toString() + "%";
    }, 300);
}

function goPage(in4) {
    var menuCon = document.getElementById("applymenu");
    var pageCon = document.getElementById("applycon");
    var pageCount = pageCon.childElementCount;
    var step = in4;
    if (step < 0 || step >= pageCount) return;
    for (var i = 0; i < pageCount; i++) {
        if (i == step) {
            menuCon.children[i].style = "font-weight:bold";
            pageCon.children[i].style.display = "block";
        } else {
            menuCon.children[i].style = "";
            pageCon.children[i].style.display = "none";
        }
    }
    pageCon.setAttribute("step", step);
}

function NATerm(in4) {
    var termNoMsg = document.getElementById("check0");
    if (in4 == 0) {
        putHis("", "", "?");
        goHome();
    } else {
        npPage(1);
        var asgi = termNoMsg.checked ? 1 : 0;
        newXMLHttpRequest("POST", ".phtml/usr.php", "key=noSellMsg&val=" + asgi, function (rspt) { }, function () { })
    }
}

function syncInput() {
    var names = ["translator", "publish", "isbn", "lang", "page", "retail_price"];
    var c = [];
    for (var i = 0; i < names.length; i++) {
        c[i] = document.getElementsByName(names[i]);
    }
    for (var i = 0; i < c.length; i++) {
        var obj = c[i][0];
        var myName = obj.getAttribute("name");
        document.getElementsByName(myName)[1].value = obj.value;
    }
    var inputB = document.getElementsByName("quality")[0];
    inputB.value = generateQuaText(global_qua);
}

function generateQuaText(num) {
    if (num >= 1) return "全新";
    num = Math.round(num * 20) / 20;
    num *= 100;
    var fstr = parseInt(num / 10);
    var bstr = num - fstr * 10;
    var str = fstr + "成";
    if (bstr != 0) str += bstr;
    str += "新";
    return str;
}

function checkForms(fn) {
    if (fn != null && typeof fn == "function") {
        var pub = document.getElementsByName("publish")[0];
        var lang = document.getElementsByName("lang")[0];
        if (pub.value != "" && lang.value != "") {
            fn();
        } else {
            var msgbox = document.getElementsByClassName("MsgBox")[0];
            showMsgbox(msgbox, "<h3 style=\"width:100%\">Required Fields not Completed</h3><p style=\"width:100%\">Please check if you have filled in all the fields below:</p><ul><li>Publisher</li><li>Language</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right=\"\">OK</a>");
        }
    }
}

function vrfy() {
    var bpn = parseInt(document.getElementById("bookPageNum").value);
    var bp = parseFloat(document.getElementById("bookPrice").value);
    var qua = 1;
    var pageCount = 0;
    var pages = [];
    var wrongfn = function () {
        var msgbox = document.getElementsByClassName("MsgBox")[0];
        showMsgbox(msgbox, "<h3 style=\"width:100%\">Required Fields not Completed</h3><p style=\"width:100%\">Please check if you have filled in all the fields below:</p><ul><li>Total Page</li><li>Reference Price</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right=\"\">OK</a>");
    }
    if (isNaN(bpn) || isNaN(bp) || bpn < 5 || bp <= 0) {
        wrongfn();
    } else {
        //vrfy quality
        var bookPc = 0.75;
        qua -= sliderBox.bookPageMiss * 0.2;
        qua -= sliderBox.bookCoverColor * 0.045;
        qua -= sliderBox.bookPageNote * 0.02;
        qua -= sliderBox.bookPageWrinkle * 0.02;
        qua -= sliderBox.bookPageYellow * 0.02;
        var mul = 1 - sliderBox.bookType * 0.05;
        qua *= mul;
        global_qua = qua;
        //select pages randomly
        if (bpn < 10) {
            pageCount = bpn;
        } else if (bpn < 300) {
            pageCount = 5;
        } else if (bpn < 1000) {
            pageCount = 8;
        } else {
            pageCount = 10;
        }
        //show msgbox
        var qual = Math.round(qua * 1000) / 10;
        var qualStr = qual + "%";
        var highP = qua * bookPc * bp * (1.1);
        highP = parseInt(Math.round(highP * 100) / 100) + ".00";
        var lowP = qua * bookPc * bp * (0.9);
        lowP = parseInt(Math.round(lowP * 100) / 100) + ".00";
        while (pages.length < pageCount) {
            var f = false;
            var n = Math.round(Math.random() * (bpn - 1) + 1);
            for (var i = 0; i < pages.length; i++) {
                if (n == pages[i]) {
                    f = true;
                    break;
                }
            }
            if (!f) {
                pages[pages.length] = n;
            }
        }
        for (var i = 0; i < pages.length; i++) {
            var min = i;
            for (var x = i + 1; x < pages.length; x++) {
                if (pages[x] < pages[min]) {
                    min = x;
                }
            }
            var tmp = pages[min];
            pages[min] = pages[i];
            pages[i] = tmp;
        }
        var myPagesImage = {};
        for (var i = 0; i < pages.length; i++) {
            myPagesImage[pages[i].toString()] = null;
        }
        myPagesImage["0"] = null;
        myPagesImage["-1"] = null;
        pagesImage = myPagesImage;
        //add images for the next page
        var str = "Please upload photos of <b>cover</b>, page&nbsp;";
        var od = document.getElementById('pageUploaders');
        od.innerHTML = "";
        od.innerHTML += '<a onclick="uploadApplyImage(this,0)" tips="Add a Photo" onmouseover="showTooltip(this)" onmouseleave="hideTooltip(this)"><span alt="page_cover"></span><span>Cover</span></a>';
        for (var i = 0; i < pages.length; i++) {
            str += "<b>" + pages[i] + "</b>";
            od.innerHTML += '<a onclick="uploadApplyImage(this,' + pages[i] + ')" tips="Add a Photo" onmouseover="showTooltip(this)" onmouseleave="hideTooltip(this)"><span alt="page_cover"></span><span>' + pages[i] + '</span></a>';
            if (i != pages.length - 1) str += ", ";
        }
        od.innerHTML += '<a onclick="uploadApplyImage(this,-1)" tips="Add a Photo" onmouseover="showTooltip(this)" onmouseleave="hideTooltip(this)"><span alt="page_cover"></span><span>Back</span></a>';
        str += "<b>back</b>";
        document.getElementById('pageNum').innerHTML = str;
        var msgbox = document.getElementsByClassName("MsgBox")[0];
        showMsgbox(msgbox, "<h3 style=\"width:100%\">Suggested Sales Price</h3><p style=\"width:100%\"><a xhr href=\"?help/apply/price/price_confirmation\">Learn more how we calculate sales price</a></p><p style=\"width:100%\">The quality of book is " + qualStr + " new. The suggested sales price range is <b>" + lowP + "</b>-<b>" + highP + "</b>. Fill in the sales price below</p><div class=\"line\" style=\"margin-top: 5px;\"></div><div class=\"asbox_con\" edit style=\"margin-bottom: 8px;\"><p title>&nbsp;Sales Price*</p><input class=\"asbox\" placeholder=\"Sales Price\" type=\"number\" min=\"5\" onfocus=\"boxstyle(this.parentElement,1)\" onblur=\"boxstyle(this.parentElement,0)\" autocomplete=\"off\" pattern=\"[0-9]*\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);confirmPrice()\" right=\"\">OK</a><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right=\"\">Cancel</a>");
        var inputA = msgbox.getElementsByTagName("input")[0];
        var btn = msgbox.getElementsByClassName("btn")[0];
        addEvent("keyup", function (e) {
            if (e.keyCode == 10 || e.keyCode == 13) {
                document.getElementsByName("final_price")[0].value = this.value;
            }
        }, inputA);
        addEvent("click", function () {
            document.getElementsByName("final_price")[0].value = inputA.value;
        }, btn);
    }
}

function confirmPrice() {
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    var inputA = msgbox.getElementsByTagName("input")[0];
    var val = parseFloat(inputA.value);
    if (val && val >= 0) {
        npPage(1);
    } else {
        showMsgbox(msgbox, "<h3 style=\"width:100%\">Incomplete or Invalid Information</h3><p style=\"width:100%\">Please check if the following field is completed and valid</p><ul><li>Sales Price</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right=\"\">OK</a>")
    }
}

function uploadApplyImage(obj, pageNum) {
    var fn = function (Inobj) {
        var o = document.getElementById("_ld");
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '.phtml/more/readDir.mode.phtml', true);
        var formData = new FormData();
        for (var i = 0; i < input.files.length; i++) {
            if (images.indexOf(input.files[i].name) < 0) {
                formData.append("files[]", input.files[i]);
            }
        }
        xhr.onreadystatechange = function () {
            var msgbox = document.getElementsByClassName("MsgBox")[0];
            if (this.readyState == 4 && this.status == 200) {
                var data = "['']";
                try {
                    data = JSON.parse(this.responseText);
                } catch (e) {
                    no_err = false;
                }
                var no_err = false;
                var err_text = "";
                for (var i = 0; i < data.length; i++) {
                    if (data[i] == "") {
                        no_err = true;
                    } else {
                        err_text = "Unable to upload file(s)<br/>" + data[i] + "<br/>";
                    }
                }
                if (no_err) {
                    var name = Inobj.files[0].name;
                    obj.children[0].style.backgroundImage = "url('Image/apply/" + randApplyAddress + "/" + name + "')";
                    pagesImage[pageNum.toString()] = name;
                } else {
                    if (this.responseText == "[]") {
                        showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">Error uploading file</h3><p>An error occur when uploading file(s)</p><style> div.asbox_con{margin-bottom:5px;} div.asbox_con:last-child{margin-bottom:0px;}</style><div class="line" style="margin-top: 5px;"></div><p><b>Some files have the same file name</b><br/>Do not upload files of the same file name</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right="" onclick="hideMsgbox(this.parentElement.parentElement)">OK</a>');
                    } else {
                        showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">Error uploading file</h3><p>An error occur when uploading file(s)</p><style> div.asbox_con{margin-bottom:5px;} div.asbox_con:last-child{margin-bottom:0px;}</style><div class="line" style="margin-top: 5px;"></div><p>' + this.responseText + '</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right="" onclick="hideMsgbox(this.parentElement.parentElement)">OK</a>');
                    }
                }
            } else if (this.status == 0) {
                netErr();
            }
            if (in_array(document.body.children, input) >= 0) {
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
    input.onchange = function () {
        if (randApplyAddress == "") {
            newXMLHttpRequest("POST", ".phtml/more/readDir.mode.phtml", "key=mkRandDir&path=Image/apply", function (rspt) {
                randApplyAddress = rspt;
                newXMLHttpRequest("POST", ".phtml/more/readDir.mode.phtml", "key=setDes&path=Image/apply/" + randApplyAddress + "/", function () {
                    fn(input);
                }, function () {
                    badNet();
                    document.body.removeChild(input);
                    o.removeAttribute("infinite");
                });
            }, function () {
                badNet();
                document.body.removeChild(input);
                o.removeAttribute("infinite");
            });
        } else {
            fn(input);
        }
    }
    $("#ifs2").click();
}

function vrfyPic() {
    for (var key in pagesImage) {
        if (pagesImage[key] == null || pagesImage[key] == "") {
            var msgbox = document.getElementsByClassName("MsgBox")[0];
            showMsgbox(msgbox, "<h3 style=\"width:100%\">Please upload images of all the specified pages.</h3><p style=\"width:100%\">Please check if you have uploaded the images of all the specified pages. If uploading fails due to network error, upload the file again. If network error persists, please refresh this page. After uploading all the images, you may proceed.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right=\"\">OK</a>")
            return;
        }
    }
    syncInput();
    npPage(1);
}

function reverifyqua() {
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox, "<h3 style=\"width:100%\">Are you sure to re-estimate the price?</h3><p style=\"width:100%\">Re-estimating the price requires you to fill in the quality form again.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right=\"\">OK</a><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right=\"\">Cancel</a>");
    msgbox.getElementsByClassName("btn")[0].onclick = function () {
        goPage(2);
        npSlide(0);
        hideMsgbox(msgbox);
    }
}

function finish() {
    var inputs = document.getElementsByClassName('confirm')[0].getElementsByTagName('input');
    var bookid = global_bookid;
    var trans = encodeText(inputs[2].value);
    var pub = encodeText(inputs[3].value);
    var isbn = encodeText(inputs[4].value);
    var lang = encodeText(inputs[5].value);
    var price = inputs[9].value;
    var pages = parseInt(inputs[6].value);
    if (isNaN(price) || isNaN(pages)) {
        var msgbox = document.getElementsByClassName("MsgBox")[0];
        showMsgbox(msgbox, "<h3></h3>");
        showMsgbox(msgbox, "<h3 style=\"width:100%\">Invalid Information</h3><p style=\"width:100%\">Please check if you have filled in a valid page number and price.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right>OK</a>");
        return;
    }
    var usrid = usr.usrid;
    var quaObj = encodeInfo({
        "pages": pages,
        "quality_options": sliderBox,
        "quality_value": global_qua,
        "original_price": inputs[8].value,
    })
    var img = encodeInfo({
        "Path": randApplyAddress,
        "Images": pagesImage
    });
    newXMLHttpRequest('POST', '.phtml/apply.php', 'key=recordApply&bookid=' + bookid + '&trans=' + trans + '&pub=' + pub + '&lang=' + lang + '&isbn=' + isbn + '&price=' + price + '&usrid=' + usrid + '&qua=' + quaObj + '&img=' + img, function (rspt) {
        document.getElementById('lastAddressBox').href = window.location.search;
        npPage(1);
    }, function (err) {
        badNet();
    });
}

//bookPageFunction
var allAplOpt = false;

function showAllAplOpt(obj) {
    var con = obj.parentElement.parentElement;
    if (allAplOpt) {
        con.setAttribute("h", "");
        obj.innerHTML = "↓";
        obj.setAttribute("tips", "Show all my listings");
    } else {
        con.removeAttribute("h");
        obj.innerHTML = "↑";
        obj.setAttribute("tips", "Hide all my listings");
    }
    allAplOpt = !allAplOpt;
}

function selectApply(id, obj) {
    var objcon = document.getElementById("numAprice");
    var objNum = objcon.children[0];
    var objPrice = objcon.children[1].children[0];
    var c2btnscon = objcon.children[3].children;
    var c2btns = [c2btnscon[1].children[0], c2btnscon[2].children[0]];
    obj.setAttribute("pre-selected", "");
    newXMLHttpRequest('POST', '.phtml/apply.php', 'key=getPrice&id=' + id, function (rspt) {
        if (rspt != "") {
            obj.removeAttribute("pre-selected");
            if (obj.hasAttribute("selected")) {
                obj.removeAttribute("selected");
                var objVal = parseFloat(objPrice.value) - parseFloat(rspt);
                objPrice.value = objVal.toFixed(2);
            } else {
                obj.setAttribute("selected", "");
                var objVal = parseFloat(objPrice.value) + parseFloat(rspt);
                objPrice.value = objVal.toFixed(2);
            }
            var selectedNum = 0;
            var objs = obj.parentElement.children;
            for (var i = 0; i < objs.length; i++) {
                if (objs[i].hasAttribute("selected")) selectedNum++;
            }
            objNum.innerHTML = "Selected Number: " + selectedNum + " | Price";
            if (selectedNum == 0) {
                c2btns[0].setAttribute("disabled", "");
                c2btns[0].removeAttribute("onclick");
                c2btns[1].setAttribute("disabled", "");
                c2btns[1].removeAttribute("onclick");
            } else {
                if (c2btns[0].hasAttribute("disabled")) c2btns[0].removeAttribute("disabled");
                if (c2btns[1].hasAttribute("disabled")) c2btns[1].removeAttribute("disabled");
                if (!c2btns[0].hasAttribute("onclick")) c2btns[0].setAttribute("onclick", "addToCart()");
                if (!c2btns[1].hasAttribute("onclick")) c2btns[1].setAttribute("onclick", "buy()");
            }
        } else {
            obj.removeAttribute("pre-selected");
            badNet();
        }
    }, function () {
        obj.removeAttribute("pre-selected");
        badNet();
    });
}

function selectAplDsc(id, obj) {
    var c = obj.parentElement.children;
    var idx = in_array(c, obj);
    for (var i = 0; i < c.length; i++) {
        var iobj = c[i];
        if (i == idx) {
            obj.setAttribute("pre-selected", "");
        } else {
            if (iobj.hasAttribute("selected")) {
                iobj.removeAttribute("selected");
            }
            if (iobj.hasAttribute("pre-selected")) {
                iobj.removeAttribute("pre-selected");
            }
            if (iobj.hasAttribute("null-selected")) {
                iobj.removeAttribute("null-selected");
            }
        }
    }
    newXMLHttpRequest('POST', '.phtml/apply.php', 'key=getApply&id=' + id, function (rspt) {
        var aObj = JSON.parse(rspt);
        currentApply = aObj;
        var starClassList = ["star0d0", "star0d5", "star1d0", "star1d5", "star2d0", "star2d5", "star3d0", "star3d5", "star4d0", "star4d5", "star5d0"];
        var evaWordList = ["Extremely Poor", "Very Poor", "Poor", "A bit poor", "Not good", "Moderate", "Not bad", "Good", "Very Good", "Excellent", "Perfect"];
        var detailBoxHtml = "<div class=\"detail\" whiteboard><div class=\"whiteboard\"><div class=\"row\" half><a class=\"sword\">Language</a><p class=\"sword\">" + aObj.lang + "</p></div><div class=\"row\" half><a class=\"sword\">Publisher</a><p class=\"sword\">" + aObj.publish + "</p></div>";
        detailBoxHtml += "<div class=\"row\" half><a class=\"sword\">Page Number</a><p class=\"sword\">" + aObj.quality.pages + "</p></div>";
        if (aObj.ISBN != "") detailBoxHtml += "<div class=\"row\" half><a class=\"sword\">ISBN</a><p class=\"sword\">" + aObj.ISBN + "</p></div>";
        if (aObj.translator != "") detailBoxHtml += "<div class=\"row\" half><a class=\"sword\">Translator</a><p class=\"sword\">" + aObj.translator + "</p></div>";
        var oindex = Math.round(aObj.evanum);
        var usrcls = starClassList[oindex];
        var usrwd = aObj.empty_eva ? "No reviews" : evaWordList[oindex];
        var usreva = aObj.empty_eva ? "(None)" : (aObj.evanum / 2).toFixed(1);
        var dlvAddr = aObj.udlvinfo.address;
        var tel = aObj.udlvinfo.phone_number;
        var email = aObj.email;
        var sch = aObj.udlvinfo.sch_allow ? "Yes" : "No";
        var schHTML = "";
        if (aObj.udlvinfo.sch_allow) schHTML = "<div class=\"row\" half><a class=\"sword\">Ship From (School) Address&nbsp;</a><p class=\"sword\">" + aObj.udlvinfo.sch + "</p></div>"
        var sdays = aObj.udlvinfo.sdays ? "<div class=\"row\" half><a class=\"sword\" green-white>7-Day No-Reason Return</a></div>" : "";
        var qua = aObj.quality.quality_value;
        var fsStr = "";
        if (qua >= 1) {
            fsStr = "Brand New";
        } else {
            qua = Math.round(qua * 20) * 5;
            var f = parseInt(qua / 10);
            var s = qua % 100;
            var fsStr = f + "%";
            if (s != 0) fsStr += s;
            fsStr += " New";
        }
        var imgHTML = "";
        var imgPath = aObj.images.Path;
        for (imgkey in aObj.images.Images) {
            var imgName = aObj.images.Images[imgkey];
            imgHTML += "<img src=\"Image/apply/" + imgPath + "/" + imgName + "\">";
        }
        var evaHtml = aObj.empty_eva ? "<p style='position:relative;float:left;margin-left:5px;color:#202122;'>No Reviews</font>" : "";
        if (!aObj.empty_eva) {
            var aplEva = aObj["evaluations"];
            var usrid = aObj["evaluations"][0]["usrid"];
            for (x = 0; x < aplEva.length; x++) {
                var com = decodeURI(aplEva[x]["contents"]);
                if (com == "") com = "(No Reviews from this User)";
                var usrname2 = aplEva[x]["usrname"];
                if (usrname2 == "") usrname2 = "<font style='color:#757575'>(Anonymous User)</font>";
                var evanum = parseInt(aplEva[x]["evanum"]);
                var className = starClassList[evanum];
                var starHtml = "<i class='" + className + "'></i>";
                var confirmHtml = aplEva[x]["confirmed"] == 1 ? "<font style='color:#800080;font-weight:bold'>Order Received</font>" : "";
                evaHtml += "<div class=\"row\" style=\"margin-top:5px;\"><div><a class=\"sword\">" + usrname2 + "</a>" + starHtml + " " + confirmHtml + "</div><p>" + com + "</p></div>";
            }
            var Tp = aObj["evaluation_page"];
            var Cp = 1;
            var Np = Cp + 1;
            var Pp = Cp - 1;
            var PagePrevAttr = Cp > 1 ? "onclick=\"showAplBookEva('" + usrid + "'," + Pp + ")\"" : "disabled";
            var PageNextAttr = Cp < Tp ? "onclick=\"showAplBookEva('" + usrid + "'," + Np + ")\"" : "disabled";
            var PageLastAttr = Cp < Tp ? "onclick=\"showAplBookEva('" + usrid + "'," + Tp + ")\"" : "disabled";
            evaHtml += "<div class=\"row\" page style=\"margin-top: 10px\"><a " + PagePrevAttr + ">Previous</a><a style=\"color:#202122\">Page 1 of " + Tp + "</a><a " + PageNextAttr + ">Next</a>&nbsp;<a " + PageLastAttr + ">Last Page</a></div>";
            evaHtml = "<div class='evaluation' id='evaluation0'>" + evaHtml + "</div>";
        }
        var abuseHtml = "";
        if (typeof usr.usrid != "undefined" && usr.usrid != "") {
            if (usr.usrid != aObj.usrid) abuseHtml = "&nbsp;<a href=\"javascript:;\" style=\"color:#800080\" onclick=\"reportAbuse('" + aObj.email + "'," + id + ")\">Report Abuse</a>";
        }
        detailBoxHtml += "<div class=\"line\" style=\"margin-top: 0px;\"></div><div class=\"row\" half><a class=\"sword\">Seller</a><p class=\"sword\">" + aObj.udlvinfo.name + "</p><a><i class=\"" + usrcls + "\"></i>&nbsp;" + usreva + " out of 5 " + usrwd + "</a></div><div class=\"row\" half><a class=\"sword\">Ship from Address</a><p class=\"sword\">" + dlvAddr + "</p></div><div class=\"row\" half><a class=\"sword\">Received within the same School</a><p class=\"sword\">" + sch + "</p></div>" + schHTML + sdays + "<div class=\"row\" half><a class=\"sword\">Newness</a><p class=\"sword\">" + fsStr + "</p></div><div class=\"row\" half><a class=\"sword\">Contact - Tel</p><a class=\"sword\">" + tel + "</a></div><div class=\"row\" half><a class=\"sword\">Contact - Email</p><a class=\"sword\">" + email + "</a></div><div class=\"row\" style=\"line-height: normal;\"><p class=\"sword\">Photos&nbsp;<a href=\"javascript:;\" onclick=\"showApplyPicture('" + id + "')\">Show Photos and Details of the Item</a>" + abuseHtml + "</p><div class=\"_all_image\" style=\"width:99.5%;margin-top: 0px;float: right;\"><div class=\"_images_con2\" onclick=\"showApplyPicture(" + id + ")\">" + imgHTML + "</div></div></div><div class=\"line\" style=\"margin-top: 0px;\"></div><div class=\"row\"><a class=\"sword\" style='margin-left:0'>Customer Reviews</a><p class=\"sword\">" + aObj.udlvinfo.name + "</p></div>" + evaHtml + "</div>";
        detailBoxHtml += "</div>";
        document.getElementById("detailCon").innerHTML = detailBoxHtml;
        for (var i = 0; i < c.length; i++) {
            var iobj = c[i];
            if (i == idx) {
                obj.removeAttribute("pre-selected");
                obj.setAttribute("selected", "");
            } else {
                if (iobj.hasAttribute("selected")) {
                    iobj.removeAttribute("selected");
                }
                if (iobj.hasAttribute("pre-selected")) {
                    iobj.removeAttribute("pre-selected");
                }
                if (iobj.hasAttribute("null-selected")) {
                    iobj.removeAttribute("null-selected");
                }
            }
        }
    }, function () {
        obj.removeAttribute("pre-selected");
        obj.setAttribute("null-selected", "");
        badNet();
    });
}

function showApplyPicture(aplid) {
    newXMLHttpRequest("POST", ".phtml/apply.php", "key=getApplyPic&id=" + aplid, function (rspt) {
        var d = JSON.parse(rspt);
        var name = decodeURI(d["names"]);
        while (name.indexOf("%2F") >= 0) name = name.replace("%2F", "/");
        var dh = decodeInfo(d["images"]);
        var picpath = dh.Path;
        var pan = document.getElementById("picture_panel");
        var vb = document.getElementById("viewBox");
        var titlebox = document.getElementById("consBox").children[0].children[0];
        titlebox.innerHTML = name;
        var pb = document.getElementsByClassName("picboxes")[0];
        pb.innerHTML = "";
        for (var k in dh.Images) {
            var word = "";
            if (k == 0) {
                word = "Cover";
            } else if (k == -1) {
                word = "Back";
            } else {
                word = "P. " + k;
            }
            pb.innerHTML += "<a class=\"picbox\" onclick=\"selectAplPic(this)\" pageNum='" + k + "'><img src=\"Image/apply/" + picpath + "/" + dh.Images[k] + "\"><span class='pageNum'>" + word + "</span></a>";
        }
        //start combining word
        var echi = decodeInfo(d["quality"])["quality_options"];
        var echiArr = [echi.bookType, echi.bookCoverColor, echi.bookPageMiss, echi.bookPageWrinkle, echi.bookPageYellow, echi.bookPageNote];
        var descriHtml = "";
        for (var i = 0; i < echiArr.length; i++) {
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
        warn[1].children[0].setAttribute("onclick", "reportAbuse('" + d.usrid + "'," + aplid + ")");
        if (d.usrid == usr.usrid) {
            warn[1].children[0].style.display = "none";
        } else {
            warn[1].children[0].style.display = "";
        }
        pan.style.display = "block";
        document.body.style.overflow = "hidden";
    }, function (stObj) {
        if (stObj.status == 0) {
            advice = "Please make sure you are online";
        } else if (stObj.status == 403) {
            advice = "Please make sure you have permission to access this page";
        } else if (stObj.status == 404 || stObj.status == 500) {
            advice = "Please make sure there is no error in the access path";
        }
        showMsgbox(msgbox, '<h3 style="width:100%">Network Error</h3><p>An error occurred while accessing the network. The error code is: ' + stObj.status + '，' + advice + '。</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>');
    });
}

function selectAplPic(obj) {
    var p = obj.parentElement.children;
    var ind = in_array(p, obj);
    for (var i = 0; i < p.length; i++) {
        if (i == ind) {
            p[i].setAttribute("selected", "");
        } else {
            p[i].removeAttribute("selected");
        }
    }
    var vb = document.getElementById("viewBox");
    vb.children[0].children[0].src = obj.children[0].src;
    var word = "";
    if (obj.getAttribute("pageNum") == 0) {
        word = "Cover";
    } else if (obj.getAttribute("pageNum") == -1) {
        word = "Back";
    } else {
        word = "P. " + obj.getAttribute("pageNum");
    }
}

function delApply(obj, id) {
    newXMLHttpRequest("POST", ".phtml/apply.php", "key=delApply&id=" + id + "&prlg=allow", function (rspt) {
        var table = obj.parentElement.parentElement.parentElement;
        obj.parentElement.parentElement.outerHTML = "";
        if (table.childElementCount == 0) {
            table.innerHTML += "<td colspan=\"7\" style=\"text-align: center;background-color: #f2f4f6;\">(No Listings)</td>";
        }
    }, function () {
        badNet();
    });
}

function updateAplPrice(obj, id) {
    var oriprice = 0;
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    showMsgbox(msgbox, "<h3 style=\"width:100%\">Reference Price</h3><p style=\"width:100%\">Enter the price when you bought this book or a price at a shopping site</p><div class=\"line\" style=\"margin-top: 5px;\"></div><div class=\"asbox_con\" edit style=\"margin-bottom: 8px;\"><p title>&nbsp;Sales Price*</p><input class=\"asbox\" placeholder=\"Sales Price\" type=\"number\" pattern=\"[0-9]*\" min=\"5\" onfocus=\"boxstyle(this.parentElement,1)\" onblur=\"boxstyle(this.parentElement,0)\" autocomplete=\"off\" pattern=\"[0-9]*\"></div><a class=\"btn\">OK</a><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right>Cancel</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    var input = msgbox.getElementsByTagName("input")[0];
    btn.onclick = function () {
        oriprice = parseFloat(input.value);
        if (isNaN(oriprice) || oriprice <= 0) {
            shakeBox(input, "leftRight", 4, 100, 20);
            input.setAttribute('tips', '<font size="4" err>Invalid price format or incomplete field</font>');
            mx = input.getClientRects()[0].left;
            my = input.getClientRects()[0].top + 20;
            showTooltip(input);
            btn.innerText = "Try Again";
            return;
        } else {
            hideTooltip();
            input.removeAttribute("tips");
        }
        newXMLHttpRequest('POST', ".phtml/apply.php", "key=getAplQua&id=" + id, function (rspt) {
            var d = JSON.parse(rspt);
            var qua = d.quality_value;
            var bookPc = 0.75;
            var bp = oriprice;
            var qual = Math.round(qua * 1000) / 10;
            var qualStr = qual + "%";
            var highP = qua * bookPc * bp * (1.1);
            highP = parseInt(Math.round(highP * 100) / 100) + ".00";
            var lowP = qua * bookPc * bp * (0.9);
            lowP = parseInt(Math.round(lowP * 100) / 100) + ".00";
            showMsgbox(msgbox, "<h3 style=\"width:100%\">Suggested Sale Price</h3><p style=\"width:100%\"><a xhr href=\"?help/apply/price/price_confirmation\">Learn how price suggestion is determined</a></p><p style=\"width:100%\">The quality of book is " + qualStr + ", our suggested sale price range is <b>" + lowP + "</b>-<b>" + highP + "</b>. Fill in the sales price below</p><div class=\"line\" style=\"margin-top: 5px;\"></div><div class=\"asbox_con\" edit style=\"margin-bottom: 8px;\"><p title>&nbsp;Sales Price*</p><input class=\"asbox\" placeholder=\"Sales Price\" type=\"number\" min=\"5\" onfocus=\"boxstyle(this.parentElement,1)\" onblur=\"boxstyle(this.parentElement,0)\" autocomplete=\"off\" pattern=\"[0-9]*\"></div><a class=\"btn\">OK</a><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right>Cancel<a>");
            btn = msgbox.getElementsByClassName("btn")[0];
            input = msgbox.getElementsByTagName("input")[0];
            var confirm = function () {
                var rprice = parseFloat(input.value);
                if (isNaN(rprice) || rprice <= 0) {
                    shakeBox(input, "leftRight", 4, 100, 20);
                    input.setAttribute('tips', '<font size="4" err>Invalid price format or incomplete field</font>');
                    mx = input.getClientRects()[0].left;
                    my = input.getClientRects()[0].top + 20;
                    showTooltip(input);
                    btn.innerText = "Try Again";
                    return;
                } else {
                    hideTooltip();
                    input.removeAttribute("tips");
                }
                newXMLHttpRequest("POST", ".phtml/apply.php", "key=updateAplPrice&id=" + id + "&price=" + rprice, function () {
                    obj.parentElement.parentElement.children[4].innerHTML = "￥" + rprice.toFixed(2);
                    hideMsgbox(msgbox);
                }, function () {
                    badNet();
                });
                hideMsgbox(obj)
            }
            btn.onclick = function () { confirm() };
            input.onkeydown = function (e) {
                var evt = e || window.event;
                if (evt.keyCode == 13 || evt.keyCode == 10) {
                    confirm();
                }
            }
        }, function () {
            badNet();
        });
    }
    input.onkeydown = function (e) {
        var evt = e || window.event;
        if (evt.keyCode == 13 || evt.keyCode == 10) {
            btn.onclick();
        }
    }
}

function updateAplPic(aplid) {
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    var vrfyPic = function () {
        for (var key in pagesImage) {
            if (pagesImage[key] == null || pagesImage[key] == "") {
                var msgbox = document.getElementsByClassName("MsgBox")[0];
                showMsgbox(msgbox, "<h3 style=\"width:100%\">Please be sure to upload all the real photos of the specified pages.</h3><p style=\"width:100%\">Please check whether all the real photos of the specified pages have been uploaded. If the upload failed due to network problems, please try to upload again. If the network problem continues, please refresh this page. Please make sure that all pictures have been uploaded successfully before clicking the \"Next\" button.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right=\"\">OK</a>")
                return;
            }
        }
        var imageObj = { "Path": randApplyAddress, "Images": pagesImage };
        var imageInfo = encodeInfo(imageObj);
        newXMLHttpRequest("POST", ".phtml/apply.php", "key=updateApplyPic&id=" + aplid + "&images=" + imageInfo, function () {
            var msgbox = document.getElementsByClassName('MsgBox')[0];
            showMsgbox(msgbox, "<h3 style=\"width:100%\">Successfully changed the supply image</h3><p style=\"width:100%\">Successfully changed the supply image.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right>Okay</a>");
        }, function () {
            badNet();
        });
    }
    newXMLHttpRequest("POST", ".phtml/apply.php", "key=getApplyPic&id=" + aplid, function (rspt) {
        var data = JSON.parse(rspt);
        imageData = decodeInfo(data.images);
        pagesImage = imageData.Images;
        randApplyAddress = imageData.Path;
        newXMLHttpRequest("POST", ".phtml/more/readDir.mode.phtml", "key=setDes&path=Image/apply/" + randApplyAddress + "/", function () {
            var pageUpHtml = "";
            for (var key in pagesImage) {
                var pageStr = "";
                var img = pagesImage[key];
                if (key == 0) {
                    pageStr = "cover";
                } else if (key == -1) {
                    pageStr = "back";
                } else {
                    pageStr = key + "page";
                }
                pageUpHtml += '<a onclick="uploadApplyImage(this,' + key + ')" tips="Change image" onmouseover="showTooltip(this)" onmouseleave="hideTooltip(this)"><span alt="page_cover" style=\'background-image:url("Image/apply/' + randApplyAddress + '/' + img + '")\'></span><span>' + pageStr + '</span></a>';
            }
            showMsgbox(msgbox, "<h3 style=\"width:100%\">Change supply image</h3><p style=\"width:100%\">Currently changing the supply named <strong>" + data.names + "</strong>, click once on the page you want to change to upload the image. </p><div class=\"line\" style=\"margin-top: 5px;\"></div><div class=\"rinnerCon\" upload id=\"pageUploaders\">" + pageUpHtml + "</div><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\">Confirm</a><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right>Cancel</a>");
            var btn = msgbox.getElementsByClassName("btn")[0];
            btn.onclick = function () {
                vrfyPic();
            }
        }, function () {
            badNet();
        });
    }, function () {
        badNet();
    });
}

function deleteAplSelect() {
    var st = document.getElementById('apply_table').getElementsByTagName("tr");
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    var count = 0;
    for (var i = 0; i < st.length; i++) {
        if (!(st[i].hasAttribute("id") && st[i].getAttribute("selected") == "true")) continue;
        count++;
    }
    if (count == 0) {
        showMsgbox(msgbox, "<h3 style=\"margin-bottom:5px;width:100%\">No supply selected</h3><p>Please select the supply you want to delete and try again.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">OK</a>");
        return;
    }
    showMsgbox(msgbox, "<h3 style=\"margin-bottom:5px;width:100%\">Confirm to delete all selected supplies?</h3><p>This operation cannot be undone.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>Confirm</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Cancel</a>");
    msgbox.getElementsByClassName("btn")[0].onclick = function () {
        var fault = false;
        for (var i = 0; i < st.length; i++) {
            if (!(st[i].hasAttribute("id") && st[i].getAttribute("selected") == "true")) continue;
            var p = st[i].getElementsByClassName('del');
            if (p.length > 0) {
                p[0].click();
            } else {
                fault = true;
            }
        }
        if (!fault) {
            hideMsgbox(msgbox);
        } else {
            showMsgbox(msgbox, "<h3 style=\"margin-bottom:5px;width:100%\">One ​​or more errors occurred during deletion</h3><p>One or more selected supplies have been sold and cannot be deleted.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Okay</a>");
        }

    }
}

function showBookEva(bookid, page) {
    var dom = document.getElementById("evaluation1");
    dom.innerHTML = "<span class='bottomA'></span>";
    var rpage = page - 1;
    newXMLHttpRequest("POST", ".phtml/apply.php", "key=getBookEvaluation&id=" + bookid + "&page=" + rpage, function (rspt) {
        dom.innerHTML = "";
        var data = JSON.parse(rspt);
        var evaData = data["data"];
        var starClassList = ["star0d0", "star0d5", "star1d0", "star1d5", "star2d0", "star2d5", "star3d0", "star3d5", "star4d0", "star4d5", "star5d0"];
        for (var i = 0; i < evaData.length; i++) {
            var com = decodeURI(evaData[i]["contents"]);
            if (com == "") com = "(This user has not written any comments)";
            var usrname = evaData[i]["usrname"];
            if (usrname == "") usrname = "<font style='color:#757575'>(Anonymous user)</font>";
            var evanum = parseInt(evaData[i]["evanum"]);
            var className = starClassList[evanum];
            starHtml = "<i class='" + className + "'></i>";
            dom.innerHTML += "<div class=\"row\" style=\"margin-top:5px;\"><div><a class=\"sword\">" + usrname + "</a>" + starHtml + "</div><p>" + com + "</p></div>";
        }
        //page control 
        var Tp = data["page_count"];
        var Cp = page;
        var Np = Cp + 1;
        var Pp = Cp - 1;
        var PagePrevAttr = Cp > 1 ? "onclick='showBookEva(" + bookid + "," + Pp + ")'" : "disabled";
        varPageNextAttr = Cp < Tp ? "onclick='showBookEva(" + bookid + "," + Np + ")'" : "disabled";
        var PageLastAttr = Cp < Tp ? "onclick='showBookEva(" + bookid + "," + Tp + ")'" : "disabled";
        dom.innerHTML += "<div class=\"row\" page style=\"margin-top: 10px\" id='evabookpage'><a " + PagePrevAttr + ">Previous page</a><a style=\"color:#202122\">Page " + page + " of " + Tp + " pages</a><a " + PageNextAttr + ">Next page</a>&nbsp;<a " + PageLastAttr + ">Go to the last page</a></div>";
    }, function () {
        dom.innerHTML = "";
        dom.innerHTML = "<div class='row' style='width:100%;text-align:center'>No network, try <a style='float:none' onclick='showBookEva(" + bookid + "," + page + ")'>reload</a>. </div>";
        badNet();
    });
}

function showAplBookEva(usrid, page) {
    var dom = document.getElementById("evaluation0");
    dom.innerHTML = "<span class='bottomA'></span>";
    var rpage = page - 1;
    newXMLHttpRequest("POST", ".phtml/apply.php", "key=getApplyEvaluation&id=" + usrid + "&page=" + rpage, function (rspt) {
        dom.innerHTML = "";
        var data = JSON.parse(rspt);
        var evaData = data["data"];
        var starClassList = ["star0d0", "star0d5", "star1d0", "star1d5", "star2d0", "star2d5", "star3d0", "star3d5", "star4d0", "star4d5", "star5d0"];
        for (var i = 0; i < evaData.length; i++) {
            var com = decodeURI(evaData[i]["contents"]);
            if (com == "") com = "(This user has not written any comments)";
            var usrname = evaData[i]["usrname"];
            if (usrname == "") usrname = "<font style='color:#757575'>(Anonymous user)</font>";
            var evanum = parseInt(evaData[i]["evanum"]);
            var className = starClassList[evanum];
            starHtml = "<i class='" + className + "'></i>";
            dom.innerHTML += "<div class=\"row\" style=\"margin-top:5px;\"><div><a class=\"sword\">" + usrname + "</a>" + starHtml + "</div><p>" + com + "</p></div>";
        }
        //page control 
        var Tp = data["page_count"];
        var Cp = page;
        var Np = Cp + 1;
        var Pp = Cp - 1;
        var PagePrevAttr = Cp > 1 ? "onclick=\"showAplBookEva('" + usrid + "'," + Pp + ")\"" : "disabled";
        var PageNextAttr = Cp < Tp ? "onclick=\"showAplBookEva('" + usrid + "'," + Np + ")\"" : "disabled"; var PageLastAttr = Cp < Tp ? "onclick=\"showAplBookEva('" + usrid + "'," + Tp + ")\"" : "disabled";
        dom.innerHTML += "<div class=\"row\" page style=\"margin-top: 10px\" id='evabookpage'><a " + PagePrevAttr + ">Previous page</a><a style=\"color:#202122\">Page " + page + " of " + Tp + " pages</a><a " + PageNextAttr + ">Next page</a>&nbsp;<a " + PageLastAttr + ">Go to the last page</a></div>";
    }, function () {
        dom.innerHTML = "";
        dom.innerHTML = "<div class='row' style='width:100%;text-align:center'>No network, try <a style='float:none' onclick='showBookEva(" + bookid + "," + page + ")'>Reload</a>. </div>";
        badNet();
    });
}

function redeemBook(bookid) {
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    var selectedData = [];
    var updateDlv = function (receipt) {
        //check if there is a pay passcodev
        var paypasscode = usr.pwd.split(":")[1];
        if (paypasscode == "") {
            showMsgbox(msgbox, "<h3 style=\"width:100%\">You do not have a payment password, please add a payment password to continue.</h3><p style=\"width:100%\">You need a payment password to use DeCoins points. Please click the 'OK' button to create a new payment password and continue to complete the redemption operation.<a xhr style=\"float:none\" href=\"?help/purchase/consumer_conflict\">Click here for details</a>. </p><div class=\"radioCon\" style=\"margin-top:5px\">" + missListHtml + "</div><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>Confirm</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Cancel</a>");
            showUpdatePassword1(function () {
                updateDlv2(receipt);
            });
        } else {
            showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">Enter payment password</h3><p>Enter payment password to pay DeCoins points</p><div class="line" style="margin-top: 5px;"></div>\<div class="split_input"><div class="asbox_con"><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1"></div><div class="asbox_con"><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1"></div><div class="asbox_con"><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1"></div><div class="asbox_con"><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1"></div><div class="asbox_con"><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1"></div><div class="asbox_con"><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1"></div></div><div class="line" style="margin-top: 5px;"></div><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">Cancel</a>');
            var d = msgbox.getElementsByClassName('split_input')[0]; makeSplitInput(d);
            var l = d.lastElementChild.children[0];
            l.onkeyup = function () {
                if (l.value.length > 0) {
                    var pwdp = $.md5(getSplitInputValue(d));
                    if (pwdp == paypasscode) {
                        updateDlv2(receipt);
                    } else {
                        shakeBox(d.children[0], "leftRight", 3, 50, 10);
                        btn.innerHTML = "Try again";
                        d.setAttribute('tips', '<font size="4" err>Password is incorrect</font>');
                        mx = d.getClientRects()[0].left;
                        my = d.getClientRects()[0].top + 20;
                        showTooltip(d);
                        window.setTimeout(function () {
                            hideTooltip(input);
                        }, 1000);
                    }
                }
            }
        }
    }
    var updateDlv2 = function (receipt) {
        newXMLHttpRequest("POST", ".phtml/deliver.php", "key=generateSpecialOrder&id=" + strJson(selectedData) + "&receipt=" + receipt + "&usrid=" + usr.usrid, function (rspt) {
            var dat = JSON.parse(rspt);
            if (dat["coins_err"] == 1) {
                showMsgbox(msgbox, "<h3 style=\"width:100%\">Failed to redeem product</h3><p style=\"width:100%\">Failed to redeem the following products because your DeCoins points are only " + dat["coins_me"] + ", and redeeming all selected books requires " + dat["coins_needed"] + "DeCoins points. </p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">OK</a>");
                return;
            }
            window.setTimeout(function () {
                var data = dat["miss"];
                if (data.length > 0) {
                    var missListHtml = "";
                    for (var i = 0; i < data.length; i++) {
                        var aurstr = "";
                        var count = 0;
                        if (!data[i].hasOwnProperty("bookAuthor")) continue;
                        for (var x = 0; x < data[i].bookAuthor.length; x++) {
                            count++;
                            if (x > 3) continue;
                            aurstr += data[i].bookAuthor[x] + ";";
                        }
                        if (count > 3) {
                            aurstr += aurstr.substr(0, aurstr.length - 1) + "etc.";
                        }
                        missListHtml += "<a class=\"radioBox\" href=\"javascript:;\"><input class=\"asbox\" type=\"radio\" onclick=\"selectDlvRadio(this.parentElement)\"><span style=\"background-image:url('Image/fatcow/error.png')\"></span><p>" + data[i].bookName + " " + aurstr + " (" + data[i].lang + " " + data[i].publish + ")<br/>Price: <b>" + parseFloat(data[i].price).toFixed(2) + "</b>; Supplier <b>" + data[i].udlvinfo.name + "</b></p></a>";
                    }
                    showMsgbox(msgbox, "<h3 style=\"width:100%\">Failed to redeem the following products</h3><p style=\"width:100%\">Failed to redeem the following products because the following products have been purchased by other customers or deleted by the seller.<a xhr style=\"float:none\" href=\"?help/purchase/consumer_conflict\">Click here for details</a>.</p><div class=\"radioCon\" style=\"margin-top:5px\">" + missListHtml + "</div><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">OK</a>");
                } else {
                    showMsgbox(msgbox, "<h3 style=\"width:100%\">Goods exchanged successfully</h3><p style=\"width:100%\">DeCoins points paid <span class=\"price\">" + dat["coins"] + "</span>. You do not need to contact the seller manually for the exchanged goods. Please wait patiently for DeBook to ship them for you.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">OK</a>");
                }
                gotoPage("?account");
                putHis("", "", "?account");
            }, 100);
        }, function () {
            badNet();
        });
    }
    var loadSelectedData = function () {
        var obj = msgbox.getElementsByClassName("row")[0];
        selectedData = [];
        var p = 0;
        var q = 0;
        var c = obj.children;
        for (var i = 0; i < c.length; i++) {
            if (c[i].hasAttribute("selected")) {
                selectedData[selectedData.length] = c[i].getAttribute("dataid");
                p += parseFloat(c[i].getAttribute("data-price"));
                q++;
            }
        }
        var pqbox = document.getElementById("redeemPQ");
        pqbox.innerHTML = p.toFixed(2) + " DeCoins points (" + q + " pieces), <font style='color:#0366d6'>Balance:" + parseInt(usr.coins).toFixed(2) + "</font>";
        var btn = msgbox.getElementsByClassName("btn")[0];
        if (q == 0 || p > usr.coins) {
            btn.setAttribute("disabled", "");
            btn.onclick = null;
        } else {
            btn.removeAttribute("disabled");
            btn.onclick = function () {
                //select a location and generate order 
                var addr = usr.receipt_info;
                var addrHtml = "";
                addr = addr.split(":");
                var count = 0;
                for (var i = 0; i < addr.length; i++) {
                    if (addr[i] == "") continue;
                    var data = decodeInfo(addr[i]);
                    var address = data.address.length > 16 ? data.address.substr(0, 3) + "..." + data.address.substr(data.address.length - 10) : data.address
                    var isDefault = data.id.indexOf("|A") == 1;
                    var defaultStr = isDefault ? " <font default>(Default)</font>" : "";
                    var selectedStr = isDefault ? "selected" : "";
                    var selectedStr2 = isDefault ? "checked" : "";
                    var tele = data.tele.substr(0, 3) + "****" + data.tele.substr(7);
                    var email = "***" + data.email.substr(data.email.indexOf("@") - 4, 4) + "@" + data.email.substr(data.email.indexOf("@") + 1);
                    addrHtml += "<a class=\"radioBox\" href=\"javascript:;\" onclick=\"selectDlvRadio(this)\"" + selectedStr + " id='" + data.id + "'><input class=\"asbox\" type=\"radio\" onclick=\"selectDlvRadio(this.parentElement)\" " + selectedStr2 + "><span></span><p>" + address + " (<b>" + data.name + "</b>)" + defaultStr + "<br/>Contact information: <b>" + tele + "</b>(Phone); <b>" + email + "</b>(Email)";
                    addrHtml += "</p></a>";
                    count++;
                }
                addrHtml += "<a class=\"radioBox\"><input class=\"asbox\" type=\"radio\"><span style=\"background-image:url('Image/fatcow/add.png')\"></span><p>Click here to add a new delivery address and consignee information</p></a>";
                var msgbox = document.getElementsByClassName("MsgBox")[0];
                var confirmBtn = count > 0 ? "<a class=\"btn\" right>Confirm</a>" : "";
                showMsgbox(msgbox, "<h3 style=\"width:100%\">Select delivery address</h3><p style=\"width:100%\">Select your delivery address</p><div class=\"radioCon\" style=\"margin-top:5px\">" + addrHtml + "</div><div class=\"line\" style=\"margin-top: 5px;\"></div>" + confirmBtn + "<a class=\"btn\" right=\"\" onclick=\"hideMsgbox(this.parentElement.parentElement)\">Cancel</a>");
                var binput = msgbox.getElementsByTagName("input");
                for (var i = 0; i < binput.length; i++) {
                    binput[i].onclick = function () {
                        return false;
                    }
                }
                var btn = msgbox.getElementsByClassName("btn")[0];
                var laddrBtn = msgbox.getElementsByClassName("radioBox");
                laddrBtn = laddrBtn[laddrBtn.length - 1];
                laddrBtn.onclick = function () {
                    showUpdateReceiptMethod(null, function (rspt) {
                        updateDlv(rspt);
                    });
                }
                if (count == 0) return;
                btn.onclick = function () {
                    var con = msgbox.getElementsByClassName("radioCon")[0].children;
                    var conid = "";
                    for (var i = 0; i < con.length; i++) {
                        if (con[i].hasAttribute("selected")) {
                            conid = con[i].getAttribute("id");
                            break;
                        }
                    }
                    if (conid == "") return
                    var receipt_info = "";
                    for (var i = 0; i < addr.length; i++) {
                        if (addr[i] == "") continue;
                        if (decodeInfo(addr[i]).id == conid) {
                            receipt_info = addr[i];
                            break;
                        }
                    }
                    updateDlv(receipt_info);
                }
            }
        }
    }
    var selectRedeem = function (obj) {
        if (obj.hasAttribute("selected")) {
            obj.removeAttribute("selected");
        } else {
            obj.setAttribute("selected", "");
        }
        loadSelectedData();
    }
    newXMLHttpRequest("POST", ".phtml/apply.php", "key=getRedeem&bookid=" + bookid, function (rspt) {
        var data = JSON.parse(rspt);
        var aplHTML = "";
        for (var i = 0; i < data.length; i++) {
            var aplinfo = data[i];
            var imgData = decodeInfo(aplinfo.images);
            var publish = decodeText(aplinfo.publish);
            var lang = decodeText(aplinfo.lang);
            var price = aplinfo.price;
            var quality = generateQuaText(decodeInfo(aplinfo.quality)["quality_value"]);
            var aplid = aplinfo.aplid;
            aplHTML += "<div class=\"bokinfo\" dataid='" + aplid + "' data-price='" + price + "'><a img_select><div></div><div></div></a><a style=\"cursor:pointer\"><img src=\"Image/apply/" + imgData.Path + "/" + imgData.Images[0] + "\" alt=\"Book Image\"></a><a style=\"cursor:pointer\"><p bok-title><font>" + lang + "</font> " + publish + "</p></a><div class=\"price\">" + quality + " <font>" + price + "</font></div></div>";
        }
        //show msg
        showMsgbox(msgbox, "<h3 style=\"margin-bottom:5px;width:100%\">Select the version you want to redeem</h3><p>Select the version you want to redeem from the following books</p><div class=\"line\" style=\"margin-top: 5px;\"></div><div class=\"rinnerCon\" upload id=\"pageUploaders\"><div class=\"row\" scroll-row>" + aplHTML + "</div></div><div class=\"line\" style=\"margin-top: 5px;\"></div><p id='redeemPQ'>0.00 DeCoins points (0 pieces), <font style='color:#0366d6'>Balance:" + parseFloat(usr.coins).toFixed(2) + "</font></p><a class=\"btn\" right disabled>Confirm</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Cancel</a>");
        var obj = msgbox.getElementsByClassName("row")[0];
        var c = obj.children;
        for (var i = 0; i < c.length; i++) {
            c[i].onclick = function () {
                selectRedeem(this);
            }
        }
    }, function () {
        badNet();
    });
}

function reportAbuse(email, aplid) {
    var code1 = "";
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    var problemStr = "";
    var sm = function (email, data) {
        var input = document.getElementsByTagName("input")[0];
        var btn = document.getElementById("confirm_btn");
        btn.innerHTML = "<span class='wait'></span>";
        if ($.md5(input.value.toLocaleUpperCase()) == code1) {
            btn.onclick = null;
            var bookStr = data.bookName;
            var sub = "DeBook Product Complaint";
            var rec = email;
            var HTML = "<style>h3,h2,p,a{margin:0px;}h2{font-weight:normal;}</style><h3>DeBook Product Complaint</h3><h2>We have received a product complaint from a buyer. The product <b>" + bookStr + "</b> you registered on DeBook has been complained about. Your product has the following problem: <b>" + problemStr + "</b>. Please correct this problem as soon as possible to continue selling. Please continue on the DeBook webpage.</h2><p>If your product details have been changed or there is no problem, please ignore this email.</p><p>Thank you for your contact</p><p>- Nawaski.com</p>";
            var direct = "MAIL=" + rec + "&SUBJECT=" + sub + "&HTML=" + HTML + "&ALT=" + getHTMLText(HTML);
            newXMLHttpRequest('POST', '.phtml/sendMail.phtml', direct, function (rspt) {
                if (rspt == "") {
                    showMsgbox(msgbox, "<h3 style=\"width:100%\">Successfully complained to the merchant</h3><p style=\"width:100%\">Your complaint has been accepted, and we will contact the merchant and handle it.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" onclick=\"hideMsgbox(this.parentElement.parentElement);\" right>OK</a>");
                } else {
                    badNet();
                    btn.onclick = function () {
                        sm(email, data);
                    }
                    input.removeAttribute("disabled");
                }
            }, function () {
                badNet();
                btn.onclick = function () {
                    sm(email, data);
                }
                input.removeAttribute("disabled");
            });
        } else {
            input.removeAttribute("disabled");
            shakeBox(input, "leftRight", 4, 100, 20);
            input.setAttribute('tips', '<font size="4" err>Incorrect verification code</font>');
            mx = input.getClientRects()[0].left;
            my = input.getClientRects()[0].top + 20;
            showTooltip(input);
            btn.innerText = "Try again";
            return;
        }
    }
    newXMLHttpRequest("POST", ".phtml/apply.php", "key=getApply&id=" + aplid, function (rspt) {
        var data = JSON.parse(rspt);
        var optionHtml = "<option>The real picture of the product does not match the details</option>";
        if (data.aplSta == 0) {
            optionHtml += "<option>The merchant did not provide the (correct) DeBook unique verification code</option>";
        }
        showMsgbox(msgbox, "<h3 style=\"margin-bottom:5px;width:100%\">Select the complaint reason</h3><p>Please select a reason for complaining about the merchant from the following</p><div class=\"line\" style=\"margin-top: 5px;\"></div><div class=\"asbox_con\" style=\"width:calc(100% - 2px);\"><p>&nbsp;Commodity complaint reason</p><select class=\"asbox\" style=\"max-width:none\" onfocus=\"boxstyle(this.parentElement,1);\" onblur=\"boxstyle(this.parentElement,0)\">" + optionHtml + "</select><span class='sel' onclick=\"this.parentElement.children[1].focus();\">⇲</span></div><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>Confirm</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Cancel</a>");
        var select = msgbox.getElementsByTagName("select")[0];
        select.onchange = function () {
            problemStr = select.children[select.selectedIndex].innerText;
        }
        var btn = msgbox.getElementsByClassName("btn")[0];
        btn.onclick = function () {
            showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">Verification code</h3><p>Enter the verification code to confirm that you are not a robot. (Not case sensitive)</p><div class="line" style="margin-top: 5px;"></div><div style="width: 100%;"><div class="asbox_con" style="width:28%;margin-right:1%"><canvas style="width:73%;height:28px;position:relative;float:left;"></canvas><a tips="Refresh code" onmouseover="showTooltip(this)" onmouseleave="hideTooltip()" class="btn" id="refresh_btn" style="width:20px;height:20px;padding:3px;border-radius:0px;background-size:24px;background-position:2px;background-repeat:no-repeat;background-image:url(\'Image/fatcow/arrow_refresh.png\')"></a></div><div class="asbox_con" style="width:69%;margin-left:1%"><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%" autocomplete="off"></div></div><div class="line" style="margin-top: 5px;"></div><a class="btn" id="confirm_btn" right>Confirm</a><a class="btn" right onclick="cancelVrfyCode(this,document.getElementById(\'submit1\'));chgLockForm(1,0);">Cancel</a>');
            code1 = newCode();
            var btn = document.getElementById("refresh_btn");
            btn.onclick = function () {
                clearCode();
                code1 = newCode();
            }
            var confirmBtn = document.getElementById("confirm_btn");
            confirmBtn.onclick = function () {
                var input = document.getElementsByTagName("input")[0];
                input.setAttribute("disabled", "");
                sm(email, data);
            }
            msgbox.getElementsByClassName("asbox")[0].onkeydown = function (e) {
                var e1 = e || window.event; if (e1.keyCode == 10 || e1.keyCode == 13) {
                    this.setAttribute("disabled", "");
                    sm(email, data);
                } else if (e1.keyCode == 27) {
                    hideMsgbox(msgbox);
                }
            }
        }
    }, function () {
        badNet();
    });
}