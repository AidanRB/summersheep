// @ts-check
/// <reference path="./p5.d.ts" />
/// <reference path="./p5.global-mode.d.ts" />

// Groups
let blocks
let tops
let bottoms
let lefts
let rights
let enemies
//let players
let player
let canvas
let showMXY
let debugCoords = []
let MAX_SPEED = 10
let DASH = 100
let GRAVITY = 0.4
let FRICTION = 2
let JUMP = 10
let LEFT_ARROW_p = false;
let RIGHT_ARROW_p = false;
let pressed = new Date().getTime()



function setup() {
    blocks = new Group()
    tops = new Group()
    bottoms = new Group()
    lefts = new Group()
    rights = new Group()
    enemies = new Group()
    //players = new Group()
    showMXY = false

    canvas = createCanvas(1200, 800)
    canvas.mouseOver(MXYon)
    canvas.mouseOut(MXYoff)

    newBlock(-2, 0, 0, 800)
    // Create platforms
    newBlock(0, 600, 800, 30)
    newBlock(500, 500, 300, 30)
    newBlock(770, 300, 30, 300)
    newBlock(700, 400, 30, 30)

    player = createSprite(100, 400, 30, 30)
    sheep_walking_right = loadAnimation('images/sheep/sheeprun001.png', 'images/sheep/sheeprun008.png')
    sheep_standing = loadAnimation('images/sheep/sheeprun001.png')
    player.addAnimation('walking', sheep_walking_right)
    player.addAnimation('still', sheep_standing)
}



function draw() {
    background(0, 30, 30, 100)

    if (player.collide(tops) && player.velocity) {
        if (keyDown(UP_ARROW)) {
            // Jump
            player.velocity.y = -JUMP
            player.position.y = player.position.y - 1
        }
        else if (player.velocity.y > 0 && !player.collide(lefts) && !player.collide(rights)) {
            // Stop on ground
            player.velocity.y = 0
        }
        console.log("top")
    }
    else {
        // Gravity
        player.velocity.y += GRAVITY
    }

    if (player.collide(lefts) && player.velocity.x > 0) {
        player.velocity.x = 0
        console.log("left")
    }
    if (player.collide(rights) && player.velocity.x < 0) {
        player.velocity.x = 0
        console.log("right")
    }
    if (player.collide(bottoms) && player.velocity.y < 0 && !player.collide(lefts) && !player.collide(rights)) {
        player.velocity.y = 0
        console.log("bottom")
    }
    player.collide(blocks)


    // Move players with arrow keys
    if (keyDown(LEFT_ARROW) && player.velocity.x <= 0 && player.velocity.x > -MAX_SPEED) {
        player.velocity.x -= 1
        player.changeAnimation('walking')
        player.mirrorX(-1)
    }
    else if (keyDown(RIGHT_ARROW) && player.velocity.x >= 0 && player.velocity.x < MAX_SPEED) {
        player.velocity.x += 1
        player.changeAnimation('walking')
        player.mirrorX(1)
    }

    // "Friction"
    else {
        player.changeAnimation('still')
        if (player.velocity.x > 2) player.velocity.x -= FRICTION
        else if (player.velocity.x < -2) player.velocity.x += FRICTION
        else player.velocity.x = 0
    }

    // Sprint
    if ((keyDown(LEFT_ARROW) && !LEFT_ARROW_p && player.velocity.x < 0) || (keyDown(RIGHT_ARROW) && !RIGHT_ARROW_p && player.velocity.x > 0)) {
        if (new Date().getTime() < pressed + 500) {
            MAX_SPEED = DASH;
        }
        pressed = new Date().getTime()
    }

    if (player.velocity.x === 0) {
        MAX_SPEED = 10
    }

    console.log()
    LEFT_ARROW_p = keyDown(LEFT_ARROW)
    RIGHT_ARROW_p = keyDown(RIGHT_ARROW)

    // Reset dead player
    if (player.position.y > height) {
        //player.remove()
        player.position.x = 100
        player.position.y = 400
        player.velocity.x = 0
        player.velocity.y = 0
    }
    
    for (let enemy of enemies) {
        if (player.position.x < enemy.position.x) enemy.velocity.x = -2
        if (player.position.x > enemy.position.x) enemy.velocity.x = 2
        
        if (enemy.collide(tops) && enemy.velocity) {
            if (player.position.y < enemy.position.y) {
                // Jump
                enemy.velocity.y = -JUMP
                enemy.position.y = enemy.position.y - 1
            }
            else if (enemy.velocity.y > 0 && !enemy.collide(lefts) && !enemy.collide(rights)) {
                // Stop on ground
                enemy.velocity.y = 0
            }
            //console.log("top")
        }
        else {
            // Gravity
            enemy.velocity.y += GRAVITY / 2
        }
        
        if (enemy.collide(lefts) && enemy.velocity.x > 0) {
            enemy.velocity.x = 0
            //console.log("left")
        }
        if (enemy.collide(rights) && enemy.velocity.x < 0) {
            enemy.velocity.x = 0
            //console.log("right")
        }
        if (enemy.collide(bottoms) && enemy.velocity.y < 0 && !enemy.collide(lefts) && !enemy.collide(rights)) {
            enemy.velocity.y = 0
            //console.log("bottom")
        }
        enemy.collide(blocks)
        
        if (enemy.position.y > height) {
            enemy.remove()
        }
    }

    enemies.collide(enemies)
    if (enemies.collide(player)) {
        player.position.x = 100
        player.position.y = 400
        player.velocity.x = 0
        player.velocity.y = 0
        background(255, 0, 0)
    }

    drawSprites()

    textFont("mono")
    
    var debug = []
    debug.push(round(getFrameRate()))
    debug.push(str(round(player.position.x)) + ", " + str(round(player.position.y)))
    debug.push(str(round(player.velocity.x)) + ", " + str(round(player.velocity.y)))
    debug.push(MAX_SPEED)
    debug.push(str(enemies.length))
    
    displayDebug(debug)
    
    if (showMXY) text(str(mouseX) + ", " + str(mouseY), mouseX, mouseY)
    for (coord of debugCoords) {
        text(str(coord[0]) + ", " + str(coord[1]), coord[0], coord[1])
    }
}



function mousePressed() {
    //debugCoords.push([mouseX, mouseY]);
    let enemy = createSprite(mouseX, mouseY, 10, 10)
    enemy.addToGroup(enemies)
}

function MXYon() {
    showMXY = true
}

function MXYoff() {
    showMXY = false
}

/**
 * @param {number} x
 * @param {number} w
 * @param {number} y
 * @param {number} h
 */
function newBlock(x, y, w, h) {
    let block = createSprite(x + (w / 2), y + (h / 2), w, h)
    block.addToGroup(blocks)
    let top = createSprite(x + (w / 2), y, w - 1, 1)
    top.addToGroup(tops)
    let bottom = createSprite(x + (w / 2), y + h, w - 1, 1)
    bottom.addToGroup(bottoms)
    let left = createSprite(x - 1, y + (h / 2), 1, h)
    left.addToGroup(lefts)
    let right = createSprite(x + w + 1, y + (h / 2), 1, h)
    right.addToGroup(rights)
}



function displayDebug(array) {
    camera.off()
    fill("white")
    textSize(12)
    for (var i = 0; i < array.length; i++) {
        text(str(array[i]), 8, 20 * (i + 1))
    }
}