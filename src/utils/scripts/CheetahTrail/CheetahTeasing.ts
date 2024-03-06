import cheetah from "../../../assets/sprites/cheetah/cheetah.webp";


const cheetahTeasing = () => {
    const index = Math.floor(Math.random() * 15);
    switch (index) {
        case 0:{
            const script0 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["De volta à caçada? Espero que desta vez você esteja mais afiado do que as garras de um guepardo."]
                }
            ];
        
            return script0;
        }            
        case 1: {
            const script1 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["Cada retorno é uma chance de ultrapassar seus limites. Pronto para deixar a 'Ignorância' comendo poeira?"]
                }
            ];
        
            return script1;
        }
        case 2:{
            const script2 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["Ah, vejo que o apelo da savana foi mais forte. Vamos ver se sua agilidade cresceu tanto quanto sua determinação."]
                }
            ];
        
            return script2;
        }    
        case 3:{
        const script3 = [
            {
                name: "Cheetah",
                image: cheetah,
                texts: ["Surpreenda-me! Mostre que você pode ser mais ágil do que pensava na última vez que nos encontramos."]
            }
        ];
    
        return script3;
        }
        case 4:{
            const script4 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["A savana não é para os hesitantes. Pronto para correr com os decididos e enfrentar a Ignorância?"]
                }
            ];
        
            return script4;
        }       
        case 5:{
            const script5 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["A 'Ignorância' se espalha enquanto você descansa. Que tal acelerarmos o passo nesta volta?"]
                }
            ];
        
            return script5;
        }    
        case 6:{
            const script6 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["Só os mais adaptáveis sobrevivem aqui. Está preparado para evoluir ou vai ficar para trás novamente?"]
                }
            ];
        
            return script6;
        }    
        case 7:{
        const script7 = [
            {
                name: "Cheetah",
                image: cheetah,
                texts: ["Cada volta é um novo desafio. Está pronto para superar as expectativas, inclusive as suas?"]
            }
        ];
    
        return script7;
        }
        case 8:{
            const script8 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["Espero que tenha voltado com mais fome de sucesso do que nunca. A Savana  não pode esperar!"]
                }
            ];
        
            return script8;
        }     
        case 9:{
            const script9 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["De volta para mais? Excelente. A verdadeira agilidade é insistir, adaptar e superar. Mostre o que aprendeu."]
                }
            ];
        
            return script9;
        }        
        case 10:{
            const script10 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["A Savana testa todos nós, mas só os verdadeiramente ágeis transformam desafios em triunfos. É sua vez."]
                }
            ];
        
            return script10;
        }
        case 11:{
            const script11 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["A 'Ignorância' não tira folga, e nem nós. Vamos aumentar o ritmo e mostrar quem manda nesta savana."]
                }
            ];
        
            return script11;
        }
        case 12:{
            const script12 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["Retornou por mais, hein? A determinação é a primeira etapa. Agora, vamos à ação e à superação."]
                }
            ];
        
            return script12;
        }
        case 13:{
            const script13 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["Vejo um brilho de determinação nos seus olhos. Que isso se traduza em agilidade nos seus passos."]
                }
            ];
        
            return script13;
        }
        default:{
            const script14 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["Aqui estamos novamente. Pronto para provar que sua última saída foi só uma jogada estratégica para distrair a 'Ignorância' ou uma pausa produtiva para recarregar as baterias? Mostre que voltou mais afiado do que nunca!"]
                }
            ];
        
            return script14;
        }
    }
}

export default cheetahTeasing;