(function(doc){
	'use strict';

	window.addEventListener('load', function(evt) {

		var form = doc.querySelector('form'),
			data = {};

		form.addEventListener('submit', function(e) {
			e.preventDefault();
			// var cssResources = '<link rel="stylesheet" href="' + doc.querySelector('#css-resource').value + '"/>';
			// var jsResources = '<script src="' + doc.querySelector('#js-resource').value + '"</script>';
			// var loc = 'data:text/html, ' + cssResources + doc.querySelector('.html-code').value + jsResources;
			var loc = 'data:text/html, ' + doc.querySelector('.html-code').value;
			chrome.tabs.create( { url: loc}, function() {chrome.devtools.inspectedWindow});
			
		});

		form.addEventListener('focus', function(e) {
			var currentFocus = e.target,
				name = currentFocus.name;

			form.addEventListener('keypress', function(e) {
				data[name] = currentFocus.value;

			});

		});
	});


	chrome.storage.sync.set({'value': 'theValue'}, function() {
      // Notify that we saved.
      console.log('ok!');
    });

    chrome.storage.sync.get('value', function(data) {
    	console.log(data.value);
    })




})(this.document);