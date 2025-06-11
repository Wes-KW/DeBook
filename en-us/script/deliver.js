var selectedBuyIndex = -1;
var buyOrderSta = -1;
var sellOrderSta = -1;
var global_hideCan1 = null;
var global_hideCan2 = null;
var sta1 = "";

function initStarContainer(container, extraFn) {
    container.setAttribute("value", 0);
    var c = container.children;
    var setFn = function (obj) {
        var idx = in_array(c, obj);
        var last = false;
        var lastidx = -1;
        for (var i = 0; i < c.length; i++) {
            if (!c[i].hasAttribute("selected")) break;
            lastidx = i;
        }
        last = lastidx == idx;
        if (last) idx = -1;
        for (var i = 0; i < c.length; i++) {
            if (i > idx) {
                c[i].removeAttribute("selected");
            } else {
                c[i].setAttribute("selected", "");
            }
        }
        container.setAttribute("value", idx + 1);
        if (extraFn != null) {
            extraFn(idx);
        }
    };
    for (var i = 0; i < c.length; i++) {
        c[i].onclick = function () {
            setFn(this);
        }
    }
}

function buy() {
    var h = window.location.search;
    if (typeof usr.usrid == "undefined" || usr.usrid == "") {
        gotoPage("?account");
        putHis("", "", "?account#continue=" + h);
        return;
    }
    var buyItems = []; if (location.search.indexOf("?cart") == 0) {
        var infoboxes = document.getElementsByClassName("infobox");
        for (var i = 0; i < infoboxes.length; i++) {
            if (!infoboxes[i].hasAttribute("selected")) continue;
            var k = infoboxes[i].getElementsByClassName("k")[0];
            var asbox_con = k.getElementsByClassName("asbox_con");
            for (var x = 0; x < asbox_con.length; x++) {
                if (!asbox_con[x].hasAttribute("goodsid")) continue;
                if (!asbox_con[x].hasAttribute("selected")) continue;
                buyItems[buyItems.length] = asbox_con[x].getAttribute("goodsid");
            }
        }
    } else if (location.search.indexOf("?book") == 0) {
        var items = document.getElementById('goodsItemBox').children;
        for (var i = 0; i < items.length; i++) {
            if (!items[i].hasAttribute("selected") || !items[i].hasAttribute("goodsid")) continue;
            buyItems[buyItems.length] = items[i].getAttribute("goodsid");
        }
    }
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
        var defInfo = "<span style='font-size:16px'>" + data.address + " (<b>" + data.name + "</b>Receive)" + "<br/>Contact information: <b>" + data.tele + "</b>(telephone); <b>" + data.email + "</b>(email)" + "</span>";
        addrHtml += "<a class=\"radioBox\" tips=\"" + defInfo + "\" onmouseover=\"showTooltip(this)\" onmouseleave=\"hideTooltip(this)\" href=\"javascript:;\" onclick=\"selectDlvRadio(this)\"" + selectedStr + " id='" + data.id + "'><input class=\"asbox\" type=\"radio\" onclick=\"selectDlvRadio(this.parentElement)\" " + selectedStr2 + "><span></span><p>" + address + " (<b>" + data.name + "</b>Receive)" + defaultStr + "<br/>Contact information: <b>" + tele + "</b>(Phone); <b>" + email + "</b>(Email)";
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
    var updateDlv = function (receipt) {
        newXMLHttpRequest("POST", ".phtml/deliver.php", "key=generateOrder&id=" + strJson(buyItems) + "&receipt=" + receipt, function (rspt) {
            if (location.search.indexOf("?cart") == 0) {
                skipMsgDeleteCartSel();
            } else if (location.search.indexOf("?book") == 0) {
                clearBookSel(buyItems);
            }
            window.setTimeout(function () {
                if (rspt != "[]") {
                    var data = JSON.parse(rspt);
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
                        missListHtml += "<a class=\"radioBox\" href=\"javascript:;\"><input class=\"asbox\" type=\"radio\" onclick=\"selectDlvRadio(this.parentElement)\"><span style=\"background-image:url('Image/fatcow/error.png')\"></span><p>" + data[i].bookName + " " + aurstr + "著 (" + data[i].lang + " " + data[i].publish + ")<br/>Price: <b>" + parseFloat(data[i].price).toFixed(2) + "</b>; Supplier <b>" + data[i].udlvinfo.name + "</b></p></a>";
                    }
                    showMsgbox(msgbox, "<h3 style=\"width:100%\">Purchase failed</h3><p style=\"width:100%\">Purchase failed for the following items because they have been purchased by other customers or deleted by the seller.<a xhr style=\"float:none\" href=\"?help/purchase/consumer_conflict\">Click here for details</a>. </p><div class=\"radioCon\" style=\"margin-top:5px\">" + missListHtml + "</div><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">OK</a>");
                } else {
                    showMsgbox(msgbox, "<h3 style=\"width:100%\">Product purchase successful</h3><p style=\"width:100%\">DeBook will not automatically initiate payment. Please click on the detailed information under each purchased product to contact the seller and make payment. Before payment, please be sure to check whether the actual picture of the product is consistent with its description. If there is a discrepancy between the picture and the text, please do not pay.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Good</a>");
                }
                gotoPage("?account");
                putHis("", "", "?account");
            }, 100);
        }, function () {
            badNet();
        });
    }
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

function clearBookSel(items) {
    var fnbox = document.getElementById('goodsItemBox').children;
    var pricebox = document.getElementsByClassName('fnBox')[1];
    pricebox.children[0].innerHTML = "Selected quantity: 0 | Price";
    pricebox.children[1].children[0].value = "0.00";
    pricebox.getElementsByClassName("asbox_con")[1].setAttribute("disabled", "");
    pricebox.getElementsByClassName("asbox_con")[2].setAttribute("disabled", "");
    var fnbox2 = document.getElementsByClassName('fnBox')[2].children;
    for (var i = 0; i < items.length; i++) {
        if (!(fnbox[i].hasAttribute("goodsId") && fnbox[i].hasAttribute("selected"))) continue;
        fnbox[i].outerHTML = "";
        fnbox2[i].outerHTML = "";
    }
    if (fnbox2.length == 0) {
        var fnbox = document.getElementById('goodsItemBox');
        var fnbox2 = document.getElementsByClassName('fnBox')[2];
        fnbox.innerHTML += "<div class=\"asbox_con\" style=\"margin:0px 10px 8px 0px\" null=\"\"><div><a class=\"tag\"><b>Out of stock</b><font class=\"tag\"></font></a><a class=\"price\">No seller</a></div></div>";
        fnbox2.innerHTML += "<div class=\"asbox_con\" tab=\"\" style=\"margin-bottom:0;border-bottom:0\"><div><a class=\"tag\"><b>Out of stock</b><font class=\"tag\"></font></a><a class=\"price\">No seller</a></div></div>";
    }
}

function selectDlvRadio(obj) {
    var objc = obj.parentElement.children;
    var index = in_array(objc, obj);
    for (var i = 0; i < objc.length; i++) {
        if (i == index) continue;
        objc[i].removeAttribute("selected");
        objc[i].children[0].checked = false;
    }
    obj.setAttribute("selected", "");
    obj.children[0].checked = true;
}

function selectDlvApl(id, obj, opt) {
    if (typeof usr.usrid == "undefined") return;
    if (usr.usrid == "") return;
    var tr = obj.parentElement.parentElement;
    var trpc = tr.parentElement.children;
    var tri = in_array(trpc, tr);
    if (tr.hasAttribute("selected")) {
        if (tr.getAttribute("selected") == "true") {
            tr.children[0].children[0].removeAttribute("checked");
            tr.removeAttribute("selected");
            var node = trpc[tri + 1].children[0].children[0];
            var autoh = node.getClientRects()[0].height;
            node.style.height = autoh + "px";
            window.setTimeout(function () {
                node.style.height = "0px";
                window.setTimeout(function () {
                    trpc[tri + 1].outerHTML = "";
                }, 500);
            }, 1);
            return;
        }
    }
    newXMLHttpRequest('POST', '.phtml/deliver.php', 'key=getOrderInfo&id=' + id, function (rspt) {
        var data = JSON.parse(rspt);
        var aObj = data.aplinfo;
        if (aObj.usrid == 'SPECIAL') aObj.udlvinfo.name = "DeBook Official";
        var bObj = decodeInfo(data.rcpt_info);
        varaplid = data.aplid;
        var starClassList = ["star0d0", "star0d5", "star1d0", "star1d5", "star2d0", "star2d5", "star3d0", "star3d5", "star4d0", "star4d5", "star5d0"];
        var evaWordList = ["Extremely Poor", "Very Poor", "Poor", "A bit poor", "Not good", "Moderate", "Not bad", "Good", "Very Good", "Excellent", "Perfect"];
        var addHtml = "";
        if (data.status == 0) {
            if (opt == null) {
                addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">This order has not been paid or the seller has not shipped. Please contact the seller through '<b>" + aObj.udlvinfo.name + "</b>'(Phone: <a href=\"tel:" + aObj.udlvinfo.phone_number + "\">" + aObj.udlvinfo.phone_number + "</a>, Email: <a href=\"mailto:" + aObj.email + "\">" + aObj.email + "</a>), use WeChat Pay or Alipay to pay, and wait for the seller to ship. If the merchant cannot be contacted and does not ship, please cancel the order.</div>";
                if (aObj.usrid == "SPECIAL") addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">DeBook official is shipping for you, please wait patiently. If you have any questions, you can contact us through the following methods: '<b>" + aObj.udlvinfo.name + "</b>'(Phone: <a href=\"tel:" + aObj.udlvinfo.phone_number + "\">" + aObj.udlvinfo.phone_number + "</a>, Email: <a href=\"mailto:" + aObj.email + "\">" + aObj.email + "</a>).</div>";
            } else {
                addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">This order has not been paid. Please contact the buyer through '<b>" + bObj.name + "</b>' (Phone: <a href=\"tel:" + bObj.tele + "\">" + bObj.tele + "</a>, Email: <a href=\"mailto:" + bObj.email + "\">" + bObj.email + "</a>), use WeChat Pay or Alipay to receive payment. If it is confirmed that the merchant has paid, <a onclick=\"setDlvUID(" + id + ")\">Click here</a> to get <u tips=\"DeBook unique identification code(DeBook UID) is a number that can identify the uniqueness of a product. This number will be used as a certification code for buyers to evaluate this product. \" onmouseover='showTooltip(this,true)' onmouseleave='hideTooltip()'>DeBook unique identification code</u> and start shipping. If the buyer is unable to contact or does not pay, please cancel the order.</div>";
                if (aObj.usrid == "SPECIAL") addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">The merchant has paid, <a onclick=\"setDlvUID(" + id + ")\">Click here</a> to get <u tips=\"DeBook unique identification code (DeBook UID) is a number that can identify the uniqueness of a product. This number will be used as a verification code for buyers to evaluate this product. \" onmouseover='showTooltip(this,true)' onmouseleave='hideTooltip()'>DeBook unique identification code</u> and start shipping. If the buyer is not contacted or does not pay, please cancel the order.</div>";
            }
        } else if (data.status == 1) {
            if (opt == null) {
                addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">This order has been paid & shipped, please contact the seller through '<b>" + aObj.udlvinfo.name + "</b>'(Phone: <a href=\"tel:" + aObj.udlvinfo.phone_number + "\">" + aObj.udlvinfo.phone_number + "</a>, Email: <a href=\"mailto:" + aObj.email + "\">" + aObj.email + "</a>) for more information. The delivery progress of the goods can be checked through <a xhr href='?help/delivery/software_and_website'>specific websites or software</a>. </div>";
            } else {
                addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">This order has been paid & shipped. Please wait for the buyer to receive the goods. After receiving the goods, you and the buyer need to confirm the receipt at the same time. Your DeBook unique identification code is: <b>" + data.uid + "</b>. This identification code is only used to confirm that the buyer has received the goods. Please do not send this code to the buyer in advance.</div>";
            }
        } else if (data.status == 2) {
            if (opt == null) {
                addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">This order has been completed.</div>";
            } else {
                addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">This order has been completed. Please wait for the buyer's evaluation. If the buyer does not evaluate within one month, the system will automatically rate it as 5 stars.</div>";
            }
        } else if (data.status == 3) {
            if (data.returnStatus == 0) {
                if (opt == null) {
                    addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">You have applied to return this product. Please wait patiently for the seller to operate on the website.</div>";
                } else {
                    addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color:#fffde7;\">The buyer applies to return this product. Please contact the buyer and confirm before confirming. You need to check the condition of the book when confirming.</div>";
                }
            } else if (data.returnStatus == 1) {
                if (opt == null) {
                    addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">Please contact the seller and confirm the location of the return of the goods. Please communicate with the seller to confirm the freight bearer.</div>";
                } else {
                    addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">Please contact the buyer and confirm the location of the return of the goods. Please communicate with the buyer to confirm the freight bearer.</div>";
                }
            } else if (data.returnStatus == 2) {
                if (opt == null) {
                    addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">Please contact the seller and return the amount paid. The amount is <b>￥" + aObj.price + "</b>. After confirming that the refund has been made, press 'Confirm'.</div>";
                } else {
                    addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">Please contact the buyer and return the amount paid. The amount is <b>￥" + aObj.price + "</b>. After confirming that the refund has been made, wait for the buyer to press 'Confirm'. </div>";
                }
            } else if (data.returnStatus == 3) {
                if (opt == null) {
                    addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">This order has been successfully returned.</div>";
                } else {
                    addHtml = "<div class=\"row\" style=\"padding: 6px 8px;width: calc(100% - 26px);margin-bottom: 10px;border:1px solid #78909c;border-radius: 5px;background-color: #fffde7;\">This order has been successfully returned.</div>";
                }
            }
        }
        //seller
        var detailBoxHtml = "<tr detailbox><td colspan=\"6\" class=\"whiteboard\" style=\"background-color:white\"><div class=\"whiteboard\">" + addHtml + "<div class=\"row\" half><a class=\"sword\">Language</a><p class=\"sword\">" + aObj.lang + "</p></div><div class=\"row\" half><a class=\"sword\">Publishing Company</a><p class=\"sword\">" + aObj.publish + "</p></div>";
        detailBoxHtml += "<div class=\"row\" half><a class=\"sword\">Number of book pages</a><p class=\"sword\">" + aObj.quality.pages + "</p></div>";
        if (aObj.ISBN != "") detailBoxHtml += "<div class=\"row\" half><a class=\"sword\">ISBN</a><p class=\"sword\">" + aObj.ISBN + "</p></div>";
        if (aObj.translator != "") detailBoxHtml += "<div class=\"row\" half><a class=\"sword\">Translator</a><p class=\"sword\">" + aObj.translator + "</p></div>";
        var usrcls = starClassList[aObj.evanum];
        var usrwd = aObj.empty_eva ? "No rating yet" : evaWordList[aObj.evanum];
        var usreva = aObj.empty_eva ? "(None)" : (aObj.evanum / 2).toFixed(1);
        var dlvAddr = aObj.udlvinfo.address;
        var tel = aObj.udlvinfo.phone_number;
        var email = aObj.email;
        var sch = aObj.udlvinfo.sch_allow ? "Allow" : "Not available";
        var schHTML = "";
        if (aObj.udlvinfo.sch_allow) schHTML = "<div class=\"row\" half><a class=\"sword\">School delivery address</a><p class=\"sword\">" + aObj.udlvinfo.sch + "</p></div>";
        var sdays = aObj.udlvinfo.sdays ? "<div class=\"row\" half><a class=\"sword\" green-white>Seven days no reason return</a></div>" : "";
        var qua = aObj.quality.quality_value;
        var qua = Math.round(qua * 20) * 5;
        var fsStr = "";
        if (qua >= 1) {
            fsStr = "Brand new";
        } else {
            qua = Math.round(qua * 20) * 5;
            var f = parseInt(qua / 10);
            var s = qua % 10;
            var fsStr = f + "Success";
            if (s != 0) fsStr += s;
            fsStr += "new";
        }
        var imgHTML = "";
        var imgPath = aObj.images.Path;
        for (imgkey in aObj.images.Images) {
            var imgName = aObj.images.Images[imgkey];
            imgHTML += "<img src=\"Image/apply/" + imgPath + "/" + imgName + "\">";
        }
        var evaHtml = aObj.empty_eva ? "<p style='position:relative;float:left;color:#202122;'>No evaluation yet</font>" : "";
        if (!aObj.empty_eva) {
            var aplEva = aObj["evaluations"];
            var usrid = aObj["evaluations"][0]["usrid"];
            for (x = 0; x < aplEva.length; x++) {
                var com = decodeURI(aplEva[x]["contents"]);
                if (com == "") com = "(This user has not written any evaluation content)";
                var usrname2 = aplEva[x]["usrname"];
                if (usrname2 == "") usrname2 = "<font style='color:#757575'>(Anonymous user)</font>";
                var evanum = parseInt(aplEva[x]["evanum"]);
                var className = starClassList[evanum];
                var starHtml = "<i class='" + className + "'></i>";
                var confirmHtml = aplEva[x]["confirmed"] == 1 ? "<font style='color:#800080;font-weight:bold'>Confirm receipt</font>" : "";
                evaHtml += "<div class=\"row\" style=\"margin-top:5px;\"><div><a class=\"sword\">" + usrname2 + "</a>" + starHtml + " " + confirmHtml + "</div><p>" + com + "</p></div>";
            }
            varTp = aObj["evaluation_page"];
            var Cp = 1;
            var Np = Cp + 1;
            var Pp = Cp - 1;
            var PagePrevAttr = Cp > 1 ? "onclick=\"showAplBookEva('" + usrid + "'," + Pp + ")\"" : "disabled";
            var PageNextAttr = Cp < Tp ? "onclick=\"showAplBookEva('" + usrid + "'," + Np + ")\"" : "disabled";
            var PageLastAttr = Cp < Tp ? "onclick=\"showAplBookEva('" + usrid + "'," + Tp + ")\"" : "disabled";
            evaHtml += "<div class=\"row\" page style=\"margin-top: 10px\"><a " + PagePrevAttr + ">Previous page</a><a style=\"color:#202122\">Page 1 of " + Tp + " pages</a><a " + PageNextAttr + ">Next page</a>&nbsp;<a " + PageLastAttr + ">Go to the last page</a></div>";
            evaHtml = "<div class='evaluation' id='evaluation0'>" + evaHtml + "</div>";
        }
        detailBoxHtml += "<div class=\"line\" style=\"margin-top: 0px;\"></div><div class=\"row\" half><a class=\"sword\">Supplier</a><p class=\"sword\">" + aObj.udlvinfo.name + "</p><a><i class=\"" + usrcls + "\"></i>&nbsp;" + usreva + "分 " + usrwd + "</a></div><div class=\"row\" half><a class=\"sword\">Shipping address</a><p class=\"sword\">" + dlvAddr + "</p></div><div class=\"row\" half><a class=\"sword\">Same school delivery</a><p class=\"sword\">" + sch + "</p></div>" + schHTML + sdays + "<div class=\"row\" half><a class=\"sword\">Condition</a><p class=\"sword\">" + fsStr + "</p></div><div class=\"row\" half><a class=\"sword\">Contact - Phone</p><a class=\"sword\">" + tel + "</a></div><div class=\"row\" half><a class=\"sword\">Contact - Email</p><a class=\"sword\">" + email + "</a></div><div class=\"row\" style=\"line-height: normal;margin-bottom:0\"><p class=\"sword\">Actual pictures&nbsp;<a href=\"javascript:;\" onclick=\"showApplyPicture('" + aplid + "')\">View book pictures and details</a>&nbsp;<a href=\"javascript:;\" style=\"color:#800080\" onclick=\"reportAbuse('" + aObj.email + "'," + aplid + ")\">Complaint about the merchant</a></p><div class=\"_all_image\" style=\"width:99.5%;margin-top: 0px;float: right;\"><div class=\"_images_con2\" onclick=\"showApplyPicture(" + aplid + ")\">" + imgHTML + "</div></div></div><div class=\"line\" style=\"margin-top: 0px;\"></div><div class=\"row\"><a class=\"sword\" style='margin-left:0'>Customer evaluation of suppliers</a><p class=\"sword\">" + aObj.udlvinfo.name + "</p></div>" + evaHtml + "</div>";
        detailBoxHtml += "</td></tr>";
        //buyer
        var detailBoxHtml2 = "<tr detailbox><td colspan=\"6\" class=\"whiteboard\" style=\"background-color:white\"><div class=\"whiteboard\">" + addHtml + "<div class=\"row\" half><a class=\"sword\">Language</a><p class=\"sword\">" + aObj.lang + "</p></div><div class=\"row\" half><a class=\"sword\">Publishing Company</a><p class=\"sword\">" + aObj.publish + "</p></div>";
        detailBoxHtml2 += "<div class=\"row\" half><a class=\"sword\">Book pages</a><p class=\"sword\">" + aObj.quality.pages + "</p></div>";
        if (aObj.ISBN != "") detailBoxHtml2 += "<div class=\"row\" half><a class=\"sword\">ISBN</a><p class=\"sword\">" + aObj.ISBN + "</p></div>";
        if (aObj.translator != "") detailBoxHtml2 += "<div class=\"row\" half><a class=\"sword\">Translator</a><p class=\"sword\">" + aObj.translator + "</p></div>";
        dlvAddr = bObj.address;
        tel = bObj.tele;
        email = bObj.email;
        var imgHTML = "";
        var imgPath = aObj.images.Path;
        for (imgkey in aObj.images.Images) {
            var imgName = aObj.images.Images[imgkey];
            imgHTML += "<img src=\"Image/apply/" + imgPath + "/" + imgName + "\">";
        }
        detailBoxHtml2 += "<div class=\"line\" style=\"margin-top: 0px;\"></div><div class=\"row\" half><a class=\"sword\">Buyer's Name</a><p class=\"sword\">" + bObj.name + "</p></div><div class=\"row\" half><a class=\"sword\">Shipping Address</a><p class=\"sword\">" + dlvAddr + "</p></div><div class=\"row\" half><a class=\"sword\">Contact Information - Phone</p><a class=\"sword\">" + tel + "</a></div><div class=\"row\" half><a class=\"sword\">Contact Information - Email</p><a class=\"sword\">" + email + "</a></div><div class=\"row\" style=\"line-height: normal;margin-bottom:0\"><p class=\"sword\">Actual Picture&nbsp;<a href=\"javascript:;\" onclick=\"showApplyPicture('" + aplid + "')\">View the book pictures and details</a></p><div class=\"_all_image\" style=\"width:99.5%;margin-top: 0px;float: right;\"><div class=\"_images_con2\" onclick=\"showApplyPicture(" + aplid + ")\">" + imgHTML + "</div></div></div><div class=\"line\" style=\"margin-top: 0px;\"></div><div class=\"row\"><a class=\"sword\" style='margin-left:0'>Customer evaluation of suppliers</a><p class=\"sword\">" + aObj.udlvinfo.name + "</p></div>" + evaHtml;
        detailBoxHtml2 += "</td></tr>";
        //table 
        for (var i = 0; i < trpc.length; i++) {
            if (trpc[i].hasAttribute("selected")) {
                if (trpc[i].getAttribute("selected") == "true") {
                    trpc[i].removeAttribute("selected");
                    trpc[i].children[0].children[0].removeAttribute("checked");
                    if (trpc[i + 1].hasAttribute("detailbox")) {
                        trpc[i + 1].outerHTML = "";
                        tr = obj.parentElement.parentElement;
                        trpc = tr.parentElement.children;
                        tri = in_array(trpc, tr);
                    }
                }
            }
        }
        tr.setAttribute("selected", "true");
        tr.children[0].children[0].setAttribute("checked", "");
        var trinHtml = "";
        for (var i = tri + 1; i < trpc.length; i++) {
            trinHtml += trpc[i].outerHTML;
        }
        for (var i = trpc.length - 1; i > tri; i--) {
            trpc[i].outerHTML = "";
        }
        tr.parentElement.innerHTML += opt == null ? detailBoxHtml + trinHtml : detailBoxHtml2 + trinHtml;
        var node = trpc[tri + 1].children[0].children[0];
        node.style.height = "auto";
        window.setTimeout(function () {
            var autoh = node.getClientRects()[0].height;
            node.style.height = "0px";
            node.style.transition = "height 0.5s ease 0s";
            window.setTimeout(function () {
                node.style.height = autoh + "px";
                window.setTimeout(function () {
                    node.style.height = "auto";
                }, 200);
            }, 1);
        }, 10);
    }, function () {
        badNet();
    });
}

function getOptionTime(sel) {
    for (var i = 0; i < sel.children.length; i++) {
        if (i == sel.selectedIndex) {
            sel.children[i].setAttribute("selected", "");
        } else {
            sel.children[i].removeAttribute("selected");
        }
    }
    var opt = sel.selectedIndex;
    var minusT = 0;
    if (opt == 0) {
        minusT = 3 * 30 * 24 * 60 * 60;
    } else if (opt == 1) {
        minusT = 6 * 30 * 24 * 60 * 60;
    } else if (opt == 2) {
        minusT = 365 * 24 * 60 * 60;
    } else if (opt == 3) {
        minusT = parseInt(new Date().getTime() / 1000);
    }
    var nowPhpT = parseInt(new Date().getTime() / 1000);
    var tp = nowPhpT - minusT;

    return tp;
}

function showBuyOrder(obj, sta, page, time, hideCan) {
    if (typeof hideCan == "undefined") {
        hideCan = global_hideCan1;
    }
    var clearTable = function () {
        var table = document.getElementById("buy_item_table");
        table.children[1].innerHTML = "";
    }
    var selControl = function (sel, index) {
        for (var i = 0; i < sel.children.length; i++) {
            if (i == index) {
                sel.children[i].setAttribute("selected", "");
            } else {
                sel.children[i].removeAttribute("selected");
            }
        }
    }
    var toTwo = function (n) {
        var nStr = n.toString();
        if (nStr.length == 1) {
            return "0" + nStr;
        } else {
            return nStr;
        }
    }
    var getCnDate = function (date) {
        var dat = new Date(date * 1000);
        var month = dat.getMonth() + 1;
        return dat.getFullYear() + "year" + month + "month" + dat.getDate() + "日" + " " + toTwo(dat.getHours()) + ":" + toTwo(dat.getMinutes()) + ":" + toTwo(dat.getSeconds());
    }
    if (typeof usr.usrid == "undefined") return;
    if (usr.usrid == "") return;
    if (page == null) page = 1;
    if (time == null) time = 0;
    if (time == 0) selControl(document.getElementById("select1"), 3);
    if (obj === null) {
        var cns = buyOrderSta;
        if (buyOrderSta == -1) {
            cns = 0;
            sta = "";
        } else {
            sta = buyOrderSta;
            cns = sta + 1;
        }
        obj = document.getElementById("buyOrderCon").children[1].children[cns].children[0];
    } else {
        if (typeof sta === "undefined") {
            sta = "";
            buyOrderSta = -1;
        } else if (sta === null || sta === "") {
            sta = "";
            buyOrderSta = -1;
        } else {
            buyOrderSta = sta;
        }
    }
    var table = document.getElementById("buy_item_table");
    var emptyRowHtml = "<td colspan=\"6\" style=\"text-align: center;background-color: #f2f4f6;\">(No order)</td>";
    var waitRowHtml = "<td colspan=\"6\" style=\"text-align: center;background-color: #f2f4f6;\"><span class=\"bottomA\"></span></td>";
    var retryRowHtml = "<td colspan=\"6\" style=\"text-align: center;background-color: #f2f4f6;\">No network connection, <a class='retry'>Click here to retry</a>.</td>";
    //wait
    clearTable();
    table.children[1].innerHTML += waitRowHtml;
    //afterward
    var c = obj.parentElement.parentElement.children;
    var i = in_array(c, obj.parentElement);
    for (var x = 0; x < c.length; x++) {
        if (i == x) {
            c[x].setAttribute("selected", "");
            c[x].children[0].removeAttribute("tab");
            c[x].children[0].setAttribute("tab-selected", "");
        } else {
            c[x].removeAttribute("selected");
            c[x].children[0].removeAttribute("tab-selected");
            c[x].children[0].setAttribute("tab", "")
        }
    }
    page = page - 1;
    newXMLHttpRequest("POST", ".phtml/deliver.php", "key=getToUsrDlv&toUsrid=" + usr.usrid + "&sta=" + sta + "&page=" + page + "&time=" + time, function (rspt) {
        var data = JSON.parse(rspt);
        clearTable();
        var date = "";
        var hideCount = 0;
        for (var x = 0; x < data.rlen; x++) {
            if (data[x]["status"] == -1) hideCount++;
            if (hideCan == null && data[x]["status"] == -1) continue;
            var idate = data[x]["date"];
            var dateObj = new Date(idate * 1000);
            var month = dateObj.getMonth() + 1;
            var cdate = dateObj.getFullYear() + "_" + month + "_" + dateObj.getDate();
            if (cdate != date) {
                var dateStr = dateObj.getFullYear() + "year" + month + "month" + dateObj.getDate() + "day";
                table.children[1].innerHTML += "<td colspan=\"6\" style=\"text-align: center;background-color: #0366d6;color:#fff;padding:3px 0\">Order time: " + dateStr + "</td>";
                date = cdate;
            }
            var bookid = data[x]["bookid"];
            var bookname = data[x]["names"];
            var bookAuthor = data[x]["author"][0];
            var bookAurLink = data[x]["authorLink"][0];
            var bookAuthorHtml = bookAurLink == "" ? bookAuthor : "<a xhr href=\"?author/" + bookAurLink + "\">" + bookAuthor + "</a>";
            if (data[x]["author"].length > 1) bookAuthorHtml += "etc.";
            var lang = data[x]["aplinfo"]["lang"];
            var dlvid = data[x]["dlvid"];
            var dlvonclick = data[x]["status"] == -1 ? "disabled" : "onclick=\"selectDlvApl(" + dlvid + ",this)\"";
            var comj = data[x]["evaid"] == "" || data[x]["evaid"].indexOf("auto_") >= 0;
            var comonclick = comj ? "onclick='comment(" + dlvid + ")'" : "";
            var comstyle = comj ? "" : "style='color:#757575'";
            var comstr = comj ? "Evaluation" : "Evaluated";
            var buyConfirm = "onclick=\"buyConfirm(" + dlvid + ")\"";
            var name = data[x]["aplinfo"]["usrid"] != "SPECIAL" ? data[x]["aplinfo"]["udlvinfo"]["name"] : "DeBook Official";
            staHtml = "";
            cmdHtml = "";
            if (data[x]["status"] == -1) {
                staHtml = "Cancelled";
                cmdHtml = "<a style='color:#757575'>Cancelled</a>";
            } else if (data[x]["status"] == 0) {
                staHtml = "Waiting for payment & delivery";
                cmdHtml = "<a onclick='cancelOrder(" + dlvid + ")'>Cancel order</a><br/><a " + dlvonclick + ">View details</a>";
            } else if (data[x]["status"] == 1) {
                staHtml = "Waiting for receipt";
                cmdHtml = "<a " + buyConfirm + ">Confirm receipt</a><br/><a " + dlvonclick + ">View details</a>";
            } else if (data[x]["status"] == 2) {
                staHtml = "Completed";
                cmdHtml = "<a " + comstyle + " " + comonclick + ">" + comstr + "</a>|<a onclick='returnOrder(" + dlvid + ")'>Apply for return</a><br/><a " + dlvonclick + ">View details</a>";
            } else if (data[x]["status"] == 3) {
                if (data[x].returnStatus == 0) {
                    staHtml = "Return application in progress";
                    cmdHtml = "<a onclick='canReturnOrder(" + dlvid + ")'>Cancel return</a><br/><a " + dlvonclick + ">View details</a>";
                } else if (data[x].returnStatus == 1) {
                    staHtml = "Return in progress";
                    cmdHtml = "<a style='color:#757575'>Processing return</a><br/><a " + dlvonclick + ">View details</a>";
                } else if (data[x].returnStatus == 2) {
                    staHtml = "Return in progress";
                    cmdHtml = "<a onclick='cfmPayback(" + dlvid + "," + data[x]["aplinfo"]["price"] + ")'>Confirm seller refund</a><br/><a " + dlvonclick + ">View details</a>";
                } else if (data[x].returnStatus == 3) {
                    staHtml = "Return completed";
                    cmdHtml = "<a " + dlvonclick + ">View details</a>";
                }
            }
            var ostyle = data[x]["status"] == -1 ? "disabled style='background-color:#e0e0e0;color:#757575'" : "";
            table.children[1].innerHTML += "<tr " + ostyle + "><td><input type=\"checkbox\" class=\"asbox\" type=\"checkbox\" " + dlvonclick + "><span></span></td><td><a class=\"contact\">" + name + "</a></td><td>" + getCnDate(data[x]["date"]) + "</td><td>" + staHtml + "</td><td>" + cmdHtml + "</td></tr>";
        }
        if (data.rlen - hideCount == 0 && hideCan == null || data.rlen == 0 && hideCan != null) table.children[1].innerHTML += emptyRowHtml;
        var buyTp = parseInt(data.len / 10);
        buyTp += parseInt(data.len) % 10 == 0 ? 0 : 1;
        var buyCp = page + 1;
        var buyNp = buyCp + 1;
        var buyPp = buyCp - 1;
        var buyPagePrevAttr = buyCp > 1 ? "onclick='showBuyOrder(null,null," + buyPp + "," + time + ")'" : "disabled";
        var buyPageNextAttr = buyCp < buyTp ? "onclick='showBuyOrder(null,null," + buyNp + "," + time + ")'" : "disabled";
        var pageCon = document.getElementById("buyOrderCon");
        pageCon = pageCon.children[pageCon.childElementCount - 1];
        var lastChildHtml = pageCon.children[pageCon.children.length - 1].outerHTML;
        var hideCountHtml = hideCan == null ? "<a onclick=\"showBuyOrder(null,null,null,null,1);\">Show canceled " + hideCount + " orders</a>" : "<a onclick=\"showBuyOrder(null,null,null,null,null);\">Hide canceled " + hideCount + " orders</a>";
        if (buyOrderSta !== -1) {
            hideCountHtml = "";
        }
        pageCon.innerHTML = "<a " + buyPagePrevAttr + ">Previous page</a><a style=\"color:#202122\">Page " + buyCp + " of " + buyTp + " pages</a><a " + buyPageNextAttr + ">Next page</a>" + hideCountHtml + lastChildHtml;
        global_hideCan1 = hideCan;
        initAllLink();
    }, function () {
        badNet();
        clearTable();
        table.children[1].innerHTML += retryRowHtml;
        var cn = sta + 1;
        if (sta == "") cn = 0;
        table.getElementsByClassName("retry")[0].setAttribute("onclick", "showBuyOrder(this.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children[" + cn + "].children[0]," + sta + "," + page + 1 + "," + time + ")")
    });
}

function showSellOrder(obj, sta, page, time, hideCan) {
    if (typeof hideCan == "undefined") {
        hideCan = global_hideCan2;
    }
    var clearTable = function () {
        var table = document.getElementById("sell_item_table");
        table.children[1].innerHTML = "";
    }
    var selControl = function (sel, index) {
        for (var i = 0; i < sel.children.length; i++) {
            if (i == index) {
                sel.children[i].setAttribute("selected", "");
            } else {
                sel.children[i].removeAttribute("selected");
            }
        }
    }
    var toTwo = function (n) {
        var nStr = n.toString();
        if (nStr.length == 1) {
            return "0" + nStr;
        } else {
            return nStr;
        }
    }
    var getCnDate = function (date) {
        var dat = new Date(date * 1000);
        var month = dat.getMonth() + 1;
        return dat.getFullYear() + "year" + month + "month" + dat.getDate() + "日" + " " + toTwo(dat.getHours()) + ":" + toTwo(dat.getMinutes()) + ":" + toTwo(dat.getSeconds());
    }
    if (typeof usr.usrid == "undefined") return; if (usr.usrid == "") return;
    if (page == null) page = 1;
    if (time == null) time = 0;
    if (time == 0) selControl(document.getElementById("select2"), 3);
    if (obj === null) {
        var cns = sellOrderSta;
        if (sellOrderSta == -1) {
            cns = 0;
            sta = "";
        } else {
            sta = sellOrderSta;
            cns = sta + 1;
        }
        obj = document.getElementById("sellOrderCon").children[1].children[cns].children[0];
    } else {
        if (typeof sta === "undefined") {
            sta = "";
            sellOrderSta = -1;
        } else if (sta === null || sta === "") {
            sta = "";
            sellOrderSta = -1;
        } else {
            sellOrderSta = sta;
        }
    }
    var table = document.getElementById("sell_item_table");
    var emptyRowHtml = "<td colspan=\"6\" style=\"text-align: center;background-color: #f2f4f6;\">(no order)</td>";
    var waitRowHtml = "<td colspan=\"6\" style=\"text-align: center;background-color: #f2f4f6;\"><span class=\"bottomA\"></span></td>";
    var retryRowHtml = "<td colspan=\"6\" style=\"text-align: center;background-color: #f2f4f6;\">No network connection, <a class='retry'>click here to retry</a>. </td>";
    //wait 
    clearTable();
    table.children[1].innerHTML += waitRowHtml;
    //afterward 
    var c = obj.parentElement.parentElement.children;
    var i = in_array(c, obj.parentElement);
    for (var x = 0; x < c.length; x++) {
        if (i == x) {
            c[x].setAttribute("selected", "");
            c[x].children[0].removeAttribute("tab");
            c[x].children[0].setAttribute("tab-selected", "");
        } else {
            c[x].removeAttribute("selected");
            c[x].children[0].removeAttribute("tab-selected");
            c[x].children[0].setAttribute("tab", "")
        }
    }
    page = page - 1; newXMLHttpRequest("POST", ".phtml/deliver.php", "key=getFromUsrDlv&fromUsrid=" + usr.usrid + "&sta=" + sta + "&page=" + page + "&time=" + time, function (rspt) {
        var data = JSON.parse(rspt);
        clearTable();
        var date = "";
        var hideCount = 0;
        for (var x = 0; x < data.rlen; x++) {
            if (data[x]["status"] == -1) hideCount++;
            if (hideCan == null && data[x]["status"] == -1) continue;
            var idate = data[x]["date"];
            var dateObj = new Date(idate * 1000);
            var month = dateObj.getMonth() + 1;
            var cdate = dateObj.getFullYear() + "_" + month + "_" + dateObj.getDate();
            if (cdate != date) {
                var dateStr = dateObj.getFullYear() + "year" + month + "month" + dateObj.getDate() + "day";
                table.children[1].innerHTML += "<td colspan=\"6\" style=\"text-align: center;background-color: #0366d6;color:#fff;padding:3px 0\">Order time: " + dateStr + "</td>";
                date = cdate;
            }
            var bookid = data[x]["bookid"];
            var bookname = data[x]["names"];
            var bookAuthor = data[x]["author"][0];
            var bookAurLink = data[x]["authorLink"][0];
            var bookAuthorHtml = bookAurLink == "" ? bookAuthor : "<a xhr href=\"?author/" + bookAurLink + "\">" + bookAuthor + "</a>";
            if (data[x]["author"].length > 1) bookAuthorHtml += "etc.";
            var lang = data[x]["aplinfo"]["lang"];
            var dlvid = data[x]["dlvid"];
            var dlvonclick = data[x]["status"] == -1 ? "disabled" : "onclick=\"selectDlvApl(" + dlvid + ",this,1)\"";
            var name = decodeInfo(data[x]["rcpt_info"])["name"];
            staHtml = "";
            cmdHtml = "";
            if (data[x]["status"] == -1) {
                staHtml = "Cancelled";
                cmdHtml = "<a style='color:#757575'>Cancelled</a>";
            } else if (data[x]["status"] == 0) {
                staHtml = "Waiting for payment & delivery";
                cmdHtml = "<a onclick=\"setDlvUID(" + dlvid + ")\">Confirm delivery</a>|<a onclick='cancelOrder(" + dlvid + ")'>Cancel order</a><br/><a " + dlvonclick + ">ViewDetails</a>";
            } else if (data[x]["status"] == 1) {
                staHtml = "Waiting for receipt";
                cmdHtml = "<a style='color:#757575'>Waiting for buyer confirmation</a><br/><a " + dlvonclick + ">View details</a>";
            } else if (data[x]["status"] == 2) {
                staHtml = "Completed";
                cmdHtml = "<a " + dlvonclick + ">View details</a>";
            } else if (data[x]["status"] == 3) {
                if (data[x].returnStatus == 0) {
                    staHtml = "Return application in progress";
                    cmdHtml = "<a onclick='cfmReturnOrder(" + dlvid + ")'>Confirm return</a>|<a onclick='canReturnOrder(" + dlvid + ")'>Reject return</a><br/><a " + dlvonclick + ">View details</a>";
                } else if (data[x].returnStatus == 1) {
                    staHtml = "Returning";
                    cmdHtml = "<a onclick='cfmRcvRtnOrder(" + dlvid + ")'>Confirm receipt</a><br/><a " + dlvonclick + ">View details</a>";
                } else if (data[x].returnStatus == 2) {
                    staHtml = "Returning";
                    cmdHtml = "<a style='color:#757575'>Processing refund</a><br/><a " + dlvonclick + ">View details</a>";
                } else if (data[x].returnStatus == 3) {
                    staHtml = "Return completed";
                    cmdHtml = "<a " + dlvonclick + ">View details</a>";
                }
            }
            var ostyle = data[x]["status"] == -1 ? "disabled style='background-color:#e0e0e0;color:#757575'" : "";
            table.children[1].innerHTML += "<tr " + ostyle + "><td><input type=\"checkbox\" class=\"asbox\" type=\"checkbox\" " + dlvonclick + "><span></span></td><td><a xhr href=\"?book/" + bookid + "\">" + bookname + "</a>(" + lang + ")&nbsp;" + bookAuthorHtml + "(著)</td><td><a class=\"contact\">" + name + "</a></td><td>" + getCnDate(data[x]["date"]) + "</td><td>" + staHtml + "</td><td>" + cmdHtml + "</td></tr>";
        }
        if (data.rlen - hideCount == 0 && hideCan == null || data.rlen == 0 && hideCan != null) table.children[1].innerHTML += emptyRowHtml;
        var sellTp = parseInt(data.len / 10);
        sellTp += parseInt(data.len) % 10 == 0 ? 0 : 1;
        var sellCp = page + 1;
        var sellNp = sellCp + 1;
        var sellPp = sellCp - 1;
        var sellPagePrevAttr = sellCp > 1 ? "onclick='showSellOrder(null,null," + sellPp + "," + time + ")'" : "disabled";
        var sellPageNextAttr = sellCp < sellTp ? "onclick='showSellOrder(null,null," + sellNp + "," + time + ")'" : "disabled";
        var pageCon = document.getElementById("sellOrderCon");
        pageCon = pageCon.children[pageCon.childElementCount - 1];
        var lastChildHtml = pageCon.children[pageCon.children.length - 1].outerHTML;
        var hideCountHtml = hideCan == null ? "<a onclick=\"showSellOrder(null,null,null,null,1);\">Show canceled " + hideCount + " orders</a>" : "<a onclick=\"showSellOrder(null,null,null,null,null);\">Hide canceled " + hideCount + " orders</a>";
        if (sellOrderSta !== -1) {
            hideCountHtml = "";
        }
        pageCon.innerHTML = "<a " + sellPagePrevAttr + ">Previous page</a><a style=\"color:#202122\">Page " + sellCp + " of " + sellTp + " pages</a><a " + sellPageNextAttr + ">Next page</a>" + hideCountHtml + lastChildHtml;
        global_hideCan2 = hideCan;
        initAllLink();
    }, function () {
        badNet();
        clearTable();
        table.children[1].innerHTML += retryRowHtml;
        var cn = sta + 1;
        if (sta == "") cn = 0;
        table.getElementsByClassName("retry")[0].setAttribute("onclick", "showSellOrder(this.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children[" + cn + "].children[0]," + sta + "," + page + 1 + "," + time + ")")
    });
}

function showTrsinfo(usrid, page) {
    var con = document.getElementById("trsinfo")
    var dom = con.getElementsByTagName("table")[0].children[0];
    var clearTable = function () {
        for (var i = dom.children.length - 1; i > 0; i--) {
            dom.children[i].outerHTML = "";
        }
    }
    var getCnDate = function (date) {
        var dat = new Date(date * 1000);
        var month = dat.getMonth() + 1;
        return dat.getFullYear() + "year" + month + "month" + dat.getDate() + "日" + " " + toTwo(dat.getHours()) + ":" + toTwo(dat.getMinutes()) + ":" + toTwo(dat.getSeconds());
    }
    var toTwo = function (n) {
        var nStr = n.toString();
        if (nStr.length == 1) {
            return "0" + nStr;
        } else {
            return nStr;
        }
    }
    var waitSpan = "<td colspan=\"6\" style=\"text-align: center;background-color: #f2f4f6;\"><span class='bottomA' style='width:100%;'></span></td>"; var internetSpan = "<td colspan=\"\" style=\"text-align: center;background-color: #f2f4f6;\>No network connection, try <a style='float:none' onclick='showTrsinfo('" + usrid + "'," + page + ")'>Reload</a>. </td>";
    var noSpan = "<td colspan=\"\" style=\"text-align: center;background-color: #f2f4f6;\>(No payment record)</td>";
    clearTable();
    dom.innerHTML += waitSpan;
    var rpage = page - 1;
    newXMLHttpRequest("POST", ".phtml/deliver.php", "key=getTransaction&id=" + usrid + "&page=" + rpage, function (rspt) {
        clearTable();
        var data = JSON.parse(rspt);
        var trans = data["trans"];
        var c = 0;
        for (i = 0; i < trans.length; i++) {
            var contents = decodeURI(trans[i]["content"]);
            var value = trans[i]["value"];
            if (!trans[i]["toUsrid"] == usr["usrid"]) value *= -1;
            value = parseFloat(value).toFixed(2);
            var mdate = getCnDate(trans[i]["date"]);
            var type = trans[i]["toUsrid"] == usr["usrid"] ? "receipt" : "payment";
            dom.innerHTML += "<tr><td><input type=\"checkbox\" class=\"asbox\" onclick=\"edSelect(this)\"><span style=\"top:3px\"></span></td><td>" + contents + "</td><td style=\"width:140px\">" + type + "</td><td style=\"width:140px\">" + value + "</td><td style=\"width:390px\">" + mdate + "</td><td style=\"width:100px\"><font style='color:#757575'>(No operation available)</font></td></tr>";
            c++;
        }
        if (c == 0) dom.innerHTML += noSpan;
        //page control 
        var Tp = data["page_count"];
        var Cp = page;
        var Np = Cp + 1;
        var Pp = Cp - 1;
        var PagePrevAttr = Cp > 1 ? "onclick=\"showTrsinfo('" + usrid + "'," + Pp + ")\"" : "disabled";
        var PageNextAttr = Cp < Tp ? "onclick=\"showTrsinfo('" + usrid + "'," + Np + ")\"" : "disabled";
        var cc = con.children;
        cc[cc.length - 1].outerHTML = "<div class=\"line\" style=\"margin: 0 0 10px 0;\"><a " + PagePrevAttr + ">Previous page</a><a style=\"color:#202122\">Page " + page + " of " + Tp + " pages</a><a " + PageNextAttr + ">Next page</a></div>";
    }, function () {
        dom.innerHTML += internetSpan;
        badNet();
    });
}

function setDlvUID(dlvid) {
    newXMLHttpRequest("POST", ".phtml/deliver.php", "key=setDlvUID&id=" + dlvid, function (rspt) {
        var msgbox = document.getElementsByClassName("MsgBox")[0];
        showMsgbox(msgbox, "<h3 style=\"width:100%\">DeBook order status is about to change</h3><div class='line' style='margin-top: 5px;'></div><ul style=\"padding-left:20px;width:calc(100% - 20px)\"><li>You are about to change the status of the selected product from 'pending payment & shipment' to 'pending receipt'. </li><li>The DeBook unique identification code for this order is <b>" + rspt + "</b>. Please write the DeBook unique identification code <b>correctly</b> on a piece of paper and clip the paper into any page of the book. Any (intentional or unintentional) filling errors will affect your integrity. </li><li>Do not send this identification code to the buyer. </li><li>Before pressing the confirmation button, please make sure that the buyer has paid and you have packed the goods and sent them to the designated address, otherwise please press cancel. </li><li>Once the order status is confirmed to be pending receipt, it cannot be returned to the current status! </li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>Confirm</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Cancel</a>");
        var btn = msgbox.getElementsByClassName("btn")[0];
        btn.onclick = function () {
            newXMLHttpRequest("POST", ".phtml/deliver.php", "key=updateStatus&sta=1&id=" + dlvid, function () {
                showSellOrder(null, null, null, null);
                showMsgbox(msgbox, "<h3 style=\"width:100%\">DeBook order status has changed</h3><div class='line' style='margin-top: 5px;'></div><p>You have successfully adjusted the selected order status to 'pending delivery'.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">OK</a>")
            }, function () {
                badNet();
            });
        }
    }, function () {
        badNet();
    });
}

function buyConfirm(dlvid) {
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox, "<h3 style=\"width:100%\">DeBook order status is about to change</h3><div class='line' style='margin-top: 5px;'></div><ul style=\"padding-left:20px;width:calc(100% - 20px)\"><li>You are about to change the status of the selected product from 'pending delivery' to 'completed'.</li><li>Please make sure you have received the goods before pressing the confirmation button, otherwise please press cancel.</li><li>Once the order status is confirmed to have been received, it cannot be returned to the current status!</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>Confirm</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Cancel</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    btn.onclick = function () {
        newXMLHttpRequest("POST", ".phtml/deliver.php", "key=buyConfirm&id=" + dlvid, function (rspt) {
            showBuyOrder(null, null, null, null);
            showMsgbox(msgbox, "<h3 style=\"width:100%\">DeBook order status has changed</h3><div class='line' style='margin-top: 5px;'></div><p>You have successfully adjusted the selected order status to 'completed'.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">OK</a>")
        }, function () {
            badNet();
        });
    }
}

function cancelOrder(dlvid) {
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox, "<h3 style=\"width:100%\">Confirm whether to cancel the DeBook order</h3><div class='line' style='margin-top: 5px;'></div><ul style=\"padding-left:20px;width:calc(100% - 20px)\"><li>You are about to cancel the selected product. Once the order is confirmed to be cancelled, it cannot be restored! </li><li>Please contact the other party (buyer or seller) and confirm before canceling the order. </li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>Confirm</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Cancel</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    btn.onclick = function () {
        newXMLHttpRequest("POST", ".phtml/deliver.php", "key=cancelOrder&id=" + dlvid, function (rspt) {
            showBuyOrder(null, null, null, null);
            showSellOrder(null, null, null, null);
            showMsgbox(msgbox, "<h3 style=\"width:100%\">DeBook order canceled</h3><div class='line' style='margin-top: 5px;'></div><p>You have successfully canceled the selected order.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">OK</a>")
        }, function () {
            badNet();
        });
    }
}

function comment(dlvid) {
    var uid = "";
    var confirmed = 0;
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    var filterStr = function (str) {
        while (str.indexOf("-") >= 0) {
            str = str.replace("-", "");
        }
        return str;
    }
    showMsgbox(msgbox, "<h3 style=\"width:100%\">Enter DeBook unique identification code</h3><p>Enter DeBook unique identification code to confirm that you have received the merchant's goods.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><div class=\"asbox_con\" style=\"width:98.4%;background-color:#fff\"><p>&nbsp;DeBook unique identification code</p><input class=\"asbox\" onfocus=\"boxstyle(this.parentElement,1)\" onblur=\"boxstyle(this.parentElement,0)\" placeholder=\"DeBook unique identification code\" autocomplete=\"off\"></div><div class=\"line\" style=\"margin-top: 5px;\"></div><a id='nouid' style='margin-top:1px' href='javascript:;'>Skip</a><a class=\"btn\" right>Confirm</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Cancel</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    var btn2 = document.getElementById("nouid");
    var input = msgbox.getElementsByTagName("input")[0];
    input.onkeydown = function (evt) {
        var e = evt || window.event;
        if (e.keyCode == 8 || e.keyCode >= 35 && e.keyCode <= 40 || e.ctrlKey || e.altKey || e.shiftKey) {
        } else if (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 97 && e.keyCode <= 122 || e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 189) {
            this.value += e.key.toLocaleUpperCase();
            return false;
        } else if (e.keyCode == 10 || e.keyCode == 13) {
            btn.onclick();
        } else {
            return false;
        }
    }
    btn2.onclick = function () {
        run();
    }
    var run = function () {
        hideTooltip();
        var real_index = 0;
        showMsgbox(msgbox, "<h3 style=\"width:100%\">Please rate the product you purchased</h3><p>Your rating <a id='msgEvaNum' style='float:none'>0.0</a></p><div class='starContainer' style='margin:5px 0'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><p>Fill in the content to be rated</p><div class='line' style='margin-top: 5px;'></div><div class=\"asbox_con\"><textarea style=\"font-family:consolas;min-height:180px;\" onfocus=\"boxstyle(this.parentElement,1)\" onblur=\"boxstyle(this.parentElement,0)\" placeholder=\"Review content (can be left blank)\" autocomplete=\"off\"></textarea></div><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>Confirm</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Cancel</a>");
        var btn = msgbox.getElementsByClassName("btn")[0];
        initStarContainer(msgbox.getElementsByClassName("starContainer")[0], function (index) {
            var textarea = msgbox.getElementsByTagName("textarea")[0];
            real_index = index + 1;
            document.getElementById("msgEvaNum").innerHTML = (real_index / 2).toFixed(1);
            msgbox.getElementsByClassName("starContainer")[0].setAttribute("value", real_index);
            if (real_index < 8) {
                textarea.setAttribute("placeholder", "evaluation content (a 20-word text comment must be given when the rating is less than 4 stars)");
            } else {
                textarea.setAttribute("placeholder", "evaluation content (can be left blank)");
            }
        });
        btn.onclick = function () {
            var textarea = msgbox.getElementsByTagName("textarea")[0];
            var comments = textarea.value;
            if (real_index < 8 && comments.length < 20) {
                shakeBox(textarea, "leftRight", 4, 100, 20);
                textarea.setAttribute('tips', '<font size="4" err>When the rating is less than 4 stars, a 20-word text comment is required.</font>');
                mx = textarea.getClientRects()[0].left;
                my = textarea.getClientRects()[0].top + 20;
                showTooltip(textarea);
                btn.innerText = "Try again";
                return;
            } else {
                hideTooltip();
                comments = encodeURI(comments);
                newXMLHttpRequest("POST", ".phtml/deliver.php", "key=comment&id=" + dlvid + "&comments=" + comments + "&num=" + real_index + "&confirmed=" + confirmed, function (rspt) {
                    showMsgbox(msgbox, "<h3 style=\"width:100%\">Thank you for your evaluation of this product</h3><p>Thank you for your evaluation of this product.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">OK</a>");
                    showBuyOrder(null, null, null, null);
                }, function () {
                    badNet();
                });
            }
        }
    }
    btn.onclick = function () {
        uid = $.md5(filterStr(input.value));
        newXMLHttpRequest("POST", ".phtml/deliver.php", "key=getUID&id=" + dlvid, function (rspt) {
            var btn = msgbox.getElementsByClassName("btn")[0];
            if (uid != $.md5(filterStr(rspt))) {
                shakeBox(input, "leftRight", 4, 100, 20);
                input.setAttribute('tips', '<font size="4" err>DeBook unique identification code is wrong.</font>');
                mx = input.getClientRects()[0].left;
                my = input.getClientRects()[0].top + 20;
                showTooltip(input);
                window.setTimeout(function () {
                    hideTooltip();
                }, 2000); btn.innerText = "Try again";
                return;
            } else {
                hideTooltip();
                confirmed = 1;
                run();
            }
        }, function () {
            badNet();
        });
    }
}

function returnOrder(dlvid) {
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox, "<h3 style=\"width:100%\">Confirm whether to return</h3><div class='line' style='margin-top: 5px;'></div><ul style=\"padding-left:20px;width:calc(100% - 20px)\"><li>You are about to return the selected product. Please contact the seller and confirm before returning.</li><li>If you do not contact the seller and confirm, the seller may reject your return application.</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>Confirm</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Cancel</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    btn.onclick = function () {
        newXMLHttpRequest("POST", ".phtml/deliver.php", "key=returnOrder&id=" + dlvid, function (rspt) {
            showBuyOrder(null, null, null, null);
            showMsgbox(msgbox, "<h3 style=\"width:100%\">Already applied for return to the other party</h3><div class='line' style='margin-top: 5px;'></div><p>You have successfully applied for return to the other party.</p><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Okay</a>")
        }, function () {
            badNet();
        });
    }
}

function canReturnOrder(dlvid) {
    newXMLHttpRequest("POST", ".phtml/deliver.php", "key=canReturnOrder&id=" + dlvid, function (rspt) {
        showBuyOrder(null, null, null, null);
        showSellOrder(null, null, null, null);
    }, function () {
        badNet();
    });
}

function cfmReturnOrder(dlvid) {
    var msgbox = document.getElementsByClassName("MsgBox")[0]; showMsgbox(msgbox, "<h3 style=\"width:100%\">Confirm whether to agree to return</h3><div class='line' style='margin-top: 5px;'></div><ul style=\"padding-left:20px;width:calc(100% - 20px)\"><li>Please make sure your books are in the same condition as when they were shipped before agreeing to return, otherwise please cancel the return.</li><li>If you have not contacted the seller and confirmed the condition of the books, please press the 'Cancel' button.</li><li>Once you confirm that you agree to return, you cannot withdraw it!</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>Confirm</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Cancel</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    btn.onclick = function () {
        newXMLHttpRequest("POST", ".phtml/deliver.php", "key=cfmReturnOrder&id=" + dlvid, function (rspt) {
            hideMsgbox(msgbox);
            showSellOrder(null, null, null, null);
        }, function () {
            badNet();
        });
    }
}

function cfmRcvRtnOrder(dlvid) {
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox, "<h3 style=\"width:100%\">Confirm whether to take back the buyer's return</h3><div class='line' style='margin-top: 5px;'></div><ul style=\"padding-left:20px;width:calc(100% - 20px)\"><li>You are about to confirm receipt of the buyer's return. Before pressing the 'Confirm' button, please make sure that you have received the goods and confirm that the book is in the same condition as before shipment. </li><li>If you have not received the goods returned by the buyer, please press the 'Cancel' button. </li><li>Once the goods are confirmed, they cannot be returned to the unreceived state! </li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>Confirm</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Cancel</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    btn.onclick = function () {
        newXMLHttpRequest("POST", ".phtml/deliver.php", "key=cfmRcvRtnOrder&id=" + dlvid, function (rspt) {
            hideMsgbox(msgbox);
            showSellOrder(null, null, null, null);
        }, function () {
            badNet();
        });
    }
}

function cfmPayback(dlvid, price) {
    var msgbox = document.getElementsByClassName("MsgBox")[0];
    showMsgbox(msgbox, "<h3 style=\"width:100%\">Confirm whether to recover all payments</h3><div class='line' style='margin-top: 5px;'></div><ul style=\"padding-left:20px;width:calc(100% - 20px)\"><li>You are about to confirm receipt of the seller's refund. Before pressing the 'Confirm' button, please make sure that you have received the seller's refund totaling <b>￥" + price.toFixed(2) + "</b>.</li><li>If you have not received the seller's refund, or the refund amount is incorrect, please press the 'Cancel' button.</li><li>Once the payment is confirmed, it cannot be returned to the uncollected state!</li></ul><div class=\"line\" style=\"margin-top: 5px;\"></div><a class=\"btn\" right>Confirm</a><a class=\"btn\" right onclick=\"hideMsgbox(this.parentElement.parentElement)\">Cancel</a>");
    var btn = msgbox.getElementsByClassName("btn")[0];
    btn.onclick = function () {
        newXMLHttpRequest("POST", ".phtml/deliver.php", "key=cfmPayback&id=" + dlvid, function (rspt) {
            hideMsgbox(msgbox);
            showBuyOrder(null, null, null, null);
        }, function () {
            badNet();
        });
    }
}