"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStraightFlush = exports.isRoyalFlush = void 0;
var console_1 = require("console");
// remember, hands are sorted!
function isRoyalFlush(hand) {
    return (hand.cards[0].value == 'T' &&
        hand.cards[1].value == 'J' &&
        hand.cards[2].value == 'Q' &&
        hand.cards[3].value == 'K' &&
        hand.cards[4].value == 'A') ? 100 + 0 : -1;
}
exports.isRoyalFlush = isRoyalFlush;
function isStraightFlush(hand) {
    return handHasRun(hand, 5);
}
exports.isStraightFlush = isStraightFlush;
function handHasRun(hand, length) {
    console_1.assert(length < hand.cards.length && length > 0, "Length cannot be negative or greater than cards length.");
    var biggestStreak = 1;
    var current = hand.cards[0].score;
    for (var i = 1; i < hand.cards.length; i++) {
        if (hand.cards[i].score == current - 1) {
            biggestStreak++;
            current = hand.cards[i].score;
        }
    }
    if (biggestStreak >= length) {
        return 100 + hand.cards[i].score;
    }
    return -1;
}
