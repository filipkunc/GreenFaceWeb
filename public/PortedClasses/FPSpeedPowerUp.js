// Copyright 2010 Filip Kunc. All rights reserved.

var speedPowerUpImage = new Image();
speedPowerUpImage.src = "Images/speed_symbol.png";

function FPSpeedPowerUpFactory()
{
    this.image = speedPowerUpImage;
    
    this.create = function(levelObjects, x, y)
    {
        levelObjects.push(new FPSpeedPowerUp(x, y));
    }    
}

function FPSpeedPowerUp(x, y)
{
    this.x = x;
    this.y = y;
    this.isVisible = true;
    this.speedUpCounter = 0;
    this.selected = false;

    this.isPlatform = function()
    {
        return false;
    }
    
    this.isMovable = function()
    {
        return false;
    }
    
    this.rect = function()
    {
        return new FPRect(this.x, this.y, 32.0, 32.0);
    }
    
    this.move = function(offsetX, offsetY)
    {
        this.x += offsetX;
        this.y += offsetY;
    }
    
    this.update = function(game)
    {
        var player = game.player;
        var playerRect = player.rect();
    	if (this.speedUpCounter > 0)
    	{
    		this.speedUpCounter++;
    		if (this.speedUpCounter > maxSpeedUpCount)
            {
    			this.speedUpCounter = 0;
                this.isVisible = true;
            }
    	}
    	else if (FPRectIntersectsRect(playerRect, this.rect()))
    	{
    		this.speedUpCounter = 1;
    		player.speedUpCounter = 1;
            this.isVisible = false;
    	}
    }
    
    this.draw = function(context)
    {
        context.drawImage(speedPowerUpImage, this.x, this.y);
    }
    
    this.toLevelString = function()
    {
        var levelString = new String('<FPSpeedPowerUp>\n');
        levelString += '<x>' + this.x.toString() + '</x>\n';
        levelString += '<y>' + this.y.toString() + '</y>\n';
        levelString += '</FPSpeedPowerUp>\n';
        return levelString;
    }
}