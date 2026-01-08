export const EventDetailEsp = {
    confirmEnroll: "<b>¿Estás seguro de que quieres inscribirte?</b>",
    enroll: "Inscribirme",
    validator: {
        alphaNum: "Solo acepta alfanuméricos",
        email: "Formato de correo incorrecto",
        minLength: ((number) => { return `Tiene que tener al menos ${number} caracteres` }),
        noSpecialChars: "Solo se aceptan letras minúsculas, guión, punto y números, sin espacios",
        required: "Este campo es requerido",
        sameAs: ((field) => { return `Debe ser igual a ${field}` })
    }
}

export default EventDetailEsp;