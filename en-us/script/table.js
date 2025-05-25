function initTable(table){
    var rows = table.children[1].children;
    table.children[0].children[0].children[0].children[0].setAttribute("onclick","edSelectAll(this)");
    for(var i=0;i<rows.length;i++){
        if(rows[i].children[0].children.length>0){
            if(rows[i].children[0].children[0].type=="checkbox"){
                rows[i].children[0].children[0].setAttribute("onclick","edSelect(this)");
            }
        }
    }
}

function edSelectAll(firstInput){
    var table = firstInput.parentElement.parentElement.parentElement.parentElement;
    if(!firstInput.checked){
        deSelectAll(table);
        table.setAttribute("data",[]);
    }else{
        var d = selectAll(table);
        table.setAttribute("data",d);
    }
    resetHeadInput(table,selectedStatus(table));
}

function selectAll(table){
    var selected = [];
    var rows = table.children[1].children;
    for(var i=0;i<rows.length;i++){
        if(rows[i].children[0].children.length>0){
            rows[i].setAttribute("selected","true");
            rows[i].children[0].children[0].checked = true;
            selected[i-1] = rows[i].getAttribute("id");
        }
    }
    return selected;
}

function deSelectAll(table){
    var rows = table.children[1].children;
    for(var i=0;i<rows.length;i++){
        if(rows[i].children[0].children.length>0){
            rows[i].setAttribute("selected","false");
            rows[i].children[0].children[0].checked = false;
        }
    }
}

function edSelect(firstInput,chgCheck){
    var row = firstInput.parentElement.parentElement;
    var table = row.parentElement.parentElement;
    var index = in_array(row.parentElement.children,row);
    if(chgCheck){
        firstInput.checked = !firstInput.checked;
    }
    if(!firstInput.checked){
        deSelect(table,index);
    }else{
        select(table,index);
    }
    resetHeadInput(table,selectedStatus(table));
}

function select(table,num){
    var row = table.children[1].children[num];
    row.setAttribute("selected","true");
}

function deSelect(table,num){
    var row = table.children[1].children[num];
    row.setAttribute("selected","false");
}

function selectedStatus(table){
    var data = [];
    var status = 0; //0:no-selected,1:partial-selected,2:all-selected
    var static = 0;
    var rows = table.children[1].children;
    var total = 0;
    var x = 0;
    for(var i=0;i<rows.length;i++){
        if(rows[i].getAttribute("selected")=="true"){
            static++;
            data[x] = rows[i].getAttribute("id");
            x++;
        }
        if(rows[i].children[0].children.length>0){
            if(rows[i].children[0].children[0].type=="checkbox"){
                total++;
            }
        }
    }
    if(static==total&&total!=0){
        status = 2;
    }else if(static==0){
        status = 0;
    }else{
        status = 1;
    }
    return {"state":status,"data":data};
}

function resetHeadInput(table,d){
    var obj = table.children[0].children[0].children[0].children[0];
    switch(d["state"]){
        case 0:
            obj.checked = false;
            obj.parentElement.children[1].style.backgroundImage = "url(\"Image/fatcow/check_box_uncheck.png\")";
            break;
        case 1:
            obj.checked = false;
            obj.parentElement.children[1].style.backgroundImage = "url(\"Image/fatcow/check_box_mix.png\")";
            break;
        case 2:
            obj.checked = true;
            obj.parentElement.children[1].style.backgroundImage = "url(\"Image/fatcow/check_box.png\")";
            break;
    }
    var datastr = "";
    for(var i=0;i<d["data"].length;i++) datastr += d["data"][i]+":";
    datastr = datastr.length>0?datastr.substr(0,datastr.length-1):"";
    table.setAttribute("data",datastr);
}

//dataHandler::must be used with sql.js and msgbox
//an example structure below
/*
var structureTable = {
    localTableName:"",
    databaseTableName:"",
    tableFunction:"添加|():修改|():删除|()",//名称|函数名
    tableIdName:"",
    dataNames:[],
    dataDisplayName:[]
}
*/

var getDateStrFromInt = function(intg){
    var d = new Date(intg);
    var toDig = function(intk,len){
        var d = intk.toString();
        while(d.length<len){
            d = "0" + d;
        }
        return d;
    }
    return d.getFullYear() + "-" + toDig((d.getMonth()+1),2) + "-" + toDig(d.getDate(),2);
}

var getDateIntFromStr = function(str){
    var year = parseInt(str.split("-")[0]);
    var month = parseInt(str.split("-")[1])-1;
    var date = parseInt(str.split("-")[2]);
    var d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    d.setFullYear(year);
    d.setMonth(month);
    d.setDate(date);
    return d.getTime()/1000;
}

