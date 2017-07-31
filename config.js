exports.environment = {
  runCronJobs: false,
  type: '',
  port: 2065
};

exports.database = {
  mysql: {
    host: '',
    port: 3306,
    user: '',
    password: '',
    database: 'vynote',
    connectionLimit: 100,
    waitForConnections: true
  },
  redis: {
    host: '',
    port: 6379,
    auth_pass: ''
  },
  redisPool: {
    max: 5,
    min: 1
  }
};

exports.address = {
  xacc: '',
  xad: ''
};

exports.keys = {
  accessToken: '',
  stripe: '',
  xacc: '',
};