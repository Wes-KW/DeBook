<?php
    include "more/echoSql.phtml";
    include "more/readDir.phtml";
    include "sendMail.phtml";

    function showcon($sta){
        if($sta!=""){
            $sta = " WHERE status=" . $sta;
        }
        json2Sql("SELECT * FROM coninfo $sta");
    }

    function showconById($id){
        json2Sql("SELECT * FROM coninfo WHERE conid=$id");
    }

    function showfbk($sta){
        if($sta!=""){
            $sta = " WHERE status=" . $sta;
        }
        json2Sql("SELECT * FROM fbkinfo $sta");
    }

    function showfbkById($id){
        json2Sql("SELECT * FROM coninfo WHERE conid=$id");
    }

    function getcon($id){
        $str = "SELECT * FROM coninfo WHERE conid='$id'";
        $res = exeSql($str);
        $arr = array();
        while($row = mysqli_fetch_array($res,MYSQLI_ASSOC)){
            array_push($arr,$row);
        }
        $n = $arr[0];
        return $n;
    }

    function encodeText($text){
        return base64_encode(urlencode($text));
    }

    function decodeText($text){
        return urldecode(base64_decode($text));
    }

    function getLongDate($myDateInt){
        return date("Y-m-d H:i:s",(int)$myDateInt);
    }

    function getLabelidByName($name){
        $res = exeSql("SELECT * FROM lblinfo WHERE label_name='$name'");
        $str = "";
        while($row = mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $str .= $row["labelid"] . ":";
        }
        substr($str,0,strlen($str)-1);
        return $str;
    }

    function getAuthoridByName($name){
        $name = rawurlencode($name);
        $res = exeSql("SELECT * FROM aurinfo WHERE names LIKE '%$name%'");
        $str = "";
        while($row = mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $str .= $row["aurid"] . ":";
        }
        substr($str,0,strlen($str)-1);
        return $str;
    }

    function getBookidByName($name){
        $name = rawurlencode($name);
        $name2 = $name;
        while(strpos($name2,"%3A")!==false){
            $name2 = str_replace("%3A",":",$name2);
        }
        $res = exeSql("SELECT * FROM bokinfo WHERE names LIKE '%$name%' or names LIKE '%$name2%'");
        $str = "";
        while($row = mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $str .= $row["bookid"] . ":";
        }
        substr($str,0,strlen($str)-1);
        return $str;
    }

    function getmergecon($type,$id){
        $arr = getcon($id);
        $data = (array) json_decode($arr["object"]);
        $data = decodeTextInArr($data);
        # 0:book, 1:author, 2:list
        $_new = array();
        if($type==0){
            foreach($data as $key=>$value){
                if($key=="book_label"||$key=="author_name"){
                    $labelstr = $data[$key];
                    $lo = explode(";",$labelstr);
                    $arr = array();
                    for($i=0;$i<sizeof($lo);$i++){
                        $adstr = $key=="book_label"?getLabelidByName($lo[$i]):getAuthoridByName($lo[$i]);
                        $arr[$lo[$i]] = $adstr;
                    }
                    $_new[$key] = $arr;
                }
            }
        }else if($type==1){
            foreach($data as $key=>$value){
                if($key=="books"){
                    $labelstr = $data[$key];
                    $lo = explode(";",$labelstr);
                    $arr = array();
                    for($i=0;$i<sizeof($lo);$i++){
                        if($lo[$i]!=""){
                            $adstr = getBookidByName($lo[$i]);
                            $arr[$lo[$i]] = $adstr;
                        }
                    }
                    $_new[$key] = $arr;
                }
            }
        }else if($type==2){
            foreach($data as $key=>$value){
                if($key=="label_name"||$key=="book_name"){
                    $labelstr = $data[$key];
                    $lo = explode(";",$labelstr);
                    $arr = array();
                    for($i=0;$i<sizeof($lo);$i++){
                        if($lo[$i]=="") continue;
                        $adstr = $key=="label_name"?getLabelidByName($lo[$i]):getBookidByName($lo[$i]);
                        $arr[$lo[$i]] = $adstr;
                    }
                    $_new[$key] = $arr;
                }
            }
        }
        $_new["id"] = isset($data["editId"])?$data["editId"]:"";
        echo json_encode($_new);
    }

    function decodeTextInArr($arr){
        foreach($arr as $key => $value){
            if($key!="images"&&$key!="editId"){
                $arr[$key] = decodeText($arr[$key]);
            }
        }
        return $arr;
    }

    function repFirstInArr($arr,$strb,$stra){
        $strc = $strb;
        while(strpos($strc,"%3A")!==false){
            $strc = str_replace("%3A",":",$strc);
        }
        $new_arr = array();
        $x = 0;
        for($i=0;$i<sizeof($arr);$i++){
            if(($arr[$i]==$strb||$arr[$i]==$strc)&&$x==0){
                array_push($new_arr,$stra);
                $x++;
            }else{
                array_push($new_arr,$arr[$i]);
            }
        }
        return $new_arr;
    }

    function recordItemSendMail($email, $text, $type) {
        $rec = $email;
        if(strpos($rec,"!")!==false) $rec = substr($rec,1,strlen($rec)-1);
        $sub = "Content Creation or Modification Approved - DeBook Used Book Market";
        $html = "<style>h3,h2,p,a{margin:0px;}h2{font-weight:normal;}</style><h3>DeBook Used Book Market</h3><p>The modification or creation of entry <b>$text</b> has been approved. You can find this $type by searching the keyword. </p><p>Thank you for your support</p><p>DeBook Used Book Market</p>";
        $althtml = "DeBook Used Book Market\n\nThe modification or creation of entry $text has been approved. You can find this $type by searching the keyword.\n\nThank you for your support\n\nDeBook Used Book Market";
        goMail($rec,$rec,$sub,$html,$althtml);
    }

    function recordAur($id,$jsonStr){
        $root = FBASE."Image/author/";
        $root_tmp = FBASE."Image/tmp/";
        //record the data into the database
        $conData = getcon($id);
        $usr = (array) decodeInfo($conData["contributor"]);
        $obj = (array) json_decode($conData["object"]);
        //find the Image
        $image_arr = explode(":",$obj["images"]);
        $picpath = "";
        if($image_arr[0]!=""){
            //move the image to another place
            //find a new destination for the image
            for($i=1;$i<count($image_arr);$i++){
                $fname = randomF($root,"nwW",10);
                $picpath .= $fname . ":";
                copy($root_tmp.$image_arr[0]."/".urldecode(base64_decode($image_arr[$i])),$root.$fname);
            }
            $picpath = substr($picpath,0,strlen($picpath)-1);
        }
        $names = base64_decode($obj["author_name"]);
        $contents = base64_decode($obj["contents"]);
        $search_index = base64_decode($obj["searchIndex"]);
        $editId = isset($obj["editId"])?$obj["editId"]:"";
        if($editId==""){
            exeSql("INSERT INTO aurinfo SET names='$names', contents='$contents', picpath='$picpath', search_index='$search_index'");
        }else{
            exeSql("UPDATE aurinfo SET names='$names', contents='$contents', picpath='$picpath', search_index='$search_index' WHERE aurid='$editId'");
        }
        $g = exeSql("SELECT max(aurid) FROM aurinfo");
        $m = 0;
        while($row=mysqli_fetch_array($g,MYSQLI_ASSOC)){
            $m = $row["max(aurid)"];
        }
        //move the books
        $dyn = (array) json_decode($jsonStr);
        $bokb = base64_decode($obj["books"]);
        if(strrpos($bokb,";")==strlen($bokb)-1){
            $bokb = substr($bokb,0,strlen($bokb)-1);
        }
        $bokAA = (array) $dyn["bookid"];
        $book2 = array();
        foreach($bokAA as $key=>$value){
            if($key==""||$value=="") continue;
            array_push($book2,$value);
        }
        $arrBok = array();
        for($i=0;$i<sizeof($book2);$i++){
            if(!in_array($book2[$i],$arrBok)){
                array_push($arrBok,$book2[$i]);
            }
        }
        //look for the books
        for($i=0;$i<sizeof($arrBok);$i++){
            $kid = $arrBok[$i];
            $res = exeSql("SELECT authorid FROM bokinfo WHERE bookid='$kid'");
            $r = "";
            while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
                $r = $row["authorid"];
                break;
            }
            $a = explode(":",$r);
            $s = "";
            $a = repFirstInArr($a,$names,"id_$m");
            for($i=0;$i<sizeof($a);$i++){
                $s .= $a[$i] . ":";
            }
            $s = substr($s,0,strlen($s)-1);
            exeSql("UPDATE bokinfo SET authorid='$s' WHERE bookid='$kid'");
        }
        
        //change condata
        exeSql("UPDATE coninfo SET status=1 WHERE conid='$id'");
        $res = exeSql("SELECT usrid FROM usrinfo WHERE email='$usr' or usrid='$usr'");
        $reusrid = "";
        $c = 0;
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $c++;
            $reusrid = $row["usrid"];
            break;
        }
        if($c==1){
            $coins_add = rand(1,3);
            exeSql("UPDATE usrinfo SET coins=coins + $coins_add WHERE email='$usr'");
            $date = time();
            $rename = rawurldecode($names);
            $content = rawurlencode("Add or edit an entry of author - $rename");
            exeSql("INSERT INTO trsinfo SET value='$coins_add',toUsrid='$reusrid',content='$content',date='$date'");
        }
        $namesA = urldecode($names);
        if ($usr["email"]!="") {
            recordItemSendMail($usr["email"], $namesA, "author");
        }
    }

    function recordBok($id,$jsonStr){
        $root = FBASE."Image/book/";
        $root_tmp = FBASE."Image/tmp/";
        //record the data into the database
        $conData = getcon($id);
        $usr = (array) decodeInfo($conData["contributor"]);
        $obj = (array) json_decode($conData["object"]);
        //find the Image
        $image_arr = explode(":",$obj["images"]);
        $picpath = "";
        if($image_arr[0]!=""){
            //move the image to another place
            //find a new destination for the image
            for($i=1;$i<count($image_arr);$i++){
                $fname = randomF($root,"nwW",10);
                $picpath .= $fname . ":";
                copy($root_tmp.$image_arr[0]."/".urldecode(base64_decode($image_arr[$i])),$root.$fname);
            }
            $picpath = substr($picpath,0,strlen($picpath)-1);
        }
        $names = base64_decode($obj["book_name"]);
        $aurb = base64_decode($obj["author_name"]);
        $lblb = base64_decode($obj["book_label"]);
        //replace author or label
        $dyn = (array) json_decode($jsonStr);
        if(strrpos($aurb,";")==strlen($aurb)-1){
            $aurb = substr($aurb,0,strlen($aurb)-1);
        }
        if(strrpos($lblb,";")==strlen($lblb)-1){
            $lblb = substr($lblb,0,strlen($lblb)-1);
        }
        $aurA = explode(";",$aurb);
        $lblA = explode(";",$lblb);
        $aurAA = (array) $dyn["authorid"];
        $lblAA = (array) $dyn["label"];
        foreach($aurAA as $key=>$value){
            if($key==""||$value=="") continue;
            $aurA = repFirstInArr($aurA,rawurlencode($key),"id_".$value);
        }
        foreach($lblAA as $key=>$value){
            if($key==""||$value=="") continue;
            $lblA = repFirstInArr($lblA,rawurlencode($key),"id_".$value);
        }
        //delete repeated ids
        $aurC = "";
        $arrAur = array();
        $lblC = "";
        $arrLbl = array();
        for($i=0;$i<sizeof($aurA);$i++){
            if(!in_array($aurA[$i],$arrAur)){
                array_push($arrAur,$aurA[$i]);
                $aurC .= $aurA[$i] . ":";
            }
        }
        for($i=0;$i<sizeof($lblA);$i++){
            if(!in_array($lblA[$i],$arrLbl)){
                array_push($arrLbl,$lblA[$i]);
                $lblC .= $lblA[$i] . ":";
            }
        }
        $aurC = substr($aurC,0,strlen($aurC)-1);
        $lblC = substr($lblC,0,strlen($lblC)-1);
        $contents = base64_decode($obj["contents"]);
        $search_index = base64_decode($obj["searchIndex"]);
        $editId = isset($obj["editId"])?$obj["editId"]:"";
        if($editId==""){
            exeSql("INSERT INTO bokinfo SET names='$names',authorid='$aurC',label='$lblC', contents='$contents', picpath='$picpath', search_index='$search_index'");
        }else{
            exeSql("UPDATE bokinfo SET names='$names',authorid='$aurC',label='$lblC', contents='$contents', picpath='$picpath', search_index='$search_index' WHERE bookid='$editId'");
        }
        exeSql("UPDATE coninfo SET status=1 WHERE conid='$id'");
        $res = exeSql("SELECT usrid FROM usrinfo WHERE email='$usr' or usrid='$usr'");
        $reusrid = "";
        $c = 0;
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $c++;
            $reusrid = $row["usrid"];
            break;
        }
        if($c==1){
            $coins_add = rand(1,3);
            exeSql("UPDATE usrinfo SET coins=coins + $coins_add WHERE email='$usr'");
            $date = time();
            $rename = rawurldecode($names);
            $content = rawurlencode("Add or edit an entry of book - $rename");
            exeSql("INSERT INTO trsinfo SET value='$coins_add',toUsrid='$reusrid',content='$content',date='$date'");
        }
        $namesA = urldecode($names);
        if ($usr["email"]!="") {
            recordItemSendMail($usr["email"], $namesA, "book");
        }
    }

    function recordBkl($id,$jsonStr){
        $root = FBASE."Image/list/";
        $root_tmp = FBASE."Image/tmp/";
        //record the data into the database
        $conData = getcon($id);
        $usr = (array) decodeInfo($conData["contributor"]);
        $obj = (array) json_decode($conData["object"]);
        //find the Image
        $image_arr = explode(":",$obj["images"]);
        $picpath = "";
        if($image_arr[0]!=""){
            //move the image to another place
            //find a new destination for the image
            for($i=1;$i<count($image_arr);$i++){
                $fname = randomF($root,"nwW",10);
                $picpath .= $fname . ":";
                copy($root_tmp.$image_arr[0]."/".urldecode(base64_decode($image_arr[$i])),$root.$fname);
            }
            $picpath = substr($picpath,0,strlen($picpath)-1);
        }
        $names = base64_decode($obj["list_name"]);
        $lblb = base64_decode($obj["label_name"]);
        $bokb = base64_decode($obj["book_name"]);
        //replace label or book
        $dyn = (array) json_decode($jsonStr);
        if(strrpos($lblb,";")==strlen($lblb)-1){
            $lblb = substr($lblb,0,strlen($lblb)-1);
        }
        if(strrpos($bokb,";")==strlen($bokb)-1){
            $bokb = substr($bokb,0,strlen($bokb)-1);
        }
        $lblA = explode(";",$lblb);
        $bokA = explode(";",$bokb);
        $lblAA = (array) $dyn["label"];
        $bokAA = (array) $dyn["bookid"];
        foreach($lblAA as $key=>$value){
            if($key==""||$value=="") continue;
            $lblA = repFirstInArr($lblA,rawurlencode($key),"id_".$value);
        }
        foreach($bokAA as $key=>$value){
            if($key==""||$value=="") continue;
            $bokA = repFirstInArr($bokA,rawurlencode($key),"id_".$value);
        }
        //delete repeated ids
        $lblC = "";
        $arrLbl = array();
        $bokC = "";
        $arrBok = array();
        for($i=0;$i<sizeof($lblA);$i++){
            if(!in_array($lblA[$i],$arrLbl)){
                array_push($arrLbl,$lblA[$i]);
                $lblC .= $lblA[$i] . ":";
            }
        }
        for($i=0;$i<sizeof($bokA);$i++){
            if(!in_array($bokA[$i],$arrBok)){
                array_push($arrBok,$bokA[$i]);
                $bokC .= $bokA[$i] . ":";
            }
        }
        $lblC = substr($lblC,0,strlen($lblC)-1);
        $bokC = substr($bokC,0,strlen($bokC)-1);
        $contents = base64_decode($obj["contents"]);
        $search_index = base64_decode($obj["searchIndex"]);
        $editId = isset($obj["editId"])?$obj["editId"]:"";
        $creator = "";
        $date = time();
        $picpaths = array('apple','cat','clown_fish','co2','cocacola','cricket','dice','dog','donut','flamingo','flower','fruit_grape','glass_of_wine_full','hat','mario','moon','mouse_select_scroll','multitool','mushroom','mustache','tree','tub','twitter_bird','ufo','umbrella');
        $fatpic = $picpaths[rand(0,sizeof($picpaths)-1)];
        if(strpos($usr,"!")===false){
            $res = exeSql("SELECT * FROM usrinfo WHERE email='$usr'");
            while($row = mysqli_fetch_array($res,MYSQLI_ASSOC)){
                $creator = $row["nickname"];
                break;
            }
        }
        $creator_id = $usr["usrid"];
        if($editId==""){
            exeSql("INSERT INTO bklinfo SET names='$names',fatpic='$fatpic',creator='$creator', creator_id='$creator_id',date=$date,bookid='$bokC',label='$lblC', contents='$contents', picpath='$picpath', search_index='$search_index'");
        }else{
            exeSql("UPDATE bklinfo SET names='$names',fatpic='$fatpic',creator='$creator',date=$date,bookid='$bokC',label='$lblC', contents='$contents', picpath='$picpath', search_index='$search_index' WHERE bklid='$editId'");
        }
        exeSql("UPDATE coninfo SET status=1 WHERE conid='$id'");
        $res = exeSql("SELECT usrid FROM usrinfo WHERE email='$usr' or usrid='$usr'");
        $reusrid = "";
        $c = 0;
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $c++;
            $reusrid = $row["usrid"];
            break;
        }
        if($c==1){
            $coins_add = 3;
            exeSql("UPDATE usrinfo SET coins=coins + $coins_add WHERE email='$usr'");
            $date = time();
            $rename = rawurldecode($names);
            $content = rawurlencode("Add a booklist - $rename");
            exeSql("INSERT INTO trsinfo SET value='$coins_add',toUsrid='$reusrid',content='$content',date='$date'");
        }
        $namesA = urldecode($names);
        if($usr["email"]!=""){
            recordItemSendMail($usr["email"], $namesA, "booklist");
        }
    }

    function ignoreCon($id,$advice){
        $conData = getcon($id);
        $usr = (array) decodeInfo($conData["contributor"]);
        $obj = (array) json_decode($conData["object"]);
        $names = base64_decode($obj["author_name"]);
        $namesA = urldecode($names);
        exeSql("UPDATE coninfo SET status=2 WHERE conid='$id'");
        if($advice!=""){
            //send email
            if($usr["email"]!=""){
                $advice = decodeText($advice);
                $rec = $usr["email"];
                if(strpos($rec,"!")!==false) $rec = substr($rec,1,strlen($rec)-1);
                $sub = "Content Creation or Modification Failed - DeBook Used Book Market";
                $html = "<style>h3,h2,p,a{margin:0px;}h2{font-weight:normal;}</style><h3>DeBook Used Book Market</h3><p>Creation or modification of <b>$namesA</b> has failed. We apologize for your inconvenience. The following information why it fails to pass the audit.</p><br/><p>$advice</p><p>Thank you for your support</p><p>DeBook Used Book Market</p>";
                $althtml = "DeBook Used Book Market\n\nCreation or modification of $namesA has failed. We apologize for your inconvenience. The following information why it fails to pass the audit.\n\n$advice\n\nThank you for your support\n\nDeBook Used Book Market";
                goMail($rec,$rec,$sub,$html,$althtml);
            }
        }
    }

    function sendFbk($id,$email){
        if($email!=""){
            $res = exeSql("SELECT usrid FROM usrinfo WHERE email='$email'");
            while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
                $usr = $row["usrid"];
                $coins_add = rand(1,3);
                exeSql("UPDATE usrinfo SET coins=coins + $coins_add WHERE email='$email'");
                $date = time();
                $content = rawurlencode("反馈问题");
                exeSql("INSERT INTO trsinfo SET value='$coins_add',toUsrid='$usr',content='$content',date='$date'");
                break;
            }
        }
        exeSql("UPDATE fbkinfo SET status=1 WHERE fbkid='$id'");
    }

    function ignoreFbk($id){
        exeSql("UPDATE fbkinfo SET status=2 WHERE fbkid='$id'");
    }

    $adminkey = getArray($_POST,"adminkey");
    if($adminkey=="viewcon"){
        showcon(getArray($_POST,"status"));
    }else if($adminkey=="viewconid"){
        showconById(getArray($_POST,"id"));
    }else if($adminkey=="viewfbk"){
        showfbk(getArray($_POST,"status"));
    }else if($adminkey=="viewfbkid"){
        showfbkById(getArray($_POST,"id"));
    }else if($adminkey=="merge"){
        getmergecon(getArray($_POST,"type"),getArray($_POST,"id"));
    }else if($adminkey=="recordAur"){
        recordAur(getArray($_POST,"conid"),getArray($_POST,"dynData"));
    }else if($adminkey=="recordBok"){
        recordBok(getArray($_POST,"conid"),getArray($_POST,"dynData"));
    }else if($adminkey=="recordBkl"){
        recordBkl(getArray($_POST,"conid"),getArray($_POST,"dynData"));
    }else if($adminkey=="ignoreCon"){
        ignoreCon(getArray($_POST,"id"),getArray($_POST,"advice"));
    }else if($adminkey=="sendFbk"){
        sendFbk(getArray($_POST,"id"),getArray($_POST,"email"));
    }else if($adminkey=="ignoreFbk"){
        ignoreFbk(getArray($_POST,"id"));
    }
?>