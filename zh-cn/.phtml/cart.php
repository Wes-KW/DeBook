<?php
    include_once 'vrfylogin.php';

    function encodeInfo2($obj){
        return base64_encode(rawurlencode(json_encode($obj)));
    }

    function addCart($json){
        if($json=="") return;
        $browser = browse_info();
        $cartArr = array();
        $ncart = getArray($_SESSION,"cart_db_$browser");
        if($ncart!=""){
            $cartArr = decodeInfo2($ncart);
        }
        $addCartArr = decodeInfo2($json);
        for($i=0;$i<sizeof($addCartArr);$i++){
            $f = in_array($addCartArr[$i],$cartArr);
            if(!$f) array_push($cartArr,$addCartArr[$i]);
        }
        $wcart = encodeInfo2($cartArr);
        $_SESSION["cart_db_$browser"] = $wcart;
        if(getPhpUser()==null) return;
        combineUsrCart($cartArr);
    }

    function deleteCart($json){
        if($json=="") return;
        $browser = browse_info();
        $cartArr = array();
        $newCartArr = array();
        $ncart = getArray($_SESSION,"cart_db_$browser");
        if($ncart!=""){
            $cartArr = decodeInfo2($ncart);
        }
        $delCartArr = decodeInfo2($json);
        for($i=0;$i<sizeof($cartArr);$i++){
            if(!in_array($cartArr[$i],$delCartArr)) array_push($newCartArr,$cartArr[$i]);;
        }
        $wcart = encodeInfo2($newCartArr);
        $_SESSION["cart_db_$browser"] = $wcart;
        if(getPhpUser()==null) return;
        $usrid = getPhpUser()["usrid"];
        exeSql("UPDATE usrinfo SET cart='$wcart' WHERE usrid='$usrid'");
    }

    function clearCart(){
        $_SESSION["cart_db_$browser"] = "";
        $_SESSION["cart_selection_db_$browser"] = array();
        if(getPhpUser()!=null){
            $usrid = getPhpUser()["usrid"];
            exeSql("UPDATE usrinfo SET cart='' WHERE usrid='$usrid'");
        }
    }

    function getPQ($bookid){
        $myusrid = getPhpUser()!=null?getPhpUser()["usrid"]:"";
        $ic = 0;
        $tc = 0;
        $ip = 0;
        $tp = 0;
        $ttc = 0;
        $browser = browse_info();
        $cartArr = array();
        $ncart = getArray($_SESSION,"cart_db_$browser");
        $selCart = getCartSelection();
        if($ncart!="") $cartArr = decodeInfo2($ncart);
        for($i=0;$i<sizeof($cartArr);$i++){
            $aplid = $cartArr[$i];
            $res = exeSql("SELECT bookid,price,usrid FROM aplinfo WHERE aplid='$aplid' and aplSta=1");
            while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
                if($myusrid==$row["usrid"]) continue;
                $ic += $row["bookid"]==$bookid?1:0;
                $ip += $row["bookid"]==$bookid?$row["price"]:0;
                if(in_array($row["bookid"],$selCart)){
                    $tc++;
                    $tp += $row["price"];
                }
                $ttc++;
                break;
            }
        }
        return array("item_count"=>$ic,"total_count"=>$tc,"item_price"=>$ip,"total_price"=>$tp,"cart_count"=>$ttc);
    }

    function loginCombineCart(){
        $session_cart = array();
        $browser = browse_info();
        if(getArray($_SESSION,"cart_db_$browser")!=""){
            $session_cart = decodeInfo2(getArray($_SESSION,"cart_db_$browser"));
        }
        $_SESSION["cart_db_$browser"] = combineUsrCart($session_cart);
    }

    function updateCartSelection($cartArr){
        $browser = browse_info();
        $_SESSION["cart_selection_db_$browser"] = $cartArr;
    }

    function addCartSelection($bookid){
        $browser = browse_info();
        if(getArray($_SESSION,"cart_selection_db_$browser")==""){
            $_SESSION["cart_selection_db_$browser"] = array($bookid);
        }else{
            array_push($_SESSION["cart_selection_db_$browser"],$bookid);
        }
    }

    function delCartSelection($bookid){
        $browser = browse_info();
        $cartSel = $_SESSION["cart_selection_db_$browser"];
        $newCartSel = array();
        for($i=0;$i<sizeof($cartSel);$i++){
            if($cartSel[$i]==$bookid) continue;
            array_push($newCartSel,$cartSel[$i]);
        }
        $_SESSION["cart_selection_db_$browser"] = $newCartSel;
    }

    function getCartSelection(){
        $browser = browse_info();
        if(getArray($_SESSION,"cart_selection_db_$browser")=="") return array();
        return $_SESSION["cart_selection_db_$browser"];
    }

    function combineUsrCart($cartArr){
        $usrid = getPhpUser()["usrid"];
        $res = exeSql("SELECT cart FROM usrinfo WHERE usrid='$usrid'");
        $mycart = array();
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $mycart = decodeInfo2($row["cart"]);
            break;
        }
        for($i=0;$i<sizeof($cartArr);$i++){
            $f = in_array($cartArr[$i],$mycart);
            if(!$f) array_push($mycart,$cartArr[$i]);
        }
        $mycartStr = encodeInfo2($mycart);
        exeSql("UPDATE usrinfo SET cart='$mycartStr' WHERE usrid='$usrid'");
        return $mycartStr;
    }

    function getCart(){
        if(getPhpUser()==null){
            $browser = browse_info();
            if(getArray($_SESSION,"cart_db_$browser")==""){
                return array();
            }else{
                return decodeInfo2(getArray($_SESSION,"cart_db_$browser"));
            }
        }else{
            $usrid = getPhpUser()["usrid"];
            $res = exeSql("SELECT cart FROM usrinfo WHERE usrid='$usrid'");
            $mycart = array();
            while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
                $mycart = decodeInfo2($row["cart"]);
                break;
            }
            return $mycart;
        }
    }

    $key = getArray($_POST,"key");
    if($key=="addCart"){
        addCart(getArray($_POST,"json"));
    }elseif($key=="deleteCart"){
        deleteCart(getArray($_POST,"json"));
    }elseif($key=="updateData"){
        echo json_encode(getPQ(getArray($_POST,"bookid")));
    }elseif($key=="delCartSel"){
        delCartSelection(getArray($_POST,"bookid"));
    }elseif($key=="addCartSel"){
        addCartSelection(getArray($_POST,"bookid"));
    }elseif($key=="clearCart"){
        clearCart();
    }
?>