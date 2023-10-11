module.exports = {
  mysqlBitacorasDS: {
    host: "18.218.192.250",
    port: 5206,
    url: "",
    database: process.env.WORKLOG_DB_NAME,
    password: process.env.EAW_DB_PASS,
    user: process.env.EAW_DB_OWNER,
    name: "mysqlBitacorasDS",
    connector: "mysql",
    charset: "utf8",
    collation: "utf8_general_ci",
  },
  storage: {
    name: "storage",
    connector: "loopback-component-storage",
    provider: "filesystem",
    root: "server/storage",
  },
  emailDs: {
    name: "emailDs",
    connector: "mail",
    transports: [
      {
        type: "SMTP",
        host: process.env.WORKLOG_MAIL_HOST,
        secure: true,
        port: process.env.WORKLOG_MAIL_PORT,
        auth: {
          user: process.env.WORKLOG_MAIL_USER,
          pass: process.env.WORKLOG_MAIL_PASS,
        },
      },
    ],
  },
};
