import axios from 'axios';

export const getAdmins = async (): Promise<string[]> => {
  try {
    const res = await axios.get('http://localhost:3001/api/account/get-administrative')
    return res.data;
  } catch (error) {
    return [];
  }
}
