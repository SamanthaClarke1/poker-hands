import { Hand } from './lib';
import { assert } from "console";

// remember, hands are sorted!
// note: unit testing is something i definitely would want to do here
// but since its not really required and this is already such a...
// "fleshed out" solution... i'll leave it as is.
export class Ranks { 
	// high card not implemented, (because of my patent pending decimal breaker system making it redundant)
	static isPair(hand: Hand): number {
		let keys = Object.keys(hand.distribution);

		for(let i = 0; i < keys.length; i++) {
			if(hand.distribution[keys[i]] == 2) return Number(keys[i]);
		}

		return -1;
	}
	static isTwoPairs(hand: Hand): number {
		let keys = Object.keys(hand.distribution);

		if(keys.length <= 2) return hand.cards[0].score;
		// only possible double pair situation, where it's also not a full house or threeOfAKind.
		// (if theres 4 different cards its also impossible for a double pair.)
		if(keys.length != 3) return -1;

		// dont you love the implications from histographic analysis?
		for(let i = 0; i < 3; i++) if(hand.distribution[keys[i]] == 2) return Number(keys[i]);
		
		// shouldnt ever run, actually. but, just to make typescript quiet down ;).
		return -1;
	}
	static isThreeOfAKind(hand: Hand): number {
		let keys = Object.keys(hand.distribution);

		// in this case its a full house, or somehow 5 cards with the same value...
		// so.... this should never run, but just in case, 
		// return the score (since thats technically >= 3 of the same)
		if(keys.length <= 2) return hand.cards[0].score;
		// its impossible to have 4 different values and a triple.
		if(keys.length > 3) return -1;

		for(let i = 0; i < 3; i++) { if(hand.distribution[keys[i]] == 3) return Number(keys[i]); }
		
		return -1;
	}
	static isStraight(hand: Hand): number {
		return Ranks.handHasRun(hand, 5);
	}
	// test with 9D 8D 2D 4D 5D 9H 9H 9H 8H 8H
	static isFlush(hand: Hand): number {
		let currentSuit = hand.cards[0].suit;
		for(let i = 1; i < hand.cards.length; i++) {
			if(hand.cards[i].suit != currentSuit) return -1; 
		}
		return hand.cards[0].score;
	}

	// test with 9d 9d 9d 2d 2d 8d 8d 8d 3d 3d
	static isFullHouse(hand: Hand): number { // is broken
		// oh god... how are the fullhouse tie splits done...??
		// according to "how2holdem.com" its determined by the 3 matching cards first
		// gonna take a somewhat liberal assumption and only split by that... at least for now.
		// man, there's a lot of edge cases in poker, huh?
		// chances are my decimal breaker would actually split the score the correct way anyway. 
		// so, it shouldnt matter. should show up in testing if it does and my theory is wrong.
		// although i should note that, per the specs its just "split by the high card".
		// so the best implementation for full house could actually be no implementation...
		let keys = Object.keys(hand.distribution);

		if(keys.length == 2) { // this is only possible if theres a 3 & a 2 pair.
			if(hand.distribution[keys[0]] == 3) return Number(keys[0]);
			else return Number(keys[1]);
		}
		return -1;
	}

	static isFourOfAKind(hand: Hand): number {
		return Ranks.containsMultiples(hand, 4);
	}

	static containsMultiples(hand: Hand, minamt: number): number {
		let accepted: number[] = [];
		for(let i of Object.keys(hand.distribution)) {
			if(hand.distribution[i] >= minamt) accepted.push(Number(i));
		}
		if(accepted.length > 0) return accepted.sort((a, b) => { return b - a; })[0];

		return -1;
	}
	
	static isRoyalFlush(hand: Hand): number {
		return (
			hand.cards[0].value == 'T' &&
			hand.cards[1].value == 'J' &&
			hand.cards[2].value == 'Q' &&
			hand.cards[3].value == 'K' &&
			hand.cards[4].value == 'A'
		) ? 0 : -1;
	} 
	
	// test with 9D 8D 7D 6D 5D 6H 5H 4H 3H 2H
	static isStraightFlush(hand: Hand): number {
		let isStraight = Ranks.isStraight(hand);
		let isFlush = Ranks.isFlush(hand);
		if(isStraight != -1 && isFlush != -1) return isFlush;
		return -1;
	}
	
	// TODO: add support for multiple runs in one hand
	// note: not actually needed for this excercise, but always good to have for future proofing.
	static handHasRun(hand: Hand, length: number): number { 
		assert(length <= hand.cards.length && length >= 1, `Length ${length} cannot be less than 1 or greater than cards length.`);
	
		let biggestStreak = 1;
		let current = hand.cards[0].score;
		for(var i = 1; i < hand.cards.length; i++) {
			if(hand.cards[i].score == current - 1) {
				biggestStreak ++;
				current = hand.cards[i].score;
			}
		}
	
		if(biggestStreak >= length) {
			return current;
		}
		return -1;
	}
}