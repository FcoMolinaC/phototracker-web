
function signOut() {
  firebase.auth().signOut().then(function() {
  	window.open("login.html","_self");
  }).catch(function(error) {
  	return
  });
}

function initApp() {
  document.getElementById('sign-out').addEventListener('click', signOut, false);
}

window.onload = function() {
  initApp();
};