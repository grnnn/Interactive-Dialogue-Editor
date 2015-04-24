//Ask user if they want to make an expression or dialogue
var $container = $("#myContainer");

$container.append("<center><h1>What type of asset do you want to create?</h1></center><hr>"
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
                  +"</div>");

$("#dialogue").on('click', function(){
  window.location = window.location + "?t=dialogue";
  $container.empty();
});
