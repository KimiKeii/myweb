function hideToggleButtons() {
    document.querySelector(".btn-group2").style.display = "none";
}

document.querySelector(".toggle-btn").addEventListener("click", hideToggleButtons);

// Inside your `signup` function, add this logic after setting the section to owner or tenant
function signup(section) {
    // Hide toggle buttons when a section is selected
    hideToggleButtons();
    var username, email, password, confirmPassword;
    
    // Get the appropriate values based on the section (Owner or Tenant)
    if (section === 'owner') {
        username = document.getElementById("owner-username").value;
        email = document.getElementById("owner-email").value;
        password = document.getElementById("owner-password").value;
        confirmPassword = document.getElementById("owner-confirmPassword").value;
    } else if (section === 'tenant') {
        username = document.getElementById("tenant-username").value;
        email = document.getElementById("tenant-email").value;
        password = document.getElementById("tenant-password").value;
        confirmPassword = document.getElementById("tenant-confirmPassword").value;
    }

    var popup = document.getElementById("popup");

    // Remove "invalid" class from inputs and hide popup initially
    document.querySelectorAll("input").forEach(input => input.classList.remove("invalid"));
    popup.classList.add("hidden");

    // Check for valid email
    if (!email.includes("@")) {
        document.getElementById(section + "-email").classList.add("invalid");
        popup.innerText = "Invalid email.";
        popup.classList.remove("hidden");
        setTimeout(() => popup.classList.add("hidden"), 2000);
        document.getElementById(section + "-email").focus();
        return;
    }

    // Check for password match
    if (password !== confirmPassword) {
        document.getElementById(section + "-confirmPassword").classList.add("invalid");
        popup.innerText = "Passwords do not match.";
        popup.classList.remove("hidden");
        setTimeout(() => popup.classList.add("hidden"), 2000);
        document.getElementById(section + "-confirmPassword").focus();
        return;
    }

    // If all checks pass, send data to PHP server
    fetch('http://localhost/save_data.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            popup.innerText = "Signup successful!";
            popup.classList.remove("hidden");
            setTimeout(() => {
                popup.classList.add("hidden");
                // Redirect based on section
                if (section === 'tenant') {
                    window.location.href = "index.html";
                } else if (section === 'owner') {
                    window.location.href = "owner_sub.html";
                }
            }, 1500);
        } else {
            popup.innerText = "Signup failed: " + data.message;
            popup.classList.remove("hidden");
            setTimeout(() => popup.classList.add("hidden"), 3000);
        }
    })
    .catch(error => {
        popup.innerText = "Server error: " + error.message;
        popup.classList.remove("hidden");
        setTimeout(() => popup.classList.add("hidden"), 3000);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // Owner section input fields
    var usernameFieldOwner = document.getElementById("owner-username");
    var emailFieldOwner = document.getElementById("owner-email");
    var passwordFieldOwner = document.getElementById("owner-password");
    var confirmPasswordFieldOwner = document.getElementById("owner-confirmPassword");

    // Tenant section input fields
    var usernameFieldTenant = document.getElementById("tenant-username");
    var emailFieldTenant = document.getElementById("tenant-email");
    var passwordFieldTenant = document.getElementById("tenant-password");
    var confirmPasswordFieldTenant = document.getElementById("tenant-confirmPassword");

    // Owner input Enter key navigation
    usernameFieldOwner.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            emailFieldOwner.focus();
        }
    });
    emailFieldOwner.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            passwordFieldOwner.focus();
        }
    });
    passwordFieldOwner.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            confirmPasswordFieldOwner.focus();
        }
    });
    confirmPasswordFieldOwner.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            signup('owner');
        }
    });

    // Tenant input Enter key navigation
    usernameFieldTenant.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            emailFieldTenant.focus();
        }
    });
    emailFieldTenant.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            passwordFieldTenant.focus();
        }
    });
    passwordFieldTenant.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            confirmPasswordFieldTenant.focus();
        }
    });
    confirmPasswordFieldTenant.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            signup('tenant');
        }
    });

    // Remove invalid class on input for Owner
    emailFieldOwner.addEventListener("input", function() {
        this.classList.remove("invalid");
        document.getElementById("popup").classList.add("hidden");
    });
    confirmPasswordFieldOwner.addEventListener("input", function() {
        this.classList.remove("invalid");
        document.getElementById("popup").classList.add("hidden");
    });

    // Remove invalid class on input for Tenant
    emailFieldTenant.addEventListener("input", function() {
        this.classList.remove("invalid");
        document.getElementById("popup").classList.add("hidden");
    });
    confirmPasswordFieldTenant.addEventListener("input", function() {
        this.classList.remove("invalid");
        document.getElementById("popup").classList.add("hidden");
    });
});

function hideToggleButtons() {
    document.querySelector(".btn-group2").style.display = "none";
    document.querySelector("#owner-section").style.display = "block";
    document.querySelector("#tenant-section").style.display = "none";
}

function hideToggleButtons2() {
    document.querySelector(".btn-group2").style.display = "none";
    document.querySelector("#owner-section").style.display = "none";
    document.querySelector("#tenant-section").style.display = "block";
}

function showToggleButtons() {
    document.querySelector(".btn-group2").style.display = "flex";
    document.querySelector("#owner-section").style.display = "none";
    document.querySelector("#tenant-section").style.display = "none";
}
