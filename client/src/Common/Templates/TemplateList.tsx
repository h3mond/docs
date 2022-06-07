import { useMsal } from "@azure/msal-react";
import axios from "axios";
import { useEffect, useState } from "react";
import {toast} from "react-toastify";
import { API_HOST } from "../../consts";
import Spinner from "../../utils/Spinner";

const TemplateList = () => {
  const { accounts } = useMsal();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  let isAdmin = false;
  if (localStorage.getItem("auth") !== "msal") {
    isAdmin = true;
  }

  useEffect(() => {
    axios
      .get(API_HOST + "/api/template/all")
      .then((resp) => {
        setDocuments(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const clickHandler = (id: number) => {
    setLoading(true);
    axios
      .get(
        API_HOST +
          `/api/template/generate?id=${id}&email=${accounts[0]?.username ?? 'err'}`
      )
      .then((resp) => {
        const data = resp.data;
        console.log("Got ", data._id);
        window.location.assign(
          "http://localhost:3001/api/document/download?id=" + data.id
        );
      })
      .catch((err) => {
        toast.error(err)
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteHandler = (id: number) => {
    axios
      .get(API_HOST + "/api/template/delete?id=" + id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth"),
        },
      })
      .then(() => {
        axios
          .get(API_HOST + "/api/template/all")
          .then((resp) => {
            setDocuments(resp.data);
          })
          .catch((err) => {
            toast.error(err.message)
          });
      });
  };

  return (
    <>
      { loading && (
        <Spinner />
      )}
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
              <div className="content">{x.description}</div>
            </div>
            <footer className="card-footer">
              {!isAdmin ? (
                <a
                  className="card-footer-item"
                  onClick={() => clickHandler(x._id)}
                >
                  Download
                </a>
              ) : (
                <a
                  className="card-footer-item"
                  onClick={() => deleteHandler(x._id)}
                >
                  Delete
                </a>
              )}
            </footer>
          </div>
        ))}
      </div>
    </>
  );
};

export default TemplateList;
