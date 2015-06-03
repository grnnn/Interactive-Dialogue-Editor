//A simple interface for our 2 types of board states
var BoardState = function(){
  //Our stack of board states
  this.changeStack = [];

  //Save another stack of state changes in case players want to redo after some undos
  this.redoStack = [];

  //Indicates what type of boardstate this is
  this.type = "";

  //This field indicates the unique ID of the asset (for dialogue, grammars, and markup)
  this.id = 0;

  //Can we do a redo?
  this.canRedo = false;
  //Have we changed since we last did things?
  this.changed = false;

  //Finally, we need the HTML container to do push in our web page stuff
  this.$container = $("#myContainer");
  this.$header = $("#headerContainer");
}

//Function that saves the board state into the appropriate MySQL table
BoardState.prototype.save = function(){
  console.log("Saving...");
};

//Function that loads the board state from the appropriate MySQL table
BoardState.prototype.load = function(){
  console.log("Loading...");
};

//Function which pushes the correct HTML into the page
BoardState.prototype.initializePage = function(){
  console.log("Initializing Page...");
};

//Function which is called every 10 seconds
BoardState.prototype.update = function(){
  //console.log("Updating...");
};

//This parses out a board state into HTML
BoardState.prototype.parse = function(){
  console.log("Parsing...");
};

//This compresses a bunch of HTML into a board state
BoardState.prototype.compress = function(){
  console.log("Compressing...");
};
