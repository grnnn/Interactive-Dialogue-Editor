var DialogueBoard = function(id){
  //Inherit BoardState
  BoardState.call(this);

  //Override the type to be correct
  this.type = "Dialogue";

  //If given an ID, go ahead and load it
  if(id != undefined){
    this.load(id);
    this.id = id;
  } else {
    this.getID();
  }

  //Initialize the page elements
  this.initialize();

  //Keep track of the number of lines we have
  this.lineCount = 0;
  this.lineMax = 0;

  //Keep track of length of user linesOfDialogue
  this.lineLengths = [];

  //Keep track of timer for keypress input
  this.keypressTimer = 0;
};

//More inheritance of BoardState
DialogueBoard.prototype = new BoardState();

DialogueBoard.prototype.load = function(id){
  //First check if the id given exists in the system
  //If not, throw an unknown page error
  //If so, load info and create appro HTML

  //For now, just assume that it's id 1 and name is "My Dialogue"
  this.info.id = 1;
  this.info.title = "Untitled Dialogue";
};

//Function which obtains the next available ID, also will rename the dialogue to the appropriate form of "Untitled Dialogue (number)"
//The difference between this function and load is that load() will get an existing exchange, while this will create a new one
DialogueBoard.prototype.getID = function(){
  //For now, just assume that it's id 1 and name is "My Dialogue"
  this.info.id = 1;
  this.info.title = "Untitled Dialogue";
  document.location.hash += "/" + this.info.id;
};

//Overload save function
DialogueBoard.prototype.save = function(){
  console.log("saving...");


  //Handle unresolved stacks
  this.keypressTimer = 2;
  this.update();
};

//This is the header HTML we need
DialogueBoard.prototype.headerHTML = "<div class='navbar-header'>"
                                        +"<a class='navbar-brand' href='index.html'>"
                                          +"<img alt='Brand' src=''>"
                                        +"</a>"
                                        +"<ul class='nav navbar-nav'>"
                                          +"<li id='myTitle'>"
                                             +"Untitled Dialogue"
                                          +"</li>"
                                        +"</ul>"
                                      +"</div>";

//This is the Second header, it contains dropdown menus with editor buttons on it
DialogueBoard.prototype.headertwo =  "<nav class='navbar navbar-default navbar-fixed-top second-nav' >"
                                        +"<div class='container'>"
                                          +"<ul class='nav navbar-nav navbar-left dialogue-header-group' >"
                                            +"<li class='dropdown'>"
                                              +"<a class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>File</a>"
                                              +"<ul class='dropdown-menu' role='menu'>"
                                                +"<li><a href='blackboard.html' target='_blank'><span class='glyphicon glyphicon-file' aria-hidden='true'></span> New</a></li>"
                                                +"<li class='divider'></li>"
                                                +"<li><a id='saveListener'><span class='glyphicon glyphicon-floppy-disk' aria-hidden='true'></span> Save &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b style='color: grey;'>Ctrl+S</b></a></li>"
                                                +"<li><a id='deleteListener'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span> Delete This Asset</a></li>"
                                              +"</ul>"
                                            +"</li>"
                                            +"<li class='dropdown'>"
                                              +"<a class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>Edit</a>"
                                              +"<ul class='dropdown-menu' role='menu'>"
                                                +"<li><a id='undoListener'><i class='fa fa-undo'></i> Undo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b style='color: grey;'>Ctrl+Z</b></a></li>"
                                                +"<li><a id='redoListener'><i class='fa fa-repeat'></i> Redo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b style='color: grey;'>Ctrl+Y</b></a></li>"
                                                +"<li class='divider'></li>"
                                                +"<li><a>Something else here</a></li>"
                                              +"</ul>"
                                            +"</li>"
                                          +"</ul>"
                                        +"</div>"
                                      +"</nav>";


//HTML for any modals we may need
DialogueBoard.prototype.modalHTML = "<div class='modal fade' id='titleModal'>"
                                      +"<div class='modal-dialog'>"
                                        +"<div class='modal-content'>"
                                          +"<div class='modal-body'>"
                                            +"<button type='button' class='close title-modal-close' data-dismiss='modal' aria-label='Close'>"
                                              +"<span aria-hidden='true'>&times;</span>"
                                            +"</button>"
                                            +"<p>Rename Dialogue Exchange</p>"
                                            +"<p style='font-size:14px; font-weight: normal;'>Enter a new name for this exchange</p>"
                                            +"<br>"
                                            +"<div class='form-group'>"
                                              +"<input type='text' class='form-control' style='width: 70%; font-weight: normal;' id='titleModalField' value='Untitled Dialogue'>"
                                              +"<br>"
                                              +"<button type='button' class='btn btn-primary' style='margin-right: 20px;' id='titleModalEnter'>Ok</button>"
                                              +"<button type='button' class='btn btn-default title-modal-close' data-dismiss='modal'>Cancel</button>"
                                            +"</div>"
                                          +"</div>"
                                        +"</div>"
                                      +"</div>"
                                    +"</div>";

