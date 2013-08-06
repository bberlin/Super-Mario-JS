// Super Mario JS
// created By Ben Berlin
// Mario is copyright by Nintendo
// http://www.supermariojs.com



$(function(){
	
	var level = {
		
		rightDown:false,
		leftDown:false,
		upDown:false,
		shiftDown:false,
		mario : {},
		objects : [],
		activeObjects : [],
		items : [],
		floors : [],
		enemies : [],
		activeEnemies : [],
		objectLevel : document.getElementById("level").getContext("2d"),
		enemyLevel : document.getElementById("enemies").getContext("2d"),
		marioLevel : document.getElementById("mario").getContext("2d"),
		itemLevel : document.getElementById("items").getContext("2d"),
		collisions : [false,false,false,false], //top,right,bottom,left
		
		update : function(){
		  var z = this;
		  z.checkCollisions();
		  
		  if(z.upDown){
		    z.mario.jump();
		  }else if(z.rightDown){
		    z.mario.moveRight();
		  }else if(z.leftDown){
		    z.mario.moveLeft();
		  }else {
			z.mario.stand();  
		  }
		  z.clear()
		  z.mario.draw();
		 
		  for(var e = 0; e < z.enemies.length; e++){
			  var enemy = z.enemies[e],
			  edx = enemy.get('currentDX'),
			  esw = enemy.get('currentSWidth'),
			  active = enemy.get('active');
			  //console.log(edx);
			  if(!enemy.get('destroyed') &&  edx > (0 - esw) && edx <= 225 + esw){
			  	 enemy.update();
				 enemy.draw();
				 enemy.set('active', true);
				 z.activeEnemies.push(enemy);
			  }else if(active){
				 enemy.set('active', false);
				 z.activeEnemies.splice(z.activeEnemies.indexOf(enemy),1);
			  }
		  }
		 
		  for(var k = 0; k < z.objects.length; k++){
			  var cur = z.objects[k];
			  if(!cur.destroyed && cur.currentDX > (0 - cur.currentSWidth) && cur.currentDX <= 225 + cur.currentSWidth){
				  cur.update();
				  cur.draw();
			      cur.active = true;
			      if(!cur.ignore){
					  z.activeObjects.push(cur);
				  }
			  } else if(cur.active){
					cur.active = false;
					z.activeObjects.splice(z.objects.indexOf(cur),1);  
			  }
		  }
		  for(var l = 0; l < z.items.length; l++){
			  var cur = z.items[l];
			  if(!cur.destroyed && cur.currentDX > (0 - cur.currentSWidth) && cur.currentDX <= 225 + cur.currentSWidth){
				  cur.update();
				  cur.draw();
			      cur.active = true;
			  } else if(cur.active){
					cur.active = false;  
			  }
		  }
		  
		  if(z.mario.get('currentDY')  > 224){
			  z.mario.die();
		  } else {
		  		setTimeout(function(){z.update();}, 1000/60);
		  }
		},
		
		checkCollisions : function(){
			var z = this,
			mright = z.mario.get('currentDX') + z.mario.get('currentDWidth'),
			mleft = z.mario.get('currentDX'),
			mtop = z.mario.get('currentDY'),
			mbottom = z.mario.get('currentDY') + z.mario.get('currentDHeight'),
			mdirection = z.mario.get('direction');
			z.collisions = [false,false,false,false];
			
			for(var i =0; i < z.items.length; i++){
				var item = z.items[i],
				itop = item.currentDY,
				ileft = item.currentDX,
				ibottom = item.currentDY + item.currentDHeight,
				iright = item.currentDX + item.currentDWidth;
				z.items[i].collisions = [false, false, false, false];
				if(item.ready && mright > ileft && mleft < iright && mbottom > itop && mtop < ibottom){
					item.hit();
				} 
			}
			
			for(var k=0; k < z.activeObjects.length; k++){ 
				var cur = z.activeObjects[k];
				if(cur.active){
					if(mtop > cur.currentDY && mtop < cur.currentDY + cur.currentDHeight && mleft+2 < cur.currentDX + cur.currentDWidth && mright-2 > cur.currentDX){z.collisions[0] = true; 
						var m = mright -8;// Math.abs((mleft+ mright)/2 - (cur.currentDX + cur.currentDX + cur.currentDWidth) / 2);
						
						if(m < cur.currentDX + cur.currentDWidth && m > cur.currentDX){
							cur.hit();	
						}
					}
					if(mright > cur.currentDX && mright < cur.currentDX + cur.currentDWidth && mtop < cur.currentDY + cur.currentDHeight && mbottom-2 > cur.currentDY){ z.collisions[1] = true;}
					if(mbottom > cur.currentDY && mbottom < cur.currentDY + cur.currentDHeight && mleft+2 < cur.currentDX + cur.currentDWidth && mright-2 > cur.currentDX){z.collisions[2] = true;}
					if(mleft > cur.currentDX && mleft < cur.currentDX + cur.currentDWidth && mtop < cur.currentDY + cur.currentDHeight && mbottom-2 > cur.currentDY){ z.collisions[3] = true;}
					
					for(var i =0; i < z.items.length; i++){
						var item = z.items[i],
						itop = item.currentDY,
						ileft = item.currentDX,
						ibottom = item.currentDY + item.currentDHeight,
						iright = item.currentDX + item.currentDWidth;
						
						if(itop > cur.currentDY && itop < cur.currentDY + cur.currentDHeight && ileft+2 < cur.currentDX + cur.currentDWidth && iright-2 > cur.currentDX){z.items[i].collisions[0]=true;}
						if(iright > cur.currentDX && iright < cur.currentDX + cur.currentDWidth && itop < cur.currentDY + cur.currentDHeight && ibottom-2 > cur.currentDY){ z.items[i].collisions[1] = true;}
						if(ibottom > cur.currentDY && ibottom < cur.currentDY + cur.currentDHeight && ileft+2 < cur.currentDX + cur.currentDWidth && iright-2 > cur.currentDX){z.items[i].collisions[2] = true;}
						if(ileft > cur.currentDX && ileft < cur.currentDX + cur.currentDWidth && itop < cur.currentDY + cur.currentDHeight && ibottom-2 > cur.currentDY){ z.items[i].collisions[3] = true;}
					}
					
				}
			}
			
			for(var e=0; e < z.activeEnemies.length; e++){
				var enemy = z.activeEnemies[e],
				etop = enemy.get('currentDY'),
				eleft = enemy.get('currentDX'),
				ebottom = etop + enemy.get('currentDHeight'),
				eright = eleft + enemy.get('currentDWidth'),
				isDying = enemy.get('dying');
				
				if(!isDying){
  				if(mbottom > etop && mbottom < etop+5 && ((mright < eright && mright > eleft) || (mleft > eleft && mleft < eright))){
  					enemy.hit();
  					z.mario.bounce();			
  				}
  				else if((mright > eleft && mright < eleft+5 || mleft < eright && mleft > eright-5) && mtop < ebottom  && mbottom > etop){z.mario.hit();
  				}
				}
				/*
if(etop > mtop && etop < mbottom && eleft+2 < mright && eright-2 > mleft){enemy.hit();}
				if(eright > mleft && eright < mright && etop < mbottom && ebottom-2 > mtop){ console.log("RIGHT");}
				if(ebottom > mtop && ebottom < mbottom && eleft+2 < mright && eright-2 > mleft){console.log("BOTTOM");}
				if(eleft > mleft && ileft < mright && etop < mbottom && ebottom-2 > mbottom){ console.log("LEFT");}
*/
			}
			
			mright = z.mario.get('bkgdPos') + z.mario.get('currentDWidth');
			mleft = z.mario.get('bkgdPos');
			for(var k=0; k < z.floors.length; k++){
				var cur = z.floors[k];
				if(mright > cur.x && mright < cur.x + cur.w && mtop < cur.y + cur.h && mbottom-2 > cur.y){ z.collisions[1] = true;}
				if(mbottom > cur.y && mbottom < cur.y + cur.h && mleft+2 < cur.x + cur.w && mright-2 > cur.x ){z.collisions[2] = true;}
				if(mleft > cur.x && mleft < cur.x + cur.w && mtop < cur.y + cur.h && mbottom-2 > cur.y){ z.collisions[3] = true;}
				for(var i =0; i < z.items.length; i++){
					var item = z.items[i],
					ileft = item.currentDX,
					ibottom = item.currentDY + item.currentDHeight,
					iright = item.currentDX + item.currentDWidth;
					
					if(ibottom > cur.y && ibottom < cur.y + cur.h && ileft+2 < cur.x + cur.w && iright-2 > cur.x ){z.items[i].collisions[2] = true;}
				}
			}
			
			
			
		},
		
		moveWorldLeft : function(){
			var z = this;
			for(var k = 0; k < z.objects.length; k++){
				z.objects[k].currentDX += 1;
			}
			for(var i =0; i < z.items.length; i++){
				z.items[i].currentDX +=1;	
			}
			for(var e =0; e < z.enemies.length; e++){
				var dx = z.enemies[e].get('currentDX');
				dx += 1;
				z.enemies[e].set('currentDX', dx);
			}
			$("#items").css({"background-position":"+=1px 0px"});
		},
		
		moveWorldRight : function(){
			var z = this;
			for(var k = 0; k < z.objects.length; k++){
				z.objects[k].currentDX -= 1;
			}
			for(var i =0; i < z.items.length; i++){
				z.items[i].currentDX -=1;	
			}
			for(var e =0; e < z.enemies.length; e++){
				var dx = z.enemies[e].get('currentDX');
				dx -= 1;
				z.enemies[e].set('currentDX', dx)
			}
			$("#items").css({"background-position":"-=1px 0px"});	
		},
		
		clear : function(){
			this.objectLevel.clearRect(0,0,240,224);
			this.marioLevel.clearRect(0,0,240,224);
			this.itemLevel.clearRect(0,0,240,224);
			this.enemyLevel.clearRect(0,0,240,224);
		},
		
		init : function(){
			console.log("START");
			var z = this;
			z.mario = new mario();
			
			$.getJSON("objects.json", function(json){
				//console.log("OBJECTS",json);
				$.each(json, function(k,v){
					//console.log(v);
					var x,
					ig = v.ignore ? true : false;
					switch(v.type){
						case "brick": 	x = new brick('objects.png', v.sx, v.sy, v.sw, v.sh, v.dx, v.dy, v.dw, v.dh, ig); break;
						case "questionmark": 
							var r = v.reward ? v.reward : "coin";
							x = new questionmark('objects.png', v.sx, v.sy, v.sw, v.sh, v.dx, v.dy, v.dw, v.dh, ig, r); 
						break;
						default : x = new gameObject('objects.png', v.sx, v.sy, v.sw, v.sh, v.dx, v.dy, v.dw, v.dh, ig); break;
					}
					
					if(x)z.objects.push(x);
				});
			});
			
			$.getJSON("enemies.json", function(json){
				
				$.each(json, function(k,v){
					z.enemies.push(new goomba(v));
				});
			});
			
			
			//var d = new floorObject(0,200, 1104,24);
			z.floors.push(new floorObject(0,200, 1104,24));
			z.floors.push(new floorObject(1136,200,240,24));
			z.floors.push(new floorObject(1424,200,1024,24));
			z.floors.push(new floorObject(2480,200,904,24));
			//console.log(z.floors);
			
			$('body').keydown(function(e){
				var key = e.which;
				//console.log(key);
				if(key == 38){
					z.upDown = true;
				}
				else if(key == 39){
					z.rightDown = true;
				}
				else if(key == 37){
					z.leftDown = true;
				}
				/*else if(key == 16){
					z.shiftDown = true;
				}*/
			});
			
			$('body').keyup(function(e){
				var key = e.which;
				if(key == 39){
					z.rightDown = false;	
				}
				else if(key == 37){
					z.leftDown = false;	
				}
				else if(key == 38){
					z.upDown = false;	
				}
				else if(key == 16){
					z.shiftDown = false;	
				}
			});
			
			z.update();
		}
	}
	
	var mario = Backbone.Model.extend({
		//Constants for showing correct sprite
		RIGHT : 0,
		LEFT : 30,
		STAND : 0,
		WALK1 : 18,
		WALK2 : 37,
		TURN : 56,
		JUMP : 74,
		FACE : 93,
		RUN : 111,
		RUN1 : 132,
		RUN2 : 152,
		
		MAXTOP : 70,
		MAXRIGHT : 175,
		XVELOCITY : 1,
		YVELOCITY : 2,
		
		defaults : {
			//variables for placing sprite on canvas 
			currentImage :  new Image(),
			currentSX : 0,
			currentSY : 0,
			currentSWidth: 18,
			currentSHeight: 17,
			currentDX : 0,
			currentDY : 184,
			currentDWidth : 18,
			currentDHeight : 17,
			bkgdPos : 0,
			
			size:'small',
			direction:0, //is facing left or right
			currentHeight: 0, //tracks jump height
			jumpDirection:'UP',
			isJumping: false,
			isBouncing: false,
			currentFrame:1,
			invincible:0
		},
		
		moveRight : function(){
			var z = this;
			
			if(z.get('direction') == z.LEFT && !z.get('isJumping')){
				z.set({direction:z.RIGHT, currentSX:z.TURN, currentSY:z.RIGHT});
			} else{
				if(z.get('currentDX') < z.MAXRIGHT && !level.collisions[1]){ //move the sprite right
					z.set({currentDX: z.get('currentDX') + z.XVELOCITY, bkgdPos : z.get('bkgdPos') + z.XVELOCITY});	
				} else if(!level.collisions[1]){ //move the world right
					level.moveWorldRight();
					z.set({bkgdPos : z.get('bkgdPos') + z.XVELOCITY});
				}
				
				var cf = z.get('currentFrame');
				if(!level.collisions[2]){ //we have not hit a floor so we are falling
					z.set({currentSX:z.JUMP, currentDY: z.get('currentDY')+z.YVELOCITY, currentHeight: z.get('currentHeight')-z.YVELOCITY, jumpDirection:"DOWN"}); 
				}else{ //we are walking
					 if(cf < 6){
						z.set({currentSX : z.WALK2, isJumping:false});
					}else{
						z.set({currentSX : z.WALK1, isJumping:false});
					}
					//z.isJumping = false;
				}
				/*
if(cf == 10){ z.set({currentFrame : 1}); }
				else {z.set({currentFrame:cf+1}); }
*/
			}
		},
		
		moveLeft : function(){
			var z = this,
			curDX = z.get('currentDX');
			
			if(z.get('direction') == z.RIGHT && !z.get('isJumping')){
				z.set({direction:z.LEFT, currentSX:z.TURN, currentSY:z.LEFT});
			} else { 
				if(curDX <= 35 && parseInt($("#items").css("background-position")) < 0 && !level.collisions[3]){ 
					level.moveWorldLeft();
					z.set({bkgdPos: z.get('bkgdPos') - z.XVELOCITY});
				} else if(curDX > 0 && !level.collisions[3]) {
					z.set({currentDX:curDX-z.XVELOCITY, bkgdPos:z.get('bkgdPos')-z.XVELOCITY});
				} 
				
				var csx,
					cf = z.get('currentFrame');
				if(!level.collisions[2]){
					z.set({currentSX:z.JUMP, jumpDirection:"DOWN", currentDY:z.get('currentDY')+z.YVELOCITY, currentHeight:z.get('currentHeight')-z.YVELOCITY});
				}else{ 
					if(cf < 6){
						csx = z.WALK2;
					}else{
						csx = z.WALK1;
					}
					z.set({isJumping:false, currentSX:csx});
				} 
				/*
if(cf == 10){z.set({currentFrame : 1});}
				else{z.set({currentFrame:cf+1});}
*/
			}
		},
		
		jump : function(){
			var z = this,
			curH = z.get('currentHeight'),
			curDY = z.get('currentDY'),
			curDX = z.get('currentDX'),
			curBP = z.get('bkgdPos');
			
			z.set({currentSX : z.JUMP, isJumping:true}); 
			//console.log(curH, z.MAXTOP);
			if(z.get('jumpDirection') === "UP" ){
				if(curH < z.MAXTOP && !level.collisions[0]){
					z.set({currentDY:curDY-z.YVELOCITY, currentHeight:curH+z.YVELOCITY});
				}else{
					z.set({jumpDirection : "DOWN"});	
				}
			} else {
				if( !level.collisions[2]){
					z.set({currentDY:curDY+z.YVELOCITY, currentHeight:curH-z.YVELOCITY, jumpDirection:"DOWN"});	
				}else{
					z.set({currentHeight:0, jumpDirection:"UP", isJumping:false});
				}
			}
			if(level.rightDown && !level.collisions[1]){ 
				if(curDX < z.MAXRIGHT){
					z.set({currentDX:curDX+z.XVELOCITY, bkgdPos: curBP+z.XVELOCITY});
				}else{
					level.moveWorldRight();
					z.set({bkgdPos:curBP+z.XVELOCITY});
				}
				
			}else if(level.leftDown && !level.collisions[3]){ 
				if(curDX <= 35 &&   parseInt($("#items").css("background-position")) < 0){
					level.moveWorldLeft();
					z.set({bkgdPos : curBP - z.XVELOCITY});
				}else if(curDX > 0){
					z.set({currentDX:curDX-z.XVELOCITY, bkgdPos:curBP-z.XVELOCITY});
				}
				
			}
			
		},
		bounce : function() {
		  var z = this;
      z.set({"jumpDirection": "UP"});
		},
		stand : function(){
			var z = this,
			curDY = z.get('currentDY'),
			curH = z.get('currentHeight');
			
			if(!level.collisions[2]){
				z.set({currentDY: curDY+z.YVELOCITY, currentHeight:curH-z.YVELOCITY, jumpDirection:"DOWN"});
			} else if( z.get('isJumping')){
				z.set({currentHeight:0, jumpDirection:"UP", isJumping:false});
			}else if(!level.rightDown && !level.leftDown){
				z.set({currentSX:z.STAND, currentHeight:0, isJumping:false});
			}
			
		},
		
		initialize : function(){
			var z = this,
			ci = z.get('currentImage');
			ci.src = "mario.png";
			ci.onload = function(){
				z.draw();
			}	
			z.set({currentImage:ci});
		},
		
		draw : function(){
			var z = this,
			sizeOffset = 71;
			if(z.get('size') == "big"){
				sizeOffset = 0;
			}
			var inv = z.get('invincible'),
			cf = z.get('currentFrame');
			//console.log(cf);
			if(inv > 0){
  			if(cf < 6){ level.marioLevel.globalAlpha = 0.5; }
  			else{ level.marioLevel.globalAlpha = 1; }
  			if(inv < 60){ inv ++;
  			}else{ inv = 0; }
			}
			if(cf == 10){ cf = 1;
			}else{ cf ++; }
			
			z.set({"currentFrame":cf, "invincible":inv});
			level.marioLevel.drawImage(z.get('currentImage'), z.get('currentSX'), z.get('currentSY')+sizeOffset, z.get('currentSWidth'), z.get('currentSHeight'), z.get('currentDX'), z.get('currentDY'), z.get('currentDWidth'), z.get('currentDHeight'));	
		},
		
		setSize : function(size){
			var z = this;
			if(size == "big"){
				var dy = z.get("currentDY");
				z.set({size :  "big", currentSHeight : 28, currentDY : dy-11, currentDHeight : 28});
			}else if(size == "small"){
				var dy = z.get("currentDY");
				z.set({size : "small", currentSHeight : 17, currentDY : dy+11, currentDHeight : 17});
			}
		},
		
		hit : function(){
			var z = this,
			curSize = z.get("size"),
			inv = z.get("invincible");
			if(inv == 0){
  			if(curSize == "big"){
  				z.setSize("small");
  				z.set({"invincible":1});
  			}else{
  				z.die();
  			}
			}
		},
		
		die : function(){
			var z = this;
			
			window.location.reload();	
		}
	});
	
	var enemy = Backbone.Model.extend({
	
		defaults : {
			//variables for placing sprite on canvas 
			currentImage :  new Image(),
			currentSX : 0,
			currentSY : 0,
			currentSWidth: 18,
			currentSHeight: 17,
			currentDX : 0,
			currentDY : 184,
			currentDWidth : 18,
			currentDHeight : 17,
			bkgdPos : 0,
			type : "goomba",
			
			rightDirection:false, //is facing left or right
			currentFrame:1,
			collisions:[false,false,false,false],
			destroyed:false,
			active:false,
			dying:false
		},
		
		initialize : function(attributes, options){
			var z = this;
			z.set(attributes);
			var img = z.get('currentImage');
			img.src = "enemies.png";
		},
		
		update : function(){
			var z = this;
			z.checkCollisions();
			var collisions = z.get('collisions'),
			curDY = z.get('currentDY'),
			curDX = z.get('currentDX'),
			rd = z.get('rightDirection');
			
			if(!collisions[2]){
				z.set('currentDY', curDY+2);
			}
			if(collisions[1] && rd){
				z.set('rightDirection', false);
			}
			else if(collisions[3] && !rd){
				z.set('rightDirection', true);
			}
			if(z.get('rightDirection')){
				z.set('currentDX', curDX+.5);
			}else{
				z.set('currentDX', curDX-.5);
			}
		},
		
		checkCollisions : function(){
			var z = this,
			eright = z.get('currentDX') + z.get('currentDWidth'),
			eleft = z.get('currentDX'),
			etop = z.get('currentDY'),
			ebottom = z.get('currentDY') + z.get('currentDHeight'),
			edirection = z.get('direction'),
			newCollisions = [false,false,false,false];
			
			for(var k=0; k < level.activeObjects.length; k++){ 
				var cur = level.activeObjects[k];
				if(cur.active){
					
					if(etop > cur.currentDY && etop < cur.currentDY + cur.currentDHeight && eleft+2 < cur.currentDX + cur.currentDWidth && eright-2 > cur.currentDX){newCollisions[0] = true;}
					if(eright > cur.currentDX && eright < cur.currentDX + cur.currentDWidth && etop < cur.currentDY + cur.currentDHeight && ebottom-2 > cur.currentDY){ newCollisions[1] = true; }
					if(ebottom > cur.currentDY && ebottom < cur.currentDY + cur.currentDHeight && eleft+2 < cur.currentDX + cur.currentDWidth && eright-2 > cur.currentDX){newCollisions[2] = true;}
					if(eleft > cur.currentDX && eleft < cur.currentDX + cur.currentDWidth && etop < cur.currentDY + cur.currentDHeight && ebottom-2 > cur.currentDY){ newCollisions[3] = true; }
				}
			}
			for(var k=0; k < level.floors.length; k++){
				var cur = level.floors[k];
				if(eright > cur.x && eright < cur.x + cur.w && etop < cur.y + cur.h && ebottom-2 > cur.y){ newCollisions[1] = true;}
				if(ebottom > cur.y && ebottom < cur.y + cur.h && eleft+2 < cur.x + cur.w && eright-2 > cur.x ){newCollisions[2] = true;}
				if(eleft > cur.x && eleft < cur.x + cur.w && etop < cur.y + cur.h && ebottom-2 > cur.y){ newCollisions[3] = true;}
				
			}
			
			z.set('collisions', newCollisions);
		},
		
		draw : function() {
			var z = this;
			level.enemyLevel.drawImage(z.get('currentImage'), z.get('currentSX'), z.get('currentSY'), z.get('currentSWidth'), z.get('currentSHeight'), z.get('currentDX'), z.get('currentDY'), z.get('currentDWidth'), z.get('currentDHeight'));	
		},
		
		hit : function() {
			this.set('destroyed', true);
		}
	});
	
	var goomba = enemy.extend({
		currentFrame: 1,
		LEFT : 0,
		RIGHT : 16,
		DEAD : 32,
		
		update : function(){
			var z = this;
			if(!z.get('dying')){
				enemy.prototype.update.apply(this);
				var collisions = z.get('collisions');
				
				var csx = z.LEFT;
				if(z.currentFrame > 6){
					csx = z.RIGHT;
				}
				z.set({currentSX:csx});
				
				if(z.currentFrame == 12){z.currentFrame = 1;}
				else{z.currentFrame ++;}
			} else { //if dying
				if(z.currentFrame <= 15){
					z.currentFrame++;
				}else{
					z.set('destroyed', true);
				}
			}
		},
		hit : function(){
			var z = this;
			z.set({'currentSX': z.DEAD, 'active':false, 'dying':true});
			z.currentFrame = 1;
		}
	});
	
	function gameObject(i, sx, sy, sw, sh, dx, dy, dw, dh, ig) {
		
		var z = this;
		z.currentImage = new Image();
		z.currentImage.src = i,
		z.currentSX = sx,
		z.currentSY = sy,
		z.currentSWidth = sw,
		z.currentSHeight = sh,
		z.currentDX = dx,
		z.currentDY = dy,
		z.currentDWidth = dw,
		z.currentDHeight = dh,
		z.active = false,
		z.destroyed = false,
		z.ignore = ig;
		
		z.update = function(){
			
		}
		
		z.draw = function() {
			var z = this;
			level.objectLevel.drawImage(z.currentImage, z.currentSX, z.currentSY, z.currentSWidth, z.currentSHeight, z.currentDX, z.currentDY, z.currentDWidth, z.currentDHeight);
		}
		
		z.die = function() {
			//console.log(this.destroyed);
			this.destroyed = true;	
		}
		
		z.hit = function(){
			console.log("object");	
		}
	}
	
	gameItem.prototype = new gameObject();
	gameItem.prototype.constructor = gameItem;
	function gameItem(i, sx, sy,sw,sh,dx,dy,dw,dh,ig){
		gameObject.call(this, i,sx,sy,sw,sh,dx,dy,dw,dh,ig);
		var z = this;
		z.collisions = [false, false, false, false];
		z.draw = function(){
			level.itemLevel.drawImage(z.currentImage, z.currentSX, z.currentSY, z.currentSWidth, z.currentSHeight, z.currentDX, z.currentDY, z.currentDWidth, z.currentDHeight);
		}
		z.die = function(){
			this.destroyed = true;
			level.items.splice(level.items.indexOf(z), 1);
		}
	}
	
	coin.prototype = new gameItem();
	gameItem.prototype.constructor = coin;
	function coin(i, sx, sy,sw,sh,dx,dy,dw,dh,ig){
		gameItem.call(this, i,sx,sy,sw,sh,dx,dy,dw,dh,ig);
		var z = this;
		z.y = 0;
		
		z.update = function(){
			if(z.y < z.currentDHeight){
				z.currentDY --;
				z.y++;	
			}else{
				z.die();
			}
		}
	}
	
	mushroom.prototype = new gameItem();
	gameItem.prototype.constructor = mushroom;
	function mushroom(i, sx, sy,sw,sh,dx,dy,dw,dh,ig){
		gameItem.call(this, i,sx,sy,sw,sh,dx,dy,dw,dh,ig);
		var z = this;
		z.y = 0,
		z.rightDirection = true
		z.ready = false;
		
		z.update = function(){
			if(z.y < z.currentDHeight){
				z.currentDY --;
				z.y++;	
			}else{
				if(!z.ready){z.ready = true;}
				if(!z.collisions[2]){
					z.currentDY +=2;
				}
				if(z.collisions[1] && z.rightDirection){
					z.rightDirection = false;
				}
				else if(z.collisions[3] && !z.rightDirection){
					z.rightDirection = true;
				}
				if(z.rightDirection){
					z.currentDX+= 0.75;
				}else{
					z.currentDX-= 0.75;
				}
				
			}
			
			if(z.currentDY > 224 || z.currentDX > 224 || z.currentDX < 0){
				z.die();
			}
		}
		
		z.hit = function(){
			level.mario.setSize("big");
			z.die();
		}
	}
	
	brick.prototype = new gameObject();
	brick.prototype.constructor = brick;
	function brick(i, sx, sy,sw,sh,dx,dy,dw,dh,ig){
		//gameObject.call(this);
		gameObject.call(this, i,sx,sy,sw,sh,dx,dy,dw,dh,ig);
		var z = this;
		z.MAXBUMPHEIGHT = 8,
		z.bump = 0,
		z.isBumped = false;
		
		z.hit = function(){
			z.isBumped = true;	
		}
		
		z.update = function(){
			if(z.isBumped){
				if(z.bump <= z.MAXBUMPHEIGHT/2 ){
					z.currentDY --;
				}else{
					z.currentDY ++;	
				}
				
				if(z.bump <= z.MAXBUMPHEIGHT){
					z.bump++;
				}else{
					z.bump =0;
					z.isBumped = false;	
				}
			}
		}
	}
	
	questionmark.prototype = new gameObject();
	questionmark.prototype.constructor = questionmark;
	function questionmark(i, sx, sy,sw,sh,dx,dy,dw,dh,ig, reward){
		//gameObject.call(this);
		gameObject.call(this, i,sx,sy,sw,sh,dx,dy,dw,dh,ig);
		var z = this;
		z.MAXBUMPHEIGHT = 8,
		z.bump = 0,
		z.isBumped = false,
		z.isAlive = true;
		
		z.hit = function(){
			if(z.isAlive && !z.isBumped){
				z.isBumped = true;
				if(reward == "mushroom"){
					level.items.push(new mushroom(z.currentImage.src, 104,0,16,16,z.currentDX, z.currentDY,16,16));
				}else{	
					level.items.push(new coin(z.currentImage.src, 88, 0, 14, 16, z.currentDX, z.currentDY, 14,16));
				}
				//console.log(level.items);
			}
		}
		
		z.die = function(){
			z.currentSX = 54,
			z.isAlive = false;
		}
		
		z.update = function(){
			if(z.isBumped){
				if(z.bump <= z.MAXBUMPHEIGHT/2 ){
					z.currentDY --;
				}else{
					if(z.isAlive)z.die();
					z.currentDY ++;	
				}
				
				if(z.bump <= z.MAXBUMPHEIGHT){
					z.bump++;
				}else{
					z.bump =0;
					z.isBumped = false;	
				}
			}
		}
	}
	
	function floorObject(x, y, w, h){
		var z = this;
		z.x = x,
		z.y = y,
		z.w = w,
		z.h = h;
	}
	
	level.init();
});