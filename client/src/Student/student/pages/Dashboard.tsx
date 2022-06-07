import {useIsAuthenticated} from "@azure/msal-react";
import { FC } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import TemplateList from "../../../Common/Templates/TemplateList";
import Navbar from "../../../Components/Navbar";
import { SignOutButton } from "../buttons/SignOutButton";
type SomeComponentProps = RouteComponentProps;

const Dashboard: FC<SomeComponentProps> = ({ history }) => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    localStorage.clear();
    return (<Redirect to="/login"></Redirect>);
  }

  return (
    <>
      <Navbar history={history} />
      <TemplateList />
    </>
  );
};

export default Dashboard;
