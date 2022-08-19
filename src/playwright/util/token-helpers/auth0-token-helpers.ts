import { BrowserContextOptions, Page } from "@playwright/test";
import fs from "fs";

interface IAuth0TokenStructure {
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
}

interface IAuth0LocalStorageValue {
  body: {
    access_token: string;
    scope: string;
    expires_in: number;
    token_type: string;
    decodedToken: {
      encoded: {
        header: string;
        payload: string;
        signature: string;
      };
      header: {
        alg: string;
        typ: string;
        kid: string;
      };
      claims: {
        __raw: string;
        given_name: string;
        family_name: string;
        nickname: string;
        name: string;
        picture: string;
        updated_at: string;
        email: string;
        email_verified: boolean;
        iss: string;
        sub: string;
        aud: string;
        iat: number;
        exp: number;
        nonce: string;
      };
      user: {
        given_name: string;
        family_name: string;
        nickname: string;
        name: string;
        picture: string;
        updated_at: string;
        email: string;
        email_verified: boolean;
        sub: string;
      };
    };
    audience: string;
    client_id: string;
  };
  expiresAt: number;
}

async function getTokenForCurrentUser(page: Page): Promise<string> {
  const localStorage = await page.evaluate(() => {
    return window.localStorage;
  });

  const auth0Storage =
    Object.keys(localStorage)
      .filter((key) => key.startsWith("@@auth0spajs@@::"))
      .map((key) => localStorage[key]) || [];

  const auth0LocalStorageValue = JSON.parse(
    auth0Storage[0]
  ) as IAuth0LocalStorageValue;
  return auth0LocalStorageValue.body.access_token.trim();
}

const getTokenFromStorageStateFile = (storageStateFilePath: string): string => {
  const storageStateObject = JSON.parse(
    fs.readFileSync(storageStateFilePath).toString()
  ) as BrowserContextOptions["storageState"];

  if (storageStateObject && typeof storageStateObject !== "string") {
    const authLocalStorageObject =
      storageStateObject.origins[0].localStorage.find((o) =>
        o.name.startsWith("@@auth0spajs@@::")
      );
    if (authLocalStorageObject) {
      const auth0LocalStorageValue = JSON.parse(
        authLocalStorageObject.value
      ) as IAuth0LocalStorageValue;
      return auth0LocalStorageValue.body.access_token;
    }
  }
  return "";
};

const decodeToken = (token: string): IAuth0TokenStructure | null => {
  try {
    return JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    ) as IAuth0TokenStructure;
  } catch (error) {
    return null;
  }
};

export default {
  decodeToken,
  getTokenFromStorageStateFile,
  getTokenForCurrentUser,
};
