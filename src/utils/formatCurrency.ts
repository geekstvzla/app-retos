export const formatCurrency = (value, locale = 'en-US', currency = 'USD', decimals = 2) => {

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals
    }).format(value);

}

export default formatCurrency;
