"use strict";
/* this file contains the classes etc used to make the code way, way neater! */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.Hand = exports.Line = exports.Game = void 0;
var console_1 = require("console");
var rankDefinitions_1 = require("./rankDefinitions");
var translationDict = { 'T': 10, 'A': 14, 'J': 11, 'Q': 12, 'K': 13 };
var rankCalculators = [
    rankDefinitions_1.isRoyalFlush,
    rankDefinitions_1.isStraightFlush,
];
var Game = /** @class */ (function () {
    function Game(line) {
        this.line = new Line(line);
        this.hands = this.line.convertToHands();
    }
    // returns 0 or 1 depending on who won. may also return -1 if the hands are tied in score.
    Game.prototype.chooseWinner = function () {
        var winner = -1;
        var scores = [this.hands[0].calculateScore(), this.hands[1].calculateScore()];
        if (scores[0] > scores[1])
            winner = 0;
        else if (scores[1] > scores[0])
            winner = 1;
        return winner;
    };
    return Game;
}());
exports.Game = Game;
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
        this.cards = cards.sort(function (a, b) { return a.score - b.score; });
        console_1.assert(this.cards.length == 5, "Hand must have 5 cards!");
    }
    Object.defineProperty(Hand.prototype, "rank", {
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
        // note: technically this could be pow(30, i) not pow(100, i), but that looks a little neater
        // note 2: shouldn't happen but technically this could mean that they run into 
        // floating point precision errors... woop.
        var tval = this.rank;
        for (var i = 0; i < this.cards.length; i++) {
            tval += this.cards[i].score / Math.pow(100, i);
        }
        return tval;
    };
    // note: the current implementation doesnt allow for multi-ranks. (as the spec didnt say they were necessary)
    Hand.prototype.calculateRank = function () {
        var rank = 9;
        var highestInvolvedCard = 0;
        for (var i = 0; i < rankCalculators.length; i++) {
            var tmp = rankCalculators[i](this);
            if (tmp != -1) {
                rank -= i;
                highestInvolvedCard = tmp;
            }
        }
        return rank * 100 + highestInvolvedCard;
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
