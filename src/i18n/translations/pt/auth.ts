import { Translation } from '../types';

const auth: Translation['auth'] = {
  login: {
    emailRequired: "Por favor, insira seu e-mail",
    sendCodeError: "Erro ao enviar o código",
    codeRequired: "Por favor, insira o código de 6 dígitos",
    verifyCodeError: "O código está incorreto ou expirou",
    loginWithEmail: "Entrar com E-mail",
    guestMode: "Modo Convidado",
    titleInitial: "Entrar",
    titleEmail: "Bem-vindo",
    titleVerify: "Verificação",
    subtitleInitial: "Aprenda inglês de forma fácil e divertida.",
    subtitleEmail: "Entre com seu endereço de e-mail",
    subtitleVerify: "Insira o código enviado para {{email}}",
    emailLabel: "E-mail",
    emailPlaceholder: "exemplo@email.com",
    codeLabel: "Código de verificação",
    codePlaceholder: "123456",
    processing: "Processando...",
    continueWithEmail: "Continuar com E-mail",
    verifyAndLogin: "Verificar e Entrar",
    goBack: "Voltar",
    changeEmail: "Alterar e-mail",
    googleSignInError: "Erro com o Google Sign In",
    continueWithGoogle: "Continuar com o Google"
  }
};

export default auth;
