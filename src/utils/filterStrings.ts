const filterStrings = (stringToClear: string) => stringToClear.match(/\d+/g)?.join('');

export default filterStrings;