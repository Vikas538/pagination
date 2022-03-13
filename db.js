const yaml = require("js-yaml");
let path = require("path");
const mysql = require("mysql");
const fs = require("fs");
const util = require("util");
class Db {
  constructor() {
    this.env = "dev";
    this.db_client = null;
    this.config = this.load_config();
  }

  load_config() {
    let config = [];
    try {
      let file = path.join(process.cwd(), "config.yml");
      let fileContents = fs.readFileSync(file, "utf8");
      config = yaml.load(fileContents);
    } catch (err) {
      console.log(`Exception in load_config method in Utils:`, err);
    }
    return config;
  }

  exception_message(exception) {
    console.log(exception);
  }

  error_db_connection(err) {
    console.log("db error", err);
    if (err.fatal && err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("closed the connection started ", started_at_timestamp);
      this.get_db_client();
    }
  }

  get_db_client() {
    console.log("Environment = ", this.env);
    if (this.env == "prod") {
      if (
        !this.db_client ||
        !this.db_client.state ||
        this.db_client.state === "disconnected"
      ) {
        try {
          this.db_client = mysql.createConnection({
            host: this.config["prod_host"],
            user: this.config["prod_username"],
            password: this.config["prod_password"],
            database: this.config["prod_db"],
            // connectTimeout: 24 * 60 * 60 * 1000,
            charset: "utf8",
          });
          this.db_client.on("error", this.error_db_connection.bind(this));
          this.query = util
            .promisify(this.db_client.query)
            .bind(this.db_client);
          if (this.query instanceof Error) return console.error(this.query);
          started_at_timestamp = moment().unix();
          return this.db_client;
        } catch (err) {
          log.error("Exception in get_db_client method in prod db_client");
          this.exception_message(err);
          return null;
        }
      } else return this.db_client;
    } else if (this.env == "dev") {
      if (
        !this.db_client ||
        !this.db_client.state ||
        this.db_client.state === "disconnected"
      ) {
        try {
          this.db_client = mysql.createConnection({
            host: this.config["dev_host"],
            user: this.config["dev_username"],
            password: this.config["dev_password"],
            database: this.config["dev_db"],
            // connectTimeout: 24 * 60 * 60 * 1000,
            charset: "utf8",
          });
          console.log(
            this.config["dev_host"],
            this.config["dev_username"],
            this.config["dev_password"],
            this.config["dev_db"]
          );
          this.db_client.on("error", this.error_db_connection.bind(this));
          this.query = util
            .promisify(this.db_client.query)
            .bind(this.db_client);
          if (this.query instanceof Error) return log.error(this.query);
          return this.db_client;
        } catch (err) {
          console.log("Exception in get_db_client method in dev db_client");
          this.exception_message(err);
          return null;
        }
      } else return this.db_client;
    }
  }

  close_db_client() {
    console.log("entered");
    if (this.db_client) {
      this.db_client.end((err) => {
        if (err) {
          return console.log("connection:" + err.message);
        }

        console.log("closed db connection");
      });
    }
    this.db_client = null;
  }

  async get_movies(query) {
    let rows = null;

    this.db_client = this.get_db_client();
    if (this.db_client) {
      if (!this.query) {
        this.query = util.promisify(this.db_client.query).bind(this.db_client);

        if (this.query instanceof Error) return log.error(this.query);
      }
      // log.info("query string----->", str);
      // let query = "SELECT * FROM movies";
      try {
        rows = await this.query(query);
        this.close_db_client();
      } catch (err) {
        console.log(err);
      }

      return rows;
    }
  }
}

module.exports = Db;
