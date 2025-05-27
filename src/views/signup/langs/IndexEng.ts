export const IndexEng = {
    alert: {
        error: "An error occurred.",
        success: "You have successfully registered!. An email has been sent to you to verify your account.",
        warning: "The email is already registered!"
    },
    backBtn: "Back",
    inputs: {
        email: {
            label: "Email"
        },
        username: {
            label: "Username",
            notAvailable: "Usuario no disponible"
            
        }
    },
    signUpBtn: {
        initText: "Register",
        loadingText: "Loading"
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