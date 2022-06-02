import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { Link } from 'react-router-dom';

import { SignInButton } from "./button/sign-in.button";
import { SignOutButton } from "./button/sign-out.button";

/**
 * TODO: bug. runs multiple times
 */
export const PageLayout = (props: any) => {
  const { isAuthenticated, isAdministrator } = props;
  console.log(isAdministrator);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to={isAuthenticated ? "/documents" : "/"} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                AITU Docs
              </Link>
            </Typography>

            { isAdministrator && (
              <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <Link to="/add" style={{ color: 'inherit', textDecoration: 'inherit'}}>Add document</Link>
              </Button>
            )}

          { isAuthenticated ? <SignOutButton /> : <SignInButton /> }
        </Toolbar>
      </AppBar>
      <br/>
      {props.children}
    </Box>
  );
};
