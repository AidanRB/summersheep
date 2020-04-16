// @ts-check
/// <reference path="./p5.d.ts" />
/// <reference path="./p5.global-mode.d.ts" />

//import { collide } from "./libraries/p5.play";

// Groups
var grounds;
var players;



function setup() {
    grounds = new Group();
    players = new Group();

    createCanvas(innerWidth, innerHeight);

    // Create platforms
    var ground = createSprite(width / 2, height - 30, width - 200, 30);
    ground.addToGroup(grounds);
    var ground2 = createSprite(width - 200, height - 150, 200, 30);
    ground2.addToGroup(grounds);
    //var wall = createSprite(width)
}



function draw() {
    background(0, 30, 30);

    for (player of players) {
        // Ground detection
        if (player.collide(grounds)) {
            // Stop on ground
            player.velocity.y = 0;
            
            if (keyDown(UP_ARROW)) {
                // Jump
                player.velocity.y = -10;
            }
        }
        else {
            // Gravity
            player.velocity.y += 0.4;
        }


        // Move players with arrow keys
        if (keyDown(LEFT_ARROW)) player.velocity.x -= 1;
        else if (keyDown(RIGHT_ARROW)) player.velocity.x += 1;
        // "Friction"
        else {
            if (player.velocity.x > 1.5) player.velocity.x -= 3;
            else if (player.velocity.x < -1.5) player.velocity.x += 3;
            else player.velocity.x = 0;
        }

        // Remove dead players
        if (player.position.y > 1000) {
            player.remove();
        }
    }

    drawSprites();

    // Show some diagnostic data
    fill("white");
    text(round(frameRate()), 10, 20);
    text(players.length, 10, 40);
}



function mousePressed() {
    // Create players on click
    player = createSprite(mouseX, mouseY, 30, 30);
    player.addToGroup(players);
}
