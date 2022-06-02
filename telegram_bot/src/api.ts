import axios from "axios";

export const HOST = "http://localhost:3001";

export const API = {
  async getTemplates() {
    try {
      const resp = await axios.get(`${HOST}/api/template/all`);
      return resp.data ?? [];
    } catch (e) {
      return [];
    }
  },

  async generateDocument(documentId: number, email: string) {
    return await axios.get(
      `${HOST}/api/document/generate?id=${documentId}&email=${email}`
    );
    /*
    try {
      const resp = await axios.get(
        `${HOST}/api/document/generate?id=${documentId}&email=${email}`
      );
    } catch (e) {
      return null;
    }
    */
  },

  async downloadDocument(generatedDocumentId: number) {
    try {
      const resp = await axios.get(
        `${HOST}/api/document/download?id=${generatedDocumentId}`
      );
      return resp.data;
    } catch (e) {
      return null;
    }
  },

  async getUser(email: string) {
    try {
      const resp = await axios.get(`${HOST}/api/student?email=${email}`);
      return resp.data;
    } catch (e) {
      return null;
    }
  },
};
