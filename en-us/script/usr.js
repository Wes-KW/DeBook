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
  id:
  address:
  is_default:
  name:
  telephone:
  email:
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
            fnErr({ 'readyState': this.readyState, 'status': this.status });
        }
    }
    if (window.addEventListener != null) {
        xmlHttp.addEventListener("progress", fnProgress != null ? function (e) { fnProgress(e) } : function () { });
        xmlHttp.addEventListener("load", fnLoad != null ? function (e) { fnLoad(e) } : function () { });
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
    var len = value.length;
    for (i; i < len; i++) { if (/^[a-z,A-Z]/.test(value[i])) { charNum += 1; } if (/^[A-Z]/.test(value[i])) { cptlNum += 1; } if (/^[0-9]/.test(value[i])) { intNum += 1; } var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"); if (pattern.test(value[i])) { symNum += 1; } }
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
    var s = "";
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
      <h2 style="width:210px;">会话已过期</h2>\
      <h3 style="width:240px;margin-bottom: 10px;">您的登录会话已过期</h3>\
      <p>您的登录会话已过期，这通常是由于您在其它标签页或窗口登出了此网站，或者您重新打开没有登录信息的页面。<br>您将没有权限查看或修改任何设置和数据。<a href="?account">重新登录</a>。</p>\
      </div>\
      </div>';
    }
    for (key in usr) {
        usr[key] = "";
    }
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">会话已过期</h3><p>登录会话已过期</p><div class="line" style="margin-top: 5px;"></div><a class="btn" right xhr href="?account">重新登录</a><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">好的</a>');
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
    showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">发货人信息添加或更改</h3><p>填写发货人信息</p><div class="line" style="margin-top: 5px;"></div>\
    <div class="asbox_con" style="width:98.4%;"><p>&nbsp;姓名</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="姓名" autocomplete="off"></div>\
    <div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;手机号码</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="手机号码" autocomplete="off" pattern="[0-9]*"></div>\
    <div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;发货地址</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="发货地址" autocomplete="off"></div>\
    <div class="asbox_con" style="width:98.4%;margin-top:5px;"><input type="checkbox" id="check0" class="asbox" type="checkbox" onblur="boxstyle(this.parentElement,0)" onfocus="boxstyle(this.parentElement,1)" autocomplete="off" style="height:100%"><span style="left:0;top:3px;position:absolute;"></span><button a type="button" style="padding:0px;margin-left:18px;" onclick="this.parentElement.children[0].checked=!this.parentElement.children[0].checked">是否提供学校发货服务</button></div>\
    <div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;学校发货地址&nbsp;<font style="text-decoration:underline dashed 1px;color:#333;font-weight:bold">多个地址用“;”隔开</font></p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="学校发货地址" autocomplete="off"></div>\
    <div class="asbox_con" style="width:98.4%;margin-top:5px;"><input type="checkbox" id="check1" class="asbox" type="checkbox" onblur="boxstyle(this.parentElement,0)" onfocus="boxstyle(this.parentElement,1)" autocomplete="off" style="height:100%"><span style="left:0;top:3px;position:absolute;"></span><button a type="button" style="padding:0px;margin-left:18px;" onclick="this.parentElement.children[0].checked=!this.parentElement.children[0].checked">是否支持7天无理由退货</button></div>\
    <div class="line" style="margin-top: 5px;"></div><a class="btn" right>确认</a><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">取消</a>');
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
                document.getElementById("dlv_sch_allow").children[0].innerHTML = obj.sch_allow ? "提供" : "不提供";
                document.getElementById("dlv_sch").children[0].innerHTML = obj.sch;
                document.getElementById("dlv_sdays").children[0].innerHTML = obj.sdays ? "支持" : "不支持";
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
    var innerHTML = '<h3 style="margin-bottom:5px;width:100%">收货人信息添加或更改</h3><p>填写收货人信息</p><div class="line" style="margin-top: 5px;"></div>\
    <div class="asbox_con" style="width:98.4%;"><p>&nbsp;收货地址</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="收货地址" autocomplete="none"></div>\
    <div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;收货人</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="收货人" autocomplete="none"></div>\
    <div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;电话</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="电话" autocomplete="none" pattern="[0-9]*"></div>\
    <div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;电子邮箱</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="电子邮箱" autocomplete="none"></div>\
    <div class="asbox_con" style="width:98.4%;margin-top:5px;"><input type="checkbox" id="check0" class="asbox" type="checkbox" onblur="boxstyle(this.parentElement,0)" onfocus="boxstyle(this.parentElement,1)" autocomplete="none" style="height:100%"><span style="top:2px;position:absolute;"></span><button a type="button" style="padding:1px 0;margin-left:18px;" onclick="this.parentElement.children[0].checked=!this.parentElement.children[0].checked">设为默认地址</button></div>\
    <div class="line" style="margin-top: 5px;"></div>\
    <a class="btn" right>确认</a><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">取消</a>';
    showMsgbox(msgbox, innerHTML);
    var btn = msgbox.children[0].children[msgbox.children[0].children.length - 2];
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
                inputs[0].value = sadd;
                inputs[1].value = cname;
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
                shbox(inputs[i], text.substring(1, text.length) + "不能为空", 1500);
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
                    var d = "";
                    d += '<tr id=' + obj.id + '><td><input type="checkbox" class="asbox" type="checkbox" onclick="edSelect(this)"><span></span></td><td onclick=\'edSelect(this.parentElement.children[0].children[0],1)\'><a>' + obj.address + '</a>';
                    if (obj.id.indexOf("A") >= 0) d += '<font class="default">(默认)</font>';
                    d += '</td><td onclick=\'edSelect(this.parentElement.children[0].children[0],1)\'>' + obj.name + '</td><td onclick=\'edSelect(this.parentElement.children[0].children[0],1)\'>电话: ' + obj.tele + '<br>电子邮件: ' + obj.email + '</td><td><a onclick="removeReceiptMethod(\'' + obj.id + '\');">删除</a> | <a onclick="showUpdateReceiptMethod(\'' + obj.id + '\');">更改</a></td></tr>';
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
                                if (obj.id.indexOf("A") >= 0) rows[i].children[1].innerHTML += "<font class='default'>(默认)</font>";
                                rows[i].children[2].innerHTML = obj.name;
                                rows[i].children[3].innerHTML = "电话: " + obj.tele + "<br>电子邮件: " + obj.email;
                                rows[i].children[4].innerHTML = '<a onclick="removeReceiptMethod(\'' + changeId + '\');">删除</a> | <a onclick="showUpdateReceiptMethod(\'' + changeId + '\');">更改</a>';
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
                rows[0].parentElement.innerHTML = "<tr empty=\"\"><td colspan=\"5\" style=\"text-align: center;background-color: #f2f4f6;\">(没有收货地址)</td></tr>";
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
    if (data != null && confirm("您确定删除所有选中的收货地址吗？(此操作不可撤回)")) {
        removeReceiptMethod(document.getElementById("receipt_info_table").getAttribute("data"));
    }
}

