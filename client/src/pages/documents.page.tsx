import axios from 'axios';
import { useState } from 'react';

import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';

import { useMsal } from '@azure/msal-react';

import { Document } from '../components/document.component'
import {Button, CircularProgress} from '@mui/material';

interface DocumentsProps {
  isAuthenticated: boolean;
}

function DocumentsPage(props: DocumentsProps) {
  const { accounts } = useMsal();
  const [documents, setDocuments] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  axios.get('http://localhost:3001/api/template/all')
    .then((res) => {
      setDocuments(res.data);
    })
    .catch((error) => {
      console.error(error);
    })

  const clickHandler = (id: number) => {
    setOpen(true)
    axios.get(`http://localhost:3001/api/template/generate?id=${id}&email=${accounts[0].username}`)
      .then((resp) => {
        const data = resp.data;
        console.log('Got ', data._id);
        window.location.assign('http://localhost:3001/api/document/download?id=' + data.id);
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setOpen(false);
      })
  }

  return (
    <Grid container spacing={2}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

    {
      documents.map(x => (
        <Grid item xs={12} md={4}>
          <Document clickHandler={clickHandler} key={x._id} id={x._id} title={x.title} description={x.description} />
        </Grid>
      ))
    }
  </Grid>
  );
}

export default DocumentsPage;
