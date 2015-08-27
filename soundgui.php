<!DOCTYPE html>
<html>
<head>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
<script src="app.js"></script>
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="resources/css/slider.css">
    <script src="resources/js/slider.js"></script>
<style>
input {
  border:0px;
  text-align: center;
  background:transparent;
}
input[type="checkbox"]{
	margin-left:80px;
}


div.Sounds{
	margin-top: 10px;
	
}


table.Sounds input{    width: 100%;}

ul li img{width:100%;}
.row{max-width:100%;}

@media screen and (max-width: 300px) {
    body {
        background-color: lightblue;
    }
}

.Scenes > li{
	width:90%;
	margin:auto;
	padding-top:1%;
	border:1px solid black;
	border-radius:20px;
	position:relative;
	background-color: #ABCAE4;
}

.Scenes{
	width:100%;
}

.Effects {
	padding-left: 120px;
	margin-top:15px;
}
.Effects > li{
	width:90%;
	margin:auto;
	margin-top:1%;
	margin-bottom:3%;
	padding-bottom:3%;
	border:1px solid black;
	border-top-right-radius:20px;
	border-bottom-left-radius:20px;
	text-align: left;	
	background-color:#E8E1CE;
}

div.Sounds{
	text-align:center;
}
ul.Sounds{
	text-align:left;
	display:inline-block;
}
ul.Sounds{
	width:930px;
}
.Sounds > li{
	
	border:1px solid black;
	padding: 10px;
	background-color:lightgrey;
}
h4{
	text-align:left;
	margin-left:10px;
	position: relative;
    display: inline-block;
    top: -14px;
}
h4 input[type="text"]{
	border:0px;
	text-align:left;
	width:200px;
	max-width:200px;
}

.slidercontainer{
	width:250px;	
	position:relative;
	display:inline-block;
	margin-left:0px;
	padding-left:0px;
}

.slidercontainer input{
	border:0px;
	position: absolute;
    top: 4px;	
	width:40px;
	font-size: 75%;
}

.slidercontainer input:first-child{
	left: 3px;
}
.slidercontainer input:nth-child(2){
	right:-23px;
	
}
.slidercontainer span{
	position: absolute;
    right: 45px;
    top: 4px;
    font-weight: 700;
}
.eVol{
	display:inline-block;
	margin-left:20px;
	    text-align: center;
}
.eVol span{
	font-weight: 700;
    position: relative;
    top: 33px;
}
.eVol input{
	    position: relative;
    top: -6px;
}
	
}
</style>
</head>
<body style="overflow:auto">
<div class="content" ng-app="TabletopApp">
<div ng-controller="updateSceneController">

						<div style="width:90%;text-align:right;margin:auto; 
    margin-bottom: 10px;"><button type="button" class="btn btn-default" ng-click="save()">Save Changes</button><button type="button" class="btn btn-default" ng-click="add('scene','AAAAAANewScene')"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button></div>
<style>
.Scenes > li > div:first-of-type {
	padding-left:20px;
}
.Scenes > li > div > input:first-of-type {
	width:250px;max-width:250px;text-align:left;font-size: 180%;
}
.Scenes > li > div > img:first-of-type {
	height:140px;width:auto;border-radius:5px;margin-left:10px;position:absolute;left:0px;top: 70px;
}
.Scenes > li > div > label:nth-of-type(2) {
	position: absolute;top: 0px;
}
.Scenes > li > div > div  label:first-of-type {
	position: absolute;top: 0px;padding-left: 47px;
}
.Scenes > li > div   label:first-of-type {
	    margin-right: 20px;
}
.Scenes > li > div  input:nth-of-type(3) {
margin-left:4px;width:35px;border: 1px solid black;
}
.Scenes > li > div  input:nth-of-type(4) {
width:35px;border: 1px solid black;
}
.Scenes > li > div > div  input:first-of-type {
width:200px;
}
.Scenes > li > div:first-of-type > div{
	display:inline-block;margin-left:20px;
}
.optionals{
	display:inline-block;
}
</style>
      <ul ng-repeat="(key, scenes) in sceneList | orderBy:key"  class="list-unstyled Scenes" style="display:inline-block;margin-top:15px;">
      <li >
	  <div ><input style="" type="text" ng-model="scenes.SceneName"  /> <button type="button" style="margin-bottom: 10px;" class="btn btn-default" ng-click="toggleHide(scenes.SceneName)" ><span class="glyphicon glyphicon-plus" aria-hidden="true">/<span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button>
			<img src="{{scenes.SceneIMG}}" data-ng-click=""  ng-hide="hideElements[scenes.SceneName]" />
			<input type="checkbox" id="solo" ng-model="scenes.SceneSolo" ng-hide="hideElements[scenes.SceneName]" /> <label ng-hide="hideElements[scenes.SceneName]" for="solo">Solo</label> 
			<label ng-hide="hideElements[scenes.SceneName]" >Fade In/Out</label>
			<input ng-hide="hideElements[scenes.SceneName]" type="number" ng-model="scenes.SceneFadeIn" />
			<input ng-hide="hideElements[scenes.SceneName]" type="number" ng-model="scenes.SceneFadeOut" />
			<div >
			<label ng-hide="hideElements[scenes.SceneName]" >Scene Volume</label>

			<input ng-hide="hideElements[scenes.SceneName]" type="range" style="" min="1" max="100"  ng-model="scenes.SceneVol" /></div>
			</div>
			<ul ng-hide="hideElements[scenes.SceneName]" ng-repeat="Effect in scenes.Effects" class="list-unstyled Effects" style="">
			 <li>			
	  <h4><input type="text" ng-model="Effect.EffectName" /></h4>