function showUpdateTable(structureD,msgbox,noticeHTML,changeId){
    var innerHTML = noticeHTML;
    innerHTML += "<style> div.asbox_con{margin-bottom:5px;} div.asbox_con:last-child{margin-bottom:0px;}</style>"
    innerHTML += '<div class="line" style="margin-top: 5px;"></div>';
    var dataDNs = structureD.dataDisplayName;
    var textareas = "";
    var dates = "";
    for(var val in dataDNs){
        if(structureD.dataNames[val]=="innerHTML"||structureD.dataNames[val]=="content"){
            innerHTML += '<div class="asbox_con" style="width:98.4%;"><p tips="">&nbsp;' + dataDNs[val] + '</p><textarea class="asbox" style="font-family:consolas;" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="' + dataDNs[val] + '" autocomplete="off"></textarea></div>';
            textareas += val + ":";
        }else if(structureD.dataNames[val].indexOf("date")>=0){
            innerHTML += '<div class="asbox_con" style="width:98.4%;"><p tips="">&nbsp;' + dataDNs[val] + '</p><input class="asbox" type="date" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="' + dataDNs[val] + '" autocomplete="off"></div>';
            dates += val + ":";
        }else{
            innerHTML += '<div class="asbox_con" style="width:98.4%;"><p tips="">&nbsp;' + dataDNs[val] + '</p><input class="asbox" onfocus="boxstyle(this.parentElement,1)" onblur="boxstyle(this.parentElement,0)" placeholder="' + dataDNs[val] + '" autocomplete="off"></div>';
        }
    }
    innerHTML += '<div class="line" style="margin-top: 5px;"></div>\
    <a class="btn" right onclick="hideMsgbox(this.parentElement.parentElement)">取消</a><a class="btn" right>确认</a>';
    showMsgbox(msgbox,innerHTML);
    var btn = msgbox.children[0].lastElementChild;
    var inputspar = msgbox.children[0].getElementsByClassName("asbox_con");
    var inputs = [];
    for(var i=0;i<inputspar.length;i++){
        inputs[i] = inputspar[i].children[1];
    }
    var input = inputs[inputs.length-1];
    if(changeId!=null){
        var sql = "SELECT ";
        for(var i=0;i<structureD.dataNames.length;i++){
            sql += structureD.dataNames[i] + ", ";
        }
        sql = sql.substr(0,sql.length-2);
        sql += " FROM " + structureD.databaseTableName + " WHERE " + structureD.tableIdName + "='" + changeId +"'";
        var echoSqlPath = window.location.href.indexOf("admin")>=0?"../.phtml/more/echoSql.phtml":".phtml/more/echoSql.phtml";
        newXMLHttpRequest('POST',echoSqlPath,'direct=json&sql=' + sql,function(rspt){
            var nrspt = JSON.parse(rspt);
            if(nrspt.length!=0){
                var i = 0;
                for(var key in nrspt[0]){
                    if(key=="innerHTML"||key=="content"){
                        inputs[i].value = decodeText(nrspt[0][key]);
                    }else if(key.indexOf("date")>=0){
                        inputs[i].value = getDateStrFromInt(parseInt(nrspt[0][key])*1000);
                    }else{
                        inputs[i].value = nrspt[0][key];
                    }
                    i++;
                }
            }
        },function(){});
    }
    btn.onclick = function(){
        var echoSqlPath = window.location.href.indexOf("admin")>=0?"../.phtml/more/echoSql.phtml":".phtml/more/echoSql.phtml";
        btn.innerHTML = "<span class='wait' style='position: relative;float: left;width: 17px;height: 16px;margin: 1px 4px;'></span>";
        for(var i=0;i<inputs.length;i++){
            inputs[i].setAttribute("disabled","");
        }
        if(changeId==null){
            //add
            var sql = 'INSERT INTO ' + structureD.databaseTableName + ' SET '
            for(var i=0;i<inputs.length;i++){
                var valueA = inputs[i].value;
                if(textareas.indexOf(i)>=0){
                    valueA = encodeText(inputs[i].value);
                }else if(dates.indexOf(i)>=0){
                    valueA = getDateIntFromStr(inputs[i].value);
                }
                sql += structureD.dataNames[i] + '="' + valueA + '"';
                if(i!=inputs.length-1){
                    sql += ", ";
                }
            }
            newXMLHttpRequest("POST",echoSqlPath,'sql='+sql,function(){
                newXMLHttpRequest("POST",echoSqlPath,'direct=json&sql=select max(' + structureD.tableIdName + ') from ' + structureD.databaseTableName,function(rspt){
                    var table = document.getElementById(structureD.localTableName);
                    var tableBody = table.children[1];
                    if(tableBody.children[0]!=null&&typeof tableBody.children=="undefined"){
                        if(tableBody.children[0].hasAttribute("empty")){
                            tableBody.children[0].outerHTML = "";
                        }
                    }
                    var k = JSON.parse(rspt)[0]['max(' + structureD.tableIdName + ')']
                    var shtml = '<tr id="' + k + '"><td><input type="checkbox" class="asbox" onclick="edSelect(this)"><span></span></td>';
                    for(var i=0;i<inputs.length;i++){
                        shtml += '<td  onclick=\'edSelect(this.parentElement.children[0].children[0],1)\'>' + inputs[i].value + '</td>';
                    }
                    shtml += '<td>';
                    var funcNames = structureD.tableFunction.split(":");
                    for(var i=0;i<funcNames.length;i++){
                        shtml += '<a onclick="' + funcNames[i].split("|")[1] + '(\'' + k +'\')">' + funcNames[i].split("|")[0] + '</a>';
                        if(i!=funcNames.length-1){
                            shtml += " | ";
                        }
                    }
                    shtml += '</td></tr>';
                    tableBody.innerHTML += shtml;
                    if(resize2!=null) resize2();
                    hideMsgbox(msgbox);
                },function(){
                    alert("没有连接网络，请确保联网后再试一次。");
                    btn.innerHTML = "再试一次";
                    for(var i=0;i<inputs.length;i++){
                        inputs[i].removeAttribute("disabled");
                    }
                });
            },function(){
                alert("没有连接网络，请确保联网后再试一次。");
                btn.innerHTML = "再试一次";
                for(var i=0;i<inputs.length;i++){
                    inputs[i].removeAttribute("disabled");
                }
            })
        }else{
            //update
            var sql = 'UPDATE ' + structureD.databaseTableName + ' SET '
            for(var i=0;i<inputs.length;i++){
                var valueA = inputs[i].value;
                if(textareas.indexOf(i)>=0){
                    valueA = encodeText(inputs[i].value);
                }else if(dates.indexOf(i)>=0){
                    valueA = getDateIntFromStr(inputs[i].value);
                }
                sql += structureD.dataNames[i] + '="' + valueA + '"';
                if(i!=inputs.length-1){
                    sql += ", ";
                }
            }
            sql += " WHERE " + structureD.tableIdName + '="' + changeId + '";';
            newXMLHttpRequest("POST",echoSqlPath,'sql='+sql,function(){
                var table = document.getElementById(structureD.localTableName);
                var tableBody = table.children[1];
                for(var i=0;i<tableBody.children.length;i++){
                    if(tableBody.children[i].getAttribute("id")==changeId){
                        cols = tableBody.children[i].children;
                        for(var x=1;x<cols.length-1;x++){
                            cols[x].innerHTML = inputs[x-1].value;
                        }
                    }
                }
                if(resize2!=null) resize2();
                hideMsgbox(msgbox);
            },function(){
                alert("没有连接网络，请确保联网后再试一次。");
                btn.innerHTML = "再试一次";
                for(var i=0;i<inputs.length;i++){
                    inputs[i].removeAttribute("disabled");
                }
            });
        }
    }
    if(input!=null&&typeof input!="undefined"){
        input.onkeydown = function(ev){
            var e = ev || window.event;
            if(e.keyCode==10||e.keyCode==13){
                btn.onclick();
            }
        }
    }
}

function removeTable(structureD,changeId){
    var ids = changeId.split(":");
    var sql = "DELETE FROM " + structureD.databaseTableName + " WHERE ";
    for(var i=0;i<ids.length;i++){
        sql +=  structureD.tableIdName + '="' + ids[i] + '"';
        if(i!=ids.length-1){
            sql += " or ";
        }
    }
    var echoSqlPath = window.location.href.indexOf("admin")>=0?"../.phtml/more/echoSql.phtml":".phtml/more/echoSql.phtml";
    if(showWait!=null){
        showWait();
    }
    newXMLHttpRequest("POST",echoSqlPath,'sql='+sql,function(){
        var rows = document.getElementById(structureD.localTableName).children[0].children;
        for(var i=rows.length-1;i>=0;i--){
            if(rows[i].hasAttribute("id")){
                if(changeId.indexOf(rows[i].getAttribute("id"))>=0){
                    rows[i].outerHTML = "";
                }
            }
        }
        if(hideWait!=null){
            hideWait();
        }
    },function(){
        alert("没有连接网络，请确保联网后再试一次。");
        if(hideWait!=null){
            hideWait();
        }
    });
}