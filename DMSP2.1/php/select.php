<?php
    header('Content-Type:application/json;charset=UTF-8');
    header('Access-Control-Allow-Origin');
    require('init.php');
    $sql="select * from reply";
    $result=mysqli_query($conn,$sql);
        $rows=mysqli_fetch_all($result,1);
            if($rows){
                echo json_encode($rows);
            }else{
                echo"failed";
            }
?>