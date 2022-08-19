import { BrowserContextOptions, Page } from "@playwright/test";
import fs from "fs";

interface ICognitoTokenStructure {
  sub: string;
  "cognito:groups": string[];
  iss: string;
  client_id: string;
  origin_jti: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  username: string;
}

async function getTokenForCurrentUser(page: Page): Promise<string> {
  const localStorage = await page.evaluate(() => {
    return window.localStorage;
  });

  const cognitoAccessTokenLocalStorageObject =
    Object.keys(localStorage)
      .filter(
        (key) =>
          key.startsWith("CognitoIdentityServiceProvider") &&
          key.endsWith("accessToken")
      )
      .map((key) => localStorage[key]) || [];

  const cognitoAccessTokenLocalStorageValue =
    cognitoAccessTokenLocalStorageObject[0];
  return cognitoAccessTokenLocalStorageValue.toString().trim();
}

const getTokenFromStorageStateFile = (storageStateFilePath: string): string => {
  const storageStateObject = JSON.parse(
    fs.readFileSync(storageStateFilePath).toString()
  ) as BrowserContextOptions["storageState"];

  if (storageStateObject && typeof storageStateObject !== "string") {
    const cognitoAccessTokenLocalStorageObject =
      storageStateObject.origins[0].localStorage.find(
        (o) =>
          o.name.startsWith("CognitoIdentityServiceProvider") &&
          o.name.endsWith("accessToken")
      );
    if (cognitoAccessTokenLocalStorageObject) {
      const cognitoAccessTokenLocalStorageValue =
        cognitoAccessTokenLocalStorageObject.value;
      return cognitoAccessTokenLocalStorageValue.toString().trim();
    }
  }
  return "";
};

const decodeToken = (token: string): ICognitoTokenStructure | null => {
  try {
    return JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    ) as ICognitoTokenStructure;
  } catch (error) {
    return null;
  }
};

const isDecodedTokenExpired = (
  decodedToken: ICognitoTokenStructure
): boolean => {
  // if access token expiry time is before now then it has expired
  return decodedToken.exp < Math.round(Date.now() / 1000);
};

const isAccessTokenInStorageStateFileExpired = (
  storageStateFilePath: string
): boolean => {
  let isAccessTokenExpired;
  if (fs.existsSync(storageStateFilePath)) {
    const decodedToken = decodeToken(
      getTokenFromStorageStateFile(storageStateFilePath)
    );

    if (decodedToken) {
      isAccessTokenExpired = isDecodedTokenExpired(decodedToken);
    } else {
      isAccessTokenExpired = true;
    }
  } else {
    // if the storage state file doesn't exist then assume the token is expired
    isAccessTokenExpired = true;
  }
  return isAccessTokenExpired;
};

export default {
  decodeToken,
  getTokenFromStorageStateFile,
  getTokenForCurrentUser,
  isAccessTokenInStorageStateFileExpired,
};
