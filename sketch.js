var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround,invisibleGround2, groundImage;
 
var turtle, rabbit;
var turtleImg, rabbitImg;
var rocks, rocksImg;
var berries, berriesImg;
var bush, bush1,bush2,bush4, bushImg;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var berriesGroup;

var score=0;

var gameOver, restart;



function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  turtleImg = loadImage("turtle.png");
  rabbitImg = loadImage("rabbit.png");    
  rocksImg = loadImage("rocks.png");
  berriesImg = loadImage("berries.png")
  bushImg = loadImage("bush.png");

  groundImage = loadImage("ground3.jpg");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 400);
  
  trex = createSprite(100,180,20,50); 
  trex.addAnimation("running", turtleImg);
  trex.addAnimation("collided", turtleImg);
  trex.scale = 0.1;

  
  ground = createSprite(200,180,600,1000);
  ground.addImage("ground",groundImage);
  ground.scale = 4;
 // ground.x = ground.width/2;
  ground.velocityX = -(6 + 3*score/100);

  rabbit = createSprite(300,180,20,50);
  rabbit.addImage(rabbitImg);
  rabbit.scale =0.15;
  
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(280,420,400,10);
  invisibleGround.scale = 0.5;
  invisibleGround.addImage(bushImg)
  invisibleGround.debug = false;
  invisibleGround.setCollider("rectangle",0,0,1400,400);

  invisibleGround2 = createSprite(280,-40,400,10);
  invisibleGround2.scale = 0.5;
  invisibleGround2.addImage(bushImg)
  invisibleGround2.debug = false;
  invisibleGround2.setCollider("rectangle",0,0,1400,400);

  invisibleGround3 = createSprite(0,200,10,400);
  invisibleGround3.debug = false;
  invisibleGround3.visible = false;
  invisibleGround3.setCollider("rectangle",0,0,10,400);

  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  berriesGroup = new Group();
  
 
}

function draw() {
  //trex.debug = true;
  
  if (gameState===PLAY){
  
  
    if(keyDown("UP_ARROW")) {
      trex.y -= 5 ;
    }

    if(keyDown("DOWN_ARROW")) {
      trex.y += 5;
    }

    if(cloudsGroup.isTouching(rabbit)){
      rabbit.y = Math.round(random(100,300)); 
    }
  

     
    
    if (ground.x < 0){
      ground.x = 600;
    }
  
    trex.collide(invisibleGround);
    trex.collide(invisibleGround2);
    trex.collide(invisibleGround3);
    spawnClouds();
    //spawnObstacles();
    spawnBerries();
  
    if(cloudsGroup.isTouching(trex)){
        gameState = PLAY;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
      
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }

  else if (gameState === WIN) {
    gameOver.visible = false;
    restart.visible = false;
    textSize(60);
    text("Yayy, you win!!",100,300);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    ground.destroy();
    rabbit.destroy();
    invisibleGround.destroy();
    invisibleGround2.destroy();
    

    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
      
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }

  if(berriesGroup.isTouching(trex)){
    trex.x += 2;
  }

  if(cloudsGroup.isTouching(trex)){
    trex.x -= 4;
  }

  if(berriesGroup.isTouching(rabbit)){
    rabbit.x += 0.5;
  }
  
  if(rabbit.x > 580){
    gameState = END;
  }

  if(trex.x > 580){
    gameState = WIN;
  }


  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,400,40,10);
    cloud.y = Math.round(random(100,300));
    cloud.addImage(rocksImg);
    cloud.scale = 0.2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth ;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

/*function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
*/


function spawnBerries() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var berries = createSprite(600,400,40,10);
    berries.y = Math.round(random(100,300));
    berries.addImage(berriesImg);
    berries.scale = 0.2;
    berries.velocityX = -3;
    
     //assign lifetime to the variable
    berries.lifetime = 200;
    
    //adjust the depth
    berries.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    berriesGroup.add(berries);
  }
  
}