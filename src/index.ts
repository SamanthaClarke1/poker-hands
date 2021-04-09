import { Game } from './lib';
import { Writable } from 'stream';
import { assert } from 'console';

const stdinStream = new Writable();
stdinStream._write = function(chunk, encoding, next) {
	let score = [0, 0];
	let input = chunk.toString();

	try {
		for(let line of input.split('\n')) {
			let game = new Game(line);
			let winner = game.chooseWinner();
			// note: suits would break the tie in this case, but the specs dont require that ;)
			assert(winner != -1, "There was at least one exactly identical hand (in terms of score).");

			score[winner] += 1;
		}
	} catch(err: any) {
		if(err) process.stderr.write(err);
	}

	process.stdout.write(`Player 1: ${score[0]}\nPlayer 2: ${score[1]}\n`);
	next();
}
stdinStream.on('finish', () => {
	process.stdout.write("\n");
})

process.stdin.pipe(stdinStream);