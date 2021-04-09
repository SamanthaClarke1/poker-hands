/* this file contains the classes etc used to make the code way, way neater! */

import { assert } from "console";
import { isRoyalFlush, isStraightFlush } from './rankDefinitions';

interface TranslationDictionary {
	T: number, A: number, J: number, Q: number, K: number
}

const translationDict: TranslationDictionary = {'T': 10, 'A': 14, 'J': 11, 'Q': 12, 'K': 13};
const rankCalculators: Function[] = [ // note: "high card" isn't in here as it's already factored in.
	isRoyalFlush,
	isStraightFlush,
]


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
	_rank: number = -1;

	constructor(cards: Card[]) {
		this.cards = cards.sort((a, b) => { return a.score - b.score; })
		assert(this.cards.length == 5, "Hand must have 5 cards!");
	}

	get rank(): number {
		if(this._rank !== -1) return this._rank;
		else {
			this._rank = this.calculateRank();
			return this._rank;
		}
	}

	calculateScore(): number { // actual "score" value 
		// note: technically this could be pow(30, i) not pow(100, i), but that looks a little neater
		// note 2: shouldn't happen but technically this could mean that they run into 
		// floating point precision errors... woop.
		let tval = this.rank;
		for(let i = 0; i < this.cards.length; i++) {
			tval += this.cards[i].score / Math.pow(100, i);
		}
		return tval;
	}

	// note: the current implementation doesnt allow for multi-ranks. (as the spec didnt say they were necessary)
	calculateRank(): number { 
		let rank = 9;
		let highestInvolvedCard = 0;

		for(let i = 0; i < rankCalculators.length; i++) {
			let tmp = rankCalculators[i](this);
			if(tmp != -1) {
				rank -= i;
				highestInvolvedCard = tmp;
			}
		}

		return rank * 100 + highestInvolvedCard;
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