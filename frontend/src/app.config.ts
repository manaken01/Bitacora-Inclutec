import { InjectionToken } from "@angular/core";
import { environment } from "./environments/environment";

const API_ENDPOINT = `http://${environment.apiHost}:${environment.apiPort}/`;

export interface IAppConfig {
  ENCRYPTION_KEY: string;
  API_ENDPOINT_BITACORA: string;
  NAVBAR_IETMS: any;
}

export const AppConfig: IAppConfig = {
  API_ENDPOINT_BITACORA: `${API_ENDPOINT}worklog-api/`,
  ENCRYPTION_KEY: "2c251d30-d607-11e7-b40f-541379bf221d",
  NAVBAR_IETMS: [
    { text: "Registro", path: "register" },
    { text: "Búsqueda", path: "search" },
    { text: "Estadísticas", path: "statistics" },
    { text: "Gestión", path: "management" },
  ],
};

export let APP_CONFIG = new InjectionToken<IAppConfig>("app.config");
