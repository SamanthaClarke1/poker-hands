"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = require("stream");
var stdinStream = new stream_1.Writable();
stdinStream._write = function (chunk, encoding, next) {
    process.stdout.write(chunk);
    next();
};
stdinStream.on('finish', function () {
    process.stdout.write("\n");
});
process.stdin.pipe(stdinStream);
