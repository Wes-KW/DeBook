function lp(ints) {
    var all = document.getElementsByClassName("section")[0].children;
    for (var i = 0; i < all.length; i++) {
        if (i == ints) {
            all[ints].style.display = "block";
        } else {
            all[i].style.display = "none";
        }
    }
}

var global_modeInt = 1;

function newCode() {
    var cvs = document.getElementsByTagName('canvas').item(global_modeInt - 1);
    var w = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var i = 0;
    var code = "";
    for (i; i < 5; i++) {
        var tmp = w[Math.round(Math.random() * 62)];
        code += tmp; var drawer = cvs.getContext('2d'); var s = Math.round(Math.random() * 20 + 88);
        drawer.font = s + "px Times New Roman";
        drawer.fillText(tmp, 10 + i * Math.round(Math.random() * 15 + 45), 100);
        drawer.strokeText(tmp, 10 + i * Math.round(Math.random() * 15 + 45), 100);
    }
    return $.md5(code.toLocaleUpperCase());
}

function clearCode() {
    var cvs = document.getElementsByTagName('canvas').item(global_modeInt - 1);
    var cleaner = cvs.getContext('2d');
    cleaner.clearRect(0, 0, cvs.width, cvs.height);
}

function getHTMLText(html) {
    var o = document.getElementById('hidden');
    o.innerHTML = html;
    var s = o.innerText;
    o.innerHTML = "";
    return s;
}

//XHR Request
function newID(obj, attribute, fn, WIO) {
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    var direct = "key=usrid&direct=json&sql=select usrid from usrinfo";
    if (WIO != null) {
        WIO.innerHTML = "<span class='wait'></span>";
    }
    newXMLHttpRequest(null, ".phtml/more/echoSql.phtml", direct, function (rspt) {
        var eid = "";
        var eids = JSON.parse(rspt);
        while (eids.indexOf(eid) >= 0 || eid == "") {
            eid = randomStr("nW", 10);
        }
        obj[attribute] = eid;
        if (WIO != null) {
            WIO.innerHTML = "";
        }
        if (fn != null && typeof fn == "function") {
            fn();
        }
    }, function (stObj) {
        var advice = "";
        if (stObj.status == 0) {
            advice = "Please make sure you are connected to the Internet";
        } else if (stObj.status == 403) {
            advice = "Please make sure you have permission to access this page";
        } else if (stObj.status == 404) {
            advice = "Please make sure there is no error in the accessed path";
        }
        showMsgbox(msgbox, '<h3 style="width:100%">Network error</h3><p>An error occurred while accessing the network. The page returns code: ' + stObj.status + ', ' + advice + '.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>')
        if (WIO != null) {
            WIO.innerHTML = "Try again";
        }
    });
}

function sendMail(rec, sub, HTML, successText, errText, WIO, extraFn) {
    var msgbox = document.getElementsByClassName('MsgBox')[0];
    var direct = "MAIL=" + rec + "&SUBJECT=" + sub + "&HTML=" + HTML + "&ALT=" + getHTMLText(HTML);
    var resetWIO = function () {
        if (WIO != null) {
            WIO.innerHTML = "Try again";
            WIO.onclick = function () {
                if (typeof extraFn == "function") {
                    extraFn();
                } else {
                    sendMail(rec, sub, HTML, successText, errText, WIO);
                }
            }
        }
    }
    if (WIO != null) {
        WIO.innerHTML = "<span class='wait'></span>";
        WIO.onclick = null;
    }
    newXMLHttpRequest('POST', '.phtml/sendMail.phtml', "emailKey=go&" + direct, function (rspt) {
        if (rspt == "") {
            if (successText !== 0) {
                showMsgbox(msgbox, '<h3 style="width:100%">Mail sent</h3><p>' + successText + '</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>');
            }
            resetWIO();
        } else {
            showMsgbox(msgbox, '<h3 style="width:100%">Mail failed to send</h3><p style="width:100%">' + errText + '</p><p>Error code: ' + rspt + '</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>');
            resetWIO();
        }
    }, function (stObj) {
        var advice = "";
        if (stObj.status == 0) {
            advice = "Please make sure you are connected to the Internet";
        } else if (stObj.status == 403) {
            advice = "Please make sure you have permission to access this page";
        } else if (stObj.status == 404 || stObj.status == 500) {
            advice = "Please make sure there is no error in the accessed path";
        }
        showMsgbox(msgbox, '<h3 style="width:100%">Network error</h3><p>An error occurred while accessing the network. The page returns code: ' + stObj.status + ', ' + advice + '.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>Okay</a>');
        resetWIO();
    });
}

