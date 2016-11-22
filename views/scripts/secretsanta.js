window.addEventListener('DOMContentLoaded', init, false);

function init() {
	uc = document.getElementById("user-container");
	sendBtn = document.getElementById("sendButton");
	idCount = 0;

	sendBtn.addEventListener("click", send);
	document.getElementById("addUserButton").addEventListener("click", addUserField);

	addUserField();
	addUserField();
}

function addUserField() {
	var field = document.createElement("div");
	var name = document.createElement("input");
	var email = document.createElement("input");
	var x = document.createElement("img");

	field.style.marginBottom = ".5em";
	field.id = "user" + idCount;
	idCount++;

	x.src = "/images/x.svg";
	x.alt = "Delete";
	x.className = "delete hidden";

	name.type = "text";
	email.type = "text";
	name.className = "nameField";
	email.className = "emailField";
	name.placeholder = "Name";
	email.placeholder = "Email";

	field.addEventListener("mouseenter", function(e) {
		x.className = "delete";
	});

	field.addEventListener("mouseleave", function(e) {
		x.className = "delete hidden";
	});

	email.addEventListener("focusout", function(e) {
		validateEmail(email, false);
	});

	name.addEventListener("focusout", function(e) {
		validateName(name, false);
	});

	x.addEventListener("click", function(e) {
		uc.removeChild(field);
	});

	field.appendChild(x);
	field.appendChild(name);
	field.appendChild(email);

	uc.appendChild(field);
}

function validateEmail(inputField, force) {
	var emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

	if ((!force && inputField.value == "") || emailRegex.test(inputField.value)) {
		inputField.className = "emailField";
		return true;
	}

	inputField.className = "emailField invalid-input";
	return false;
}

function validateName(inputField, force) {
	if (force && inputField.value == "") {
		inputField.className = "nameField invalid-input";
		return false;
	}

	inputField.className = "nameField";
	return true;
}

function validateAllFields() {
	var userList = [];

	for (var i = 0; i < uc.childNodes.length; i++) {
		var emailField = uc.childNodes[i].getElementsByClassName("emailField")[0];
		var nameField = uc.childNodes[i].getElementsByClassName("nameField")[0];

		var validEmail = validateEmail(emailField, true);
		var validName = validateName(nameField, true);

		if (validEmail && validName) {
			userList.push({"name": nameField.value,
						  "email": emailField.value})
		}
	}
	if (userList.length == uc.childNodes.length) {
		return userList;
	}
	return null;
}

function send() {
	var userList = validateAllFields();

	if (userList) {
		if (userList.length > 1) {
			var xhr = new XMLHttpRequest();

			xhr.open('POST', '/api/secretsanta', true);
			xhr.setRequestHeader('Content-type', 'application/json');
			xhr.onreadystatechange = function() {
			    if(xhr.readyState == 4) {
			    	if (xhr.status == 200) {
			    		alert(xhr.responseText);
			    	} else {
			    		window.alert("There was an error processing your request");
			    	}
			    }
			};
			xhr.send(JSON.stringify(userList));

		} else {
			window.alert("Error: More than one user is required.")
		}
	} else {
		window.alert("Error: You have errors in your fields. Please correct the marked ones and try again.")
	}
}