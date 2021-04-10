import { PokerGame } from './lib';
import { assert } from 'console';

// note: stream splitter from github repo https://github.com/mcollina/syncsplit/blob/master/index.js
const syncsplit = require('./streamsplit');

const DEBUG = false;
var score = [0, 0];

process.stdin.pipe(syncsplit()).on('data', function(line: string) {
	try {
		if(line.length > 10) { // empty lines might be there...
			let game = new PokerGame(line);
			let winner = game.chooseWinner();
			// note: suits would break the tie in this case, but the specs dont require that ;)
			assert(winner != -1, "There was at least one exactly identical hand (in terms of score).");

			score[winner] += 1;
		}
	} catch(err: any) {
		if(err) console.error(err);
	}
});

process.stdin.on('end', function() {
	if(DEBUG) {
		process.stdout.write(`Player 1: (${score[0]} / 263)\nPlayer 2: (${score[1]} / 237)\n`);
		console.log("Approximate Accuracy: ", score[0] / 263 * 100);
	}
	else process.stdout.write(`Player 1: ${score[0]}\nPlayer 2: ${score[1]}\n`);
})