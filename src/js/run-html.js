(function(doc){
	'use strict';

	window.addEventListener('load', function(evt) {

		var editor = initAce('editor-html', 'html'),
			editorCSS = initAce('editor-css', 'css'),
			editorJS = initAce('editor-js', 'javascript'),
			form = doc.querySelector('.panel'),
			btnAddResource = doc.querySelector('.btn-add-resource'),
			data = {},
			arrayResources = [];

		//set persistent data
		chrome.storage.sync.get(function(data) {
			if (data.editor) editor.setValue(data.editor, 1);
			
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
		editor.on('input', function(){
			chrome.storage.sync.set({'editor': editor.getValue()})
		});



		//submit handler
		form.addEventListener('submit', function(e) {
			e.preventDefault();
			tagsResources().css

			tagsResources()

			var loc = 'data:text/html, ' + tagsResources().css + tagsResources().js + editor.getValue();
			//var loc = 'data:text/html, ' + editor.getValue();
			chrome.tabs.create({ url: loc});
			
		});
		
		//add resource handler
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

		doc.querySelector('.panel').addEventListener('click', function() {
			var contentFeedback = doc.querySelector('.content-feedback'),
				iconFeedback = doc.querySelector('.icon-feedback');

			if (contentFeedback.classList.contains('active')) {
				contentFeedback.classList.remove('active');
				iconFeedback.classList.remove('active');
			}
		});
	});
	

	function getIndexElement(el, parent) {
		var nodeList = Array.prototype.slice.call(parent.children);
		return nodeList.indexOf(el);

	}
	
	function tagsResources() {
		var anchorRes = doc.querySelectorAll('.list-resources a'),
			i = 0,
			fileName,
			linkTag = '',
			scriptTag = '',
			tagsToAdd = {};

		for (i; i<anchorRes.length; i++) {
			fileName = anchorRes[i].textContent;
			if (getFileExtension(fileName) === 'css') {
				linkTag += '<link rel="stylesheet" href="' + anchorRes[i].href + '"/>'
			} else if (getFileExtension(fileName) === 'js') {
				scriptTag += '<script src="' + anchorRes[i].href + '"></script>'
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
		    editor.getSession().setUseWorker(false);
		    editor.setOptions({
		    	enableBasicAutocompletion: true,
        		enableLiveAutocompletion: true
		    });
		    editor.$blockScrolling = Infinity; //disable console warning;
		return editor;
    }

})(this.document);