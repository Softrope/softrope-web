var activeScenes=[];

	activeScenes[0] = {"context" : new AudioContext(), "scene" : "none"};
	activeScenes[1] = {"context" : new AudioContext(), "scene" : "none"};
	activeScenes[2] = {"context" : new AudioContext(), "scene" : "none"};
	activeScenes[3] = {"context" : new AudioContext(), "scene" : "none"};
	activeScenes[4] = {"context" : new AudioContext(), "scene" : "none"};
	//activeScenes[5] = {"context" : new AudioContext(), "scene" : "none"};
	
	activeScenes[0].context.destination.maxChannelCount = 8;
	activeScenes[1].context.destination.maxChannelCount = 8;
	activeScenes[2].context.destination.maxChannelCount = 8;
	activeScenes[3].context.destination.maxChannelCount = 8;
	activeScenes[4].context.destination.maxChannelCount = 8;
	//activeScenes[5].context.destination.maxChannelCount = 8;
	
	activeScenes[0].context.destination.channelCountMode = "explicit";
	activeScenes[1].context.destination.channelCountMode = "explicit";
	activeScenes[2].context.destination.channelCountMode = "explicit";
	activeScenes[3].context.destination.channelCountMode = "explicit";
	activeScenes[4].context.destination.channelCountMode = "explicit";
	//activeScenes[5].context.destination.channelCountMode = "explicit";
	
	activeScenes[0].context.destination.channelInterpretation = "discrete";
	activeScenes[1].context.destination.channelInterpretation = "discrete";
	activeScenes[2].context.destination.channelInterpretation = "discrete";
	activeScenes[3].context.destination.channelInterpretation = "discrete";
	activeScenes[4].context.destination.channelInterpretation = "discrete";
	//activeScenes[5].context.destination.channelInterpretation = "discrete";

	activeScenes[0].context.destination.channelCount = activeScenes[0].context.destination.maxChannelCount;
	activeScenes[1].context.destination.channelCount = activeScenes[0].context.destination.maxChannelCount;
	activeScenes[2].context.destination.channelCount = activeScenes[0].context.destination.maxChannelCount;
	activeScenes[3].context.destination.channelCount = activeScenes[0].context.destination.maxChannelCount;
	activeScenes[4].context.destination.channelCount = activeScenes[0].context.destination.maxChannelCount;
	//activeScenes[5].context.destination.channelCount = 2;
var context;
var buffer;
var convolver;
var panner;
var source;
var dryGainNode;
var wetGainNode;

var lowFilter;
var gTopProjection = 0;
var gFrontProjection = 0;

var x = 0;
var y = 0;
var z = 0;
var hilightedElement = 0;
var bufferList;




