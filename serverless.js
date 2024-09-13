const functions = require('./src/functions');

const config = {
  service: 'cognito-ses',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: [
    'serverless-localstack',
  ],
  provider: {
    name: 'aws',
    stage: '${self:custom.stage}',
    region: '${self:custom.region}',
    stackName: '${self:custom.stackName}',
    runtime: 'nodejs18.x',
    timeout: 30,
    environment: {
      STAGE: '${self:custom.stage}',
      REGION: '${self:custom.region}',
      END_USER_COGNITO_USER_POOL: {
        Ref: 'EndUserCognitoUserPool',
      },
      END_USER_COGNITO_USER_POOL_CLIENT: {
        Ref: 'EndUserCognitoUserPoolClient',
      },
    },
    iam: {
      role: {
        name: '${self:custom.stackName}--execution-role',
        statements: [
          {
            Effect: "Allow",
            Action: "*",
            Resource: "*",
          },
        ],
      },
    },
  },
  custom: {
    stage: "${env:STAGE, 'e2e'}",
    stackName: '${self:custom.stage}--cognito-ses',
    region: "us-west-2",
    localstack: {
      host: 'http://localhost',
      stages: [
          'e2e',
      ],
    },
  },
  resources: {
    Resources: {
      EndUserCognitoUserPool: {
        Type: 'AWS::Cognito::UserPool',
        Properties: {
          UserPoolName: '${self:custom.stackName}--EndUserCognitoUserPool',
          AdminCreateUserConfig: {
            AllowAdminCreateUserOnly: false,
          },
          AliasAttributes: ['email'],
          Policies: {
            PasswordPolicy: {
              MinimumLength: 8,
              RequireLowercase: false,
              RequireNumbers: true,
              RequireSymbols: true,
              RequireUppercase: false,
            },
          },
          Schema: [
            {
              AttributeDataType: 'String',
              Mutable: true,
              Name: 'email',
              Required: true,
            },
          ],
        },
      },
      EndUserCognitoUserPoolClient: {
        Type: 'AWS::Cognito::UserPoolClient',
        Properties: {
          UserPoolId: {
            Ref: 'EndUserCognitoUserPool',
          },
          ClientName: '${self:custom.stackName}--EndUserCognitoUserPoolClient',
          ExplicitAuthFlows: [
            'ALLOW_ADMIN_USER_PASSWORD_AUTH',
            'ALLOW_REFRESH_TOKEN_AUTH',
            'ALLOW_CUSTOM_AUTH',
            'ALLOW_USER_SRP_AUTH',
            'ALLOW_USER_PASSWORD_AUTH',
          ],
          GenerateSecret: false,
          RefreshTokenValidity: '7',
          TokenValidityUnits: { RefreshToken: 'days' },
        },
      },
    },
  },
  functions,
};


module.exports = config;