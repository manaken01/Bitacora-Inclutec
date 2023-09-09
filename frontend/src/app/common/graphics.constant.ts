import { Injectable } from "@angular/core";

/**
 * Common constants of graph
 */
@Injectable()
export class GraphicsConstants {
  public static columnPlotOptions = {
    column: {
      borderColor: "#fffff",
      pointPadding: 0.2,
      borderWidth: 0,
    },
  };
  public static barPlotOptions = {
    bar: {
      dataLabels: {
        enabled: true,
      },
    },
  };
  public static piePlotOptions = {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: false,
      },
      showInLegend: true,
      size: "100%",
      innerSize: "0%",
    },
  };
  public static donutPlotOptions = {
    pie: {
      shadow: false,
      center: ["50%", "50%"],
      size: "70%",
      innerSize: "20%",
      showInLegend: false,
      dataLabels: {
        enabled: true,
      },
    },
  };

  public static chartOptions = {
    colors: [
      "#198382",
      "#c4244b",
      "#a2653e",
      "#5d0e22",
      "#063b3a",
      "#5257ad",
      "#800e0e",
      " #1a1f76",
      "#532e16",
      "#026729",
      "#c45b00",
      "#53207e",
      "#0a6681",
      "#5c5c5c",
      "#d83d3d",
      "#2a5188",
      "#637211",
      " #6a434d",
    ],
  };

  public static initialStyle = {
    backgroundStyle: {},
    titleStyle: {
      font: "14pt Monserrat",
      fontSize: "16px",
      color: "black",
    },
    subtitleStyle: {
      font: "14pt Monserrat",
      fontSize: "15px",
      color: "black",
    },
    itemStyle: {
      font: "10pt Monserrat",
      fontSize: "14px",
      fontWeight: "regular",
      color: "black",
      backgroundStyle: "black",
    },
    itemOver: {
      font: "10pt Monserrat",
      fontSize: "14px",
      color: "black",
      fontWeight: "regular",
    },
    tooltipStyle: {
      font: "14pt Monserrat",
      fontSize: "12px",
      color: "black",
    },
    pointStyle: {
      font: "14pt Monserrat",
      fontSize: "10px",
      color: "black",
    },
    yAxis: {
      font: "10pt Monserrat",
      fontSize: "13px",
      color: "black",
    },
    xAxis: {
      font: "10pt Monserrat",
      fontSize: "13px",
      color: "black",
    },
  };

  public static highContrast = {
    backgroundStyle: {
      linearGradient: [0, 0, 500, 500],
      stops: [
        [0, "rgb(0 , 0, 0)"],
        [1, "rgb(0, 0, 0)"],
      ],
    },
    titleStyle: {
      font: "14pt Monserrat",
      fontSize: "16px",
      color: "yellow",
    },
    subtitleStyle: {
      font: "14pt Monserrat",
      fontSize: "15px",
      color: "white",
    },
    itemStyle: {
      font: "10pt Monserrat",
      color: "white",
      fontSize: "14px",
      fontWeight: "regular",
    },
    itemOver: {
      font: "10pt Monserrat",
      color: "white",
      fontWeight: "regular",
      fontSize: "14px",
    },
    tooltipStyle: {
      font: "14pt Monserrat",
      color: "white",
      fontSize: "14px",
      fontWeight: "regular",
    },
    pointStyle: {
      font: "14pt Monserrat",
      color: "white",
      fontSize: "12px",
    },
    yAxis: {
      font: "10pt Monserrat",
      fontSize: "13px",
      color: "white",
    },
    xAxis: {
      font: "10pt Monserrat",
      fontSize: "13px",
      color: "white",
    },
  };
}
export class Patterns {
  def: any = null;
  constructor(name: string) {
    this.def = {
      patterns: [
        {
          id: `${name}-0`,
          path: {
            d: "M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11",
          },
          color: "#198382",
        },
        {
          id: `${name}-1`,
          image:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='12' viewBox='0 0 20 12'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='charlie-brown' fill='%232a5188' fill-opacity='1'%3E%3Cpath d='M9.8 12L0 2.2V.8l10 10 10-10v1.4L10.2 12h-.4zm-4 0L0 6.2V4.8L7.2 12H5.8zm8.4 0L20 6.2V4.8L12.8 12h1.4zM9.8 0l.2.2.2-.2h-.4zm-4 0L10 4.2 14.2 0h-1.4L10 2.8 7.2 0H5.8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
          width: 20,
          height: 9,
        },

        {
          id: `${name}-2`,
          path: {
            d: "M 5 5 m -4 0 a 4 4 0 1 1 8 0 a 4 4 0 1 1 -8 0",
          },
          color: "#a2653e",
        },
        {
          id: `${name}-3`,
          image:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='5' height='5' viewBox='0 0 5 5'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%230a6681' fill-opacity='1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
          width: 8,
          height: 8,
        },
        {
          id: `${name}-4`,
          path: {
            d: "M 0 0 L 5 10 L 10 0",
          },
          color: "#026729",
        },
        {
          id: `${name}-5`,
          path: {
            d: "M 0 3 L 10 3 M 0 8 L 10 8",
          },
          color: "#5257ad",
        },
        {
          id: `${name}-6`,
          path: {
            d: "M 10 3 L 5 3 L 5 0 M 5 10 L 5 7 L 0 7",
          },
          color: "#800e0e",
        },
        {
          id: `${name}-7`,
          path: {
            d: "M 3 3 L 8 3 L 8 8 L 3 8 Z",
          },
          color: "#1a1f76",
        },
        {
          id: `${name}-8`,
          path: {
            d: "M 2 5 L 5 2 L 8 5 L 5 8 Z",
          },
          color: "#532e16",
        },
        {
          id: `${name}-9`,
          image:
            "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23c45b00' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E",
          width: 45,
          height: 45,
        },
        {
          id: `${name}-10`,
          path: {
            d: "M 3 0 L 3 10 M 8 0 L 8 10",
          },
          color: "#095d5c",
        },
        {
          id: `${name}-11`,
          image:
            "data:image/svg+xml,%3Csvg width='2' height='2' viewBox='0 0 2 2' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%2353207e' fill-opacity='200'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
          width: 8,
          height: 8,
        },
        {
          id: `${name}-12`,
          path: {
            d: "M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9",
          },
          color: "#5d0e22",
        },

        {
          id: `${name}-13`,
          image:
            "data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10h10v10H0V10zM10 0h10v10H10V0z' fill='%235c5c5c' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E",
          width: 10,
          height: 10,
        },
        {
          id: `${name}-14`,
          image:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='18' viewBox='0 0 100 18'%3E%3Cpath fill='%23d83d3d' fill-opacity='1' d='M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 80.34 5.1 83.87 3.42 88.56 1.16 93.75 0 100 0v6.16C98.76 6.05 97.43 6 96 6c-9.59 0-14.23 2.23-23.13 9.34-1.28 1.03-2.39 1.9-3.4 2.66h-7.65zm-23.64 0H22.52c-1-.76-2.1-1.63-3.4-2.66C11.57 9.3 7.08 6.78 0 6.16V0c6.25 0 11.44 1.16 16.14 3.42 3.53 1.7 5.87 3.35 10.73 7.24 4.45 3.56 7.84 5.9 11.31 7.34zM61.82 0h7.66a39.57 39.57 0 0 1-7.34 4.58C57.44 6.84 52.25 8 46 8S34.56 6.84 29.86 4.58A39.57 39.57 0 0 1 22.52 0h15.66C41.65 1.44 45.21 2 50 2c4.8 0 8.35-.56 11.82-2z'%3E%3C/path%3E%3C/svg%3E",
          width: 20,
          height: 9,
        },
        {
          id: `${name}-15`,
          path: {
            d: "M 0 3 L 5 3 L 5 0 M 5 10 L 5 7 L 10 7",
          },
          color: "#c4244b",
        },
        {
          id: `${name}-16`,
          image:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='20' viewBox='0 0 10 20'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23637211' fill-opacity='1'%3E%3Cpath d='M2 6h12L8 18 2 6zm18 36h12l-6 12-6-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
          width: 20,
          height: 10,
        },
        {
          id: `${name}-17`,
          image:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%236a434d' fill-opacity='1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
          width: 15,
          height: 20,
        },
      ],
    };
  }
}
