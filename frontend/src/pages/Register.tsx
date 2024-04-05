import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration Success!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    console.log("onSubmit function called");
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            {...register("firstName", { required: "This field is required" })}
            className="border rounded w-full font-normal px-2 py-1"
          ></input>
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label className="text-gray-700 flex-1 text-sm font-bold">
          Last Name
          <input
            {...register("lastName", { required: "This field is requiried" })}
            className="border rounded w-full font-normal px-2 py-1"
          ></input>
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
      <label className="text-gray-700 flex-1 text-sm font-bold">
        Email
        <input
          type="email"
          {...register("email", { required: "This field is requried" })}
          className="border rounded w-full font-normal px-2 py-1"
        ></input>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 flex-1 text-sm font-bold">
        Password
        <input
          type="password"
          {...register("password", {
            required: "This field is",
            minLength: {
              value: 6,
              message: "length should be more than 5",
            },
          })}
          className="border rounded w-full font-normal px-2 py-1"
        ></input>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <label className="text-gray-700 flex-1 text-sm font-bold">
        Confrm Password
        <input
          type="password"
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) {
                return "This field is requried";
              } else if (watch("password") !== val) {
                return "Your password does not match";
              }
            },
          })}
          className="border rounded w-full font-normal px-2 py-1"
        ></input>
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 rounded-md text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Create Account
        </button>
      </span>
    </form>
  );
};

export default Register;
