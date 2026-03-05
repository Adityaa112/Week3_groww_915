import axios, { AxiosHeaders } from "axios";

// src/services/api/config.ts

// Change this to an empty string so requests go to localhost:5173/v1/...
const AUTH_BASE_URL = ""; 
const AUTH_TOKEN_STORAGE_KEY = "authToken";

const authConfig = {
  baseUrl: AUTH_BASE_URL,
  staticUsername: "AMITH1",
  staticPassword: "abc@12345",
  deviceId: "2abe6bee-768f-4714-ab8d-2da600000000",
  // Paste the same value you use in Postman pre-auth-handshake body.
  devicePublicKey: "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0NCk1Gd3dEUVlKS29aSWh2Y05BUUVCQlFBRFN3QXdTQUpCQUxmQUp0Uy9ZcjVWSCtNUTVUZmkvTG1zNUZldDNMM3g2SUNYMW9zME15RWpjUC9ldmFGdFYrZkJOTTBKRG5WQ3h3alZwRkNHaElybkt1S3d1Y2pUUndrQ0F3RUFBUT09DQotLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0=",
};

const getAuthHeaders = () => ({
  "appVersion": "1.0.6",
  "os": "android",
  "deviceId": authConfig.deviceId,
  // If CORS issues persist even with the proxy, comment out deviceIp
  "deviceIp": "10.0.2.16", 
  "timestamp": Date.now().toString(),
  "source": "MOB",
  "appInstallId": authConfig.deviceId,
  "userAgent": "com.coditas.omnenest.omnenest_android/1.0.6",
  "xRequestId": `req_${Date.now()}`,
});

const authClient = axios.create({
  baseURL: authConfig.baseUrl,
  timeout: 15000,
});

authClient.interceptors.request.use((requestConfig) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token) {
    if (!requestConfig.headers) {
      requestConfig.headers = new AxiosHeaders();
    }

    if (requestConfig.headers instanceof AxiosHeaders) {
      requestConfig.headers.set("Authorization", `Bearer ${token}`);
    } else {
      (requestConfig.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }
  return requestConfig;
});

export { authClient, authConfig, getAuthHeaders, AUTH_TOKEN_STORAGE_KEY };
