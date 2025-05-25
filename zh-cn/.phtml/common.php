<?php
    function getLabelNameByID($labelid){
        $sql = "SELECT label_name FROM lblinfo WHERE labelid = '$labelid'";
        $res = exeSql($sql);
        while($row=mysqli_fetch_array($res,MYSQLI_ASSOC)){
            return $row["label_name"];
        }
    }
?>