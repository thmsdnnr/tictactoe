# BUGS

Occasionally the percentages can add up to > 100% b/c we're using Math.round() only and not doing anything more sophisticated. It usually goes away at the following turn. Not a huge deal since this is kind of a toy feature but could fix by using Math.ceil() and Math.floor().

Currently we are using Math.round((#wins/#games)*100).

So if the decimal part of # wins for X and # wins for O is >=0.5 we round up for both, giving us a % that is greater than 100.
e.g.,

X wins 5 times
O wins 3 times

X: 5/8 = 0.625
O: 3/8 = 0.375

Naively rounding after multiplying by 100 gives

X: 62.5 => rounds to => 63%
O: 37.5 => rounds to => 38%

You could do Math.floor() on one and Math.ceil() on the other, getting in this case e.g.:

X: Math.floor(62.5) => 62%
O: Math.ceil(37.5) => 38%

Now the percentages add to 100 and there's only a small inaccuracy. Most accurate: display to one decimal place.

# ENHANCEMENTS/IMPROVEMENTS

*USE ONE instead of ON.CLICK for the click handlers

*Alternatively only bind a click handler to open cells at beginning of each move.

## FUNCTIONS and what they do:

## the GO game object that contains variables, board, and constants
```
var GO = {
  DRAW_PAUSE: 2000, //in ms
  WIN_PAUSE: 1000,
  FLASH_RATE: 100,
  arrWords:["#one","#two","#three","#four","#five","#six","#seven","#eight","#nine"],
  wordToNum:{one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9},
  winCombos:[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],
  board:Array(9).fill(0),
  x_code:'<i class="fa fa-times" aria-hidden="true"></i>',
  o_code:'<i class="fa fa-circle-o" aria-hidden="true"></i>',
  blank:"",
  turn:0,
  computerToken:"O",
  isOver:false,
  O_wins:0,
  X_wins:0,
  gameCount:0
};
```