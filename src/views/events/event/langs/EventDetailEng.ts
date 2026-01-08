export const EventDetailEng = {
    confirmEnroll: "<b>Are you sure you want to enroll?</b>",
    enroll: "Enroll me",
    validator: {
        alphaNum: "Accepts only alphanumerics",
        email: "Incorrect email format",
        minLength: ((number) => { return `It must have at least ${number} characters` }),
        required: "Is required",
        sameAs: ((field) => { return `It must be equal to ${field}` }),
        noSpecialChars: "Only lowercase letters, hyphen, period and numbers are accepted, without spaces"
    }
}

export default EventDetailEng;