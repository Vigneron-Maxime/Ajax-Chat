<?php
/* PDO database connection */
try
{
	/* Actual connection */
	$PDO = new PDO('mysql:host=localhost;dbname=chat', 'root',  '');
	
	$PDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$PDO->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
}
catch (PDOException $e)
{
	/* If there is an error an exception is thrown */
	pdo_exception($e);
}

$task = "read";

//Si la variable task est passée en url
if(array_key_exists("task", $_GET)){
	$task = $_GET['task'];
}

if($task == "write"){
	postMessage();
}else{
	getMessages();
}

function getMessages(){

	//Pour accéder à la variable dans une fonction
	global $PDO;


	//Selectionne les 20 derniers messages dans un ordre décroissant et encode en json le résultat pour faciliter le traitement en javascript
	$resultats = $PDO->query("SELECT * FROM messages ORDER BY created_at DESC LIMIT 20");
	$messages = $resultats->fetchAll();
	echo json_encode($messages);
}

function postMessage(){

	global $PDO;

//Si l'un des deux champs n'est pas rempli, envoie une erreur encodé json
if(empty($_POST['author']) || empty($_POST['content'])){
	echo json_encode(["status" => "error", "message" => "Un des champ n'a pas ete rempli"]);
	return;
}
	$author = $_POST['author'];
	$content = $_POST['content'];

	//Insère en BDD le message ainsi que le pseudo de l'utilistateur et envoie un message de confirmation encodé en json
	$query = $PDO->prepare('INSERT INTO messages SET author = :author, content = :content, created_at = NOW()');
	$query->execute(["author" => $author, "content" => $content]);
	echo json_encode(["status" => "success"]);
}

?>