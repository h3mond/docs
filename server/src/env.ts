export const JWT_SECRET = process.env.JWT_SECRET ?? "VerySecret";

export const MONGODB_HOST = process.env.MONGODB_HOST ?? "localhost";
export const MONGODB_USER = "root_user";
export const MONGODB_PASS = "root_user_pw";
export const MONGODB_DB = "aitu_db";

export const CERT_PATH = process.env.CERT_PATH;
export const CERT_PASSWORD = process.env.CERT_PASSWORD;
export const NCA_HOST = `http://172.19.0.3:14579`; /* hard coded, better 'http://ncanode:14579' */
