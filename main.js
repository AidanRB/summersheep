// @ts-check
/// <reference path="./p5.d.ts" />
/// <reference path="./p5.global-mode.d.ts" />

let MAX_SPEED = 10
let DASH = 30
let GRAVITY = 0.4
let FRICTION = 2
let JUMP = 10

// Groups
let blocks
let deathblocks
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
let LEFT_ARROW_p = false;
let RIGHT_ARROW_p = false;
let pressed = new Date().getTime()
let maxSpeed


function setup() {
    blocks = new Group()
    deathblocks = new Group()
    tops = new Group()
    bottoms = new Group()
    lefts = new Group()
    rights = new Group()
    enemies = new Group()
    //players = new Group()
    showMXY = false

    canvas = createCanvas(1280, 720)
    canvas.mouseOver(MXYon)
    canvas.mouseOut(MXYoff)

    newBlock(-2, 0, 0, 800) // left end of level
    // Create platforms
    newBlock(0, 600, 3000, 30) // floor
    newBlock(500, 500, 300, 30) // platform
    newBlock(770, 300, 30, 300) // wall
    newBlock(650, 400, 30, 30)
    newDeathBlock(800, 564, 300)

    player = createSprite(100, 450, 30, 30)
    let sheep_walking_right = loadAnimation('images/sheep/sheeprun001.png', 'images/sheep/sheeprun008.png')
    let sheep_standing = loadAnimation('images/sheep/sheeprun001.png')
    player.addAnimation('walking', sheep_walking_right)
    player.addAnimation('still', sheep_standing)

    let enemy = createSprite(700, 560, 30, 30)
    let enemy_walking_left = loadAnimation('images/enemya/enemysprite001.png', 'images/enemya/enemysprite008.png')
    let enemy_standing = loadAnimation('images/enemya/enemysprite001.png')
    enemy.addAnimation('walking', enemy_walking_left)
    enemy.addAnimation('still', enemy_standing)
    enemy.addToGroup(enemies)
}



function draw() {
    background(50, 150, 255)

    // Gravity, jumping, collision with platform tops
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

    // Collisions with platform sides
    if (player.collide(lefts) && player.velocity.x > 0) {
        player.velocity.x = 0
        console.log('left')
    }
    if (player.collide(rights) && player.velocity.x < 0) {
        player.velocity.x = 0
        console.log('right')
    }
    if (player.collide(bottoms) && player.velocity.y < 0 && !player.collide(lefts) && !player.collide(rights)) {
        player.velocity.y = 0
        console.log('bottom')
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
            maxSpeed = DASH;
        }
        pressed = new Date().getTime()
    }
    if (player.velocity.x === 0) {
        maxSpeed = MAX_SPEED
    }

    LEFT_ARROW_p = keyDown(LEFT_ARROW)
    RIGHT_ARROW_p = keyDown(RIGHT_ARROW)

    // Reset dead player
    if (player.position.y > height) {
        die()
    }
    
    // Enemy AI
    for (let enemy of enemies) {
        if (player.position.x < enemy.position.x - 10) {
            enemy.velocity.x = -2
            enemy.changeAnimation('walking')
            enemy.mirrorX(1)
        }
        else if (player.position.x > enemy.position.x + 10) {
            enemy.velocity.x = 2
            enemy.changeAnimation('walking')
            enemy.mirrorX(-1)
        }
        else {
            enemy.velocity.x = 0
            enemy.changeAnimation('still')
        }
        
        if (enemy.collide(tops) && enemy.velocity) {
            if (player.position.y + 30 < enemy.position.y) {
                // Jump
                //enemy.velocity.y = -JUMP
                //enemy.position.y = enemy.position.y - 1
            }
            else if (enemy.velocity.y > 0 && !enemy.collide(lefts) && !enemy.collide(rights)) {
                // Stop on ground
                enemy.velocity.y = 0
            }
            //console.log("top")
        }
        else {
            // Gravity
            enemy.velocity.y += GRAVITY / 1.8
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

    // Die on touching enemies
    if (player.collide(enemies)) {
        die()
    }

    if (player.collide(deathblocks)) {
        die()
    }

    // Move camera
    if (player.position.x > 200) {
        camera.position.x = player.position.x + 440
    }
    else {
        camera.position.x = 640
    }
    
    drawSprites()

    // Debugging
    var debug = []
    debug.push(round(getFrameRate()))
    debug.push(str(round(player.position.x)) + ", " + str(round(player.position.y)))
    debug.push(str(round(player.velocity.x)) + ", " + str(round(player.velocity.y)))
    debug.push(MAX_SPEED)
    debug.push(str(enemies.length))
    
    displayDebug(debug)
    
    textFont('sans')
    if (showMXY) text(str(mouseX) + ", " + str(mouseY), mouseX, mouseY)
    for (coord of debugCoords) {
        textFont('sans')
        text(str(coord[0]) + ", " + str(coord[1]), coord[0], coord[1])
    }
}



function die() {
    player.position.x = 100
    player.position.y = 450
    player.velocity.x = 0
    player.velocity.y = 0
    background(255, 0, 0)
}

function mousePressed() {
    //debugCoords.push([mouseX, mouseY]);
    let enemy = createSprite(mouseX + camera.position.x - width / 2, mouseY, 10, 10)
    let enemy_walking_left = loadAnimation('images/enemya/enemysprite001.png', 'images/enemya/enemysprite008.png')
    let enemy_standing = loadAnimation('images/enemya/enemysprite001.png')
    enemy.addAnimation('walking', enemy_walking_left)
    enemy.addAnimation('still', enemy_standing)
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
    let top = createSprite(x + (w / 2), y - 1, w - 1, 1)
    top.addToGroup(tops)
    let bottom = createSprite(x + (w / 2), y + h, w - 1, 1)
    bottom.addToGroup(bottoms)
    let left = createSprite(x - 1, y + (h / 2), 1, h)
    left.addToGroup(lefts)
    let right = createSprite(x + w + 1, y + (h / 2), 1, h)
    right.addToGroup(rights)
}

/**
 * @param {number} x
 * @param {number} w
 * @param {number} y
 * @param {number} h
 */
function newDeathBlock(x, y, w) {
    let death_block = loadAnimation('images/slip/dangersmall.png')
    for (let i = 0; i < w; i += 20) {
        let block = createSprite(x + i + 10, y + 18, 20, 36)
        block.addAnimation('block', death_block)
        //block.changeAnimation('block')
        block.addToGroup(deathblocks)
        console.log(i)
    }
}


function displayDebug(array) {
    camera.off()
    fill('white')
    textSize(12)
    textFont('monospace')
    for (var i = 0; i < array.length; i++) {
        text(str(array[i]), 8, 20 * (i + 1))
    }
}