const STS = require('aws-sdk/clients/sts');

const sts = (() => {
  if (process.env.STAGE === 'e2e') {
    return new STS({
      endpoint: 'http://localstack:4566',
    });
  }
  return new STS();
})();

module.exports = {
  sts,
};