import { PostType } from "./types";
import useAxios from "./useAxios"

const Endpoints = () => {

    const api = useAxios();

    const getPosts = async ():Promise<PostType[]> => {
        const response = api.get('/posts')
        return (await response).data;
    }

    return {
      getPosts
  }
}

export default Endpoints