var kInitialReverbLevel = 0.6;
function mixToMono(buffer) {
    if (buffer.numberOfChannels == 2) {
        var pL = buffer.getChannelData(0);
        var pR = buffer.getChannelData(1);
        var length = buffer.length;
        
        for (var i = 0; i < length; ++i) {
            var mono = 0.5 * (pL[i] + pR[i]);
            pL[i] = mono;
            pR[i] = mono;
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
			
var app = angular.module('TabletopApp',['ui.slider']);

app.controller('playSceneController', ['$scope', '$interval','$timeout','$http', function($scope, $interval,$timeout,$http) {
    $http.get("module1.json")
    .success(function(response) {
		$scope.module = response;
		console.log($scope.module);
		$scope.sceneList = $scope.module.scenes;
		});	
			$scope.closeScene = function(i){
			for(i=0;i<5;i++){
				if(activeScenes[i].closeTime != 0 && activeScenes[i].closeTime <= activeScenes[i].context.currentTime){
					for(j=0;j<$scope.module.scenes[activeScenes[i].scene].Effects.length;j++){
						$scope.module.scenes[activeScenes[i].scene].Effects[j].NextPlay = 0;
					}
			activeScenes[i].context.close();
			activeScenes[i] = {"context" : new AudioContext(), "scene" : "none"};
			activeScenes[i].context.destination.maxChannelCount = 8;
			activeScenes[i].context.destination.channelCountMode = "explicit";
			activeScenes[i].context.destination.channelInterpretation = "discrete";
			activeScenes[i].context.destination.channelCount = activeScenes[i].context.destination.maxChannelCount;
		}}};
		
		$scope.toggleScene = function(sceneName){
			for(i=0;i<5;i++){
				if(activeScenes[i].scene == sceneName){
					
					var currTime = activeScenes[i].merger.context.currentTime;
					console.log(currTime);
					console.log(activeScenes[i]);
					activeScenes[i].gainNode.gain.linearRampToValueAtTime(activeScenes[i].gainNode.gain.value, currTime);
					activeScenes[i].gainNode.gain.linearRampToValueAtTime(0, currTime + ($scope.module.scenes[sceneName].SceneFadeOut));
					activeScenes[i].closeTime = currTime + ($scope.module.scenes[sceneName].SceneFadeOut);
					$timeout(function() { $scope.closeScene() }, $scope.module.scenes[sceneName].SceneFadeOut*1000);
					return;
				}
			}
			for(i=0;i<5;i++){
				if(activeScenes[i].scene == "none"){
					activeScenes[i].scene = sceneName;
				for(j=0;j<$scope.module.scenes[sceneName].Effects.length;j++){
					if($scope.module.scenes[sceneName].Effects[j].PreDelay){
						var d = new Date();
						var n = d.getTime();
						$scope.module.scenes[sceneName].Effects[j].NextPlay = getRandomInt($scope.module.scenes[sceneName].Effects[j].DelayL*1000,$scope.module.scenes[sceneName].Effects[j].DelayH*1000)+n;
					}
				}
				return;
				}
			}

		};
		

		$scope.checkScenes = function(){
			for(i=0;i<5;i++){
			if(activeScenes[i].scene != "none"){
				for(j=0;j<$scope.module.scenes[activeScenes[i].scene].Effects.length;j++){
					var d = new Date();
					var n = d.getTime();
					if($scope.module.scenes[activeScenes[i].scene].Effects[j].NextPlay<n+500){
					var d = new Date();
					var n = d.getTime();
					$scope.module.scenes[activeScenes[i].scene].Effects[j].NextPlay = n + 20000;
					var chan = "all";
						//function playSound(i,chan) {
				var source = activeScenes[i].context.createBufferSource(); // creates a sound source
				   // Load asynchronously
				var perChance=0;
				for(k=0;k<$scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds.length;k++){perChance += $scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].Chance;}
				var perRoll = getRandomInt(1,perChance);
				perChance=0;
				for(k=0;k<$scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds.length;k++){
				   perChance += $scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].Chance;
				   if(perChance>perRoll){
					   var url = $scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].FileName;
					   break;
				   }
				}
					
				var cents = $scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].PitchSet;
				cents = cents + getRandomInt(-$scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].PitchVar,$scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].PitchVar * 2);

				var rate = Math.pow(2.0, cents / 1200.0);
				source.playbackRate.value = rate;
					var request = new XMLHttpRequest();
					request.open("GET", url+"?"+i+","+j+","+k, true);
					request.responseType = "arraybuffer";

					request.onload = function() {
						var param = request.responseURL.split("?")[1];
						param = param.split(",");
						var i = param[0];
						var j = param[1];
						var k = param[2];
						activeScenes[i].context.decodeAudioData(
							request.response,
							function(buffer) {
								mixToMono(buffer);
								source.buffer = buffer;
					var d = new Date();
					var n = d.getTime();
			
					var playlength = buffer.duration*1000;
					$scope.module.scenes[activeScenes[i].scene].Effects[j].NextPlay = getRandomInt($scope.module.scenes[activeScenes[i].scene].Effects[j].DelayL*1000,$scope.module.scenes[activeScenes[i].scene].Effects[j].DelayH*1000)+playlength+n-($scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].FadeIn*1000);

				if($scope.module.scenes[activeScenes[i].scene].Effects[j].Loop){
					var duration = buffer.duration;
						var merger = activeScenes[i].context.createChannelMerger(8);
						var gainNode = merger.context.createGain();
						activeScenes[i].merger = merger;
						activeScenes[i].merger.connect(gainNode);
						activeScenes[i].gainNode = gainNode;
					var gainSet = ($scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].SoundVol/100)*($scope.module.scenes[activeScenes[i].scene].Effects[j].EffectVol/100)*($scope.module.scenes[activeScenes[i].scene].SceneVol/100);
					console.log($scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].SoundVol);
					console.log($scope.module.scenes[activeScenes[i].scene].Effects[j].EffectVol);
					console.log($scope.module.scenes[activeScenes[i].scene].SceneVol);
					console.log(gainSet);
					var currTime = activeScenes[i].merger.context.currentTime;
					source.connect(activeScenes[i].merger, 0, 0);
					source.connect(activeScenes[i].merger, 0, 1);
					source.connect(activeScenes[i].merger, 0, 2);
					source.connect(activeScenes[i].merger, 0, 3);
					source.connect(activeScenes[i].merger, 0, 4);
					source.connect(activeScenes[i].merger, 0, 5);
					source.connect(activeScenes[i].merger, 0, 6);
					source.connect(activeScenes[i].merger, 0, 7);
					activeScenes[i].gainNode.connect(activeScenes[i].context.destination);
					// loop = attach to gain node.  else NEW gain node and set gain variance for random loc
				  // Fade the playNow track in.
				  activeScenes[i].gainNode.gain.linearRampToValueAtTime(0, currTime);
				  activeScenes[i].gainNode.gain.linearRampToValueAtTime(gainSet, currTime + ($scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].FadeIn));
				  // Play the playNow track.
				//merger.connect(activeScenes[i].context.destination);
				console.log("Playing sound "+$scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].SoundName+" from "+$scope.module.scenes[activeScenes[i].scene].Effects[j].EffectName+" in scene "+activeScenes[i].scene);
				  source.start(0);
					console.log(activeScenes[i]);
				  // At the end of the track, fade it out.
				  activeScenes[i].gainNode.gain.linearRampToValueAtTime(gainSet, currTime + duration-$scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].FadeOut);
				  activeScenes[i].gainNode.gain.linearRampToValueAtTime(0, currTime + duration);
				}
				else{
				var merger = activeScenes[i].context.createChannelMerger(8);
				var silence = activeScenes[i].context.createBufferSource();
				var gainSet = ($scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].SoundVol/100)*($scope.module.scenes[activeScenes[i].scene].Effects[j].EffectVol/100)*($scope.module.scenes[activeScenes[i].scene].SceneVol/100);
					console.log($scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].SoundVol);
					console.log($scope.module.scenes[activeScenes[i].scene].Effects[j].EffectVol);
					console.log($scope.module.scenes[activeScenes[i].scene].SceneVol);
					console.log(gainSet);
				var channelMax = (activeScenes[i].context.destination.maxChannelCount-2);
				var channelplayed;
				if(activeScenes[i].context.destination.maxChannelCount< 3){(channelMax = 1)}
				if($scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].RandLoc){
					silence.connect(merger, 0, 0);
					silence.connect(merger, 0, 1);
					silence.connect(merger, 0, 2);
					silence.connect(merger, 0, 3);
					silence.connect(merger, 0, 4);
					silence.connect(merger, 0, 5);
					silence.connect(merger, 0, 6);
					channelplayed =  getRandomInt(0,channelMax);
					source.connect(merger, 0,channelplayed);
					gainSet = getRandomInt(gainSet*0.2,gainSet);
				}
				else{
					source.connect(merger, 0, 0);
					source.connect(merger, 0, 1);
					source.connect(merger, 0, 2);
					source.connect(merger, 0, 3);
					source.connect(merger, 0, 4);
					source.connect(merger, 0, 5);
					source.connect(merger, 0, 6);
					source.connect(merger, 0, 7);
					channelplayed = "all";
				}
				gainSet = gainSet/100;
				// loop = attach to gain node.  else NEW gain node and set gain variance for random loc
					var duration = buffer.duration;
					var currTime = merger.context.currentTime;
					var gainNode = merger.context.createGain();
					merger.connect(gainNode);
					gainNode.connect(activeScenes[i].context.destination);
				  // Fade the playNow track in.
				  gainNode.gain.linearRampToValueAtTime(0, currTime);
				  gainNode.gain.linearRampToValueAtTime(gainSet, currTime + ($scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].FadeIn));
				  // Play the playNow track.
				//merger.connect(activeScenes[i].context.destination);
				console.log("Playing sound "+$scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].SoundName+" from "+$scope.module.scenes[activeScenes[i].scene].Effects[j].EffectName+" in scene "+activeScenes[i].scene+" at gain:"+gainSet+" from speaker "+channelplayed);
				  source.start(0);
				  // At the end of the track, fade it out.
				  gainNode.gain.linearRampToValueAtTime(gainSet, currTime + duration-$scope.module.scenes[activeScenes[i].scene].Effects[j].Sounds[k].FadeOut);
				  gainNode.gain.linearRampToValueAtTime(0, currTime + duration);
				}
				
				  },
							function(buffer) {
								console.log("Error decoding audio source data!");
							}
						);
					}
					request.send();
					return;
					}
				}
			}
		}
		};
	
}]);

  app.directive('myCurrentTime', ['$interval', 'dateFilter',
      function($interval, dateFilter) {
        // return the directive link function. (compile function not needed)
        return function(scope, element, attrs) {
          var stopTime; // so that we can cancel the time updates

          // used to update the UI
          function updateTime() {
			var d = new Date();
			var n = d.getTime();
			scope.time = n;
          }

          // watch the expression, and update the UI on change.
          scope.$watch(attrs.myCurrentTime, function() {
            updateTime();
          });

          stopTime = $interval(scope.checkScenes, 100);

          // listen on DOM destroy (removal) event, and cancel the next UI update
          // to prevent updating time after the DOM element was removed.
          element.on('$destroy', function() {
            $interval.cancel(stopTime);
          });
        }
      }]);
	  
