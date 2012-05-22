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
		  
		  if(z.mario.currentDY  > 224){
			  z.mario.die();
		  } else {
		  		setTimeout(function(){z.update();}, 1000/60);
		  }
		},
		
		checkCollisions : function(){
			var z = this,
			mright = z.mario.currentDX + z.mario.currentDWidth,
			mleft = z.mario.currentDX,
			mtop = z.mario.currentDY,
			mbottom = z.mario.currentDY + z.mario.currentDHeight;
			mdirection = z.mario.direction;
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
			
			mright = z.mario.bkgdPos + z.mario.currentDWidth;
			mleft = z.mario.bkgdPos;
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
			z.mario = mario;
			z.mario.init();
			
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
	
	var mario = {
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
		currentFrame:1,
		MAXTOP : 70,
		MAXRIGHT : 175,
		XVELOCITY : 1,
		YVELOCITY : 2,
		
		moveRight : function(){
			var z = this;
			
			if(z.direction == z.LEFT && !z.isJumping){
				z.direction = z.RIGHT;
				z.currentSX = z.TURN; 
				z.currentSY = z.RIGHT;
			} else{
				if(z.currentDX < z.MAXRIGHT && !level.collisions[1]){
					z.currentDX += z.XVELOCITY;	
					z.bkgdPos += z.XVELOCITY;
				} else if(!level.collisions[1]){
					level.moveWorldRight();
					z.bkgdPos += z.XVELOCITY;
				}
				
				
				if(!level.collisions[2]){
					z.currentSX = z.JUMP;
					z.currentDY += z.YVELOCITY;
					z.currentHeight -= z.YVELOCITY;
					z.jumpDirection = "DOWN";
				}else{
					 if(z.currentFrame < 6){
						z.currentSX = z.WALK2;
					}else{
						z.currentSX = z.WALK1;
					}
					z.isJumping = false;
				}
				if(z.currentFrame == 10){ z.currentFrame = 1; }
				else {z.currentFrame++; }
			}
		},
		
		moveLeft : function(){
			var z = this,
			collided = level.collisions[3];
			
			if(z.direction == z.RIGHT && !z.isJumping){
				z.direction = z.LEFT;
				z.currentSX = z.TURN; 
				z.currentSY = z.LEFT;
			} else { 
				if(z.currentDX <= 35 && parseInt($("#items").css("background-position")) < 0 && !level.collisions[3]){ 
					level.moveWorldLeft();
					z.bkgdPos -= z.XVELOCITY;
				} else if(z.currentDX > 0 && !level.collisions[3]) {
					z.currentDX -= z.XVELOCITY;
					z.bkgdPos -= z.XVELOCITY;
				} 
				
				if(!level.collisions[2]){
					z.currentSX = z.JUMP;
					z.currentDY += z.YVELOCITY;
					z.currentHeight -= z.YVELOCITY;
					z.jumpDirection = "DOWN";
				}else{ 
					if(z.currentFrame < 6){
						z.currentSX = z.WALK2;
					}else{
						z.currentSX = z.WALK1;
					}
					z.isJumping = false;
				}
				if(z.currentFrame == 10){z.currentFrame = 1;}
				else{z.currentFrame++;}
			}
		},
		
		jump : function(){
			var z = this;
			
			z.currentSX = z.JUMP; 
			z.isJumping = true;
			
			if(z.jumpDirection == "UP" ){
				if(z.currentHeight < z.MAXTOP && !level.collisions[0]){
					z.currentDY -= z.YVELOCITY;
					z.currentHeight += z.YVELOCITY;
				}else{
					z.jumpDirection = "DOWN";	
				}
			} else {
				if( !level.collisions[2]){
					z.currentDY += z.YVELOCITY;
					z.currentHeight -= z.YVELOCITY;
					z.jumpDirection = "DOWN";
				}else{
					z.currentHeight = 0;
					z.jumpDirection = "UP";
					z.isJumping = false;
				}
			}
			if(level.rightDown && !level.collisions[1]){ 
				if(z.currentDX < z.MAXRIGHT){
					z.currentDX += z.XVELOCITY;
					z.bkgdPos += z.XVELOCITY;
				}else{
					level.moveWorldRight();
					z.bkgdPos += z.XVELOCITY;
				}
				
			}else if(level.leftDown && !level.collisions[3]){ 
				if(z.currentDX <= 35 &&   parseInt($("#items").css("background-position")) < 0){
					level.moveWorldLeft();
					z.bkgdPos -= z.XVELOCITY;
				}else if(z.currentDX > 0){
					z.currentDX -= z.XVELOCITY;	
					z.bkgdPos -= z.XVELOCITY;
				}
				
			}
			
		},
		stand : function(){
			var z = this;
			
			if(!level.collisions[2]){
				z.currentDY += z.YVELOCITY;
				z.currentHeight -= z.YVELOCITY;
				z.jumpDirection = "DOWN";
			} else if( z.isJumping){
				z.currentHeight = 0;
				z.jumpDirection = "UP";
				z.isJumping = false;
			}else if(!level.rightDown && !level.leftDown){
				z.currentSX = z.STAND;
				z.currentFrame = 1;
				z.currentHeight = 0;
				z.isJumping = false;
			}
			
		},
		/*runRight : function(){
			var z = this;
			var left = z.mario.css("left");
			console.log("run");
			if(left.substr(0,left.indexOf("px")) > 0) {
				z.mario.animate({"left":"+=25px"},400,function(){
					z.canAnimate = true;	
				});
				
				z.change(z.RUN, z.direction); 
				setTimeout(function(){z.change(z.RUN1,z.direction);},100);
				setTimeout(function(){z.change(z.RUN2,z.direction);},200);
				setTimeout(function(){z.change(z.RUN1,z.direction);},300);
				
			} else {
				z.canAnimate = true;	
			}
		},*/
		
		init : function(){
			var z = this;
			z.currentImage.src = "sprite.png";
			z.currentImage.onload = function(){
				z.draw();
			}	
		},
		
		draw : function(){
			var z = this;
			level.marioLevel.drawImage(z.currentImage, z.currentSX, z.currentSY, z.currentSWidth, z.currentSHeight, z.currentDX, z.currentDY, z.currentDWidth, z.currentDHeight);	
		},
		
		die : function(){
			var z = this;
			
			window.location.reload();	
		}
	}
	
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
				console.log(level.items);
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