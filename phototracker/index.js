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

function userTracks() {
    var myUserId = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref(myUserId + '/tracks');
    var name, long, date, type;

    ref.on("value", function(snapshot) {
        var tracks = [];

        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            tracks.push(childData);
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

        for (var i = 0; i < tracks.length; i++) {
            result += "<tr>";
            result += "<td>" + tracks[i]["name"] + "</td>";
            result += "<td>" + tracks[i]["long"] + "</td>";
            result += "<td>" + tracks[i]["date"] + "</td>";
            result += "<td>" + tracks[i]["type"] + "</td>";
            result += "</tr>";
        }

        result += "</tbody>";
        result += "</table>";

        document.getElementById("user-tracks").innerHTML = result;
        document.getElementById("user-tracks-count").innerHTML = tracks.length;
    });
}

function userPhotos() {
    var myUserId = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref(myUserId + '/photos');

    ref.on("value", function(snapshot) {
        var photos = [];

        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            photos.push(childData);
        });

        var result = "";

        if (typeof photos !== 'undefined' && photos.length > 0) {
            for (var i = 0; i < photos.length; i++) {
                result += "<a href=" + photos[i]["url"] + "><img src=" + photos[i]["url"] + "/></a>";
            }

            document.getElementById("user-photos").innerHTML = result;
            document.getElementById("user-photos-count").innerHTML = photos.length;
        }
    });
}

function initMap() {
    var myUserId = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref(myUserId + '/tracks');
    var name, long, date, type;
    var flightPlanCoordinates;

    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 8,
      center: {lat: 36.855686, lng: -2.418734},
      mapTypeId: 'terrain'
    });

    ref.on("value", function(snapshot) {
        var tracks = [];

        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            tracks.push(childData);
        });

        for (var i = 0; i < tracks.length; i++) {
            console.log(tracks[i]["track"]);
            // flightPlanCoordinates = tracks[i]["track"];
        }
    });

    // var flightPlanCoordinates = [
    //   {lat: 36.855686, lng: -2.418734},
    //   {lat: 36.564789, lng: -2.357899},
    //   {lat: 36.478120, lng: -2.208888},
    //   {lat: 36.322140, lng: -2.201445},
    // ];
    var flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: 'blue',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    flightPath.setMap(map);
}

function initApp() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            initMap();
            currentUser();
            userTracks();
            userPhotos();
        } else {}
    });

    document.getElementById('sign-out').addEventListener('click', signOut, false);
}

window.onload = function() {
    initApp();
};