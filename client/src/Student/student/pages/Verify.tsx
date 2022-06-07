import axios from "axios";
import React, { FC, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import NavbarAdmin from "../../../Components/Navbar";
import { API_HOST } from "../../../consts";
import Spinner from "../../../utils/Spinner";

type SomeComponentProps = RouteComponentProps;

const Verify: FC<SomeComponentProps> = ({ history }) => {
  const [documentValue, setDocumentValue] = useState<File | undefined>(
    undefined
  );
  const [cmsInformation, setCmsInformation] = useState<any>(undefined);
  const [open, setOpen] = useState(false);

  const onDocumentChange = (e: any) => {
    setDocumentValue(e.target.files[0]);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    if (documentValue)
      formData.append("document", documentValue, documentValue.name);

    setOpen(true);
    axios
      .post(API_HOST + "/api/document/verify", formData)
      .then((res: any) => {
        console.log(res.data);
        setCmsInformation(res.data);
        setDocumentValue(undefined);
        toast.success("Verification result");
      })
      .catch((error: any) => {
        console.error("Error", error);
        setCmsInformation(undefined);
        toast.error("Oops... something went wrong");
      })
      .finally(() => {
        setOpen(false);
      });
  };

  return (
    <div>
      {open && (
        <Spinner />
      )}
       
      <NavbarAdmin history={history} />
      <div className="columns">
        <div className="column is-half is-offset-one-quarter">
          <h1 className="title is-size-2 has-text-weight-light has-text-centered">
            Verify document
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Document which you want to check</label>
              <div className="control">
                <input
                  type="file"
                  className="file"
                  placeholder="File"
                  multiple={false}
                  onChange={onDocumentChange}
                  required
                />
              </div>
            </div>

            <br></br>

            <button className="button is-primary">Verify</button>
          </form>

          {cmsInformation && (
            <table className="table mt-5">
              <thead>
                <tr><th>Name</th><th>Value</th></tr>
              </thead>
              <tbody>
                {cmsInformation.signers.map((signer: any) => (
                  <>
                    <tr>
                      <td>IIN</td>
                      <td>{signer.cert.subject.iin}</td>
                    </tr>
                    <tr>
                      <td>Signed by</td>
                      <td>{signer.cert.subject.commonName}</td>
                    </tr>
                    <tr>
                      <td>Serial Number</td>
                      <td>{signer.cert.serialNumber}</td>
                    </tr>
                    <tr>
                      <td>Certificate Lifetime</td>
                      <td>{new Date(signer.cert.notBefore.split(' ')).toLocaleDateString()} - {new Date(signer.cert.notAfter.split(' ')).toLocaleDateString()}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verify;
