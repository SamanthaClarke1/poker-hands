/* this file contains the classes etc used to make the code way, way neater! */

import { assert } from "console";
import { Ranks } from './rankDefinitions';

const DEBUG = false;

interface TranslationDictionary {
	T: number, A: number, J: number, Q: number, K: number
}

const translationDict: TranslationDictionary = {'T': 10, 'A': 14, 'J': 11, 'Q': 12, 'K': 13};

// note: "high card" isn't in here as it's already factored in, and as such, redundant.
const rankCalculators: Function[] = [
	Ranks.isRoyalFlush,
	Ranks.isStraightFlush,
	Ranks.isFourOfAKind,
	Ranks.isFullHouse,
	Ranks.isFlush,
	Ranks.isStraight,
	Ranks.isThreeOfAKind,
	Ranks.isTwoPairs,
	Ranks.isPair
]


export class PokerGame {
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
	_distribution: any = {};

	constructor(cards: Card[]) {
		this.cards = cards.sort((a, b) => { return b.score - a.score; })
		assert(this.cards.length == 5, "Hand must have 5 cards!");
	}

	// simple efficiency wrapper 
	// note: in the future it'd require "dirty" detection. but the hands dont change, not now at least.
	get rank(): number { 
		if(this._rank !== -1) return this._rank;
		else {
			this._rank = this.calculateRank();
			return this._rank;
		}
	}

	calculateScore(): number { // actual "score" value 
		// note: technically this could be pow(30, i) not pow(100, i), but pow(100, i) is a lot
		// easier to read in the console, since it logs as AA.BBCCDDEE
		// note 2: shouldn't happen but technically this could mean that they run into 
		// floating point precision errors... woop.
		let tval = this.rank;
		for(let i = 0; i < this.cards.length; i++) {
			tval += this.cards[i].score / Math.pow(100, i);
		}
		if(DEBUG) {
			console.log("calculated handscore of ", tval)
			console.log("cards are ", this.cards.map((d)=>{return d.code;}))
		}
		return tval;
	}

	// note: the current implementation doesnt allow for multi-ranks. (as the spec didnt say they were necessary)
	calculateRank(): number { 
		let rank = 0;
		let highestInvolvedCard = 0;

		for(var i = 0; i < rankCalculators.length; i++) {
			let tmp = rankCalculators[i](this);
			if(tmp != -1) {
				rank = 9 - i;
				highestInvolvedCard = tmp;
				break;
			}
		}

		return rank * 10000 + highestInvolvedCard * 100;
	}

	// simple wrapper, very nice for efficiency and code cleanliness.
	get distribution(): any {
		// if there's no distribution, generate new distribution and return, otherwise return the cache.
		if(Object.keys(this._distribution).length == 0) { 
			this._distribution = this.calculateDistribution();
		}
		return this._distribution;
	}

	// returns histogram of cards. key is the card score, with frequency as the data.
	calculateDistribution(): any {
		let distribution: any = {}; // <number (card score), frequency>

		this.cards.map((d) => {
			if(d.score in distribution) {
				distribution[d.score]++; 
			} else distribution[d.score] = 1;
		});

		return distribution;
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
		// note: if you want to add splitting by card suit
		// just make this go from 2->14 to 2->(4*14) where each suit is specified.
		// to acheive this, just multiply by 4 and add 0-3 for the suit! simples.
		// note: i dont play poker, this might be misunderstanding how that type of splitting works, 
		// but it'd be a way to split by suit ;p.
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