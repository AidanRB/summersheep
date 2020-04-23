// @ts-check
/// <reference path="./p5.d.ts" />
/// <reference path="./p5.global-mode.d.ts" />

// Groups
let blocks
let tops
let bottoms
let lefts
let rights
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
    //players = new Group()
    showMXY = false

    canvas = createCanvas(innerWidth, innerHeight)
    canvas.mouseOver(MXYon)
    canvas.mouseOut(MXYoff)

    newBlock(-2, 0, 0, 800)
    // Create platforms
    newBlock(0, 600, 800, 30)
    newBlock(500, 500, 300, 30)
    newBlock(770, 300, 30, 300)
    newBlock(700, 400, 30, 30)

    player = createSprite(100, 400, 30, 30)
    player_image = loadImage('images/sheep.png')
    player.addImage(player_image)
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


    // Move players with arrow keys
    if (keyDown(LEFT_ARROW) && player.velocity.x <= 0 && player.velocity.x > -MAX_SPEED) player.velocity.x -= 1
    else if (keyDown(RIGHT_ARROW) && player.velocity.x >= 0 && player.velocity.x < MAX_SPEED) player.velocity.x += 1

    // "Friction"
    else {
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

    drawSprites()

    var debug = []
    debug.push(round(getFrameRate()))
    debug.push(str(round(player.position.x)) + ", " + str(round(player.position.y)))
    debug.push(str(round(player.velocity.x)) + ", " + str(round(player.velocity.y)))
    debug.push(MAX_SPEED)

    displayDebug(debug)

    if (showMXY) text(str(mouseX) + ", " + str(mouseY), mouseX, mouseY)
    for (coord of debugCoords) {
        text(str(coord[0]) + ", " + str(coord[1]), coord[0], coord[1])
    }
}



function mousePressed() {
    //debugCoords.push([mouseX, mouseY]);
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
    // let block = createSprite(x + (w / 2), y + (h / 2), w, h)
    // block.addToGroup(blocks)
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