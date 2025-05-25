export const eng = {
    address: {
        btn: "Address"
    },
    filter: {
        searchAddress: {
            label: "Search location"
        },
        searchButton: "Search",
        searchButtonLoading: "Loading",
        searchProduct: {
            label: "What product are you looking for?"
        },
        searchType: {
            label: "What're you going to do?"
        }
    },
    offcanvas: {
        map: {
            address: {
                help: "As you type, addresses will be suggested to you.",
                help2: "You can drag the marker inside the map for greater precision.",
                label: "Enter an address or location",
                placeholder: "Type an address or location",
                placeholder2: "Address"
            },
            alertInfo : `<p>Type an address and choose an option from the list of suggestions or drag the marker onto the map to the desired location.</p>
                         <p><b>Tip:</b> You can use both options for greater accuracy.</p>`,
            apply: "Apply"
            
        },
        title: "Indicate the location where you want to operate"
    },
    title: "What do you want to do?",
    validator: {
        alphaNum: "Accepts only alphanumerics",
        email: "Incorrect email format",
        minLength: ((number) => { return `It must have at least ${number} characters` }),
        required: "Este campo es requerido",
        sameAs: ((field) => { return `It must be equal to ${field}` }),
        noSpecialChars: "Only lowercase letters, hyphen, period and numbers are accepted, without spaces"
    }
}

export default eng