app.controller('updateSceneController', ['$scope', '$http', function($scope, $http) {
    $http.get("module1.json")
    .success(function(response) {
		$scope.module = response;
		console.log($scope.module);
		$scope.sceneList = $scope.module.scenes;
		});	
		
	$scope.add = function(addType,sceneName,effectName){
		switch(addType){
			case "sound":
				for(i=0;$scope.module.scenes[sceneName].Effects.length;i++){
					if($scope.module.scenes[sceneName].Effects[i].EffectName == effectName){
						$scope.module.scenes[sceneName].Effects[i].Sounds.push({
						  "SoundName": "NewSound",
						  "FileName": "sounds/",
						  "SoundVol": 100,
						  "PitchSet": 0,
						  "PitchVar": 0,
						  "Reverb": false,
						  "Chance": 100,
						  "FadeIn": 0,
						  "FadeOut": 0,
						  "RandLoc": false
						});
						break;
			}
				}
				
				break;
			case "effect":
				$scope.module.scenes[sceneName].Effects.push({
					  "EffectName": "NewEffect",
					  "Sounds": [
						{
						  "SoundName": "NewSound",
						  "FileName": "sounds/",
						  "SoundVol": 100,
						  "PitchSet": 0,
						  "PitchVar": 0,
						  "Reverb": false,
						  "Chance": 100,
						  "FadeIn": 0,
						  "FadeOut": 0,
						  "RandLoc": false
						}
					  ],
					  "EffectVol": 100,
					  "Loop": false,
					  "DelayL": 0,
					  "DelayH": 0,
					  "NextPlay": 0,
					  "PreDelay": false,
					  "Optional": 0,
					  "Seq": false
					});
				
				break;
			case "scene":

				$scope.module.scenes[sceneName] = {
				  "Effects": [
					{
					  "EffectName": "NewEffect",
					  "Sounds": [
						{
						  "SoundName": "NewSound",
						  "FileName": "sounds/",
						  "SoundVol": 100,
						  "PitchSet": 0,
						  "PitchVar": 0,
						  "Reverb": false,
						  "Chance": 100,
						  "FadeIn": 0,
						  "FadeOut": 0,
						  "RandLoc": false
						}
					  ],
					  "EffectVol": 100,
					  "Loop": false,
					  "DelayL": 0,
					  "DelayH": 0,
					  "NextPlay": 0,
					  "PreDelay": false,
					  "Optional": 0,
					  "Seq": false
					}
				  ],
				  "SceneVol": 100,
				  "SceneFadeIn": 2,
				  "SceneFadeOut": 2,
				  "SceneSolo": 0,
				  "SceneName": "New Scene",
				  "SceneIMG": "/images/CombatMusic.png"
				};
					break;
			}
		};

	$scope.hideElements = [];
        $scope.toggleHide = function(scene) {
			if($scope.hideElements[scene] == null){$scope.hideElements[scene] = false;}
            $scope.hideElements[scene] = $scope.hideElements[scene] == false ? true: false;
        };
		
	$scope.save = function(){
		for(key in $scope.module.scenes){
			if(key != $scope.module.scenes[key].SceneName){
				$scope.module.scenes[$scope.module.scenes[key].SceneName] = $scope.module.scenes[key];
				delete $scope.module.scenes[key];
			}
		}
		$http.post('/save.php', $scope.module).
			then(function(response) {
			}, function(response) {
			});
	};	
}]);

