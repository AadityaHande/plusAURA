// /AURAfit/js/auth.js
// ---------------------------
import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

// UI Elements
const loginForm = document.querySelector('#login-form');
const signupForm = document.querySelector('#signup-form');
const googleLoginBtn = document.querySelector('#google-login');
const googleSignupBtn = document.querySelector('#google-signup');

const provider = new GoogleAuthProvider();

// UTIL: show alert
function showError(message) {
  // you can replace with a toast or inline error UI
  alert(message);
}

// LOGIN
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // on success
      window.location.assign('dashboard.html');
    } catch (err) {
      showError(err.message);
    }
  });
}

// SIGNUP
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = signupForm['display-name'].value;
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      // update displayName
      await updateProfile(credential.user, { displayName: name });

      // create Firestore user doc
      await setDoc(doc(db, 'users', credential.user.uid), {
        displayName: name,
        email: credential.user.email,
        createdAt: Date.now()
      });

      window.location.assign('survey.html');
    } catch (err) {
      showError(err.message);
    }
  });
}

// GOOGLE SIGN-IN (shared for both login & signup)
async function handleGoogleRedirect(nextPage) {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // merge Firestore doc
    await setDoc(
      doc(db, 'users', user.uid),
      {
        displayName: user.displayName,
        email: user.email,
        lastLogin: Date.now()
      },
      { merge: true }
    );
    window.location.assign(nextPage);
  } catch (err) {
    showError(err.message);
  }
}

if (googleLoginBtn) {
  googleLoginBtn.addEventListener('click', () => handleGoogleRedirect('dashboard.html'));
}
if (googleSignupBtn) {
  googleSignupBtn.addEventListener('click', () => handleGoogleRedirect('survey.html'));
}

// LOGOUT helper (import & call where needed)
export async function logout() {
  await signOut(auth);
  window.location.assign('login.html');
}
