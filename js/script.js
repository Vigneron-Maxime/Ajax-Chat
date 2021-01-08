function getMessages(){

	const AjaxRequest = new XMLHttpRequest();
	AjaxRequest.open("GET", "requete_sql.php"); //Execute la fichier PHP en GET
	AjaxRequest.onload = function(){ //Lorsque l'execution du fichier PHP se termine:
		const resultat = JSON.parse(AjaxRequest.responseText); //Récupère la réponse envoyer par le fichier PHP,
		//parse converti la chaine de caractère renvoyer en objet, plus facilement exploitable
		const html = resultat.reverse().map(function(message){//Applique le format html suivant à chaque objets du tableau (map)
			//Reverse permet d'inverser l'ordre d'affichage
			return `
				  <div class="message">
  				<span class="date fst-italic">${message.created_at.substring(11, 16)}</span>
  				<span class="author fw-bold">${message.author}:</span>
  				<span class="content">${message.content}</span>
  				</div>
					`
		}).join('');//Joint chaque chaque objet transformé en une seule chaine de caractère 

		//Selectionne la zone d'affiche et affiche la trame HTML et pousse la scrollbar vers le bas
		const messages = document.querySelector('.messages');

		messages.innerHTML = html;
		messages.scrollTop = messages.scrollHeight;

	}
	//Envoie la requête Ajax
	AjaxRequest.send();

}

function postMessage(event){

	event.preventDefault();
	emptyError(); //Vide la zone Html d'affichage du message d'erreur
	const author = document.querySelector('#author');
	const content = document.querySelector('#content');

	//Conditionne les donné du formulaire afin de pouvoir les envoyer en AJAX
	const data = new FormData();
	data.append('author', author.value);
	data.append('content', content.value);

	const AjaxRequest = new XMLHttpRequest();
	AjaxRequest.open('POST', 'requete_sql.php?task=write'); //Execute la fichier PHP en POST avec task=write en URL
	AjaxRequest.onload = function(){//Lorsque l'execution du fichier PHP se termine, affiche le message
	const resultat = JSON.parse(AjaxRequest.response); //Récupère la réponse du fichier PHP
	if(resultat.status == "error"){ //Si le fichier PHP a renvoyé une erreur
		//Affiche un message d'erreur dans la div selectionné
		error_div.classList.remove('d-none');
		error_div.classList.add('d-block');
		error_div.innerHTML = resultat.message;
		const interval = window.setInterval(emptyError, 5000);
	}else{
		content.value = '';//Vide la zone texte
		content.focus();//Place la souris dans la zone texte
		getMessages();
	}
	}
	AjaxRequest.send(data); //Envoie data au fichier PHP
}

//Fonction pour vider la zone d'erreur au bout de 5 secondes
function emptyError(){
	error_div.classList.remove('d-block');
	error_div.classList.add('d-none');
	error_div.innerHTML = '';
}


//Execute la fonction postMessage lorsque l'on appuie sur le bouton envoyer
document.querySelector('form').addEventListener('submit', postMessage);
var error_div = document.querySelector('.error');

const interval2 = window.setInterval(getMessages, 1000);//Execute la fonction getMessages toutes les secondes
getMessages();//Execute la fonction getMessage dès le chargement du fichier js