// Copyright 2010 Filip Kunc. All rights reserved.

var backgroundImage = new Image();
backgroundImage.src = "Images/marbleblue.png";

function removeObject(array, obj)
{
    for (var i = 0; i < array.length; i++)
    { 
        if (array[i] == obj)
        {
            array.splice(i, 1);
            return;
        }
    } 
}

function FPGame()
{
    this.gameObjects = new Array();
    this.player = new FPPlayer();
    this.inputAcceleration = new FPPoint(0.0, 0.0);
    this.width = 480.0;
    this.height = 320.0;
    
    this.backgroundOffsetX = 0.0;
    this.backgroundOffsetY = 0.0;
    
    this.addGameObject = function(gameObject)
    {
        this.gameObjects.push(gameObject);
    }
    
    this.update = function()
    {
        for (var i = 0; i < this.gameObjects.length; i++)
        {
            var gameObject = this.gameObjects[i];
			gameObject.update(this);
        }
        this.player.update(this);
    }
    
    this.draw = function(context)
    {
        var offsetX = (this.backgroundOffsetX % 32.0) - 32.0;
        var offsetY = (this.backgroundOffsetY % 32.0) - 32.0;
                        
        context.drawImage(backgroundImage, offsetX, offsetY);
        
        for (i in this.gameObjects)
        {
            if (this.gameObjects[i].isVisible)
                this.gameObjects[i].draw(context);
        }
        
        this.player.draw(context);
        
        context.fillStyle = "white";
        context.font = "22px Helvetica Neue";
        context.fillText("Lives: " + this.player.lives.toString(), 5.0, 20.0);
        context.fillStyle = "black";
        
        if (this.player.speedUpCounter > 0)
        {
            var speedTime = (maxSpeedUpCount - this.player.speedUpCounter) / 60.0;            
            context.fillStyle = "rgba(128, 255, 255, 0.8)";
            context.fillText(speedTime.toFixed(1), 440.0, 310.0);
            context.fillStyle = "black";
        }
    }
    
    this.moveWorld = function(offsetX, offsetY)
    {
        for (i in this.gameObjects)
        {
            this.gameObjects[i].move(offsetX, offsetY);
        }
        
        this.backgroundOffsetX += offsetX * 0.25;
        this.backgroundOffsetY += offsetY * 0.25;
    }
}