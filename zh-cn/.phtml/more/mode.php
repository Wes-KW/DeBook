<?php

header("Content-Type:text/html;charset=utf-8");

class simpleMYSQL {
	public $servername;
    public $username;
    public $pwd;
    public $dbname;
	public $conn;
				
    public function sqlQuery($sql){
		if($this->conn==null) $this->conn = mysqli_connect($this->servername,$this->username,$this->pwd);
		if($this->conn->connect_error) die("Connection Error: " .$this->conn->connect_error);
		mysqli_select_db( $this->conn, $this->dbname);
		$retval = mysqli_query($this->conn, $sql);			
		if(!$retval) die('Unable to read: ' . mysqli_error($this->conn));
		return $retval;			
	}
				
	public function closeConnect(){
		mysqli_close($this->conn);
	}
             
	public function nrSqlQuery($sql){
		if($this->conn==null) $this->conn = mysqli_connect($this->servername,$this->username,$this->pwd);
		if($this->conn->connect_error) die("Connection Error: ".$this->conn->connect_error);
		mysqli_select_db($this->conn, $this->dbname);
		$retval = mysqli_query($this->conn, $sql);
		if(!$retval) die('Unable to read: ' . mysqli_error($this->conn));
	}
}

function getArray($Array,$key,$count = 0){
    $text = "";
    if(is_array($Array)&&count($Array)>$count){
        if(isset($Array[$key])){
            $text = $Array[$key];
        }
    }
    return $text;
}

function browse_info() {
    if (!empty($_SERVER['HTTP_USER_AGENT'])) {
        $br = $_SERVER['HTTP_USER_AGENT'];
		$nstr = "";
        if (preg_match('/MSIE/i', $br)) {
            $nstr = 'msie';
        } else if (preg_match('/MicroMessenger/i', $br)) {
            $nstr = 'qqbrowser';
        } else if (preg_match('/Firefox/i', $br)) {
            $nstr = 'firefox';
        } else if (preg_match('/Chrome/i', $br)) {
            $nstr = 'chrome';
        } else if (preg_match('/Safari/i', $br)) {
            $nstr = 'safari';
        } else if (preg_match('/Opera/i', $br)){
            $nstr = 'opera';
		}  else {
            $nstr = 'other';
        }
        return $nstr;
    } else {
        return 'unknow';
    }
}

function decodeInfo($text){
	return json_decode(urldecode(base64_decode($text)),true);
}

function writeInfo($text){
	if($text==""){
		return "(空)";
	}else{
		return $text;
	}
}

function arrm($arr,$key){
	if(isset($arr[$key])){
		return $arr[$key];
	}else{
		return "";
	}
}
?>