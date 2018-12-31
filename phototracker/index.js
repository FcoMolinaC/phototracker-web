
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

function userTracks() {
	var myUserId = firebase.auth().currentUser.uid;
	var ref = firebase.database().ref(myUserId + '/tracks');
	var tracks = [];
	var name, long, date, type;

	ref.on("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
			var key = childSnapshot.key;
			var childData = childSnapshot.val();
		  //console.log(childData["name"]);
		  tracks.push(childData);

		  //console.log(tracks);
  	});

		var result = "<table width=100%>";
      result += "<thead>";
      result += "<tr>";
      result += "<th>Nombre</th>";
      result += "<th>Distancia</th>";
      result += "<th>Fecha</th>";
      result += "<th>Tipo</th>";
      result += "</tr>";
      result += "</thead>";
      result += "<tbody>";

	    for(var i = 0; i < tracks.length; i++) {
        result += "<tr>";
        result += "<td>"+tracks[i]["name"]+"</td>";
        result += "<td>"+tracks[i]["long"]+"</td>";
        result += "<td>"+tracks[i]["date"]+"</td>";
        result += "<td>"+tracks[i]["type"]+"</td>";
        result += "</tr>";
	    }

      result += "</tbody>";
	    result += "</table>";

		document.getElementById("user-tracks").innerHTML = result;
	});
}

function initApp() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			currentUser();
			userTracks();
		} else {
			// no user
		}
	});

	document.getElementById('sign-out').addEventListener('click', signOut, false);
}

window.onload = function() {
  initApp();
};