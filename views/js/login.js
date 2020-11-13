var objPeople = [
	{ 
		username: "admin",
		password: "admin"
	},
	{
		username: "polly",
		password: "pizza"
	},
]

function getInfo() {
	var username = document.getElementById('username').value
	var password = document.getElementById('password').value

	for(var i = 0; i < objPeople.length; i++) {
		// check is user input matches username and password of a current index of the objPeople array
		if(username == objPeople[i].username && password == objPeople[i].password) {
			window.location.href = "index.html";
			// stop the function if this is found to be true
			return false
		}
	}
	alert("Incorrect username or password.")
}