//sign up
function makeID(obj, fn) {
    newID(obj, "value", fn);
    window.setTimeout(function () {
        if (obj.value != "") {
            obj.onclick = function () { };
        }
    }, 10);
}

function mdMailCode(obj, extraFn) {
    var code = randomStr('n', 6);
    var restriction = obj.parentElement.parentElement.children[1].value;
    var rec = obj.parentElement.parentElement.children[1].value;
    var sub = "DeBook ID Verification Code";
    var HTML = "<style>h3,h2,p,a{margin:0px;}h2{font-weight:normal;}</style><h3>DeBook Account</h3><h2>We have received your registration or password recovery request. Your verification code is <b>" + code + "</b>. Please continue the operation on the DeBook website. </h2><p>Please do not forward the verification code to any stranger to prevent account theft. </p><p>If you have never applied for this registration or tried to retrieve your password, please be sure to ignore this letter. </p><p>Thank you for your contact</p><p>- Nawaski.com</p>";
    sendMail(rec, sub, HTML, "An email containing a verification code has been sent to your mailbox, please check it.", "", obj, extraFn);
    return $.md5(restriction + code);
}

function pwdChgMail(mail) {
    var rec = mail;
    var sub = "DeBook ID password change";
    var HTML = "<style>h3,h2,p,a{margin:0px;}h2{font-weight:normal;}</style><h3>DeBook account</h3><h2>Your DeBook ID password has been changed, the password was changed on <b>" + new Date().constructor() + "</b>. Changing your password will lock all currently logged-in accounts unless you log in again with the new password.</h2><p>If you do not retrieve your password without logging in, please change your password immediately.</p><p>If you have never used DeBook, please ignore this email.</p><p>Thank you for contacting</p><p>- Nawaski.com</p>";
    sendMail(rec, sub, HTML, 0, "", null);
}

//sign up ends
function initUsrForm() {
    setSignUp();
    setLogin();
    setForget();
    setY();
    setPreventForm();
}

function setPreventForm() {
    var f = document.getElementsByTagName("form");
    for (var i = 0; i < f.length; i++) {
        f[i].onsubmit = function (e) {
            e.preventDefault();
        }
    }
    var i = document.getElementsByTagName("input");
    for (var x = 0; x < i.length; x++) {
        if (i[x].className == "asbox") {
            addEvent("keydown", function (e) {
                if (e.keyCode == 11 || e.keyCode == 13) {
                    e.preventDefault();
                }
            }, i[x]);
        }
    }
}

function setY() {
    if (getQueryVariable()[""] == "signup") {
        window.scrollTo(0, document.getElementById('sectionCon').getElementsByClassName('rcon')[1].getClientRects()[0].y * 0.7);
    }
}

function resetSubmit(obj) {
    obj.innerHTML = "<span>Continue</span>"; obj.removeAttribute('disabled');
}

