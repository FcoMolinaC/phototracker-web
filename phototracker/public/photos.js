function signOut() {
    firebase.auth().signOut().then(function() {
        window.open("index.html", "_self");
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
    } else {
        console.error("No hay usuario logueado");
    }

    document.getElementById("current-user").innerHTML = email;
}

var photos = [];

function userPhotos() {
    var myUserId = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref(myUserId + '/photos');

    ref.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            photos.push(childData);
        });

        var result = "";

        if (typeof photos !== 'undefined' && photos.length > 0) {
            for (var i = 0; i < photos.length; i++) {
                result += "<img src=" + photos[i]["url"] + "class='img-fluid'>";
            }

            document.getElementById("user-photos").innerHTML = result;
        } else {
            document.getElementById("user-photos").innerHTML = "<p class='text-muted text-center my-5'>Puedes comenzar a hacer fotos desde la app Android</p>";
        }
    });
}

function initApp() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            currentUser();
            userPhotos();
        } else {
            console.error("No hay usuario logueado");
        }
    });

    document.getElementById('sign-out').addEventListener('click', signOut, false);
}

window.onload = function() {
    initApp();
};
