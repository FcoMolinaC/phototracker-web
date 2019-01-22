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
    } else {
        console.error("No hay usuario logueado");
    }

    document.getElementById("current-user").innerHTML = email;
}

function userTracks() {
    var myUserId = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref(myUserId + '/tracks');
    var name, long, date, type;

    ref.on("value", function(snapshot) {
        var lines = snapshot.val();
        tracks = Object.keys(lines).map(key => lines[key])

        initMap();

        if (typeof tracks !== 'undefined' && tracks.length > 0) {
            var result = "<table width=100%>";
            result += "<thead>";
            result += "<tr>";
            result += "<th>Nombre</th>";
            result += "<th>Distancia (metros)</th>";
            result += "<th>Fecha</th>";
            result += "<th>Tipo</th>";
            result += "<th>Archivo<span class='text-muted ml-2'>(.gpx)</span></th>";
            result += "</tr>";
            result += "</thead>";
            result += "<tbody>";

            for (var i = 0; i < tracks.length; i++) {
                result += "<tr onclick='trackLoad(rowIndex)'>";
                result += "<td>" + tracks[i]["name"] + "</td>";
                result += "<td>" + tracks[i]["long"] + "</td>";
                result += "<td>" + tracks[i]["date"] + "</td>";
                result += "<td>" + tracks[i]["type"] + "</td>";
                result += "<td><a href='"+ tracks[i]["url"] + "' download class='btn btn-primary' role='button' target='_blank'>Descarga</a></td>";
                result += "</tr>";
            }

            result += "</tbody>";
            result += "</table>";

            document.getElementById("user-tracks").innerHTML = result;
            document.getElementById("user-tracks-count").innerHTML = tracks.length;

        } else {
            document.getElementById("user-tracks").innerHTML = "<p class='text-muted text-center my-5'>Puedes comenzar a grabar tracks desde la app Android</p>";
        }
    });
}

var tracks = [];
var trackZoom = 12;
var flightPath, map, photoMarker;

function trackLoad(rowIndex){
    var tracklong = parseFloat(tracks[rowIndex-1]["long"]);

    if (tracklong >= 20000.00) {
        trackZoom = 13;
    } else if (tracklong >= 10000.00 && tracklong < 20000.00) {
        trackZoom = 15;
    } else if (tracklong >= 1000.00 && tracklong < 10000.00) {
        trackZoom = 18;
    } else {
        trackZoom = 20;
    }

    map.setZoom(trackZoom);

    var trackSelected = tracks[rowIndex-1]["track"];
    if (typeof flightPath !== 'undefined') {
        flightPath.setMap(null);

        if (typeof photoMark !== 'undefined') {
            photoMark.setMap(null);
        }
    }

    var trackLatLng = trackSelected.map(f => {
                return {
                    lat: f.latitude,
                    lng: f.longitude,
                }
            });

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < trackLatLng.length; i++) {
      bounds.extend(trackLatLng[i]);
    }

    flightPath = new google.maps.Polyline({
      path: trackLatLng,
      geodesic: true,
      strokeColor: '#fc4c02',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    map.setCenter(bounds.getCenter());
    flightPath.setMap(map);

    event.stopPropagation();
};

var photos = [];

function userPhotos() {
    var myUserId = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref(myUserId + '/photos');

    ref.on("value", function(snapshot) {
        var images = snapshot.val();
        photos = Object.keys(images).map(key => images[key])

        var result = "";

        if (typeof photos !== 'undefined' && photos.length > 0) {
            for (var i = 0; i < photos.length; i++) {
                result += "<img onclick='photoLoad(" + i + ")' src=" + photos[i]["url"] + "class='img-fluid'>";
            }

            document.getElementById("user-photos").innerHTML = result;
            document.getElementById("user-photos-count").innerHTML = photos.length;
        } else {
            document.getElementById("user-photos").innerHTML = "<p class='text-muted text-center my-5'>Puedes comenzar a hacer fotos desde la app Android</p>";
        }
    });
}

var photoIndex = 1;
var photoMark;

function photoLoad(i){
    photoIndex = i;
    flightPath.setMap(null);

    var photoSelected = photos[i];
    if (typeof photoMark !== 'undefined') {
        photoMark.setMap(null);
    }

    map.setZoom(12);
    map.setCenter({lat: photoSelected['latitude'], lng: photoSelected['longitude']});

    photoMark = new google.maps.Marker({
      position: {lat: photoSelected['latitude'], lng: photoSelected['longitude']},
      map: map,
      title: photoSelected['date']
    });

    event.stopPropagation();
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: {lat: tracks[0]["track"][0]["latitude"], lng: tracks[0]["track"][0]["longitude"]},
      mapTypeId: 'terrain'
    });
    trackLoad(1);
}

function initApp() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            currentUser();
            userTracks();
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
