import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

import MainPage from "./pages/main.page";
import DocumentsPage from "./pages/documents.page";
import AddDocumentsPage from "./pages/add-documents.page";

import { PageLayout } from "./components/page-layout.component";

import { getAdmins } from "./utils";

function App() {
  const { accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [isAdministrator, setIsAdministrator] = useState(false);

  useEffect(() => {
    async function _getAdmins() {
      if (isAuthenticated) {
        const admins = await getAdmins();
        setIsAdministrator(admins.includes(accounts[0].username));
      } else {
        setIsAdministrator(false);
      }
    }
    _getAdmins();
  }, [isAuthenticated]);

  return (
    <>
      <PageLayout
        isAuthenticated={isAuthenticated}
        isAdministrator={isAdministrator}
      ></PageLayout>
      <Routes>
        <Route path="/" element={<MainPage isAuthenticated={isAuthenticated}/>} />
        <Route
          path="documents"
          element={<DocumentsPage isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="add"
          element={<AddDocumentsPage/>}
        />
      </Routes>
    </>
  );
}

export default App;
