//music url http://www.beepbox.co/#5s6k6l00e0ftaa7g0fj7i0r0w1111f0000d1111c0000h0060v0003o3210b000w8h4h4g0h4i4zcP8x8y8y4h8y8h8h4x800i4w018p22-FBO9cd6gFO0V6j8Rj3Apllg5cKh9xwQQV0siN2hGMoIOSD83ApdteyCNd3HqTqWwkOV4C6z8kV0sz9AqGqfuPnjIp5dehjAQQwmo589wngChmNmRhJr5rl6QVwhmYnBulZltunI2XR2TvgHKXU_cPcHKXHKXM3dgggA444aXKY-O0Xi7dQrmlhhthhJkm0
//http://www.beepbox.co/#5s6k6l00e0ftaa7g0fj7i0r0w1111f0000d1111c0000h0060v0003o3210b000w8j514g0h4i4zcN8x8y8y4h8y8h8h4x800i4w018p23AFBO9cd6gFO0V6j8Rj3ApllmImjnjA1OaGGEaKC1LFVoI3wqsMetpvlj8QOs1m5cKh9xwQQV0siN2hGMoIOSD83ApdteyCNd3HqTqWwkOV4C6z8kV0sz9AqGqfuPnjIp5dehjAQQwmo589wngChmNmRhJr5rl6QVwhmYnBulZltunI2XR2TvgHKXU_cPcHKXHKXM3dgggA444aXKY-O0Xi7dQrmlhhthhJkm0
var blink = true;			        //state of blink
var frames = 0;				        //A frame count
var goalTile = {x:-1,y:-1};	        //Exit Tile	
var lvlComplete = false;	        //Status of competion
var canvasHeight = 576;             //height of the rendered canvas (default value)
var canvasWidth = 640;              //Width of the rendered canvas (default value)
var screenWidth = 160;		        //Game Resolution Width
var screenHeight = 144;		        //Game Resolution Height
var tileSize = 8;			        //size of tiles
var scaleFactor = 5;		        //screen scaling factor (default value)
var sheetWidth = 256;		        //width and height of sprite sheet (in pixels)
var fps = 0;				        //count of frames per second
var pressedKeys = [];		        //list of accepted key presses at a given time
var expansionFactor = 2;            //How many times a map is expanded upon when generating
var paused = false;                 //Flag for pausing the game
var cycle = -1;                     //keeps track of how many levels the player has played
var menuHeight = screenHeight-16;   //Height of the menu
var menu = false;                   //Flag to display the menu
var rTransition = -1;               //Flag denoting room transitions
var roomDrawY = 0;                  //Y coordinate the room is drawn reletive to
var roomDrawX = 0;                  //X coordinate the room is drawn relative to
var currLvl;                        //holds the data of the currently loaded room
var prevLvl;                        //holds the data of the previously exited room            
var bannerCounter = 0;              //Counter for the time the Cycle banner is displayed
var rendScreen;                     //The final form of the game screen that is to be rendered
var img;                            //holds the unscaled image of the game that a palette will be applied to
var sX,sY;                          //Vars for processing and rendering sprites
var remKeys = 0;                    //count of keys remaining in the current level
var remMobs = 0;                    //count of mobs remaining in the current level
var draws = 0;                      //debug var to count how many draws are in each frame
var drawsperframe = 0;              //debaug var for draws/frame
var palettesEnabled = true;         //Flag to enable/disable Pallettes
var map = [[]];                     //The configuration of the current level
var mapLoc = {x:0, y:0};            //location of the currently loaded room in the map
var availFloors = 2;                //number of available floor tile sets
var availWalls = 5;                 //number of available wall tile sets
var currPal;                        //holds the current color palette
var spriteSheet = new Image();	    //Sheet of sprite images
var seed;
var base_seed;
spriteSheet.src = 'assets/char_sheet.png';

var playerSheet = new Image();      //sheet of player sprites
playerSheet.src = 'assets/player_sheet.png';

var wepSheet = new Image();
wepSheet.src = 'assets/weps.png';

var roomTemplates = new Image();    //sheet of Room data
roomTemplates.src = 'assets/RoomTemplates.png';

var bgm = new Audio('assets/song2.wav');    //bacground music
bgm.loop = true;                    //loop the track

//initiate canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

//inititate render canvas
var rendCanvas = document.getElementById("rendCanvas");
var rctx = rendCanvas.getContext("2d");


//////////////////////////////////////////////////////////////////////////
//                                                                      //
//                              CCOMPLEX OBJECTS                        //
//                                                                      //
//////////////////////////////////////////////////////////////////////////

////////////////////////////////minimap///////////////////////////////////
var minimap = { 
	display:false, 
	map:[],
	update: function() {
		var newRow = [];
		minimap.map = [];
		for (var i=0; i<map.length; i++) {
			newRow = [];
			for (var j=0; j<map[i].length; j++) {
				
				
				newRow.push(map[i][j].mini);
				
			}
			minimap.map.push(newRow);
		}
	}   
};

////////////////////////////////player////////////////////////////////////
var player={
	x:9*tileSize,				//x location in the current room
	y:8*tileSize,				//y location in the current room
	drawX: 9*tileSize,			//x location on screen to draw
	drawY: 9*tileSize,			//y location on screen to draw
	dir:2,
	strafe: false,
	moving: false,
	attacking: false,
	invincible: false,
	invincCounter: 0,
	invincLimit:60,
	moveWhileAttacking: false,
	speed: 1,
	currSpeed: .25,
	speedLimit: 4,
	base_damage:1,
	base_defense:1,
	health:10,
	healthGen:0,
	maxHealth:10,
	healthLimit:32,
	spirit:10,
	spiritGen:.1,
	maxSpirit:10,
	spiritLimit:32,
	curse:0,
	curseGen:.0001,
	maxCurse:10,
	exp:0,
	lvlUp: 5,
	lvl:0,
	newLvl:10,
	augments:[],
	maxAugs: 8,
	statusCount: -1,
	newStatus: -1,
	headSet: 0,
	bodySet: 0,
	animations:{
		h_idle:[
			[{x:16,y:0,h:16,w:16,dur:4}],
			[{x:0,y:16,h:16,w:16,dur:4}],
			[{x:0,y:0,h:16,w:16,dur:4}],
			[{x:16,y:16,h:16,w:16,dur:4}]
		],
		b_idle:[
			[{x:32,y:24,h:8,w:16,dur:4}],
			[{x:32,y:16,h:8,w:16,dur:4}],
			[{x:32,y:0,h:8,w:16,dur:4}],
			[{x:32,y:8,h:8,w:16,dur:4}]
		],
		b_walk:[
			[{x:48,y:24,h:8,w:16,dur:4},{x:32,y:24,h:8,w:16,dur:4},	{x:64,y:24,h:8,w:16,dur:4},	{x:32,y:24,h:8,w:16,dur:4}],
			[{x:48,y:16,h:8,w:16,dur:4},{x:32,y:16,h:8,w:16,dur:4},	{x:64,y:16,h:8,w:16,dur:4},	{x:32,y:16,h:8,w:16,dur:4}],
			[{x:48,y:0,h:8,w:16,dur:4},	{x:32,y:0,h:8,w:16,dur:4},	{x:64,y:0,h:8,w:16,dur:4},	{x:32,y:0,h:8,w:16,dur:4}],
			[{x:48,y:8,h:8,w:16,dur:4},	{x:32,y:8,h:8,w:16,dur:4},	{x:64,y:8,h:8,w:16,dur:4},	{x:32,y:8,h:8,w:16,dur:4}]
		],
		b_attack:[
			[{x:80,y:24,h:8,w:16,dur:4},{x:96,y:24,h:8,w:16,dur:4},	{x:112,y:24,h:8,w:16,dur:4}],
			[{x:80,y:16,h:8,w:16,dur:4},{x:96,y:16,h:8,w:16,dur:4},	{x:112,y:16,h:8,w:16,dur:4}],
			[{x:80,y:0,h:8,w:16,dur:4},	{x:96,y:0,h:8,w:16,dur:4},	{x:112,y:0,h:8,w:16,dur:4}],
			[{x:80,y:8,h:8,w:16,dur:4},	{x:96,y:8,h:8,w:16,dur:4},	{x:112,y:8,h:8,w:16,dur:4}]
		] 
	},
	h_currAnim: [],
	b_currAnim: [],
	h_anim_index:0,
	b_anim_index:0,
	h_animCounter:-1,
	b_animCounter:-1,
	headbob:0,
	state:['idle'],
	selected_state:'idle',
	update: function (){  
		
		this.drawX = this.x;
		this.drawY = this.y;
		
		//invincibility counter
		if (this.state.indexOf('invincible') > -1) {
			this.invincCounter++;
			if (this.invincCounter > this.invincLimit) {
				if (this.state.indexOf('invincible') > -1) {
					this.state.splice(this.state.indexOf('invincible'),1);
				}
				this.invincCounter = 0;
			}
		}
		
		//speed limit b/c 2fast4me
		if (this.speed > 4) {
			this.speed = 4;
		}
		
		//regen health
		this.health+=this.healthGen;
		if (this.health > this.maxHealth) {
			this.health = this.maxHealth;
		}
		
		//progress curse
		this.curse+=this.curseGen;
		if (this.curse > this.maxCurse) {
			this.curse = this.maxCurse;
		}
		
		//check on level progression
		if (this.exp == this.newLvl) {
			this.lvl++;
			this.exp = 0;
			this.maxHealth = this.maxHealth+this.lvlUp;
			if (this.maxHealth > this.healthLimit) {
				this.maxHealth = this.healthLimit;
			}
			this.health = this.maxHealth;
			this.maxSpirit = this.maxSpirit+this.lvlUp;
			if (this.maxSpirit > this.spiritLimit) {
				this.maxSpirit = this.spiritLimit;
			}
			//diminishing returns of level ups
			this.lvlUp = Math.ceil(this.lvl/2);
		}
		
		//check if/where the player should be facing
		if (pressedKeys.indexOf('J') > -1) {
			if (this.state.indexOf('strafe') < 0) {
				this.state.push('strafe');
			}
		} else {
			if (this.state.indexOf('strafe') > -1) {
				this.state.splice(this.state.indexOf('strafe'), 1);
			}
		}
						   
		if (pressedKeys.indexOf('_') < 0 && this.weapons[this.wepIndex].swung == true) {
			this.weapons[this.wepIndex].swung = false;
		}
		
		//update the weapon
		this.weapons[this.wepIndex].update();
		
		//spirit max
		if (this.spirit > this.maxSpirit) {
			this.spirit = this.maxSpirit;
		}
		
		//input actions
		
		if (pressedKeys.indexOf('W') > -1 || pressedKeys.indexOf('A')>-1||
			pressedKeys.indexOf('S') > -1 || pressedKeys.indexOf('D') > -1) {
			
			if (pressedKeys.indexOf('W') > -1) {
				if (this.state.indexOf('moving') < 0 && this.state.indexOf('attacking') < 0) {
					if (this.state.indexOf('idle') > -1) {
						this.state.splice(this.state.indexOf('idle'),1);
					}
					this.state.push('moving');
				}
				if (this.b_animCounter == -1) {
					this.b_animCounter = 0;
				}
				if (this.h_animCounter == -1) {
					this.h_animCounter = 0;
				}
				this.move(0);
			}
			
			if (pressedKeys.indexOf('A') > -1) {
				if (this.state.indexOf('moving') < 0 && this.state.indexOf('attacking') < 0) {
					if (this.state.indexOf('idle') > -1) {
						this.state.splice(this.state.indexOf('idle'),1);
					}
					this.state.push('moving');
				}
				if (this.b_animCounter == -1) {
					this.b_animCounter = 0;
				}
				if (this.h_animCounter == -1) {
					this.h_animCounter = 0;
				}
				this.move(1);
			}
			
			if (pressedKeys.indexOf('S') > -1) {
				if (this.state.indexOf('moving') < 0 && this.state.indexOf('attacking') < 0) {
					if (this.state.indexOf('idle') > -1) {
						this.state.splice(this.state.indexOf('idle'),1);
					}
					this.state.push('moving');
				}
				if (this.b_animCounter == -1) {
					this.b_animCounter = 0;
				}
				if (this.h_animCounter == -1) {
					this.h_animCounter = 0;
				}
				this.move(2);
			}
			
			if (pressedKeys.indexOf('D') > -1) {
				if (this.state.indexOf('moving') < 0 && this.state.indexOf('attacking') < 0) {
					if (this.state.indexOf('idle') > -1) {
						this.state.splice(this.state.indexOf('idle'),1);
					}
					this.state.push('moving');
				}
				if (this.b_animCounter == -1) {
					this.b_animCounter = 0;
				}
				if (this.h_animCounter == -1) {
					this.h_animCounter = 0;
				}
				this.move(3);
			}
			
		} else {
			this.currSpeed = .0625;
			if (this.state.indexOf('moving') > -1) {
				this.state.splice(this.state.indexOf('moving'),1);
			}
		}
		//use weapon or regen spirit
		if (this.state.indexOf('attacking') > -1) {
			if (this.moveWhileAttacking == false) {
				if (this.state.indexOf('moving') > -1) {
					this.state.splice(this.state.indexOf('moving'),1);
				}
			}
			if (this.weapons[this.wepIndex].cont == false && this.weapons[this.wepIndex].swung == false) {
				this.weapons[this.wepIndex].action();
			} else if (this.weapons[this.wepIndex].cont == true) {
				this.weapons[this.wepIndex].action();
			}
			
			if (this.b_animCounter == -1) {
				this.b_animCounter = 0;
				this.b_anim_index = 0;
			}
			if (this.h_animCounter == -1) {
				this.h_animCounter = 0;
				this.h_anim_index = 0;
			}
		} else {
			this.spirit = this.spirit+this.spiritGen;
		} 
		
		if (pressedKeys.indexOf('_') > -1) {
			//not attacking -> attacking
			if (this.state.indexOf('attacking') < 0 && this.spirit>=this.weapons[this.wepIndex].init_cost && this.weapons[this.wepIndex].swung == false) {
				this.b_anim_index = 0;
				this.b_animCounter = 0;
				this.h_anim_index = 0;
				this.h_animCounter = 0;
				//this.attacking = true;
				this.state.push('attacking');
				this.spirit = this.spirit-this.weapons[this.wepIndex].init_cost;
			}
			//attacking -> still attacking
			if (this.state.indexOf('attacking') > -1 && player.weapons[this.wepIndex].cont == true){
				this.spirit = this.spirit-player.weapons[this.wepIndex].use_cost;
				if (this.spirit < -1) {
					this.state.splice(this.state.indexOf('attacking'),1);
					this.spirit = -1;
				}
			}
			
		}
		
		if (this.state.indexOf('moving') < 0 && this.state.indexOf('attacking') < 0 && this.state.indexOf('idle') < 0) {
			this.state.push('idle');
		}
	},
	move:   function (dir) {
		if (this.state.indexOf('moving') > -1) {
			
			if (this.currSpeed < this.speed) {
				this.currSpeed+=.0625;
			}
			
			if (dir == 0) {
				if (this.strafe == false) {
					this.dir = 0;
				}
				var canMove = this.currSpeed;
				if (this.y-this.currSpeed <= 0) {
					canMove = 0 - (this.y-this.currSpeed);
					if (canMove < 0) {
						canMove = 0;
					}
					this.y-=canMove;
				} else {
					canMove =  .25;
					while (canMove <= this.currSpeed) {
						if (currLvl[1][Math.floor((this.y-(.25))/8)][Math.floor(Math.floor(this.x)/8)] ==0 &&
							currLvl[1][Math.floor((this.y-(.25))/8)][Math.ceil(Math.ceil(this.x)/8)] ==0) {
							this.y-=.25;
						} else {
							break;
						}
						canMove+=.25;
					}
				}
				
			}
			if (dir == 1) {
				if (this.strafe == false) {
					this.dir = 1;
				}
				var canMove = this.currSpeed;
				if (this.x-this.currSpeed <= 0) {
					canMove = 0 - (this.x-this.currSpeed);
					if (canMove < 0) {
						canMove = 0;
					}
					this.x-=canMove;
				} else {
					canMove = .25;
					while (canMove <= this.currSpeed) {
						if (currLvl[1][Math.floor((Math.floor(this.y))/8)][Math.floor((this.x-.25)/8)] == 0 &&
							currLvl[1][Math.ceil(((Math.ceil(this.y)))/8)][Math.floor((this.x-.25)/8)] == 0) {
							
							this.x-=.25;
						} else {
							break;
						}
						canMove+=.25;
					}
				}
				
			}
			if (dir == 2) {
				if (this.strafe == false) {
					this.dir = 2;
				}
				var canMove = this.currSpeed;
				if (this.y+this.currSpeed+8 >= screenHeight-16) {
					canMove = (this.y+this.currSpeed) - screenHeight-16;
					if (canMove < 0) {
						canMove = 0;
					}
					this.y+=canMove;
				} else {
					canMove = .25;
					while (canMove <= this.currSpeed) {
						if (currLvl[1][Math.ceil((this.y+.25)/8)][Math.floor(Math.floor(this.x)/8)] == 0 &&
							currLvl[1][Math.ceil((this.y+.25)/8)][Math.ceil(Math.ceil(this.x)/8)] == 0) {
							
							this.y+=.25;
						} else {
							break;
						}
						canMove+=.25;
					}
				}
				
			}
			if (dir == 3) {
				if (this.strafe == false) {
					this.dir = 3;
				}
				var canMove = this.currSpeed;
				if (this.x+this.currSpeed+8 >= screenWidth) {
					canMove = (this.x+this.currSpeed) - screenWidth;
					if (canMove < 0) {
						canMove = 0;
					}
					this.x+=canMove;
				} else {
					canMove = .25;
					while (canMove <= this.currSpeed) {
						if (currLvl[1][Math.ceil(Math.ceil(this.y)/8)][Math.ceil((this.x+.25)/8)] == 0 &&
							currLvl[1][Math.floor(Math.floor(this.y)/8)][Math.ceil((this.x+.25)/8)] == 0) {
						
							this.x+=.25;
						} else {
							break;
						}
						canMove+=.25;
					}
				}
			}
		}
		
	},
	draw:   function(){  
		this.selected_state = 'idle';
		if (this.invincCounter%2 == 0) {
			
			//draw player status/pickup
			if (this.statusCount > -1) {
				drawSprite(this.newStatus, this.x, this.y-20);
				this.statusCount = this.statusCount-1;
				if (this.statusCount <= -1) {
					this.newStatus = -1;
				}
			}
			
			if (this.state.indexOf('idle') > -1) {
				this.h_currAnim = this.animations.h_idle;
				this.b_currAnim = this.animations.b_idle;
			}
			
			if (this.state.indexOf('moving') > -1) {
				this.h_currAnim = this.animations.h_idle;
				this.b_currAnim = this.animations.b_walk;
				this.selected_state = 'moving';
			}
			
			if (this.state.indexOf('attacking') > -1) {
				this.h_currAnim = this.animations.h_idle;
				this.b_currAnim = this.animations.b_attack;
				this.selected_state = 'attacking';
			}
			
			if (this.state.indexOf('idle') < 0) {
				headbob = 1;
			} else {
				headbob = 0;
			}  
			
			//ensure we're within the current animation
			if (this.b_anim_index >= this.b_currAnim[this.dir].length) {
				this.b_anim_index = 0;
			}
			if (this.h_anim_index >= this.h_currAnim[this.dir].length) {
				this.h_anim_index = 0;
			}
			
			//progress current animation 
			this.b_animCounter++;
			if (this.b_animCounter >= this.b_currAnim[this.dir][this.b_anim_index].dur && paused == false) {
				this.b_animCounter = 0;
				this.b_anim_index++;
				if (this.b_anim_index >= this.b_currAnim[this.dir].length) {
					this.b_anim_index = 0;
				}
			}
			this.h_animCounter++;
			if (this.h_animCounter >= this.h_currAnim[this.dir][this.h_anim_index].dur && paused == false) {
				this.h_animCounter = 0;
				this.h_anim_index++;
				if (this.h_anim_index >= this.h_currAnim[this.dir].length) {
					this.h_anim_index = 0;
				}
			}
			
			ctx.drawImage(playerSheet, 	this.b_currAnim[this.dir][this.b_anim_index].x,	this.b_currAnim[this.dir][this.b_anim_index].y+this.bodySet,
										this.b_currAnim[this.dir][this.b_anim_index].w,	this.b_currAnim[this.dir][this.b_anim_index].h,this.x-4, this.y,16,8);
			ctx.drawImage(playerSheet, 	this.h_currAnim[this.dir][this.h_anim_index].x,	this.h_currAnim[this.dir][this.h_anim_index].y+this.headSet,
										this.h_currAnim[this.dir][this.h_anim_index].w,	this.h_currAnim[this.dir][this.h_anim_index].h,this.x-4, this.y-16+headbob,16,16);
			
			for (var i=0; i<this.augments.length; i++) {
				ctx.drawImage(playerSheet, 	this.augments[i].draw(this.selected_state, this.dir).b[this.b_anim_index].x,	this.augments[i].draw(this.selected_state, this.dir).b[this.b_anim_index].y+this.augments[i].drawCol,
											this.augments[i].draw(this.selected_state, this.dir).b[this.b_anim_index].w,	this.augments[i].draw(this.selected_state, this.dir).b[this.b_anim_index].h,this.x-4, this.y,16,8);
				ctx.drawImage(playerSheet, 	this.augments[i].draw(this.selected_state, this.dir).h[this.h_anim_index].x,	this.augments[i].draw(this.selected_state, this.dir).h[this.h_anim_index].y+this.augments[i].drawCol,
											this.augments[i].draw(this.selected_state, this.dir).h[this.h_anim_index].w,	this.augments[i].draw(this.selected_state, this.dir).h[this.h_anim_index].h,this.x-4, this.y-15+headbob,16,16);
			}
		}
	},
	init: 	function() {
				this.health = 10;
				this.maxHealth = 10;
				this.spirit = 10;
				this.maxSpirit = 10;
				this.curse = 0;
				this.moveWhileAttacking = false;
				
				this.x = 9*tileSize;
				this.y = 8*tileSize;
				this.dir = 2;
				this.strafe = false;
				this.moving = false;
				this.attacking = false;
				this.speed = 1;
				this.base_damage = 1;
				this.base_defense = 1;

				this.healthGen = 0;
				this.spiritGen = .1;
				this.curseGen = .0001;
				this.exp = 0;
				this.lvl = 0;
				
				this.augments = [];
				this.keys = [];
				
				this.b_anim_index = 0;
				this.b_animCounter = -1;
				
				this.wepIndex = 0;
				this.b_currAnim = this.animations.b_iD_anim;
			}, 
	keys:[],
	wepIndex: 0,
	weapons:[],
	maxWeps: 5
};

