<?php

function vrfyEmailFormat($mail){
    return filter_var($mail,FILTER_VALIDATE_EMAIL)!==false;
}

function vrfyEmailExist($mail){
    $ep = explode("@",$mail);
    return checkdnsrr(array_pop($ep));
}

function sendEmail($Receiver,$Rcname,$Subject,$Body,$AltBody) {
    try{
        //check email address before sending
        if(vrfyEmailFormat($Receiver)){
            if (vrfyEmailExist($Receiver)) {
                $dateStr = date('D, d M Y H:i:s O');
                $headers  = "MIME-Version: 1.0\r\n";
                $headers .= "Content-type: text/html; charset=UTF-8\r\n";
                $headers .= "From: \"noreply\" <apache@me.v>\r\n";
                $headers .= "To: \"DeBook Customer\" <$Receiver>\r\n";
                $headers .= "Return-Path: apache@me.v\r\n";
                $headers .= "Date: $dateStr\r\n";
                $headers .= "X-Mailer: DeBook mailer\r\n";
                $headers .= "Message-ID: <debook." . time() . "." . uniqid() . "@me.v>\r\n";
                $html = "<html><head><title>$Subject</title></head><body>$Body</body></html>";
                mail($Receiver, $Subject, $html, $headers);
            } else {
                return "Invalid Email to: " . $Receiver;
            }
        }else{
            return "Invalid Email Format";
        }
    }catch (Exception $e){
        return $e;
    }
}