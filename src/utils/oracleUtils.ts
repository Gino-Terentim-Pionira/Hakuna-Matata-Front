import { IQuiz } from "../recoil/moduleRecoilState";

export const numberCompletedModules = (modules: IQuiz[], user_modules: string[]) => {
    let completedNumber = 0;

    modules.forEach(item => {
        if (user_modules.includes(item._id)) {
            completedNumber++;
        }
    });

    return completedNumber;
}
