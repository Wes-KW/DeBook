var usr = {
    'usrid': "",
    'email': "",
    'email_news': "",
    'time': "",
    'coins': "",
    'deliver_info': "",
    'receipt_info': "",
    'cart': "",
    'pwd': "",
    keys: ['usrid', 'email', 'time', 'coins', 'deliver_info', 'receipt_info', 'cart', 'pwd']
}

/* 
structure of deliver_info 
name: 
phone_number: 
sent_location: 
allow_school_supply: 
allow_7_day_no_reason_return: 
allow_decoins_discount: 
school_location: 

structure of each receipt_info 
ID: 
address: 
is_default: 
name: 
telephone: email: 
*/

function decodeInfo(text) {
    return JSON.parse(decodeURI(atob(text)));
}

function encodeInfo(obj) {
    return btoa(encodeURI(strJson(obj)));
}

function decodeText(text) {
    return decodeURI(atob(text));
}

function encodeText(text) {
    return btoa(encodeURI(text));
}

var usrlogtime = "-1";

function randomStr(patternA, len) {
    var rw = "";
    var nPattern = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var WPattern = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var wPattern = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var tmpPattern = [];
    if (patternA == "nwW") {
        for (var i = 0; i < 10; i++) { tmpPattern[i] = nPattern[i]; }
        for (var i = 0; i < 26; i++) { tmpPattern[10 + i] = wPattern[i]; }
        for (var i = 0; i < 26; i++) { tmpPattern[36 + i] = WPattern[i]; }
    } else if (patternA == "nw") {
        for (var i = 0; i < 10; i++) { tmpPattern[i] = nPattern[i]; }
        for (var i = 0; i < 26; i++) { tmpPattern[10 + i] = wPattern[i]; }
    } else if (patternA == "nW") {
        for (var i = 0; i < 10; i++) { tmpPattern[i] = nPattern[i]; }
        for (var i = 0; i < 26; i++) { tmpPattern[10 + i] = WPattern[i]; }
    } else if (patternA == "wW") {
        for (var i = 0; i < 26; i++) { tmpPattern[i] = wPattern[i]; }
        for (var i = 0; i < 26; i++) { tmpPattern[26 + i] = WPattern[i]; }
    } else if (patternA == "w") {
        tmpPattern = wPattern;
    } else if (patternA == "W") {
        tmpPattern = WPattern;
    } else if (patternA == "n") {
        tmpPattern = nPattern;
    } else {
        tmpPattern = [0];
    }

    for (var i = 0; i < len; i++) {
        var num = Math.round(Math.random() * (tmpPattern.length - 1));
        rw += tmpPattern[num];
    }
    return rw;
}

function newXMLHttpRequest(method, url, send, fnOK, fnErr, fnProgress, fnLoad) {
    var xmlHttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    method = (!null) ? "POST" : "GET";
    xmlHttp.open(method, url, true);
    if (method == "POST") { xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); }
    xmlHttp.send(send);
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (fnOK == null) return;
            fnOK(xmlHttp.responseText);
        } else if (this.readyState == 4) {
            if (fnErr == null) return;
            fnErr({'readyState': this.readyState, 'status': this.status});
        }
    }
    if (window.addEventListener != null) {
        xmlHttp.addEventListener("progress", fnProgress != null ? function (e) { fnProgress(e) } : function () { }); xmlHttp.addEventListener("load", fnLoad != null ? function (e) { fnLoad(e) } : function () { });
    } else {
        xmlHttp.attachEvent("progress", fnProgress != null ? function (e) { fnProgress(e) } : function () { });
        xmlHttp.attachEvent("load", fnLoad != null ? function (e) { fnLoad(e) } : function () { });
    }
}

function objToSql(obj) {
    //setSql 
    var sql = "";
    for (var i in obj) {
        sql += i + "=" + '"' + obj[i] + '"';
        sql += ", ";
    }
    sql = sql.substr(0, sql.length - 2);
    return sql;
}

function objToSqlGet(obj) {
    //getSql 
    var sql = "";
    for (var i in obj) {
        sql += i + ", ";
    }
    sql = sql.substr(0, sql.length - 2);
    return sql;
}

function strJson(obj) {
    var str = "{";
    var ls = "";
    for (var key in obj) {
        ls = key;
    }
    for (var key in obj) {
        var inputStr = obj[key];
        if (typeof obj[key] == "object") {
            inputStr = strJson(obj[key]);
        }
        if ((typeof obj[key]).toLocaleLowerCase() == "string") {
            inputStr = "\"" + obj[key] + "\"";
        }

        str += "\"" + key + "\"" + ":" + inputStr;
        if (key != ls) {
            str += ",";
        }
    }
    str += "}";
    return str;
}

