//------------------------------ Sign in -------------------------------

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  var email = document.getElementById("signInEmail").value;
  var password = document.getElementById("signInPassword").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      // Signed in
      // ...
      window.location = "home.html";
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
});

//---------------------------- Sign up ----------------------------------

var database = firebase.database();

(function () {
  "use strict";
  window.addEventListener(
    "load",
    function () {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName("needs-validation");
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener(
          "submit",
          function (event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }

            if (form.checkValidity() === true) {
              event.preventDefault();
              var SignUpName = document.getElementById("SignUpName").value;
              var SignUpContact = document.getElementById("SignUpContact")
                .value;
              var SignUpAddress = document.getElementById("SignUpAddress")
                .value;
              var email = document.getElementById("SignUpEmail").value;
              var password = document.getElementById("SignUpPassword").value;

              firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then((user) => {
                  // Signed in
                  // ...

                  // Hiding the Modal
                  $("#signUpModal").modal("hide");
                  alert("Signed up!");

                  //---------------------- Saving sign up form data to database ------------------------

                  firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                      // User is signed in, see docs for a list of available properties
                      // https://firebase.google.com/docs/reference/js/firebase.User
                      var uid = user.uid;
                      // ...
                      firebase
                        .database()
                        .ref("users/" + uid)
                        .set(
                          {
                            fullName: SignUpName,
                            contact: SignUpContact,
                            address: SignUpAddress,
                            email_signup: email,
                          },
                          (error) => {
                            if (error) {
                              // The write failed...
                              console.log(error);
                            } else {
                              // Data saved successfully!
                              console.log("Data Saved successfully");
                            }
                          }
                        );
                    } else {
                      // User is signed out
                      // ...
                    }
                  });
                })
                .catch((error) => {
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  // ..
                  alert(errorMessage);
                });
            }
            form.classList.add("was-validated");
          },
          false
        );
      });
    },
    false
  );
})();
