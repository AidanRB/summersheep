/// <reference path="./p5.d.ts" />
/// <reference path="./p5.global-mode.d.ts" />

function setup() {
    // getAudioContext().suspend();
    createCanvas(innerWidth, innerHeight - 5);
}

function draw() {
    background(54, 173, 136);
    
    drawSprites();
    
    fill("white");
    var greeting = "Hello world!";
    hello(greeting);

    /**
     * shows text
     * @param {string} textToShow the message
     */
    function hello(textToShow) {
        textAlign(CENTER);
        textSize(36);
        text(textToShow, width / 2, height / 2);
    }
}

function mousePressed() {
    var sprite = createSprite(mouseX, mouseY, 30, 30);
}