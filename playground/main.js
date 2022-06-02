const axios = require("axios");
const fs = require("fs");

(async function () {
  try {
    const cert = fs
      .readFileSync(
        "./cert/RSA256_68c6bc6b81b7f97a794754ce9f57d195dda4a42d.p12"
      )
      .toString("base64");

    const file = fs.readFileSync("./main.js").toString("base64");

    console.log(cert);
    console.log("==================================");

    const resp = await axios.post("http://192.168.122.220:14579", {
      version: "2.0",
      method: "cms.sign",
      params: {
        data: file,
        p12array: [
          {
            alias: "",
            p12: cert,
            password: "123456",
          },
        ],
      },
    });

const cms = resp.data.cms;
    console.log(cms);
  } catch (e) {
    console.log("Error", e.message);
  }
})();
