<?php
    include_once 'vrfylogin.php';

    function hideMsg($id){
        $hideMsg = array();
        if(isset($_SESSION["hiddenMsg"])) $hideMsg = $_SESSION["hiddenMsg"];
        array_push($hideMsg,$id);
        setSession("hiddenMsg",$hideMsg);
    }

    $key = getArray($_POST,"key");
    if($key=="hideMsg"){
        hideMsg(getArray($_POST,"id"));
    }
?>