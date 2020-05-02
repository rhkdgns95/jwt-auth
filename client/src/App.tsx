import React from "react";
import { useSayHelloQuery, useGetMyProfileQuery } from "./generated/graphql";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Register from "./routes/Register";
import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import About from "./routes/About";

interface IAppPresenterProps {
  isLoggedIn: boolean;
}

const App: React.FC = () => {
  const { data: sayHelloData } = useSayHelloQuery();
  const { data, loading } = useGetMyProfileQuery({
    onError: data => {
      console.log("GetMyProifle error: ", data);
    }
  });
  
  console.log("Sayhello: ", sayHelloData);
  console.log("DATA: ", data);
  
  if(loading) {
    return <div>loading...</div>;
  }
  return <AppPresenter isLoggedIn={Boolean(data && data?.getMyProfile?.user)}/>;
};

const AppPresenter: React.FC<IAppPresenterProps> = ({ isLoggedIn }) => (
  <BrowserRouter>
    <Navbar isLoggedIn={isLoggedIn} />
    {isLoggedIn ? <IsLoggedIn/> : <IsLoggedOut />}
  </BrowserRouter>
);

const IsLoggedIn: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/about" component={About} />
    <Redirect from="*" to="/"/>
  </Switch>
);
const IsLoggedOut: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/register" component={Register} />
    <Redirect from="*" to="/"/>
  </Switch>
);

export default App;
