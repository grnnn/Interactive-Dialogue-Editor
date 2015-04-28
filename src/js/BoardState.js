//A simple interface for our 2 types of board states
var BoardState = function(){
  //Our stack of state changes, for ctrl-z purposes
  this.changeStack = [];

  //Another stack of state changes, if this isn't empty, that's a signal to save to the SQL server
  this.newStack = [];

  //A stack of removed state changes, for Ctrl-y purposes, associated with certain top-level states
  this.removedStack = [];

  //Top level object tracking changes
  this.info = {};

  //Indicates what type of boardstate this is
  this.type = "";

  //The top level html of the field you want to add
  this.fieldHTML = "";

  //Finally, we need the HTML container to do push in our web page stuff
  this.$container = $container = $("#myContainer");
}

//Function that saves the board state into the appropriate MySQL table
BoardState.prototype.save = function(){
  console.log("Saving...");
};

//Function which pushes the correct HTML into the page
BoardState.prototype.initializePage = function(){
  console.log("Initializing Page...");
};
