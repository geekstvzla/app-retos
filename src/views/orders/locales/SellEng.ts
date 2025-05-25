export const sellEng = {
    amount: {
        label: "Amount"
    },
    currency: {
        label: "Currency"
    },
    map: {
        address: {
            help: "As you type, addresses will be suggested to you.",
            help2: "You can drag the marker inside the map for greater precision.",
            label: "Enter an address or location",
            placeholder: "Type an address or location",
            placeholder2: "Address"
        },
        alertInfo : `<p>Next you need to choose a shipping address for your product; you can type your address 
                     and choose an option from the list of suggestions or drag the marker inside the map to the desired location.</p>
                     <p><b>Tip:</b> You can use both options for greater accuracy.</p>
                     <p class='mb-0'><b>Note:</b> Potential buyers will only be shown an approximate radius of the location, only when the purchase is completed will the actual location be shown.</p>`
        
    },
    note: "When someone generates a <b>Purchase Order</b> to acquire your product, you will be able to indicate the freight price in case you wish to offer the transportation service, since the Purchase Order indicates the destination of the product.",
    price: {
        example: "Example: 1.250.908,80",
        label: "Price"
    },
    searchProduct: {
        help: "Write the name of the product you are going to sell",
        label: "Product"
    },
    sellButton: {
        initText: "Generate sell order",
        loadingText: "Loading"
    },
    title: "What do you want to sell?",
    validator: {
        alphaNum: "Accepts only alphanumerics",
        email: "Incorrect email format",
        minLength: ((number) => { return `It must have at least ${number} characters` }),
        required: "Is required",
        sameAs: ((field) => { return `It must be equal to ${field}` }),
        noSpecialChars: "Only lowercase letters, hyphen, period and numbers are accepted, without spaces"
    },
    weighingUnit: {
        label: "Weight unit",
        select: "Select"
    }
}

export default sellEng;