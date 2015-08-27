<?php

Class CitySpawn{

// Check for errors
  public function __construct(){
	  $this->db = new mysqli('localhost','admin','password','gmappdb');

	  if(mysqli_connect_errno()){
	echo mysqli_connect_error();
}

$this->raceStats = array();

$result = $this->db->query("SELECT * FROM race");
     // Cycle through results
    while ($row = $result->fetch_object()){$this->raceStats[$row->Name]=$row;}
  }
  
function advanceYear(){
$result = $this->db->query("SELECT * FROM citizens WHERE Alive = 1");
if($result){

     // Cycle through results

    while ($row = $result->fetch_object()){

 $cRace = $this->raceStats[$row->Race];
 
 if($cRace->Venerable < $row->Age){$deathChance = 4000/$cRace->Venerable;}
 else{$deathChance = ($row->Age*$row->Age)/($this->raceStats[$row->Race]->MaxAge*20);}
 
 if(rand(1,100)<$deathChance){
	$Dead = $this->db->query("UPDATE gmappdb.citizens SET Alive = 0 WHERE idcitizens = {$row->idcitizens}");
	
 }
 else{
  $friendRate = $this->normal(($row->Age*(20/$cRace->MaxAge)),4,3)*(45*$cRace->FriendRate);
  
 if($cRace->FriendRate<=$row->Friends){
	  if(($cRace->FriendRate*2)<=$row->Friends){$friendRate = $friendRate/5;}
	$friendRate = $friendRate/3;}
	
if($row->Gender == "Female"){
	$birthRate = $this->normal(($row->Age*(20/$cRace->MaxAge)),6,1.2)*(85*$cRace->BirthRate);
if($cRace->BirthRate<=$row->Children){
	  if(($cRace->BirthRate*2)<=$row->Children){$birthRate = $birthRate/5;}
	$birthRate = $birthRate/3;}
	if($row->Married == 1){
	 if(rand(1,100)<$birthRate){$this->assembleTheMinions($row);}	
	}
	elseif($row->Married == 0){
	 if(rand(1,100)<($birthRate/10)){$this->assembleTheMinions($row);}	
	}
}

if($row->Married == 0 AND $row->Gender == "Male" AND $row->Age>=$cRace->Adult){
	if(rand(1,100)<160/($cRace->MiddleAge-$cRace->Adult)){$this->weddingBells($row);}
}
  $enemyRate = $this->normal(($row->Age*(20/$cRace->MaxAge)),10,2)*(45*$cRace->EnemyRate);
  
 if($cRace->EnemyRate<=$row->Enemies){
	  if(($cRace->EnemyRate*2)<=$row->Enemies){$enemyRate = $enemyRate/5;}
	$enemyRate = $enemyRate/3;}

	
 if(rand(1,100)<$friendRate){$this->newFriend($row);}
 if(rand(1,100)<$enemyRate){$this->newEnemy($row);}
 

 }
	}
	
		$AgeUp = $this->db->query("UPDATE gmappdb.citizens SET Age = Age+1 WHERE Alive = 1");
		$EpochUp = $this->db->query("UPDATE gmappdb.kingdomage SET epoch = epoch+1");

}


	}




function newFriend($citizen){
	$citizen->Friends = $citizen->Friends+1;
	$AddFriend = $this->db->query("UPDATE gmappdb.citizens SET Friends = {$citizen->Friends} WHERE idcitizens = {$citizen->idcitizens}");
}

function newEnemy($citizen){
	$citizen->Enemies = $citizen->Enemies+1;
	$AddEnemy = $this->db->query("UPDATE gmappdb.citizens SET Enemies = {$citizen->Enemies} WHERE idcitizens = {$citizen->idcitizens}");
}

function weddingBells($citizen){

	$marryAge = $this->raceStats[$citizen->Race]->Adult - $this->raceStats[$citizen->Race]->MiddleAge/10;
	$wife = $this->db->query("SELECT * FROM gmappdb.citizens WHERE Gender = 'Female' AND Age < $citizen->Age+5 AND Age > $marryAge AND Married = 0 ORDER BY RAND() LIMIT 1");
	//echo "SELECT * FROM gmappdb.citizens WHERE Gender = 'Female' AND Age < $citizen->Age+5 AND Age > $marryAge AND Married = 0 ORDER BY RAND() LIMIT 1";
	while ($row = $wife->fetch_object()){
//		echo $row->idcitizens."<br>";
	//	echo $citizen->idcitizens;
		$marriage = $this->db->query("UPDATE gmappdb.citizens SET Married = 1, Spouse = $row->idcitizens WHERE idcitizens = {$citizen->idcitizens}");
		$marriage = $this->db->query("UPDATE gmappdb.citizens SET Married = 1, LastName = '{$citizen->LastName}', Spouse = {$citizen->idcitizens} WHERE idcitizens = $row->idcitizens");
	}

}

function assembleTheMinions($citizen){
//echo "New Child<br>";
	$citizen->Children = $citizen->Children+1;
	$MoreMinions = $this->db->query("UPDATE gmappdb.citizens SET Children = {$citizen->Children} WHERE idcitizens = {$citizen->idcitizens}");
	if(Rand(1,2)==1){$gender="Male";}
	else{$gender="Female";}
	$name = $this->db->query("SELECT * FROM (SELECT * FROM gmappdb.names_given WHERE nGender = '$gender' ORDER BY RAND() LIMIT 1) as name JOIN (SELECT Concat(Special,'\nMannerism: ',Mannerism,'\nTalent: ',Talent,'\nTrait: ',Trait,'\nAbilities:  ',Ability,'\nFeature: ',Feature) AS About FROM (SELECT IF(FLOOR(1 + (RAND() * 99))<=5,Special,'') as Special FROM gmappdb.npc_special ORDER BY RAND() LIMIT 1) as special 
	JOIN (SELECT Mannerism FROM gmappdb.npc_mannerisms ORDER BY RAND() LIMIT 1) as mannerism
	JOIN (SELECT Talent FROM gmappdb.npc_talent ORDER BY RAND() LIMIT 1) as talent
	JOIN (SELECT Trait FROM gmappdb.npc_interaction ORDER BY RAND() LIMIT 1) as interaction
	JOIN (SELECT CONCAT(AbilityHigh,', ',AbilityLow) AS Ability FROM gmappdb.npc_abilities ORDER BY RAND() LIMIT 1) as abilhigh
	JOIN (SELECT Feature FROM gmappdb.npc_feature ORDER BY RAND() LIMIT 1) as feature) AS aboutt");
	while ($row = $name->fetch_object()){$firstname = $row->name;$about = $row->About;}
	$result = $this->db->query("INSERT INTO gmappdb.citizens SET Age = 1, FirstName = '$firstname', LastName = '{$citizen->LastName}', Race = 'Human', Gender = '$gender', Father = {$citizen->Spouse}, Mother = {$citizen->idcitizens}, About = '$about'");
}

 
 
 function normal($x, $mu, $sigma) {
    return exp(-0.5 * ($x - $mu) * ($x - $mu) / ($sigma*$sigma))
        / ($sigma * sqrt(2.0 * M_PI));
}

}

$kingdom = new CitySpawn;

	$kingdom->advanceYear();

//die();

$i = 2;
while ($i <= $_REQUEST['years']) {
    $i++;  
	$kingdom->advanceYear();

}
	  $db = new mysqli('localhost','admin','password','gmappdb');
	$result = $db->query("SELECT Avg(Age),Count(Alive), Avg(Friends), Avg(Enemies),Avg(Children),epoch FROM gmappdb.citizens JOIN gmappdb.kingdomage WHERE Alive = 1");
if($result){

     // Cycle through results
    while ($row = $result->fetch_object()){
		print_r($row);
		echo "<br>";
}}

?>;