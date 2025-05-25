export const esp = {
    address: {
        btn: "Dirección"
    },
    filter: {
        searchAddress: {
            label: "Lugar de búsqueda"
        },
        searchButton: "Buscar",
        searchButtonLoading: "Cargando",
        searchProduct: {
            label: "¿Qué producto buscas?"
        },
        searchType: {
            label: "¿Qué vas hacer?"
        }
    },
    offcanvas: {
        map: {
            address: {
                help: "A medida que vayas escribiendo se te irá sugiriendo direcciones.",
                help2: "Puedes arrastrar el marcador dentro del mapa para mayor precisión.",
                label: "Escribe una dirección o localidad",
                placeholder: "Tipea una dirección o localidad",
                placeholder2: "Dirección"
            },
            alertInfo : `<p>Escribe una dirección y elige una opción en la lista de sugerencias o arrastrar el marcado dentro del mapa a la ubicación deseada.</p>
                         <p><b>Tip:</b> puedes usar ambas opciones para obtener mayor precisión.</p>`,
            apply: "Aplicar"
            
        },
        title: "Indica la ubicación en la que quieres operar"
    },
    title: "¿Qué quieres hacer?",
    validator: {
        alphaNum: "Solo acepta alfanuméricos",
        email: "Formato de correo incorrecto",
        minLength: ((number) => { return `Tiene que tener al menos ${number} caracteres` }),
        noSpecialChars: "Solo se aceptan letras minúsculas, guión, punto y números, sin espacios",
        required: "Este campo es requerido",
        sameAs: ((field) => { return `Debe ser igual a ${field}` })
    }
}

export default esp