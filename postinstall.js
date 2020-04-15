const sharp = require("sharp");

const supportedOptions = sharp.format;

// console.log(supportedOptions);

if (!supportedOptions.jpeg.input.buffer) process.exit(1);
if (!supportedOptions.jpeg.input.file) process.exit(1);
if (!supportedOptions.jpeg.input.stream) process.exit(1);

if (!supportedOptions.jpeg.output.buffer) process.exit(2);
if (!supportedOptions.jpeg.output.file) process.exit(2);
if (!supportedOptions.jpeg.output.stream) process.exit(2);

console.log("JPEG support found for all input/output functions.");

if (!supportedOptions.svg.input.buffer) process.exit(3);
if (!supportedOptions.svg.input.file) process.exit(3);
if (!supportedOptions.svg.input.stream) process.exit(3);

console.log("SVG output support found.");

console.log("\n\nAll clear!");

process.exit(0);
