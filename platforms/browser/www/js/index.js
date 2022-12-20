// écouteur de l'évènement deviceready de Cordova
document.addEventListener('deviceready', onDeviceReady, false);

// fonction de callback de l'évènement deviceready
function onDeviceReady(){

    // on utilise le UI framework Framework7  - framework7.io
    // ******************************************************

    // initialisation de Framework7
    var f7App = new Framework7({
        el: '#app',
        // routes
        routes: [
            {
                name: 'details',
                path: '/details/:title',
                url: './pages/details.html'
            }
        ]
    });

    var mainView = f7App.views.create('.view-main');

    // Application
    // ***********
    var NOTEAPP = {

        // initialisation
        // **************
        init: function(){
            // enregistrement des écouteurs
            this.bindings();
            // affichage de la liste des notes mémorisées
            this.displayNotes();
        },

        // récupère les notes présentes dans localStorage
        // et retourne un objet JSON (objet vide si aucune note)
        // *****************************************************
        getNotes: function(){
            // on récupère les notes éventuelles sauvegardées dans localStorage
            // (objet JSON)
            // si la clé 'notes' existe dans localStorage et n'est pas vide...
            // (c-à-d si au moins une note est sauvegardée)
            if(localStorage['notes'] != undefined && localStorage['notes'] != ''){
                // on désérialise l'objet JSON stocké
                var objNotes = JSON.parse(localStorage['notes']);
            }
            // s'il n'y a aucune note sauvegardée
            else{
                var objNotes = {};
            };
            return objNotes;
        },

        // affiche les notes actuellement présentes dans localStorage
        // dans la List View de la page home
        // **********************************************************
        displayNotes: function(){

            // on retire tous les éléments éventuellement présents dans la List View
            // nb: on retire tous les éléments de classe .note afin de ne pas retirer
            // l'élément de classe .template qui doit exister pour pouvoir être dupliqué
            // lorsque l'on ajoute une note à la List View
            $('#memoList li.note').remove();

            // on récupère les notes éventuelles sauvegardées dans localStorage
            // (objet JSON - appel à la méthode getNotes()
            var objNotes = this.getNotes();

            // si l'objet n'est pas vide
            if(! $.isEmptyObject(objNotes)){
                // on parcourt toutes les notes stockées dans l'objet JSON
                // rappel: boucle Javascript for...in parcourt toutes les propriétés d'un objet
                for(n in objNotes){
                    // on ajoute la note à la liste
                    // ****************************

                    // on clone le template
                    var newItem = $('#memoList li.template')
                        .clone()
                        .removeClass('template')
                        // pour différentier un item 'normal' du template
                        .addClass('note')
                        .show();

                    // on donne comme texte à l'élément de liste le tite de la note
                    $('a', newItem).text(n);

                    // on ajoute le nouvel élément à la liste
                    $('#memoList').append(newItem);

                };
                // on cache l'élément 'aucun mémo'
                $('#noMemo').hide();
            }
            else{
                // on affiche l'élément 'aucun mémo'
                // car on n'a aucune note à afficher
                $('#noMemo').show();
            }

        },

        // ajoute une note dans localStorage
        // *********************************
        addNote: function(title, memo) {
            // on récupère les notes sauvegardées dans le localStorage
            var objNotes = this.getNotes();

            // on ajoute une note à l'objet JSON
            objNotes[title] = memo;

            // on sauve la version sérialisée de l'objet modifié dans localStorage
            localStorage['notes'] = JSON.stringify(objNotes);
        },

        // efface une note dans localStorage
        // *********************************
        deleteNote: function(title){
            // on récupère toutes les notes stockées dans localStorage
            // (appel à getNotes())
            
            // on efface la note sélectionnée dans l'objet JSON
            // (on supprime la propriété de l'objet - voir opérateur delete de Javascript)
            
            // on sérialise l'objet JSON modifié et on le sauvegarde dans
            // localStorage
            
        },

        // gestionnaires d'évènements
        // **************************
        bindings: function(){

            // on sauve le contexte de l'application
            // *************************************
            var _noteapp = this;

            // gestionnaire de l'évènement click sur le bouton Ajouter
            // *******************************************************
            $('.convert-form-to-data').on('click', function(){

                // on récupère les données du formulaire
                var formData = f7App.form.convertToData('#addForm');
                var title = formData.title;
                var memo = formData.memo;

                // si le titre de la note n'est pas vide
                if(title != ''){
                    // on stocke la note
                    _noteapp.addNote(title, memo);
                    // on affiche les notes
                    _noteapp.displayNotes();

                    // on vide les deux inputs
                    $("input[name='title']").val('');
                    $("input[name='memo']").val('');

                }

            })

            // gestionnaire de l'évènement click sur un lien de la liste des notes
            // *******************************************************************
            $(document).on('click', '#memoList li', function(){

                // on récupère le titre de la note (texte de l'élément cliqué)
                var title = $('a', this).text();

                // on navique vers la page de détail
                // en transmettant le titre comme paramètre
                mainView.router.navigate({
                    name: 'details',
                    params: {title: title}
                })

            })

            // gestionaire de l'évènement page:init sur la page de détails
            // ***********************************************************
            // (son DOM est prêt à être manipulé)
            $(document).on('page:init', '.page[data-name="details"]',  function(e){

                // on récupère la page (voir aide F7 http://framework7.io/docs/page.html)
                var page = e.detail;

                // on récupère le paramètre title (voir aide F7)
                var title = decodeURIComponent(page.route.params.title);

                // on récupère l'élément racine de la page de détail
                // (voir aide F7)
                var pageDom = page.el;

                // on récupère le contenu de localStorage (toutes les notes stockées)
                var objNotes = _noteapp.getNotes();

                // on récupère le contenu de la note
                var memo = objNotes[title];


                // on injecte title et memo dans le DOM de la page de détail
                $('.page-content .title', pageDom).text(title);
                $('.page-content .memo', pageDom).text(memo);

            })

            // gestionnaire de l'évènement click sur le bouton Effacer de la page de détail
            // ****************************************************************************


        }
    }

    // Initialisation de l'application
    // *******************************
    NOTEAPP.init();

}
