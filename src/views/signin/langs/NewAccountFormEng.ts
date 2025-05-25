export const NewAccountFormEng = {
    alert: {
        error: "An error occurred.",
        success: "You have successfully registered!. An email has been sent to you to verify your account.",
        warning: "The email is already registered!"
    },
    haveAnAccount: "Do you already have an account?",
    inputs: {
        email: {
            label: "Email"
        },
        username: {
            label: "Username",
            notAvailable: "Usuario no disponible"
            
        }
    },
    signIn: "Login",
    signUpBtn: {
        initText: "Register",
        loadingText: "Loading"
    },
    title: "Sign Up",
    validator: {
        alphaNum: "Accepts only alphanumerics",
        email: "Incorrect email format",
        minLength: ((number) => { return `It must have at least ${number} characters` }),
        required: "Is required",
        noSpecialChars: "Only lowercase letters, hyphen, period and numbers are accepted, without spaces"
    }
}

export default NewAccountFormEng;