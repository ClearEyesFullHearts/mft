const logsReceived = require('./actions/logging');
const warningLogsReceived = require('./actions/warning');
const failureLogsReceived = require('./actions/failure');
const errorLogsReceived = require('./actions/error');

module.exports = {
  logsReceived,
  warningLogsReceived,
  failureLogsReceived,
  errorLogsReceived,
};
