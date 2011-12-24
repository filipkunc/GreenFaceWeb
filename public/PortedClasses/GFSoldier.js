// Copyright 2010 Filip Kunc. All rights reserved.

var soldierImage = new Array();
soldierImage[0] = new Image();
soldierImage[0].src = "Images/D_01.png";
soldierImage[1] = new Image();
soldierImage[1].src = "Images/D_02.png";
soldierImage[2] = new Image();
soldierImage[2].src = "Images/D_03.png";
soldierImage[3] = new Image();
soldierImage[3].src = "Images/D_04.png";

var attackImage = new Array();
attackImage[0] = new Image();
attackImage[0].src = "Images/DH_01.png";
attackImage[1] = new Image();
attackImage[1].src = "Images/DH_02.png";
attackImage[2] = new Image();
attackImage[2].src = "Images/DH_03.png";

var deathImage = new Array();
deathImage[0] = new Image();
deathImage[0].src = "Images/DD_01.png";
deathImage[1] = new Image();
deathImage[1].src = "Images/DD_02.png";
deathImage[2] = new Image();
deathImage[2].src = "Images/DD_03.png";

const soldierSize = 64.0;

function GFSoldierFactory()
{
    this.image = soldierImage[3];
    
    this.create = function(levelObjects, x, y)
    {
        var soldier = new GFSoldier(x, y);
        levelObjects.push(soldier);
    }    
}

