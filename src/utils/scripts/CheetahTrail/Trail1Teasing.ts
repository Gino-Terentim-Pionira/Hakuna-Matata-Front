import cheetah from "../../../assets/sprites/cheetah/cheetah.png";


const trail1Teasing = async (index:number) => {
    
    switch (index) {
        case 0:{
            const script0 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["Vamo lá filhote. Se você se descuidar, vai comer poeira!"]
                }
            ];
        
            return script0;
        }            
        case 1: {
            const script1 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["Simbora filhote, a ignorância não vai se derrotar sozinha"]
                }
            ];
        
            return script1;
        }
        case 2:{
            const script2 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["E ai filhote, bora correr atrás do progresso!"]
                }
            ];
        
            return script2;
        }    
        case 3:{
        const script3 = [
            {
                name: "Cheetah",
                image: cheetah,
                texts: ["Vamos lá filhote, não vai perder o ritmo logo agora né?"]
            }
        ];
    
        return script3;
        }
        case 4:{
            const script4 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["Continue em frente, sempre avançando. Não pise no freio!"]
                }
            ];
        
            return script4;
        }       
        case 5:{
            const script5 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["Não desista nunca! Não podemos deixar passar essa chance de alcançar a “Ignorância”!"]
                }
            ];
        
            return script5;
        }    
        case 6:{
            const script6 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["Aí, anda logo, a “Ignorância” não vai ser combater sozinha"]
                }
            ];
        
            return script6;
        }    
        case 7:{
        const script7 = [
            {
                name: "Cheetah",
                image: cheetah,
                texts: ["Eu aposto que você não consegue me superar nessa luta!"]
            }
        ];
    
        return script7;
        }
        case 8:{
            const script8 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["Bora filhote, quero ver você me provar que é capaz de acabar com a “Ignorância”!"]
                }
            ];
        
            return script8;
        }     
        case 9:{
            const script9 = [
                {
                    name: "Cheetah",
                    image: cheetah,
                    texts: ["Corra, filhote, Corra! … Sinto que já ouvi essa frase em algum lugar"]
                }
            ];
        
            return script9;
        }                
        default:{
            const script10 = [
                {
                    name: "",
                    image: cheetah,
                    texts: [""]
                }
            ];
        
            return script10;
        }
    }
}

export default trail1Teasing;