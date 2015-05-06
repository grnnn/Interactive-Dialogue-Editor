//Class for keeping track of state changes in the editor

//Correct usage:
//var change = new Change();
//change.remove = function(){//Specifics of what to do when change is popped};
//this.newStack.push(change);
var Change = function(){
  //Reference to the next change, so that I can check if it's possible to redo
  this.nextChange;
}

//Shell function for when the change has been removed
Change.prototype.remove = function(){
  console.log("If you're reading this, something broke.");
}
