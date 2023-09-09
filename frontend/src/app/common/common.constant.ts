import { Injectable } from "@angular/core";

/**
 * Common constants of the project
 */
@Injectable()
export class CommonConstants {
  /**
   * Years for start date and end date on registers
   */
  public static years = [
    2017,
    2018,
    2019,
    2020,
    2021,
    2022,
    2023,
    2024,
    2025,
    2026,
    2027,
    2028,
  ];
  /**
   * Months of the year
   */
  public static months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  /**
   * Months of the year
   */
  public static monthsNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  /**
   * Reg-form component hours
   */
  public static hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  /**
   * Reg-form component minutes for register.
   */
  public static minutes = [0, 15, 30, 45];
  /**
   * register pending minutes
   */
  public static minutesPending = [
    {
      value: 0,
      minute: 0,
    },
    {
      value: 25,
      minute: 15,
    },
    {
      value: 5,
      minute: 30,
    },
    {
      value: 75,
      minute: 45,
    },
  ];
  /**
   * List component material table displayed columns
   */
  public static displayedColumns = [
    "projectName",
    "phaseName",
    "activityName",
    "taskName",
    "startDate",
    "modality",
    "status",
    "collaborator",
    "description",
    "spentTime",
  ];

  /**
   * List component material table displayed columns
   */
  public static profileColummns = ["projectName"];

  /**
   * Project list diplayed columns
   */
  public static projectsColumns = [
    "projectName",
    "structure",
    "createdDate",
    "createdBy",
    "state",
    "collaborators",
    "config",
  ];

  /**
   * Users list table displayed columns
   */
  public static usersListColumns = [
    "username",
    "email",
    "typeUser",
    "role",
    "status",
    "createdAt",
    "edition",
  ];

  /**
   * Actives roles on the institution
   */
  public static usersRoles = [
    "Desarrollador(a)",
    "Asistente(a)",
    "Coordinador(a)",
    "Diseñador(a)",
    "Administrador(a)",
    "Promotor(a)",
    "Evaluador(a)",
    "Investigador(a)",
  ];

  /**
   * Actives types of users on the institution
   */
  public static userTypes = ["Administrador", "Colaborador"];
  /**
   * Calendar component colors for appoiments
   */
  public static CALENDAR_COLORS: any = {
    red: {
      primary: "#C52458",
      secondary: "#FAE3E3",
    },
    blue: {
      primary: "#0C2955",
      secondary: "#1e90ff",
    },
    green: {
      primary: "#043F41",
      secondary: "#007374",
    },
    yellow: {
      primary: "#EDB44F",
      secondary: "#FDF1BA",
    },
    purple: {
      primary: "#860E35",
      secondary: "#FAE3E3",
    },
  };
}
