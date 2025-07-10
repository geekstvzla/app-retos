export const EmailFormEsp = {
    alert: {
        error: {
            emailNoConnction: "¡No se pudo enviar el correo con tu código de acceso, prueba nuevamente!",
            general: "¡Ocurrió un error!"
        }
    },
    getAccessCodeBtn: {
        text: "Solicitar código de acceso",
        loading: "Cargando"
    }, 
    inputs: {
        email: {
            help: "Se le enviará un código de acceso temporal.",
            label: "Correo electrónico"            
        }
    },
    validator: {
        required: "Este campo es requerido"
    }
}

export default EmailFormEsp;