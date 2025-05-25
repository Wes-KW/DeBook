<?php
    include_once 'vrfylogin.php';
    include_once 'more/readDir.phtml';

    function getBookNameById($id){
        $res = exeSql("SELECT names FROM bokinfo WHERE bookid='$id'");
        $d = array();
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $d = $row;
            break;
        }
        return $d["names"];
    }

    function getLabelNameById($id){
        $res = exeSql("SELECT label_name FROM lblinfo WHERE labelid='$id'");
        $d = array();
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $d = $row;
            break;
        }
        return $d["label_name"];
    }

    function getAuthorNameById($id){
        $res = exeSql("SELECT names FROM aurinfo WHERE aurid='$id'");
        $d = array();
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $d = $row;
            break;
        }
        return $d["names"];
    }

    function getBookDataById($id){
        //basic folder
        $bf = "Image/tmp/";
        $iof = "Image/book/";
        $res = exeSql("SELECT * FROM bokinfo WHERE bookid='$id'");
        $d = array();
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $d = $row;
            break;
        }
        //load the images into tmp
        if($d["picpath"]!=""){
            $tmpdir = rMKrandDirIn($bf);
            $pics = explode(":",$d["picpath"]);
            $picstr = "";
            for($i=0;$i<sizeof($pics);$i++){
                if($pics[$i]=="") continue;
                $picstr .= $pics[$i] . ":";
            }
            $picstr = substr($picstr,0,strlen($picstr)-1);
            cFiles($iof,$picstr,$bf . $tmpdir);
            $d["picpath"] = $tmpdir . ":" . $d["picpath"];
        }
        //replace authorid & labelid with name
        $aur = explode(":",$d["authorid"]);
        $label = explode(":",$d["label"]);
        $aurstr = "";
        $labelstr = "";
        for($i=0;$i<sizeof($aur);$i++){
            if(strpos($aur[$i],"id_")!==false){
                $aurstr .= getAuthorNameById(substr($aur[$i],3));
            }else{
                $aurstr .= $aur[$i];
            }
            $aurstr .= ";";
        }
        for($i=0;$i<sizeof($label);$i++){
            if(strpos($label[$i],"id_")!==false){
                $labelstr .= getLabelNameById(substr($label[$i],3));
            }else{
                $labelstr .= $label[$i];
            }
            $labelstr .= ";";
        }
        $d["authorid"] = $aurstr;
        $d["label"] = $labelstr;
        return $d;
    }

    function getAuthorDataById($id){
        $bf = "Image/tmp/";
        $iof = "Image/author/";
        $res = exeSql("SELECT * FROM aurinfo WHERE aurid='$id'");
        $d = array();
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $d = $row;
            break;
        }
        //load the images into tmp
        if($d["picpath"]!=""){
            $tmpdir = rMKrandDirIn($bf);
            $pics = explode(":",$d["picpath"]);
            $picstr = "";
            for($i=0;$i<sizeof($pics);$i++){
                if($pics[$i]=="") continue;
                $picstr .= $pics[$i] . ":";
            }
            $picstr = substr($picstr,0,strlen($picstr)-1);
            cFiles($iof,$picstr,$bf . $tmpdir);
            $d["picpath"] = $tmpdir . ":" . $d["picpath"];
        }
        return $d;
    }

    function getListDataById($id){
        //basic folder
        $bf = "Image/tmp/";
        $iof = "Image/list/";
        $res = exeSql("SELECT * FROM bklinfo WHERE bklid='$id'");
        $d = array();
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $d = $row;
            break;
        }
        
        //load the images into tmp
        if($d["picpath"]!=""){
            $tmpdir = rMKrandDirIn($bf);
            $pics = explode(":",$d["picpath"]);
            $picstr = "";
            for($i=0;$i<sizeof($pics);$i++){
                if($pics[$i]=="") continue;
                $picstr .= $pics[$i] . ":";
            }
            $picstr = substr($picstr,0,strlen($picstr)-1);
            cFiles($iof,$picstr,$bf . $tmpdir);
            $d["picpath"] = $tmpdir . ":" . $d["picpath"];
        }
        //replace authorid & labelid with name
        $book = explode(":",$d["bookid"]);
        $label = explode(":",$d["label"]);
        $bookstr = "";
        $labelstr = "";
        for($i=0;$i<sizeof($book);$i++){
            if(strpos($book[$i],"id_")!==false){
                $bookstr .= getBookNameById(substr($book[$i],3));
            }else{
                $bookstr .= $book[$i];
            }
            $bookstr .= ";";
        }
        for($i=0;$i<sizeof($label);$i++){
            if(strpos($label[$i],"id_")!==false){
                $labelstr .= getLabelNameById(substr($label[$i],3));
            }else{
                $labelstr .= $label[$i];
            }
            $labelstr .= ";";
        }
        $d["bookid"] = $bookstr;
        $d["label"] = $labelstr;
        return $d;
    }

    

    $resKey = getArray($_POST,"res");
    if($resKey=="0"){
        echo json_encode(getBookDataById(getArray($_POST,"id")));
    }else if($resKey=="1"){
        echo json_encode(getAuthorDataById(getArray($_POST,"id")));
    }else if($resKey=="2"){
        echo json_encode(getListDataById(getArray($_POST,"id")));
    }
?>