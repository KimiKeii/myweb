// ============================================================
// Global user data - MUST BE AT THE TOP
// ============================================================
let currentUser = null;
const API_USERS = 'api/users.php';

// ============================================================
// Load logged-in user's data on page load
// ============================================================
window.addEventListener('DOMContentLoaded', function() {
    currentUser = JSON.parse(sessionStorage.getItem('loggedInUser') || 'null');
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update profile name and image
    const profileNameElement = document.querySelector('.profile-name');
    const headerImageElement = document.querySelector('.profile-section img');
    
    if (profileNameElement && currentUser.username) {
        profileNameElement.textContent = currentUser.username;
    }
    
    if (headerImageElement && currentUser.profile_pic) {
        headerImageElement.src = currentUser.profile_pic;
    }
});

// Function to change both content and header title
function loadContent(section) {
    const content = document.querySelector('.content');
    
    // Define different content for each section
    const sections = {
        dashboard: `
            <div class="unit-grid">
                <div class="unit">
                    <img src="Unit1.jpg" class="Unit-img">
                    <h3>001</h3>
                </div>
                <div class="unit">
                    <img src="Unit2.jpg" class="Unit-img">
                    <h3>002</h3>
                </div>
                <div class="unit">
                    <img src="Unit3.jpg" class="Unit-img">
                    <h3>003</h3>
            </div>`,
        tenantInfo: `
            <div class="tenant-wrap">
                <div class="room-info">
                    <span>Room #3</span>
                    <div class="dropdown">
                    <button class="dropdown-toggle">▼</button>
                    <a href="" class="logout">
                            <span class="text-wrapper">
                                <h5 class="logout-name">Room1</h5>
                                <h5 class="logout-name">Room2</h5>
                                <h5 class="logout-name">Room3</h5>
                            </span>
                        </a>
                    </div>
                </div>
                
                <div class="profile-tenant">
                    <img class="tenant-image" src="Emmy.jpg">
                    <div class="profile-info">
                        <h3>Profile</h3>
                        <p><strong>Name:</strong> MANALOTO, EMMANUEL</p>
                        <p><strong>Email:</strong> manalotoeman@gmail.com</p>
                        <p><strong>Phone:</strong> 63+ 956 776 1982</p>
                    </div>
                </div>

                <div class="valid-ids-section">
                    <h4>Valid I.D.'s</h4>
                    <div class="id-card">
                        <img src="Emmyid.jpg" alt="ID Card">
                    </div>
                </div>
            </div>`,
        Transaction: `
            <div class="transaction-wrap">
                <div class="history">
                    <div class="text-header">
                        <p>History</p>
                    </div>
                    <div class="payments">
                        <h3 class="day-text">Today</h3>
                        <div class="payment">
                            <div class="line-with-balls"></div>
                            <div class="money-wrap"><h4 class="money">&#8369; 10,000</h4></div> 
                            <h4>Room 1</h4>
                            <p>Friday</p>
                            <br>
                            <div class="money-wrap"><h4 class="money">&#8369; 10,000</h4></div> 
                            <h4>Room 3</h4>
                            <p>Friday</p>
                            <br>
                        </div>
                        <br>
                        <h3 class="day-text">Last Week</h3>
                        <div class="payment">
                            <div class="line-with-balls2"></div>
                            <div class="money-wrap"><h4 class="money">&#8369; 10,000</h4></div> 
                            <h4>Room 2</h4>
                            <p>Saturday</p>
                            <br>
                            <div class="money-wrap"><h4 class="money">&#8369; 10,000</h4></div> 
                            <h4>Room 5</h4>
                            <p>Monday</p>
                            <br>
                        </div>
                        <h3 class="day-text">Last Month</h3>
                        <div class="payment">
                            <div class="ball"></div>
                            <div class="money-wrap"><h4 class="money">&#8369; 10,000</h4></div> 
                            <h4>Room 1</h4>
                            <p>Monday</p>
                            <br>
                        </div>
                    </div>
                </div>
                <div class="tracking">
                    <div class="text-header">
                        <p>Payment Tracking</p>
                    </div>
                    <div class="people-pay">
                    <div class="day-text2">
                        <span class="arrow">←</span>
                        <span class="people-pay-text">Today</span>
                        <span class="arrow">→</span>
                    </div>
                        <div class="payment">
                            <img src="Profile2-icon.svg" class="tracking-icon-pic">
                            <div class="money-wrap"><h4 class="money2">&#8369; 10,000</h4></div> 
                            <h4>Ayaka</h4>
                            <br>
                            <img src="Profile2-icon.svg" class="tracking-icon2-pic">
                            <div class="money-wrap"><h4 class="money2">&#8369; 10,000</h4></div> 
                            <h4>Kazuha</h4>
                            <br>
                            <img src="Profile2-icon.svg" class="tracking-icon3-pic">
                            <div class="money-wrap"><h4 class="money2">&#8369; 10,000</h4></div> 
                            <h4>Eman</h4>
                            <br>
                            <img src="Profile2-icon.svg" class="tracking-icon4-pic">
                            <div class="money-wrap"><h4 class="money3">- &#8369; 10,000</h4></div> 
                            <h4>Mona</h4>
                            <br>
                            <img src="Profile2-icon.svg" class="tracking-icon5-pic">
                            <div class="money-wrap"><h4 class="money3">- &#8369; 10,000</h4></div> 
                            <h4>Zhongli</h4>
                        </div>
                    </div>
                </div>
            </div>
        `,
        contact: `
        <div class="message-wrap">
            <div class="message-inner"> 
                <div class="profile-icon-wrap">
                    <div class="profile-main-icon"><a href="javascript:void(0);" onclick="loadContent('eman')"><img src="Profile2-icon.svg" class="profile-main-icon-pic"><p>Emanuel</p></a></div>
                    <div class="profile-main-icon2"><a href="javascript:void(0);" onclick="loadContent('paimon')"><img src="Profile2-icon.svg" class="profile-main-icon-pic"><p>Paimon</p></a></div>
                    <div class="profile-main-icon3"><a href="javascript:void(0);" onclick="loadContent('zhongli')"><img src="Profile2-icon.svg" class="profile-main-icon-pic"><p>Zhongli</p></a></div>
                    <div class="profile-main-icon4"><a href="javascript:void(0);" onclick="loadContent('kazuha')"><img src="Profile2-icon.svg" class="profile-main-icon-pic"><p>Kazuha</p></a></div>
                    <div class="profile-main-icon5"><a href="javascript:void(0);" onclick="loadContent('ninguang')"><img src="Profile2-icon.svg" class="profile-main-icon-pic"><p>Ninguang</p></a></div>
                    <div class="profile-main-icon6"><a href="javascript:void(0);" onclick="loadContent('hutao')"><img src="Profile2-icon.svg" class="profile-main-icon-pic"><p>Hutao</p></a></div>
                </div> 
            </div>
        </div>
        `,
        eman: `
            <div class="container-msg">
                <div class="profiles">
                    <div class="profile-icon" onclick="loadContent('paimon')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Paimon</p></a></div>
                    <div class="profile-icon" onclick="loadContent('zhongli')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Zhongli</p></a></div>
                    <div class="profile-icon" onclick="loadContent('kazuha')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Kazuha</p></a></div>
                    <div class="profile-icon" onclick="loadContent('ninguang')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Ninguang</p></a></div>
                    <div class="profile-icon" onclick="loadContent('hutao')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Hutao</p></a></div>
                </div> 

                <div class="message-wrap">
                    <p class="message-name" id="chatName">Emanuel</p>

                <div class="message-inner">
                    <div class="chat-box" id="chatBox"></div>

                        <div class="message">
                            <textarea type="text" class="message-input" id="messageInput" placeholder="Type a message..."></textarea>
                            <button id="sendBtn" onclick="sendMessage()">Send</button>
                        </div>
                    </div>
                </div>
            </div>
            `,
        paimon: `
            <div class="container-msg">
                <div class="profiles">
                        <div class="profile-icon" onclick="loadContent('eman')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Emanuel</p></a></div>
                        <div class="profile-icon" onclick="loadContent('zhongli')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Zhongli</p></a></div>
                        <div class="profile-icon" onclick="loadContent('kazuha')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Kazuha</p></a></div>
                        <div class="profile-icon" onclick="loadContent('ninguang')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Ninguang</p></a></div>
                        <div class="profile-icon" onclick="loadContent('hutao')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Hutao</p></a></div>
                </div> 

                <div class="message-wrap">
                    <p class="message-name" id="chatName">Paimon</p>

                <div class="message-inner">
                    <div class="chat-box" id="chatBox"></div>

                        <div class="message">
                            <textarea type="text" class="message-input" id="messageInput" placeholder="Type a message..."></textarea>
                            <button id="sendBtn" onclick="sendMessage()">Send</button>
                        </div>
                    </div>
                </div>
            </div>
            `,
        zhongli: `
            <div class="container-msg">
                <div class="profiles">
                    <div class="profile-icon" onclick="loadContent('eman')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Emanuel</p></a></div>
                    <div class="profile-icon" onclick="loadContent('paimon')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Paimon</p></a></div>
                    <div class="profile-icon" onclick="loadContent('kazuha')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Kazuha</p></a></div>
                    <div class="profile-icon" onclick="loadContent('ninguang')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Ninguang</p></a></div>
                    <div class="profile-icon" onclick="loadContent('hutao')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Hutao</p></a></div>
                </div> 
                
                <div class="message-wrap">
                    <p class="message-name" id="chatName">Zhongli</p>

                <div class="message-inner">
                    <div class="chat-box" id="chatBox"></div>

                        <div class="message">
                            <textarea type="text" class="message-input" id="messageInput" placeholder="Type a message..."></textarea>
                            <button id="sendBtn" onclick="sendMessage()">Send</button>
                        </div>
                    </div>
                </div>
            </div>
            `,
        kazuha: `
             <div class="container-msg">
                <div class="profiles">
                    <div class="profile-icon" onclick="loadContent('eman')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Emanuel</p></a></div>
                    <div class="profile-icon" onclick="loadContent('paimon')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Paimon</p></a></div>
                    <div class="profile-icon" onclick="loadContent('zhongli')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Zhongli</p></a></div>
                    <div class="profile-icon" onclick="loadContent('ninguang')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Ninguang</p></a></div>
                    <div class="profile-icon" onclick="loadContent('hutao')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Hutao</p></a></div>
                </div> 
                
                <div class="message-wrap">
                    <p class="message-name" id="chatName">Kazuha</p>
    
                <div class="message-inner">
                    <div class="chat-box" id="chatBox"></div>
    
                        <div class="message">
                            <textarea type="text" class="message-input" id="messageInput" placeholder="Type a message..."></textarea>
                            <button id="sendBtn" onclick="sendMessage()">Send</button>
                        </div>
                    </div>
                </div>
            </div>
            `,
        ninguang: `
            <div class="container-msg">
                <div class="profiles">
                    <div class="profile-icon" onclick="loadContent('eman')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Emanuel</p></a></div>
                    <div class="profile-icon" onclick="loadContent('paimon')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Paimon</p></a></div>
                    <div class="profile-icon" onclick="loadContent('zhongli')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Zhongli</p></a></div>
                    <div class="profile-icon" onclick="loadContent('kazuha')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Kazuha</p></a></div>
                    <div class="profile-icon" onclick="loadContent('hutao')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Hutao</p></a></div>
                </div> 
                
                <div class="message-wrap">
                    <p class="message-name" id="chatName">Ninguang</p>

                <div class="message-inner">
                    <div class="chat-box" id="chatBox"></div>

                        <div class="message">
                            <textarea type="text" class="message-input" id="messageInput" placeholder="Type a message..."></textarea>
                            <button id="sendBtn" onclick="sendMessage()">Send</button>
                        </div>
                    </div>
                </div>
            </div>
            `,
        hutao: `
            <div class="container-msg">
                <div class="profiles">
                    <div class="profile-icon" onclick="loadContent('eman')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Emanuel</p></a></div>
                    <div class="profile-icon" onclick="loadContent('paimon')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Paimon</p></a></div>
                    <div class="profile-icon" onclick="loadContent('zhongli')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Zhongli</p></a></div>
                    <div class="profile-icon" onclick="loadContent('kazuha')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Kazuha</p></a></div>
                    <div class="profile-icon" onclick="loadContent('ninguang')"><a href="javascript:void(0);"><img src="Profile2-icon.svg" class="profile-icon-pic"><p>Ninguang</p></a></div>
                </div> 
                
                <div class="message-wrap">
                    <p class="message-name" id="chatName">Hutao</p>

                <div class="message-inner">
                    <div class="chat-box" id="chatBox"></div>

                        <div class="message">
                            <textarea type="text" class="message-input" id="messageInput" placeholder="Type a message..."></textarea>
                            <button id="sendBtn" onclick="sendMessage()">Send</button>
                        </div>
                    </div>
                </div>
            </div>
            `,
        profileSettings: `
            <div class="profile-settings-wrap">
                <h2>Profile Settings</h2>
                
                <div id="successMessage" class="success-message"></div>
                <div id="errorMessage" class="error-message"></div>

                <div class="profile-image-section">
                    <img src="${currentUser?.profile_pic || 'USER.svg'}" 
                        alt="Profile" 
                        class="profile-image-preview" 
                        id="profileImagePreview">
                    <br>
                    <input type="file" id="profileImageInput" accept="image/*">
                    <label for="profileImageInput" class="upload-btn">Choose Image</label>
                </div>

                <div class="form-group">
                    <label for="usernameInput">Username</label>
                    <input type="text" id="usernameInput" 
                        value="${currentUser?.username || ''}" 
                        placeholder="Enter username">
                </div>

                <div class="form-group">
                    <label for="emailInput">Email</label>
                    <input type="email" id="emailInput" 
                        value="${currentUser?.email || ''}" 
                        placeholder="Enter email">
                </div>

                <div class="form-group">
                    <label for="phoneInput">Phone (optional)</label>
                    <input type="text" id="phoneInput" 
                        value="${currentUser?.phone || ''}" 
                        placeholder="Enter phone number">
                </div>

                <button class="save-profile-btn" onclick="saveProfileSettings()">Save Changes</button>

                <div class="change-password-section">
                    <h3>Change Password</h3>
                    <div class="form-group">
                        <label for="currentPasswordInput">Current Password</label>
                        <input type="password" id="currentPasswordInput" placeholder="Enter current password">
                    </div>
                    <div class="form-group">
                        <label for="newPasswordInput">New Password</label>
                        <input type="password" id="newPasswordInput" placeholder="Enter new password (min 6 characters)">
                    </div>
                    <div class="form-group">
                        <label for="confirmPasswordInput">Confirm New Password</label>
                        <input type="password" id="confirmPasswordInput" placeholder="Confirm new password">
                    </div>
                    <button class="change-password-btn" onclick="changePassword()">Change Password</button>
                </div>
            </div>
            `,
    };

    // Update the inner HTML of the content section
    content.innerHTML = sections[section] || '<p>Content not found.</p>';
    
    // Attach events for dynamically loaded sections
    if (section === "profileSettings") {
        const imageInput = document.getElementById("profileImageInput");
        const previewImg = document.getElementById("profileImagePreview");

        if (imageInput && previewImg) {
            imageInput.addEventListener("change", function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        previewImg.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }
}

// Load default content when the page loads
window.onload = function() {
    loadContent('dashboard');
};

document.addEventListener("keydown", function(event) {
    if (event.target.id === "messageInput" && event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

// Send message function
function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value.trim();
    const chatBox = document.getElementById("chatBox");

    if (message !== "") {
        const newMessage = document.createElement("div");
        newMessage.classList.add("message", "user");
        newMessage.textContent = message;

        chatBox.appendChild(newMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        let reply = "";
        if (message.toLowerCase() === "hi"|| message.toLowerCase() === "hello") {
            reply = "Hi, How may I help you?";
        } else if (message.toLowerCase() === "i want to request for maintenance") {
            reply = "Sure I will schedule you right away. We will message you for the updates";
        } else if (message.toLowerCase() === "thank you") {
            reply = "Your Welcome";
        }else {
            reply = "I'm sorry, I didn't understand that.";
        }

        setTimeout(() => {
            const friendMessage = document.createElement("div");
            friendMessage.classList.add("message", "friend");
            friendMessage.textContent = reply;

            chatBox.appendChild(friendMessage);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 600);

        input.value = "";
    }
}

// ============================================================
// Save Profile Settings
// ============================================================
async function saveProfileSettings() {
    const username = document.getElementById('usernameInput').value.trim();
    const email    = document.getElementById('emailInput').value.trim();
    const phone    = document.getElementById('phoneInput').value.trim();
    const imageFile = document.getElementById('profileImageInput').files[0];

    if (!username || !email) {
        showError('Username and email are required.');
        return;
    }

    const formData = new FormData();
    formData.append('user_id', currentUser.id);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('phone', phone);
    
    if (imageFile) {
        formData.append('profile_image', imageFile);
    }

    try {
        const res = await fetch(`${API_USERS}?action=update_profile`, {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (data.success) {
            currentUser = data.user;
            sessionStorage.setItem('loggedInUser', JSON.stringify(currentUser));
            
            document.querySelector('.profile-name').textContent = currentUser.username;
            document.querySelector('.profile-section img').src = currentUser.profile_pic;
            
            showSuccess('Profile updated successfully!');
        } else {
            showError(data.error || 'Failed to update profile.');
        }
    } catch (err) {
        console.error('Profile update error:', err);
        showError('Something went wrong. Please try again.');
    }
}

// ============================================================
// Change Password
// ============================================================
async function changePassword() {
    const currentPassword = document.getElementById('currentPasswordInput').value;
    const newPassword     = document.getElementById('newPasswordInput').value;
    const confirmPassword = document.getElementById('confirmPasswordInput').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showError('All password fields are required.');
        return;
    }

    if (newPassword.length < 6) {
        showError('New password must be at least 6 characters.');
        return;
    }

    if (newPassword !== confirmPassword) {
        showError('New passwords do not match.');
        return;
    }

    try {
        const res = await fetch(`${API_USERS}?action=change_password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                current_password: currentPassword,
                new_password: newPassword
            })
        });

        const data = await res.json();

        if (data.success) {
            showSuccess('Password changed successfully!');
            document.getElementById('currentPasswordInput').value = '';
            document.getElementById('newPasswordInput').value = '';
            document.getElementById('confirmPasswordInput').value = '';
        } else {
            showError(data.error || 'Failed to change password.');
        }
    } catch (err) {
        console.error('Password change error:', err);
        showError('Something went wrong. Please try again.');
    }
}

// ============================================================
// Message helpers
// ============================================================
function showSuccess(message) {
    const el = document.getElementById('successMessage');
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
        const errorEl = document.getElementById('errorMessage');
        if (errorEl) errorEl.style.display = 'none';
        setTimeout(() => el.style.display = 'none', 5000);
    }
}

function showError(message) {
    const el = document.getElementById('errorMessage');
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
        const successEl = document.getElementById('successMessage');
        if (successEl) successEl.style.display = 'none';
    }
}

// ============================================================
// Logout
// ============================================================
function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}