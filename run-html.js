(function(doc){
	'use strict';

	window.addEventListener('load', function(evt) {

		var editor = initAce(),
			form = doc.querySelector('form'),
			btnMore = doc.querySelector('.btn-more'),
			data = {};

		//persistent data
		chrome.storage.sync.get(function(data) {
			if (data.editor) editor.setValue(data.editor, 1);
		});

		//updating data
		editor.on('input', function(){
			chrome.storage.sync.set({'editor': editor.getValue()})
		});

		//popup handlers
		form.addEventListener('submit', function(e) {
			e.preventDefault();
			// var loc = 'data:text/html, ' + cssResources + doc.querySelector('.html-code').value + jsResources;
			var loc = 'data:text/html, ' + editor.getValue();
			chrome.tabs.create( { url: loc}, function() {chrome.devtools.inspectedWindow});
			
		});
		
		btnMore.addEventListener('click', function(e) {
			
			e.preventDefault();
			var urlResource = doc.querySelector('#url-resource').value;

		});
		
	});

    function initAce() {
		var editor = ace.edit("editor");
		    editor.setTheme("ace/theme/monokai");
		    editor.getSession().setMode("ace/mode/html");
		    editor.getSession().setUseWorker(false);
		return editor;
    }




})(this.document);