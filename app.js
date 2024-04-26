require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PORT = 8091;

async function getAccessToken() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const tokenUrl = process.env.TOKEN_URL;

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    const response = await axios.post(
      tokenUrl,
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    const { access_token } = response.data;
    return access_token;
  } catch (error) {
    console.error("Error obtaining access token:", error);
    throw error;
  }
}

app.get("/banks", async function (req, res) {
  try {
    const accessToken = await getAccessToken();
    const bankRatesServiceUrl = process.env.BANK_RATES_SERVICE_URL;

    if (!bankRatesServiceUrl) {
      throw new Error(
        "Service URL is not defined in the environment variables"
      );
    }

    const response = await axios.get(`${bankRatesServiceUrl}/banks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Error fetching banks:", error);
    res.status(500).send(error.message);
  }
});

app.get("/currencies", async function (req, res) {
  try {
    const accessToken = await getAccessToken();
    const bankRatesServiceUrl = process.env.BANK_RATES_SERVICE_URL;

    if (!bankRatesServiceUrl) {
      throw new Error(
        "Service URL is not defined in the environment variables"
      );
    }

    const response = await axios.get(`${bankRatesServiceUrl}/currencies`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Error fetching currencies:", error);
    res.status(500).send(error.message);
  }
});

app.post("/rates", async function (req, res) {
  try {
    const accessToken = await getAccessToken();
    const bankRatesServiceUrl = process.env.BANK_RATES_SERVICE_URL;

    if (!bankRatesServiceUrl) {
      throw new Error(
        "Service URL is not defined in the environment variables"
      );
    }

    const response = await axios.post(
      `${bankRatesServiceUrl}/rates`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Error fetching rates:", error);
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
