<?php
   ini_set('display_errors', '1');
   ini_set('error_reporting', E_ALL);

   $serverName = "ec2-52-24-177-233.us-west-2.compute.amazonaws.com";
   $database = "InteractiveDialogueEditor";
   $port = 3306;

   // Get UID and PWD from application-specific files.
   $uid = file_get_contents('../../../uid.txt');
   $pwd = file_get_contents('../../../pwd.txt');
   $uid = trim($uid);
   $pwd = trim($pwd);

   try {
      // $conn = new PDO( "sqlsrv:server=$serverName,$port;Database = $database", $uid, $pwd);
      $conn = new PDO( "mysql:host=$serverName;port=$port;dbname=$database", $uid, $pwd);
      $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
   }
   catch( PDOException $e ) {
      //print_r($e);
      die( "Error" );
   }

   // Free statement and connection resources.
   $stmt = null;
   $conn = null;

   echo "Success";

?>
