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
  draws:0,
  gameCount:0
};

$( function() {
  
});

function choosePlayer(callback) {
   var info=$('div.info');
   info.empty().append("Choose to play as X/O:<br />");
   info.append('<span><button id="X"><i class="fa fa-times fa-3x" aria-hidden="true"></i></button>');
   info.append(' | ');
   info.append('<button id="O"><i class="fa fa-circle-o fa-3x" aria-hidden="true"></i></button></span>');
  $('div.info button').click(function(){
    var id = $(this).attr('id');
    (id=="X") ? GO.computerToken="O" : GO.computerToken="X";
    info.empty().append("Cool, playing as "+id);
    callback();
  });
}

$(document).ready(function() {
if (GO.gameCount==0) { choosePlayer(computerTurn); }
else { computerTurn(); }
});

function resetGame() {
  GO.board=Array(9).fill(0);
  GO.gameCount++;
  GO.turn=0;
  GO.isOver=false;
  var denom=GO.gameCount-GO.draws
  var xWinPercent=Math.round((GO.X_wins/denom)*100);
  var oWinPercent=Math.round((GO.O_wins/denom)*100);
  addText("#X wins: "+GO.X_wins+"<br />#O wins: "+GO.O_wins+"<br />"+"%X wins: "+xWinPercent+"%<br />%O wins: "+
  oWinPercent+"%"); //reset text to show wins
  for (var i=0;i<=GO.board.length;i++) {
      $(GO.arrWords[i]).removeClass("winCells");
    }
  drawBoard();
  computerTurn();
}

function computerTurn() {
  computerMove(GO.computerToken);
  drawBoard();
  doWeGoOn();
  playerTurn();
}

function playerTurn() {
  clickHandler(callMeMaybe);
  drawBoard();
}

function callMeMaybe()
{
  doWeGoOn();
  if (!GO.isOver) { computerTurn(); }
}

function doWeGoOn() {
  var winner=checkWinner();
  if (winner) {
    addText("<em>Winner: "+GO.board[winner[0]]+"</em>");
    highlightWin(winner);
    var tok=GO.board[winner[0]]+"_wins";
    GO[tok]++;
    GO.isOver=true;
    $('div.cell').off();
  }
  if (boardFull()&&(!checkWinner())) {
    addText("IT'S A DRAW BRAH"); 
    GO.isOver=true;
    GO.draws++;
    setTimeout(resetGame,GO.DRAW_PAUSE);
  }
}

function highlightWin(winArr) {
  var flashCount=0;
  var flash = setInterval(function(){ 
  for (var i=0;i<=winArr.length;i++) { $(GO.arrWords[winArr[i]]).toggleClass("winCells"); }
    flashCount++;
    if (flashCount==11) { 
    clearInterval(flash); 
    setTimeout(resetGame,GO.WIN_PAUSE);
    }
  },GO.FLASH_RATE);
}

function drawBoard() {
  var app=document.getElementById('app');
  for (var i=0;i<GO.board.length;i++){
    var fillWith;
    if (GO.board[i]=="X") {fillWith=GO.x_code;}
    else if (GO.board[i]=="O") {fillWith=GO.o_code;}
    else {fillWith=GO.blank;}
    $(GO.arrWords[i]).empty().append(fillWith);
  }
}

function checkWinner() {
  for (var i=0;i<GO.winCombos.length;i++){
      var t1=GO.board[GO.winCombos[i][0]];
      var t2=GO.board[GO.winCombos[i][1]];
      var t3=GO.board[GO.winCombos[i][2]];
      if ((t1!==0)&&((t1==t2)&&(t2==t3))) {
        return GO.winCombos[i]; 
      }
    }
    return false;
  }

