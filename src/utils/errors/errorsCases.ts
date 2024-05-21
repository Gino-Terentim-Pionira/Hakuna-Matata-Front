 export const errorCases = {
  SMALL_PASSWORD_ERROR: 'Essa senha está muito pequena, algum invasor pode adivinhá-la e entrar na Savana!',
  INVALID_NAME_ERROR: 'Temos muitos visitantes na Savana, pode me passar o seu nome e sobrenome?',
  INVALID_EMAIL_ERROR: 'Eu realmente não sei o que é esse tal de "e-mail", mas a sabedoria da Savana me contou que esse e-mail não é válido',
  DIFFERENT_PASSWORDS_ERROR: 'Viajante, as duas senhas que você me passou não são iguais. Poderia confirmá-las por favor?',
  MISSING_FIELDS_ERROR: 'Calma aí, viajante. Parece que você não preencheu todos os campos corretamente!',
  SENDING_EMAIL_PROBLEM_ERROR: 'Viajante, parece que ocorreu um problema para te enviar esse tal de "e-mail". Aqui na Savana não temos isso, tem como você criar seu passaporte novamente?',
  DUPLICATE_EMAIL_ERROR: 'Nunca ouvi falar sobre esse "e-mail", mas sinto que devo lhe informar que esse já esta cadastrado, poderia me informar outro por favor?',
  SERVER_ERROR: 'Parece que ocorreu um erro durante a nossa viagem, Viajante! Vamos tentar novamente!',
  NON_EXISTING_EMAIL_ERROR: 'A Savana me informou que você é novo por aqui, Viajante! Para acessar a Savana, você deve criar o seu passaporte.',
  WRONG_PASSWORD_ERROR: 'Ops, não posso permitir que entre na Savana pois essa não é a sua senha!',
  USER_IS_NOT_CONFIRMED_ERROR: 'Não posso te deixar entrar, seu passaporte ainda não foi confirmado. Olhe seu "email" por favor.',
  FAILED_LOGIN_ERROR: 'Parece que ocorreu um erro durante a nossa viagem, Viajante! Vamos tentar novamente!',
  SUCCESS_CASE_REGISTER: 'Tudo certo! Agora você só precisa "entrar no seu email" para confirmar o passaporte. Não sei o que significa, mas a sabedoria da savana me pediu para lhe dizer isso.',
};

export const editProfileErrorCases: {[key: string]: string} = {
  SUCCES_CASE_EDIT: 'Suas informações do passaporte foram atualizadas, viajante!',
  IMAGE_FORMAT_ERROR: 'Eita, essa sua foto é muito grande viajante! Tente nos enviar uma menor \n (imagens devem ser menores que 5mb e do tipo jpeg, jpg ou png)',
  SERVER_SENDING_IMAGE_ERROR: 'Vish, acredito que nossa camera estragou viajante. Tente tirar sua foto novamente mais tarde!',
  SERVER_USER_DO_NOT_EXIST_ERROR: 'Passaporte não encontrado!',
  SERVER_NAME_ERROR: 'Não esqueça de informar seu nome inteiro, queremos te conhecer!',
  SERVER_BIRTHDAY_ERROR: 'Não esqueça de informar sua data de aniversário, queremos te conhecer!',
  SERVER_USERNAME_ERROR: 'Não esqueça de informar seu nome de usuário, precisamos saber como te chamar!',
  SERVER_ERROR: 'Falha ao atualizar passaporte!',
}