////////////////////////////////augments//////////////////////////////////
var augments = [
	{   name: 'Scarf', sprite: 993,
		effectText: '+.25 spd', 
		drawCol: 0, 
		animations:{
			h:[
				[{x:144,y:0,h:16,w:16,dur:4}],
				[{x:128,y:16,h:16,w:16,dur:4}],
				[{x:128,y:0,h:16,w:16,dur:4}],
				[{x:144,y:16,h:16,w:16,dur:4}]
			],
			b_idle:[
				[{x:160,y:24,h:8,w:16,dur:4}],
				[{x:160,y:16,h:8,w:16,dur:4}],
				[{x:160,y:0,h:8,w:16,dur:4}],
				[{x:160,y:8,h:8,w:16,dur:4}]
			],
			b_walk:[
				[{x:176,y:24,h:8,w:16,dur:4},	{x:160,y:24,h:8,w:16,dur:4},	{x:192,y:24,h:8,w:16,dur:4},	{x:160,y:24,h:8,w:16,dur:4}],
				[{x:176,y:16,h:8,w:16,dur:4},	{x:160,y:16,h:8,w:16,dur:4},	{x:192,y:16,h:8,w:16,dur:4},	{x:160,y:16,h:8,w:16,dur:4}],
				[{x:176,y:0,h:8,w:16,dur:4},	{x:160,y:0,h:8,w:16,dur:4},		{x:192,y:0,h:8,w:16,dur:4},		{x:160,y:0,h:8,w:16,dur:4}],
				[{x:176,y:8,h:8,w:16,dur:4},	{x:160,y:8,h:8,w:16,dur:4},		{x:192,y:8,h:8,w:16,dur:4},		{x:160,y:8,h:8,w:16,dur:4}]
			],
			b_attack:[
				[{x:208,y:24,h:8,w:16,dur:4},	{x:224,y:24,h:8,w:16,dur:4},	{x:240,y:24,h:8,w:16,dur:4}],
				[{x:208,y:16,h:8,w:16,dur:4},	{x:224,y:16,h:8,w:16,dur:4},	{x:240,y:16,h:8,w:16,dur:4}],
				[{x:208,y:0,h:8,w:16,dur:4},	{x:224,y:0,h:8,w:16,dur:4},		{x:240,y:0,h:8,w:16,dur:4}],
				[{x:208,y:8,h:8,w:16,dur:4},	{x:224,y:8,h:8,w:16,dur:4},		{x:240,y:8,h:8,w:16,dur:4}]
			]
			
		},
		draw: function(state, dir) {
			switch(state) {
				case	'idle':	return {h:this.animations.h[dir], b:this.animations.b_idle[dir]};
								break;
				case	'moving':	return {h:this.animations.h[dir], b:this.animations.b_walk[dir]};
								break;
				case	'attacking':	return {h:this.animations.h[dir], b:this.animations.b_attack[dir]};
								break;
			}
		},
		onPickup:   function() {
			player.speed = player.speed+.25;
		},
		onDrop:     function() {
			player.speed = player.speed-.25;
		},
		action:     function() {
		}
	},
	{   name: 'Pin', sprite: 994,
		effectText: '+.005 hpr',
		drawCol: 32,
		animations:{
			h:[
				[{x:144,y:0,h:16,w:16,dur:4}],
				[{x:128,y:16,h:16,w:16,dur:4}],
				[{x:128,y:0,h:16,w:16,dur:4}],
				[{x:144,y:16,h:16,w:16,dur:4}]
			],
			b_idle:[
				[{x:160,y:24,h:8,w:16,dur:4}],
				[{x:160,y:16,h:8,w:16,dur:4}],
				[{x:160,y:0,h:8,w:16,dur:4}],
				[{x:160,y:8,h:8,w:16,dur:4}]
			],
			b_walk:[
				[{x:176,y:24,h:8,w:16,dur:4},	{x:160,y:24,h:8,w:16,dur:4},	{x:192,y:24,h:8,w:16,dur:4},	{x:160,y:24,h:8,w:16,dur:4}],
				[{x:176,y:16,h:8,w:16,dur:4},	{x:160,y:16,h:8,w:16,dur:4},	{x:192,y:16,h:8,w:16,dur:4},	{x:160,y:16,h:8,w:16,dur:4}],
				[{x:176,y:0,h:8,w:16,dur:4},	{x:160,y:0,h:8,w:16,dur:4},		{x:192,y:0,h:8,w:16,dur:4},		{x:160,y:0,h:8,w:16,dur:4}],
				[{x:176,y:8,h:8,w:16,dur:4},	{x:160,y:8,h:8,w:16,dur:4},		{x:192,y:8,h:8,w:16,dur:4},		{x:160,y:8,h:8,w:16,dur:4}]
			],
			b_attack:[
				[{x:208,y:24,h:8,w:16,dur:4},	{x:224,y:24,h:8,w:16,dur:4},	{x:240,y:24,h:8,w:16,dur:4}],
				[{x:208,y:16,h:8,w:16,dur:4},	{x:224,y:16,h:8,w:16,dur:4},	{x:240,y:16,h:8,w:16,dur:4}],
				[{x:208,y:0,h:8,w:16,dur:4},	{x:224,y:0,h:8,w:16,dur:4},		{x:240,y:0,h:8,w:16,dur:4}],
				[{x:208,y:8,h:8,w:16,dur:4},	{x:224,y:8,h:8,w:16,dur:4},		{x:240,y:8,h:8,w:16,dur:4}]
			]
			
		},
		draw: function(state, dir) {
			switch(state) {
				case	'idle':	return {h:this.animations.h[dir], b:this.animations.b_idle[dir]};
								break;
				case	'moving':	return {h:this.animations.h[dir], b:this.animations.b_walk[dir]};
								break;
				case	'attacking':	return {h:this.animations.h[dir], b:this.animations.b_attack[dir]};
								break;
			}
		},
		onPickup:   function() {player.healthGen = player.healthGen+.005;}, 	
		onDrop:     function() {player.healthGen = player.healthGen-.005;},
		action:     function() {}
	},
	{   name: 'Brace', sprite: 995,
		effectText: '+.1 spr',
		drawCol: 64, 
		animations:{
			h:[
				[{x:144,y:0,h:16,w:16,dur:4}],
				[{x:128,y:16,h:16,w:16,dur:4}],
				[{x:128,y:0,h:16,w:16,dur:4}],
				[{x:144,y:16,h:16,w:16,dur:4}]
			],
			b_idle:[
				[{x:160,y:24,h:8,w:16,dur:4}],
				[{x:160,y:16,h:8,w:16,dur:4}],
				[{x:160,y:0,h:8,w:16,dur:4}],
				[{x:160,y:8,h:8,w:16,dur:4}]
			],
			b_walk:[
				[{x:176,y:24,h:8,w:16,dur:4},	{x:160,y:24,h:8,w:16,dur:4},	{x:192,y:24,h:8,w:16,dur:4},	{x:160,y:24,h:8,w:16,dur:4}],
				[{x:176,y:16,h:8,w:16,dur:4},	{x:160,y:16,h:8,w:16,dur:4},	{x:192,y:16,h:8,w:16,dur:4},	{x:160,y:16,h:8,w:16,dur:4}],
				[{x:176,y:0,h:8,w:16,dur:4},	{x:160,y:0,h:8,w:16,dur:4},		{x:192,y:0,h:8,w:16,dur:4},		{x:160,y:0,h:8,w:16,dur:4}],
				[{x:176,y:8,h:8,w:16,dur:4},	{x:160,y:8,h:8,w:16,dur:4},		{x:192,y:8,h:8,w:16,dur:4},		{x:160,y:8,h:8,w:16,dur:4}]
			],
			b_attack:[
				[{x:208,y:24,h:8,w:16,dur:4},	{x:224,y:24,h:8,w:16,dur:4},	{x:240,y:24,h:8,w:16,dur:4}],
				[{x:208,y:16,h:8,w:16,dur:4},	{x:224,y:16,h:8,w:16,dur:4},	{x:240,y:16,h:8,w:16,dur:4}],
				[{x:208,y:0,h:8,w:16,dur:4},	{x:224,y:0,h:8,w:16,dur:4},		{x:240,y:0,h:8,w:16,dur:4}],
				[{x:208,y:8,h:8,w:16,dur:4},	{x:224,y:8,h:8,w:16,dur:4},		{x:240,y:8,h:8,w:16,dur:4}]
			]
			
		},
		draw: function(state, dir) {
			switch(state) {
				case	'idle':	return {h:this.animations.h[dir], b:this.animations.b_idle[dir]};
								break;
				case	'moving':	return {h:this.animations.h[dir], b:this.animations.b_walk[dir]};
								break;
				case	'attacking':	return {h:this.animations.h[dir], b:this.animations.b_attack[dir]};
								break;
			}
		},
		onPickup:   function() {player.spiritGen = player.spiritGen+.1;},
		onDrop:     function() {player.spiritGen = player.spiritGen-.1;},
		action:     function() {}
	},
	{   name: 'Tabard', sprite: 996,
		effectText: '+move+atk',
		drawCol: 96, 
		animations:{
			h:[
				[{x:144,y:0,h:16,w:16,dur:4}],
				[{x:128,y:16,h:16,w:16,dur:4}],
				[{x:128,y:0,h:16,w:16,dur:4}],
				[{x:144,y:16,h:16,w:16,dur:4}]
			],
			b_idle:[
				[{x:160,y:24,h:8,w:16,dur:4}],
				[{x:160,y:16,h:8,w:16,dur:4}],
				[{x:160,y:0,h:8,w:16,dur:4}],
				[{x:160,y:8,h:8,w:16,dur:4}]
			],
			b_walk:[
				[{x:176,y:24,h:8,w:16,dur:4},	{x:160,y:24,h:8,w:16,dur:4},	{x:192,y:24,h:8,w:16,dur:4},	{x:160,y:24,h:8,w:16,dur:4}],
				[{x:176,y:16,h:8,w:16,dur:4},	{x:160,y:16,h:8,w:16,dur:4},	{x:192,y:16,h:8,w:16,dur:4},	{x:160,y:16,h:8,w:16,dur:4}],
				[{x:176,y:0,h:8,w:16,dur:4},	{x:160,y:0,h:8,w:16,dur:4},		{x:192,y:0,h:8,w:16,dur:4},		{x:160,y:0,h:8,w:16,dur:4}],
				[{x:176,y:8,h:8,w:16,dur:4},	{x:160,y:8,h:8,w:16,dur:4},		{x:192,y:8,h:8,w:16,dur:4},		{x:160,y:8,h:8,w:16,dur:4}]
			],
			b_attack:[
				[{x:208,y:24,h:8,w:16,dur:4},	{x:224,y:24,h:8,w:16,dur:4},	{x:240,y:24,h:8,w:16,dur:4}],
				[{x:208,y:16,h:8,w:16,dur:4},	{x:224,y:16,h:8,w:16,dur:4},	{x:240,y:16,h:8,w:16,dur:4}],
				[{x:208,y:0,h:8,w:16,dur:4},	{x:224,y:0,h:8,w:16,dur:4},		{x:240,y:0,h:8,w:16,dur:4}],
				[{x:208,y:8,h:8,w:16,dur:4},	{x:224,y:8,h:8,w:16,dur:4},		{x:240,y:8,h:8,w:16,dur:4}]
			]
			
		},
		draw: function(state, dir) {
			switch(state) {
				case	'idle':	return {h:this.animations.h[dir], b:this.animations.b_idle[dir]};
								break;
				case	'moving':	return {h:this.animations.h[dir], b:this.animations.b_walk[dir]};
								break;
				case	'attacking':	return {h:this.animations.h[dir], b:this.animations.b_attack[dir]};
								break;
			}
		},
		onPickup:   function() {player.moveWhileAttacking = true;},
		onDrop:	    function() {player.moveWhileAttacking = false;},
		action:     function() {}
	},
	{   name: 'Robe', sprite: 997,
		effectText: '+1 def',
		drawCol: 128, 
		animations:{
			h:[
				[{x:144,y:0,h:16,w:16,dur:4}],
				[{x:128,y:16,h:16,w:16,dur:4}],
				[{x:128,y:0,h:16,w:16,dur:4}],
				[{x:144,y:16,h:16,w:16,dur:4}]
			],
			b_idle:[
				[{x:160,y:24,h:8,w:16,dur:4}],
				[{x:160,y:16,h:8,w:16,dur:4}],
				[{x:160,y:0,h:8,w:16,dur:4}],
				[{x:160,y:8,h:8,w:16,dur:4}]
			],
			b_walk:[
				[{x:176,y:24,h:8,w:16,dur:4},	{x:160,y:24,h:8,w:16,dur:4},	{x:192,y:24,h:8,w:16,dur:4},	{x:160,y:24,h:8,w:16,dur:4}],
				[{x:176,y:16,h:8,w:16,dur:4},	{x:160,y:16,h:8,w:16,dur:4},	{x:192,y:16,h:8,w:16,dur:4},	{x:160,y:16,h:8,w:16,dur:4}],
				[{x:176,y:0,h:8,w:16,dur:4},	{x:160,y:0,h:8,w:16,dur:4},		{x:192,y:0,h:8,w:16,dur:4},		{x:160,y:0,h:8,w:16,dur:4}],
				[{x:176,y:8,h:8,w:16,dur:4},	{x:160,y:8,h:8,w:16,dur:4},		{x:192,y:8,h:8,w:16,dur:4},		{x:160,y:8,h:8,w:16,dur:4}]
			],
			b_attack:[
				[{x:208,y:24,h:8,w:16,dur:3},	{x:224,y:24,h:8,w:16,dur:3},	{x:240,y:24,h:8,w:16,dur:10}],
				[{x:208,y:16,h:8,w:16,dur:3},	{x:224,y:16,h:8,w:16,dur:3},	{x:240,y:16,h:8,w:16,dur:10}],
				[{x:208,y:0,h:8,w:16,dur:3},	{x:224,y:0,h:8,w:16,dur:3},		{x:240,y:0,h:8,w:16,dur:10}],
				[{x:208,y:8,h:8,w:16,dur:3},	{x:224,y:8,h:8,w:16,dur:3},		{x:240,y:8,h:8,w:16,dur:10}]
			]
			
		},
		draw: function(state, dir) {
			switch(state) {
				case	'idle':	return {h:this.animations.h[dir], b:this.animations.b_idle[dir]};
								break;
				case	'moving':	return {h:this.animations.h[dir], b:this.animations.b_walk[dir]};
								break;
				case	'attacking':	return {h:this.animations.h[dir], b:this.animations.b_attack[dir]};
								break;
			}
		},
		onPickup:   function() {player.base_defense = player.base_defense+1}, 
		onDrop:     function() {player.base_defense = player.base_defense-1},
		action:     function(){}
	},
	{   name: 'Horns', sprite: 998,
		effectText: '+1 dmg',
		drawCol: 160,
		animations:{
			h:[
				[{x:144,y:0,h:16,w:16,dur:4}],
				[{x:128,y:16,h:16,w:16,dur:4}],
				[{x:128,y:0,h:16,w:16,dur:4}],
				[{x:144,y:16,h:16,w:16,dur:4}]
			],
			b_idle:[
				[{x:160,y:24,h:8,w:16,dur:4}],
				[{x:160,y:16,h:8,w:16,dur:4}],
				[{x:160,y:0,h:8,w:16,dur:4}],
				[{x:160,y:8,h:8,w:16,dur:4}]
			],
			b_walk:[
				[{x:176,y:24,h:8,w:16,dur:4},	{x:160,y:24,h:8,w:16,dur:4},	{x:192,y:24,h:8,w:16,dur:4},	{x:160,y:24,h:8,w:16,dur:4}],
				[{x:176,y:16,h:8,w:16,dur:4},	{x:160,y:16,h:8,w:16,dur:4},	{x:192,y:16,h:8,w:16,dur:4},	{x:160,y:16,h:8,w:16,dur:4}],
				[{x:176,y:0,h:8,w:16,dur:4},	{x:160,y:0,h:8,w:16,dur:4},		{x:192,y:0,h:8,w:16,dur:4},		{x:160,y:0,h:8,w:16,dur:4}],
				[{x:176,y:8,h:8,w:16,dur:4},	{x:160,y:8,h:8,w:16,dur:4},		{x:192,y:8,h:8,w:16,dur:4},		{x:160,y:8,h:8,w:16,dur:4}]
			],
			b_attack:[
				[{x:208,y:24,h:8,w:16,dur:4},	{x:224,y:24,h:8,w:16,dur:4},	{x:240,y:24,h:8,w:16,dur:4}],
				[{x:208,y:16,h:8,w:16,dur:4},	{x:224,y:16,h:8,w:16,dur:4},	{x:240,y:16,h:8,w:16,dur:4}],
				[{x:208,y:0,h:8,w:16,dur:4},	{x:224,y:0,h:8,w:16,dur:4},		{x:240,y:0,h:8,w:16,dur:4}],
				[{x:208,y:8,h:8,w:16,dur:4},	{x:224,y:8,h:8,w:16,dur:4},		{x:240,y:8,h:8,w:16,dur:4}]
			]
			
		},
		draw: function(state, dir) {
			switch(state) {
				case	'idle':	return {h:this.animations.h[dir], b:this.animations.b_idle[dir]};
								break;
				case	'moving':	return {h:this.animations.h[dir], b:this.animations.b_walk[dir]};
								break;
				case	'attacking':	return {h:this.animations.h[dir], b:this.animations.b_attack[dir]};
								break;
			}
		},
		onPickup:   function() {player.base_damage = player.base_damage+1},
		onDrop:	    function() {player.base_damage = player.base_damage-1},
		action:     function(){}
	}
];

