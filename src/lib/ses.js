const SES = require('aws-sdk/clients/ses');

const ses = (() => {
  if (process.env.STAGE === 'e2e') {
    return new SES({
      endpoint: 'http://localstack:4566',
    });
  }
  return new SES();
})();

module.exports = {
  ses,
};