function chgLockForm(num, lockStatus) {
    var con = document.getElementById('sectionCon');
    var fm = con.getElementsByTagName('form')[num];
    if (lockStatus) {
        var cfms = fm.getElementsByTagName('input');
        for (var i = 0; i < cfms.length; i++) {
            cfms[i].setAttribute("disabled", '');
        }
        cfms = fm.getElementsByTagName('button');
        for (var i = 0; i < cfms.length; i++) {
            cfms[i].setAttribute("disabled", '');
        }
        fm.setAttribute("disabled", '');
    } else {
        varcfms = fm.getElementsByTagName('input');
        for (var i = 0; i < cfms.length; i++) {
            cfms[i].removeAttribute("disabled");
        }
        cfms = fm.getElementsByTagName('button');
        for (var i = 0; i < cfms.length; i++) {
            cfms[i].removeAttribute("disabled");
        }
        fm.removeAttribute("disabled");
    }
}

//forget
function setForget() {
    var submit2 = document.getElementById('submit2');
    var pwd2_1 = document.getElementById('pwd2-1');
    var global_codes = new Object();
    var makeMailCodeVrfy = function (obj) {
        newXMLHttpRequest('POST', '.phtml/usr.php', 'key=hasEmail&email=' + obj.parentElement.parentElement.children[1].value, function (rspt) {
            if (rspt == "1") {
                global_codes.code2 = mdMailCode(obj, function () {
                    makeMailCodeVrfy(obj);
                });
                newXMLHttpRequest('POST', '.phtml/vrfylogin.php', 'direct=setECCode&e_code=' + global_codes.code2, function () { }, function () { });
                //30min timeout 
                window.setTimeout(function () {
                    global_codes.code2 = "";
                    newXMLHttpRequest('POST', '.phtml/vrfylogin.php', 'direct=setECCode&e_code=', function () { }, function () { });
                }, 180000);
            } else {
                var msgbox = document.getElementsByClassName('MsgBox')[0];
                showMsgbox(msgbox, '<h3 style="width:100%">User error</h3><p style="width:100%">This email has not been used for registration. If you want to join us, please fill in the information in the <b>"Join DeBook"</b> column.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>');
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
            showMsgbox(msgbox, '<h3 style="width:100%">Network error</h3><p>An error occurred while accessing the network. The page returns code: ' + stObj.status + ', ' + advice + '.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>Okay</a>');
        });
    }
    var forget = function () {
        var submit2 = document.getElementById('submit2');
        var pwd2_0 = document.getElementById('pwd2-0');
        var pwd2_1 = document.getElementById('pwd2-1');
        var eml1 = document.getElementById('eml1');
        var emlc1 = document.getElementById('emlc1');
        var t = 0;
        submit2.innerHTML = "<span class='wait' style='width:11px;background-color:whitesmoke;'></span>";
        submit2.setAttribute("disabled", '');
        var msgbox = document.getElementsByClassName("MsgBox")[0];
        chgLockForm(2, 1);
        newXMLHttpRequest('POST', '.phtml/usr.php', 'key=hasEmail&email=' + eml1.value, function (rspt) {
            if (rspt == "1") {
                if ($.md5(pwd2_0.value) == $.md5(pwd2_1.value)) {
                    if (checkPwd(pwd2_0.value) > 0.15) {
                        if (checkPwd(pwd2_0.value) < 2) {
                            showMsgbox(msgbox, '<h3 style="width:100%">Password is not secure</h3><p style="width:100%">Your password is simple and we will continue to change it, but we strongly recommend that you change your password afterwards.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>Got it</a>');
                            t = 4000;
                        }
                        newXMLHttpRequest('POST', '.phtml/usr.php', 'key=getpwd&ue=' + eml1.value, function (rspt) {
                            var a = JSON.parse(rspt);
                            if (a != "") {
                                var o = a[0]["pwd"].split(":");
                                o[0] = $.md5(pwd2_0.value);
                                var s = o[0] + ":" + o[1];
                                newXMLHttpRequest('POST', '.phtml/usr.php', 'key=forget&ue=' + eml1.value + '&pwd=' + s + "&e_code=" + eml1.value + emlc1.value, function (rspt) {
                                    if (rspt == "") {
                                        pwdChgMail(eml1.value);
                                        chgLockForm(2, 0);
                                        resetSubmit(submit2);
                                        window.setTimeout(function () {
                                            showMsgbox(msgbox, '<h3 style="width:100%">Password change successful</h3><p style="width:100%">Your password has been changed.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>');
                                            eml1.value = "";
                                            emlc1.value = "";
                                            pwd2_0.value = "";
                                            pwd2_1.value = "";
                                            global_codes.code2 = "";
                                        }, t);
                                    } else {
                                        showMsgbox(msgbox, '<h3 style="width:100%">Email verification code error</h3><p style="width:100%">Please check if your email verification code is correct and try again.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>');
                                        chgLockForm(2, 0);
                                        resetSubmit(submit2);
                                    }
                                }, function (stobj) {
                                    netFatal(stobj, 2, submit2);
                                    chgLockForm(2, 0);
                                    resetSubmit(submit2);
                                });
                            } else {
                                showMsgbox(msgbox, '<h3 style="width:100%">Email verification code error</h3><p style="width:100%">Please check if your email address is filled in correctly and try again. </p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>');
                                chgLockForm(2, 0);
                                resetSubmit(submit2);
                            }
                        }, function (stobj) {
                            netFatal(stobj, 2, submit2);
                            chgLockForm(2, 0);
                            resetSubmit(submit2);
                        });
                    } else {
                        showMsgbox(msgbox, '<h3 style="width:100%">Passwords are very unsafe</h3><p style="width:100%">Empty passwords or passwords with one or two characters are very unsafe. For safety reasons, please add more characters, preferably uppercase and lowercase, numbers and symbols.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>');
                        chgLockForm(2, 0);
                        resetSubmit(submit2);
                    }
                } else {
                    showMsgbox(msgbox, '<h3 style="width:100%">The two passwords do not match</h3><p style="width:100%">Please check that the two passwords you entered are the same and change them, then try again.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>');
                    chgLockForm(2, 0);
                    resetSubmit(submit2);
                }
            } else {
                showMsgbox(msgbox, '<h3 style="width:100%">User error</h3><p style="width:100%">This email has not been used for registration. If you want to join us, please fill in the information in the <b>"Join DeBook"</b> column.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>');
                chgLockForm(2, 0);
                resetSubmit(submit2);
            }
        }, function (stobj) {
            netFatal(stobj, 2, submit2);
            chgLockForm(2, 0);
            resetSubmit(submit2);
        });
    }
    var eml1btn = document.getElementsByClassName("mailCode")[1];
    eml1btn.onclick = function () {
        makeMailCodeVrfy(eml1.parentElement.children[0].children[0]);
    }
    var eml1 = document.getElementById('eml1');
    eml1.onkeydown = function (e) {
        var event = e || window.event;
        if (eml1.value != "") {
            if (event.keyCode == 10 || event.keyCode == 13) {
                eml1btn.onclick();
            }
        }
    }
    submit2.onclick = function (event) { forget(); }
    pwd2_1.onkeydown = function (event) {
        var e = event || window.event;
        if (e.keyCode == 10 || e.keyCode == 13) {
            forget();
        }
    }
}

//login
function setLogin() {
    var submit0 = document.getElementById('submit0');
    var pwd0 = document.getElementById('pwd0');
    var check0 = document.getElementById('check0');
    submit0.onclick = function () { login(); };
    check0.onkeydown = function (event) {
        var e = event || window.event;
        if (e.keyCode == 10 || e.keyCode == 13) {
            login();
        }
    }
    pwd0.onkeydown = check0.onkeydown;
    check0.parentElement.lastElementChild.onkeydown = check0.onkeydown;
}

function login() {
    var submit0 = document.getElementById('submit0');
    var id0 = document.getElementById('id0');
    var pwd0 = document.getElementById('pwd0');
    var check0 = document.getElementById('check0');
    var longt = String(check0.checked ? 1 : 0);
    chgLockForm(0, 1);
    submit0.setAttribute("disabled", "");
    submit0.innerHTML = '<span class="wait" style="width:11px;padding-left: 6px;background-color:whitesmoke;background-position: 2px;"></span>';
    newXMLHttpRequest("POST", ".phtml/usr.php", "key=login&usr=" + id0.value + "&pwd=" + pwd0.value + "&longt=" + longt, function (rspt) {
        varmb = document.getElementsByClassName("MsgBox")[0];
        if (rspt == "ERR_USR_NOT_FOUND" || rspt == "ERR_NOT_AUTHORIZED") {
            showMsgbox(mb, '<h3 style="width:100%">Username or password error</h3><p style="width:100%">Your username or password is wrong, please check and change it and try again.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>Got it</a>');
            chgLockForm(0, 0);
            submit0.removeAttribute("disabled");
            submit0.innerHTML = '<span>Continue</span>';
        } else if (rspt == "1") {
            autologin(function () {
                if (getHashContinue() != "") {
                    gotoPage(getHashContinue());
                    putHis("", "", getHashContinue());
                } else {
                    gotoPage("?account");
                }
            });
        }
    }, function (stObj) {
        netFatal(stObj, 0, submit0);
    })
}

//Sign up
function setSignUp() {
    var global_codes = new Object();
    var signupVrfyCode1 = function () {
        var msgbox = document.getElementsByClassName('MsgBox')[0];
        var input = msgbox.getElementsByClassName('asbox')[0];
        if ($.md5(input.value.toLocaleUpperCase()) === global_codes.code1) {
            window.setTimeout(function () {
                recordSignup();
            }, 100);
        } else {
            shakeBox(input, "leftRight", 3, 50, 10);
            input.setAttribute('tips', '<font size="4" err>The verification code is incorrect</font>');
            mx = input.getClientRects()[0].left;
            my = input.getClientRects()[0].top + 10;
            showTooltip(input);
            window.setTimeout(function () {
                hideTooltip(input);
            }, 1000);
        }
    }
    var recordSignup = function () {
        var submit1 = document.getElementById('submit1');
        var msgbox = document.getElementsByClassName('MsgBox')[0];
        showMsgbox(msgbox, '<h3 style="width:100%">Registering</h3><p>We are registering for you. After registration, you will be logged in. Please wait patiently. <span class=\'wait\' style=\'width: 18px;height: 18px;margin-left: 2px;\'></span></p>');
        //usrinfo
        makeID(document.getElementById('id1'), function () {
            usr.usrid = document.getElementById('id1').value;
            usr.email = document.getElementById('eml0').value;
            usr.time = String(new Date().getTime());
            usr.coins = "0";
            usr.email_news = document.getElementById('eml0').value;
            usr.pwd = $.md5(document.getElementById('pwd1-0').value) + ":";
            usr.receipt_info = "";
            usr.deliver_info = "";
            usr.cart = ""; var usrd = new Object;
            for (var i in usr) {
                if (i != "keys") {
                    usrd[i] = usr[i];
                }
            }
            var newSql = objToSql(usrd);
            newXMLHttpRequest('POST', '.phtml/usr.php', 'key=signup&data=' + newSql, function () {
                //log in; 
                newXMLHttpRequest('POST', '.phtml/usr.php', 'key=login&usr=' + usr.email + '&pwd=' + document.getElementById('pwd1-0').value, function (rspt) {
                    window.setTimeout(function () {
                        autologin(function () {
                            gotoPage("?account");
                            hideMsgbox(msgbox);
                        });
                    }, 300);
                }, function (stObj) {
                    netFatal(stObj, 1, submit1);
                });
            }, function (stObj) {
                netFatal(stObj, 1, submit1);
            });
        });
    }
    var makeMailCode = function (obj) {
        newXMLHttpRequest('POST', '.phtml/usr.php', 'key=hasEmail&email=' + obj.parentElement.parentElement.children[1].value, function (rspt) {
            if (rspt == "0") {
                global_codes.code2 = mdMailCode(obj, function () {
                    makeMailCode(obj);
                });
                //30 min timeout 
                window.setTimeout(function () {
                    global_codes.code2 = "";
                }, 180000);
            } else {
                var msgbox = document.getElementsByClassName('MsgBox')[0];
                showMsgbox(msgbox, '<h3 style="width:100%">This email has been registered</h3><p style="width:100%">This email has been registered. If you want to log in, please go to the <b><a style="float:none" xhr href="?account#login">Login page</a></b>, otherwise, please change your email.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>');
                initAllLink();
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
    }
    var signup = function () {
        //lock signup button
        var submit1 = document.getElementById('submit1');
        submit1.setAttribute('disabled', '');
        chgLockForm(1, 1);
        //verify id 
        var msgbox = document.getElementsByClassName('MsgBox')[0];
        var eml0 = document.getElementById('eml0');
        var emlc0 = document.getElementById('emlc0');
        var pwd1_0 = document.getElementById('pwd1-0');
        var pwd1_1 = document.getElementById('pwd1-1');
        submit1.innerHTML = "<span class='wait' style='width:11px;background-color:whitesmoke;'></span>";
        newXMLHttpRequest('POST', '.phtml/usr.php', 'key=hasEmail&email=' + eml0.value, function (rspt) {
            if (eml0.value != "" && rspt == "0") {
                //continue verify email
                if (emlc0.value != "" && $.md5(eml0.value + emlc0.value) == global_codes.code2) {
                    //continue verify email code
                    if (checkPwd(pwd1_0.value) > 0.15) {
                        //continue verify password
                        var timewait = 0;
                        if (checkPwd(pwd1_0.value) < 0.2) {
                            showMsgbox(msgbox, '<h3 style="width:100%">Password is not safe</h3><p style="width:100%">Your password is relatively simple, we will continue to register, but we strongly recommend that you change your password afterwards.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>Know it</a>');
                            hideMsgbox(msgbox, 4000);
                            timewait = 4500;
                        }
                        if (pwd1_0.value == pwd1_1.value) {
                            //cotinue verify_code
                            window.setTimeout(function () {
                                showMsgbox(msgbox, '<h3 style="margin-bottom:5px;width:100%">Verification code</h3><p>Enter the verification code to confirm that you are not a robot. (Not case sensitive)</p><div class="line" style="margin-top: 5px;"></div><div style="width: 100%;"><div class="asbox_con" style="width:28%;margin-right:1%"><canvas style="width:73%;height:28px;position:relative;float:left;"></canvas><a tips="Refresh code" onmouseover="showTooltip(this)" onmouseleave="hideTooltip()" class="btn" id="refresh_btn" style="width:20px;height:20px;padding:3px;border-radius:0px;background-size:24px;background-position:2px;background-repeat:no-repeat;background-image:url(\'Image/fatcow/arrow_refresh.png\')"></a></div><div class="asbox_con" style="width:69%;margin-left:1%"><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" oninput="" style="width:100%" autocomplete="off"></div></div><div class="line" style="margin-top: 5px;"></div><a class="btn" id="confirm_btn" right>Confirm</a><a class="btn" right onclick="cancelVrfyCode(this,document.getElementById(\'submit1\'));chgLockForm(1,0);">Cancel</a>');
                                global_codes.code1 = newCode();
                                var btn = document.getElementById("refresh_btn");
                                btn.onclick = function () {
                                    clearCode();
                                    global_codes.code1 = newCode();
                                }
                                var confirmBtn = document.getElementById("confirm_btn"); confirmBtn.onclick = function () {
                                    signupVrfyCode1();
                                }
                                msgbox.getElementsByClassName("asbox")[0].onkeydown = function (e) {
                                    var e1 = e || window.event;
                                    if (e1.keyCode == 10 || e1.keyCode == 13) {
                                        signupVrfyCode1();
                                    } else if (e1.keyCode == 27) {
                                        cancelVrfyCode(msgbox.getElementsByTagName('A')[1], submit1);
                                        chgLockForm(1, 0);
                                    }
                                }
                            }, timewait);
                            //to verify_code 
                        } else {
                            showMsgbox(msgbox, '<h3 style="width:100%">Password mismatch</h3><p style="width:100%">The two passwords are different, please make sure the passwords are the same and try again. </p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>Yes</a>');
                            resetSubmit(submit1);
                            chgLockForm(1, 0);
                        }
                    } else {
                        showMsgbox(msgbox, '<h3 style="width:100%">Passwords are very unsafe</h3><p style="width:100%">Empty passwords or passwords with one or two characters are very unsafe. For safety reasons, please add more characters, preferably uppercase and lowercase, numbers and symbols. </p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>');
                        resetSubmit(submit1);
                        chgLockForm(1, 0);
                    }
                } else {
                    showMsgbox(msgbox, '<h3 style="width:100%">No (correct) email verification code was filled in</h3><p style="width:100%">Please fill in the (correct) email verification code and try again.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>');
                    resetSubmit(submit1);
                    chgLockForm(1, 0);
                }
            } else {
                showMsgbox(msgbox, '<h3 style="width:100%">No (correct) email address was filled in, or an already registered email address was filled in.</h3><p style="width:100%">Please fill in the (correct or other) email address and try again. </p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>');
                resetSubmit(submit1);
                chgLockForm(1, 0);
            }
        }, function (stObj) {
            var advice = "";
            if (stObj.status == 0) {
                advice = "Please make sure you are connected to the Internet";
            } else if (stObj.status == 403) {
                advice = "Please make sure you have permission to access this page";
            } else if (stObj.status == 404 || stObj.status == 500) {
                advice = "Please make sure there is no error in the accessed path";
            }
            showMsgbox(msgbox, '<h3 style="width:100%">Network error</h3><p>An error occurred while accessing the network. The page returns code: ' + stObj.status + ', ' + advice + '. </p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>')
            resetSubmit(submit1);
            chgLockForm(1, 0);
        });
    }
    var eml0btn = document.getElementsByClassName("mailCode")[0];
    eml0btn.onclick = function () {
        makeMailCode(eml0.parentElement.children[0].children[0]);
    }
    var eml0 = document.getElementById('eml0');
    eml0.onkeydown = function (e) {
        var evt = e || window.event;
        if (eml0.value != "") {
            if (evt.keyCode == 10 || evt.keyCode == 13) {
                eml0btn.onclick();
            }
        }
    }
    var submit1 = document.getElementById('submit1');
    var pwd1_1 = document.getElementById('pwd1-1');
    submit1.onclick = function () {
        signup();
    };
    pwd1_1.onkeydown = function (e) {
        var event = e || window.event;
        if (event.keyCode == 10 || event.keyCode == 13) {
            signup();
        }
    }
}

function netFatal(stObj, num, submit) {
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    var advice = "";
    if (stObj.status == 0) {
        advice = "Make sure you are online";
    } else if (stObj.status == 403) {
        advice = "Make sure you have permission to access this page";
    } else if (stObj.status == 404 || stObj.status == 500) {
        advice = "Please make sure there is no error in the accessed path";
    }
    showMsgbox(msgbox, '<h3 style="width:100%">Network error</h3><p>An error occurred while accessing the network. The page returns code: ' + stObj.status + ', ' + advice + '.</p><div class="line" style="margin-top: 5px;"></div><a class="btn" onclick="hideMsgbox(this.parentElement.parentElement)" right>OK</a>');
    resetSubmit(submit);
    chgLockForm(num, 0);
}

//sign up ends

function cancelVrfyCode(cancelbtn, button) {
    hideMsgbox(cancelbtn.parentElement.parentElement);
    button.innerHTML = "<span>Continue</span>";
    button.removeAttribute('disabled');
}