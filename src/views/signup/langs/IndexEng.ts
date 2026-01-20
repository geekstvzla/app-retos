export const IndexEng = {
    alert: {
        error: "An error occurred.",
        success: "You have successfully registered!. An email has been sent to you to verify your account. ",
        warning: "The email is already registered!"
    },
    backBtn: "Back",
    help: "If you are seeing this form, it's because this email address is not registered in the system. Please provide the username you will use within the system.",
    inputs: {
        email: {
            help: "With this email address you will be able to access the system.",
            label: "Email"
        },
        username: {
            help: "Indicate the username that will be associated with your account, for example:: pwhite2158",
            label: "Username",
            notAvailable: "Usuario no disponible"
        }
    },
    signUpBtn: {
        loadingText: "Loading",
        text: "Register"
    },
    validator: {
        alphaNum: "Accepts only alphanumerics",
        email: "Incorrect email format",
        minLength: ((number) => { return `It must have at least ${number} characters` }),
        required: "Is required",
        noSpecialChars: "Only lowercase letters, hyphen, period and numbers are accepted, without spaces"
    }
}
export default IndexEng