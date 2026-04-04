import { Translation } from '../types';

const auth: Translation['auth'] = {
  login: {
    emailRequired: "Please enter your email",
    sendCodeError: "Error sending code",
    codeRequired: "Please enter the 6-digit code",
    verifyCodeError: "The code is incorrect or expired",
    loginWithEmail: "Login with Email",
    guestMode: "Guest Mode",
    titleInitial: "Log in",
    titleEmail: "Welcome",
    titleVerify: "Verification",
    subtitleInitial: "Learn English in an easy and fun way.",
    subtitleEmail: "Log in with your email",
    subtitleVerify: "Enter the code sent to {{email}}",
    emailLabel: "Email address",
    emailPlaceholder: "example@email.com",
    codeLabel: "Verification code",
    codePlaceholder: "123456",
    processing: "Processing...",
    continueWithEmail: "Continue with Email",
    verifyAndLogin: "Verify and Log In",
    goBack: "Go back",
    changeEmail: "Change email",
    googleSignInError: "Error with Google Sign In",
    continueWithGoogle: "Continue with Google"
  }
};

export default auth;
