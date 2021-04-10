# Pokerhands!
#### A code challenge, completed by Samantha Clarke on Apr 9th.

## What's the challenge?

Given multiple lines (in this case sets of hands), determine how many hands were won by each player, and clearly display it.

Example
```
AH 9S 4D TD 8S 4H JS 3C TC 8D
|--Player 1--| |--Player 2--|
```


## How do I run it?

Simply run index.js through node with the parameters defined in the challenge documentation.

eg:
```bash
# To just run it with no input
node ./build/index.js
# OR
npm run start

# To run the test file
cat ./testfile.txt | node ./build/index.js
# OR
npm run test
```


## Why typescript, not javascript?
Typescript is simply a neater superset of javascript, and compiles down to javascript.

It also shows off my typescript and javascript knowledge at once ;)


## How could this be improved?
* This could have a GUI etc to access the program. ( not allowed as per the specs, even though I really wanted to be flashy :( )
* This could be exposed as a HTTP RESTful API. The idea is simple enough. Once again, specs say no.
* There could be unit testing as another node script. Would be fairly easy to implement. And could ensure that I got all the edgecases I wasn't *too* sure about.


## How did you do it?

It's implemented in NodeJS, using OOP and Typescript. It takes in an input via STDIN and splits it by chunk (STDIN does chunking by pipe end and newline when manually inputting), then splits everything by newline. It then instantiates a "PokerGame" for each newline, and calls game.chooseWinner(). Game uses multiple helper classes etc to make this as easy as possible.

To make all of the rank detection super easy it sorts hands by value, and also uses a simple histogram (Hand->calculateDistribution()). You'd be suprised how many ranks you barely have to write because of those two design choices / helpers.

Here's a little file map.
* `/src/*`					all of the source typescript code
* `/build/*`				where the compiled javascript goes
* `/src/index.ts`			where the project starts!
* `/src/lib.ts`				where I define what a 'game', 'line', 'hand', etc are, programmatically.
* `/src/rankDefinitions.ts`	where I define how to detect all of the different ranks.


## How do you keep score?

For the purposes of this program a hand is defined as simply "A combination of 5 cards".

So, how do we score those hands?
First, we get the highest rank (searching from highest score to lowest, stopping once we reach a rank).
```
1 : High Card		: Highest value card
2 : Pair			: Two cards (Same value)
3 : Two Pairs		: Two (different) pairs
4 : Three of a Kind	: Three cards of the same value
5 : Straight		: Five cards in consecutive order
6 : Flush			: Five cards with the same suit
7 : Full house		: Three of a kind and a pair
8 : Four of a Kind	: Four cards of the same value
9 : Straight Flush	: All five cards in consecutive value order with the same suit
10: Royal Flush		: Ten, Jack, Queen, King, Ace. All in the same suit.
```

Now, here's a cheat, for the sake of simplicity.

Whilst you could write a big ol algorithm to compare really complicated hands (eg: Rank first, then the card-score of that rank, and so on, increasing complexity of what your functions are actually handing back) theres a **much** simpler way.

Multiply the rank by 100, and add the highest involved card score (think: if I have a straight, whats the 'card' counted as?).

Example:
```
Three of a kind (4H, 4D, 4C) = 404
Straight (4H, 5D, 6C, 7H, 8H) = 508
Royal Flush = 1000
Straight Flush (9H, 8H, 7H, 6H, 5H) = 909
```

**However** this is still stupidly quick, easier to test, less algorithmically complex, and is more generally applicable (outside of this challenge).

I will also note that there are beautiful abstraction classes, because of course there are. I wrote this in typescript and I'll happily take the opportunity to show my skills and the languages strengths. 