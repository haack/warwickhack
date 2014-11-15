var attempt = function() {
	if ($('#username').val() === $('#password').val()) {
		window.location.href = "maintest.html";
	} else {
		alert("incorrect");
	}
}