//login signin and signout
//inputs
function checkPwd(value) {
    var level = 0;
    if (value.length >= 10) { level += 0.6; }
    else if (value.length >= 8) { level += 0.6; }
    else { level = 0; }
    var i = 0, charNum = 0, cptlNum = 0, intNum = 0, symNum = 0;
    varlen = value.length;
    for (i; i < len; i++) { var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"); if (pattern.test(value[i])) { symNum += 1; } }
    if (charNum > 5) { level += 0.2; }
    else if (charNum > 2) { level += 0.15; }
    if (cptlNum > 3) { level += 0.2; }
    else if (cptlNum > 2) { level += 0.15; }
    if (intNum > 5) { level += 0.2; }
    else if (intNum > 2) { level += 0.15; }
    if (symNum > 2) { level += 0.2; }
    else if (symNum > 0) { level += 0.15; }
    return level;
}

function signout() {
    window.setTimeout(function () {
        if (window.location.href.indexOf("/db.cn/usr.out.i.html") < 0) {
            var fm = document.createElement('form');
            fm.method = "post";
            fm.action = "/db.cn/usr.out.i.html";
            var input = document.createElement('input');
            input.setAttribute("name", 'action');
            input.setAttribute("value", 'logout');
            fm.appendChild(input);
            document.body.appendChild(fm);
            fm.style.display = "none";
            input.style.display = "none";
            fm.submit();
        }
    }, 100);
}

//make split input
function makeSplitInput(obj) {
    if (obj.className == "split_input") {
        obj.onclick = function () { focusSplitInput(obj); };
        focusSplitInput(obj);
        for (var i = 0; i < obj.children.length; i++) {
            obj.children[i].children[0].onmousedown = function (e) { disabledMouseFocus(e, this); }
            obj.children[i].children[0].onkeyup = function (e) { splitInputSlider(e, this); }
            obj.children[i].children[0].onkeydown = function (e) { splitInputDisabled(e, this); }
        }
    }
}

function splitInputDisabled(event, obj) {
    var e = event || window.event;
    if (e.keyCode < 48 || e.keyCode > 57) e.preventDefault();
    if (obj.value.length > 0) {
        var split_input = obj.parentElement.parentElement;
        var max_index = split_input.children.length;
        var n_index = in_array(split_input.children, obj.parentElement);
        if (n_index < max_index && e.keyCode != 8) {
            if (obj.value.length == 1 && (e.keyCode >= 48 && e.keyCode <= 57)) {
                split_input.children[n_index + 1].children[0].focus();
                split_input.children[n_index + 1].children[0].value = String.fromCharCode(e.keyCode);
            }
        } else if (e.keyCode == 8) {
            obj.value = "";
            if (n_index != 0) {
                split_input.children[n_index - 1].children[0].focus();
            }
        }
    }
}

function splitInputSlider(event, obj) {
    var e = event || window.event;
    var asbox_con = obj.parentElement;
    var split_input = asbox_con.parentElement;
    var max_index = split_input.children.length;
    var n_index = in_array(split_input.children, asbox_con);
    if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 8) {
        if (obj.value.length > 0) {
            if (n_index != max_index - 1 && e.keyCode != 8) {
                split_input.children[n_index + 1].children[0].focus();
            }
        } else {
            if (n_index != 0) {
                split_input.children[n_index - 1].children[0].focus();
            }
        }
    } else {
        e.preventDefault();
        obj.value = "";
    }
}

function disabledMouseFocus(event, obj) {
    var e = event || window.event;
    e.preventDefault();
}

function focusSplitInput(obj) {
    var split_input = obj;
    var asbox_con = obj.children;
    var index = 0;
    for (var i = 0; i < asbox_con.length; i++) {
        if (asbox_con[i].children[0].value != "") {
            index = i;
        } else {
            break;
        }
    }
    asbox_con[index].children[0].focus();
}

function getSplitInputValue(obj) {
    vars = "";
    for (var i = 0; i < obj.children.length; i++) {
        s += obj.children[i].children[0].value;
    }
    return s;
}

function checkTimeout() {
    if (navigator.onLine && document.readyState == "complete" && !document.hidden) {
        newXMLHttpRequest('POST', '.phtml/vrfylogin.php', 'direct=jsonUsr', function (rspt) {
            var k = JSON.parse(rspt);
            if (typeof k["usrid"] == "undefined" || k["usrid"] == "") {
                logout();
            } else {
                //check if information were changed 
                //needs to add an identification on the ip address of the user 
                newXMLHttpRequest('POST', '.phtml/vrfylogin.php', 'direct=usrCheck', function (rspt2) {
                    var k2 = JSON.parse(rspt2);
                    var mm = typeof k2["pwd_changed"] != "undefined";
                    if (mm) {
                        if (k2["pwd_changed"] != "1") {
                            mm = false;
                        }
                    }
                    if (k2["pwd"] == usr["pwd"] || mm) {
                        for (var key in k2) {
                            if (k2[key] != usr[key]) {
                                usr[key] = k2[key];
                                //updateSession 
                                newXMLHttpRequest('POST', '.phtml/vrfylogin.php', 'direct=update&key=' + key + '&value=' + usr[key], function () { }, function () { });
                            }
                        }
                        tita(function () { checkTimeout(); }, 2000);
                    } else {
                        newXMLHttpRequest('POST', '.phtml/vrfylogin.php', 'direct=clear', function () { }, function () { });
                        logout();
                    }
                }, function () { });
            }
        }, function () {
            tita(function () { checkTimeout(); }, 2000);
        });
    } else {
        tita(function () { checkTimeout(); }, 2000);
    }
}

function logout() {
    if (location.search.indexOf("?account") == 0 && usr.usrid != "") {
        var sc = document.getElementById("sectionCon");
        var section = sc.children[0];
        section.children[0].innerHTML = '<div class="rcon" style="display: block;padding:25px 0px">\
<div class="pcon">\
<h2 style="width:210px;">Session expired</h2>\
<h3 style="width:240px;margin-bottom: 10px;">Your login session has expired</h3>\
<p>Your login session has expired, usually because you logged out of this site in another tab or window, or you reopened the page without login information. <br>You will not be able to view or modify any settings or data. <a href="?account">Log in again</a>. </p>\
</div>\
</div>';
    }
    for (key in usr) {
        usr[key] = "";
    }
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">Session expired</h3><p>Login session expired</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right xhr href="?account">Re-login</a><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">OK</a>');
    initAllLink();
}

