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
