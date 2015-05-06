var Blackboard = function(){
  //The containter to push HTML into
  this.$container = $("#myContainer");
  this.$header = $("#headerContainer");

  //The object representing the board state
  this.state = undefined;

  //A 10 second (10000 millisecond) timer, is overriden by this.getTimer()
  this.timerMax = 5000;
  this.timer = 5000;

  //This is true when the internet connection is not there
  this.disabled = false;

  //Called to read in hash stuff for page to figure out
  this.initializePage();
  //this.setTimer();
}

Blackboard.prototype.initializePage = function(){
  var that = this;
  if(document.location.hash != ""){
    var sources = document.location.hash.replace(/#/gi, "");
    sources = sources.split("/");
    if(sources[0] == "dialogue"){
      this.$container.empty();
      this.$header.empty();
      this.state = new DialogueBoard(sources[1]);
      that.initializeListeners();
      return;
    }
    if(sources[0] == "expressions"){
      //Set state equal to new expressions state, which handles its own stuff too
      return;
    }
    if(sources[0] == "grammars"){
      //Set state equal to new expressions state, which handles its own stuff too
      return;
    }
    if(sources[0] == "markup"){
      //Set state equal to new expressions state, which handles its own stuff too
      return;
    }
    //At this point, assume the hash value is garbage and set it to blank
    document.location.hash = "";
  }
  //At this point, we can assume that we haven't had to load another state
  this.$container.append(this.frontHTML);

  //Set up listeners too
  $("#dialogue").on('click', function(){
    document.location.hash = "dialogue";
    that.$container.empty();
    that.$header.empty();
    that.state = new DialogueBoard();
    that.initializeListeners();
  });
  $("#expressions").on('click', function(){
    document.location.hash = "expressions";
    $container.empty();
    //Set state equal to new expressions state, which handles its own stuff too
  });
  $("#grammars").on('click', function(){
    document.location.hash = "grammars";
    $container.empty();
    //Set state equal to new expressions state, which handles its own stuff too
  });
  $("#expressions").on('click', function(){
    document.location.hash = "markup";
    $container.empty();
    //Set state equal to new expressions state, which handles its own stuff too
  });
};

//Set the timer to a value based on the response time of an XML call to our server
Blackboard.prototype.setTimer = function(){
  var that = this;

  //Get time at send
  var sendTime = (new Date()).getTime();

  //Anonymous function that returns response time
  function getResponseTime() {
    // Handle IE and more capable browsers
    var xhr = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" );
    var status;

    // Open new request as a HEAD to the root hostname with a random param to bust the cache
    xhr.open( "HEAD", "//" + window.location.hostname + "/?rand=" + Math.floor((1 + Math.random()) * 0x10000), false );

    // Issue request and handle response
    try {
      xhr.send();
      var receiveTime = (new Date()).getTime();
      console.log(receiveTime - sendTime);
      return (receiveTime - sendTime);
    } catch (error) {
      that.updateInternet();
      return 500;
    }
  }

  //Get the response time (in milliseconds) that it takes to reach our own server
  this.maxTimer = getResponseTime() * 50;
}

//The very first thing that is seen when entering a blackboard page, given no legible hashcode
Blackboard.prototype.frontHTML = "<center><h1>What type of asset do you want to create?</h1></center><hr>"
                                  +"<div class='row'>"
                                    +"<div class='col-md-12'>"
                                      +"<center>"
                                        +"<h3>Dialogue</h3>"
                                        +"<button class='btn btn-default my-btn' style='width: 50%; height: 300px;' id='dialogue'>Temporary button</button>"
                                        +"<p style='width: 50%; margin: 20px; font-size: 16px;'>What do your characters say?</p>"
                                      +"</center>"
                                    +"</div>"
                                  +"</div>"
                                  +"<div class='row'>"
                                    +"<div class='col-md-4'>"
                                      +"<center>"
                                        +"<h3>Grammars</h3>"
                                        +"<button class='btn btn-default my-btn' style='width: 50%; height: 150px;' id='grammars'>Temporary button</button>"
                                        +"<p style='width: 50%; margin: 20px; font-size: 16px;'>Parts of dialogue</p>"
                                      +"</center>"
                                    +"</div>"
                                    +"<div class='col-md-4'>"
                                      +"<center>"
                                        +"<h3>State Expressions</h3>"
                                        +"<button class='btn btn-default my-btn' style='width: 50%; height: 150px;' id='expressions'>Temporary button</button>"
                                        +"<p style='width: 50%; margin: 20px; font-size: 16px;'>Connection to your game logic</p>"
                                      +"</center>"
                                    +"</div>"
                                    +"<div class='col-md-4'>"
                                      +"<center>"
                                        +"<h3>Markup</h3>"
                                        +"<button class='btn btn-default my-btn' style='width: 50%; height: 150px;' id='markup'>Temporary button</button>"
                                        +"<p style='width: 50%; margin: 20px; font-size: 16px;'>Custom annotations</p>"
                                      +"</center>"
                                    +"</div>"
                                  +"</div>";


//Do a 'HEAD' request to our own server to check state of internet connection
Blackboard.prototype.updateInternet = function(){

  // Open new request to the ping script
  var xhr = new XMLHttpRequest ();
  xhr.open( 'POST', 'src/php/ping.php', true);
  //xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');//Supports old browsers


  var that = this;

  xhr.onload = function(){
    //Having php troubles, will adjust when php troubles go away
    //console.log(this.responseText);
  }

  // Issue request and handle response
  try {
    xhr.send();
  } catch (error) {
    $("#disabledModal").modal({backdrop: 'static', keyboard: false});
    this.disabled = true;
  }


  /*if(hostReachable() && this.disabled){
    $("#disabledModal").modal('hide');
    this.disabled = false;
  } else if(!hostReachable()){
    $("#disabledModal").modal({backdrop: 'static', keyboard: false});
    this.disabled = true;
  }*/

}

//When a boardState is given, initialize what some listeners do
Blackboard.prototype.initializeListeners = function(){
  var that = this;
  //Undo and redo start disabled
  $("#undoListener").attr("disabled", "disabled");
  $("#redoListener").attr("disabled", "disabled");

  $("#undoListener").on("click", function(){
    //Check if the button is disabled
    if($(this).is("[disabled]")){
      event.preventDeafault();
    }

    //Handle the stacks
    $("#saveListener").trigger("click");

    //pop the last change, push into removedStack
    if(that.state.changeStack.length > 0){
      var change = that.state.changeStack.pop();
      change.remove();
      that.state.removedStack(change);
    }

    //Disable Undo button if necesary
    if(that.state.changeStack.length === 0){
      $(this).attr("disabled", "disabled");
    } else{
      $(this).removeAttr("disabled");
    }

  });

  //Manual button listeners (put in place by all board states)
  $("#saveListener").on("click", function(){
    if(that.state.newStack.length > 0){
      //Now we save the info to the SQL server
      that.state.save();

      //Update the stacks properly
      //Record the pointers to the next changes
      if(that.state.changeStack.length > 0) that.state.changeStack[that.state.changeStack.length - 1].nextChange = that.state.newStack[0];
      for(var i = 0; i < that.state.newStack.length; i++){
        if(i !== that.state.newStack.length){
          that.state.newStack[i].nextChange = that.state.newStack[i+1];
        }
      }
      //Merge the two stacks and clear the new one
      that.state.changeStack = Array.prototype.push.apply(that.state.changeStack, that.state.newStack);
      that.state.newStack = [];
      while(that.state.changeStack.length > 20){
        that.state.changeStack.shift(); //Pop the bottom off the stack until 20 states are reached
      }
    }
  });

  //Ctrl key listeners
  $(document).bind('keydown', function(event){
    if(event.ctrlKey || event.metakey){
      switch(String.fromCharCode(event.which).toLowerCase()){
        //Save event
        case 's':
          $("#saveListener").trigger("click");
          event.preventDefault();
          break;
        //Undo event
        case 'z':
          event.preventDefault();
          break;
        //Redo event
        case 'y':
          event.preventDefault();
          break;
      }
    }
  });



  //Also, override listeners for when page is closed, refreshed or the url is changed
  //we want to save before those events

  //Last but not least, on a page previous event, check the hash to see if it's empty or only contains 'dialogue' or 'expressions'
  //If so, call save, set state to undefined, and push frontHTML back in
}

Blackboard.prototype.updateButtons = function(){

};

//Runs every 100ms and does a few things to manage the changeStack, the save functionality, and the potential lack of internet connection
Blackboard.prototype.update = function(){
  //Check if there's a particular board state
  if(this.state != undefined){
    //Call the state update function
    this.state.update();

    //Keep track of our undo, redo, and save buttons
    this.updateButtons();

    //Next check if the timer has gone below 0
    if(this.timer <= 0){
      //Set the timer back up (if no internet, update every 5 seconds to look for a connection)
      if(this.disabled) this.timer = 1000;
      else this.timer = this.timerMax;

      //Check the internet connection, and toggle the 'disabled' variable based on state of internet connection
      this.updateInternet();

      //Save the current info
      $("#saveListener").trigger("click");

    }
  }

  //Decrement the timer
  this.timer -= 100;
}
