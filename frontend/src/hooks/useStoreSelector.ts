import { useSelector } from "react-redux";
import _ from "lodash";

const useStoreSelector = <T>(path: string, defaultValue?: T) => {
  return useSelector((state) => _.get(state, path, defaultValue));
};

export default useStoreSelector;
