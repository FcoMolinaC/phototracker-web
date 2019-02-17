
/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
      alert('Introduce una cuenta de correo válida.');
      return;
    }
    if (password.length < 4) {
      alert('Introduce tu contraseña.');
      return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode === 'auth/wrong-password') {
        alert('Contraseña errónea.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      document.getElementById('quickstart-sign-in').disabled = false;
    });
  }
  document.getElementById('quickstart-sign-in').disabled = true;
}

/**
 * Handles the sign up button press.
 */
function handleSignUp() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  if (email.length < 4) {
    alert('Introduce una cuenta de correo válida.');
    return;
  }
  if (password.length < 4) {
    alert('Introduce una contraseña.');
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;

    if (errorCode == 'auth/weak-password') {
      alert('La contraseña es demasiado corta.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
  });
  alert('Usuario creado, iniciando sesión...');
  window.open("panel.html","_self");
}

function sendPasswordReset() {
  var email = document.getElementById('email').value;

  firebase.auth().sendPasswordResetEmail(email).then(function() {
    alert('Te hemos enviado un email para resetear la contraseña');
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;

    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
  });
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      window.open("panel.html","_self");
    } else {
      document.getElementById('quickstart-sign-in').textContent = 'Iniciar sesión';
    }
    document.getElementById('quickstart-sign-in').disabled = false;
  });

  document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
  document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
  document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
}

window.onload = function() {
  initApp();
};