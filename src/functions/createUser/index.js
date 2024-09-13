module.exports = {
  handler: `./src/functions/createUser/handler.main`,
  name: '${self:custom.stackName}--create-user',
  events: [
    {
      http: {
        method: 'post',
        path: '/create-user',
      },
    },
  ],
};