//HTML for the button that adds fields
DialogueBoard.prototype.addFieldHTML = "<div id='lineContainer'></div><button id='addField' class='btn btn-lg btn-default'><span class='glyphicon glyphicon-plus' aria-hidden='true'></span> Add a Line</button>"

//HTML for every field that is added
DialogueBoard.prototype.fieldHTML = "<div class='panel panel-default'>"
                                      +"<div class='panel-body'>"
                                        +"<div class='row'>"
                                          +"<div class='col-md-8'>"
                                            +"<div class='text'>Line</div>"
                                          +"</div>"
                                          +"<div class='col-md-4'>"
                                            +"<div class='text'>Annotations</div>"
                                          +"</div>"
                                        +"</div>"
                                        +"<div class='row'>"
                                          +"<div class='col-md-8'>"
                                            +"<div>"
                                              +"<textarea rows='2' cols='72' style='resize:vertical;width:100%;' class='dialogue' placeholder='Enter Dialogue here'></textarea>"
                                            +"</div>"
                                            +"<div class='text'> Grammars </div>"
                                          +"</div>"
                                          +"<div class='col-md-4 dAnnotations'></div>"
                                        +"</div>"
                                        +"<div class='row'>"
                                          +"<div class='col-md-8 grammars'>"
                                          +"</div>"
                                          +"<div class='col-md-4 gAnnotations'>"
                                          +"</div>"
                                        +"</div>"
                                        +"<button class='addGrammar btn btn-md btn-default'><span class='glyphicon glyphicon-plus' aria-hidden='true'></span> Add a Grammar</button>"
                                      +"</div>"
                                    +"</div>";

//HTML for every grammar that is added
DialogueBoard.prototype.grammarHTML = "<div class='panel panel-default' style='margin-left:10%;'>"
                                        +"<div class='panel-body'>"
                                         +"<span class='subtext'>[[Untitled Grammar]]</span>"
                                         +"<span class='gFields'>"
                                          +"<input type='text' style='margin-left:10px;'></input>"
                                         +"</span>"
                                         +"<button class='addGrammarField btn btn-sm btn-default' style='font-size:10px; margin-left: 10px;'><span class='glyphicon glyphicon-plus' aria-hidden='true'></span></button>";
                                        +"</div>"
                                      +"</div>"

