import React from "react";
import {
  useEmailSignUpMutation,
  GetMyProfileDocument,
  UsersDocument,
} from "../generated/graphql";
import { RouteComponentProps } from "react-router-dom";
import { useInput } from "../hooks/useInput";

interface IProps extends RouteComponentProps {}

const Register: React.FC<IProps> = ({ history }) => {
  const formEmail = useInput();
  const formPassword = useInput();
  const [mutationEmailSignUp] = useEmailSignUpMutation({
    onCompleted: (data) => {
      console.log("EmailSignUp onCompleted: ", data);
      const { ok, error } = data.emailSignUp;
      if (ok) {
        alert("success signup");
        history.push("/");
      } else {
        alert(`failed: ${error}`);
      }
    },
    refetchQueries: [{ query: GetMyProfileDocument }, { query: UsersDocument }],
    onError: (data) => {
      console.log("EmailSignUp onError: ", data);
    },
  });
  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const { value: email } = formEmail;
    const { value: password } = formEmail;
    const response = await mutationEmailSignUp({
      variables: {
        email,
        password,
      },
    });
    console.log("response: ", response);
    console.log("formData: ", email, password);
  };
  return (
    <div>
      <p>Hello, Register page</p>
      <form onSubmit={onSubmit}>
        <p>
          <input placeholder="ID" type="text" {...formEmail} />
        </p>
        <p>
          <input placeholder="Password" type="password" {...formPassword} />
        </p>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Register;
