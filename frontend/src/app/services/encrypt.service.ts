import { Injectable, Inject } from "@angular/core";
import * as crypto from "crypto-js";
import { APP_CONFIG, IAppConfig } from "../../app.config";

@Injectable()
class EncryptService {
  constructor(@Inject(APP_CONFIG) private config: IAppConfig) {}

  /**
   * Encrypts a value and saves it into the locastorage with the name given
   * @param name
   * @param value
   */
  encrypt(name: any, value: any) {
    const NAME = name;
    const encryptedJson = crypto.AES.encrypt(
      JSON.stringify(value),
      this.config.ENCRYPTION_KEY
    );
    localStorage.setItem(NAME, encryptedJson.toString());
  }

  /**
   * Encrypts a variable
   * @param value
   */
  encryptVariable(value) {
    const encryptedJson = crypto.AES.encrypt(
      JSON.stringify(value),
      this.config.ENCRYPTION_KEY
    );
    return encryptedJson;
  }

  /**
   * Desencrypts a varible on the localstorage
   * @param name
   */
  desencrypt(name: any) {
    const encryptedJson = localStorage.getItem(name);
    const decryptedJson = crypto.AES.decrypt(
      encryptedJson,
      this.config.ENCRYPTION_KEY
    ).toString(crypto.enc.Utf8);
    const value = JSON.parse(decryptedJson);
    return value;
  }

  /**
   * Desencrypt a variable
   * @param encryptedJson
   */
  desencryptVariable(encryptedJson: any) {
    const decryptedJson = crypto.AES.decrypt(
      encryptedJson,
      this.config.ENCRYPTION_KEY
    ).toString(crypto.enc.Utf8);
    const value = JSON.parse(decryptedJson);
    return value;
  }
}
export { EncryptService };