//This call pushes in starting HTML and initializes the listeners
DialogueBoard.prototype.initialize = function(){
  var that = this;
  this.$header.append(this.headerHTML);
  $("#secondHeaderContainer").append(this.headertwo);
  this.$container.append(this.modalHTML);

  //
  //All this stuff handles the Title of the exchange
  //
  $("#titleModalField").attr("value", this.info.title);
  $("#myTitle").html(this.info.title);
  $("#myTitle").on("click", function(){
    $("#titleModal").modal({backdrop: 'static', keyboard: false});
  });
  function changeTitle(){
    if($("#titleModalField").val() === ""){
      $("#titleModal").modal("hide");
      $("#titleModalField").attr("value", that.info.title);
      $("#titleModalField").val(that.info.title);
      return;
    }
    that.info.title = $("#titleModalField").val();
    $("#titleModalField").attr("value", that.info.title);
    $("#titleModalField").val(that.info.title);
    $("#myTitle").html(that.info.title);
    $("#titleModal").modal("hide");
  }
  $("#titleModalField").keyup(function (e) {
    if (e.keyCode == 13) {
      changeTitle();
    }
  });
  $("#titleModalEnter").on("click", function(){
    changeTitle();
  });
  function cancelNewTitle(){
    $("#titleModalField").attr("value", that.info.title);
    $("#titleModalField").val(that.info.title);
  }
  $(".title-modal-close").on("click", cancelNewTitle);

  //
  //KeyPress Listener function
  //
  function myKeyPress(e){
    //On start typing new keys
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    if (charCode) {
      that.keypressTimer = 8;

      //When an area is highlighted and a key pressed, a change has been made in that the user has deleted some dialogue via highlight
      var ta = $(this).get()[0];
      if(ta.selectionStart !== ta.selectionEnd){
        var lineNum = parseInt($(this).parent().parent().parent().parent().parent().parent().attr("id").replace("line", "")) - 1;
        var change = new Change();
        change.text = $(this).val().substring(ta.selectionStart, ta.selectionEnd);
        change.index = ta.selectionStart;
        that.lineLengths[lineNum] -= (ta.selectionEnd - ta.selectionStart + 1);
        change.remove = function(){
          var str = $("#line"+(lineNum+1)+" div.panel div.panel-body div.row div div textarea.dialogue").val();
          if(str !== undefined){
            str = str.substring(0, this.index) + this.text + str.substring(this.index+1, str.length);
            this.valRemoved = str.substring(this.index, this.index+1);
            $("#line"+(lineNum+1)+" div.panel div.panel-body div.row div div textarea.dialogue").val(str);
          }
        };
        change.reload = function(){
          var str = $("#line"+(lineNum+1)+" div.panel div.panel-body div.row div div textarea.dialogue").val();
          if(str !== undefined){
            str = str.substring(0, this.index) + this.valRemoved + str.substring(this.index+1+this.text.length-1, str.length);
            $("#line"+(lineNum+1)+" div.panel div.panel-body div.row div div textarea.dialogue").val(str);
          }
        };
        //that.newStack.push(change);
      }
    }
  };

  //
  //STUFF FOR GRAMMAR FIELDS
  //
  function grammarAdd(){
    var lineNum = parseInt($(this).parent().parent().parent().attr("id").replace("line", ""));
    $("#line"+lineNum+" div.panel div.panel-body div.row div.grammars").append(that.grammarHTML);

    
  };

  //
  //All this stuff handles every field of the exchange
  //
  this.$container.append(this.addFieldHTML);
  $("#addField").on("click", function(){
    that.lineCount++;
    that.lineMax++;
    $("#lineContainer").append("<div id='line" + that.lineCount +"'>" + that.fieldHTML + "</div>");
    that.lineLengths.push(0);
    var change = new Change();
    change.lineNum = that.lineCount;
    change.remove = function(){
      $("#line" + that.lineCount).remove();
      that.lineCount--;

      //Take care of dialogue field
      this.oldLineCount = that.lineLengths[this.lineNum-1];
      this.lineContent = $("div#line"+this.lineCount+" div div.panel div.panel-body div.row div div textarea.dialogue").val();
    };
    change.reload = function(){
      that.lineCount++;
      $("#lineContainer").append("<div id='line" + that.lineCount +"'>" + that.fieldHTML + "</div>");

      //Take care of dialogue field
      $("div#line"+this.lineCount+" div div.panel div.panel-body div.row div div textarea.dialogue").val(this.lineContent);
      //make new listeners for keypress
      $("#lineContainer div div.panel div.panel-body div.row div div textarea.dialogue").on("keypress", myKeyPress);

    };
    that.newStack.push(change);

    //make new listeners for keypress
    $("#lineContainer div div.panel div.panel-body div.row div div textarea.dialogue").on("keypress", myKeyPress);

    //Listener for adding a grammar field
    $("#lineContainer div div.panel div.panel-body button.addGrammar").on("click", grammarAdd);

  });








};

//Add listeners depending on changes in the dialogue content
DialogueBoard.prototype.update = function(){
  var that = this;

  //Compile changes from last group of keyboard presses
  if(this.keypressTimer > 0) this.keypressTimer--;
  if(this.keypressTimer === 1){
    var change = new Change();
    change.keyChanges = [];
    change.text = [];
    for(var i = 0; i < this.lineMax; i++){
      change.keyChanges.push(0);
      change.text.push("");
      var str = $("#line"+(i+1)+" div.panel div.panel-body div.row div div textarea.dialogue").val();
      if(str.length >= this.lineLengths[i]){
        change.keyChanges[i] = str.length-1 - this.lineLengths[i];
        change.text[i] = str.substring(this.lineLengths[i], str.length-1);
        this.lineLengths[i] = str.length-1;
      }
    }
    change.remove = function(){
      for(var i = 0; i < this.keyChanges.length; i++){
        var oldStr = $("#line"+(i+1)+" div.panel div.panel-body div.row div div textarea.dialogue").val();
        if(oldStr == undefined) continue;
        $("#line"+(i+1)+" div.panel div.panel-body div.row div div textarea.dialogue").val(oldStr.substring(0, oldStr.length-this.keyChanges[i]));
        that.lineLengths[i] = oldStr.length-1-this.keyChanges[i];
        console.log(this.text);
      }
    };
    change.reload = function(){
      for(var i = 0; i < this.keyChanges.length; i++){
        var oldStr = $("#line"+(i+1)+" div.panel div.panel-body div.row div div textarea.dialogue").val();
        if(oldStr == undefined) continue;
        $("#line"+(i+1)+" div.panel div.panel-body div.row div div textarea.dialogue").val(oldStr + this.text[i]);
        that.lineLengths[i] = oldStr.length-1 + this.keyChanges[i];
      }
    };
    this.newStack.push(change);
  }
}