function initUsrPage() {
    tita(function () { checkTimeout(); }, 1000);
    initTable(document.getElementById("receipt_info_table"));
    initTable(document.getElementById("apply_table"));
    initTable(document.getElementById("contribution_table"));
    initTable(document.getElementById("transaction_table"));
    if (!window.btoa) {
        window.btoa = function (text) {
            return jQuery.base64.encode(text);
        }
        window.atob = function (text) {
            return jQuery.base64.decode(text);
        }
    }
    var lc = ["buy_order", "sell_order", "dlv_settings", "account_info", "payment_info", "apl_info", "more_info"];
    var h = window.location.hash;
    if (h.indexOf("#") >= 0) {
        h = h.substring(1, h.length);
    }
    var i = in_array(lc, h);
    if (i >= 0) {
        usrpage(i, true);
    }
}

function usrpage(d, bool) {
    var c = document.getElementsByClassName("pright")[0].children;
    var lc = ["buy_order", "sell_order", "dlv_settings", "account_info", "payment_info", "apl_info", "more_info"];
    for (var i = 0; i < c.length; i++) {
        if (i == d) {
            c[d].style.display = "block";
            if (bool == null || !bool) {
                putHis("", "", "?account#" + lc[i]);
                resize();
            }
        } else {
            c[i].style.display = "none";
        }
    }
}
/*Delivery Method */
function showUpdateSentInfo() {
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">Add or change the consignor information</h3><p>Fill in the consignor information</p><div class="line" style="margin-top: 5px;"></div>\
<div class="asbox_con" style="width:98.4%;"><p>&nbsp;Name</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="Name" autocomplete="off"></div>\
<div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;Mobile phone number</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="Mobile phone number" autocomplete="off" pattern="[0-9]*"></div>\
<div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;Shipping address</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="Shipping address" autocomplete="off"></div>\
<div class="asbox_con" style="width:98.4%;margin-top:5px;"><input type="checkbox" id="check0" class="asbox" type="checkbox" onblur="boxstyle(this.parentElement,0)" onfocus="boxstyle(this.parentElement,1)" autocomplete="off" style="height:100%"><span style="left:0;top:3px;position:absolute;"></span><button a type="button" style="padding:0px;margin-left:18px;" onclick="this.parentElement.children[0].checked=!this.parentElement.children[0].checked">Do you provide school delivery service?</button></div>\
<div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;School delivery address&nbsp;<font style="text-decoration:underline dashed 1px;color:#333;font-weight:bold">Multiple addresses are separated by ";"</font></p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="School shipping address" autocomplete="off"></div>\
<div class= "asbox_con" style = "width:98.4%;margin-top:5px;" > <input type="checkbox" id="check1" class="asbox" type="checkbox" onblur="boxstyle(this.parentElement,0)" onfocus="boxstyle(this.parentElement,1)" autocomplete="off" style="height:100%"><span style="left:0;top:3px;position:absolute;"></span><button a type="button" style="padding:0px;margin-left:18px;" onclick="this.parentElement.children[0].checked=!this.parentElement.children[0].checked">Whether to support 7-day no-reason returns</button></div>\
<div class="line" style="margin-top: 5px;"></div><a class="btn" right>Confirm</a><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">Cancel</a>'); 
var btn = msgbox.children[0].children[msgbox.children[0].children.length - 2];
    var inputs = msgbox.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].onclick = function () { this.select(); }
    }
    var data = usr.deliver_info;
    if (data != "") {
        data = decodeInfo(data);
        inputs[0].value = data.name;
        inputs[1].value = data.phone_number;
        inputs[2].value = data.address;
        inputs[3].checked = data.sch_allow == 1;
        inputs[4].value = data.sch;
        inputs[5].checked = data.sdays == 1;
    }
    btn.onclick = function () {
        btn.innerHTML = "<span class='wait' style='width:11px;background-color:whitesmoke;'></span>";
        //encode deliver_info 
        var obj = new Object();
        obj.name = inputs[0].value;
        obj.phone_number = inputs[1].value;
        obj.address = inputs[2].value;
        obj.sch_allow = inputs[3].checked ? 1 : 0;
        obj.sch = inputs[4].value;
        obj.sdays = inputs[5].checked ? 1 : 0;
        var dlvinfo = encodeInfo(obj);
        //updateSession&Cookie 
        newXMLHttpRequest('POST', '.phtml/vrfylogin.php', 'direct=update&key=deliver_info&value=' + dlvinfo, function () {
            //updateData 
            //unsafe:revise not to use direct sql check 
            newXMLHttpRequest('POST', '.phtml/more/echoSql.phtml', 'sql=UPDATE usrinfo SET deliver_info="' + dlvinfo + '" where usrid="' + usr.usrid + '"', function () {
                msgbox.children[0].innerHTML = "";
                hideMsgbox(msgbox);
                //updateLocal 
                document.getElementById("dlv_name").children[0].innerHTML = obj.name;
                document.getElementById("dlv_pn").children[0].innerHTML = obj.phone_number;
                document.getElementById("dlv_adrs").children[0].innerHTML = obj.address;
                document.getElementById("dlv_sch_allow").children[0].innerHTML = obj.sch_allow ? "Provide" : "Do not provide";
                document.getElementById("dlv_sch").children[0].innerHTML = obj.sch;
                document.getElementById("dlv_sdays").children[0].innerHTML = obj.sdays ? "Supported" : "Not supported";
            }, function (obj) {
                errMsg(stObj, btn);
            });
        }, function (obj) {
            errMsg(stObj, btn);
        });
    }
}

