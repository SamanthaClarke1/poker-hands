/* this file contains the classes etc used to make the code way, way neater! */

import { assert } from "console";

interface TranslationDictionary {
	T: number, A: number, J: number, Q: number, K: number
}

const translationDict: TranslationDictionary = {'T': 10, 'A': 14, 'J': 11, 'Q': 12, 'K': 13};


export class Game {
	line: Line;
	hands: Hand[];

	constructor(line: string) {
		this.line = new Line(line);
		this.hands = this.line.convertToHands();
	}

	// returns 0 or 1 depending on who won. may also return -1 if the hands are tied in score.
	chooseWinner(): number {
		let winner = -1;
		
		let scores = [this.hands[0].calculateScore(), this.hands[1].calculateScore()];
		if(scores[0] > scores[1]) winner = 0;
		else if(scores[1] > scores[0]) winner = 1;

		return winner;
	}
}

export class Line {
	line: string;

	constructor(line: string) {
		this.line = line;
	}

	convertToHands(): Hand[] {
		// convert line to a list of cards, then split it up by first / last 5 cards.
		let cards: Card[] = this.line.split(' ').map((d) => { return new Card(d); })
		let hands: Hand[] = [new Hand(cards.slice(0, 5)), new Hand(cards.slice(5, 10))];

		return hands;
	}
}


export class Hand {
	cards: Card[];

	constructor(cards: Card[]) {
		this.cards = cards.sort((a, b) => { return a.score - b.score; })
		assert(this.cards.length == 5, "Hand must have 5 cards!");
	}

	calculateScore(): number { // actual "score" value
		return this.rank * 100 + this.value;
	}
	nthValueCard(index: number): number {
		assert(index >= 0 && index <= this.cards.length, "Index cannot <= 0, or >= 5.");

		let tval = 0;

		return tval;
	}
	get value(): number { // highest involved card value
		return 0; // TODO: stub;
	}
	get rank(): number {
		return 0; // TODO: stub
	}
}


export class Card {
	code: string;

	constructor(code: string) {
		this.code = code.toUpperCase(); // upper case in *case* there's a curveball ;)
		assert('23456789TAJQK'.indexOf(this.value) != -1, "Invalid card value!");
		assert('HDCS'.indexOf(this.suit) != -1, "Invalid suit value!")
	}
	get score(): number {
		let tsc = this.value;
		// if the current value isn't a number, return the number.
		if(['T', 'A', 'J', 'Q', 'K'].indexOf(tsc) != -1) {
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