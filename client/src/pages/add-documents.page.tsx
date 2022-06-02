import { useState } from "react";
import axios from 'axios';

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Backdrop from '@mui/material/Backdrop';
import {CircularProgress} from '@mui/material';

function AddDocumentsPage() {
  const [titleValue, setTitleValue] = useState<string>("");
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [documentValue, setDocumentValue] = useState<File | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const onTitleChange = (e: any) => setTitleValue(e.target.value);
  const onDescriptionChange = (e: any) => setDescriptionValue(e.target.value);
  const onDocumentChange = (e: any) => { setDocumentValue(e.target.files[0]); }

  const handleSubmit = (e: any) => {
    const formData = new FormData();

    formData.append("title", titleValue);
    formData.append("description", descriptionValue);
    if (documentValue)
      formData.append("document", documentValue, documentValue.name);

    console.log(documentValue);

    setOpen(true);
    axios.post('http://localhost:3001/api/template/add', formData)
      .then((res: any) => {
        setDocumentValue(undefined)
        setDescriptionValue("")
        setTitleValue("")
      })
      .catch((error: any) => {
        console.error('Error', error);
      })
      .finally(() => {
        setOpen(false);
      })
  }

  return (
    <Grid container justifyContent="center">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid item>
        <Card style={{ padding: '40px', backgroundColor: 'rgab(0, 0, 0, 0)' }}>
          <Typography variant="h5">
            Add Document
          </Typography>
          <br />
          <Stack
            component="form"
            sx={{
              width: '50ch',
            }}
            spacing={2}
            noValidate
            autoComplete="off"
          >
            <TextField
              size="small"
              variant="outlined"
              label="Title"
              value={titleValue}
              onChange={onTitleChange}
            />
            <TextField
              multiline
              rows={3}
              size="small"
              variant="outlined"
              label="Description"
              value={descriptionValue}
              onChange={onDescriptionChange}
            />
            <input
              type="file"
              placeholder="Template"
              multiple={false}
              onChange={onDocumentChange}
            />
            <Button onClick={handleSubmit} variant="contained">Send</Button>
          </Stack>
          <br />
        </Card>
      </Grid>
    </Grid>
  );
}

export default AddDocumentsPage;
