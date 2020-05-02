import React from "react";
import { RouteComponentProps } from "react-router-dom";

interface IProps extends RouteComponentProps {}
const About: React.FC<IProps> = () => <div>Hello, About Page</div>;

export default About;
