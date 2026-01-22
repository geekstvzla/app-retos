export const IndexEng = {
    alert: {
        error: "An error occurred.",
        success: "You have successfully registered! An email has been sent to you with a code to activate your account. ",
        warning: "The email is already registered!"
    },
    backBtn: "Back",
    help: "This email address is not registered, please register.",
    inputs: {
        email: {
            help: "With this email address you will be able to access the system.",
            label: "Email"
        },
        username: {
            help: "For example: pwhite2158, 12pop45, rwhite",
            label: "Username",
            notAvailable: "User unavailable"
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