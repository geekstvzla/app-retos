export const EventDetailEng = {
    confirmEnroll: "<b>Hi {name}</b>, Are you sure you want to enroll?",
    enrollBtn: {
        defaultText: "Enroll me",
        loading: 'Loading'
    },
    formInvalid: "You are missing information in some fields of the registration form. Please check the fields with the <b>red border</b> and try again.",
    validator: {
        alphaNum: "Accepts only alphanumerics",
        email: "Incorrect email format",
        minLength: ((number) => { return `It must have at least ${number} characters` }),
        required: "Is required",
        sameAs: ((field) => { return `It must be equal to ${field}` }),
        noSpecialChars: "Only lowercase letters, hyphen, period and numbers are accepted, without spaces"
    },
    whatsappGroup: "Join the WhatsApp group"
}

export default EventDetailEng;