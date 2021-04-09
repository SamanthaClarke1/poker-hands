"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("./lib");
var stream_1 = require("stream");
var console_1 = require("console");
var stdinStream = new stream_1.Writable();
stdinStream._write = function (chunk, encoding, next) {
    var score = [0, 0];
    var input = chunk.toString();
    try {
        for (var _i = 0, _a = input.split('\n'); _i < _a.length; _i++) {
            var line = _a[_i];
            var game = new lib_1.Game(line);
            var winner = game.chooseWinner();
            // note: suits would break the tie in this case, but the specs dont require that ;)
            console_1.assert(winner != -1, "There was at least one exactly identical hand (in terms of score).");
            score[winner] += 1;
        }
    }
    catch (err) {
        if (err)
            process.stderr.write(err);
    }
    process.stdout.write("Player 1: " + score[0] + "\nPlayer 2: " + score[1] + "\n");
    next();
};
stdinStream.on('finish', function () {
    process.stdout.write("\n");
});
process.stdin.pipe(stdinStream);
