// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCbG7Wm8xVJUGAw0Z2b6B3_WMqCXPY__sk",
    authDomain: "chime-by-roam.firebaseapp.com",
    projectId: "chime-by-roam",
    storageBucket: "chime-by-roam.appspot.com",
    messagingSenderId: "835544794985",
    appId: "1:835544794985:web:64d4f805bda82889f96fdf"
};

// Initialize Firebase App
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

// UI Elements
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const userNameSpan = document.getElementById('user-name');
const postSection = document.getElementById('post-section');
const postInput = document.getElementById('post-input');
const postBtn = document.getElementById('post-btn');
const postsContainer = document.getElementById('posts-container');

// Authentication
loginBtn.addEventListener('click', () => {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            displayUserInfo(user);
        })
        .catch(error => alert(error.message));
});

signupBtn.addEventListener('click', () => {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            displayUserInfo(user);
        })
        .catch(error => alert(error.message));
});

logoutBtn.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            userInfo.style.display = "none";
            postSection.style.display = "none";
            loginBtn.style.display = "inline-block";
            signupBtn.style.display = "inline-block";
        })
        .catch(error => alert(error.message));
});

// Display user info
function displayUserInfo(user) {
    userNameSpan.textContent = user.displayName || user.email;
    userInfo.style.display = "block";
    postSection.style.display = "block";
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
}

// Posting messages
postBtn.addEventListener('click', () => {
    const message = postInput.value;
    if (message.trim()) {
        firestore.collection('posts').add({
            message: message,  // The content of the post
            uid: auth.currentUser.uid,  // User ID of the poster
            timestamp: firebase.firestore.FieldValue.serverTimestamp()  // Timestamp when the post was created
        })
        .then(() => {
            postInput.value = '';  // Clear the input field
            loadPosts();  // Reload the posts
        })
        .catch(error => alert(error.message));  // Handle errors
    }
});

// Load posts from Firestore
function loadPosts() {
    firestore.collection('posts')
        .orderBy('timestamp', 'desc')  // Order by timestamp in descending order (latest posts first)
        .get()
        .then(snapshot => {
            postsContainer.innerHTML = '';  // Clear existing posts
            snapshot.forEach(doc => {
                const post = doc.data();  // Get the data of the current post
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                
                // Get user info (you can customize this to show displayName or email)
                const user = auth.currentUser;
                const userName = user.displayName || user.email;
                
                const postContent = `
                    <p><strong>${userName}</strong> says:</p>
                    <p>${post.message}</p>
                `;
                postElement.innerHTML = postContent;
                postsContainer.appendChild(postElement);  // Append the post to the container
            });
        })
        .catch(error => alert(error.message));  // Handle errors
}

// Listen for authentication state changes
auth.onAuthStateChanged(user => {
    if (user) {
        displayUserInfo(user);
        loadPosts();
    } else {
        userInfo.style.display = "none";
        postSection.style.display = "none";
        loginBtn.style.display = "inline-block";
        signupBtn.style.display = "inline-block";
    }
});
