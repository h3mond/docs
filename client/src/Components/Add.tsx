import axios from "axios";
import { FC, useState } from "react";
import {toast} from "react-toastify";
import {API_HOST} from "../consts";
import NavbarAdmin from "./Navbar";

interface Props {
  history: any;
}

const AddPage: FC<Props> = ({ history }) => {
  const [titleValue, setTitleValue] = useState<string>("");
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [documentValue, setDocumentValue] = useState<File | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const onTitleChange = (e: any) => setTitleValue(e.target.value);
  const onDescriptionChange = (e: any) => setDescriptionValue(e.target.value);
  const onDocumentChange = (e: any) => { setDocumentValue(e.target.files[0]); }

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", titleValue);
    formData.append("description", descriptionValue);
    if (documentValue)
      formData.append("document", documentValue, documentValue.name);

    setOpen(true);
    axios.post(API_HOST + '/api/template/add', formData)
      .then((res: any) => {
        console.log(e);
        setDocumentValue(undefined)
        setDescriptionValue("")
        setTitleValue("")
        toast.success("Document was added");
      })
      .catch((error: any) => {
        console.error('Error', error);
        toast.error("Oops... something went wrong");
      })
      .finally(() => {
        setOpen(false);
      })
  }


  return (
    <div>
      <NavbarAdmin history={history} />
      <div className="columns">
        <div className="column is-half is-offset-one-quarter">
          <h1 className="title is-size-2 has-text-weight-light has-text-centered">
            Add document
          </h1>
          <form onSubmit={handleSubmit}>

            <div className="field">
              <label className="label">Title</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  placeholder="Document Title"
                  value={titleValue}
                  onChange={onTitleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  value={descriptionValue}
                  placeholder="Any description of document"
                  onChange={onDescriptionChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Document template</label>
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

            <button className="button is-primary">Add document</button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPage;
