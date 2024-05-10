export const validatePassword = (password: string) => {
    if (password.length < 6) {
        return {
            message: 'Senha deve ter 6 caracteres ou mais',
            validate: true
        }
    } else {
        return {
            message: '',
            validate: false
        }
    }
}

export const validateQuestionSize = (question: string) => {
    if (question.length > 140) return true; return false;
}

export const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return emailRegex.test(email);
}