////////////////////////////////weapons///////////////////////////////////
var weps = [
	{   name:'wep_test',
		init_cost: 3,
		cont: false,
		swung: false,
		use_cost: .1,
		knockback: 8,
		curseScale: 0,
		aoe: [
			[{x: 0, y: -16, w:16, h:8, dur:2},	{x: -12, y: -16, w:16, h:8, dur:2},	{x: -12, y: -8, w:8, h:16, dur:2}],
			[{x: 0, y: -16, w:16, h:8, dur:2},	{x: -12, y: -16, w:16, h:8, dur:2},	{x: -12, y: -8, w:8, h:16, dur:2}],
			[{x: -8, y: +8, w:16, h:8, dur:2},	{x: +4, y: +8, w:16, h:8, dur:2},	{x: +12, y: -8, w:8, h:16, dur:2}],
			[{x: -12, y: -16, w:16, h:8, dur:2},{x: 0, y: -16, w:16, h:8, dur:2},	{x: +12, y: -8, w:8, h:16, dur:2}],
		],
		animations: [
			[{x:0,y:0,w:32,h:32},{x:32,y:0,w:32,h:32},{x:64,y:0,w:32,h:32}],
			[{x:0,y:32,w:32,h:32},{x:32,y:32,w:32,h:32},{x:64,y:32,w:32,h:32}],
			[{x:0,y:64,w:32,h:32},{x:32,y:64,w:32,h:32},{x:64,y:64,w:32,h:32}],
			[{x:0,y:96,w:32,h:32},{x:32,y:96,w:32,h:32},{x:64,y:96,w:32,h:32}]
		],
		damage: 1,
		durCount:0,
		atkIndex:0,
		actioning: false,
		update: function() {
					
					if (this.actioning == true) {
						this.durCount++;
						
						//drawSprite(this.aoe[player.dir][this.atkIndex].sprite, player.x+this.aoe[player.dir][this.atkIndex].x, player.y+this.aoe[player.dir][this.atkIndex].y);
						ctx.drawImage(wepSheet, this.animations[player.dir][this.atkIndex].x, this.animations[player.dir][this.atkIndex].y, 
												this.animations[player.dir][this.atkIndex].w, this.animations[player.dir][this.atkIndex].h,
												player.x-12, player.y-16, 
												this.animations[player.dir][this.atkIndex].w, this.animations[player.dir][this.atkIndex].h);
						/*ctx.fillStyle = 'red';
						ctx.fillRect(player.x+this.aoe[player.dir][this.atkIndex].x, player.y+this.aoe[player.dir][this.atkIndex].y, 
									this.aoe[player.dir][this.atkIndex].w,this.aoe[player.dir][this.atkIndex].h);*/
						for (var i=0; i<map[mapLoc.y][mapLoc.x].contents.length; i++) {
							if (map[mapLoc.y][mapLoc.x].contents[i].type == 'mob') {
								
								if (map[mapLoc.y][mapLoc.x].contents[i].alive == true &&
									((map[mapLoc.y][mapLoc.x].contents[i].loc.x+8 >= player.x+this.aoe[player.dir][this.atkIndex].x && 
									map[mapLoc.y][mapLoc.x].contents[i].loc.x+8 < player.x+this.aoe[player.dir][this.atkIndex].x+this.aoe[player.dir][this.atkIndex].w) ||
									(map[mapLoc.y][mapLoc.x].contents[i].loc.x >= player.x+this.aoe[player.dir][this.atkIndex].x && 
									map[mapLoc.y][mapLoc.x].contents[i].loc.x < player.x+this.aoe[player.dir][this.atkIndex].x+this.aoe[player.dir][this.atkIndex].w)) &&
									((map[mapLoc.y][mapLoc.x].contents[i].loc.y+8 >= player.y+this.aoe[player.dir][this.atkIndex].y && 
									map[mapLoc.y][mapLoc.x].contents[i].loc.y+8 < player.y+this.aoe[player.dir][this.atkIndex].y+this.aoe[player.dir][this.atkIndex].h) ||
									(map[mapLoc.y][mapLoc.x].contents[i].loc.y >= player.y+this.aoe[player.dir][this.atkIndex].y && 
									map[mapLoc.y][mapLoc.x].contents[i].loc.y < player.y+this.aoe[player.dir][this.atkIndex].y+this.aoe[player.dir][this.atkIndex].h))) {
									
									map[mapLoc.y][mapLoc.x].contents[i].health = map[mapLoc.y][mapLoc.x].contents[i].health-((player.base_damage+this.damage)+player.curse*this.curseScale);
									ctx.fillStyle = 'red';
									ctx.fillRect(map[mapLoc.y][mapLoc.x].contents[i].loc.x, map[mapLoc.y][mapLoc.x].contents[i].loc.y, tileSize, tileSize);
									
									if (player.dir == 0 && currLvl[1][Math.floor((map[mapLoc.y][mapLoc.x].contents[i].loc.y+4-this.knockback)/tileSize)][Math.floor((map[mapLoc.y][mapLoc.x].contents[i].loc.x+4)/tileSize)] == 0) {
										map[mapLoc.y][mapLoc.x].contents[i].loc.y = map[mapLoc.y][mapLoc.x].contents[i].loc.y-this.knockback;
									}
									if (player.dir == 1 && currLvl[1][Math.floor((map[mapLoc.y][mapLoc.x].contents[i].loc.y+4)/tileSize)][Math.floor((map[mapLoc.y][mapLoc.x].contents[i].loc.x+4-this.knockback)/tileSize)] == 0) {
										map[mapLoc.y][mapLoc.x].contents[i].loc.x = map[mapLoc.y][mapLoc.x].contents[i].loc.x-this.knockback;
									}
									if (player.dir == 2 && currLvl[1][Math.floor((map[mapLoc.y][mapLoc.x].contents[i].loc.y+4+this.knockback)/tileSize)][Math.floor((map[mapLoc.y][mapLoc.x].contents[i].loc.x+4)/tileSize)] == 0) {
										map[mapLoc.y][mapLoc.x].contents[i].loc.y = map[mapLoc.y][mapLoc.x].contents[i].loc.y+this.knockback;
									}
									if (player.dir == 3 && currLvl[1][Math.floor((map[mapLoc.y][mapLoc.x].contents[i].loc.y+4)/tileSize)][Math.floor((map[mapLoc.y][mapLoc.x].contents[i].loc.x+4+this.knockback)/tileSize)] == 0) {
										map[mapLoc.y][mapLoc.x].contents[i].loc.x = map[mapLoc.y][mapLoc.x].contents[i].loc.x+this.knockback;
									}
								}
							}
						}
						//player.attacking = false;
						
						if (this.durCount > this.aoe[player.dir][this.atkIndex].dur) {
							this.durCount = 0;
							this.atkIndex++;
							if (this.atkIndex >= this.aoe[player.dir].length) {
								this.atkIndex = 0;
								this.actioning = false;
								if (this.cont == false) {
									if (player.state.indexOf('attacking') > -1) {
										player.state.splice(player.state.indexOf('attacking'),1);
									}
								}
							}
						}
					}
				},
		action:	function() {
					if (this.actioning == false) {
						this.actioning = true;
						this.swung = true;
						this.durCount = 0;
					}
				}
	}
];
player.weapons.push(weps[0]);       //default the weapon for testing purposes

