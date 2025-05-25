function showMsgbox(msgbox,innerHTML){
    msgbox.style.top = "2%";
    if(innerHTML!=null){
        msgbox.children[0].innerHTML = innerHTML;
    }
}
function hideMsgbox(msgbox,delay){
    if(delay!=null){
        window.setTimeout(function(){
            msgbox.style.top = "-100%";
        },delay);
    }else{
        msgbox.style.top = "-100%";
    } hideTooltip();
}

function in_array(array,object){
    return Array.prototype.indexOf.call(array,object);
}

function tita(fn,time){
    window.setTimeout(fn, time);
}