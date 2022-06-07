import axios from "axios";
import { FC, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import TemplateList from "../Common/Templates/TemplateList";
import {API_HOST} from "../consts";
import "./home.css";
import NavbarAdmin from "./Navbar";

type SomeComponentProps = RouteComponentProps;

const Home: FC<SomeComponentProps> = ({ history }) => {
  const logout = () => {
    localStorage.clear();
    history.push("/login");
  };

  return (
    <>
      <NavbarAdmin history={history} />
      <TemplateList />
    </>
  );
};

export default Home;
