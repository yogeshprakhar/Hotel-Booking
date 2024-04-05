import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const queryClient = useQueryClient();

  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "Sign in Successfull", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="flex justify-between gap-10 items-center">
      <form onSubmit={onSubmit} className="flex flex-col  w-full gap-5">
        <h2 className="text-3xl font-bold">Sign In</h2>
        <label className="text-gray-700 text-sm font-bold">
          Email
          <input
            type="email"
            {...register("email", { required: "This field is requried" })}
            className="border rounded w-full font-normal px-2 py-1"
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold">
          Password
          <input
            type="password"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 6,
                message: "length should be more than 5",
              },
            })}
            className="border rounded w-full font-normal px-2 py-1"
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </label>
        <span className="flex items-center justify-between">
          <span className="text-sm">
            Not Registered? <Link className="underline hover:font-bold" to="/register" >Create an Account here</Link>
          </span>
          <button className="bg-blue-600 mt-4 rounded-md text-white pl-4 pr-4 p-2 font-bold hover:bg-blue-500 text-xl">
            Login
          </button>
        </span>
      </form>
      <img
        height={400}
        width={400}
        className="  rounded-full"
        src="world.png"
        alt="world logo"
      />
    </div>
  );
};

export default SignIn;
