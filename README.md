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