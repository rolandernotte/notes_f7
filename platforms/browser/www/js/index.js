document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {

    var f7App = new Framework7({
		root: '#app'
	});
	
	var mainView = f7App.views.create('.view-main');
	
	// au chargement de l'application
	// ******************************
	
	// on veut afficher les titres des notes sauvegardées dans localStorage
	// ********************************************************************
	// on vérifie que la clé notes existe dans localStorage et qu'elle contient
	// une valeur significative
	if(localStorage['notes'] != undefined && localStorage['notes'] != ''){
		// on désérialise l'objet JSON stocké
		var objNotes = JSON.parse(localStorage['notes']);
		
		// si l'objet n'est pas vide
		if(! $.isEmptyObject(objNotes)){
			// on parcourt toutes les notes stockées dans l'objet JSON
			for(n in objNotes){
				// on ajoute la note à la liste
				
				// on clone le template
				var newItem = $('#memoList li.template')
								.clone()
								.removeClass('template')
								.show();
								
				// on donne comme texte à l'élément de liste le titre de la note
				$('a',newItem).text(n);
				
				// on ajoute le nouvel élément à la liste
				$('#memoList').append(newItem);
				
				// on cache l'élément 'Aucun mémo'
				$('#noMemo').hide();
				
			}
		}
		
	}	
	
	
	// lorsque l'utilisateur clique sur le bouton 'Ajouter'...
	// *******************************************************
	$('.convert-form-to-data').on('click', function(){
		// on récupère les données du formulaire
		// *************************************
		var formData = f7App.form.convertToData('#addForm');
		// console.log(formData);
		var title = formData.title;
		var memo = formData.memo;
		
		// si le titre n'est pas vide...
		if(title != ''){
			// on ajoute la nouvelle note à la liste
			// *************************************
			
			// on clone le template
			var newItem = $('#memoList li.template')
							.clone()
							.removeClass('template')
							.show();
							
			// on donne comme texte à l'élément de liste le titre de la note
			$('a',newItem).text(title);
			
			// on ajoute le nouvel élément à la liste
			$('#memoList').append(newItem);
			
			// on cache l'élément 'Aucun mémo'
			$('#noMemo').hide();
			
			// on vide les deux inputs
			$("input[name='title']").val('');
			$("input[name='memo']").val('');
			
			// on sauve la note dans localStorage
			// **********************************
			
			// on récupère les notes éventuelles sauvegardées dans localStorage
			// (objet JSON)
			// si la clé note existe dans localStorage et n'est pas vide...
			// (c-à-d si au moins une note est sauvegardée)
			if(localStorage['notes'] != undefined && localStorage['notes'] != ''){
				// on désérialise l'objet JSON stocké
				var objNotes = JSON.parse(localStorage['notes']);
			}
			// s'il n'y a aucune note sauvegardée
			else{
				// on crée un objet vide
				var objNotes = {};
			}
			
			// on ajoute la nouvelle note à l'objet JSON
			objNotes[title] = memo;
			
			// on sauve la version sérialisée de l'objet modifié dans localStorage
			localStorage['notes'] = JSON.stringify(objNotes);
			
		}
		
	})
}