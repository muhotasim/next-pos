module.exports = {
    development: {
      client: 'sqlite3',
      connection: {
        filename: './data/db.sqlite'
      },
      useNullAsDefault: true
    }
  };