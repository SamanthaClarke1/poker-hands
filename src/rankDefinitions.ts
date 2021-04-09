import { Hand } from './lib';
import { assert } from "console";

// remember, hands are sorted!
export function isRoyalFlush(hand: Hand): number {
	return (
		hand.cards[0].value == 'T' &&
		hand.cards[1].value == 'J' &&
		hand.cards[2].value == 'Q' &&
		hand.cards[3].value == 'K' &&
		hand.cards[4].value == 'A'
	) ? 100 + 0 : -1;
}
export function isStraightFlush(hand: Hand): number {
	return handHasRun(hand, 5);
}
function handHasRun(hand: Hand, length: number): number {
	assert(length < hand.cards.length && length > 0, "Length cannot be negative or greater than cards length.");

	let biggestStreak = 1;
	let current = hand.cards[0].score;
	for(var i = 1; i < hand.cards.length; i++) {
		if(hand.cards[i].score == current - 1) {
			biggestStreak ++;
			current = hand.cards[i].score;
		}
	}

	if(biggestStreak >= length) {
		return 100 + hand.cards[i].score;
	}
	return -1;
}