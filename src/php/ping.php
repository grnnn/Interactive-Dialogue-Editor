<?php
   ini_set('display_errors', '1');
   ini_set('error_reporting', E_ALL);

   $serverName = "interactive-dialogue-editor.chuoohddppdq.us-west-2.rds.amazonaws.com"; //change this
   $database = "InteractiveDialogueDB";
   $port = 3306; //change this

   // Get UID and PWD from application-specific files.
   $uid = file_get_contents('../../../uid.txt');
   $pwd = file_get_contents('../../../pwd.txt');
   $uid = trim($uid);
   $pwd = trim($pwd);

   try {
      // $conn = new PDO( "sqlsrv:server=$serverName,$port;Database = $database", $uid, $pwd);
      $conn = new PDO( "dblib:host=$serverName;dbname=$database", $uid, $pwd);
      $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
   }
   catch( PDOException $e ) {
      print_r($e);
      die( "Error connecting to Interactive Dialogue MySQL Server" );
   }

   // Free statement and connection resources.
   $stmt = null;
   $conn = null;

    print "Sucess!"

?>