//for now, naive AI, no real minimax
//loop through win combinations
//can we win by playing an empty square in any given win combination?
//if so play it and win
//if not, play a random open square
function computerMove(token) { 
  var move;
  for (var i=0;i<GO.winCombos.length;i++) {
    var t1=GO.board[GO.winCombos[i][0]];
    var t2=GO.board[GO.winCombos[i][1]];
    var t3=GO.board[GO.winCombos[i][2]];
    var occup=numXO([t1,t2,t3]); //returns [num_x, num_o] for the given win combination on the board
    var myNum;
    var oppNum;
    if (token=="X") { //find out how many of a given win combination of 3 are currently TOKEN
      myNum=occup[0]; //if 2 of 3 are currently TOKEN and the other one is empty
      oppNum=occup[1]; //we can win by playing the empty
    }
    else {
      myNum=occup[1]; 
      oppNum=occup[0];
    }
    if ((myNum==2)&&(oppNum==0)) { //we can win, so play the empty squre
      if (t1!==token) {move=GO.winCombos[i][0];}
      if (t2!==token) {move=GO.winCombos[i][1];}
      if (t3!==token) {move=GO.winCombos[i][2];}
      playMove(move,token);
      GO.turn++;
      GO.isOver=true;
      return true;
    }
  }
  playRandom(token); //we can't win so play a random open square instead
  GO.turn++;
}

function playRandom(token) {
  var openIndices=[];
  for (var i=0;i<GO.board.length;i++) { if(!isOccupied(i)){openIndices.push(i);} }
  var randomIndex=Math.floor(Math.random()*openIndices.length);
  if(openIndices[randomIndex]!==null) { playMove(openIndices[randomIndex],token); }
}
  
function playMove(pos, token) {
  if (validMove(pos)&&!isOccupied(pos)) { GO.board[pos]=token; } //update board
  else { console.log(pos+" "+token); throw ("invalid move"); }
}
//some helper functions
function isOccupied(pos) { return ((GO.board[pos]=="X")||(GO.board[pos]=="O")) ? true : false; }
function validMove(pos) { return ((-1<pos<9)&&(GO.board[pos]==0)) ? true : false; }
function addText(text) { $('div.info').empty().append(text); }
function spacesFull() { return GO.board.reduce(function(n,val){return n+(val!==0);},0); }
function boardFull() { return (spacesFull()==9); }

function currentPlayer() { 
  var pos=numXO(); //returns [num_x, num_o] tokens on board
  return (pos[0]>pos[1]) ? "O" : "X";
}

function numXO(arr=GO.board) {
  var numX=arr.reduce(function(n,val){return n+(((val!==0)&&val!=="")&&(val!=="O"));},0);
  var numO=arr.reduce(function(n,val){return n+(((val!==0)&&val!=="")&&(val!=="X"));},0);
  return [numX, numO];
}

//Click handling to place moves and div on-mouse-over formatting logic
function clickHandler(e) { 
  $('div.cell').click(function(){
    var id = $(this).attr('id');
    var id_num=GO.wordToNum[id];
    if ((!isOccupied(id_num-1)&&(validMove(id_num-1)))&&(!GO.isOver))
    {
      playMove(id_num-1,currentPlayer());
      $(GO.arrWords[id_num-1]).css({'opacity':'1.0','color':'black'});
      e();
    }
  });
 $('div.cell').on({
  mouseenter: function(e){
    var id_word = $(this).attr('id');
    var id_num = GO.wordToNum[id_word];
    var fillWith;
    var current=currentPlayer();
    (current=="X") ? fillWith=GO.x_code : fillWith=GO.o_code;
    if (!GO.isOver) {
    if (!isOccupied(id_num-1)) {
    $(GO.arrWords[id_num-1]).css({'opacity':'0.2','color':'red'});
    $(GO.arrWords[id_num-1]).empty().append(fillWith);
  }
  }}, 
  mouseleave: function(e) {
    var id_word = $(this).attr('id');
    var id_num = GO.wordToNum[id_word];
    $(GO.arrWords[id_num-1]).css({'opacity':'1.0','color':'black'});
    if (!GO.isOver) {
    if (!isOccupied(id_num-1)) {
    $(GO.arrWords[id_num-1]).empty();}
  }
  }});
}