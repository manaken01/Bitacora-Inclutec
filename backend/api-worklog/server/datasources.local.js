module.exports = {
  mysqlBitacorasDS: {
    host: "localhost",
    port: 3306,
    url: "",
    database: "ds_inclutec_bitacoras",
    password: "1234",
    user: "root",
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
