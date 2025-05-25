export const sellEsp = {
    amount: {
        label: "Cantidad"
    },
    currency: {
        label: "Moneda"
    },
    map: {
        address: {
            help: "A medida que vayas escribiendo se te irá sugiriendo direcciones.",
            help2: "Puedes arrastrar el marcador dentro del mapa para mayor precisión.",
            label: "Escribe una dirección o localidad",
            placeholder: "Tipea una dirección o localidad",
            placeholder2: "Dirección"
        },
        alertInfo : `<p>A continuación debe elegir una dirección de origen de su producto; puede escribir su dirección 
                     y elegir una opción en la lista de sugerencias o arrastrar el marcado dentro del mapa a la ubicación deseada.</p>
                     <p><b>Tip:</b> puedes usar ambas opciones para obtener mayor precisión.</p>
                     <p class='mb-0'><b>Nota:</b> a los posibles compradores solo se les mostrará un radio aproximado de la ubicación, solo cuando se concrete la compra se mostrará la ubicación real.</p>`
        
    },
    note: "<p>Podrás ofrecer el servicio de transporte una vez se genere una <b>Orden de Compra</b> para adquirir tu producto. Es en la <b>Orden de Compra</b> donde se indica el destino del producto para luego poder calculcar el flete.</p><p class='mb-0'>Se te notificará cuando se genere dicha orden.</p>",
    price: {
        example: "Ejemplo: 1.250.908,80",
        label: "Precio"
    },
    searchProduct: {
        help: "Escribe el nombre del producto que vas a vender",
        label: "Producto"
    },
    sellButton: {
        initText: "Generar orden de venta",
        loadingText: "Cargando"
    },
    title: "¿Qué quieres vender?",
    validator: {
        alphaNum: "Solo acepta alfanuméricos",
        email: "Formato de correo incorrecto",
        minLength: ((number) => { return `Tiene que tener al menos ${number} caracteres` }),
        noSpecialChars: "Solo se aceptan letras minúsculas, guión, punto y números, sin espacios",
        required: "Este campo es requerido",
        sameAs: ((field) => { return `Debe ser igual a ${field}` })
    },
    weighingUnit: {
        label: "Unidad de peso",
        select: "Seleccione"
    }
}

export default sellEsp;