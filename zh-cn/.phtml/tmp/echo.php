<?php
    function getRealPath($path){
        $arr = explode("/",$path);
        $rpath = "";
        for($i=0;$i<count($arr);$i++){
            if($arr[$i]===".."){
                if(strpos($rpath,"/")!==false){
                    $rpath = substr($rpath,0,strripos($rpath,"/"));
                }
            }else if($arr[$i]==="."||$arr[$i]===""){
            }else{
                $rpath .= "/".$arr[$i];
            }
        }
        $rpath = substr($rpath,1,strlen($rpath)-1);
        if(strpos($rpath,"/")===strlen($rpath)-1) $rpath = substr($rpath,0,strlen($rpath)-1);
        return $rpath;
    }
?>