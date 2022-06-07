import React, { FC } from "react";
import { RouteComponentProps } from "react-router-dom";
import DocumentList from "../../../Common/Documents/DocumentList";
import Navbar from "../../../Components/Navbar";

type SomeComponentProps = RouteComponentProps;

const Profile: FC<SomeComponentProps> = ({ history }) => {
  const logout = () => {
    history.push("/login");
  };

  return (
    <>
      <Navbar history={history} />
      <DocumentList />
    </>
  );
};

export default Profile;


