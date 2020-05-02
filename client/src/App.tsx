import React, { useEffect, useState } from "react";
import { useSayHelloQuery } from "./generated/graphql";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Register from "./routes/Register";
import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import About from "./routes/About";
import { setAccessToken } from "./accessToken";

interface IAppPresenterProps {
  isLoggedIn: boolean;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [fetchLoading, setFetechLoading] = useState<boolean>(true);
  const { data: sayHelloData } = useSayHelloQuery();
  

  useEffect(() => {
    fetch("http://localhost:4000/refresh_token", {
      method: 'POST',
      credentials: "include",
    }).then(async (x) => {
      const { ok, accessToken } = await x.json();
      if(ok && accessToken) {
        setIsLoggedIn(true);
        setAccessToken(accessToken);
      } else {
        setIsLoggedIn(false);
        setAccessToken('');
        console.log("refreshToken error");
      }
      setFetechLoading(false);
    });
  }, []);

  console.log("Sayhello: ", sayHelloData);

  if (fetchLoading) {
    return <div>loading...</div>;
  }
  return (
    <AppPresenter isLoggedIn={isLoggedIn} />
  );
};

const AppPresenter: React.FC<IAppPresenterProps> = ({ isLoggedIn }) => (
  <BrowserRouter>
    <Navbar isLoggedIn={isLoggedIn} />
    {isLoggedIn ? <IsLoggedIn /> : <IsLoggedOut />}
  </BrowserRouter>
);

const IsLoggedIn: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/about" component={About} />
    <Redirect from="*" to="/" />
  </Switch>
);
const IsLoggedOut: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/register" component={Register} />
    <Redirect from="*" to="/" />
  </Switch>
);

export default App;