////////////////////////////////room entities/////////////////////////////
{
	var ent_aug = {type: 'aug', 
		sprite: [614,615], 
		loc: {x: 9*tileSize, y: 8*tileSize}, 
		collected: false,
		update: function() {
			if (player.x <= (this.loc.x)+4 && player.x > (this.loc.x)-4 && 
				player.y <= (this.loc.y)+4 && player.y > (this.loc.y)-4 &&
				this.collected == false) {
				player.augments.push(augments[this.aug]);
				player.statusCount = 50;
				player.newStatus = augments[this.aug].sprite;
				if (player.augments.length > player.maxAugs) {
					player.augments[0].onDrop();
					player.augments.shift();
				}
				augments[this.aug].onPickup();
				this.collected = true;
			}
		},
		draw: function() {
			if (this.collected == false) {	
				if (blink == true) {
					drawSprite(augments[this.aug].sprite, this.loc.x, this.loc.y);
				} else {
					drawSprite(augments[this.aug].sprite, this.loc.x, this.loc.y-1);
				}
				
			  
			}
		},
		aug: -1
	};
	var ent_key = {type: 'key',
		sprite: [581, 580], 
		loc: {x: 9*tileSize, y: 8*tileSize}, 
		collected: false,
		update:	function() {
			if (player.x <= (this.loc.x)+4 && player.x > (this.loc.x)-4 && 
				player.y <= (this.loc.y)+4 && player.y > (this.loc.y)-4 &&
				this.collected == false) {
				player.keys.push(this);
				remKeys--;
				player.newStatus = 581;
				player.statusCount = 50;
				this.collected = true;
			}
		},
		draw: function() {
			if (this.collected == false) {	
				
				drawSprite(this.sprite[0], this.loc.x, this.loc.y);
				
				
			}
		}
	};
	var ent_drop = {type: 'drop',
		sprite: [614],
		loc: {x:-1,y:-1},
		collected: false,
		update: function() {
			if (player.x <= (this.loc.x)+4 && player.x > (this.loc.x)-4 && 
				player.y <= (this.loc.y)+4 && player.y > (this.loc.y)-4 &&
				this.collected == false) {
				player.health = player.health+1;
				player.newStatus = 999;
				player.statusCount = 50;
				this.collected = true;
			}
		},
		draw: function() {
			if (this.collected == false) {
				drawSprite(this.sprite[0], this.loc.x, this.loc.y);
			}
		}	
	};
	var ent_goal = {type: 'goal',
		sprite: [613],
		loc: {x: 9.5*tileSize, y: 8*tileSize},
		update:	function() {
			if (player.x <= (this.loc.x)+4 && player.x > (this.loc.x)-4 && player.y <= (this.loc.y)+4 && player.y > (this.loc.y)-4 
				&& (remKeys == 0 || remMobs == 0)) {
				lvlComplete = true;
				var rand = Math.floor(Math.random()*pals.length); 
				currPal = pals[rand];
				
				player.curse = player.curse*(.25);
				rTransition = 4;
				roomDrawY = 0-(2*screenHeight+16);
				player.keys = [];
				buildLevel(expansionFactor);
			}
		},
		draw:	function() {
			drawSprite(this.sprite[0], this.loc.x, this.loc.y);
		},
		diff: -1
	};
	var ent_chest = {type: 'chest',
		sprite: [544, 543], 
		loc: {x: 9*tileSize, y: 8*tileSize},
		open: false,
		contents:'drop',
		augType: -1,
		update:	function() {
			if (player.x <= (this.loc.x)+8 && player.x > (this.loc.x)-12 && player.y <= (this.loc.y)+8 && player.y > (this.loc.y)-12) {
				if (this.open == false) {
					this.open = true;
					if (this.contents == 'key') {
						map[mapLoc.y][mapLoc.x].contents.push(Object.assign(true, {}, ent_key));
					} else if (this.contents == 'aug'){
						map[mapLoc.y][mapLoc.x].contents.push(Object.assign(true, {}, ent_aug));
						map[mapLoc.y][mapLoc.x].contents[map[mapLoc.y][mapLoc.x].contents.length-1].aug = this.augType;
					}else {
						map[mapLoc.y][mapLoc.x].contents.push(Object.assign(true, {}, ent_drop));
					}
					
					map[mapLoc.y][mapLoc.x].contents[map[mapLoc.y][mapLoc.x].contents.length-1].loc.x = player.x;
					map[mapLoc.y][mapLoc.x].contents[map[mapLoc.y][mapLoc.x].contents.length-1].loc.y = player.y;
				}
			}
		},
		draw:	function() {
			if (this.open == false) {
				drawSprite(this.sprite[0], this.loc.x, this.loc.y);
			} else {
				drawSprite(this.sprite[1], this.loc.x, this.loc.y);
				
			}
			
		},
		diff: -1
	};
	
}

////////////////////////////////AI's//////////////////////////////////////
var ais = [
	{   name: 'aggressive',
		behavoir:   function() {
			var rand = Math.floor(Math.random()*8);
									
			if (rand == 0) {
				this.speed = 1.5;
				if ((this.loc.x - player.x) > 0) {
					rand = 1;
				} else {
					rand = 3;
				}
			} else if (rand == 1){
				this.speed = 1.5;
				if ((this.loc.y - player.y) > 0) {
					rand = 0;
				} else {
					rand = 2;
				}
			} else {
				this.speed  = 1;
				rand = Math.floor(Math.random()*4);
			}
			
			if (rand == 0) {
				if (this.loc.y >= 16 
					&& currLvl[1][Math.floor((Math.floor(this.loc.y)-.5)/8)][Math.floor(Math.floor(this.loc.x)/8)] ==0
					&& currLvl[1][Math.floor((Math.floor(this.loc.y)-.5)/8)][Math.ceil(Math.ceil(this.loc.x)/8)] ==0) {
					this.loc.y-=this.speed;
					this.dir = 0;
				}
			}
			if (rand == 1) {
				if (this.loc.x >= 16 
					&& currLvl[1][Math.floor((Math.floor(this.loc.y))/8)][Math.floor((Math.floor(this.loc.x)-.5)/8)] == 0
					&& currLvl[1][Math.ceil(((Math.ceil(this.loc.y)))/8)][Math.floor((Math.floor(this.loc.x)-.5)/8)] == 0) {
					this.loc.x-=this.speed;
					this.dir = 1;
				}
			}
			if (rand == 2) {
				if (this.loc.y+8 < screenHeight-32 
					&& currLvl[1][Math.ceil((Math.ceil(this.loc.y)+.5)/8)][Math.floor(Math.floor(this.loc.x)/8)] == 0
					&& currLvl[1][Math.ceil((Math.ceil(this.loc.y)+.5)/8)][Math.ceil(Math.ceil(this.loc.x)/8)] == 0) {
					this.loc.y+=this.speed;
					this.dir = 2;
				}
			}
			if (rand == 3) {
				if (this.loc.x+8 < screenWidth-16
					&& currLvl[1][Math.ceil(Math.ceil(this.loc.y)/8)][Math.ceil((Math.ceil(this.loc.x)+.5)/8)] == 0
					&& currLvl[1][Math.floor(Math.floor(this.loc.y)/8)][Math.ceil((Math.ceil(this.loc.x)+.5)/8)] == 0) {
					this.loc.x+=this.speed;
					this.dir = 3;
				}
			}
			
			if (player.state.indexOf('invincible') <0 && player.x <= (this.loc.x)+8 &&  player.x > (this.loc.x)-8 && player.y <= (this.loc.y)+8 &&  player.y > (this.loc.y)-8) {
				if (this.damage-(player.base_defense-1) > 0) {
					player.health = player.health-(this.damage-(player.base_defense-1));
				}
				
				if (player.state.indexOf('invincible') <0 && player.dir == 0 && currLvl[1][Math.floor((player.y+8)/tileSize)][Math.floor((player.x)/tileSize)] == 0) {
					player.y+=8;
				}
				if (player.state.indexOf('invincible') <0 && player.dir == 1 && currLvl[1][Math.floor((player.y)/tileSize)][Math.floor((player.x+8)/tileSize)] == 0) {
					player.x+=8;
				}
				if (player.state.indexOf('invincible') <0 && player.dir == 2 && currLvl[1][Math.floor((player.y-8)/tileSize)][Math.floor((player.x)/tileSize)] == 0) {
					player.y-=8;
				}
				if (player.state.indexOf('invincible') <0 && player.dir == 3 && currLvl[1][Math.floor((player.y)/tileSize)][Math.floor((player.x-8)/tileSize)] == 0) {
					player.x-=8;
				}
				player.state.push('invincible');
				player.invincCounter = 0;
			}
		}
	
	},
	{   name: 'cowardly',
		behavoir:   function() {
						
			var rand = Math.floor(Math.random()*8);
									
			if (rand == 0) {
				this.speed = 1.5;
				if ((this.loc.x - player.x) > 0) {
					rand = 3;
				} else {
					rand = 1;
				}
			} else if (rand == 1){
				this.speed = 1.5;
				if ((this.loc.y - player.y) > 0) {
					rand = 2;
				} else {
					rand = 0;
				}
			} else {
				//this.speed  = 1;
				//rand = Math.floor(Math.random()*4);
			}
			
			if (rand == 0) {
				if (this.loc.y >= 16 
					&& currLvl[1][Math.floor((Math.floor(this.loc.y)-.5)/8)][Math.floor(Math.floor(this.loc.x)/8)] ==0
					&& currLvl[1][Math.floor((Math.floor(this.loc.y)-.5)/8)][Math.ceil(Math.ceil(this.loc.x)/8)] ==0) {
					this.loc.y-=this.speed;
					this.dir = 0;
				}
			}
			if (rand == 1) {
				if (this.loc.x >= 16 
					&& currLvl[1][Math.floor((Math.floor(this.loc.y))/8)][Math.floor((Math.floor(this.loc.x)-.5)/8)] == 0
					&& currLvl[1][Math.ceil(((Math.ceil(this.loc.y)))/8)][Math.floor((Math.floor(this.loc.x)-.5)/8)] == 0) {
					this.loc.x-=this.speed;
					this.dir = 1;
				}
			}
			if (rand == 2) {
				if (this.loc.y+8 < screenHeight-32 
					&& currLvl[1][Math.ceil((Math.ceil(this.loc.y)+.5)/8)][Math.floor(Math.floor(this.loc.x)/8)] == 0
					&& currLvl[1][Math.ceil((Math.ceil(this.loc.y)+.5)/8)][Math.ceil(Math.ceil(this.loc.x)/8)] == 0) {
					this.loc.y+=this.speed;
					this.dir = 2;
				}
			}
			if (rand == 3) {
				if (this.loc.x+8 < screenWidth-16
					&& currLvl[1][Math.ceil(Math.ceil(this.loc.y)/8)][Math.ceil((Math.ceil(this.loc.x)+.5)/8)] == 0
					&& currLvl[1][Math.floor(Math.floor(this.loc.y)/8)][Math.ceil((Math.ceil(this.loc.x)+.5)/8)] == 0) {
					this.loc.x+=this.speed;
					this.dir = 3;
				}
			}
			
			if (player.state.indexOf('invincible') <0 && player.x <= (this.loc.x)+8 &&  player.x > (this.loc.x)-8 && player.y <= (this.loc.y)+8 &&  player.y > (this.loc.y)-8) {
				if (this.damage-(player.base_defense-1) > 0) {
					player.health = player.health-(this.damage-(player.base_defense-1));
				}
				
				if (player.state.indexOf('invincible') <0 && player.dir == 0 && currLvl[1][Math.floor((player.y+8)/tileSize)][Math.floor((player.x)/tileSize)] == 0) {
					player.y+=8;
				}
				if (player.state.indexOf('invincible') <0 && player.dir == 1 && currLvl[1][Math.floor((player.y)/tileSize)][Math.floor((player.x+8)/tileSize)] == 0) {
					player.x+=8;
				}
				if (player.state.indexOf('invincible') <0 && player.dir == 2 && currLvl[1][Math.floor((player.y-8)/tileSize)][Math.floor((player.x)/tileSize)] == 0) {
					player.y-=8;
				}
				if (player.state.indexOf('invincible') <0 && player.dir == 3 && currLvl[1][Math.floor((player.y)/tileSize)][Math.floor((player.x-8)/tileSize)] == 0) {
					player.x-=8;
				}
				player.state.push('invincible');
				player.invincCounter = 0;
			}
		}
	
	}
	
];

