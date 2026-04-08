function login() {
  var username = document.getElementById("username").value.trim();
  var password = document.getElementById("password").value.trim();
  var usernameField = document.getElementById("username");
  var passwordField = document.getElementById("password");
  var popup = document.getElementById("popup");

  // Clear invalid styling & hide popup
  usernameField.classList.remove("invalid");
  passwordField.classList.remove("invalid");
  popup.classList.add("hidden");

  fetch("http://localhost/login_check.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Login response data:", data); // Debug output

    if (data.success) {
      // Save username and type in localStorage
      localStorage.setItem('loggedInUser', username);
      localStorage.setItem('userType', data.type || '');

      // Redirect based on user type or username
      if (data.type === "owner") {
        window.location.href = "home.html";
      } else if (data.type === "tenant") {
        window.location.href = "user.html";
      } else {
        window.location.href = "default.html"; // fallback page
      }
    } else {
      usernameField.classList.add("invalid");
      passwordField.classList.add("invalid");
      popup.innerText = data.error || "Invalid credentials. Please try again.";
      popup.classList.remove("hidden");
      setTimeout(() => popup.classList.add("hidden"), 3000);
      usernameField.focus();
    }
  })
  .catch(error => {
    console.error("Login error:", error);
    popup.innerText = "Server error. Please try again.";
    popup.classList.remove("hidden");
    setTimeout(() => popup.classList.add("hidden"), 3000);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var usernameField = document.getElementById("username");
  var passwordField = document.getElementById("password");
  var popup = document.getElementById("popup");

  usernameField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      passwordField.focus();
    }
  });

  passwordField.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.querySelector(".login-btn").click();
    }
  });

  usernameField.addEventListener("input", function () {
    this.classList.remove("invalid");
    popup.classList.add("hidden");
  });

  passwordField.addEventListener("input", function () {
    this.classList.remove("invalid");
    popup.classList.add("hidden");
  });
});