/Receipt Method */
function showUpdateReceiptMethod(changeId, extraFn) {
    if (typeof changeId == "undefined") changeId = "";
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    var innerHTML = '<h3 style="margin-bottom:5px;width:100%">Add or change consignee information</h3><p>Fill in consignee information</p><div class="line" style="margin-top: 5px;"></div>\
                    <div class="asbox_con" style="width:98.4%;"><p>&nbsp;Delivery address</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="Delivery address" autocomplete="none"></div>\
                    <div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;Consignee</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="Consignee" autocomplete="none"></div>\
                    <div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;Phone</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="Phone" autocomplete="none" pattern="[0-9]*"></div>\
                    <div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;Email</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="Email" autocomplete="none"></div>\
                    <div class="asbox_con" style="width:98.4%;margin-top:5px;"><input type="checkbox" id="check0" class="asbox" type="checkbox" onblur="boxstyle(this.parentElement,0)" onfocus="boxstyle(this.parentElement,1)" autocomplete="none" style="height:100%"><span style="top:2px;position:absolute;"></span><button a type="button" style="padding:1px 0;margin-left:18px;" onclick="this.parentElement.children[0].checked=!this.parentElement.children[0].checked">Set as default address</button></div>\
                    <div class="line" style = "margin-top: 5px;" ></div >\
                    <a class="btn" right>Confirm</a><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">Cancel</a>'; 
    showMsgbox(msgbox, innerHTML);
    var btn = msgbox.children[0].children[msgbox.children[0].children.llength - 2];
    var inputs = msgbox.getElementsByTagName('input');
    if (changeId != "") {
        var sadd = "";
        var cname = "";
        var dtel = "";
        var demail = "";
        var rcdata = usr.receipt_info.split(":");
        for (var i = 0; i < rcdata.length; i++) {
            var fdata = rcdata[i];
            if (fdata == "") continue;
            fdata = decodeInfo(rcdata[i]);
            if (fdata["id"] == changeId) {
                sadd = fdata["address"];
                cname = fdata["name"];
                dtel = fdata["tele"];
                demail = fdata["email"];
                inputs[0].value = sadd; inputs[1].value = cname;
                inputs[2].value = dtel;
                inputs[3].value = demail;
                break;
            }
        }
    }
    if (hasDefault()) {
        if (!changeId) { } else {
            if (changeId.indexOf("|A") >= 0) {
                inputs[4].checked = true;
            }
        }
        if (!inputs[4].checked) {
            inputs[4].parentElement.outerHTML = "";
        }
    }
    btn.onclick = function () {
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value == "") {
                var text = inputs[i].parentElement.children[0].innerText;
                shbox(inputs[i], text.substring(1, text.length) + "cannot be empty", 1500);
                return;
            }
        }
        var obj = new Object();
        obj.id = changeId == "" ? getNextId().toString() : changeId;
        if (inputs[4] != null && typeof inputs[4] != "undefined") {
            if (inputs[4].checked && changeId.indexOf("|A") < 0) {
                obj.id = changeId + "|A";
            } else if (!inputs[4].checked && changeId.indexOf("|A") >= 0) {
                obj.id = changeId.substr(0, 1);
            }
        }
        obj.address = inputs[0].value;
        obj.name = inputs[1].value;
        obj.tele = inputs[2].value;
        obj.email = inputs[3].value;
        var text = "";
        if (!changeId) {
            text = usr.receipt_info + encodeInfo(obj) + ":";
        } else {
            var newT = "";
            var oldT = usr.receipt_info;
            var arr = oldT.split(":");
            for (var i = 0; i < arr.length && arr[i] != ""; i++) {
                var info = decodeInfo(arr[i]);
                if (info["id"] != changeId) {
                    newT += arr[i] + ":";
                } else {
                    newT += encodeInfo(obj) + ":";
                }
            }
            text = newT;
        }
        btn.innerHTML = "<span class='wait' style='margin-right:0px;'></span>";
        //database 
        newXMLHttpRequest("POST", '.phtml/more/echoSql.phtml', 'sql=UPDATE usrinfo SET receipt_info="' + text + '" WHERE usrid="' + usr.usrid + '"', function () {
            //local_session 
            newXMLHttpRequest("POST", '.phtml/vrfylogin.php', 'direct=update&key=receipt_info&value=' + text, function () {
                //local 
                if (extraFn != null && typeof extraFn == "function") extraFn(encodeInfo(obj));
                if (location.search.indexOf("?account") < 0) return;
                var table = document.getElementById("receipt_info_table");
                var rows = table.children[1].children;
                if (changeId == "") {
                    if (table.children[1].children[0].hasAttribute("empty")) {
                        table.children[1].children[0].outerHTML = "";
                    }
                    vard = "";
                    d += '<tr id=' + obj.id + '><td><input type="checkbox" class="asbox" type="checkbox" onclick="edSelect(this)"><span></span></td><td onclick=\'edSelect(this.parentElement.children[0].children[0],1)\'><a>' + obj.address + '</a>';
                    if (obj.id.indexOf("A") >= 0) d += '<font class="default">(Default)</font>';
                    d += '</td><td onclick=\'edSelect(this.parentElement.children[0].children[0],1)\'>' + obj.name + '</td><td onclick=\'edSelect(this.parentElement.children[0].children[0],1)\'>Phone: ' + obj.tele + '<br>Email: ' + obj.email + '</td><td><a onclick="removeReceiptMethod(\'' + obj.id + '\');">Remove</a> | <a onclick="showUpdateReceiptMethod(\'' + obj.id + '\');">Change</a></td></tr>';
                    table.children[1].innerHTML += d;
                } else {
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].hasAttribute("id")) {
                            if (rows[i].getAttribute("id") == changeId) {
                                if (inputs[4] != null && typeof inputs[4] != "undefined") {
                                    if (inputs[4].checked && changeId.indexOf("|A") < 0) {
                                        changeId = changeId + "|A";
                                    } else if (!inputs[4].checked && changeId.indexOf("|A") >= 0) {
                                        changeId = changeId.substring(0, 1);
                                    }
                                }
                                rows[i].setAttribute("id", changeId);
                                rows[i].children[1].innerHTML = "<a>" + obj.address + "</a>";
                                if (obj.id.indexOf("A") >= 0) rows[i].children[1].innerHTML += "<font class='default'>(Default)</font>";
                                rows[i].children[2].innerHTML = obj.name;
                                rows[i].children[3].innerHTML = "Telephone: " + obj.tele + "<br>Email: " + obj.email;
                                rows[i].children[4].innerHTML = '<a onclick="removeReceiptMethod(\'' + changeId + '\');">Remove</a> | <a onclick="showUpdateReceiptMethod(\'' + changeId + '\');">Change</a>';
                            }
                        }
                    }
                }
                hideMsgbox(msgbox);
            }, function (err) {
                errMsg(err, btn);
            })
        }, function (err) {
            errMsg(err, btn);
        });
    }
}