////////////////////////////////mobs//////////////////////////////////////
var mobs = [//(considered a subtype of room entities and therefore must have all the necessary elements)
   {    type: 'mob', name:'test_mob', 
		sprite: [906,938,970,1002], loc: {x: -1, y:-1}, speed: 1, dir: 0, health: 4, alive: true, exp_reward: 1,
		animations:{
			
		},
		damage: 1,
		cursePenalty: .25,
		aiIndex:0,
		ai: ais[1].behavoir,
		update:	function() {   
			this.damage = 1*(cycle+1);
			this.cursePenalty = .25*(cycle+1);
			if (this.alive == true) {
				if (this.health <= 0) {
					player.exp = player.exp+this.exp_reward;
					player.curse = player.curse + this.cursePenalty;
					remMobs--;
					map[mapLoc.y][mapLoc.x].contents.push($.extend(true, {}, ent_drop));
					map[mapLoc.y][mapLoc.x].contents[map[mapLoc.y][mapLoc.x].contents.length-1].loc.x = this.loc.x;
					map[mapLoc.y][mapLoc.x].contents[map[mapLoc.y][mapLoc.x].contents.length-1].loc.y = this.loc.y;
					this.alive = false;
				}
				this.ai();
			}
		},
		draw:	function() {
			if (this.alive == true) {
				ctx.fillStyle = 'red';
				ctx.font="4px monospace"
				for (var i=0; i<this.health; i++) {
					ctx.fillRect(this.loc.x+(2*i), this.loc.y-4, 1,4);
				}
				drawSprite(this.sprite[this.dir], this.loc.x, this.loc.y);
			}
		}
	}
];





//////////////////////////////////////////////////////////////////////////
//                                                                      //
//                              INPUT                                   //
//                                                                      //
//////////////////////////////////////////////////////////////////////////

//handlie key presses
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
	case	74:	if (pressedKeys.indexOf('J')<0) {
					pressedKeys.push('J');
				}
				break;
	case    65: if (pressedKeys.indexOf('A')<0) {
					pressedKeys.push('A');
				}
				break;
	case    87: if (pressedKeys.indexOf('W')<0) {
					pressedKeys.push('W');
				}
				break;
	case    68: if (pressedKeys.indexOf('D')<0) {
					pressedKeys.push('D');
				}
				break;
	case    83: if (pressedKeys.indexOf('S')<0) {
					pressedKeys.push('S');
				}
				break;
	case    77: if (pressedKeys.indexOf('M')<0) {
					pressedKeys.push('M');
					if (paused == true) {
						menu = false;
						//bgm.play();
					} else {
						paused = true;
						//bgm.pause();
						menu = true;
						menuHeight = screenHeight-16;
					}
				}
				break;
	case	32:	if (pressedKeys.indexOf('_')<0) {
					if (player.spriit >= player.weapons[player.wepIndex].init_cost) {
						player.attacking = true;
						player.spirit = player.spirit-player.weapons[player.wepIndex].init_cost;
					}
					
					pressedKeys.push('_');
				}
				break;
  }
}, false);

//handle key releases
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
	case	74:	pressedKeys.splice(pressedKeys.indexOf('J'),1);
				break;
	case    65: pressedKeys.splice(pressedKeys.indexOf('A'),1);
				break;
	case    87: pressedKeys.splice(pressedKeys.indexOf('W'),1);
				break;
	case    68: pressedKeys.splice(pressedKeys.indexOf('D'),1);
				break;
	case    83: pressedKeys.splice(pressedKeys.indexOf('S'),1);
				break;
	case    77: pressedKeys.splice(pressedKeys.indexOf('M'),1);
				break;
	case	32:	pressedKeys.splice(pressedKeys.indexOf('_'),1);
				//player.attacking = false;
				break;			
  }
}, false);





//////////////////////////////////////////////////////////////////////////
//                                                                      //
//                              GAME START                              //
//                                                                      //
//////////////////////////////////////////////////////////////////////////

init(0);                             //initialize the game

//kick off EVERYTHING
function init(type, game_over) {
	currPal = pals[0];
	bgm.play();                     //start the bgm
	player.init();                  //initialize the player
	cycle = -1;                     //default the cycle counter
	expansionFactor = 1;            //default the expansion factor
	if (type != null) {
		buildLevel(expansionFactor);    //build the first cycle
	} else {
		console.log('BOOP');
		buildHub();
	}
	prevLvl = JSON.parse(JSON.stringify(currLvl));  //set the prev room to the current room (just as an init)

	//init palette
	var rand = Math.floor(Math.random()*pals.length);
	
	manageScreen();
	if (game_over == null) {
		mainLoop();                         //start event loop
	}
	
}

//fetch a room config
function buildConfig(config_name) {
	var formattedConfig = [[],[],[]];
	var layer = [];
	for (var i=0; i<configs.length; i++) {
		if (config_name == configs[i].name) {
			for (var l=0; l<3; l++) {
				for (var j=0; j<16; j++) {
					layer = [];
					for (var k=0; k<20; k++) {
						layer.push(configs[i].map[l][(j*20)+k]);
					}
					formattedConfig[l].push(layer);
				}
			}
			
			return formattedConfig;
		}
	}
}

