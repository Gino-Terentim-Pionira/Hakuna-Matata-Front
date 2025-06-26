
const FinalChallengeScript = (
    sprite: string,
    name: string,
    remainingStamps: number,
    statusName: string,
    isAvailable: boolean,
    isBlocked: boolean
) => {

    const notAvailable = [
        {
            name,
            image: sprite,
            texts: [
                'Este Desafio Final ainda não está disponível, Viajante.',
                'Sugiro realizar os módulos disponíveis e treinando para poder enfrentar a Ignorância!',
                'Avisaremos quando o Desfio Final estiver disponível para testar tudo o que você aprenderá nesta jornada.'
            ]
        }
    ];

    const notEnoughStamps = [
        {
            name,
            image: sprite,
            texts: [
                `Viajante, você está prestes a alcançar o auge desta jornada! Apenas ${remainingStamps} carimbo${remainingStamps > 1 ? 's' : ''} de ${statusName} te separa${remainingStamps > 1 ? 'm' : ''} do desafio final da nossa trilha e das recompensas que te esperam lá.`,
                `Sua habilidade de ${statusName} te trouxe até aqui, agora mantenha o foco e vamos lá!`
            ],
        },
        {
            name,
            image: sprite,
            texts: [
                `Você está quase lá. ${remainingStamps} carimbo${remainingStamps > 1 ? 's' : ''} de ${statusName} restante${remainingStamps > 1 ? 's' : ''} para poder realizar o desafio final da nossa trilha!`,
                'Este é o momento decisivo. Concentre-se e avance com toda sua força.',
                'Mostre que pode superar a "Ignorância" e conquistar sua recompensa.'
            ],
        }
    ];

    const enoughStamps = [
        {
            name,
            image: sprite,
            texts: [
                'Agora é a hora de mostrar tudo o que aprendeu.',
                'A "Ignorância" está prestes a ser deixada para trás de vez.',
                'Concentre-se e dê o seu melhor!',
                'O desafio final está desbloqueado!'
            ]
        }
    ];

    return !isAvailable ? notAvailable : (
        isBlocked ? [notEnoughStamps[Math.floor(Math.random() * notEnoughStamps.length)]] : enoughStamps
    );
};

export default FinalChallengeScript;
