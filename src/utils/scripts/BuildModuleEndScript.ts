import cheetah from "../../assets/sprites/cheetah/cheetah.webp";
import couple from "../../assets/sprites/lion/couple.png";


const buildModuleEndScript = (name: 'Cheetah' | 'Leão e Leoa',scriptTexts: string[]) => {

    const script = [
        {
            name: name,
            image:  name === 'Cheetah' ? cheetah : couple,
            texts: scriptTexts
        }
    ];

    return script;
}

export default buildModuleEndScript;