function GFSoldier(x, y)
{
    this.x = x;
    this.y = y;
    this.moveX = 0.0;
	this.moveY = 0.0;
    this.isAttacking = false;
    this.isDying = false;
	this.isVisible = true;
    this.moveCounter = 3;
    this.attackCounter = 0;
    this.dieCounter = 0;
    this.animationCounter = 0;
    this.leftOriented = false;
    this.selected = false;
    
    this.rect = function()
    {
        return new FPRect(this.x, this.y, soldierSize, soldierSize);
    }
    
    this.move = function(offsetX, offsetY)
    {
        this.x += offsetX;
        this.y += offsetY;
    }
    
    this.isPlatform = function()
    {
        return false;
    }
    
    this.isMovable = function()
    {
        return false;
    }
    
    this.update = function(game)
    {
        var oldX = this.x;
        var oldY = this.y;

        var moveSpeed = 3.0;

        var player = game.player;
        var playerRect = player.rect();

        var attackRect = this.rect();

        attackRect.size.width -= 8.0;
        if (this.leftOriented)
            attackRect.origin.x += 8.0;

        var isCollidingWithPlayer = false;

        if (!this.isDying && FPRectIntersectsRect(attackRect, playerRect))
        {
            if (player.falling() && playerRect.origin.y + playerRect.size.height - 10.0 < this.y)
            {
                this.isDying = true;
                player.moveY = -player.moveY * 1.1;
            }

            isCollidingWithPlayer = true;
        }

        if (this.isDying)
        {
            this.animationCounter += 0.6;
            this.y += 1.8;

            if (this.animationCounter > 5)
            {
                if (++this.dieCounter >= 3)
                    this.dieCounter = 2;
                this.animationCounter = 0;  
            }
        }
        else if (this.isAttacking)
        {
            if (player.x < this.x)
                this.leftOriented = true;
            else
                this.leftOriented = false;

            this.animationCounter += 0.6;

            if (this.animationCounter > 5)
            {
                if (++this.attackCounter >= 3)
                {
                    this.attackCounter = 0;
                    player.hit();                
                }
                this.animationCounter = 0;  

                if (!isCollidingWithPlayer)
                {
                    this.isAttacking = false;
                    this.attackCounter = 0;
                }
            }
        }
        else
        {
            if (!isCollidingWithPlayer)
            {
                if (!this.leftOriented)
                    this.x += moveSpeed;
                else
                    this.x -= moveSpeed;

                if (this.collisionLeftRight(game))
                {
                    this.x = oldX;
                    this.leftOriented = !this.leftOriented;
                }
                else
                {
                    this.moveY = -5.0;
                    this.y -= this.moveY;

                    var oldX2 = this.x;

                    if (!this.leftOriented)
                        this.x += 20.0;
                    else
                        this.x -= 20.0;        

                    if (!this.collisionUpDown(game))
                    {
                        this.x = oldX;
                        this.leftOriented = !this.leftOriented;
                    }
                    else
                    {
                        this.x = oldX2;
                    }

                    this.y = oldY;        
                }
            }

            this.animationCounter += 0.6;

            if (this.animationCounter > 5)
            {
                if (++this.moveCounter >= 4)
                    this.moveCounter = 0;
                this.animationCounter = 0;

                if (isCollidingWithPlayer)
                {
                    this.isAttacking = true;
                    this.moveCounter = 3;
                }
            }
        }
    }
    
    this.collisionLeftRight = function(game)
    {
    	var isColliding = false;

    	for (i in game.gameObjects)
    	{
    	    var platform = game.gameObjects[i];
    	    if (platform.isPlatform())
    		{
    			var intersection = FPRectIntersection(platform.rect(), this.rect());
    			if (intersection.isEmptyWithTolerance())
    			    continue;

    			if (platform.rect().left() > this.rect().left())
    			{
    			    if (platform.isMovable())
    			    {
    			        platform.move(intersection.size.width, 0.0);
    			        if (platform.collisionLeftRight(game))
    			        {
    			            platform.move(-intersection.size.width, 0.0);
    			            this.move(-intersection.size.width, 0.0);
    			            isColliding = true;
			            }
			        }
			        else
			        {
			            this.move(-intersection.size.width, 0.0);
			            isColliding = true;
		            }
    			}
    			else if (platform.rect().right() < this.rect().right())
    			{
    				if (platform.isMovable())
    			    {
    			        platform.move(-intersection.size.width, 0.0);
    			        if (platform.collisionLeftRight(game))
    			        {
    			            platform.move(intersection.size.width, 0.0);
    			            this.move(intersection.size.width, 0.0);
    			            isColliding = true;
			            }
			        }
			        else
			        {
			            this.move(intersection.size.width, 0.0);
			            isColliding = true;
		            }
    			}
    		}
    	}

    	return isColliding;
    }

    this.collisionUpDown = function(game)
    {
    	var isColliding = false;

    	for (i in game.gameObjects)
    	{
    	    var platform = game.gameObjects[i];
    		if (platform.isPlatform())
    		{
    			var intersection = FPRectIntersection(platform.rect(), this.rect());
    			if (intersection.isEmptyWithTolerance())
    				continue;

    			if (platform.rect().bottom() < this.rect().bottom())
    			{
    				if (this.moveY > 0.0)
    					this.moveY = 0.0;
    			
    				this.move(0.0, intersection.size.height);
    				isColliding = true;
    			}
    			else if (this.moveY < 0.0)
    			{
    				if (platform.rect().top() > this.rect().bottom() - tolerance + this.moveY)
    				{
    					this.moveY = 0.0;
    					this.move(0.0, -intersection.size.height);
    					isColliding = true;
    				}
    			}
    			else if (platform.rect().top() > this.rect().bottom() - tolerance)
    			{
    				this.move(0.0, -intersection.size.height);
    				isColliding = true;
    			}
    		}
    	}

    	return isColliding;
    }    
    
    this.draw = function(context)
    {
        context.save();
        
        if (this.leftOriented)
        {
            if (this.isAttacking && this.attackCounter == 2)
                context.translate(this.x + soldierSize - 7.0, this.y, 0.0);
            else
                context.translate(this.x + soldierSize, this.y, 0.0);
            
            context.scale(-1, 1);
        }
        else
        {
            if (this.isAttacking && this.attackCounter == 2)
                context.translate(this.x + 7.0, this.y, 0.0);
            else
                context.translate(this.x, this.y, 0.0);
        }
        
        if (this.isDying)
            context.drawImage(deathImage[this.dieCounter], 0, 0);
        else if (this.isAttacking)
            context.drawImage(attackImage[this.attackCounter], 0, 0);
        else
            context.drawImage(soldierImage[this.moveCounter], 0, 0);
        
        context.restore();      
    }
    
    this.toLevelString = function()
    {
        var levelString = new String('<GFSoldier>\n');
        levelString += '<x>' + this.x.toString() + '</x>\n';
        levelString += '<y>' + this.y.toString() + '</y>\n';
        levelString += '</GFSoldier>\n';
        return levelString;
    }
}