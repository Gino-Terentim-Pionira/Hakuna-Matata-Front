import cheetah from "../../../assets/sprites/cheetah/cheetah.png";


const cheetahBuildModuleEndScript = (scriptTexts: string[]) => {

    const script = [
        {
            name: "Cheetah",
            image: cheetah,
            texts: scriptTexts
        }
    ];

    return script;
}

export default cheetahBuildModuleEndScript;
