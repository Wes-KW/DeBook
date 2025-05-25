<?php

function vrfyEmailFormat($mail){
    return filter_var($mail,FILTER_VALIDATE_EMAIL)!==false;
}

function vrfyEmailExist($mail){
    $ep = explode("@",$mail);
    return checkdnsrr(array_pop($ep));
}

function sendEmail($Receiver,$Rcname,$Subject,$Body,$AltBody){
    try{
        //check email address before sending
        if(vrfyEmailFormat($Receiver)){
            if(vrfyEmailExist($Receiver)){
                $html = "<html><head><title>$Subject</title></head><body>$Body</body></html>";
                $headers  = 'MIME-Version: 1.0' . "\r\n";
                $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
                $headers .= 'From: Nawaski.com <no-reply@nawaski.com>' . "\r\n";
                # From 163.com <test_mail1024@163.com>
                mail($Receiver,$Subject,$html,$headers);
            }else{
                return "Invalid Email to: ".$Receiver;
            }
        }else{
            return "Invalid Email Format";
        }
    }catch (Exception $e){
        return $e;
    }
}