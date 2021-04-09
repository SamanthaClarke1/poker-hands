import { Line } from './lib';
import { Writable } from 'stream';

const stdinStream = new Writable();
stdinStream._write = function(chunk, encoding, next) {
	let input = chunk; // whatever was sent through by stdin

	try {
		let lines = 
	} catch(err: any) {
		if(err) process.stderr.write(err);
	}

	next();
}
stdinStream.on('finish', () => {
	process.stdout.write("\n");
})

process.stdin.pipe(stdinStream);