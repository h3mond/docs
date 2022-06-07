import { useMsal } from "@azure/msal-react";
import axios from "axios";
import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import { toast } from "react-toastify";
import { API_HOST } from "../../consts";
import Spinner from "../../utils/Spinner";

const DocumentList = () => {
  const { accounts } = useMsal();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  let isAdmin = false;
  if (localStorage.getItem("auth") !== "msal") {
    isAdmin = true;
  }

  useEffect(() => {
    axios
      .get(API_HOST + "/api/document/student?email=" + accounts[0].username)
      .then((resp) => {
        setDocuments(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const clickHandler = (id: number) => {
    setLoading(true);
    window.location.assign(
      API_HOST + "/api/document/download?id=" + id
    );
    setLoading(false);
  };

  return (
    <>
      {loading && <Spinner />}
      <h3 className="title is-size-3 has-text-weight-light has-text-centered">
        My documents
      </h3>
      <div className="grid">
        {documents.map((x) => (
          <div className="card" key={x._id}>
            <header className="card-header is-primary">
              <p className="card-header-title">{x.title}</p>
              <button className="card-header-icon" aria-label="more options">
                <span className="icon">
                  <i className="fas fa-angle-down" aria-hidden="true"></i>
                </span>
              </button>
            </header>
            <div className="card-content">
              <div className="content">Дата выдачи {new Date(x.createdAt).toLocaleDateString()}</div>
            </div>
            <footer className="card-footer">
              {/*
              <Link to={"show/" + x._id} className="card-footer-item">
                Open LOL
              </Link>*/}
              <a
                className="card-footer-item"
                onClick={() => clickHandler(x._id)}
              >
                Download
              </a>
            </footer>
          </div>
        ))}
      </div>
    </>
  );
};

export default DocumentList;
