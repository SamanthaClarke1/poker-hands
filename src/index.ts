import { PokerGame } from './lib';
import { Writable } from 'stream';
import { assert } from 'console';

const DEBUG = false;

const stdinStream = new Writable();
stdinStream._write = function(chunk, encoding, next) {
	let score = [0, 0];
	let input = chunk.toString();

	try {
		for(let line of input.split('\n')) {
			if(line.length > 10) { // empty lines might be there...
				let game = new PokerGame(line);
				let winner = game.chooseWinner();
				// note: suits would break the tie in this case, but the specs dont require that ;)
				assert(winner != -1, "There was at least one exactly identical hand (in terms of score).");
	
				score[winner] += 1;
			}
		}
	} catch(err: any) {
		if(err) console.error(err);
	}

	if(DEBUG) {
		process.stdout.write(`Player 1: (${score[0]} / 263)\nPlayer 2: (${score[1]} / 237)\n`)
		console.log("Approximate Accuracy: ", score[0] / 263 * 100)
	}
	else process.stdout.write(`Player 1: ${score[0]}\nPlayer 2: ${score[1]}\n`);
	next();
}

process.stdin.pipe(stdinStream);
