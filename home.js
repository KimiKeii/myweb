document.querySelectorAll('.link').forEach(link => {
    link.addEventListener('click', function() {
        // Remove active class from all links
        document.querySelectorAll('.link').forEach(item => {
            item.classList.remove('active'); // Remove active state
            item.querySelector('.text-wrapper').style.width = '0'; // Reset text wrapper width
        });

        // Add active class to the clicked link
        this.classList.add('active'); // Set clicked link to active
        this.querySelector('.text-wrapper').style.width = '210px'; // Expand text wrapper
    });

    link.addEventListener('mouseenter', function() {
        if (!this.classList.contains('active')) {
            this.querySelector('.text-wrapper').style.width = '210px';
        }
    });

    link.addEventListener('mouseleave', function() {
        if (!this.classList.contains('active')) {
            this.querySelector('.text-wrapper').style.width = '0';
        }
    });
});


// Optional: Keep the first link active by default
document.querySelector('.link').classList.add('active'); 
document.querySelector('.link .text-wrapper').style.width = '210px';


// Function to change both content and header title
function loadContent(section) {
    const content = document.querySelector('.content'); // Get content div
    const message = document.querySelector('.message-inner'); // Get the message div
    
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
                        <h3>My Profile</h3>
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
                            <div class="money-wrap"><h4 class="money">&#8369; 10,000</h4></div> 
                            <h4>Room 1</h4>
                            <br>
                            <div class="money-wrap"><h4 class="money">&#8369; 10,000</h4></div> 
                            <h4>Room 3</h4>
                            <br>
                            <div class="money-wrap"><h4 class="money">&#8369; 10,000</h4></div> 
                            <h4>Room 7</h4>
                            <br>
                            <div class="money-wrap"><h4 class="money">&#8369; 10,000</h4></div> 
                            <h4>Room 6</h4>
                        </div>
                        <br>
                        <h3 class="day-text">Last Week</h3>
                        <div class="payment">
                            <div class="money-wrap"><h4 class="money">&#8369; 10,000</h4></div> 
                            <h4>Room 2</h4>
                            <br>
                            <div class="money-wrap"><h4 class="money">&#8369; 10,000</h4></div> 
                            <h4>Room 5</h4>
                            <br>
                        </div>
                        <h3 class="day-text">Last Month</h3>
                        <div class="payment">
                            <div class="money-wrap"><h4 class="money">&#8369; 10,000</h4></div> 
                            <h4>Room 1</h4>
                            <br>
                        </div>
                    </div>
                </div>
                <div class="tracking">
                    <div class="text-header">
                        <p>Payment Tracking</p>
                    </div>
                    <div class="people-pay">
                    <h3 class="day-text2">Today</h3>
                        <div class="payment">
                            <div class="money-wrap"><h4 class="money2">&#8369; 10,000</h4></div> 
                            <h4>Ayaka</h4>
                            <br>
                            <div class="money-wrap"><h4 class="money2">&#8369; 10,000</h4></div> 
                            <h4>Kazuha</h4>
                            <br>
                            <div class="money-wrap"><h4 class="money2">&#8369; 100,000</h4></div> 
                            <h4>Ninguang</h4>
                            <br>
                            <div class="money-wrap"><h4 class="money2">&#8369; 10,000</h4></div> 
                            <h4>Eman</h4>
                        </div>
                        <h3 class="day-text2">Not paid</h3>
                        <div class="payment">
                            <div class="money-wrap"><h4 class="money2">- &#8369; 10,000</h4></div> 
                            <h4>Mona</h4>
                            <br>
                            <div class="money-wrap"><h4 class="money2">- &#8369; 10,000</h4></div> 
                            <h4>Zhongli</h4>
                            <br>
                            <div class="money-wrap"><h4 class="money2">- &#8369; 10,000</h4></div> 
                            <h4>Venti</h4>
                            <br>
                            <div class="money-wrap"><h4 class="money2">- &#8369; 10,000</h4></div> 
                            <h4>Paimon</h4>
                        </div>
                    </div>
                </div>
            </div>
        `,
        contact: `
            <div class="profiles">
                <div class="profile-icon"><a onclick="loadContent('eman')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon2"><a onclick="loadContent('paimon')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon3"><a onclick="loadContent('zhongli')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon4"><a onclick="loadContent('kazuha')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon5"><a onclick="loadContent('ninguang')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon6"><a onclick="loadContent('hutao')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
            </div> 
            <div class="message-wrap">
                <div class="message-inner"> 
                    </div>
                    </div>
                    `,
        eman: `
            <div class="profiles">
                <div class="profile-icon" onclick="loadContent('eman')"><a><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon2" onclick="loadContent('paimon')"><a><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon3" onclick="loadContent('zhongli')"><a><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon4" onclick="loadContent('kazuha')"><a><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon5" onclick="loadContent('ninguang')"><a><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon6" onclick="loadContent('hutao')"><a><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
            </div> 

            <!-- Chat Box Section -->
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
            `,
        paimon: `
            <div class="profiles">
                <div class="profile-icon"><a onclick="loadContent('eman')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon2"><a onclick="loadContent('paimon')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon3"><a onclick="loadContent('zhongli')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon4"><a onclick="loadContent('kazuha')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon5"><a onclick="loadContent('ninguang')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon6"><a onclick="loadContent('hutao')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
            </div> 

            <!-- Chat Box Section -->
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
            `,
        zhongli: `
            <div class="profiles">
                <div class="profile-icon"><a onclick="loadContent('eman')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon2"><a onclick="loadContent('paimon')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon3"><a onclick="loadContent('zhongli')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon4"><a onclick="loadContent('kazuha')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon5"><a onclick="loadContent('ninguang')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon6"><a onclick="loadContent('hutao')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
            </div> 
            
            <!-- Chat Box Section -->
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
            `,
        kazuha: `
            <div class="profiles">
                <div class="profile-icon"><a onclick="loadContent('eman')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon2"><a onclick="loadContent('paimon')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon3"><a onclick="loadContent('zhongli')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon4"><a onclick="loadContent('kazuha')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon5"><a onclick="loadContent('ninguang')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon6"><a onclick="loadContent('hutao')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
            </div> 
            
            <!-- Chat Box Section -->
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
            `,
            ninguang: `
            <div class="profiles">
                <div class="profile-icon"><a onclick="loadContent('eman')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon2"><a onclick="loadContent('paimon')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon3"><a onclick="loadContent('zhongli')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon4"><a onclick="loadContent('kazuha')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon5"><a onclick="loadContent('ninguang')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon6"><a onclick="loadContent('hutao')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
            </div> 
            
            <!-- Chat Box Section -->
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
            `,
            hutao: `
            <div class="profiles">
                <div class="profile-icon"><a onclick="loadContent('eman')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon2"><a onclick="loadContent('paimon')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon3"><a onclick="loadContent('zhongli')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon4"><a onclick="loadContent('kazuha')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon5"><a onclick="loadContent('ninguang')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
                <div class="profile-icon6"><a onclick="loadContent('hutao')"><img src="Profile2-icon.svg" class="profile-icon-pic"></a></div>
            </div> 
            
            <!-- Chat Box Section -->
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
            `,
    };

    // Update the inner HTML of the content section
    content.innerHTML = sections[section] || '<p>Content not found.</p>';
}

// Load default content when the page loads
window.onload = function() {
    loadContent('dashboard'); // Load Unit Management by default
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
        // Create user message (aligned right)
        const newMessage = document.createElement("div");
        newMessage.classList.add("message", "user");
        newMessage.textContent = message;

        chatBox.appendChild(newMessage);

        // Scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;

        // Simulate friend response (aligned left)
        setTimeout(() => {
            const friendMessage = document.createElement("div");
            friendMessage.classList.add("message", "friend");
            friendMessage.textContent = `Got your message, ${message}`;

            chatBox.appendChild(friendMessage);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 1500); // Simulated delay for friend reply

        // Clear the input field
        input.value = "";  // This line clears the input field after sending the message
    }
}

  
