//Class for keeping track of state changes in the editor

//Correct usage:
//var change = new Change();
//change.remove = function(){//Specifics of what to do when change is popped};
//this.newStack.push(change);
var Change = function(){
  //Reference to the change that we can redo on when this change is pushed off of the changeStack
  //This is incredibly inneficient, but since there's a hard limit of 20 changes on the redo stack, it doesn't matter
  this.lastChange;
}

//Shell function for when the change has been removed
Change.prototype.remove = function(){
  console.log("If you're reading this, something broke.");
}
