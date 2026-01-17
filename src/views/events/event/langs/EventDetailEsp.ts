export const EventDetailEsp = {
    confirmEnroll: "<b>Hola {name}</b>, ¿Estás seguro de que quieres inscribirte?",
    enroll: "Inscribirme",
    enrollBtn: {
        defaultText: "Inscribirme",
        loading: 'Cargando'
    },
    formInvalid: "Falta que indique los datos en algunos campos del formulario de inscripción, por favor revise los campos que tienen el <b>borde en rojo</b> y vuelva a intentarlo.",
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