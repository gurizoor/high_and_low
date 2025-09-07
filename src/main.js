"use strict";
console.log('Hello world');
const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");
context.fillStyle = "rgb(200, 0, 0)";
context.fillRect(10, 10, 55, 50);
console.log(canvas);
