"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("./lib");
var console_1 = require("console");
// note: stream splitter from github repo https://github.com/mcollina/syncsplit/blob/master/index.js
var syncsplit = require('./streamsplit');
var DEBUG = false;
var score = [0, 0];
process.stdin.pipe(syncsplit()).on('data', function (line) {
    try {
        if (line.length > 10) { // empty lines might be there...
            var game = new lib_1.PokerGame(line);
            var winner = game.chooseWinner();
            // note: suits would break the tie in this case, but the specs dont require that ;)
            console_1.assert(winner != -1, "There was at least one exactly identical hand (in terms of score).");
            score[winner] += 1;
        }
    }
    catch (err) {
        if (err)
            console.error(err);
    }
});
process.stdin.on('end', function () {
    if (DEBUG) {
        process.stdout.write("Player 1: (" + score[0] + " / 263)\nPlayer 2: (" + score[1] + " / 237)\n");
        console.log("Approximate Accuracy: ", score[0] / 263 * 100);
    }
    else
        process.stdout.write("Player 1: " + score[0] + "\nPlayer 2: " + score[1] + "\n");
});
