(function(doc){
	'use strict';

	var app = {};

	window.addEventListener('load', function(evt) {

		getResourcesService();

		var editorHTML = initAce('editor-html', 'html'),
			editorCSS = initAce('editor-css', 'css'),
			editorJS = initAce('editor-js', 'javascript'),
			form = doc.querySelector('.panel'),
			btnAddResource = doc.querySelector('.btn-add-resource'),
			//presetResources = doc.querySelector('.include-resources [type="checkbox"]'),
			tabs = doc.querySelector('.tabs'),
			data = {},
			arrayResources = [];

		//set persistent data
		chrome.storage.sync.get(function(data) {
			if (data.editorHTML) editorHTML.setValue(data.editorHTML, 1);
			if (data.editorCSS) editorCSS.setValue(data.editorCSS, 1);
			if (data.editorJS) editorJS.setValue(data.editorJS, 1);
			if (data.activeTab) doc.getElementById(data.activeTab).setAttribute('checked', 'checked');
			if (data.resources) {
				var listRes = doc.querySelector('.list-resources');
				for (var i = 0; i < data.resources.length; i++) {
					var urlRes = data.resources[i];
					addResourceUI(listRes, urlRes, getFileName(urlRes));	
					arrayResources.push(urlRes);
				}


			} 
		});

		//updating persistent data
		editorHTML.on('input', function(){
			chrome.storage.sync.set({'editorHTML': editorHTML.getValue()})
		});

		editorCSS.on('input', function(){
			chrome.storage.sync.set({'editorCSS': editorCSS.getValue()})
		});

		editorJS.on('input', function(){
			chrome.storage.sync.set({'editorJS': editorJS.getValue()})
		});



		//submit handler
		form.addEventListener('submit', function(e) {
			e.preventDefault();

			var loc = 'data:text/html, ' + 
				tagsResources().css + 
				'<style>' + editorCSS.getValue() + '</style>' + 
				editorHTML.getValue() + 
				tagsResources().js + 
				'<script>' + editorJS.getValue() +'</script>';

			chrome.tabs.create({ url: loc});

		});
		
		// add preset resource handler
		// presetResources.addEventListener('change', function(e) {
		// 	var urlResource = getPresetResourceUrl(e.target.getAttribute('value'));
		// 	if(e.target.checked) {
		// 		if (urlResource.css !== 'undefined') arrayResources.push(urlResource.css);
		// 		if (urlResource.js !== 'undefined') arrayResources.push(urlResource.js);
		// 		chrome.storage.sync.set({'resources': arrayResources})
		// 	}
		// });

		//add url resource handler
		btnAddResource.addEventListener('click', function(e) {
			e.preventDefault();
			var urlRes = doc.querySelector('#url-resource'),
				valRes = urlRes.value,
				listRes = doc.querySelector('.list-resources');

			if (validURL(valRes)) {
				urlRes.classList.remove('error');
				urlRes.value = '';
				
				addResourceUI(listRes, valRes, getFileName(valRes));
				arrayResources.push(valRes);
				chrome.storage.sync.set({'resources': arrayResources})

			} else {
				urlRes.classList.add('error');
			}

		});

		//remove resource handler
    	doc.querySelector('.list-resources').addEventListener('click', function(e) {
			if (e.target.tagName === 'SPAN') {
				var indexEl = getIndexElement(e.target.parentElement, this);
				e.target.parentElement.remove();
				if(indexEl != -1) {
					arrayResources.splice(indexEl, 1);
					chrome.storage.sync.set({'resources': arrayResources})
				}
			}
		});
		
		doc.querySelector('.icon-feedback').addEventListener('click', function(e) {
			e.preventDefault();
			var contentFeedback = doc.querySelector('.content-feedback'),
				iconFeedback = doc.querySelector('.icon-feedback');

			if (contentFeedback.classList.contains('active')) {
				contentFeedback.classList.remove('active');
				iconFeedback.classList.remove('active');
			} else {
				contentFeedback.classList.add('active');
				iconFeedback.classList.add('active');
			}
		});
		
		doc.querySelector('.form-feedback').addEventListener('submit', function(e) {
			e.preventDefault();
			var stringFeedback = doc.querySelector('[name="entry.430085320"]').value,
				thankFeedback = doc.querySelector('.thank-feedback'),
				request = new XMLHttpRequest();
				
			request.open('POST', 'https://docs.google.com/forms/d/1Q1MJW8D2ft1LmLt7JouuoZdJsfD2KT8YB4SR4_w4vGI/formResponse', true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			request.send('entry.430085320=' + stringFeedback);
			thankFeedback.classList.add('active');
			
			setTimeout(function(){
				doc.querySelector('.content-feedback').classList.remove('active');
				thankFeedback.classList.remove('active');
			}, 2000);


		});

		tabs.addEventListener('change', function(e) {
			var editor = doc.getElementById('editor-' + e.target.getAttribute('data-lang'));
			editor.querySelector('textarea').focus();
			chrome.storage.sync.set({'activeTab': e.target.id});
		});
	});
	
	function getResourcesService() {
		var xmlhttp = new XMLHttpRequest(),
			url = "../services/resources.json";

		xmlhttp.onreadystatechange=function() {
		    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		        app.dataResources = JSON.parse(xmlhttp.responseText);
		    }
		}
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}

	function getIndexElement(el, parent) {
		var nodeList = Array.prototype.slice.call(parent.children);
		return nodeList.indexOf(el);
	}

	function getResourcesList() {
		var i = 0,
			j = 0,
			addedResources = doc.querySelectorAll('.list-resources a'),
			includes = doc.querySelectorAll('.include-resources [type="checkbox"]:checked'),
			resources = [],
			resource;

		for (j; j < includes.length; j++) {
			resource = getPresetResourceUrl(includes[j].getAttribute('value'));
			if (resource.css !== undefined) {
				resources.push(resource.css);
			}
			if (resource.js !== undefined) {
				resources.push(resource.js);
			}
		}
		
		for (i; i<addedResources.length; i++) {
			resources.push(addedResources[i].href);
		}

		return resources;
	}

	function getPresetResourceUrl(value) {
		return app.dataResources[value];
	}

	function tagsResources() {
		var i = 0,
			linkTag = '',
			scriptTag = '',
			tagsToAdd = {},
			resources = getResourcesList();

		for (i; i<resources.length; i++) {
			if (getFileExtension(resources[i]) === 'css') {
				linkTag += '<link rel="stylesheet" href="' + resources[i] + '"/>'
			} else if (getFileExtension(resources[i]) === 'js') {
				scriptTag += '<script src="' + resources[i] + '"></script>'
			}
		}

		return {
			css: linkTag,
			js: scriptTag
		}
	}

	function addResourceUI(parent, url, file) {
		var li = doc.createElement('li'),
			anchor = doc.createElement('a'),
			span = doc.createElement('span');

		anchor.setAttribute('href', url);
		anchor.setAttribute('target', '_blank');

		span.textContent = 'x';
		anchor.textContent = file;

		li.appendChild(anchor);
		li.appendChild(span);
		parent.appendChild(li);
	}

	/**
	 * Valid URL resource
	 * @argument: str (String)
	 * @returns: boolean
	 */
	function validURL(str) {
	    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		
		if(!pattern.test(str)) {
	    	return false;
	  	} else {
	  		var fileName = str.split('/').pop(-1),
	  			regexFileExtension = new RegExp("(.*?)\.(js|css)$");

	  		if (!regexFileExtension.test(fileName)) {
	  			return false
	  		} else {
	  			return true
	  		}
	  	}
	}

	function getFileName(url) {
		return url.split('/').pop(-1);
	}

	function getFileExtension(fileName) {
		return fileName.split('.').pop(-1);
	}
	
    function initAce(elemId, language) {
    	ace.require("ace/ext/language_tools");
		var editor = ace.edit(elemId);
		    editor.setTheme("ace/theme/monokai");
		    editor.getSession().setMode("ace/mode/" + language);
		    editor.getSession().setUseWorker(true);
		    editor.setOptions({
		    	enableBasicAutocompletion: true,
        		enableLiveAutocompletion: true
		    });
		    editor.$blockScrolling = Infinity; //disable console warning;
		return editor;
    }

    window.app = app;

})(this.document);