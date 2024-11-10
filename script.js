import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, storage, db, ref, uploadBytes, getDownloadURL, collection, addDoc, getDocs, query, orderBy, limit } from './firebase.js';

// Registration
function register() {
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPassword").value;

    if (!email || !password) {
        alert("Please fill out all fields.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            document.getElementById("register-success").style.display = "block";
            setTimeout(() => {
                window.location.href = "login.html"; // Redirect to login page
            }, 2000);
        })
        .catch(() => {
            document.getElementById("register-error").style.display = "block";
        });
}

// Login
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill out all fields.");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.location.href = "index.html"; // Redirect to home page
        })
        .catch(() => {
            document.getElementById("login-error").style.display = "block";
        });
}

// Logout
function logout() {
    signOut(auth)
        .then(() => {
            window.location.href = "login.html"; // Redirect to login page
        })
        .catch((error) => {
            console.error("Error logging out:", error);
        });
}

// Video Upload
function uploadVideo() {
    const videoInput = document.getElementById("videoInput");
    const videoFeedback = document.getElementById("video-feedback");

    if (videoInput.files.length === 0) {
        alert("Please choose a video to upload.");
        return;
    }

    const videoFile = videoInput.files[0];
    const videoRef = ref(storage, 'videos/' + videoFile.name);

    videoFeedback.innerHTML = "Uploading video... Please wait.";

    uploadBytes(videoRef, videoFile)
        .then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                videoFeedback.innerHTML = `Video uploaded! <a href="${downloadURL}" target="_blank">View Video</a>`;
            });
        })
        .catch((error) => {
            videoFeedback.innerHTML = "Error uploading video. Please try again.";
        });
}

// Chat System
const messagesRef = collection(db, "messages");

function sendMessage() {
    const messageInput = document.getElementById("chatInput");
    const message = messageInput.value.trim();

    if (message === "") {
        alert("Please type a message.");
        return;
    }

    addDoc(messagesRef, {
        text: message,
        timestamp: new Date()
    })
    .then(() => {
        messageInput.value = ""; // Clear input
        loadMessages(); // Reload messages
    })
    .catch((error) => {
        console.error("Error sending message:", error);
    });
}

function loadMessages() {
    const messagesContainer = document.getElementById("messages");
    messagesContainer.innerHTML = ""; // Clear existing messages

    const q = query(messagesRef, orderBy("timestamp", "desc"), limit(10));

    getDocs(q)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const message = doc.data();
                const messageDiv = document.createElement("div");
                messageDiv.textContent = message.text;
                messagesContainer.appendChild(messageDiv);
            });
        })
        .catch((error) => {
            console.error("Error loading messages:", error);
        });
}

// Load messages when the page loads
window.onload = loadMessages;