//generate a level
function buildLevel(size, prev) {
	player.keys = [];			//clear the players keys
	cycle++;                    //increment the cycle
	remKeys = 0;                //reset the remaining keys
	remMobs = 0;                //reset the remaining mobs
	if (prev == null) {         //if a fresh map, initialize it
		map = [ [0,0,0],
				[0,empty,0],
				[0,0,0]];
	}
	if (!prev) {                //init the starting point if fresh
		mapLoc = {x:1, y:1};
	}
	if (seed == null) {			//gen a seed if needed
		seed = Math.floor(Math.random()*1000000);
	}
	base_seed = seed;
	console.log('Seed: '+seed);	
	var emptList = [];          //holds the list of "empty" rooms needing to be expanded from
	var rand;                   //for RNG
	var i,j,k;                  //iterators
	var genIndex = 0;           //iterator for number of generations
	var minRooms = 3+size;      //the minimum required number of rooms (for the current build)
	var numRooms = 0;           //the current number of rooms in the map (for the current build)
	var numAugs = 0;
	var numChests = 0;
	var numKeys = 0;
	var floorPal = [190];       //list of base tiles available for the floor pallettes in this level (always has 190)
	var posFloors = [191,192,222,223,224,254,255,256];  //list of available base tiles to pic from
	var walls = 0;              //indicates the wallset for this level
	var floorStyle = 0;         //indicates the floor style for this level
	var lvlPal = 0;             //indicates the color pallette for this level
	
	//make a floor palette
	floorStyle = Math.floor(sRandom()*availFloors)*3;			//pick a tile set for the floor
	for (i=0; i<2; i++) {
		rand = Math.floor(sRandom()*posFloors.length);	//pick random tile
		floorPal.push(posFloors[rand]);					//add to working pallette
		posFloors.splice(rand, 1);						//remove tile (so no repeats)
	}				
	floorPal.push(286+Math.floor(sRandom()*3));			//pick an animated tile
	walls = Math.floor(sRandom()*availWalls)*4;			//pick a tile set for the walls
	lvlPal = Math.floor(sRandom()*pals.length);			//pick a color pallette			
	
	
	function expandMap(y, x) {	//expands the map
		
		if (y == 0) {
			var newRow = [];
			for (c=0; c<map[0].length; c++) {
				newRow.push(0);
			}
			map.unshift(newRow);
			mapLoc.y++;
			for (c=0; c<emptList.length; c++) {
				emptList[c].y++;
			}
		}
		if (x == 0) {
			for (c=0; c<map.length; c++) {
				map[c].unshift(0);
			}
			mapLoc.x++;
			for (c=0; c<emptList.length; c++) {
				emptList[c].x++;
			}
		}
		if (y == map.length-1) {
			var newRow = [];
			for (c=0; c<map[0].length; c++) {
				newRow.push(0);
			}
			map.push(newRow);
		}
		if (x == map[emptList[j].y].length-1) {
			for (c=0; c<map.length; c++) {
				map[c].push(0);
			}
		}
	} 
	
	function genFloor(y, x) {	//generates a floor
		var floorRow = [];
		var floorRand;
		for (var k=0; k<16; k++) {
			floorRow = [];
			for (var l=0; l<20; l++) {
				
				floorRand = Math.floor(sRandom()*8);
				
				if (floorRand == 0) {
					floorRow.push(floorPal[3]);
				}
				if (floorRand == 1 || floorRand == 2) {
					floorRow.push(floorPal[1]);
				}
				if (floorRand == 3 || floorRand == 4) {
					floorRow.push(floorPal[2]);
				}
				if (floorRand > 4) {
					floorRow.push(floorPal[0]);
				}
			}
			map[y][x].map[0][k] = (JSON.parse(JSON.stringify(floorRow)));
		}
	}
	
	for (i=0; i<size; i++) {
		
		//build list of expandable rooms
		for (j=0; j<map.length; j++) {
			for (k=0; k<map[j].length; k++) {
				if (map[j][k].type == 'empty' ||
					JSON.stringify(map[j][k].config) == JSON.stringify(base_1.config) ||
					JSON.stringify(map[j][k].config) == JSON.stringify(base_2.config) ||
					JSON.stringify(map[j][k].config) == JSON.stringify(base_3.config) ||
					JSON.stringify(map[j][k].config) == JSON.stringify(base_4.config) ||
					JSON.stringify(map[j][k].config) == JSON.stringify(open_40.config) ||
					JSON.stringify(map[j][k].config) == JSON.stringify(open_48.config) ||
					JSON.stringify(map[j][k].config) == JSON.stringify(open_56.config) ||
					JSON.stringify(map[j][k].config) == JSON.stringify(open_64.config)) {
					emptList.push({x:k, y:j});
				}
			}
		}
		
		//expand every empty room in list
		for (j=0; j<emptList.length; j++) {
			
			//check configs of surrounding rooms;
			var matchConfig = [];
			
			if (map[emptList[j].y-1][emptList[j].x] == 0) {   //above
				matchConfig.push(2);
			} else {
				matchConfig.push(map[emptList[j].y-1][emptList[j].x].config[2]);
			}
			if (map[emptList[j].y][emptList[j].x-1] == 0) {   //left
				matchConfig.push(2);
			} else {
				matchConfig.push(map[emptList[j].y][emptList[j].x-1].config[3]);
			}
			if (map[emptList[j].y+1][emptList[j].x] == 0) {   //below
				matchConfig.push(2);
			} else {
				matchConfig.push(map[emptList[j].y+1][emptList[j].x].config[0]);
			}
			if (map[emptList[j].y][emptList[j].x+1] == 0) {   //right
				matchConfig.push(2);
			} else {
				matchConfig.push(map[emptList[j].y][emptList[j].x+1].config[1]);
			}

			//build list of applicable rooms
			var appList = [];
			for (k=0; k<rooms.length; k++) {
				if ((JSON.stringify(rooms[k].config[0]) == JSON.stringify(matchConfig[0]) || matchConfig[0] == 2) &&
					(JSON.stringify(rooms[k].config[1]) == JSON.stringify(matchConfig[1]) || matchConfig[1] == 2) &&
					(JSON.stringify(rooms[k].config[2]) == JSON.stringify(matchConfig[2]) || matchConfig[2] == 2) &&
					(JSON.stringify(rooms[k].config[3]) == JSON.stringify(matchConfig[3]) || matchConfig[3] == 2)) {
					appList.push(JSON.parse(JSON.stringify(rooms[k])));
				}
			}
			
			//pick a room
			rand = Math.floor(sRandom()*appList.length);
			map[emptList[j].y][emptList[j].x] = JSON.parse(JSON.stringify(appList[rand]));
			numRooms++;
			
			//make a floor for the new room here
			genFloor(emptList[j].y, emptList[j].x);
			
			map[emptList[j].y][emptList[j].x].wallStyle = walls;
			map[emptList[j].y][emptList[j].x].floorStyle = floorStyle;
			map[emptList[j].y][emptList[j].x].palette = lvlPal;
			
			//create new empty's
			if (appList[rand].config[0].length > 0 && map[emptList[j].y-1][emptList[j].x] == 0) {
				map[emptList[j].y-1][emptList[j].x] = JSON.parse(JSON.stringify(empty));
				expandMap(emptList[j].y-1, emptList[j].x);
			}
			if (appList[rand].config[1].length > 0 && map[emptList[j].y][emptList[j].x-1] == 0) {
				map[emptList[j].y][emptList[j].x-1] = JSON.parse(JSON.stringify(empty));
				expandMap(emptList[j].y, emptList[j].x-1);
			}
			if (appList[rand].config[2].length > 0 && map[emptList[j].y+1][emptList[j].x] == 0) {
				map[emptList[j].y+1][emptList[j].x] = JSON.parse(JSON.stringify(empty));
				expandMap(emptList[j].y+1, emptList[j].x);
			}
			if (appList[rand].config[3].length > 0 && map[emptList[j].y][emptList[j].x+1] == 0) {
				map[emptList[j].y][emptList[j].x+1] = JSON.parse(JSON.stringify(empty));
				expandMap(emptList[j].y, emptList[j].x+1);
			}
		  
		}
		
		emptList = [];
		if (numRooms < minRooms) {
			i--;
		}
	}
	//cap off the remaining empties
	//build list of remaining empties
	for (j=0; j<map.length; j++) {
		for (k=0; k<map[j].length; k++) {
			if (map[j][k].type == 'empty') {
				emptList.push({x:k, y:j});
			}
		}
	}
	
	for (j=0; j<emptList.length; j++) {
		if (map[emptList[j].y][emptList[j].x].type == 'empty') {
			var capConfig = [];
	
			if (map[emptList[j].y-1][emptList[j].x] == 0) {   //above
				capConfig.push([]);
			} else {
				capConfig.push(map[emptList[j].y-1][emptList[j].x].config[2]);
			}
			if (map[emptList[j].y][emptList[j].x-1] == 0) {   //left
				capConfig.push([]);
			} else {
				capConfig.push(map[emptList[j].y][emptList[j].x-1].config[3]);
			}
			if (map[emptList[j].y+1][emptList[j].x] == 0) {   //below
				capConfig.push([]);
			} else {
				capConfig.push(map[emptList[j].y+1][emptList[j].x].config[0]);
			}
			if (map[emptList[j].y][emptList[j].x+1] == 0) {   //right
				capConfig.push([]);
			} else {
				capConfig.push(map[emptList[j].y][emptList[j].x+1].config[1]);
			}
			
			//build list of applicable rooms
			var capList = [];
			for (k=0; k<rooms.length; k++) {
				if ((JSON.stringify(rooms[k].config[0]) == JSON.stringify(capConfig[0])) &&
					(JSON.stringify(rooms[k].config[1]) == JSON.stringify(capConfig[1])) &&
					(JSON.stringify(rooms[k].config[2]) == JSON.stringify(capConfig[2])) &&
					(JSON.stringify(rooms[k].config[3]) == JSON.stringify(capConfig[3]))) {
					capList.push(JSON.parse(JSON.stringify(rooms[k])));
				}
			}
			//pick a room
			rand = Math.floor(sRandom()*capList.length);
			map[emptList[j].y][emptList[j].x] = JSON.parse(JSON.stringify(capList[rand]));
			numRooms++;
			
			genFloor(emptList[j].y, emptList[j].x);
		
			map[emptList[j].y][emptList[j].x].wallStyle = walls;
			map[emptList[j].y][emptList[j].x].floorStyle = floorStyle;
			map[emptList[j].y][emptList[j].x].palette = lvlPal;
		}
	}
	
	var connectables = 0;
	//check for connectibles
	for (i=0; i<map.length; i++) {
		for (j=0; j<map[i].length; j++) {
			if (map[i][j] !=0) {
				// am I an open room?
				if (map[i][j].config[0].length > 2 || map[i][j].config[1].length > 2 || map[i][j].config[2].length > 2 || map[i][j].config[3].length > 2) {
					
					//Do I neighbor another open room through a small door?
					if (map[i][j].config[0].length <=2) {
						connectables++;
						if (map[i-1][j] !=0 &&
							(map[i-1][j].config[0].length > 2 || map[i-1][j].config[1].length > 2 ||
							map[i-1][j].config[2].length > 2 || map[i-1][j].config[3].length > 2)) {
							
							//change rooms to connect openly
							var nConfig = [JSON.parse(JSON.stringify(map[i-1][j].config[0])),JSON.parse(JSON.stringify(map[i-1][j].config[1])),
											[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],JSON.parse(JSON.stringify(map[i-1][j].config[3]))];
							var mConfig = [[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],JSON.parse(JSON.stringify(map[i][j].config[1])),
											JSON.parse(JSON.stringify(map[i][j].config[2])),JSON.parse(JSON.stringify(map[i][j].config[3]))];
											
							for (k=0; k<rooms.length; k++) {
								if ((JSON.stringify(rooms[k].config[0]) == JSON.stringify(nConfig[0])) &&
									(JSON.stringify(rooms[k].config[1]) == JSON.stringify(nConfig[1])) &&
									(JSON.stringify(rooms[k].config[2]) == JSON.stringify(nConfig[2])) &&
									(JSON.stringify(rooms[k].config[3]) == JSON.stringify(nConfig[3]))) {
									map[i-1][j] = JSON.parse(JSON.stringify(rooms[k]));
									genFloor(i-1, j);
									map[i-1][j].wallStyle = walls;
									map[i-1][j].floorStyle = floorStyle;
									map[i-1][j].palette = lvlPal;
								} 
								if ((JSON.stringify(rooms[k].config[0]) == JSON.stringify(mConfig[0])) &&
									(JSON.stringify(rooms[k].config[1]) == JSON.stringify(mConfig[1])) &&
									(JSON.stringify(rooms[k].config[2]) == JSON.stringify(mConfig[2])) &&
									(JSON.stringify(rooms[k].config[3]) == JSON.stringify(mConfig[3]))) {
									map[i][j] = JSON.parse(JSON.stringify(rooms[k]));
									genFloor(i, j);
									map[i][j].wallStyle = walls;
									map[i][j].floorStyle = floorStyle;
									map[i][j].palette = lvlPal;
								}
							}
							
							
						}
					}
					if (map[i][j].config[1].length <=2) {
						connectables++;
						if (map[i][j-1] !=0 && 
							(map[i][j-1].config[0].length > 2 || map[i][j-1].config[1].length > 2 ||
							map[i][j-1].config[2].length > 2 || map[i][j-1].config[3].length > 2)) {
							
							//change rooms to connect openly
							var nConfig = [JSON.parse(JSON.stringify(map[i][j-1].config[0])),JSON.parse(JSON.stringify(map[i][j-1].config[1])),
											JSON.parse(JSON.stringify(map[i][j-1].config[2])),[1,2,3,4,5,6,7,8,9,10,11,12,13,14]];
							var mConfig = [JSON.parse(JSON.stringify(map[i][j].config[0])),[1,2,3,4,5,6,7,8,9,10,11,12,13,14],
											JSON.parse(JSON.stringify(map[i][j].config[2])),JSON.parse(JSON.stringify(map[i][j].config[3]))];
							
							for (k=0; k<rooms.length; k++) {
								if ((JSON.stringify(rooms[k].config[0]) == JSON.stringify(nConfig[0])) &&
									(JSON.stringify(rooms[k].config[1]) == JSON.stringify(nConfig[1])) &&
									(JSON.stringify(rooms[k].config[2]) == JSON.stringify(nConfig[2])) &&
									(JSON.stringify(rooms[k].config[3]) == JSON.stringify(nConfig[3]))) {
									map[i][j-1] = JSON.parse(JSON.stringify(rooms[k]));
									genFloor(i, j-1);
									map[i][j-1].wallStyle = walls;
									map[i][j-1].floorStyle = floorStyle;
									map[i][j-1].palette = lvlPal;
								} 
								if ((JSON.stringify(rooms[k].config[0]) == JSON.stringify(mConfig[0])) &&
									(JSON.stringify(rooms[k].config[1]) == JSON.stringify(mConfig[1])) &&
									(JSON.stringify(rooms[k].config[2]) == JSON.stringify(mConfig[2])) &&
									(JSON.stringify(rooms[k].config[3]) == JSON.stringify(mConfig[3]))) {
									map[i][j] = JSON.parse(JSON.stringify(rooms[k]));
									genFloor(i, j);
									map[i][j].wallStyle = walls;
									map[i][j].floorStyle = floorStyle;
									map[i][j].palette = lvlPal;
								}
							}
						}
					}
				}
			} 
		}
	}
	
	var rList = [];	//list of rooms to put things in
	for (i=0; i<map.length; i++) {
		for (j=0; j<map[i].length; j++) {
			if (map[i][j]!=0 && !(i == mapLoc.y && j == mapLoc.x) && map[i][j].obs == -1) {
				rList.push({x: j, y: i});
			}
		}
	}
	
	//put goal in map
	map[mapLoc.y][mapLoc.x].contents.push(Object.assign({}, ent_goal));
	map[mapLoc.y][mapLoc.x].obs = buildConfig('config_goal');
	//map[mapLoc.y][mapLoc.x].palette = 0;
	map[mapLoc.y][mapLoc.x].contents[0].diff = Math.ceil((rList.length-1)/2);
	goalTile.x = parseInt(mapLoc.x);
	goalTile.y = parseInt(mapLoc.y);
	
	numKeys = Math.ceil((rList.length-1)/2)-1;
	rList.splice(rand, 1);
	
	//put in keys
	remKeys = numKeys;
	for (i=0; i<numKeys; i++) {
		rand = Math.floor(sRandom()*rList.length);
		map[rList[rand].y][rList[rand].x].contents.push($.extend(true, {}, ent_key));
		rList.splice(rand,1);
		
	}
	
	//ensure at least one power up in the level
	rand = Math.floor(sRandom()*rList.length);
	map[rList[rand].y][rList[rand].x].contents.push($.extend(true, {}, ent_aug));
	map[rList[rand].y][rList[rand].x].obs = buildConfig('config_item');
	map[rList[rand].y][rList[rand].x].palette = 0;
	map[rList[rand].y][rList[rand].x].contents[map[rList[rand].y][rList[rand].x].contents.length-1].aug = Math.floor(sRandom()*augments.length);
	rList.splice(rand,1);
	
	//put powerups in rooms
	/*for (i=0; i<map.length; i++) {
		for (j=0; j<map[i].length; j++) {
			if (map[i][j] != 0 && !(i == mapLoc.y && j == mapLoc.x)) {
				if (map[i][j].contents.length < 1) {
					rand = Math.floor(sRandom()*8);
					if (rand == 0) {
						rand = Math.floor(sRandom()*augments.length);
						map[i][j].contents.push(Object.assign(true, {}, ent_aug));
						map[i][j].obs = buildConfig('config_item');
						map[i][j].palette = 0;
						map[i][j].contents[map[i][j].contents.length-1].aug = rand;
					}
				} 
			}
		}
	}*/
	
	//put chests
	for (i=0; i<rList.length; i++) {
		rand = Math.floor(sRandom()*5);
		if (rand == 0) {
			var keyChest = false;
			var hasAug = false;
			for (k=0; k<map[rList[rand].y][rList[rand].x].contents.length; k++) {
				if (map[rList[rand].y][rList[rand].x].contents[k].type == 'key') {
					keyChest = true;
					map[rList[rand].y][rList[rand].x].contents.splice(k,1);
				}
				if (map[rList[rand].y][rList[rand].x].contents[k].type == 'aug') {
					hasAug = true;
				}
			}
			if (!hasAug) {
				map[rList[rand].y][rList[rand].x].contents.push($.extend(true, {}, ent_chest));
				if (keyChest == true) {
					map[rList[rand].y][rList[rand].x].contents[map[rList[rand].y][rList[rand].x].contents.length-1].contents = 'key';
				}
			}
		}
	}
	
	//put mobs in rooms
	for (i=0; i<map.length; i++) {
		for (j=0; j<map[i].length; j++) {
			if (map[i][j] != 0 && !(i == mapLoc.y && j == mapLoc.x)) {
				rand = Math.floor(sRandom()*2);
				if (rand == 0) {
					rand = Math.floor(sRandom()*6)+1;
					for (k=0; k<rand; k++) {
						map[i][j].contents.push($.extend(true, {}, mobs[Math.floor(sRandom()*mobs.length)]));
						map[i][j].contents[map[i][j].contents.length-1].ai = ais[Math.floor(sRandom()*ais.length)].behavoir;
						map[i][j].contents[map[i][j].contents.length-1].loc.y = Math.floor(sRandom()*12)+2;
						map[i][j].contents[map[i][j].contents.length-1].loc.x = Math.floor(sRandom()*16)+2;
						remMobs++;
					}
				}
			}
		}
	}
	
	//assign obstacle configs
	for (i=0; i<map.length; i++) {
		for (j=0; j<map[i].length; j++) {
			if (map[i][j] != 0 && map[i][j].obs == -1 && !(i == mapLoc.y && j == mapLoc.x)) {
				rand = Math.floor(sRandom()*configs.length);
				if (configs[rand].name != 'config_goal' && configs[rand].name != 'config_item' /*&& configs[rand].name !='config_6'*/) {
					map[i][j].obs = buildConfig('config_'+rand);
					console.log('config_'+rand);
				}
				
			}
		}
	}

	minimap.update();
	player.x = 9*tileSize;
	player.y = 8*tileSize;
	bannerCounter = 0;
	loadRoom(map[mapLoc.y][mapLoc.x].map);
	lvlComplete = false;
}

//builds the static hub level
function buildHub() {
	
	var hubMap = [  [0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0]];
	hubMap[1][1] = JSON.parse(JSON.stringify(open_56));
	hubMap[1][1].palette = 9;
	hubMap[1][2] = JSON.parse(JSON.stringify(base_2));
	hubMap[1][2].palette = 5;
	hubMap[1][3] = JSON.parse(JSON.stringify(base_7));
	hubMap[1][3].palette = 5;
	hubMap[1][4] = JSON.parse(JSON.stringify(base_5));
	hubMap[1][4].palette = 5;
	hubMap[1][5] = JSON.parse(JSON.stringify(base_12));
	hubMap[1][5].palette = 8;
	hubMap[1][6] = JSON.parse(JSON.stringify(base_5));
	hubMap[1][6].palette = 8;
	hubMap[1][7] = JSON.parse(JSON.stringify(base_5));
	hubMap[1][7].palette = 8;
	hubMap[1][8] = JSON.parse(JSON.stringify(base_8));
	hubMap[1][8].palette = 8;
	hubMap[2][1] = JSON.parse(JSON.stringify(open_62));
	hubMap[2][1].palette = 9;
	hubMap[2][2] = JSON.parse(JSON.stringify(base_14));
	hubMap[2][2].palette = 5;
	hubMap[2][3] = JSON.parse(JSON.stringify(base_0));
	hubMap[2][3].palette = 5;
	hubMap[2][4] = JSON.parse(JSON.stringify(base_8));
	hubMap[2][4].palette = 5;
	hubMap[2][8] = JSON.parse(JSON.stringify(base_1));
	hubMap[2][8].palette = 8;
	hubMap[3][1] = JSON.parse(JSON.stringify(base_6));
	hubMap[3][1].palette = 9;
	hubMap[3][2] = JSON.parse(JSON.stringify(base_14));
	hubMap[3][2].palette = 5;
	hubMap[3][3] = JSON.parse(JSON.stringify(base_9));
	hubMap[3][3].palette = 5;
	hubMap[3][4] = JSON.parse(JSON.stringify(base_10));
	hubMap[3][4].palette = 5;
	hubMap[3][5] = JSON.parse(JSON.stringify(open_51));
	hubMap[3][5].palette = 1;
	hubMap[4][1] = JSON.parse(JSON.stringify(base_6));
	hubMap[4][1].palette = 9;
	hubMap[4][2] = JSON.parse(JSON.stringify(base_6));
	hubMap[4][2].palette = 5;
	hubMap[4][3] = JSON.parse(JSON.stringify(open_53));
	hubMap[4][3].palette = 10;
	hubMap[4][4] = JSON.parse(JSON.stringify(open_18));
	hubMap[4][4].palette = 1;
	hubMap[4][5] = JSON.parse(JSON.stringify(open_12));
	hubMap[4][5].palette = 1;
	hubMap[5][1] = JSON.parse(JSON.stringify(open_17));
	hubMap[5][1].palette = 4;
	hubMap[5][2] = JSON.parse(JSON.stringify(open_22));
	hubMap[5][2].palette = 4;
	hubMap[5][3] = JSON.parse(JSON.stringify(open_16));
	hubMap[5][3].palette = 10;
	hubMap[5][4] = JSON.parse(JSON.stringify(open_16));
	hubMap[5][4].palette = 1;
	hubMap[5][5] = JSON.parse(JSON.stringify(base_2));
	hubMap[5][5].palette = 1;
	hubMap[5][6] = JSON.parse(JSON.stringify(open_16));
	hubMap[5][6].palette = 1;
	hubMap[6][1] = JSON.parse(JSON.stringify(open_27));
	hubMap[6][1].palette = 4;
	hubMap[6][2] = JSON.parse(JSON.stringify(open_30));
	hubMap[6][2].palette = 4;
	hubMap[6][3] = JSON.parse(JSON.stringify(open_16));
	hubMap[6][3].palette = 10;
	hubMap[6][4] = JSON.parse(JSON.stringify(open_27));
	hubMap[6][4].palette = 1;
	hubMap[6][5] = JSON.parse(JSON.stringify(open_12));
	hubMap[6][5].palette = 1;
	hubMap[6][6] = JSON.parse(JSON.stringify(open_30));
	hubMap[6][6].palette = 1;
	hubMap[7][1] = JSON.parse(JSON.stringify(base_1));
	hubMap[7][1].palette = 4;
	hubMap[7][2] = JSON.parse(JSON.stringify(base_14));
	hubMap[7][2].palette = 10;
	hubMap[7][3] = JSON.parse(JSON.stringify(open_60));
	hubMap[7][3].palette = 10;
	hubMap[7][4] = JSON.parse(JSON.stringify(base_10));
	hubMap[7][4].palette = 1;
	hubMap[7][5] = JSON.parse(JSON.stringify(base_12));
	hubMap[7][5].palette = 1;
	hubMap[7][6] = JSON.parse(JSON.stringify(base_9));
	hubMap[7][6].palette = 1;
	hubMap[8][1] = JSON.parse(JSON.stringify(base_4));
	hubMap[8][1].palette = 10;
	hubMap[8][2] = JSON.parse(JSON.stringify(base_11));
	hubMap[8][2].palette = 10;
	hubMap[8][3] = JSON.parse(JSON.stringify(base_11));
	hubMap[8][3].palette = 10;
	hubMap[8][4] = JSON.parse(JSON.stringify(base_3));
	hubMap[8][4].palette = 10;
	hubMap[8][5] = JSON.parse(JSON.stringify(base_1));
	hubMap[8][5].palette = 1;
	
	for (var i=0; i<hubMap.length; i++) {
		for (var j=0; j<hubMap[i].length; j++) {
			if (hubMap[i][j] != 0) {
				hubMap[i][j].obs = [[],[],[]];
			}
		}
	}
	
	for (var i=0; i<temple_data.length; i++) {
		for (var l=0; l<8; l++) {   //map Y
			for (var m=0; m<16; m++) {  //room Y
				for (var j=0; j<8; j++) {   //map X
					for (var k=0; k<20; k++) {  //room X
						if (hubMap[l+1][j+1] != 0) {
							//hubMap[l][j].obs[i].push(temple_data[i][(l*2560)+(m*160)+(j*20)+k]);
							hubMap[l+1][j+1].map[i][m][k] = temple_data[i][(l*2560)+(m*160)+(j*20)+k];
						}
					}
				}
			}                
		}
	}
	
	for (var i=0; i< hubMap.length; i++) {
		for (var j=0; j<hubMap[i].length; j++) {
			hubMap[i][j].obs = buildConfig('hub_'+i+''+j);
		}
	}
	
	
	//console.log(hubMap);
	mapLoc.y = 8;
	mapLoc.x = 5;
	player.x = 9*tileSize;
	player.y = 8*tileSize;
	map = hubMap;
	minimap.update();
	loadRoom(map[mapLoc.y][mapLoc.x].map);
	lvlComplete = false;
	
}

