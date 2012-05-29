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
		objectLevel : document.getElementById("level").getContext("2d"),
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
		 
		  for(var k = 0; k < z.objects.length; k++){
			  var cur = z.objects[k];
			  if(!cur.destroyed && cur.currentDX > (0 - cur.currentSWidth) && cur.currentDX <= 225 + cur.currentSWidth){
				  cur.update();
				  cur.draw();
			      cur.active = true;
				  z.activeObjects.push(cur);
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
				}
			}
			
			mright = z.mario.get('bkgdPos') + z.mario.get('currentDWidth');
			mleft = z.mario.get('bkgdPos');
			for(var k=0; k < z.floors.length; k++){
				var cur = z.floors[k];
				if(mright > cur.x && mright < cur.x + cur.w && mtop < cur.y + cur.h && mbottom-2 > cur.y){ z.collisions[1] = true;}
				if(mbottom > cur.y && mbottom < cur.y + cur.h && mleft+2 < cur.x + cur.w && mright-2 > cur.x ){z.collisions[2] = true;}
				if(mleft > cur.x && mleft < cur.x + cur.w && mtop < cur.y + cur.h && mbottom-2 > cur.y){ z.collisions[3] = true;}
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
			$("#items").css({"background-position":"-=1px 0px"});	
		},
		
		clear : function(){
			this.objectLevel.clearRect(0,0,240,224);
			this.marioLevel.clearRect(0,0,240,224);
			this.itemLevel.clearRect(0,0,240,224);
		},
		
		init : function(){
			var z = this;
			z.mario = new mario();
			
			$.getJSON("objects.json", function(json){
				$.each(json, function(k,v){
					//console.log(v);
					var x;
					switch(v.type){
						case "brick": 	x = new brick('sprite.png', v.sx, v.sy, v.sw, v.sh, v.dx, v.dy, v.dw, v.dh); break;
						case "questionmark": x = new questionmark('sprite.png', v.sx, v.sy, v.sw, v.sh, v.dx, v.dy, v.dw, v.dh); break;
						default : x = new gameObject('sprite.png', v.sx, v.sy, v.sw, v.sh, v.dx, v.dy, v.dw, v.dh); break;
					}
					
					if(x)z.objects.push(x);
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
			currentSHeight: 30,
			currentDX : 0,
			currentDY : 172,
			currentDWidth : 18,
			currentDHeight : 30,
			bkgdPos : 0,
			
			direction:0, //is facing left or right
			currentHeight: 0, //tracks jump height
			jumpDirection:'UP',
			isJumping: false,
			currentFrame:1
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
				if(cf == 10){ z.set({currentFrame : 1}); }
				else {z.set({currentFrame:cf+1}); }
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
				if(cf == 10){z.set({currentFrame : 1});}
				else{z.set({currentFrame:cf+1});}
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
		stand : function(){
			var z = this,
			curDY = z.get('currentDY'),
			curH = z.get('currentHeight');
			
			if(!level.collisions[2]){
				z.set({currentDY: curDY+z.YVELOCITY, currentHeight:curH-z.YVELOCITY, jumpDirection:"DOWN"});
			} else if( z.get('isJumping')){
				z.set({currentHeight:0, jumpDirection:"UP", isJumping:false});
			}else if(!level.rightDown && !level.leftDown){
				z.set({currentSX:z.STAND, currentFrame:1, currentHeight:0, isJumping:false});
			}
			
		},
		
		initialize : function(){
			var z = this,
			ci = z.get('currentImage');
			ci.src = "sprite.png";
			ci.onload = function(){
				z.draw();
			}	
			z.set({currentImage:ci});
		},
		
		draw : function(){
			var z = this;
			level.marioLevel.drawImage(z.get('currentImage'), z.get('currentSX'), z.get('currentSY'), z.get('currentSWidth'), z.get('currentSHeight'), z.get('currentDX'), z.get('currentDY'), z.get('currentDWidth'), z.get('currentDHeight'));	
		},
		
		die : function(){
			var z = this;
			
			window.location.reload();	
		}
	});
	
	function gameObject(i, sx, sy, sw, sh, dx, dy, dw, dh) {
		
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
		z.destroyed = false;
		
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
	function gameItem(i, sx, sy,sw,sh,dx,dy,dw,dh){
		gameObject.call(this, i,sx,sy,sw,sh,dx,dy,dw,dh);
		var z = this;
		z.draw = function(){
			level.itemLevel.drawImage(z.currentImage, z.currentSX, z.currentSY, z.currentSWidth, z.currentSHeight, z.currentDX, z.currentDY, z.currentDWidth, z.currentDHeight);
		}
	}
	
	coin.prototype = new gameItem();
	gameItem.prototype.constructor = coin;
	function coin(i, sx, sy,sw,sh,dx,dy,dw,dh){
		gameItem.call(this, i,sx,sy,sw,sh,dx,dy,dw,dh);
		var z = this;
		z.y = 0;
		
		z.update = function(){
			if(z.y < z.currentDHeight){
				z.currentDY --;
				z.y++;	
			}else{
				z.destroyed = true;	
				level.items.splice(level.items.indexOf(z),1);
			}
		}
	}
	
	brick.prototype = new gameObject();
	brick.prototype.constructor = brick;
	function brick(i, sx, sy,sw,sh,dx,dy,dw,dh){
		//gameObject.call(this);
		gameObject.call(this, i,sx,sy,sw,sh,dx,dy,dw,dh);
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
	function questionmark(i, sx, sy,sw,sh,dx,dy,dw,dh){
		//gameObject.call(this);
		gameObject.call(this, i,sx,sy,sw,sh,dx,dy,dw,dh);
		var z = this;
		z.MAXBUMPHEIGHT = 8,
		z.bump = 0,
		z.isBumped = false,
		z.isAlive = true;
		
		z.hit = function(){
			if(z.isAlive && !z.isBumped){
				z.isBumped = true;	
				level.items.push(new coin(z.currentImage.src, 88, 64, 14, 16, z.currentDX, z.currentDY, 14,16));
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