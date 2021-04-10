"use strict";
/* this file contains the classes etc used to make the code way, way neater! */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.Hand = exports.Line = exports.PokerGame = void 0;
var console_1 = require("console");
var rankDefinitions_1 = require("./rankDefinitions");
var DEBUG = false;
var translationDict = { 'T': 10, 'A': 14, 'J': 11, 'Q': 12, 'K': 13 };
// note: "high card" isn't in here as it's already factored in, and as such, redundant.
var rankCalculators = [
    rankDefinitions_1.Ranks.isRoyalFlush,
    rankDefinitions_1.Ranks.isStraightFlush,
    rankDefinitions_1.Ranks.isFourOfAKind,
    rankDefinitions_1.Ranks.isFullHouse,
    rankDefinitions_1.Ranks.isFlush,
    rankDefinitions_1.Ranks.isStraight,
    rankDefinitions_1.Ranks.isThreeOfAKind,
    rankDefinitions_1.Ranks.isTwoPairs,
    rankDefinitions_1.Ranks.isPair
];
var PokerGame = /** @class */ (function () {
    function PokerGame(line) {
        this.line = new Line(line);
        this.hands = this.line.convertToHands();
    }
    // returns 0 or 1 depending on who won. may also return -1 if the hands are tied in score.
    PokerGame.prototype.chooseWinner = function () {
        var winner = -1;
        var scores = [this.hands[0].calculateScore(), this.hands[1].calculateScore()];
        if (scores[0] > scores[1])
            winner = 0;
        else if (scores[1] > scores[0])
            winner = 1;
        return winner;
    };
    return PokerGame;
}());
exports.PokerGame = PokerGame;
var Line = /** @class */ (function () {
    function Line(line) {
        this.line = line;
    }
    Line.prototype.convertToHands = function () {
        // convert line to a list of cards, then split it up by first / last 5 cards.
        var cards = this.line.split(' ').map(function (d) { return new Card(d); });
        var hands = [new Hand(cards.slice(0, 5)), new Hand(cards.slice(5, 10))];
        return hands;
    };
    return Line;
}());
exports.Line = Line;
var Hand = /** @class */ (function () {
    function Hand(cards) {
        this._rank = -1;
        this._distribution = {};
        this.cards = cards.sort(function (a, b) { return b.score - a.score; });
        console_1.assert(this.cards.length == 5, "Hand must have 5 cards!");
    }
    Object.defineProperty(Hand.prototype, "rank", {
        // simple efficiency wrapper 
        // note: in the future it'd require "dirty" detection. but the hands dont change, not now at least.
        get: function () {
            if (this._rank !== -1)
                return this._rank;
            else {
                this._rank = this.calculateRank();
                return this._rank;
            }
        },
        enumerable: false,
        configurable: true
    });
    Hand.prototype.calculateScore = function () {
        // note: technically this could be pow(30, i) not pow(100, i), but pow(100, i) is a lot
        // easier to read in the console, since it logs as AA.BBCCDDEE
        // note 2: shouldn't happen but technically this could mean that they run into 
        // floating point precision errors... woop.
        var tval = this.rank;
        for (var i = 0; i < this.cards.length; i++) {
            tval += this.cards[i].score / Math.pow(100, i);
        }
        if (DEBUG) {
            console.log("calculated handscore of ", tval);
            console.log("cards are ", this.cards.map(function (d) { return d.code; }));
        }
        return tval;
    };
    // note: the current implementation doesnt allow for multi-ranks. (as the spec didnt say they were necessary)
    Hand.prototype.calculateRank = function () {
        var rank = 0;
        var highestInvolvedCard = 0;
        for (var i = 0; i < rankCalculators.length; i++) {
            var tmp = rankCalculators[i](this);
            if (tmp != -1) {
                rank = 9 - i;
                highestInvolvedCard = tmp;
                break;
            }
        }
        return rank * 10000 + highestInvolvedCard * 100;
    };
    Object.defineProperty(Hand.prototype, "distribution", {
        // simple wrapper, very nice for efficiency and code cleanliness.
        get: function () {
            // if there's no distribution, generate new distribution and return, otherwise return the cache.
            if (Object.keys(this._distribution).length == 0) {
                this._distribution = this.calculateDistribution();
            }
            return this._distribution;
        },
        enumerable: false,
        configurable: true
    });
    // returns histogram of cards. key is the card score, with frequency as the data.
    Hand.prototype.calculateDistribution = function () {
        var distribution = {}; // <number (card score), frequency>
        this.cards.map(function (d) {
            if (d.score in distribution) {
                distribution[d.score]++;
            }
            else
                distribution[d.score] = 1;
        });
        return distribution;
    };
    return Hand;
}());
exports.Hand = Hand;
var Card = /** @class */ (function () {
    function Card(code) {
        this.code = code.toUpperCase(); // upper case in *case* there's a curveball ;)
        console_1.assert('23456789TAJQK'.indexOf(this.value) != -1, "Invalid card value!");
        console_1.assert('HDCS'.indexOf(this.suit) != -1, "Invalid suit value!");
    }
    Object.defineProperty(Card.prototype, "score", {
        get: function () {
            // note: if you want to add splitting by card suit
            // just make this go from 2->14 to 2->(4*14) where each suit is specified.
            // to acheive this, just multiply by 4 and add 0-3 for the suit! simples.
            // note: i dont play poker, this might be misunderstanding how that type of splitting works, 
            // but it'd be a way to split by suit ;p.
            var tsc = this.value;
            // if the current value isn't a number, return the number.
            if (['T', 'A', 'J', 'Q', 'K'].indexOf(tsc) != -1) {
                return translationDict[tsc];
            }
            return Number(tsc);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "value", {
        get: function () {
            return this.code[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "suit", {
        get: function () {
            return this.code[1];
        },
        enumerable: false,
        configurable: true
    });
    return Card;
}());
exports.Card = Card;
