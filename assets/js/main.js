
// access the Iframe
var targetIframe = $('#preview')[0].contentWindow.document;
		targetIframe.open();
		targetIframe.close();


// $(document).ready(function(){
	$("textarea").keydown(function(e) {
	    if(e.keyCode === 9) { // tab was pressed
	        // get caret position/selection
	        var start = this.selectionStart;
	        var end = this.selectionEnd;

	        var $this = $(this);
	        var value = $this.val();

	        // set textarea value to: text before caret + tab + text after caret
	        $this.val(value.substring(0, start) + "\t" + value.substring(end));

	        // put caret at right position again (add one for the tab)
	        this.selectionStart = this.selectionEnd = start + 1;

	        // prevent the default
	        e.preventDefault();
	    }
	});

	// getting input from textarea's

	function getHTML() {
		return $('#html').val();
	}
	function getCSS() {
		return $('#css').val();
	}
	function getJS() {
		return $('#js').val();
	}

	// append input to iframe body
	$('#html').keyup(function() {	
		var html=getHTML();
		$('body',targetIframe).empty();
		$('body',targetIframe).append(html);
	});
	$('#css').keyup(function() {
		$('head',targetIframe).empty();	
		var css='<style>' + getCSS() + '</style>';
		$('head',targetIframe).append(css);
	});

	var jsContent;
	$('#js').keyup(function() {	
		jsContent='<script class="main_js">' + getJS() + '</script>';
	});

	window.setInterval(function(){
	  	if(jsContent!='') {
	  		$('script.main_js',targetIframe).remove();
		 	$('body',targetIframe).append(jsContent); 
		}
	}, 5000);


// });

// modal for settings
function open_settings(cont_type) {
	// show clicked element's modal
	if(cont_type==='html') {
		$('#htmlModal').toggle();
	} else if(cont_type==='css') {
		$('#cssModal').toggle();
	} else if(cont_type==='js') {
		$('#jsModal').toggle();
	}
} 


// prevent form submition
$('.addBtn').on('click',function(e){
	e.preventDefault();
});


// to add meta-tags, title,css,js 
function saveSet(cont_type) {

	if(cont_type==='html') {
		var metaTag = $('#metaTag').val();
		var pageTitle = '<title>' + $('#pageTitle').val() + '</title>';

		// append meta tag and title in haed
		$('head',targetIframe).prepend(pageTitle);
		$('head',targetIframe).prepend(metaTag);

		alert('Added successfully');
		$('#htmlModal').hide();

	} else if(cont_type==='css') {
		
		var cssName = $('#cssItems').find(':selected').text();
		var cssLink = '<link class="' + cssName + '" rel="stylesheet" type="text/css" href="' + $('#cssItems').find(':selected').val() + '">';
		
		$('head',targetIframe).append(cssLink);

		if($('#addedCssItems').html().length) {
			var oldCss = $('#addedCssItems').html();
			$('#addedCssItems').html(oldCss + ' ' + ' <br> ' + ' ' + cssName + '.css is added');
		} else {
			$('#addedCssItems').html(cssName + '.css is added ');
		}
		$('#addedCssItems').show();

	} else if(cont_type==='js') {
		
		var jsName = $('#jsItems').find(':selected').text();
		var jsLink = '<script class="' + jsName + '" src="' + $('#jsItems').find(':selected').val() + '"></script>';
		var oldjs = $('#addedJsItems').html();
		var newMsgJS;

		if(oldjs!='') {
			if(!$('script',targetIframe).hasClass(jsName)){
				$('head',targetIframe).append(jsLink);
				newMsgJS=jsName + '.js is added' + '<br>' + oldjs;
			} else {
				newMsgJS=jsName + '.js is already added' + '<br>' + oldjs;
			}

		} else {
			$('head',targetIframe).append(jsLink);
			newMsgJS = jsName + '.js is added';
		}

		$('#addedJsItems').html(newMsgJS);
		$('#addedJsItems').show();

	}
}


// to remove any added css, js
function removeItems(cont_type) {
	if(cont_type==='css') {

		var cssName = $('#cssItems').find(':selected').text();
		var oldMsgCSS = $('#addedCssItems').html();
		$('.'+cssName,targetIframe).remove();
		$('#addedCssItems').html(oldMsgCSS + ' ' + ' <br> ' + ' ' + cssName + '.css is removed');
		$('#addedCssItems').show();

	} else if(cont_type==='js') {

		var jsName = $('#jsItems').find(':selected').text();
		var oldMsgJS = $('#addedJsItems').html();
		var newMsgJS;

		function noScript() {
			var presentJS = $('head',targetIframe).find('script');
				if(presentJS) 
					return 1;
				else
					return 0;
		}
		if($('script',targetIframe).hasClass(jsName)){
			$('.'+jsName,targetIframe).remove();
			if(oldMsgJS!='') {
				newMsgJS=jsName + '.js is removed' + '<br>' + oldMsgJS;
				if (noScript()) {
					$('#addedJsItems').empty();
				}
			}
			else {
				newMsgJS=jsName + '.js is removed';
				if (noScript()) {
					$('#addedJsItems').empty();
				}
			}
		} else {
			if(oldMsgJS!='') {
				newMsgJS=jsName + '.js is not present' + '<br>' + oldMsgJS;
				if (noScript()) {
					$('#addedJsItems').empty();
				}
			}
			else {
				newMsgJS=jsName + '.js is not present';
				if (noScript()) {
					$('#addedJsItems').empty();
				}
			}
		}

		$('#addedJsItems').html(newMsgJS);
		$('#addedJsItems').show();
	}
}

// export html,css and js files
function exportFiles() {
	// fetch the content of the output iframe
	var serializer = new XMLSerializer();
	var content = serializer.serializeToString(targetIframe);
	var blob = new Blob([content],{type:'text/html;charset=utf-8'});
	saveAs(blob,'index.html');
}