function removeReceiptMethod(id) {
    var table = document.getElementById("receipt_info_table");
    var ids = id.split(":");
    var text = usr.receipt_info;
    var new_text = "";
    var grps = text.split(":");
    for (var i = 0; i < grps.length; i++) {
        if (grps[i] != "") {
            var index = in_array(ids, decodeInfo(grps[i])["id"]);
            if (index < 0) {
                new_text += grps[i];
                if (i != grps.length - 1) {
                    new_text += ":";
                }
            }
        }
    }
    //database 
    newXMLHttpRequest("POST", '.phtml/more/echoSql.phtml', 'sql=UPDATE usrinfo SET receipt_info="' + new_text + '" WHERE usrid="' + usr.usrid + '"', function (rspt) {
        //local_session 
        newXMLHttpRequest("POST", '.phtml/vrfylogin.php', 'direct=update&key=receipt_info&value=' + new_text, function (rspt2) {
            //local 
            var rows = table.children[1].children;
            for (var i = rows.length - 1; i >= 0; i--) {
                if (rows[i].hasAttribute("id")) {
                    var id = rows[i].getAttribute("id");
                    var index = in_array(ids, id);
                    if (index >= 0) {
                        rows[i].outerHTML = "";
                    }
                }
            }
            if (rows.length == 0) {
                rows[0].parentElement.innerHTML = "<tr empty=\"\"><td colspan=\"5\" style=\"text-align: center;background-color: #f2f4f6;\">(no shipping address)</td></tr>";
            }
        }, function (err) {
            errMsg(err, btn);
        })
    }, function (err) {
        errMsg(err, btn);
    });
}

function removeSelectedReceiptMethod() {
    var data = document.getElementById("receipt_info_table").getAttribute("data");
    if (data != null && confirm("Are you sure you want to delete all selected delivery addresses? (This operation is irreversible)")) {
        removeReceiptMethod(document.getElementById("receipt_info_table").getAttribute("data"));
    }
}

