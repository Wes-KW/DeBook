<?php
    include_once "vrfylogin.php";
    include_once "more/readDir.phtml";
    
    function getBookApply($id){
        $usrinfo = getPhpUser();
        $usrid = (isset($usrinfo["usrid"]))?$usrinfo["usrid"]:"";
        $res = exeSql("SELECT * FROM aplinfo WHERE bookid='$id' and aplSta=1 and usrid<>'SPECIAL'");
        $arr = array();
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $qua = $row["quality"];
            $qua = rawurldecode(base64_decode($qua));
            $row["quality"] = (array)json_decode($qua);
            $image = $row["images"];
            $image = rawurldecode(base64_decode($image));
            $row["images"] = (array)json_decode($image);
            $row["images"]["Images"] = (array)$row["images"]["Images"];
            $row["lang"] = rawurldecode(base64_decode($row["lang"]));
            $row["publish"] = rawurldecode(base64_decode($row["publish"]));
            $row["translator"] = rawurldecode(base64_decode($row["translator"]));
            $row["ISBN"] = rawurldecode(base64_decode($row["ISBN"]));
            $row["usr_conflict"] = $row["usrid"]==$usrid;
            $usrid2 = $row["usrid"];
            $res2 = exeSql("SELECT deliver_info,email FROM usrinfo WHERE usrid='$usrid2'");
            while($row2=mysqli_fetch_array($res2,MYSQLI_ASSOC)){
                $row["udlvinfo"] = (array)json_decode(rawurldecode(base64_decode($row2["deliver_info"])));
                if(!isset($row["udlvinfo"]["sdays"])) $row["udlvinfo"]["sdays"] = false;
                $row["email"] = $row2["email"];
                break;
            }
            $pageR = 10;
            $res2 = exeSql("SELECT * FROM evainfo WHERE usrid='$usrid2' LIMIT 0,$pageR");
            $mC = 0;
            $mevanum = 0;
            $row["evaluations"] = array();
            while($row2=mysqli_fetch_array($res2,MYSQLI_ASSOC)){
                $row["evaluations"][$mC] = $row2;
                $mevanum += $row2["evanum"];
                $mC++;
            }
            $res2 = exeSql("SELECT count(evanum) FROM evainfo WHERE usrid='$usrid2'");
            while($row2=mysqli_fetch_array($res2,MYSQLI_ASSOC)){
                $re = 0;
                $o = intval($row2["count(evanum)"]);
                if($o%$pageR==0){
                    $re = intval($o/$pageR);
                }else{
                    $re = intval($o/$pageR)+1;
                }
                $row["evaluation_page"] = $re;
                break;
            }
            $row["evanum"] = $mC==0?0:$mevanum/$mC;
            $row["empty_eva"] = $mC == 0;
            array_push($arr,$row);
        }
        return $arr;
    }

    function getApplyPic($aplid){
        $arr = array();
        $res = exeSql("SELECT bookid,images,usrid,quality FROM aplinfo WHERE aplid='$aplid'");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $arr = $row;
        }
        $bookid = $arr["bookid"];
        $res = exeSql("SELECT names FROM bokinfo WHERE bookid='$bookid'");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $arr["names"] = rawurldecode($row["names"]);
        }
        return json_encode($arr);
    }

    function generateP($bokid){
        //find the lowest price
        $prices = array();
        $usrids = array();
        $res = exeSql("SELECT price,usrid FROM aplinfo WHERE bookid='$bokid' and aplSta=1");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            array_push($prices,$row["price"]);
            array_push($usrids,$row["usrid"]);
        }
        if(count($prices)!=0){
            $min = $prices[0];
            $i=1;
            for($i;$i<count($prices);$i++){
                if($prices[$i]<$min){
                    $min = $prices[$i];
                }
            }
            if($usrids[$i-1]=="SPECIAL") return "最低".number_format($min,2)."积分";
            return "最低".number_format($min,2)."元";
        }else{
            return "无货";
        }
    }

    function generateE($bokid){
        //find the average evaluation
        $evasum = 0;
        $evac = 0;
        $res = exeSql("SELECT evanum FROM evainfo WHERE bookid='$bokid'");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $evasum += $row["evanum"];
            $evac++;
        }
        $starClassList = array("star0d0","star0d5","star1d0","star1d5","star2d0","star2d5","star3d0","star3d5","star4d0","star4d5","star5d0");
        $evaWordList = array("非常差","很差","差","较差","中等偏差","中等","中等偏好","较好","良好","非常好","一级棒");
        $eArray = array("","");
        if($evac==0) return array($starClassList[0],"&nbsp;暂无评价");
        $evaAvg = $evasum/$evac;
        $evaArrN = round($evaAvg);
        return array($starClassList[$evaArrN],"&nbsp;".$evaWordList[$evaArrN]);
    }

    function generateL($bokid){
        //find the language
        $langhtml = "";
        $res = exeSql("SELECT lang FROM aplinfo WHERE bookid = '$bokid'");
        $langList = array();
        $lC = 0;
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $mlang = rawurldecode(base64_decode($row["lang"]));
            if(!in_array($mlang,$langList)){
                array_push($langList,$mlang);
                if($lC>3) continue;
                $langhtml .= "<font gray>$mlang</font>&nbsp;";
                $lC++;
            }
        }
        if($lC>3){
            $langhtml .= "等";
        }
        if(sizeof($langList)==0) $langhtml .= "<font gray>暂无可用语言</font>";
        return $langhtml;
    }

    function getApply($id){
        $res = exeSql("SELECT * FROM aplinfo WHERE aplid='$id'");
        $arr = array();
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $bookid = $row["bookid"];
            $res2 = exeSql("SELECT names,authorid FROM bokinfo WHERE bookid='$bookid'");
            while($row2=mysqli_fetch_array($res2,MYSQLI_ASSOC)){
                $row["bookName"]=rawurldecode($row2["names"]);
                //handling author
                $aurStr = $row2["authorid"];
                $aurStrArr = explode(":",$aurStr);
                $aurArr = array();
                $aurLinkArr = array();
                for($i=0;$i<sizeof($aurStrArr);$i++){
                    $aurname = "";
                    $aurLink = "";
                    if(strpos($aurStrArr[$i],"id_")!==false){
                        $aurid = substr($aurStrArr[$i],3);
                        $aurLink = $aurid;
                        $res3 = exeSql("SELECT names FROM aurinfo WHERE aurid='$aurid'");
                        $aurname = "";
                        while($row3=mysqli_fetch_array($res3,MYSQLI_ASSOC)){
                            $aurname = rawurldecode($row3["names"]);
                            break;
                        }
                    }else{
                        $aurname = rawurldecode($aurStrArr[$i]);
                    }
                    array_push($aurArr,$aurname);
                    array_push($aurLinkArr,$aurLink);
                }
                $row["bookAuthor"] = $aurArr;
                $row["bookAuthorLink"] = $aurLinkArr;
                break;
            }
            $qua = $row["quality"];
            $qua = rawurldecode(base64_decode($qua));
            $row["quality"] = (array)json_decode($qua);
            $image = $row["images"];
            $image = rawurldecode(base64_decode($image));
            $row["images"] = (array)json_decode($image);
            $row["images"]["Images"] = (array)$row["images"]["Images"];
            $row["lang"] = rawurldecode(base64_decode($row["lang"]));
            $row["publish"] = rawurldecode(base64_decode($row["publish"]));
            $row["translator"] = rawurldecode(base64_decode($row["translator"]));
            $row["ISBN"] = rawurldecode(base64_decode($row["ISBN"]));
            $usrid2 = $row["usrid"];
            $pageR = 10;
            $res2 = exeSql("SELECT deliver_info,email FROM usrinfo WHERE usrid='$usrid2' LIMIT 0,$pageR");
            while($row2=mysqli_fetch_array($res2,MYSQLI_ASSOC)){
                $row["udlvinfo"] = (array)json_decode(rawurldecode(base64_decode($row2["deliver_info"])));
                $row["email"] = $row2["email"];
                break;
            }
            $row["udlvinfo"]["name"] = hideNameC($row["udlvinfo"]["name"]);
            $res2 = exeSql("SELECT * FROM evainfo WHERE usrid='$usrid2'");
            $mC = 0;
            $mevanum = 0;
            $row["evalutions"] = array();
            while($row2=mysqli_fetch_array($res2,MYSQLI_ASSOC)){
                $row["evaluations"][$mC] = $row2;
                $mevanum += $row2["evanum"];
                $mC++;
            }
            $res2 = exeSql("SELECT count(evanum) FROM evainfo WHERE usrid='$usrid2'");
            while($row2=mysqli_fetch_array($res2,MYSQLI_ASSOC)){
                $re = 0;
                $o = intval($row2["count(evanum)"]);
                if($o%$pageR==0){
                    $re = intval($o/$pageR);
                }else{
                    $re = intval($o/$pageR)+1;
                }
                $row["evaluation_page"] = $re;
                break;
            }
            $row["evanum"] = $mC==0?0:$mevanum/$mC;
            $row["empty_eva"] = $mC == 0;
            $arr = $row;
            break;
        }
        return $arr;
    }

    function getBookEvaluation($bookid,$page=0){
        if($page=="") $page = 0;
        $pageR = 10;
        $upLim = $page*$pageR;
        $boLim = $page*$pageR + $pageR;
        $res = exeSql("SELECT * FROM evainfo WHERE bookid='$bookid' ORDER BY evanum DESC LIMIT $upLim,$boLim ");
        $arr = array();
        $arr["data"] = array();
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            array_push($arr["data"],$row);
        }
        $res = exeSql("SELECT count(evanum) FROM evainfo WHERE bookid='$bookid'");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $re = 0;
            $o = intval($row["count(evanum)"]);
            if($o%$pageR==0){
                $re = intval($o/$pageR);
            }else{
                $re = intval($o/$pageR)+1;
            }
            $arr["page_count"] = $re;
            break;
        }
        return $arr;
    }

    function getApplyEvaluation($usrid,$page=0){
        if($page=="") $page = 0;
        $pageR = 10;
        $upLim = $page*$pageR;
        $boLim = $page*$pageR + $pageR;
        $res = exeSql("SELECT * FROM evainfo WHERE usrid='$usrid' ORDER BY evanum DESC LIMIT $upLim,$boLim ");
        $arr = array();
        $arr["data"] = array();
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            array_push($arr["data"],$row);
        }
        $res = exeSql("SELECT count(evanum) FROM evainfo WHERE usrid='$usrid'");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $re = 0;
            $o = intval($row["count(evanum)"]);
            if($o%$pageR==0){
                $re = intval($o/$pageR);
            }else{
                $re = intval($o/$pageR)+1;
            }
            $arr["page_count"] = $re;
            break;
        }
        return $arr;
    }

    function getPrice($id){
        $res = exeSql("SELECT price FROM aplinfo WHERE aplid='$id'");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            return $row["price"];
        }
    }

    function hideNameC($name){
        $newName = "";
        if(mb_strlen($name)>2){
            $newName = mb_substr($name,0,1);
            for($i=0;$i<mb_strlen($name)-2;$i++){
                $newName .= "*";
            }
            $newName .= mb_substr($name,mb_strlen($name)-1,1);
        }else if(mb_strlen($name)==2){
            $newName = mb_substr($name,0,1) . "*";
        }else{
            $newName = $name;
        }
        return $newName;
    }

    function recordApply($bookid,$trans,$pub,$isbn,$lang,$price,$usrid,$qua,$img){
        exeSql("INSERT INTO aplinfo SET bookid='$bookid',translator='$trans',publish='$pub',ISBN='$isbn',lang='$lang',price='$price',quality='$qua',images='$img',usrid='$usrid'");
    }

    function deleteApply($aplid){
        //delete picture file from apply folder
        $res = exeSql("SELECT images FROM aplinfo WHERE aplid='$aplid'");
        $imageJson = "";
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $imageJson = $row["images"];
            break;
        }
        $images = (array)json_decode(rawurldecode(base64_decode($imageJson)));
        $images["Images"] = (array)$images["Images"];
        exeSql("DELETE FROM aplinfo WHERE aplid='$aplid'");
        if($images["Path"]=="") return;
        $fileDir = FBASE."Image/apply/" . $images["Path"];
        return removeFileOrDir($fileDir);
    }

    function getQua($aplid){
        $res = exeSql("SELECT quality FROM aplinfo WHERE aplid='$aplid'");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            return rawurldecode(base64_decode($row["quality"]));
        }
    }

    function updateApplyPrice($aplid,$price){
        exeSql("UPDATE aplinfo SET price='$price' WHERE aplid='$aplid'");
    }

    function updateApplyPic($aplid,$images){
        exeSql("UPDATE aplinfo SET images='$images' WHERE aplid='$aplid'");
    }

    function countRedeem($bookid){
        $res = exeSql("SELECT count(aplid) FROM aplinfo WHERE bookid='$bookid' and usrid='SPECIAL' and aplSta=1");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            return $row["count(aplid)"];
        }
    }

    function getRedeem($bookid){
        $res = exeSql("SELECT * FROM aplinfo WHERE bookid='$bookid' and usrid='SPECIAL' and aplSta=1");
        $arr = array();
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            array_push($arr,$row);
        }
        return $arr;
    }

    $key = getArray($_POST,"key");
    if($key=="recordApply"){
        $bookid = getArray($_POST,"bookid");
        $trans = getArray($_POST,"trans");
        $pub = getArray($_POST,"pub");
        $lang = getArray($_POST,"lang");
        $isbn = getArray($_POST,"isbn");
        $qua = getArray($_POST,"qua");
        $img = getArray($_POST,"img");
        $price = getArray($_POST,"price");
        $usrArr = getPhpUser();
        $usrid = $usrArr["usrid"];
        echo recordApply($bookid,$trans,$pub,$isbn,$lang,$price,$usrid,$qua,$img);
    }else if($key=="getApply"){
        echo json_encode(getApply(getArray($_POST,"id")));
    }else if($key=="getPrice"){
        echo getPrice(getArray($_POST,"id"));
    }else if($key=="getApplyPic"){
        echo getApplyPic(getArray($_POST,"id"));
    }else if($key=="delApply"){
        echo deleteApply(getArray($_POST,"id"));
    }else if($key=="getAplQua"){
        echo getQua(getArray($_POST,"id"));
    }else if($key=="updateAplPrice"){
        echo updateApplyPrice(getArray($_POST,"id"),getArray($_POST,"price"));
    }else if($key=="updateApplyPic"){
        echo updateApplyPic(getArray($_POST,"id"),getArray($_POST,"images"));
    }else if($key=="getBookEvaluation"){
        echo json_encode(getBookEvaluation(getArray($_POST,"id"),getArray($_POST,"page")));
    }else if($key=="getApplyEvaluation"){
        echo json_encode(getApplyEvaluation(getArray($_POST,"id"),getArray($_POST,"page")));
    }else if($key=="getRedeem"){
        echo json_encode(getRedeem(getArray($_POST,"bookid")));
    }
?>