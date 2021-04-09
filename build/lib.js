"use strict";
/* this file contains the classes etc used to make the code way, way neater! */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.Hand = exports.Line = void 0;
var translationDict = { 'A': 14, 'J': 11, 'Q': 12, 'K': 13 };
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
        this.cards = cards;
    }
    Object.defineProperty(Hand.prototype, "score", {
        get: function () {
            return 0; // TODO: stub
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Hand.prototype, "rank", {
        get: function () {
            return 0; // TODO: stub
        },
        enumerable: false,
        configurable: true
    });
    return Hand;
}());
exports.Hand = Hand;
var Card = /** @class */ (function () {
    function Card(code) {
        this.code = code.toUpperCase(); // upper case in *case* there's a curveball ;)
    }
    Object.defineProperty(Card.prototype, "score", {
        get: function () {
            var tsc = this.value;
            // if the current value isn't a number, return the number.
            if (['A', 'J', 'Q', 'K'].indexOf(tsc) != -1) {
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
