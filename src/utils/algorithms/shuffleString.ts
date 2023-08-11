export const shuffleString = (string: string, difficulty: 'medium' | 'hard') => {
    let text = string;

    switch (difficulty) {
        case 'medium':
            text = text.replaceAll('p', '&');
            text = text.replaceAll('c', '!');
            text = text.replaceAll('f', '@');
            break;

        case 'hard':
            text = text.replaceAll(/[ae]/gi, '&');
            text = text.replaceAll(/[ou]/gi, '@&@');
            text = text.replaceAll(/[pcbf]/gi, '@$');
            text = text.replaceAll(/[0-9]/g, '!...!-!');
            break;
    }

    return text;
}

export const shiftCharacters = (string: string, difficulty: 'medium' | 'hard') => {
    // Função que substitui letras do alfabeto por outro alfabeto que siga alguma regra
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let shiftedAlphabet: string;

    switch (difficulty) {
        case 'medium':
            shiftedAlphabet = 'bcdefghijklmnopqrstuvwxyza'; // Regra de dificuldade média: Substitui por uma letra depois no alfabeto
            break;

        case 'hard':
            shiftedAlphabet = 'qwertyuiopasdfghjklzxcvbnm'; // Regra de dificuldade difícil: Substitui pela ordem das letras do teclado
            break;
    }

    const shiftedString = string.replace(/[a-z]/gi, (match) => {
        const index = alphabet.indexOf(match.toLowerCase());
        const shiftedChar = shiftedAlphabet[index];

        return shiftedChar;
    });

    return shiftedString;
}
