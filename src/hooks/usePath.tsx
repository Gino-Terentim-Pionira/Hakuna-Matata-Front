import { useRecoilState } from "recoil";
import { pathState } from "../recoil/pathRecoilState";

const usePath = () => {
    const [path, setPath] = useRecoilState(pathState);
    const handlePath = (pathName: string) => {
        setPath(pathName);
    }

    return {
        path,
        handlePath
    }
}
export default usePath;
