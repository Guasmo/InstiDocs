import { useUserContext } from "../context/UserContext";

export const useUser = () => {
    const context = useUserContext();

    return {
        user: context.user,
        loading: context.loading,
        error: context.error,
        getUser: context.fetchUser,
        updateUser: context.updateUser,
    };
};