function showUpdateEmail() {
    var vrfyCode = null;
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">Change email</h3><p>Change existing email</p><div class="line" style="margin-top: 5px;"></div><div class="asbox_con" style="width:98.4%;"><p>&nbsp;New Email</p><input class="asbox" onblur="boxstyle(this.parentElement,0)" onfocus="boxstyle(this.parentElement,1)" autocomplete="off" placeholder="New Email" id=\'eml0\'><p>&nbsp;<a style="cursor: pointer;">Get Verification Code</a></p></div><div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;Verification Code</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="Verification Code" autocomplete="off"></div><div class="line" style="margin-top: 5px;"></div><a class="btn" right >Confirm</a></a></div class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">Cancel</a>');
    var input = msgbox.getElementsByClassName('asbox');
    var btn = msgbox.children[0].children[msgbox.children[0].children.length - 2];
    var getCodeBtn = msgbox.getElementsByClassName('asbox_con')[0].children[2].children[0];
    var pds = "<span class='wait'></span>";
    //safer 
    var fn = function () {
        var msgbox = document.getElementsByClassName('MsgBox')[0];
        var input = msgbox.getElementsByClassName('asbox');
        var getCodeBtn = msgbox.getElementsByClassName('asbox_con')[0].children[2].children[0];
        if (input[0].value != "") {
            newXMLHttpRequest('POST', '.phtml/usr.php', 'key=hasEmail&email=' + input[0].value, function (rspt) {
                if (rspt == "0") {
                    code = randomStr('n', 6);
                    var rec = input[0].value;
                    var sub = "DeBook ID Verification Code";
                    var HTML = "<style>h3,h2,p,a{margin:0px;}h2{font-weight:normal;}</style><h3>DeBook Account</h3><h2>We have received your request to change your email address. Your verification code is <b>" + code + "</b>. Please continue the operation on the DeBook webpage.</h2><p>Please do not forward the verification code to any stranger to prevent account theft.</p><p>If you have never applied for a change of email address, please be sure to ignore this email.</p><p>Thank you for your contact</p><p>- Nawaski.com</p>";
                    var direct = "MAIL=" + rec + "&SUBJECT=" + sub + "&HTML=" + HTML + "&ALT=" + getHTMLText(HTML);
                    getCodeBtn.innerHTML = pds;
                    newXMLHttpRequest('POST', '.phtml/sendMail.phtml', "emailKey=go&" + direct, function (rspt) {
                        var getCodeBtn = msgbox.getElementsByClassName('asbox_con')[0].children[2].children[0];
                        if (rspt == "") {
                            getCodeBtn.innerHTML = "Try again"
                            var d = getCodeBtn.outerHTML;
                            var p = getCodeBtn.parentElement;
                            vrfyCode = $.md5(code);
                            window.setTimeout(function () {
                                vrfyCode = "";
                            }, 180000);//30min timeout
                            getCodeBtn = msgbox.getElementsByClassName('asbox_con')[0].children[2].children[0];
                            getCodeBtn.onclick = function () { fn(); };
                            p.innerHTML = "Didn't receive the email?" + d;
                        } else {
                            shbox(input[0], "Email error", 1500);
                            getCodeBtn.innerHTML = "Try again"
                            var d = getCodeBtn.outerHTML;
                            var p = getCodeBtn.parentElement;
                            getCodeBtn = msgbox.getElementsByClassName('asbox_con')[0].children[2].children[0];
                            getCodeBtn.onclick = function () { fn(); };
                            p.innerHTML = "&nbsp;Failed to send email." + d;
                        }
                    }, function () {
                        getCodeBtn.innerHTML = "Try again"
                        var d = getCodeBtn.outerHTML;
                        var p = getCodeBtn.parentElement;
                        getCodeBtn = msgbox.getElementsByClassName('asbox_con')[0].children[2].children[0];
                        getCodeBtn.onclick = fn;
                        p.innerHTML = "&nbsp;Failed to send email (network error)." + d;
                    });
                } else {
                    shbox(input[0], "This email has been registered, replace the email to continue", 2500);
                }
            }, function (stObj) {
                var advice = "";
                if (stObj.status == 0) {
                    advice = "Please make sure you are online";
                } else if (stObj.status == 403) {
                    advice = "Please make sure you have permission to access this page";
                } else if (stObj.status == 404 || stObj.status == 500) {
                    advice = "Please make sure there is no error in the accessed path";
                }
                showMsgbox(msgbox, '<h3 style="width:100%">Network error</h3><p>An error occurred while accessing the network. The page returns code: ' + stObj.status + ', ' + advice + '.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>');
            });
        } else {
            shbox(input[0], "Email error", 1500);
        }
    }
    getCodeBtn.onclick = fn;
    input[0].onkeydown = function (e1) {
        var e = e1 || window.event;
        if (e.keyCode == 10 || e.keyCode == 13) {
            fn();
        }
    }
    var fn2 = function () {
        btn.innerHTML = pds;
        if (input[1].value != "" && $.md5(input[1].value) == vrfyCode) {
            //database 
            newXMLHttpRequest('POST', '.phtml/more/echoSql.phtml', 'sql=UPDATE usrinfo SET email="' + input[0].value + '", email_news="' + input[0].value + '" WHERE usrid="' + usr.usrid + '"', function (rspt) {
                //local_session 
                newXMLHttpRequest('POST', '.phtml/vrfylogin.php', 'direct=update&key=email&value=' + input[0].value, function () {
                    //local_website 
                    document.getElementById("label_email").children[0].innerHTML = input[0].value;
                    var msgbox = document.getElementsByClassName('MsgBox')[0];
                    hideMsgbox(msgbox);
                }, function (err) {
                    errMsg(err, btn);
                });
            }, function (err) {
                errMsg(err, btn);
            });
        } else {
            shbox(input[1], "Verification code is incorrect", 1000);
            btn.innerHTML = "Try again";
        }
    }
    btn.onclick = fn2;
    input[1].onkeydown = function (e1) {
        var e = e1 || window.event;
        if (e.keyCode == 10 || e.keyCode == 13) {
            fn2();
        }
    }
}

