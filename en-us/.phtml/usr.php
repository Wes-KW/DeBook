<?php
    include_once "vrfylogin.php";
    include_once "cart.php";

    function stLogin(){
        $o = getArray($_POST,"usr");
        if(strpos($o,"'")!==false) goto jump;
        $p = getArray($_POST,"pwd");
        $lt = getArray($_POST,"longt");
        //add function of checking the user has been block for login
        $errStr = "";
        $res = exeSql("SELECT pwd FROM usrinfo WHERE email='$o' or usrid='$o'");
        $dataPwd = "";
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $dataPwd = $row["pwd"];
        }
        if($dataPwd==""){
            jump:
            $errStr = "ERR_USR_NOT_FOUND";
            echo $errStr;
            return;
        }
        $pwd1 = explode(":",$dataPwd)[0];
        if($pwd1==md5($p)){
            record($o,$lt);
            loginCombineCart();
            echo "1";
            return;
        }else{
            $errStr = "ERR_NOT_AUTHORIZED";
            echo $errStr;
            return;
        }
    }

    function hasEmail(){
        $o = getArray($_POST,"email");
        if(strpos($o,"'")!==false) return 1;
        $res = exeSql("SELECT email FROM usrinfo WHERE email='$o'");
        $num = 0;
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $num++;
        }
        echo $num;
    }

    function stAdmLogin(){
        $o = getArray($_POST,"usr");
        if(strpos($o,"'")!==false) goto jump2;
        $p = getArray($_POST,"pwd");
        //add function of checking the user has been block for login
        $errStr = "";
        $res = exeSql("SELECT pwd,admStatus FROM usrinfo WHERE email='$o' or usrid='$o'");
        $dataPwd = "";
        $admSta = "";
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $dataPwd = $row["pwd"];
            $admSta = $row["admStatus"];
        }
        if($dataPwd==""){
            jump2:
            $errStr = "ERR_USR_NOT_FOUND";
            echo $errStr;
            return;
        }
        $pwd1 = explode(":",$dataPwd)[0];
        if($admSta=="1"&&$pwd1==md5($p)){
            adminRecord($o);
            echo "1";
            return;
        }else if($admSta=="0"){
            $errStr = "ERR_UNDER_PRIVILEDGE";
            echo $errStr;
            return;
        }else{
            $errStr = "ERR_NOT_AUTHORIZED";
            echo $errStr;
            return;
        }
    }

    function stSignup(){
        echo exeSql("INSERT INTO usrinfo SET ". getArray($_POST,"data"));
    }

    function stForget($code){
        $browser = browse_info();
        if(vrfyEC($code)===false&&getPhpUser()===null) return "ERR_EC_NOT_AUTHORIZED";
        $usr = getArray($_POST,"ue");
        if(strpos($usr,"'")!==false) return "ERR_EC_NOT_AUTHORIZED";
        $pwd = getArray($_POST,"pwd");
        setSession("pwd_changed","1");
        exeSql("UPDATE usrinfo SET pwd='$pwd' where email='$usr' or usrid='$usr'");
        setSession("ec_db_$browser","");
    }

    function getPwd(){
        $usr = getArray($_POST,"ue");
        $res = exeSql("SELECT pwd FROM usrinfo WHERE email='$usr' or usrid='$usr'");
        $arr = array();
        while($row = mysqli_fetch_array($res,MYSQLI_ASSOC)){
            array_push($arr,$row);
            break;
        }
        echo json_encode($arr);
    }

    function noSellMsg($val){
        $browser = browse_info();
        $usr = getArray($_SESSION,"user_db_$browser");
        if($usr!=""){
            $usrid = $usr["usrid"];
            exeSql("UPDATE usrinfo SET noSellTermMsg = $val WHERE usrid='$usrid';");
        }
    }

    $key = getArray($_POST,"key");
    if($key=="login"){
        stLogin();
    }else if($key=="signup"){
        stSignup();
    }else if($key=="forget"){
        echo stForget(getArray($_POST,"e_code"));
    }else if($key=="getpwd"){
        getPwd();
    }else if($key=="sndSetupMail"){

    }else if($key=="sndChangedMail"){

    }else if($key=="hasEmail"){
        hasEmail();
    }else if($key=="adminLogin"){
        stAdmLogin();
    }else if($key=="noSellMsg"){
        noSellMsg(getArray($_POST,"val"));
    }

?>