app.controller('combatController', ['$scope', '$filter','$http', function($scope, $filter, $http) {
  $scope.combatLog='';
	
	  $scope.rollDice = function(roll){
	  if(roll=="-"){return "";}
	  var result=0;
	  var reg = /[0-9]+d[0-9]+/g;
	  var vMatch;
	  var tRoll;
	  roll = String(roll);
	  console.log(roll);
	  vMatch = roll.match(reg);
	  console.log(vMatch);
	  if(vMatch == null){vMatch=[];}
	  for(r=0;r<vMatch.length;r++){
	  tRoll = vMatch[r].split("d");
	  for(i=0;i<tRoll[0];i++){
		  result = result+getRandomInt(1, tRoll[1]);
	  }
	  roll = roll.replace(vMatch[r],result);
	  }
	  reg = /[0-9,\+,-]+/g;
	  vMatch = roll.match(reg);
	  console.log(vMatch);
	  for(r=0;r<vMatch.length;r++){
		  console.log(vMatch[r]+" "+eval(vMatch[r]));
	  roll = roll.replace(vMatch[r],eval(vMatch[r]));
	  }

	  // while (vMatch != null) {
	  // vMatch = roll.match(reg);
	  // if(vMatch == null){continue;}
	  // tRoll = vMatch[0].split("d");
	  // for(i=0;i<tRoll[0];i++){
		  // result = result+Math.floor((Math.random()*tRoll[1])+1);
	  // }
	  // roll = roll.replace(vMatch[0],result);

	  // }
	  return roll;
}

  $scope.Action = function(actor,mod,adv){
    adv = adv || "";
    if(mod == null){
      mod = {bonus:"+0",aname:"Straight d20"+adv};
    }
	console.log(mod.bonus);
	if(mod.bonus==""){
		$scope.combatLog = actor + ', ' + mod.aname + ": " + $scope.rollDice(mod.damage) + mod.special + '\n' + $scope.combatLog;
		return;
	}

    var result1 = getRandomInt(1,20);
    var result2 = getRandomInt(1,20);
	var fullResult;
    console.log(result1);
    switch(adv){
      case 'a':
		fullResult =  eval(Math.max(result1,result2)+mod.bonus);
		if(mod.damage){fullResult = "Hit AC" + fullResult + " for " + $scope.rollDice(mod.damage) + " ";}
		if(mod.special){fullResult = fullResult + mod.special;}
        $scope.combatLog = actor + ', ' + mod.aname + ": " +fullResult + '\n' + $scope.combatLog;
        break;
      case 'd':
		fullResult = eval(Math.min(result1,result2)+mod.bonus);
		if(mod.damage){fullResult = "Hit AC" + fullResult + " for " + $scope.rollDice(mod.damage) + " ";}
		if(mod.special){fullResult = fullResult + mod.special;}
        $scope.combatLog = actor + ', ' + mod.aname + ": " + fullResult + '\n' + $scope.combatLog;
        break;
      default:
		fullResult = eval(result1+mod.bonus);
		if(mod.damage){fullResult = "Hit AC" + fullResult + " for " + $scope.rollDice(mod.damage) + " ";}
		if(mod.special){fullResult = fullResult + mod.special;}
        $scope.combatLog = actor + ', ' + mod.aname + ": " + fullResult + '\n' + $scope.combatLog;
    }
  }

 var orderBy = $filter('orderBy');
  $scope.combatants = [{"name":"Syven","turn":0},{"name":"Xenon","turn":0},{"name":"Mackenzie","turn":0},{"name":"Sarah","turn":0}];

  $http.get("monsters.json")
    .success(function(response) {
		$scope.monsters = response;
		});	

		$scope.order = function(e) {
    $scope.combatants = orderBy($scope.combatants, ['turn','-init','name'], false);
	var highest = orderBy($scope.combatants, 'turn', true);
	$scope.currentTurn = highest[0]['turn'];
  };

  $scope.addComb = function(monster){
    console.log(monster);
	var tempmon = monster;
	if($scope.currentTurn == null){$scope.currentTurn = 0;}
//		tempmon.hp = eval($scope.rollDice(tempmon.hp));
//		tempmon.init = eval($scope.rollDice(tempmon.init));
//		tempmon.turn = $scope.currentTurn;
//	  $scope.combatants[$scope.combatants.length]=tempmon;
	  
	  	  $scope.combatants[$scope.combatants.length]={ 'name': monster.name
		  ,'hp': eval($scope.rollDice(monster.hp))
		  ,'init': eval($scope.rollDice(monster.init))
		  ,'turn':$scope.currentTurn
		  , 'ac':eval($scope.rollDice(monster.ac))
		  , 'attacks':monster.attacks
		  , 'skills':monster.skills
		  , 'str':monster.str
		  , 'dex':monster.dex
		  , 'con':monster.con
		  , 'int':monster.int
		  , 'wis':monster.wis
		  , 'cha':monster.cha
		  , 'strsave':monster.strsave
		  , 'dexsave':monster.dexsave
		  , 'consave':monster.consave
		  , 'intsave':monster.intsave
		  , 'wissave':monster.wissave
		  , 'chasave':monster.chasave
		  , 'senses':monster.senses
		  , 'size':monster.size
		  , 'special':monster.special
		  , 'legendary':monster.legendary
		  }

  };
      }])
