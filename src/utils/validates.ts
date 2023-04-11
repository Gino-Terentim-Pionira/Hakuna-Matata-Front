export const validatePassword = (password: string) => {
    if (password.length < 6) {
        return {
            message: 'Senha muito pequena',
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
