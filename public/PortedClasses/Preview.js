// Copyright 2010 Filip Kunc. All rights reserved.

var xhr = new XMLHttpRequest();

function windowOpener(windowWidth, windowHeight, windowName, windowUri)
{
    var centerWidth = (window.screen.width - windowWidth) / 2;
    var centerHeight = (window.screen.height - windowHeight) / 2;

    var newWindow = window.open(windowUri, windowName, 'resizable=0,width=' + windowWidth + 
        ',height=' + windowHeight + 
        ',left=' + centerWidth + 
        ',top=' + centerHeight);

    newWindow.focus();
    return newWindow;
}

function drawPreview(levelName, canvasName)
{
    var canvas = document.getElementById(canvasName);
    var context = canvas.getContext('2d');
	
	xhr.open("GET", "Levels/" + levelName, false);    
    xhr.send();
    
    var xmlDoc = xhr.responseXML;
    
    var game = new FPGame();
    
    var posX, posY, widthSegments, heightSegments;
    var playerOffsetX, playerOffsetY;
    var endX, endY;

    var x = xmlDoc.documentElement.childNodes;
    for (i = 0; i < x.length; i++)
    { 
        if (x[i].nodeType == 1)
        {
            y = x[i].childNodes;
            for (j = 0; j < y.length; j++)
            {
                if (y[j].nodeType == 1)
                {
                    if (y[j].nodeName == 'x')
                    {
                        posX = parseFloat(y[j].textContent);
                    }
                    else if (y[j].nodeName == 'y')
                    {
                        posY = parseFloat(y[j].textContent);
                    }
                    else if (y[j].nodeName == 'widthSegments')
                    {
                        widthSegments = parseInt(y[j].textContent);
                    }
                    else if (y[j].nodeName == 'heightSegments')
                    {
                        heightSegments = parseInt(y[j].textContent);
                    }
                    else if (y[j].nodeName == 'endX')
                    {
                        endX = parseFloat(y[j].textContent);
                    }
                    else if (y[j].nodeName == 'endY')
                    {
                        endY = parseFloat(y[j].textContent);
                    }
                }
            }

            if (x[i].nodeName == 'FPPlayer')
            {
                playerOffsetX = posX;
                playerOffsetY = posY;
            }
            else if (x[i].nodeName == 'FPExit')
            {
                game.addGameObject(new FPExit(posX, posY));
            }
            else if (x[i].nodeName == 'FPPlatform')
            {
                game.addGameObject(new FPPlatform(posX, posY, widthSegments, heightSegments));
            }
            else if (x[i].nodeName == 'FPMovablePlatform')
            {
                game.addGameObject(new FPMovablePlatform(posX, posY, widthSegments, heightSegments));
            }
            else if (x[i].nodeName == 'FPDiamond')
            {
                game.addGameObject(new FPDiamond(posX, posY));
            }
            else if (x[i].nodeName == 'FPElevator')
            {
                game.addGameObject(new FPElevator(posX, posY, endX, endY, widthSegments));
            }
            else if (x[i].nodeName == 'FPTrampoline')
            {
                game.addGameObject(new FPTrampoline(posX, posY, widthSegments));
            }  
            else if (x[i].nodeName == 'FPMagnet')
            {
                game.addGameObject(new FPMagnet(posX, posY, widthSegments));
            }
            else if (x[i].nodeName == 'GFSoldier')
            {
                game.addGameObject(new GFSoldier(posX, posY));
            }
            else if (x[i].nodeName == 'FPSpeedPowerUp')
            {
                game.addGameObject(new FPSpeedPowerUp(posX, posY));
            }            
        }
    }

    game.moveWorld(208.0 - playerOffsetX, 128.0 - playerOffsetY);
    
    game.update();
   	context.fillRect(0, 0, canvas.width, canvas.height);
    game.draw(context);
}