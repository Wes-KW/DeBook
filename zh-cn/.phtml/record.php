<?php
    include 'more/echoSql.phtml';

    function recordData(){
        $cb = getArray($_POST,"usrinfo");
        $date = getArray($_POST,"date");
        $ip = getClientIP();
        $object = getArray($_POST,"data");
        echo exeSql("INSERT INTO coninfo SET contributor='$cb', date='$date', ip='$ip', object='$object'");
    }

    function recordFbkData($email,$data){
        $ip = getClientIP();
        $date = time();
        echo exeSql("INSERT INTO fbkinfo SET contributor='$email', date='$date', ip='$ip', content='$data'");
    }

    $key = getArray($_POST,"recordKey");
    if($key=="record"){
        recordData();
    }elseif($key=="recordFbk"){
        recordFbkData(getArray($_POST,"email"),getArray($_POST,"data"));
    }
?>