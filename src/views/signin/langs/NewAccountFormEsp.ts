export const NewAccountFormEsp = {
    alert: {
        error: "Ocurrió un error.",
        success: "Te haz registrado con éxito!. Se te ha enviado un correo para verificar tu cuenta.",
        warning: "El correo ya se encuentra resgistrado!"
    },
    haveAnAccount: "¿Ya tienes una cuenta?",
    inputs: {
        email: {
            label: "Correo electrónico"
        },
        username: {
            label: "Nombre de usuario",
            notAvailable: "Usuario no disponible"
        }
    },
    signIn: "Entrar",
    signUpBtn: {
        initText: "Registrarme",
        loadingText: "Cargando"
    },
    title: "Registro",
    validator: {
        alphaNum: "Solo acepta alfanuméricos",
        email: "Formato de correo electrónico incorrecto",
        minLength: `Debe contener al menos {min} caracteres`,
        required: "Este campo es requerido",
        noSpecialChars: "Sólo se aceptan letras minúsculas, guión, punto y números, sin espacios"
    }
}

export default NewAccountFormEsp;