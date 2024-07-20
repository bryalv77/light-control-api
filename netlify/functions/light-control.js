const axios = require("axios");
const dotenv = require("dotenv");

const API_KEY = process.env.API_KEY;
const HUE_BRIDGE_IP = process.env.HUE_BRIDGE_IP;
const HUE_BRIDGE_USERNAME = process.env.HUE_BRIDGE_USERNAME;

// Middleware para verificar la API key
const apiKeyMiddleware = (event) => {
  const apiKey = event.headers["api-key"];
  return apiKey && apiKey === API_KEY;
};

const handler = async (event) => {
  if (!apiKeyMiddleware(event)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Forbidden" }),
    };
  }

  const path = event.path;
  const luzId = path.split("/").pop();
  const isTurnOn = path.includes("/on");

  try {
    const response = await axios.put(
      `${HUE_BRIDGE_IP}/api/${HUE_BRIDGE_USERNAME}/lights/${luzId}/state`,
      {
        on: isTurnOn,
      }
    );
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to toggle the light" }),
    };
  }
};

exports.handler = handler;