//loads a level
function loadRoom(level) {
	var rand;
	moves = 0;
	
	map[mapLoc.y][mapLoc.x].discovered = true;
	
	//apply room pallette
	currPal = pals[map[mapLoc.y][mapLoc.x].palette];
	
	//apply floor style
	for (var i=0; i<map[mapLoc.y][mapLoc.x].map[0].length; i++) {
		for (var j=0; j<map[mapLoc.y][mapLoc.x].map[0][i].length; j++) {
			if (map[mapLoc.y][mapLoc.x].map[0][i][j] != 0) {
				map[mapLoc.y][mapLoc.x].map[0][i][j] = map[mapLoc.y][mapLoc.x].map[0][i][j]-map[mapLoc.y][mapLoc.x].floorStyle;
			}
		}
	}
	
	//apply wall style
	for (var i=0; i<map[mapLoc.y][mapLoc.x].map[1].length; i++) {
		for (var j=0; j<map[mapLoc.y][mapLoc.x].map[1][i].length; j++) {
			if (map[mapLoc.y][mapLoc.x].map[1][i][j] != 0) {
				map[mapLoc.y][mapLoc.x].map[1][i][j] = map[mapLoc.y][mapLoc.x].map[1][i][j]-map[mapLoc.y][mapLoc.x].wallStyle;
			}
		}
	}

	//insert the obstacle config
	if (map[mapLoc.y][mapLoc.x].obs) {
		if (map[mapLoc.y][mapLoc.x].obs != -1) {
			for (var k=0; k<3; k++) {
				for (var i=0; i<level[k].length; i++) {
					for (var j=0; j<level[k][i].length; j++) {
						if (map[mapLoc.y][mapLoc.x].obs[k][i][j] !=0) {
							if (k==0) {
								map[mapLoc.y][mapLoc.x].map[k][i][j] = map[mapLoc.y][mapLoc.x].obs[k][i][j];
							} else if (map[mapLoc.y][mapLoc.x].map[k][i][j] == 0) {
								map[mapLoc.y][mapLoc.x].map[k][i][j] = map[mapLoc.y][mapLoc.x].obs[k][i][j];
							}
						}
					}
				}
			}
		}
	}
	//build list of placeable spots
	var placeList = [];
	for (var i=0; i<map[mapLoc.y][mapLoc.x].map[1].length; i++) {
		for (var j=0; j<map[mapLoc.y][mapLoc.x].map[1][i].length; j++) {
			if (i>1 && i<map[mapLoc.y][mapLoc.x].map[1].length-1 && j>1 && j<map[mapLoc.y][mapLoc.x].map[1][i].length-1 && map[mapLoc.y][mapLoc.x].map[1][i][j] == 0) {
				placeList.push({x:j, y:i});
			}
		}
	}
	
	//move contents if needed
	for (var i=0; i<map[mapLoc.y][mapLoc.x].contents.length; i++) {
		if (map[mapLoc.y][mapLoc.x].contents[i].type == 'mob' && 
			map[mapLoc.y][mapLoc.x].contents[i].loc.x == -1 && map[mapLoc.y][mapLoc.x].contents[i].loc.y == -1 ||
			map[mapLoc.y][mapLoc.x].contents[i].loc.x < 16 && map[mapLoc.y][mapLoc.x].contents[i].loc.y < 16 ||
			map[mapLoc.y][mapLoc.x].contents[i].loc.x > screenWidth-16 && map[mapLoc.y][mapLoc.x].contents[i].loc.y > screenHeight-32) {
			
			rand = Math.floor(Math.random()*placeList.length);
			map[mapLoc.y][mapLoc.x].contents[i].loc.x = placeList[rand].x*tileSize;
			map[mapLoc.y][mapLoc.x].contents[i].loc.y = placeList[rand].y*tileSize;
		}
		if ((map[mapLoc.y][mapLoc.x].contents[i].type == 'key')&&
			level[1][Math.floor(map[mapLoc.y][mapLoc.x].contents[i].loc.y/tileSize)][Math.floor(map[mapLoc.y][mapLoc.x].contents[i].loc.x/tileSize)] != 0) {
			
			rand = Math.floor(Math.random()*placeList.length);
			map[mapLoc.y][mapLoc.x].contents[i].loc.x = placeList[rand].x*tileSize;
			map[mapLoc.y][mapLoc.x].contents[i].loc.y = placeList[rand].y*tileSize;
			
		}
		if (map[mapLoc.y][mapLoc.x].contents[i].type == 'chest') {
			if (level[1][Math.floor(map[mapLoc.y][mapLoc.x].contents[i].loc.y/tileSize)][Math.floor(map[mapLoc.y][mapLoc.x].contents[i].loc.x/tileSize)] == 0) {
				map[mapLoc.y][mapLoc.x].map[1][map[mapLoc.y][mapLoc.x].contents[i].loc.y/tileSize][map[mapLoc.y][mapLoc.x].contents[i].loc.x/tileSize] = 576;
			} 
			if (level[1][Math.floor(map[mapLoc.y][mapLoc.x].contents[i].loc.y/tileSize)][Math.floor(map[mapLoc.y][mapLoc.x].contents[i].loc.x/tileSize)] != 576) {
				rand = Math.floor(Math.random()*placeList.length);
				map[mapLoc.y][mapLoc.x].contents[i].loc.x = placeList[rand].x*tileSize;
				map[mapLoc.y][mapLoc.x].contents[i].loc.y = placeList[rand].y*tileSize;
			}
		}
	}
	if (currLvl!=null) {
		prevLvl = JSON.parse(JSON.stringify(currLvl));
	}
	currLvl = JSON.parse(JSON.stringify(level));
	
	//undo wall styling
	for (var i=0; i<map[mapLoc.y][mapLoc.x].map[1].length; i++) {
		for (var j=0; j<map[mapLoc.y][mapLoc.x].map[1][i].length; j++) {
			if (map[mapLoc.y][mapLoc.x].map[1][i][j] != 0) {
				map[mapLoc.y][mapLoc.x].map[1][i][j] = map[mapLoc.y][mapLoc.x].map[1][i][j]+map[mapLoc.y][mapLoc.x].wallStyle;
			}
		}
	}
	
	//undo wall styling
	for (var i=0; i<map[mapLoc.y][mapLoc.x].map[0].length; i++) {
		for (var j=0; j<map[mapLoc.y][mapLoc.x].map[0][i].length; j++) {
			if (map[mapLoc.y][mapLoc.x].map[0][i][j] != 0) {
				map[mapLoc.y][mapLoc.x].map[0][i][j] = map[mapLoc.y][mapLoc.x].map[0][i][j]+map[mapLoc.y][mapLoc.x].floorStyle;
			}
		}
	}
}

//draw a sprite
function drawSprite(sprite,x,y) {
	draws++;
	if (sprite == 286 && blink == true) {
		sprite = 318;
	}
	if (sprite == 287 && blink == true) {
		sprite = 319;
	}
	if (sprite == 288 && blink == true) {
		sprite = 320;
	}
	if (sprite == 352 && blink == false) {
		sprite = 384;
	}
	if (sprite == 438 && blink == false) {
		sprite = 470;
	}
	if (sprite == 283 && blink == true) {
		sprite = 315;
	}
	if (sprite == 284 && blink == true) {
		sprite = 316;
	}
	if (sprite == 285 && blink == true) {
		sprite = 317;
	}
	if (sprite == 468 && blink == false && 
		(player.x+4 > x && player.x+4 <= x+8) && 
		(player.y+8 > y && player.y+8 <= y+8)){
		sprite = 434;
	}
	if (sprite == 468 && blink == true && 
		(player.x+4 > x && player.x+4 <= x+8) && 
		(player.y+8 > y && player.y+8 <= y+8)){
		sprite = 466;
	}
	
	sX = Math.floor((sprite-1)/(sheetWidth/8))*8;
	sY = ((sprite-1)%(sheetWidth/8))*8;
	
	ctx.drawImage(spriteSheet, sY,sX,8,8,x,y,8,8);
}

//game window management
function manageScreen() {
	if (window.innerWidth < window.innerHeight) {
		canvasWidth = window.innerWidth;
		canvasHeight = Math.floor((144/160)*(window.innerWidth));	
	} else {
		canvasHeight = window.innerHeight;
		canvasWidth = Math.floor((160/144)*(window.innerHeight));
	}
	rendCanvas.style.top = JSON.stringify((window.innerHeight/2)-(canvasHeight/2))+'px';
	rendCanvas.style.left = JSON.stringify((window.innerWidth/2)-(canvasWidth/2))+'px';
	rendCanvas.height = JSON.stringify(canvasHeight);
	rendCanvas.width = JSON.stringify(canvasWidth);
	rendCanvas.style.position = 'absolute';
	rctx.imageSmoothingEnabled = false;
	scaleFactor = (canvasWidth/160);
}

//manage status bar and menu
function menuSystem() {
	var sX,sY;
	var augList = [];
	rctx.font="6px monospace";
	if (bannerCounter > -1) {
		bannerCounter++;
		if (bannerCounter > 120) {
			bannerCounter = -1;
		}
	}
	
	if (bannerCounter < 120 && bannerCounter > -1) {
		rctx.fillStyle = 'black';
		rctx.fillRect(0, 0, 64, 8);
		
		rctx.fillStyle = 'white';
		rctx.fillText('Seed: '+base_seed, 2, 6);
	}
	
	//pause screen
	if (paused == true) {
		if (menu == true) {
			if (menuHeight > 0) {
				menuHeight = menuHeight -20;
			}
		} else {
			if (menu < screenHeight-16) {
				menuHeight = menuHeight+20;
			}
			if (menuHeight >= screenHeight-16) {
				paused = false;
			}
		}
		rctx.fillStyle = 'black';
		rctx.fillRect(Math.floor(screenWidth/2), menuHeight,Math.floor(screenWidth/2), Math.floor(screenHeight)-16-menuHeight);
		
		//stats
		//lvl dpt
		//dmg def
		//spd crs
		//hp  sp
		rctx.fillStyle = 'white';
		rctx.fillText('seed:  '+base_seed,Math.floor(screenWidth/2)+5,menuHeight+20);
		
		rctx.fillRect(Math.floor(screenWidth/2)+3,menuHeight+23, 75, 26);
		rctx.fillStyle = 'black';
		rctx.fillRect(Math.floor(screenWidth/2)+4,menuHeight+24, 73, 24);
		rctx.fillStyle = 'white';
		
		rctx.fillText('lvl:    '+player.lvl,Math.floor(screenWidth/2)+5,menuHeight+30);
		rctx.fillText('dmg: '+(player.base_damage).toFixed(2)+'+'+player.weapons[0].damage,Math.floor(screenWidth/2)+5,menuHeight+35);
		rctx.fillText('def: '+(player.base_defense).toFixed(2),Math.floor(screenWidth/2)+45,menuHeight+35);
		rctx.fillText('spd: '+(player.speed).toFixed(2),Math.floor(screenWidth/2)+5,menuHeight+40);
		rctx.fillText('crs: '+(player.curse).toFixed(2),Math.floor(screenWidth/2)+45,menuHeight+40);
		rctx.fillText('hpr: '+(100*player.healthGen).toFixed(2),Math.floor(screenWidth/2)+5,menuHeight+45);
		rctx.fillText('spr: '+(10*player.spiritGen).toFixed(2),Math.floor(screenWidth/2)+45,menuHeight+45);
		
		rctx.fillText('augments:',Math.floor(screenWidth/2)+5,menuHeight+55);
		
		for (var i=0; i<player.augments.length; i++) {
			rctx.fillText(player.augments[i].name,Math.floor(screenWidth/2)+5,menuHeight+60+(i*5));
			rctx.fillText(player.augments[i].effectText,Math.floor(screenWidth/2)+40,menuHeight+60+(i*5));
		}
	
		//minimap
		for (var i=0; i<minimap.map.length; i++) {
			for(var j=0; j<minimap.map[i].length; j++) {
				
				if (map[i][j].discovered == true) {
					sX = Math.floor((minimap.map[i][j]-1)/(sheetWidth/8))*8;
					sY = ((minimap.map[i][j]-1)%(sheetWidth/8))*8;
					rctx.drawImage(spriteSheet, sY,sX,8,8,(8*j)+(4*8)-(mapLoc.x*8),menuHeight+(8*i)+(8*8)-(mapLoc.y*8),8,8);
					//drawSprite(minimap.map[i][j],(8*j)+(4*8)-(mapLoc.x*8),menuHeight+(8*i)+(8*8)-(mapLoc.y*8));
					if (i == goalTile.y && j == goalTile.x) {
						sX = Math.floor((757-1)/(sheetWidth/8))*8;
						sY = ((757-1)%(sheetWidth/8))*8;
						rctx.drawImage(spriteSheet, sY,sX,8,8,(8*j)+(4*8)-(mapLoc.x*8),menuHeight+(8*i)+(8*8)-(mapLoc.y*8),8,8);
						//drawSprite(757, (8*j)+(4*8)-(mapLoc.x*8),menuHeight+(8*i)+(8*8)-(mapLoc.y*8));
					}
					if (i == mapLoc.y && j == mapLoc.x) {
						sX = Math.floor((758-1)/(sheetWidth/8))*8;
						sY = ((758-1)%(sheetWidth/8))*8;
						rctx.drawImage(spriteSheet, sY,sX,8,8,4*8,menuHeight+(8*8),8,8);
						//drawSprite(758, 4*8,menuHeight+(8*8));
					}
				}
			}
		}
	}
	
	//status bar
	rctx.fillStyle = 'black';
	rctx.fillRect(0, screenHeight-16, screenWidth, 16);
	
	rctx.fillStyle = 'white';
	rctx.fillText('HP[',0,screenHeight-10);
	for (var i=0; i<player.maxHealth; i++) {
		if (i<player.health) {
			rctx.fillText('|',(i+5)*2,screenHeight-10);
		} else {
			rctx.fillText(' ',(i+5)*2,screenHeight-10);
		}
	}
	rctx.fillText(']',(player.maxHealth+5.5)*2,screenHeight-10);
	
	rctx.fillText('SP[',0,screenHeight-2);
	for (var i=0; i<player.maxSpirit; i++) {
		if (i<player.spirit) {
			rctx.fillText('|',(i+5)*2,screenHeight-2);
		} else {
			rctx.fillText(' ',(i+5)*2,screenHeight-2);
		}
	}
	rctx.fillText(']',(player.maxSpirit+5.5)*2,screenHeight-2);
	
	if (remKeys == 0) {
		sX = Math.floor((581-1)/(sheetWidth/8))*8;
		sY = ((581-1)%(sheetWidth/8))*8;
		rctx.drawImage(spriteSheet, sY,sX,8,8,screenWidth-80,screenHeight-8,8,8);
		//drawSprite(549, screenWidth-80,screenHeight-8);
	} else {
		sX = Math.floor((582-1)/(sheetWidth/8))*8;
		sY = ((582-1)%(sheetWidth/8))*8;
		rctx.drawImage(spriteSheet, sY,sX,8,8,screenWidth-80,screenHeight-8,8,8);
		//drawSprite(550, screenWidth-80,screenHeight-8);
	}
	rctx.fillText(':'+player.keys.length,screenWidth-72,screenHeight-2);
	
	sX = Math.floor((583-1)/(sheetWidth/8))*8;
	sY = ((583-1)%(sheetWidth/8))*8;
	rctx.drawImage(spriteSheet, sY,sX,8,8,screenWidth-80,screenHeight-15,8,8);
	//drawSprite(551, screenWidth-80,screenHeight-15);
	rctx.fillText(':'+remMobs,screenWidth-72,screenHeight-10);
	
	rctx.fillText('XP[',screenWidth-50,screenHeight-2);
	for (var i=0; i<10; i++) {
		if (i<player.exp) {
			rctx.fillText('|',screenWidth-50+(i+5)*2,screenHeight-2);
		} else {
			rctx.fillText(' ',screenWidth-50+(i+5)*2,screenHeight-2);
		}
	}
	rctx.fillText(']: '+player.lvl,screenWidth-50+(10+5.5)*2,screenHeight-2);
	
	rctx.fillText('CR[',screenWidth-50,screenHeight-10);
	for (var i=0; i<10; i++) {
		if (i<player.curse) {
			rctx.fillText('|',screenWidth-50+(i+5)*2,screenHeight-10);
		} else {
			rctx.fillText(' ',screenWidth-50+(i+5)*2,screenHeight-10);
		}
	}
	rctx.fillText(']',screenWidth-50+(10+5.5)*2,screenHeight-10);

}

