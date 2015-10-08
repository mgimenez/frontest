(function(doc){
	'use strict';

	window.addEventListener('load', function(evt) {

		doc.querySelector('form').addEventListener('submit', function(e) {
			e.preventDefault();
			// var cssResources = '<link rel="stylesheet" href="' + doc.querySelector('#css-resource').value + '"/>';
			// var jsResources = '<script src="' + doc.querySelector('#js-resource').value + '"</script>';
			// var loc = 'data:text/html, ' + cssResources + doc.querySelector('.html-code').value + jsResources;
			var loc = 'data:text/html, ' + doc.querySelector('.html-code').value;
			chrome.tabs.create( { url: loc}, function() {chrome.devtools.inspectedWindow});
			
		});
	});


})(this.document);