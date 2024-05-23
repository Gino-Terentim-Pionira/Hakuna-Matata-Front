export const validatePassword = (password: string) => {
    if (password.length < 6) {
        return {
            message: 'Senha deve ter 6 caracteres ou mais',
        }
    } else {
        return {
            message: '',
        }
    }
}

export const validateQuestionSize = (question: string) => {
    if (question.length > 140) return true; return false;
}

export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}
