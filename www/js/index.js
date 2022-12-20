document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova est initialisé !
	
	// Initialisation de Framework7
	var f7App = new Framework7({
		el: '#app'
	});
	
	// Initialisation de la vue
	var mainView = f7App.views.create('.view-main');


	// au chargement de l'application 

	// on veut afficher les notes présentes dans localStorage

	// on récupères les notes sauvegardées éventuelles
	if(localStorage['notes'] != undefined && localStorage['notes'] != ''){
		objNotes = JSON.parse(localStorage['notes']);

		if(! $.isEmptyObject(objNotes)){
			// on parcourt toutes les notes stockées
			for(n in objNotes){
				// on ajoute la note à la liste

				// on clone le template
				var newItem = $('#memoList li.template')
				.clone()
				.removeClass('template')
				.show();

				// on donne comme texte à ce nouvel élément le titre de la note
				$('a', newItem).text(n);

				// on ajoute le nouvel élément à la liste 
				$('#memoList').append(newItem);
			}
			// on cache l'élément 'aucun mémo'
			$('#noMemo').hide();
		}
	}




	// on récupère les données entrées par l'utilisateur 
	// lorsqu'il clique sur le bouton 'Ajouter'
	$('.convert-form-to-data').on('click', function(){
		var formData = f7App.form.convertToData('#addForm');
		// console.log(formData);
		var title = formData.title;
		var memo = formData.memo;

		// Si le titre n'est pas vide...
		if(title != ''){
			// on ajoute la note à la liste

			// on clone le template
			var newItem = $('#memoList li.template')
							.clone()
							.removeClass('template')
							.show();

			// on donne comme texte à ce nouvel élément le titre de la note
			$('a', newItem).text(title);

			// on ajoute le nouvel élément à la liste 
			$('#memoList').append(newItem);

			// on cache l'élément 'aucun mémo'
			$('#noMemo').hide();

			// on vide les deux inputs
			$("#addForm input[type='text']").val('');

			// on sauve la note dans localStorage
			
			// on récupères les notes sauvegardées éventuelles
			objNotes = {};
			if(localStorage['notes'] != undefined && localStorage['notes'] != ''){
				objNotes = JSON.parse(localStorage['notes']);
			}

			// on ajoute une note à l'objet JSON
			objNotes[title] = memo;

			// on sauve la version sérialisée de l'objet modifié dans localStorage
			localStorage['notes'] = JSON.stringify(objNotes);
			console.log(JSON.stringify(objNotes));


		}
	})

}
