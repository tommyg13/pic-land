import { useLoginUserMutation } from "../../redux/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/auth/authSlice";
import useForms from "../../hooks/useForms";
import FormComponent from "../../components/FormComponent";
import { handlePostAction, validateFields } from "../../utils/globalFunctions";

const Login = () => {
  const { values, updateInput, getFormData, handleErrors } = useForms([
    {
      name: "email",
      value: "",
      placeholder: "Email",
      type: "email",
      required: true,
      error: "",
    },
    {
      name: "password",
      value: "",
      placeholder: "Κωδικός",
      type: "password",
      required: true,
      error: "",
    },
  ]);
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const dispatch = useDispatch();

  const login = async () => {
    handlePostAction(loginUser, setCredentials, getFormData(), dispatch);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateFields(values, handleErrors, login);
  };

  return (
    <>
      <FormComponent
        values={values}
        handleChange={updateInput}
        actionTxt="Login"
        handleSubmit={handleSubmit}
        disabled={isLoading}
      />
    </>
  );
};

export default Login;
