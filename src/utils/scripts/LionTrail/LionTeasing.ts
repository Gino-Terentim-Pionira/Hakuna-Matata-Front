import lion from "../../../assets/sprites/lion/lion.png";
import lioness from "../../../assets/sprites/lion/lioness.png";


const lionTeasing = () => {
    const index = Math.floor(Math.random() * 10);
    switch (index) {
        case 0:{
            const script0 = [
                {
                    name: "Leão",
                    image: lion,
                    texts: ["Vamos, aprendiz! Queremos ver você nos provar que é capaz de acabar com a Ignorância!"]
                }
            ];
        
            return script0;
        }            
        case 1: {
            const script1 = [
                {
                    name: "Leão",
                    image: lion,
                    texts: ["Não deixe a Ignorância ganhar de você!"]
                }
            ];
        
            return script1;
        }
        case 2:{
            const script2 = [
                {
                    name: "Leão",
                    image: lion,
                    texts: ["A Savana precisa da sua dedicação, aprendiz!"]
                }
            ];
        
            return script2;
        }    
        case 3:{
        const script3 = [
            {
                name: "Leão",
                image: lion,
                texts: ["Para se tornar um grande líder é necessário muito treinamento. Tenha coragem, aprendiz!"]
            }
        ];
    
        return script3;
        }
        case 4:{
            const script4 = [
                {
                    name: "Leão",
                    image: lion,
                    texts: ["Continue em frente, sempre avançando. Não pise no freio!"]
                }
            ];
        
            return script4;
        }       
        case 5:{
            const script5 = [
                {
                    name: "Leão",
                    image: lion,
                    texts: ["Não desista nunca! Não podemos deixar passar essa chance de alcançar a “Ignorância”!"]
                }
            ];
        
            return script5;
        }    
        case 6:{
            const script6 = [
                {
                    name: "Leoa",
                    image: lioness,
                    texts: ["Ei, nada de desistir! A Ignorância está ganhando cada vez mais poder…"]
                }
            ];
        
            return script6;
        }    
        case 7:{
        const script7 = [
            {
                name: "Leoa",
                image: lioness,
                texts: ["Vamos lá! Você teve um bom avanço mas o caminho para derrotar a Ignorância ainda é longo!"]
            }
        ];
    
        return script7;

        }
        case 8:{
            const script8 = [
                {
                    name: "Leoa",
                    image: lioness,
                    texts: ["Os moradores da Savana estão confiando no seu potencial de derrotar a Ignorância, não os decepcione!"]
                }
            ];
        
            return script8;
        }     
        case 9:{
            const script9 = [
                {
                    name: "Leoa",
                    image: lioness,
                    texts: ["Desistir não é uma opção, aprendiz. Siga em frente!"]
                }
            ];
        
            return script9;
        }                
        default:{
            const script10 = [
                {
                    name: "",
                    image: lioness,
                    texts: [""]
                }
            ];
        
            return script10;
        }
    }
}

export default lionTeasing;