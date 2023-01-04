 export const errorCases = {
  SMALL_PASSWORD_ERROR: 'Senha muito pequena',
  INVALID_NAME_ERROR: 'Escreva um nome válido',
  INVALID_EMAIL_ERROR: 'Formato de e-mail inválido',
  DIFFERENT_PASSWORDS_ERROR: 'Por favor, coloque as mesmas senhas',
  MISSING_FIELDS_ERROR: 'Calma aí, viajante. Parece que você não preencheu todos os campos corretamente!',
  SENDING_EMAIL_PROBLEM_ERROR: 'Ocorreu um erro ao enviar o email, tente criar a conta novamente!',
  DUPLICATE_EMAIL_ERROR: 'Esse e-mail já está em uso, utilize outro ou faça login com o o existente',
  SERVER_ERROR: 'Parece que ocorreu um erro durante a nossa viagem, Jovem! tente recarregar!',
  NON_EXISTING_EMAIL_ERROR: 'Ops! Você é novo por aqui? Parece que esse endereço de email ainda não existe na savana!',
  WRONG_PASSWORD_ERROR: 'Ops, não posso permitir que entre na savana pois essa não é a sua senha!',
  USER_IS_NOT_CONFIRMED_ERROR: 'Usuário não confirmado!',
  FAILED_LOGIN_ERROR: 'Login falhou!',
  SUCCESS_CASE_REGISTER: 'Prontinho, agora a Savana possui o seu cadastro. Por favor cheque o seu email para confirmá-lo!',
};

export const editProfileErrorCases: {[key: string]: string} = {
  SUCCES_CASE_EDIT: 'Suas informações foram atualizadas, viajante!',
  IMAGE_FORMAT_ERROR: 'Ops! É só permitido imagens menores que 5Mb. \n E que sejam jpeg, jpg ou png!',
  SERVER_SENDING_IMAGE_ERROR: 'Vish, acredito que nossa camera estragou viajante. Tente tirar sua foto novamente mais tarde!',
  SERVER_USER_DO_NOT_EXIST_ERROR: 'Usuário não encontrado!',
  SERVER_NAME_ERROR: 'Não esqueça de informar seu nome inteiro, queremos te conhecer!',
  SERVER_BIRTHDAY_ERROR: 'Não esqueça de informar sua data de aniversário, queremos te conhecer!',
  SERVER_USERNAME_ERROR: 'Não esqueça de informar seu nome de usuário, precisamos saber como te chamar!',
  SERVER_ERROR: 'Falha ao atualizar usuário!',
}