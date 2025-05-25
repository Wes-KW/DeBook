<?php
    include_once 'vrfylogin.php';
    include_once 'apply.php';

    const monthInt = 30*24*3600;

    function randomStr2($patternA,$len){
        $rw = "";
        $nPattern = array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
        $WPattern = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
        $wPattern = array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
        $tmpPattern = array();
        if($patternA=="nwW"){
          for($i=0;$i<10;$i++){array_push($tmpPattern,$nPattern[$i]);}
          for($i=0;$i<26;$i++){array_push($tmpPattern,$wPattern[$i]);}
          for($i=0;$i<26;$i++){array_push($tmpPattern,$WPattern[$i]);}
        }else if($patternA=="nw"){
          for($i=0;$i<10;$i++){array_push($tmpPattern,$nPattern[$i]);}
          for($i=0;$i<26;$i++){array_push($tmpPattern,$wPattern[$i]);}
        }else if($patternA=="nW"){
          for($i=0;$i<10;$i++){array_push($tmpPattern,$nPattern[$i]);}
          for($i=0;$i<26;$i++){array_push($tmpPattern,$WPattern[$i]);}
        }else if($patternA=="wW"){
          for($i=0;$i<26;$i++){array_push($tmpPattern,$wPattern[$i]);}
          for($i=0;$i<26;$i++){array_push($tmpPattern,$WPattern[$i]);}
        }else if($patternA=="w"){
          $tmpPattern = $wPattern;
        }else if($patternA=="W"){
          $tmpPattern = $WPattern;
        }else if($patternA=="n"){
          $tmpPattern = $nPattern;
        }else{
          $tmpPattern = array();
        }
    
        for ($i = 0; $i < $len; $i++){
          $num = rand(0,count($tmpPattern)-1);
          $rw .= $tmpPattern[$num];
        }
        return $rw;
    }

    function generateOrder($json,$rcpt){
        $ids = (array)json_decode($json);
        $sids = array();
        $nids = array();
        for($i=0;$i<sizeof($ids);$i++){
            $aplid = $ids[$i];
            $fromUsrid = "";
            $toUsrid = getPhpUser()["usrid"];
            $bookid = "";
            $sent = getPhpUser()["deliver_info"];
            $date = time();
            $res = exeSql("SELECT usrid,bookid FROM aplinfo WHERE aplid='$aplid' and aplSta=1");
            while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
                array_push($sids,$aplid);
                $fromUsrid = $row["usrid"];
                $bookid = $row["bookid"];
                $res2 = exeSql("SELECT deliver_info FROM usrinfo WHERE usrid='$fromUsrid'");
                while($row2=mysqli_fetch_array($res,MYSQLI_ASSOC)){
                    $sent = $row2["deliver_info"];
                    break;
                }
                exeSql("UPDATE aplinfo SET aplSta=0 WHERE aplid='$aplid'");
                exeSql("INSERT INTO dlvinfo SET aplid='$aplid',fromUsrid='$fromUsrid',toUsrid='$toUsrid',bookid='$bookid',sent_info='$sent',rcpt_info='$rcpt',date='$date'");
                break;
            }
        }
        for($i=0;$i<sizeof($ids);$i++){
            if(in_array($ids[$i],$sids)) continue;
            array_push($nids,getApply($ids[$i]));
        }
        return $nids;
    }

    function generateSpecialOrder($json,$rcpt,$usrid){
        $data = array();
        $ids = (array)json_decode($json);
        //generate price
        $whereClause = "";
        for($i=0;$i<sizeof($ids);$i++){
            $whereClause .= "aplid=".$ids[$i];
            if($i!=sizeof($ids)-1) $whereClause .= " or ";
        }
        $res = exeSql("SELECT price,bookid FROM aplinfo WHERE $whereClause");
        $price = 0;
        $whereClause2 = "";
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $price += $row["price"];
            $whereClause2 .= "bookid=".$row["bookid"]." or ";
        }
        $price = round($price,2);
        $whereClause2 = substr($whereClause2,0,strlen($whereClause2)-4);
        $usrid = getPhpUser()["usrid"];
        $res = exeSql("SELECT coins FROM usrinfo WHERE usrid='$usrid'");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $balance = round($row["coins"],2);
            if($balance<$price){
                $data["coins_err"] = 1;
                $data["coins_me"] = $balance;
                $data["coins_needed"] = $price;
                return $data;
            }
            break;
        }
        $missids = generateOrder($json,$rcpt);
        $okayids = array();
        for($i=0;$i<sizeof($ids);$i++){
            if(!in_array($ids[$i],$missids)) array_push($okayids,$ids[$i]);
        }
        $data["miss"] = $missids;
        $time = time();
        $booknames = "";
        $res = exeSql("SELECT names FROM bokinfo WHERE $whereClause2");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $booknames = rawurldecode($row["names"]) . ", ";
        }
        $booknames = substr($booknames,0,strlen($booknames)-2);
        $content = rawurlencode("兑换书籍 - $booknames");
        $data["coins"] = $price;
        exeSql("INSERT INTO trsinfo SET fromUsrid='$usrid', toUsrid='SPECIAL', date=$time , content='$content' , value=$price");
        exeSql("UPDATE usrinfo SET coins=coins-$price WHERE usrid='$usrid'");
        exeSql("UPDATE usrinfo SET coins=coins+$price WHERE usrid='SPECIAL'");
        return $data;
    }

    function getOrderInfo($id){
        $res0 = exeSql("SELECT * FROM dlvinfo WHERE dlvid='$id'");
        while($row0=mysqli_fetch_array($res0,MYSQLI_ASSOC)){
            $bookid = $row0["bookid"];
            $res = exeSql("SELECT bookid,picpath,names,authorid FROM bokinfo WHERE bookid='$bookid'");
            while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
                $row0["names"] = rawurldecode($row["names"]);
                //handling author
                $aurStr = $row["authorid"];
                $aurStrArr = explode(":",$aurStr);
                $aurArr = array();
                $aurLinkArr = array();
                for($i=0;$i<sizeof($aurStrArr);$i++){
                    $aurname = "";
                    $aurLink = "";
                    if(strpos($aurStrArr[$i],"id_")!==false){
                        $aurid = substr($aurStrArr[$i],3);
                        $aurLink = $aurid;
                        $res2 = exeSql("SELECT names FROM aurinfo WHERE aurid='$aurid'");
                        $aurname = "";
                        while($row2=mysqli_fetch_array($res2,MYSQLI_ASSOC)){
                            $aurname = rawurldecode($row2["names"]);
                            break;
                        }
                    }else{
                        $aurname = rawurldecode($aurStrArr[$i]);
                    }
                    array_push($aurArr,$aurname);
                    array_push($aurLinkArr,$aurLink);
                }
                $row0["author"] = $aurArr;
                $row0["authorLink"] = $aurLinkArr;
                //handling picture
                $images = explode(":",$row["picpath"]);
                $row0["images"] = array();
                for($i=0;$i<sizeof($images);$i++){
                    if($images[$i]=="") continue;
                    array_push($row0["images"],$images[$i]);
                }
            }
            $row0["aplinfo"] = getApply($row0["aplid"]);
            return $row0;
        }
    }

    function getToUsrDlv($toUsrid,$sta="",$time=0,$page=0){
        $pageRl = 10;
        $pageStart = $page*$pageRl;
        $pageEnd = $page*$pageRl+$pageRl;
        $addStr = "";
        if($sta!=""){
            $addStr = "and status='$sta'";
        }else{
            $addStr = "";
        }
        $res = exeSql("SELECT dlvid FROM dlvinfo WHERE toUsrid='$toUsrid' $addStr and date>=$time ORDER BY date DESC LIMIT $pageStart,$pageEnd");
        $arr = array();
        $count = 0;
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            array_push($arr,getOrderInfo($row["dlvid"]));
            $count++;
        }
        $arr["rlen"] = $count;
        $res = exeSql("SELECT count(dlvid) FROM dlvinfo WHERE toUsrid='$toUsrid' $addStr and date>=$time ORDER BY date DESC");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $arr["len"] = $row["count(dlvid)"];
            break;
        }
        return $arr;
    }

    function getFromUsrDlv($fromUsrid,$sta="",$time=0,$page=0){
        $pageRl = 10;
        $pageStart = $page*$pageRl;
        $pageEnd = $page*$pageRl+$pageRl;
        $addStr = "";
        if($sta!=""){
            $addStr = "and status='$sta'";
        }else{
            $addStr = "";
        }
        $res = exeSql("SELECT dlvid FROM dlvinfo WHERE fromUsrid='$fromUsrid' $addStr and date>=$time ORDER BY date DESC LIMIT $pageStart,$pageEnd");
        $arr = array();
        $count = 0;
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            array_push($arr,getOrderInfo($row["dlvid"]));
            $count++;
        }
        $arr["rlen"] = $count;
        $res = exeSql("SELECT count(dlvid) FROM dlvinfo WHERE fromUsrid='$fromUsrid' $addStr and date>=$time ORDER BY date DESC");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $arr["len"] = $row["count(dlvid)"];
            break;
        }
        return $arr;
    }

    function setDlvUID($dlvid){
        $f = true;
        $uid = "";
        while($f==true){
            $uid = randomStr2("nW",5)."-".randomStr2("nW",5)."-".randomStr2("nW",5);
            $res = exeSql("SELECT count(uid) FROM dlvinfo WHERE uid='$uid'");
            $count = 0;
            while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
                $count = $row["count(uid)"];
                break;
            }
            if($count==0) $f = false;
        }
        exeSql("UPDATE dlvinfo SET uid='$uid' WHERE dlvid='$dlvid'");
        return $uid;
    }

    function getDlvUID($dlvid){
        $res = exeSql("SELECT uid FROM dlvinfo WHERE dlvid='$dlvid'");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            return $row["uid"];
        }
    }

    function buyConfirm($dlvid){
        updateStatus($dlvid,2);
        $autoName1 = "auto_eva_$dlvid"."_insert";
        $autoName2 = "auto_eva_$dlvid"."_update";
        $autoTime1 = date("Y-m-d H:i:s",time()+monthInt);
        $autoTime2 = date("Y-m-d H:i:s",time()+monthInt+1);
        $usrid="";
        $bookid="";
        $usrname = getPhpUser()["nickname"];
        $contents="%28%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7%EF%BC%8C%E6%9A%82%E6%97%A0%E8%AF%84%E8%AE%BA%29";
        $res = exeSql("SELECT fromUsrid,bookid FROM dlvinfo WHERE dlvid='$dlvid'");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $usrid=$row["fromUsrid"];
            $bookid=$row["bookid"];
            break;
        }
        createEvent($autoName1,$autoTime1,"INSERT into evainfo(dlvid,usrid,bookid,usrname,contents,evanum) SELECT $dlvid as dlvid,'$usrid' as usrid, $bookid as bookid,'$usrname' as usrname, '$contents' as contents,10 as evanum FROM dlvinfo WHERE dlvinfo.evaid='' and dlvinfo.dlvid=$dlvid and dlvinfo.status=2;");
        createEvent($autoName2,$autoTime2,"UPDATE dlvinfo a INNER JOIN (SELECT * FROM evainfo) b on a.dlvid=b.dlvid SET a.evaid = concat('auto_',b.evaid) WHERE b.dlvid='$dlvid' and a.evaid='' and a.status=2");
    }

    function createEvent($name,$time,$sql){
        exeSql("CREATE EVENT $name ON SCHEDULE AT '$time' ON COMPLETION NOT PRESERVE ENABLE DO ".$sql);
    }

    function cancelOrder($dlvid){
        $row = updateStatus($dlvid,-1);
        $aplid = $row["aplid"];
        $clientUsrid = $row["toUsrid"];
        exeSql("UPDATE aplinfo SET aplSta=1 WHERE aplid='$aplid'");
        echo $aplid;
        $res = exeSql("SELECT usrid,price,bookid FROM aplinfo WHERE aplid='$aplid'");
        while ($row=mysqli_fetch_array($res,MYSQLI_ASSOC)) {
            if($row["usrid"]=="SPECIAL"){
                $bookid = $row["bookid"];
                $p = $row["price"];
                exeSql("UPDATE usrinfo SET coins=coins-$p WHERE usrid='SPECIAL'");
                exeSql("UPDATE usrinfo SET coins=coins+$p WHERE usrid='$clientUsrid'");
                $bookname = "";
                $res2 = exeSql("SELECT names FROM bokinfo WHERE bookid='$bookid'");
                while($row2=mysqli_fetch_array($res2,MYSQLI_ASSOC)){
                    $bookname = rawurldecode($row2["names"]);
                    break;
                }
                $content = rawurlencode("兑换书籍取消订单退款 - $bookname");
                $date = time();
                exeSql("INSERT INTO trsinfo SET fromUsrid='SPECIAL', toUsrid='$clientUsrid', content='$content', date='$date', value='$p'");
                break;
            }
        }
    }

    function returnOrder($dlvid){
        updateStatus($dlvid,3);
    }

    function canReturnOrder($dlvid){
        updateStatus($dlvid,2);
    }

    function cfmReturnOrder($dlvid){
        updateRtnStatus($dlvid,1);
    }

    function cfmRcvRtnOrder($dlvid){
        $row = updateRtnStatus($dlvid,2);
        $aplid = $row["aplid"];
        $clientUsrid = $row["toUsrid"];
        $res = exeSql("SELECT usrid,price,bookid FROM aplinfo WHERE aplid='$aplid'");
        while ($row=mysqli_fetch_array($res,MYSQLI_ASSOC)) {
            if($row["usrid"]=="SPECIAL"){
                $bookid = $row["bookid"];
                $p = $row["price"];
                exeSql("UPDATE usrinfo SET coins=coins-$p WHERE usrid='SPECIAL'");
                exeSql("UPDATE usrinfo SET coins=coins+$p WHERE usrid='$clientUsrid'");
                $bookname = "";
                $res2 = exeSql("SELECT names FROM bokinfo WHERE bookid='$bookid'");
                while($row2=mysqli_fetch_array($res2,MYSQLI_ASSOC)){
                    $bookname = rawurldecode($row2["names"]);
                    break;
                }
                $content = rawurlencode("兑换书籍退货退款 - $bookname");
                $date = time();
                exeSql("INSERT INTO trsinfo SET fromUsrid='SPECIAL', toUsrid='$clientUsrid', content='$content', date='$date', value='$p'");
                updateRtnStatus($dlvid,3);
                break;
            }
        }
    }

    function cfmPayback($dlvid){
        updateRtnStatus($dlvid,3);
    }

    function updateStatus($dlvid,$status){
        exeSql("UPDATE dlvinfo SET status='$status' WHERE dlvid='$dlvid'");
        $res = exeSql("SELECT aplid,toUsrid FROM dlvinfo WHERE dlvid='$dlvid'");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            return $row;
        }
    }

    function updateRtnStatus($dlvid,$status){
        exeSql("UPDATE dlvinfo SET returnStatus='$status' WHERE dlvid='$dlvid'");
        $res = exeSql("SELECT aplid,toUsrid FROM dlvinfo WHERE dlvid='$dlvid'");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            return $row;
        }
    }

    function comment($dlvid,$comments,$num,$confirmed){
        if($confirmed=="") $confirmed = 0;
        $f = false;
        $evaid = "";
        $pref = $evaid==""?"INSERT INTO evainfo ":"UPDATE evainfo ";
        $postf = $evaid==""?"":" WHERE evaid='$evaid'";
        $usrid="";
        $toUsrid = "";
        $bookid="";
        $usrname = getPhpUser()["nickname"];
        $contents=$comments;
        $res = exeSql("SELECT evaid,fromUsrid,toUsrid,bookid FROM dlvinfo WHERE dlvid='$dlvid'");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $f = $row["evaid"]!="";
            if(strpos($row["evaid"],"auto_")!==false){
                $f = false;
                $evaid = substr($row["evaid"],5);
            }
            if($f) return;
            $usrid=$row["fromUsrid"];
            $toUsrid=$row["toUsrid"];
            $bookid=$row["bookid"];
            break;
        }
        exeSql($pref."SET dlvid=$dlvid, usrid='$usrid', bookid=$bookid, usrname='$usrname', contents='$contents', evanum=$num, confirmed=$confirmed".$postf);
        $upevaid = 0;
        $res = exeSql("SELECT evaid FROM evainfo WHERE dlvid='$dlvid'");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            $upevaid = $row["evaid"];
        }
        exeSql("UPDATE dlvinfo SET evaid='$upevaid' WHERE dlvid=$dlvid");
        if($confirmed){
            $coins_add = 3;
            exeSql("UPDATE usrinfo SET coins=coins+$coins_add WHERE usrid='$toUsrid'");
            $date = time();
            $bookname = "";
            $res = exeSql("SELECT names FROM bokinfo WHERE bookid='$bookid'");
            while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
                $bookname = rawurldecode($row["names"]);
                break;
            }
            $content = rawurlencode("评价购买商品 - $bookname");
            exeSql("INSERT INTO trsinfo SET value='$coins_add',toUsrid='$toUsrid',content='$content',date='$date'");
        }
    }

    function getTransaction($usrid,$page){
        if($page==null) $page=0;
        if($page=="") $page=0;
        $pageR = 10;
        $lob = $page * $pageR;
        $upb = $page * $pageR + $pageR;
        $res = exeSql("SELECT * FROM trsinfo WHERE toUsrid='$usrid' or fromUsrid='$usrid' LIMIT $lob,$upb");
        $arr = array();
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
          array_push($arr,$row);
        }
        $trans = array();
        $trans["trans"] = $arr;
        $page_count = 0;
        $res = exeSql("SELECT count(trsid) FROM trsinfo WHERE toUsrid='$usrid' or fromUsrid='$usrid'");
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
          $o = $row["count(trsid)"];
          $page = intval($o/$pageR);
          if($o%$pageR!=0) $page+=1;
          $trans["page_count"] = $page;
          break;
        }
        return $trans;
    }

    $key = getArray($_POST,"key");
    if($key=="generateOrder"){
        echo json_encode(generateOrder(getArray($_POST,"id"),getArray($_POST,"receipt")));
    }elseif($key=="generateSpecialOrder"){
        echo json_encode(generateSpecialOrder(getArray($_POST,"id"),getArray($_POST,"receipt"),getArray($_POST,"usrid")));
    }elseif($key=="getOrderInfo"){
        echo json_encode(getOrderInfo(getArray($_POST,"id")));
    }elseif($key=="getToUsrDlv"){
        $page = getArray($_POST,"page");
        if($page=="") $page=0;
        echo json_encode(getToUsrDlv(getArray($_POST,"toUsrid"),getArray($_POST,"sta"),getArray($_POST,"time"),intval($page)));
    }elseif($key=="getFromUsrDlv"){
        $page = getArray($_POST,"page");
        if($page=="") $page=0;
        echo json_encode(getFromUsrDlv(getArray($_POST,"fromUsrid"),getArray($_POST,"sta"),getArray($_POST,"time"),intval($page)));
    }elseif($key=="setDlvUID"){
        echo setDlvUID(getArray($_POST,"id"));
    }elseif($key=="updateStatus"){
        updateStatus(getArray($_POST,"id"),getArray($_POST,"sta"));
    }elseif($key=="buyConfirm"){
        buyConfirm(getArray($_POST,"id"));
    }elseif($key=="cancelOrder"){
        cancelOrder(getArray($_POST,"id"));
    }elseif($key=="returnOrder"){
        returnOrder(getArray($_POST,"id"));
    }elseif($key=="canReturnOrder"){
        canReturnOrder(getArray($_POST,"id"));
    }elseif($key=="cfmReturnOrder"){
        cfmReturnOrder(getArray($_POST,"id"));
    }elseif($key=="cfmRcvRtnOrder"){
        cfmRcvRtnOrder(getArray($_POST,"id"));
    }elseif($key=="cfmPayback"){
        cfmPayback(getArray($_POST,"id"));
    }elseif($key=="comment"){
        comment(getArray($_POST,"id"),getArray($_POST,"comments"),getArray($_POST,"num"),getArray($_POST,"confirmed"));
    }elseif($key=="getUID"){
        echo getDlvUID(getArray($_POST,"id"));
    }elseif($key=="getTransaction"){
        echo json_encode(getTransaction(getArray($_POST,"id"),getArray($_POST,"page")));
    }
?>