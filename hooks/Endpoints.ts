import { PostResponseType } from "./types";
import useAxios from "./useAxios"

const Endpoints = () => {

    const api = useAxios();

    const GetAllPosts = async (
        pageNum = 1,
        account?: string
    ): Promise<PostResponseType> => {
        let response;
        if (account) {
            response = await api.get(
                `/posts/?page=${pageNum}&account=${account}`
            );
        } else {
            response = await api.get(`/posts/?page=${pageNum}`);
        }

        return response.data;
    };

    return {
      GetAllPosts
  }
}

export default Endpoints
