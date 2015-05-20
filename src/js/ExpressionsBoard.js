var ExpressionBoard = function(id){
  //Inherit BoardState
  BoardState.call(this);

  //Override the type to be correct
  this.type = "Expression";

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
};

//More inheritance of BoardState
ExpressionBoard.prototype = new BoardState();

ExpressionBoard.prototype.load = function(id){
  //First check if the id given exists in the system
  //If not, throw an unknown page error
  //If so, load info and create appro HTML

  //For now, just assume that it's id 1 and name is "My Dialogue"
  this.info.id = 1;
  this.info.title = "Expressions";
};

//Function which obtains the next available ID, also will rename the dialogue to the appropriate form of "Untitled Dialogue (number)"
//The difference between this function and load is that load() will get an existing exchange, while this will create a new one
ExpressionBoard.prototype.getID = function(){
  //For now, just assume that it's id 1 and name is "My Dialogue"
  this.info.id = 1;
  this.info.title = "Expressions";
  document.location.hash += "/" + this.info.id;
}

//This is the header HTML we need
ExpressionBoard.prototype.headerHTML = "<div class='navbar-header'>"
                                        +"<a class='navbar-brand' href='index.html'>"
                                          +"<img alt='Brand' src=''>"
                                        +"</a>"
                                        +"<ul class='nav navbar-nav'>"
                                          +"<li id='myTitle2'>"
                                             +"Untitled Expression"
                                          +"</li>"
                                        +"</ul>"
                                      +"</div>";

//This is the Second header, it contains dropdown menus with editor buttons on it
ExpressionBoard.prototype.headertwo =  "<nav class='navbar navbar-default navbar-fixed-top second-nav' >"
                                        +"<div class='container'>"
                                          +"<ul class='nav navbar-nav navbar-left dialogue-header-group' >"
                                            +"<li class='dropdown'>"
                                              +"<a class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>File</a>"
                                              +"<ul class='dropdown-menu' role='menu'>"
                                                +"<li><a href='blackboard.html' target='_blank'><span class='glyphicon glyphicon-file' aria-hidden='true'></span> New</a></li>"
                                                +"<li class='divider'></li>"
                                                +"<li><a id='saveListener'><span class='glyphicon glyphicon-floppy-disk' aria-hidden='true'></span> Save &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b style='color: grey;'>Ctrl+S</b></a></li>"
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
ExpressionBoard.prototype.modalHTML = "<div class='modal fade' id='titleModal'>"
                                      +"<div class='modal-dialog'>"
                                        +"<div class='modal-content'>"
                                          +"<div class='modal-body'>"
                                            +"<button type='button' class='close title-modal-close' data-dismiss='modal' aria-label='Close'>"
                                              +"<span aria-hidden='true'>&times;</span>"
                                            +"</button>"
                                            +"<p>Rename Expression Exchange</p>"
                                            +"<p style='font-size:14px; font-weight: normal;'>Enter a new name for this exchange</p>"
                                            +"<br>"
                                            +"<div class='form-group'>"
                                              +"<input type='text' class='form-control' style='width: 70%; font-weight: normal;' id='titleModalField' value='Untitled Expression'>"
                                              +"<br>"
                                              +"<button type='button' class='btn btn-primary' style='margin-right: 20px;' id='titleModalEnter'>Ok</button>"
                                              +"<button type='button' class='btn btn-default title-modal-close' data-dismiss='modal'>Cancel</button>"
                                            +"</div>"
                                          +"</div>"
                                        +"</div>"
                                      +"</div>"
                                    +"</div>";

//HTML for the button that adds fields
ExpressionBoard.prototype.addFieldHTML = "<div id='lineContainer'></div><button id='addField' class='btn btn-lg btn-default'><span class='glyphicon glyphicon-plus' aria-hidden='true'></span> Add a Line</button>"

//HTML for every field that is added
ExpressionBoard.prototype.fieldHTML = "<div class='panel panel-default'>"
                                      +"<div class='panel-body'>"
                                        +"<div class='row'>"
                                          +"<div class='col-md-8'>"
                                            +"<div class='text'><span class='text'>State Name </span>"
                                                +"<span><input type='text' class='form-control' style=' display: inline; width: 40%; font-weight: normal; margin-bottom: 12px;'></input></span>"
                                            +"</div>"
                                          +"</div>"
                                        +"</div>"
                                        
                                          
                                            
                                            //+"</div>"
                                              +"<div class='dropdown' style='margin-bottom: 10px'>"
                                                +"<span class='text'>Type: </span>"
                                                +"<button class='btn btn-default dropdown-toggle' type='button' id='menu1' data-toggle='dropdown'>None"
                                                  +"<span class='caret'></span></button>"
                                                +"<ul class='dropdown-menu' role='menu' aria-labelledby='menu1'>"
                                                  +"<li role='presentation'><a role='menuitem' tabindex='-1' href='#''>Int</a></li>"
                                                  +"<li role='presentation'><a role='menuitem' tabindex='-1' href='#''>Boolean</a></li>"
                                                  +"<li role='presentation'><a role='menuitem' tabindex='-1' href='#''>String</a></li>"
                                                  +"<li role='presentation'><a role='menuitem' tabindex='-1' href='#''>None</a></li>"
                                                +"</ul>"
                                              +"</div>"
                                            +"</span>"
                                          
                                        
                                       
                                      +"</div>"
                                    +"</div>";


//This call pushes in starting HTML and initializes the listeners
ExpressionBoard.prototype.initialize = function(){
  var that = this;
  this.$header.append(this.headerHTML);
  $("#secondHeaderContainer").append(this.headertwo);
  this.$container.append(this.modalHTML);

  //
  //All this stuff handles the Title of the exchange
  //
  $("#titleModalField").attr("value", this.info.title);
  $("#myTitle2").html(this.info.title);
  //$("#myTitle").on("click", function(){
    //$("#titleModal").modal({backdrop: 'static', keyboard: false});
  //});
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
    $("#myTitle2").html(that.info.title);
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
  //All this stuff handles every field of the exchange
  //
  //this.$container.append(this.fieldHTML);
  this.$container.append(this.addFieldHTML);
  $("#addField").on("click", function(){
    that.lineCount++;
    $("#lineContainer").append("<div id='line" + that.lineCount +"'>" + that.fieldHTML + "</div>");
    $("#line"+that.lineCount+ " div.panel-default div.panel-body div.dropdown ul li a").on("click", function(){
      $(this).parent().parent().parent().find("button").html($(this).text()+"<span class='caret'></span>");
    });
    $("#line"+that.lineCount+ " div.panel-default div.panel-body div.row div.col-md-8 div.text span input").on("blur", function(){
      var temp = $(this).val();
      $(this).parent().parent().parent().parent().parent().append("<button id='subButton"+that.lineCount+"' class='btn btn-default'>Add a SubState</button>");
      $("#subButton"+that.lineCount).on("click", function(){
        $(this).
      })
      $(this).parent().parent().html("<span class='text'>"+temp+"</span>");

      
    });
    var change = new Change();
    change.remove = function(){
      $("#line" + that.lineCount).remove();
      that.lineCount--;
    };
    change.reload = function(){
      that.lineCount++;
      $("#lineContainer").append("<div id='line" + that.lineCount +"'>" + that.fieldHTML + "</div>");
    };
    that.newStack.push(change);
  });
  //Add Listeners here Max!
}
