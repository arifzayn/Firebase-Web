//---------------------- Profile page -------------------------------------

var database = firebase.database();

createTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  var tname = document.getElementById("name").value;
  var tdescription = document.getElementById("description").value;
  var tstatus = document.getElementById("status").value;
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      var uid = user.uid;

      var postData = {
        name: tname,
        description: tdescription,
        status: tstatus,
        userId: uid,
      };

      firebase.database().ref("task/").push(postData);

      // Hiding the Modal
      $("#exampleModal").modal("hide");
    } else {
      // User is signed out
      // ...
    }
  });
});

//Getting id of clicked row
$("#editModal")
  .modal("hide")
  .on("shown.bs.modal", function (e) {
    var rowID = $(e.relatedTarget).attr("data-id");

    //Get row data into the modal
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        firebase
          .database()
          .ref("task/" + rowID)
          .once("value", (snapshot) => {
            document.getElementById("editName").value = snapshot.val().name;
            document.getElementById(
              "editDescription"
            ).value = snapshot.val().description;
            document.getElementById("editStatus").value = snapshot.val().status;
          });
      } else {
        // No user is signed in.
      }
    });

    //Delete selected row
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        var uid = user.uid;

        btnDeleteTask.addEventListener("click", (e) => {
          firebase
            .database()
            .ref("task/" + rowID)
            .remove();
        });
      } else {
        // No user is signed in.
      }
    });

    //Edit selected row
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        var uid = user.uid;

        btnEditTask.addEventListener("click", (e) => {
          firebase
            .database()
            .ref("task/" + rowID)
            .set({
              name: document.getElementById("editName").value,
              description: document.getElementById("editDescription").value,
              status: document.getElementById("editStatus").value,
              userId: uid,
            });
          console.log("Task Edited!");
        });
      } else {
        // No user is signed in.
      }
    });
  });

//Populating the table
window.onload = function () {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      var uid = user.uid;
      // ...
      firebase
        .database()
        .ref("task/")
        .on("value", (snapshot) => {
          $("#table tbody tr").remove();

          if (snapshot.exists()) {
            var content = "";
            const data = snapshot.val();
            const keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
              const k = keys[i];
              if (data[k].userId === uid) {
                content +=
                  '<tr data-toggle="modal" data-id="' +
                  k +
                  '" data-target="#editModal">';
                content += "<td>" + data[k].name + "</td>";
                content += "<td>" + data[k].description + "</td>";
                content += "<td>" + data[k].status + "</td>";
                content += "</tr>";
              }
            }
            $("#table").append(content);
          }
        });
    } else {
      // User is signed out
      // ...
    }
  });
};