function showUpdateNickname() {
    var nickname = document.getElementById('nickname');
    var btn = nickname.lastElementChild;
    var btncan = nickname.children[2];
    nickname.children[0].style.display = "none";
    nickname.children[1].style.display = "inline-block";
    nickname.children[1].children[0].selectedIndex = usr.payment;
    nickname.children[1].children[0].focus();
    var pds = "<span class='wait' style='margin-right:0px;'></span>";
    btncan.style.display = "block";
    btn.innerHTML = "OK";
    btn.onclick = function () {
        //database 
        newXMLHttpRequest('POST', '.phtml/more/echoSql.phtml', 'sql=UPDATE usrinfo SET nickname="' + nickname.children[1].children[0].value + '" WHERE usrid="' + usr.usrid + '"', function (rspt) {
            //local_session 
            newXMLHttpRequest('POST', '.phtml/vrfylogin.php', 'direct=update&key=nickname&value=' + nickname.children[1].children[0].value, function () {
                //local 
                nickname.children[0].innerHTML = nickname.children[1].children[0].value;
                nickname.children[0].style.display = "";
                nickname.children[1].style.display = "none";
                btn.innerHTML = "Change";
                btncan.style.display = "none";
                btn.onclick = function () { showUpdateNickname(); };
            }, function (err) {
                errMsg(err, btn);
            });
        }, function (err) {
            errMsg(err, btn);
        });
    };
    nickname.children[1].children[0].onkeydown = function (e) {
        var e = e || window.event;
        if (e.keyCode == 13 || e.keyCode == 10) {
            btn.onclick();
        }
    }
    btncan.onclick = function () {
        btncan.style.display = "none";
        btn.innerHTML = "Change";
        nickname.children[0].style.display = "";
        nickname.children[1].style.display = "none";
        btn.onclick = function () { showUpdateNickname(); };
    }
}

function showUpdatePassword0() {
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">Change password</h3><p>Change account password</p><div class="line" style="margin-top: 5px;"></div><div class="asbox_con" style="width:98.4%;"><p>&nbsp;Original password</p><input type="password" class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="Original password" autocomplete="off"></div><div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;New password</p><input type="password" class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="New password" autocomplete="off"></div><div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;Confirm new password</p><input type="password" class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="Confirm new password" autocomplete="off"></div><div class="line" style="margin-top: 5px;"></div><a class="btn" right >Confirm</a><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">Cancel</a>');
    var btn = msgbox.children[0].children[msgbox.children[0].children.length - 2];
    var input = msgbox.getElementsByTagName('input');
    btn.onclick = function () {
        btn.innerHTML = "<span class='wait' style='width:19px;background-color:whitesmoke;'></span>";
        //checkPwd
        if ($.md5(input[0].value) != usr.pwd.split(':')[0]) {
            shbox(input[0], "Original password incorrect", 1500);
            btn.innerHTML = "Try again";
        } else {
            if (checkPwd(input[1].value) != 0) {
                if ($.md5(input[1].value) == $.md5(input[2].value)) {
                    var pwd2 = usr.pwd.split(':')[1];
                    //CHANGE LOCAL JS DATA
                    usr.pwd = $.md5(input[1].value) + ":" + pwd2;
                    if (checkPwd(input[1].value) < 2) {
                        showMsgbox(msgbox, '<h3 style="width:100%">The password is not secure</h3><p style="width:100%">Your password is simple, we will continue to change it, but we strongly recommend that you change your password afterwards.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>Got it</a>');
                    }
                    //CHANGE DATABASE DATA
                    newXMLHttpRequest('POST', '.phtml/usr.php', 'key=forget&pwd=' + usr.pwd + '&ue=' + usr.usrid, function () {
                        //change session
                        newXMLHttpRequest('POST', '.phtml/vrfylogin.php', 'direct=update&key=pwd&value=' + usr.pwd, function () {
                            showMsgbox(msgbox, '<h3 style="width:100%">Password change successful</h3><p style="width:100%">Your password has been changed.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>Got it</a>');
                            window.setTimeout(function () {
                                hideMsgbox(msgbox);
                            }, 2000);
                        }, function (st) {
                            errMsg(st, btn);
                        })
                    }, function (st) {
                        errMsg(st, btn);
                    })
                } else {
                    shbox(input[2], "The two passwords do not match", 1500);
                    btn.innerHTML = "Try again";
                }
            } else {
                shbox(input[1], "The new password is very unsafe", 1500);
                btn.innerHTML = "Try again";
            }
        }
    }
}

