<?php
// New Connection
$db = new mysqli('localhost','admin','password','gmappdb');

// Check for errors
if(mysqli_connect_errno()){
echo mysqli_connect_error();
}

// 1st Query
$result = $db->query("SELECT * FROM stats");
if($result){
echo "[";
     // Cycle through results
    while ($row = $result->fetch_object()){

		$sub_result = $db->query("SELECT * FROM attacks WHERE name = '".$row->name."'");
    while ($sub_row = $sub_result->fetch_object()){$row->attacks[]=$sub_row;}
		$sub_result = $db->query("SELECT * FROM skills WHERE name = '".$row->name."'");
    while ($sub_row = $sub_result->fetch_object()){$row->skills[]=$sub_row;}
	echo str_replace("<\/","</",json_encode($row));
	echo ",";
	}
echo "]";
}


?>