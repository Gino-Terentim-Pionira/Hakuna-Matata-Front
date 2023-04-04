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