function showUpdatePassword1(extraFn) {
    var pwdp = "";
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">Change payment password</h3><p>Enter account password</p><div class="line" style="margin-top: 5px;"></div><div class="asbox_con" style="width:98.4%;"><p>&nbsp;Original password</p><input type="password" class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="Original password" autocomplete="off"></div><div class="line" style="margin-top: 5px;"></div><a class="btn" right >Confirm</a><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">Cancel</a>');
    var input = msgbox.getElementsByClassName('asbox')[0];
    var btn = msgbox.children[0].children[msgbox.children[0].children.length - 2];
    btn.onclick = function () {
        if ($.md5(input.value) == usr.pwd.split(":")[0]) {
            btn.innerHTML = "<span class='wait' style='width:19px;background-color:whitesmoke;'></span>";
            showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">New payment password</h3><p>Enter payment password</p><div class="line" style="margin-top: 5px;"></div>\
                                <div class= "split_input">\
                                    <div class="asbox_con">\
                                        <input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1">\
                                    </div>\
                                    <div class="asbox_con">\
                                        <input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1">\
                                    </div>\
                                    <div class="asbox_con">\
                                        <input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1">\
                                    </div>\
                                    <div class="asbox_con">\
                                        <input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1">\
                                    </div>\
                                    <div class="asbox_con">\
                                        <input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1">\
                                    </div>\
                                    <div class="asbox_con">\
                                        <input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1">\
                                    </div>\
                                </div>\
                                <div class="line" style="margin-top: 5px;"></div>\
                                <a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">Cancel</a>');
            var d = msgbox.getElementsByClassName('split_input')[0];
            makeSplitInput(d);
            var l = d.lastElementChild.children[0];
            l.onkeyup = function () {
                if (l.value.length > 0) {
                    pwdp = $.md5(getSplitInputValue(d));
                    showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">Confirm payment password</h3><p>Enter payment password again</p><div class="line" style="margin-top: 5px;"></div>\
                            <div class="split_input">\
                            <div class="asbox_con">\
                            <input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1">\
                            </div>\
                            <div class="asbox_con">\
                                <input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1">\
                            </div>\
                            <div class="asbox_con">\
                                <input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1">\
                            </div>\
                            <div class="asbox_con">\
                                <input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1">\
                            </div>\
                            <div class="asbox_con">\
                                <input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1">\
                            </div>\
                            <div class="asbox_con">\
                                <input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%;" autocomplete="off" type="password" maxlength="1">\
                            </div>\
                        </div>\
                        <div class="line" style="margin-top: 5px;"></div><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">Cancel</a>'); 
                    d = msgbox.getElementsByClassName('split_input')[0];
                    l = d.lastElementChild.children[0];
                    makeSplitInput(d);
                    l.onkeyup = function () {
                        if (l.value.length > 0 && pwdp == $.md5(getSplitInputValue(d))) {
                            //change local 
                            var pwd0 = usr.pwd.split(":")[0];
                            usr.pwd = pwd0 + ":" + pwdp;
                            //CHANGE DATABASE DATA
                            newXMLHttpRequest('POST', '.phtml/more/echoSql.phtml', 'sql=UPDATE usrinfo SET pwd="' + usr.pwd + '" where usrid="' + usr.usrid + '"', function () {
                                //change session
                                newXMLHttpRequest('POST', '.phtml/vrfylogin.php', 'direct=update&key=pwd&value=' + usr.pwd, function () {
                                    showMsgbox(msgbox, '<h3 style="width:100%">Password changed successfully</h3><p style="width:100%">Your password has been changed.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>Got it</a>');
                                    window.setTimeout(function () {
                                        hideMsgbox(msgbox);
                                        if (extraFn != null) extraFn();
                                    }, 2000);
                                }, function (st) {
                                    errMsg(st, btn);
                                })
                            }, function (st) {
                                errMsg(st, btn);
                            })
                        } else {
                            shakeBox(d.children[0], "leftRight", 3, 50, 10);
                            btn.innerHTML = "Try again";
                            d.setAttribute('tips', '<font size="4" err>The two passwords do not match</font>');
                            mx = d.getClientRects()[0].left;
                            my = d.getClientRects()[0].top + 20;
                            showTooltip(d);
                            window.setTimeout(function () {
                                hideTooltip(input);
                            }, 1000);
                        }
                    };
                }
            }
        } else {
            shakeBox(input, "leftRight", 3, 50, 10);
            btn.innerHTML = "Try again";
            input.setAttribute('tips', '<font size="4" err>The original password is incorrect</font>');
            mx = input.getClientRects()[0].left;
            my = input.getClientRects()[0].top + 10;
            showTooltip(input);
            window.setTimeout(function () {
                hideTooltip(input);
            }, 1000);
        }
    }
    input.onkeydown = function (e) {
        var e = e || window.event;
        if (e.keyCode == 10 || e.keyCode == 13) {
            btn.onclick();
        }
    }
}

function hasDefault() {
    var receipt_info = usr.receipt_info;
    if (typeof receipt_info == "undefined" || receipt_info == "") return false;
    var bool = false;
    var ris = receipt_info.split(":");
    for (var i = 0; i < ris.length; i++) {
        if (ris[i] == "") continue;
        if (decodeInfo(ris[i]).id.indexOf("|A") > -1) {
            return true;
        }
    }
    return bool;
}

function getNextId() {
    varrifo = usr.receipt_info;
    if (typeofrifo == "undefined" || ribo == "") return 0;
    var rifo = rifo.split(":");
    var recids = [];
    for (var i = 0; i < ribo.length; i++) {
        if (rifo[i] == "") continue;
        recids[recids.length] = parseInt(decodeInfo(rifo[i]).id.split("|")[0]);
    }
    if (recids.length == 0) {
        return 0;
    } else {
        var max = recids[recids.length - 1];
        return max + 1;
    }
}

function shbox(ele, text, delay) {
    shakeBox(ele, "leftRight", 4, 100, 20)
    mx = ele.getClientRects()[0].left;
    my = ele.getClientRects()[0].top + 15;
    ele.setAttribute('tips', '<font size="4" err>' + text + '</font>');
    showTooltip(ele);
    window.setTimeout(function () {
        hideTooltip(ele);
    }, delay);
}

function errMsg(stObj, WIO) {
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    var advice = "";
    if (stObj.status == 0) {
        advice = "Make sure you are online";
    } else if (stObj.status == 403) {
        advice = "Make sure you have permission to access this page";
    } else if (stObj.status == 404) {
        advice = "Make sure there is no error in the access path";
    }
    showMsgbox(msgbox, '<h3 style="width:100%">Network Error</h3><p>An error occurred while accessing the network. The page returns the code: ' + stObj.status + ', ' + advice + '. </p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)"right>OK</a>')
    if (WIO != null) {
        WIO.innerHTML = "Try again";
    }
}