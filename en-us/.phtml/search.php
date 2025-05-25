<?php
    include_once "more/echoSql.phtml";

    function searchLabelA($str){
        if($str!=""){
            $res = exeSql("SELECT * FROM lblinfo WHERE label_name LIKE '%$str%'");
            $array = array();
            while($row = mysqli_fetch_array($res,MYSQLI_ASSOC))
            {
                array_push($array,$row);
            }
            echo json_encode($array);
        }
    }

    function searchAuthorA($str){
        if($str!=""){
            $str = rawurlencode($str);
            $res = exeSql("SELECT aurid,names FROM aurinfo WHERE names LIKE '%$str%'");
            $array = array();
            while($row = mysqli_fetch_array($res,MYSQLI_ASSOC))
            {
                array_push($array,$row);
            }
            echo json_encode($array);
        }
    }

    function searchBookA($str){
        if($str!=""){
            $str = rawurlencode($str);
            $res = exeSql("SELECT bookid,names FROM bokinfo WHERE names LIKE '%$str%'");
            $array = array();
            while($row = mysqli_fetch_array($res,MYSQLI_ASSOC))
            {
                $row["names"] = rawurldecode($row["names"]);
                array_push($array,$row);
            }
            echo json_encode($array);
        }
    }

    function getBookPic($str){
        if($str=="") return "{}";
        $str = rawurlencode($str);
        $res = exeSql("SELECT names,picpath FROM bokinfo WHERE bookid='$str'");
        $arr = array();
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $arr = $row;
            break;
        }
        echo json_encode($arr);
    }

    function bookExist($id){
        if($id=="") return 0;
        $str = rawurlencode($id);
        $res = exeSql("SELECT COUNT(names) FROM bokinfo WHERE bookid='$id'");
        $c = 0;
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $c = $row["COUNT(names)"];
        }
        if(intval($c)>0){
            return 1;
        }else{
            return 0;
        }
    }

    function getRel($key,$word){
        $rel = 0;
        $word = strtolower(rawurldecode($word));
        $key = strtolower(rawurldecode($key));
        if($word==$key){
            $rel = 100;
        }else{
            if(strpos($key,$word)!==false||strpos($word,$key)!==false){
                $rel1 = strlen($key)/strlen($word);
                $rel2 = strlen($word)/strlen($key);
                if($rel1>1){
                    $rel += $rel2*60;
                }else{
                    $rel += $rel1*60;
                }
            }
            //try to find relevance by matching each word
            $preg_rel = 0;
            $skey = preg_split('/[\s,.;，*]/',$key);
            for($i=0;$i<sizeof($skey);$i++){
                if($skey[$i]=="") continue;
                if(strpos($word,$skey[$i])!==false||strpos($skey[$i],$word)!==false){
                    $rel1 = strlen($skey[$i])/strlen($word);
                    $rel2 = strlen($word)/strlen($skey[$i]);
                    if($rel1>1){
                        $preg_rel += $rel2;
                    }else{
                        $preg_rel += $rel1;
                    }
                }
            }
            $l = sizeof($skey);
            $rel += $preg_rel/$l * 90;
            if($preg_rel>20) return $rel;
            //do sequential search
            $rel += (diff($word,$key) + diff($key,$word))/strlen($key.$word)*60;
        }
        return $rel;
    }

    function diff($str1,$str2){
        $skey = preg_split('/[\s,.;，*]/',$str2);
        $drel = 0;
        for($i=0;$i<sizeof($skey);$i++){
            if($skey[$i]=="") continue;
            if(strpos($str1,$skey[$i])!==false){
                $drel += strlen($skey[$i]);
                $a = substr($str1,0,strpos($str1,$skey[$i]));
                $b = substr($str1,strpos($str1,$skey[$i])+strlen($str1));
                $str1 = $a . $b;
            }
        }
        return $drel;
    }

    function findRel($row,$key){
        $rel = 0;
        $names = isset($row["names"])?$row["names"]:$row["label_name"];
        $rel = getRel($names,$key);
        if(isset($row["search_index"])==false){
            $row["rel"] = $rel;
            return $row;
        }
        if($rel<40){
            $siArr = array();
            $si = explode(";",rawurldecode($row["search_index"]));
            for($x=0;$x<sizeof($si);$x++){
                $p = explode(":",$si[$x]);
                if(sizeof($p)<2) continue;
                $siArr[strtolower($p[0])] = strtolower($p[1]);
            }
            $str = "en_name:zhsim_name:zhhans_name:fr_name:es_name:de_name:jp_name:";
            $drel = 0;
            foreach($siArr as $k=>$v){
                if(strpos($str,$k)===false) continue;
                $trel = getRel($v,$key);
                if($trel>$drel){
                    $drel = $trel;
                    $row["ultra-lang"] = $v;
                }
            }
            $rel += $drel;
        }
        $row["rel"] = $rel;
        return $row;
    }

    $key = getArray($_POST,"searchKey");
    if($key=="label"){
        searchLabelA(getArray($_POST,"str"));
    }else if($key=="author"){
        searchAuthorA(getArray($_POST,"str"));
    }else if($key=="book"){
        searchBookA(getArray($_POST,"str"));
    }else if($key=="pic"){
        getBookPic(getArray($_POST,"str"));
    }else if($key=="bookexist"){
        echo bookExist(getArray($_POST,"str"));
    }

?>