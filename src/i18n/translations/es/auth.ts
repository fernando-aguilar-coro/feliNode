import { Translation } from '../types';

const auth: Translation['auth'] = {
  login: {
    emailRequired: "Por favor ingresa tu correo",
    sendCodeError: "Error al enviar el código",
    codeRequired: "Por favor ingresa el código de 6 dígitos",
    verifyCodeError: "El código es incorrecto o ha expirado",
    loginWithEmail: "Iniciar sesión con Email",
    guestMode: "Modo Invitado",
    titleInitial: "Inicia sesión",
    titleEmail: "Bienvenido",
    titleVerify: "Verificación",
    subtitleInitial: "Aprende inglés de forma fácil y divertida.",
    subtitleEmail: "Inicia sesión con tu correo electrónico",
    subtitleVerify: "Ingresa el código enviado a {{email}}",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "ejemplo@correo.com",
    codeLabel: "Código de verificación",
    codePlaceholder: "123456",
    processing: "Procesando...",
    continueWithEmail: "Continuar con Email",
    verifyAndLogin: "Verificar e Ingresar",
    goBack: "Volver",
    changeEmail: "Cambiar correo",
    googleSignInError: "Error con Google Sign In",
    continueWithGoogle: "Continuar con Google"
  }
};

export default auth;
