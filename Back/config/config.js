require('dotenv').config()
const { DB_HOST, DB_USERNAME, DB_PASSWORD,DB_DATABASE,dialect } = process.env;

module.exports = {
  "development": {
    "username":DB_USERNAME,
    "password":DB_PASSWORD,
    "database":DB_DATABASE,
    "host":DB_HOST,
    "dialect":dialect
  },
  "test": {
    "username":DB_USERNAME,
    "password":DB_PASSWORD,
    "database":DB_DATABASE,
    "host":DB_HOST,
    "dialect":dialect
  },
  "production": {
    "username":DB_USERNAME,
    "password":DB_PASSWORD,
    "database":DB_DATABASE,
    "host":DB_HOST,
    "dialect":dialect
  }
}

