import React, { FC } from "react";
import { RouteComponentProps, useParams } from "react-router-dom";
import DocumentList from "../../../Common/Documents/DocumentList";
import Navbar from "../../../Components/Navbar";

type SomeComponentProps = RouteComponentProps;

const Show: FC<SomeComponentProps> = ({ history }) => {
  const { documentId } = useParams<{ documentId: string }>();
  console.log('Document', documentId);

  const logout = () => {
    history.push("/login");
  };

  return (
    <>
      <Navbar history={history} />
      <h1>Show</h1>
    </>
  );
};

export default Show;
