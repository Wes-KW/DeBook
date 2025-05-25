<?php
	session_start();
	date_default_timezone_set("Asia/Shanghai");
	include 'more/echoSql.phtml';
	onload();

	function decodeInfo2($json){
        return (array)json_decode(rawurldecode(base64_decode($json)));
    }

    function onload(){
		$browser = browse_info();
		if(!isset($_SESSION["msg_db_$browser"])){
			setSession("msg_db_$browser",array(1));
		}

		if(!isset($_SESSION["user_db_$browser"])||$_SESSION["user_db_$browser"]==""){
			if(isset($_COOKIE["user_db_$browser"])&&$_COOKIE["user_db_$browser"]!=""&&isset($_COOKIE["password_db_$browser"])&&$_COOKIE["password_db_$browser"]!=""){
				$usrid = $_COOKIE["user_db_$browser"];
				$result = exeSql("SELECT pwd FROM usrinfo WHERE usrid='$usrid' or email='$usrid';");
				$p = null;
				While($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){
					$p = $row["pwd"];
				}
				if($_COOKIE["password_db_$browser"]==base64_encode($p)){
					record($_COOKIE["user_db_$browser"],0);
				}
			}
		}
	}
	
	function record($usrid,$num){
		$result = exeSql("SELECT * FROM usrinfo WHERE usrid='$usrid' or email='$usrid';");
		$browser = browse_info();
		$p = null;
		While($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){
			$p = $row;
		}
		$p["logtime"] = time();
		setSession("user_db_$browser",$p);
		
		if((int)$num){
			//long time login
			//needs to set cookie
			$now = time();
			setcookie("user_db_$browser",$usrid,time()+2592000,'/');
			setcookie("password_db_$browser",base64_encode($p['pwd']),time()+2592000,'/');
		}
	}

	function adminRecord($usrid){
		$browser = browse_info();
		setSession("admin_db_$browser",$usrid);
	}
	
	function updateSessionData($key,$value){
		$browser = browse_info();
		$p = $_SESSION["user_db_$browser"];
		$p[$key] = $value;
		$_SESSION["user_db_$browser"] = $p;
	}
	
	function getJsonUser(){
		$browser = browse_info();
		if(isset($_SESSION["user_db_$browser"])&&$_SESSION["user_db_$browser"]!=""){
			$info = $_SESSION["user_db_$browser"];
			echo json_encode($info);
		}else{
			echo json_encode("");
		}
	}

	function checkUsr(){
		$browser = browse_info();
		if(isset($_SESSION["user_db_$browser"])&&$_SESSION["user_db_$browser"]!=""){
			$usrid = $_SESSION["user_db_$browser"]["usrid"];
			$data = exeSql("SELECT * FROM usrinfo WHERE usrid='$usrid'");
			$info = array();
			while($row = mysqli_fetch_array($data,MYSQLI_ASSOC)){
				$info = $row;
				break;
			}
			if(isset($_SESSION["pwd_changed"])&&$_SESSION["pwd_changed"]=="1"){
				$info["pwd_changed"] = "1";
			}
			if(sizeof($info)!=0){
				echo json_encode($info);
			}else{
				echo json_encode("");
			}
		}else{
			echo json_encode("");
		}
	}
	
	function getPhpUser(){
		$browser = browse_info();
		if(isset($_SESSION["user_db_$browser"])&&$_SESSION["user_db_$browser"]!=""){
			$info = $_SESSION["user_db_$browser"];
			return $info;
		}else{
			return null;
		}	
	}

	function getPhpAdmin(){
		$browser = browse_info();
		if(isset($_SESSION["admin_db_$browser"])&&$_SESSION["admin_db_$browser"]!=""){
			$info = $_SESSION["admin_db_$browser"];
			return $info;
		}else{
			return "";
		}
	}
	
	function setEmailCode($code){
		$browser = browse_info();
		setSession("ec_db_$browser",$code);
		echo getArray($_SESSION,"ec_db_$browser");
	}

	function vrfyEC($code){
		$browser = browse_info();
		if(getArray($_SESSION,"ec_db_$browser")=="") return false;
		if(md5($code)!=getArray($_SESSION,"ec_db_$browser")) return false;
		return true;
	}

	function msg($directs,$key,$value){
		$browser = browse_info();
		if($directs=="status"){
			return $_SESSION["msg_db_$browser"];
		}else if($directs=="change"){
			$_SESSION["msg_db_$browser"][(int)$key] = (int)$value;
		}
	}

	function clearUsr(){
		$browser = browse_info();
		setcookie("user_db_$browser","",time()-36000,"/");
		setcookie("password_db_$browser","",time()-36000,"/");
		setSession("user_db_$browser","",time()-1000);
	}

	function clearAdmin(){
		$browser = browse_info();
		setSession("admin_db_$browser","",time()-1000);
	}

	function autologout(){
		if(!isset($_COOKIE["user_db_$browser"])||$_COOKIE["user_db_$browser"]==""){
			session_destroy();
		}
	}
	
	$direct = getArray($_POST,"direct");
	if($direct=="jsonUsr"){
		getJsonUser();
	}else if($direct=="login"){
		record(getArray($_POST,"usrid"),(int)getArray($_POST,"mode"));
	}else if($direct=="clear"){
		clearUsr();
	}else if($direct=="update"){
		updateSessionData(getArray($_POST,"key"),getArray($_POST,"value"));
	}else if($direct=="msg"){
		msg(getArray($_POST,"directs"),getArray($_POST,"key"),getArray($_POST,"value"));
	}else if($direct=="session_end"){
		autologout();
	}else if($direct=="adminLogin"){
		adminRecord(getArray($_POST,"admin"));
	}else if($direct=="adminLogout"){
		clearAdmin();
	}else if($direct=='phpAdmin'){
		getPhpAdmin();
	}else if($direct=='usrCheck'){
		checkUsr();
	}else if($direct=='setECCode'){
		setEmailCode(getArray($_POST,"e_code"));
	}
?>