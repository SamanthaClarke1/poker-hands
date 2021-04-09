/* this file contains the classes etc used to make the code way, way neater! */

interface TranslationDictionary {
	A: number, J: number, Q: number, K: number
}

let translationDict: TranslationDictionary = {'A': 14, 'J': 11, 'Q': 12, 'K': 13};

export class Line {
	line: string;

	constructor(line: string) {
		this.line = line;
	}

	convertToHands(): Hand[] {
		// convert line to a list of cards, then split it up by first / last 5 cards.
		let cards: Card[] = this.line.split(' ').map((d) => { return new Card(d); })
		let hands: Hand[] = [new Hand(cards.slice(0, 5)), new Hand(cards.slice(5, 10))];

		return hands; // stub
	}
}

export class Hand {
	cards: Card[];

	constructor(cards: Card[]) {
		this.cards = cards;
	}

	get score() {
		return 0; // TODO: stub
	}
	get rank() {
		return 0; // TODO: stub
	}
}

export class Card {
	code: string;

	constructor(code: string) {
		this.code = code.toUpperCase(); // upper case in *case* there's a curveball ;)
	}
	get score(): number {
		let tsc = this.value;
		// if the current value isn't a number, return the number.
		if(['A', 'J', 'Q', 'K'].indexOf(tsc) != -1) {
			return translationDict[tsc as keyof TranslationDictionary];
		}
		return Number(tsc);
	}
	get value(): string {
		return this.code[0];
	}
	get suit(): string {
		return this.code[1];
	}
}