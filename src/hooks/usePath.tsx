
import { useHistory, useLocation } from "react-router-dom";

const usePath = () => {
    const local = useLocation();
    const history = useHistory();
    const handlePath = (pathname: string) => {
        const prePath = local.pathname;
        sessionStorage.setItem('@pionira/prepath', prePath);
        history.push({ pathname });
    }

    const handleBack = () => {
        const prepath = sessionStorage.getItem('@pionira/prepath');
		if (prepath)
			history.push(prepath);
		else history.push('/MainPage');
    }

    return {
        handlePath,
        handleBack
    }
}
export default usePath;
