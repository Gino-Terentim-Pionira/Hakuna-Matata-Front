import { useRecoilState } from "recoil"
import { useIgnoranceFilterState } from "../recoil/ignoranceRecoilState"


const useIgnoranceFilter = () => {
    const [isIgnoranceFilterOn, setIsIgnoranceFilterOn] = useRecoilState(useIgnoranceFilterState);
    const handleIgnoranceFilter = () => {
        setIsIgnoranceFilterOn(!isIgnoranceFilterOn);
    }
    return {
        isIgnoranceFilterOn,
        handleIgnoranceFilter
    }
}
export default useIgnoranceFilter;
