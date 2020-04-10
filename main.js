/// <reference path="./p5.d.ts" />
/// <reference path="./p5.global-mode.d.ts" />

function setup() {
    //getAudioContext().suspend();
    createCanvas(innerWidth, innerHeight - 5);
}

function draw() {
    background(54, 173, 136);
    textAlign(CENTER);
    fill("white");
    textSize(36);
    text("Hello world!", width / 2, height / 2);

    drawSprites();
}

function mousePressed() {
    var sprite = createSprite(mouseX, mouseY, 30, 30);
}