//check for room transitions
function roomTransition() {
	
	if (Math.floor(player.y-player.speed) <= 1 && mapLoc.y-1 > 0) {
		rTransition = 0;
		roomDrawY = 0-screenHeight+16;
		mapLoc.y--;
		loadRoom(map[mapLoc.y][mapLoc.x].map);
		minimap.update();
	}
	if (Math.ceil(player.y+8+player.speed) >= screenHeight-16 && mapLoc.y+1 < map.length-1) {
		rTransition = 2;
		roomDrawY = screenHeight-16;
		mapLoc.y++;
		loadRoom(map[mapLoc.y][mapLoc.x].map);
		minimap.update();
	}
	if (Math.floor(player.x-player.speed) <= 1 && mapLoc.x-1 > 0) {
		rTransition = 1;
		roomDrawX = 0-screenWidth;
		mapLoc.x--;
		loadRoom(map[mapLoc.y][mapLoc.x].map);
		minimap.update();
	}
	if (Math.ceil(player.x+8+player.speed) >= screenWidth && mapLoc.x+1 < map[mapLoc.y].length-1) {
		rTransition = 3;
		roomDrawX = screenWidth;
		mapLoc.x++;
		loadRoom(map[mapLoc.y][mapLoc.x].map);
		minimap.update();
	}
	
	if (rTransition != -1) {
		if (rTransition == 0) {
			player.y =  player.y +10;
			roomDrawY = roomDrawY+10;
			if (player.y >= screenHeight-28) {
				player.y = screenHeight-28;
			}
			if (roomDrawY >=0) {
				roomDrawY = 0;
			}
			if (roomDrawY == 0 && player.y == screenHeight-28){
				rTransition = -1;
			}
		}
		if (rTransition == 2) {
			player.y =  player.y -10;
			roomDrawY = roomDrawY-10;
			if (player.y <= 9+player.speed) {
				player.y = 9+player.speed;
			}
			if (roomDrawY <=0) {
				roomDrawY = 0;
			}
			if (roomDrawY == 0 && player.y == 9+player.speed){
				rTransition = -1;
			}
		}
		if (rTransition == 1) {
			player.x =  player.x +10;
			roomDrawX = roomDrawX+10;
			if (player.x >= screenWidth-9-player.speed) {
				player.x = screenWidth-9-player.speed;
			}
			if (roomDrawX >= 0) {
				roomDrawX = 0;
			}
			if (roomDrawX == 0 && player.x == screenWidth-9-player.speed) {
				rTransition = -1;
			}
		}
		if (rTransition == 3) {
			player.x =  player.x -10;
			roomDrawX = roomDrawX-10;
			if (player.x <= 9+player.speed) {
				player.x = 9+player.speed;
			}
			if (roomDrawX <= 0) {
				roomDrawX = 0;
			}
			if (roomDrawX == 0 && player.x == 9+player.speed) {
				rTransition = -1;
			}
		}
		if (rTransition == 4) {
			//player.y =  player.y +10;
			roomDrawY = roomDrawY+10;
			if (player.y >= screenHeight-28) {
				player.y = screenHeight-28;
			}
			if (roomDrawY >=0) {
				roomDrawY = 0;
			}
			if (roomDrawY == 0){
				rTransition = -1;
			}
		}
	}
}


function renderLvl() {
	//render background layer
	for (var i=0; i<currLvl[0].length; i++) {
		for (var j=0; j<currLvl[0][i].length; j++) {
			//background layer
			if (currLvl[0][i][j] !=0) {
				drawSprite(currLvl[0][i][j],roomDrawX+Math.floor((j*8)),roomDrawY+Math.floor((i*8)));
			}
			
			
			if (rTransition != -1) {
				//prev background
				if (prevLvl[0][i][j] !=0) {
					if (rTransition == 0) {
						drawSprite(prevLvl[0][i][j],roomDrawX+Math.floor((j*8)),roomDrawY+screenHeight-16+Math.floor((i*8)));
					}
					if (rTransition == 1) {
						drawSprite(prevLvl[0][i][j],roomDrawX+screenWidth+Math.floor((j*8)),roomDrawY+Math.floor((i*8)));
					}
					if (rTransition == 2) {
						drawSprite(prevLvl[0][i][j],roomDrawX+Math.floor((j*8)),roomDrawY-screenHeight+16+Math.floor((i*8)));
					}
					if (rTransition == 3) {
						drawSprite(prevLvl[0][i][j],roomDrawX-screenWidth+Math.floor((j*8)),roomDrawY+Math.floor((i*8)));
					}
				}
				
			}    
		}
	}
	
	//render collision layer
	for (var i=0; i<currLvl[1].length; i++) {
		for (var j=0; j<currLvl[1][i].length; j++) {
			//collision layer
			if (currLvl[1][i][j] !=0) {
				drawSprite(currLvl[1][i][j],roomDrawX+Math.floor((j*8)),roomDrawY+Math.floor((i*8)));
			}
			//prev collision
			if (prevLvl[1][i][j] !=0) {
				if (rTransition == 0) {
					drawSprite(prevLvl[1][i][j],roomDrawX+Math.floor((j*8)),roomDrawY+screenHeight-16+Math.floor((i*8)));
				}
				if (rTransition == 1) {
					drawSprite(prevLvl[1][i][j],roomDrawX+screenWidth+Math.floor((j*8)),roomDrawY+Math.floor((i*8)));
				}
				if (rTransition == 2) {
					drawSprite(prevLvl[1][i][j],roomDrawX+Math.floor((j*8)),roomDrawY-screenHeight+16+Math.floor((i*8)));
				}
				if (rTransition == 3) {
					drawSprite(prevLvl[1][i][j],roomDrawX-screenWidth+Math.floor((j*8)),roomDrawY+Math.floor((i*8)));
				}
			}
		}
	}
	
	//update the player and room contents
	if (paused == false && rTransition == -1) {	
		//update contents of room
		for (var i=0; i<map[mapLoc.y][mapLoc.x].contents.length; i++) {
			map[mapLoc.y][mapLoc.x].contents[i].update();
		}
		
		player.update();    
	}
	
	//draw the contents of the room
	if (rTransition == -1) {
		for (var i=0; i<map[mapLoc.y][mapLoc.x].contents.length; i++) {
			map[mapLoc.y][mapLoc.x].contents[i].draw();
		}
	}
				
	//ctx.fillStyle = 'red';
	//ctx.fillRect(player.x,player.y,8,8);
	player.draw();
	
	//curr room overlap
	for (var i=0; i<currLvl[2].length; i++) {
		for (var j=0; j<currLvl[2][i].length; j++) {
			if (currLvl[2][i][j] !=0) {
				drawSprite(currLvl[2][i][j],roomDrawX+Math.floor((j*8)),roomDrawY+Math.floor((i*8)));
			}
			if (prevLvl[2][i][j] !=0 && rTransition != -1) {
				if (rTransition == 0) {
					drawSprite(prevLvl[2][i][j],roomDrawX+Math.floor((j*8)),roomDrawY+screenHeight-16+Math.floor((i*8)));
				}
				if (rTransition == 1) {
					drawSprite(prevLvl[2][i][j],roomDrawX+screenWidth+Math.floor((j*8)),roomDrawY+Math.floor((i*8)));
				}
				if (rTransition == 2) {
					drawSprite(prevLvl[2][i][j],roomDrawX+Math.floor((j*8)),roomDrawY-screenHeight+16+Math.floor((i*8)));
				}
				if (rTransition == 3) {
					drawSprite(prevLvl[2][i][j],roomDrawX-screenWidth+Math.floor((j*8)),roomDrawY+Math.floor((i*8)));
				}
			}
		}
	}
}

//main loop
function mainLoop() {
	frames++;
	
	if (paused == false) {
		if (frames%15 == 0) {
			if (blink == true) {
				blink = false;
			} else {
				blink = true;
			}
		}
	}
	
	if (player.health <=0 || player.curse >=10) {
		lvlComplete = true;
		player.health = 0;
		player.spirit = 0;
		player.curse = 0;
		player.keys = [];
		player.x = 0;
		player.y = 0;
		player.exp = 0;
		player.lvl = 0;
	}
	
	if (lvlComplete == false) {
		
		roomTransition();
		
		ctx.fillStyle = '#F1F1F1';
		//ctx.fillStyle = 'black';
		ctx.fillRect(0,0,screenWidth,screenHeight-16);
		
		renderLvl();
			
	} else {
		//render game over screen
		//bgm.stop();
		if (player.health <=0) {
			rctx.font="7px monospace";
			rctx.fillStyle = 'black';
			rctx.fillRect(0,0,screenWidth,screenHeight-16);
			rctx.fillStyle = 'white';
			rctx.fillText('GAME OVER', (screenWidth/2)-20, ((screenHeight-16)/2));
			rctx.fillText('Press Space to Retry', (screenWidth/2)-40, ((screenHeight-16)/2)+8);
			
			if (pressedKeys.indexOf('_') > -1) {
				init(0, true);
			}
		} else {
		
		}
			
	}
	
	//apply pallette swap
	img = ctx.getImageData(0,0,160,144-16);
	if (palettesEnabled == true) {
		
		for(var i = 0, l = img.data.length; i < l; i += 4) {
			if (img.data[i+3] > 0) {
				/*if (img.data[i] == pals[0][0][0] && img.data[i+1] == pals[0][0][1] && img.data[i+2] == pals[0][0][2]) {
				
					img.data[i] = currPal[0][0];
					img.data[i+1] = currPal[0][1];
					img.data[i+2] = currPal[0][2];
				}*/
				if (img.data[i] == pals[0][1][0] && img.data[i+1] == pals[0][1][1] && img.data[i+2] == pals[0][1][2]) {
				
					img.data[i] = currPal[1][0];
					img.data[i+1] = currPal[1][1];
					img.data[i+2] = currPal[1][2];
				}
				/*if (img.data[i] == pals[0][2][0] && img.data[i+1] == pals[0][2][1] && img.data[i+2] == pals[0][2][2]) {
				
					img.data[i] = currPal[2][0];
					img.data[i+1] = currPal[2][1];
					img.data[i+2] = currPal[2][2];
				}*/
				/*if (img.data[i] == pals[0][3][0] && img.data[i+1] == pals[0][3][1] && img.data[i+2] == pals[0][3][2]) {
				
					img.data[i] = currPal[3][0];
					img.data[i+1] = currPal[3][1];
					img.data[i+2] = currPal[3][2];
				}*/
			} 
		} 
		
	}
	ctx.putImageData(img, 0, 0);
	rendScreen = ctx.getImageData(0,0,screenWidth,screenHeight);
	rctx.putImageData(rendScreen,0,0);
	rctx.scale(scaleFactor,scaleFactor);
	rctx.drawImage(rendCanvas, 0,0);
	//update/render menu
	menuSystem();
	rctx.scale(1/scaleFactor,1/scaleFactor);
	
	drawsperframe = draws;
	draws = 0;
	
	window.requestAnimationFrame(mainLoop);
}

//Fisher-Yates shuffle (as is tradition)
function shuffle(array) {
	var m = array.length, t, i;

	// While there remain elements to shuffle…
	while (m) {

		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);

		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
}

//from Antti Sykäri on Stack overflow (with modification by me)
function sRandom() {
	var x = Math.sin(seed++) * 10000;
	x = x - Math.floor(x);
	x = Math.abs(x);
	return x; 
}
