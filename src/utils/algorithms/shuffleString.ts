export const shuffleString = (string: string, difficulty: 'medium' | 'hard') => {
    let text = string;

    switch (difficulty) {
        case 'medium':
            text = text.replaceAll('i', '&');
            text = text.replaceAll('a', '!');
            text = text.replaceAll('e', '@');
            break;

        case 'hard':
            text = text.replaceAll(/[aei]/gi, '%&');
            text = text.replaceAll(/[ou]/gi, '@&@');
            text = text.replaceAll(/[pcbf]/gi, '@$');
            text = text.replaceAll(/[0-9]/g, '!...!-!');
            break;
    }

    return text;
}
