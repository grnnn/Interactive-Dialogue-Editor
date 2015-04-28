var Blackboard = function(){
  //The containter to push HTML into
  this.$container = $container = $("#myContainer");

  //The object representing the board state
  this.state = undefined;

  //A 10 second (10000 millisecond) timer, is overriden by this.getTimer()
  this.timerMax = 10000;
  this.timer = 10000;

  //This is true when the internet connection is not there
  this.disabled = false;

  //Called to read in hash stuff for page to figure out
  this.initializePage();
  //this.setTimer();
}

Blackboard.prototype.initializePage = function(){
  if(document.location.hash != ""){
    var sources = document.location.hash.replace(/#/gi, "");
    sources = sources.split("/");
    if(sources[0] == "dialogue"){
      //Set state equal to new dialogue state, which handles it's own stuff
      return;
    }
    if(sources[0] == "expressions"){
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
    $container.empty();
    //Set state equal to new dialogue state, which handles it's own stuff
  });
  $("#expressions").on('click', function(){
    document.location.hash = "expressions";
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
  this.maxTimer = getResponseTime() * 100;
}

//The very first thing that is seen when entering a blackboard page, given no legible hashcode
Blackboard.prototype.frontHTML = "<center><h1>What type of asset do you want to create?</h1></center><hr>"
                                  +"<div class='row'>"
                                    +"<div class='col-md-6'>"
                                      +"<center>"
                                        +"<h3>Dialogue</h3>"
                                        +"<button class='btn btn-default my-btn' style='width: 50%; height: 150px;' id='dialogue'>Temporary button</button>"
                                        +"<p style='width: 50%; margin: 20px; font-size: 16px;'>Grammars and expansions of what characters say</p>"
                                      +"</center>"
                                    +"</div>"
                                    +"<div class='col-md-6'>"
                                      +"<center>"
                                        +"<h3>Expressions</h3>"
                                        +"<button class='btn btn-default my-btn' style='width: 50%; height: 150px;' id='expressions'>Temporary button</button>"
                                        +"<p style='width: 50%; margin: 20px; font-size: 16px;'>Connection to your game logic</p>"
                                      +"</center>"
                                  +"</div>";


//Do a 'HEAD' request to our own server to check state of internet connection
Blackboard.prototype.updateInternet = function(){
  //Anonymous function that connects to own host
  function hostReachable() {
    // Handle IE and more capable browsers
    var xhr = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" );
    var status;

    // Open new request as a HEAD to the root hostname with a random param to bust the cache
    xhr.open( "HEAD", "//" + window.location.hostname + "/?rand=" + Math.floor((1 + Math.random()) * 0x10000), false );

    // Issue request and handle response
    try {
      xhr.send();
      return ( xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304) );
    } catch (error) {
      return false;
    }
  }

  if(hostReachable() && this.disabled){
    $("#disabledModal").modal('hide');
    this.disabled = false;
  } else if(!hostReachable()){
    $("#disabledModal").modal({backdrop: 'static', keyboard: false});
    this.disabled = true;
  }

}

//When a boardState is given, initialize what some listeners do
Blackboard.prototype.initializeListeners = function(){
  var that = this;

  //Ctrl key listeners
  $(document).bind('keydown', function(event){
    if(event.ctrlKey || event.metakey){
      switch(String.fromCharCode(event.which).toLowerCase()){
        //Save event
        case 's':
          if(that.newStack.length > 0) that.state.save();
          console.log("Saved");
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

//Runs every 100ms and does a few things to manage the changeStack, the save functionality, and the potential lack of internet connection
Blackboard.prototype.update = function(){
  //Check if there's a particular board state
  if(this.state != undefined){
    //Next check if the timer has gone below 0
    if(this.timer <= 0){
      //Set the timer back up (if no internet, update every 5 seconds to look for a connection)
      if(this.disabled) this.timer = 5000;
      else this.timer = this.timerMax;

      //Check the internet connection, and toggle the 'disabled' variable based on state of internet connection
      //this.updateInternet();

      //Next, check if the new stack is empty
      if(this.state.newStack.length > 0){
        //Now we save the info to the SQL server
        this.state.save();

        //Update the stacks properly (move all new stack things into the change stack)
        this.state.changeStack = Array.prototype.push.apply(this.state.changeStack, this.state.newStack);
        this.state.newStack = [];
        while(this.state.changeStack.length > 20){
          this.state.changeStack.shift(); //Pop the bottom off the stack until 20 states are reached
        }

      }
    }
  }

  //Decrement the timer
  this.timer -= 100;
}