<ul class="slidercontainer">
<input type="number" ng-model="Effect.DelayL">
<input type="number" ng-model="Effect.DelayH">
<span>Delay Range <small>(seconds)</small></span>
        <slider floor="0" ceiling="600" ng-model-low="Effect.DelayL" ng-model-high="Effect.DelayH"></slider>
</ul>

			<div class="eVol" ><span>Effect Volume</span><input type="range" min="1" max="100" ng-model="Effect.EffectVol" /></div>
			<div class="optionals"><input id="loop" type="checkbox" ng-model="Effect.Loop" /> <label for="loop">Loop</label> 
			<input type="checkbox" id="optional" ng-model="Effect.Optional" /> <label for="optional">Optional</label>
			<input type="checkbox" id="predelay" ng-model="Effect.PreDelay" /> <label for="predelay">Pre-Delay</label>
			<input type="checkbox" id="sequential" ng-model="Effect.Seq" /> <label for="sequential">Sequential</label> </div>
<style>
table.Sounds thead th{
	text-align:center;
	vertical-align: bottom;
}
table.Sounds tbody td:nth-child(1),table thead th:nth-child(1),table.Sounds tbody td:nth-child(2),table thead th:nth-child(2){
  width:200px;
  text-align:left;
}
table.Sounds tbody td:nth-child(4),table.Sounds tbody td:nth-child(5){
  width:35px;
}
table.Sounds tbody td:nth-child(6),table.Sounds tbody td:nth-child(7),table.Sounds tbody td:nth-child(8),table.Sounds tbody td:nth-child(9){
  width:40px;
}
table.Sounds tbody td:nth-child(1) input,table tbody td:nth-child(2) input{
	text-align:left;
  
}
.Sounds input{
	margin-left:0px;
}
table.Sounds{
	border-spacing: 0px 10px;
    border-collapse: separate;
	margin:auto;
	
}
table.Sounds tbody td{
	border-top:1px solid black;
	border-bottom:1px solid black;
	background-color: #8FC2DA;
	padding-top:3px;
	padding-bottom:3px;
}

table.Sounds tbody td:first-child{
	border-left:1px solid black;
	border-top-left-radius:30px;
	border-bottom-left-radius:30px;
	padding-left: 5px;
}

table.Sounds tbody td:last-child{
	border-right:1px solid black;
	border-top-right-radius:30px;
	border-bottom-right-radius:30px;
	padding-right: 5px;
}

</style>
				<div class="Sounds" style="">
				<table class="Sounds"><thead><tr><th>Sound Name</th><th>File Name</th><th>Chance to play</th><th colspan="2">Fade<br>In / Out</th><th>Pitch Set</th><th>Pitch Var</th><th>Rand</th><th>Reverb</th><th>Sound Volume</th></thead>
				<tbody  >
					<tr ng-repeat="Sound in Effect.Sounds">
					 <td><input type="text" ng-model="Sound.SoundName" /></td>
					 <td><input type="text" ng-model="Sound.FileName" /></td>
					 <td><input type="range" min="1" max="100" ng-model="Sound.Chance" /></td>
					 <td><input type="text" ng-model="Sound.FadeIn" /></td>
					 <td><input type="text" ng-model="Sound.FadeOut" /></td>
					 <td><input type="text" ng-model="Sound.PitchSet" /></td>
					 <td><input type="text" ng-model="Sound.PitchVar" /></td>
					 <td><input type="checkbox" ng-model="Sound.RandLoc" /></td>
					 <td><input type="checkbox" ng-model="Sound.Reverb" /></td>
					 <td><input type="range" min="1" max="100" ng-model="Sound.SoundVol" /></td>
					</tr>	
				</tbody>
				</table>
				<div style="width:930px;text-align:right;margin:auto;"><button type="button" class="btn btn-default"  ng-click="add('sound',key, Effect.EffectName)"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button></div>
				</div>
			</li>
			</ul>
						<div ng-hide="hideElements[scenes.SceneName]" style="width:90%;text-align:right;margin:auto; margin-top: -30px;
    margin-bottom: 10px;"><button type="button" class="btn btn-default" ng-click="add('effect',key)" ><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button></div>
</li>
    </ul>

</div>
</div>