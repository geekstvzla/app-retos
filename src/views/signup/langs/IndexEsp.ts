export const IndexEsp = {
    alert: {
        error: "Ocurrió un error.",
        success: "Te haz registrado con éxito!. Se te ha enviado un correo para verificar tu cuenta.",
        warning: "El correo ya se encuentra resgistrado!"
    },
    backBtn: "Atrás",
    help: "Si estas viendo este formulario es porque este correo no está registrado en el sistema. Por favor indica el nombre de usuario que usaras dentro del sistema.",
    inputs: {
        email: {
            help: "Con este correo podrás entrar al sistema.",
            label: "Correo electrónico"
        },
        username: {
            help: "Indica el usuario que tendras asociado a tu cuenta por ejemplo: rdiaz2011",
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