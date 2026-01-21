export const IndexEsp = {
    alert: {
        error: "Ocurrió un error.",
        success: "Te haz registrado con éxito!. Se te ha enviado un correo para verificar tu cuenta.",
        warning: "El correo ya se encuentra resgistrado!"
    },
    backBtn: "Atrás",
    help: "Este correo no estás registrado, por favor registrate.",
    inputs: {
        email: {
            help: "Con este correo podrás entrar al sistema.",
            label: "Correo electrónico"
        },
        username: {
            help: "Ejemplo: rdiaz2011, pepe2025, tdiaz",
            label: "Nombre de usuario",
            notAvailable: "Usuario no disponible"
        }
    },
    signUpBtn: {
        loadingText: "Cargando",
        text: "Registrarme"
    },
    validator: {
        alphaNum: "Solo acepta alfanuméricos",
        email: "Formato de correo electrónico incorrecto",
        minLength: `Debe contener al menos {min} caracteres`,
        required: "Este campo es requerido",
        noSpecialChars: "Sólo se aceptan letras minúsculas, guión, punto y números, sin espacios"
    }
}


export default IndexEsp