import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = () => {
    const queryClient = useQueryClient()
    const {showToast} = useAppContext()
    const mutation = useMutation(apiClient.signOut, {
      onSuccess: async () => {
        await queryClient.invalidateQueries("validateToken")
        showToast({ message: "Sign Out Successfull", type: "SUCCESS" });
        // navigate("/");
      },
      onError: (error: Error) => {
        showToast({ message: error.message, type: "ERROR" });
      },
    });
  const onClick = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={onClick}
      className="text-white rounded-lg px-3 font-bold bg-whiite hover:bg-red-500"
    >
      SignOut
    </button>
  );
};
export default SignOutButton;
