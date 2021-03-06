import React from "react";
import {
  useGetMyProfileQuery,
  useUsersQuery,
  useEmailSignInMutation,
  GetMyProfileDocument,
  GetMyProfileQuery,
} from "../generated/graphql";
import { RouteComponentProps } from "react-router-dom";
import { useInput } from "../hooks/useInput";
import { setAccessToken } from "../accessToken";

interface IProps extends RouteComponentProps {}

const Home: React.FC<IProps> = () => {
  const { data, loading } = useGetMyProfileQuery({
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log("GetMyProfile onCompleted: ", data);
    },
    onError: (data) => {
      console.log("GetMyProfile onError: ", data);
    },
  });

  const user = data && data?.getMyProfile?.user;

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <>
      {user ? (
        <LoggedInHome id={user.id} email={user.email} />
      ) : (
        <LoggedOutHome />
      )}
      <UserList />
    </>
  );
};
const UserList = () => {
  const { data } = useUsersQuery();
  console.log("users: ", data);

  return (
    <div>
      {data?.users && (
        <>
          <h1>User list</h1>
          {data.users.map((user) => (
            <p key={user.id}>
              id: {user.id}, email: {user.email}, tokenVersion:{" "}
              {user.tokenVersion}, createdAt: {user.createdAt}
            </p>
          ))}
        </>
      )}
    </div>
  );
};
interface ILoggedInHomeProps {
  id: string;
  email: string;
}
const LoggedInHome: React.FC<ILoggedInHomeProps> = ({ email, id }) => (
  <h3>
    Hello, {email}({id})
  </h3>
);
const LoggedOutHome = () => {
  const formEmail = useInput();
  const formPassword = useInput();
  const [emailSignIn] = useEmailSignInMutation({
    onCompleted: (data) => {
      const {
        emailSignIn: { ok, token },
      } = data;
      if (ok && token) {
        console.log("accessToken ok");
        setAccessToken(token);
      }
    },
    update: (store, { data }) => {
      if (!data) {
        return null;
      }
      if (data.emailSignIn.user) {
        store.writeQuery<GetMyProfileQuery>({
          query: GetMyProfileDocument,
          data: {
            __typename: "Query",
            getMyProfile: {
              __typename: "GetMyProfileResponse",
              ok: true,
              error: '',
              user: data.emailSignIn.user,
            },
          },
        });
        console.log("loggedIn: ", data.emailSignIn.user);
        // store.writeData({

        // })
      }
    },
  });

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const { value: email } = formEmail;
    const { value: password } = formPassword;
    const response = await emailSignIn({
      variables: {
        email,
        password,
      },
    });
    console.log("response: ", response);
  };

  return (
    <div>
      <h3>Please LogIn.</h3>
      <form onSubmit={onSubmit}>
        <input placeholder="ID" type="text" {...formEmail} />
        <input placeholder="Password" type="password" {...formPassword} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
export default Home;