function showUpdateEmail() {
    var vrfyCode = null;
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">更改电子邮箱</h3><p>更改现有的电子邮箱</p><div class="line" style="margin-top: 5px;"></div><div class="asbox_con" style="width:98.4%;"><p>&nbsp;新电子邮箱</p><input class="asbox" onblur="boxstyle(this.parentElement,0)" onfocus="boxstyle(this.parentElement,1)" autocomplete="off" placeholder="新电子邮箱" id=\'eml0\'><p>&nbsp;<a style="cursor: pointer;">获取验证码</a></p></div><div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;验证码</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="验证码" autocomplete="off"></div><div class="line" style="margin-top: 5px;"></div><a class="btn" right >确认</a><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">取消</a>');
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
                    var sub = "DeBook ID验证码";
                    var HTML = "<style>h3,h2,p,a{margin:0px;}h2{font-weight:normal;}</style><h3>DeBook 账户</h3><h2>我们收到了您的更换邮箱请求。您的验证码为<b>" + code + "</b>。请在DeBook网页继续操作。</h2><p>请不要转发验证码给任何陌生人，以防盗号。</p><p>如果您从未申请过更换邮箱，请务必忽略此封信件。</p><p>感谢您的联系</p><p>- Nawaski.com</p>";
                    var direct = "MAIL=" + rec + "&SUBJECT=" + sub + "&HTML=" + HTML + "&ALT=" + getHTMLText(HTML);
                    getCodeBtn.innerHTML = pds;
                    newXMLHttpRequest('POST', '.phtml/sendMail.phtml', "emailKey=go&" + direct, function (rspt) {
                        var getCodeBtn = msgbox.getElementsByClassName('asbox_con')[0].children[2].children[0];
                        if (rspt == "") {
                            getCodeBtn.innerHTML = "再试一次"
                            var d = getCodeBtn.outerHTML;
                            var p = getCodeBtn.parentElement;
                            vrfyCode = $.md5(code);
                            window.setTimeout(function () {
                                vrfyCode = "";
                            }, 180000);//30min timeout
                            getCodeBtn = msgbox.getElementsByClassName('asbox_con')[0].children[2].children[0];
                            getCodeBtn.onclick = function () { fn(); };
                            p.innerHTML = "&nbsp;没收到邮件？" + d;
                        } else {
                            shbox(input[0], "电子邮箱错误", 1500);
                            getCodeBtn.innerHTML = "再试一次"
                            var d = getCodeBtn.outerHTML;
                            var p = getCodeBtn.parentElement;
                            getCodeBtn = msgbox.getElementsByClassName('asbox_con')[0].children[2].children[0];
                            getCodeBtn.onclick = function () { fn(); };
                            p.innerHTML = "&nbsp;发送邮件失败。" + d;
                        }
                    }, function () {
                        getCodeBtn.innerHTML = "再试一次"
                        var d = getCodeBtn.outerHTML;
                        var p = getCodeBtn.parentElement;
                        getCodeBtn = msgbox.getElementsByClassName('asbox_con')[0].children[2].children[0];
                        getCodeBtn.onclick = fn;
                        p.innerHTML = "&nbsp;发送邮件失败(网络错误)。" + d;
                    });
                } else {
                    shbox(input[0], "此邮箱已经注册过，替换邮箱以继续", 2500);
                }
            }, function (stObj) {
                var advice = "";
                if (stObj.status == 0) {
                    advice = "请确保您已经联网";
                } else if (stObj.status == 403) {
                    advice = "请确保您有权限访问此页面";
                } else if (stObj.status == 404 || stObj.status == 500) {
                    advice = "请确保所访问路径没有错误";
                }
                showMsgbox(msgbox, '<h3 style="width:100%">网络错误</h3><p>访问网络时遇到错误，页面返回代码：' + stObj.status + '，' + advice + '。</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>好的</a>');
            });
        } else {
            shbox(input[0], "电子邮箱错误", 1500);
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
            shbox(input[1], "验证码不正确", 1000);
            btn.innerHTML = "再试一次";
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
    btn.innerHTML = "确定";
    btn.onclick = function () {
        //database
        newXMLHttpRequest('POST', '.phtml/more/echoSql.phtml', 'sql=UPDATE usrinfo SET nickname="' + nickname.children[1].children[0].value + '" WHERE usrid="' + usr.usrid + '"', function (rspt) {
            //local_session
            newXMLHttpRequest('POST', '.phtml/vrfylogin.php', 'direct=update&key=nickname&value=' + nickname.children[1].children[0].value, function () {
                //local
                nickname.children[0].innerHTML = nickname.children[1].children[0].value;
                nickname.children[0].style.display = "";
                nickname.children[1].style.display = "none";
                btn.innerHTML = "更改";
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
        btn.innerHTML = "更改";
        nickname.children[0].style.display = "";
        nickname.children[1].style.display = "none";
        btn.onclick = function () { showUpdateNickname(); };
    }
}

function showUpdatePassword0() {
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">更改密码</h3><p>更改账号密码</p><div class="line" style="margin-top: 5px;"></div><div class="asbox_con" style="width:98.4%;"><p>&nbsp;原始密码</p><input type="password" class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="原始密码" autocomplete="off"></div><div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;新密码</p><input type="password" class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="新密码" autocomplete="off"></div><div class="asbox_con" style="width:98.4%;margin-top:5px;"><p>&nbsp;确认新密码</p><input type="password" class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="确认新密码" autocomplete="off"></div><div class="line" style="margin-top: 5px;"></div><a class="btn" right >确认</a><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">取消</a>');
    var btn = msgbox.children[0].children[msgbox.children[0].children.length - 2];
    var input = msgbox.getElementsByTagName('input');
    btn.onclick = function () {
        btn.innerHTML = "<span class='wait' style='width:19px;background-color:whitesmoke;'></span>";
        //checkPwd
        if ($.md5(input[0].value) != usr.pwd.split(':')[0]) {
            shbox(input[0], "原始密码不正确", 1500);
            btn.innerHTML = "再试一次";
        } else {
            if (checkPwd(input[1].value) != 0) {
                if ($.md5(input[1].value) == $.md5(input[2].value)) {
                    var pwd2 = usr.pwd.split(':')[1];
                    //CHANGE LOCAL JS DATA
                    usr.pwd = $.md5(input[1].value) + ":" + pwd2;
                    if (checkPwd(input[1].value) < 2) {
                        showMsgbox(msgbox, '<h3 style="width:100%">密码不安全</h3><p style="width:100%">您的密码比较简单，我们将继续更改，但我们强烈建议您在事后修改密码。</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>知道了</a>');
                    }
                    //CHANGE DATABASE DATA
                    newXMLHttpRequest('POST', '.phtml/usr.php', 'key=forget&pwd=' + usr.pwd + '&ue=' + usr.usrid, function () {
                        //change session
                        newXMLHttpRequest('POST', '.phtml/vrfylogin.php', 'direct=update&key=pwd&value=' + usr.pwd, function () {
                            showMsgbox(msgbox, '<h3 style="width:100%">密码修改成功</h3><p style="width:100%">您的密码已经修改了。</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>知道了</a>');
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
                    shbox(input[2], "两次密码不匹配", 1500);
                    btn.innerHTML = "再试一次";
                }
            } else {
                shbox(input[1], "新密码非常不安全", 1500);
                btn.innerHTML = "再试一次";
            }
        }
    }
}

function showUpdatePassword1(extraFn) {
    var pwdp = "";
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">更改支付密码</h3><p>输入账户密码</p><div class="line" style="margin-top: 5px;"></div><div class="asbox_con" style="width:98.4%;"><p>&nbsp;原始密码</p><input type="password" class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="原始密码" autocomplete="off"></div><div class="line" style="margin-top: 5px;"></div><a class="btn" right >确认</a><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">取消</a>');
    var input = msgbox.getElementsByClassName('asbox')[0];
    var btn = msgbox.children[0].children[msgbox.children[0].children.length - 2];
    btn.onclick = function () {
        if ($.md5(input.value) == usr.pwd.split(":")[0]) {
            btn.innerHTML = "<span class='wait' style='width:19px;background-color:whitesmoke;'></span>";
            showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">新支付密码</h3><p>输入支付密码</p><div class="line" style="margin-top: 5px;"></div>\
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
                                <div class="line" style="margin-top: 5px;"></div>\
                                <a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">取消</a>');
            var d = msgbox.getElementsByClassName('split_input')[0];
            makeSplitInput(d);
            var l = d.lastElementChild.children[0];
            l.onkeyup = function () {
                if (l.value.length > 0) {
                    pwdp = $.md5(getSplitInputValue(d));
                    showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">确认支付密码</h3><p>再次输入支付密码</p><div class="line" style="margin-top: 5px;"></div>\
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
            <div class="line" style="margin-top: 5px;"></div><a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">取消</a>');
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
                                    showMsgbox(msgbox, '<h3 style="width:100%">密码修改成功</h3><p style="width:100%">您的密码已经修改了。</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>知道了</a>');
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
                            btn.innerHTML = "再试一次";
                            d.setAttribute('tips', '<font size="4" err>两次密码不匹配</font>');
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
            btn.innerHTML = "再试一次";
            input.setAttribute('tips', '<font size="4" err>原始密码不正确</font>');
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
    var rifo = usr.receipt_info;
    if (typeof rifo == "undefined" || rifo == "") return 0;
    var rifo = rifo.split(":");
    var recids = [];
    for (var i = 0; i < rifo.length; i++) {
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
        advice = "请确保您已经联网";
    } else if (stObj.status == 403) {
        advice = "请确保您有权限访问此页面";
    } else if (stObj.status == 404) {
        advice = "请确保所访问路径没有错误";
    }
    showMsgbox(msgbox, '<h3 style="width:100%">网络错误</h3><p>访问网络时遇到错误，页面返回代码：' + stObj.status + '，' + advice + '。</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>好的</a>')
    if (WIO != null) {
        WIO.innerHTML = "再试一次";
    }
}