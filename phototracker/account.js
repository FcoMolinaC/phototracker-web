
function signOut() {
    firebase.auth().signOut().then(function() {
        window.open("login.html", "_self");
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

function deleteUser() {
  firebase.auth().currentUser.delete().then(function () {
		window.open("login.html", "_self");
	}).catch(function (error) {
	 	console.error({error})
	})
}

function initApp() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            currentUser();
        } else {}
    });

    document.getElementById('sign-out').addEventListener('click', signOut, false);
    document.getElementById('delete-user').addEventListener('click', deleteUser, false);
}

window.onload = function() {
    initApp();
};