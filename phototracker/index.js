
function signOut() {
	firebase.auth().signOut().then(function() {
		window.open("login.html","_self");
	}).catch(function(error) {
		return
	});
}

function currentUser() {
	var user = firebase.auth().currentUser;
	var name, email, photoUrl, uid, emailVerified;

	if (user != null) {
	  name = user.displayName;
	  email = user.email;
	  photoUrl = user.photoURL;
	  emailVerified = user.emailVerified;
	  uid = user.uid;
	}

	document.getElementById("current-user").innerHTML = email;
}

function initApp() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			currentUser();
		} else {
			// no user
		}
	});

	document.getElementById('sign-out').addEventListener('click', signOut, false);
}

window.onload = function() {
  initApp();
};