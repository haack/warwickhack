$.cookie('test', 'asdf');

setTimeout(function() {
	alert($.cookie('test'));
}, 1000);