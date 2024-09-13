# Steps to reproduce:
## Localstack environment
1. Run `LOCALSTACK_API_KEY={your_api_key} npm run localstack`
2. Run `npm run deploy` to run deployment against localstack
3. Run `docker ps`, copy container id of `localstack/localstack-pro`, connect ot the container `docker exec -it {container_id} /bin/bash`. Perform step 4-6 inside of the container
4. Run `awslocal ses verify-email-identity --email-address {your email address}`
5. Get user pools `awslocal cognito-idp list-user-pools --max-results 10 --region us-west-2`, copy EndUserCognitoUserPool user pool id
6. Update user pool email config `awslocal cognito-idp update-user-pool --email-configuration SourceArn=arn:aws:ses:us-west-2:000000000000:identity/{email address from verification step},EmailSendingAccount=DEVELOPER,From={email address from verification step} --user-pool-id {user pool id from previous step} --region us-west-2`
7. Create a user by sending a POST request to `{api_url}/create-user` with the following payload (Body):
```
{
    "email": "test1@email.com",
    "password": "Password1!"
}
```
8. Get sent emails by sending a GET request to `http://localhost:4566/_aws/ses?region=us-west-2`
An empty array is returned, instead of a message sent by SES.

## Live environment
9. Run deployment against a live environment. E.g. `AWS_PROFILE=your_profile STAGE=dev npm run deploy`
10. Run `aws ses verify-email-identity --email-address {your email address}`
11. Verify your email that you specified. AWS should send a message to the email with a verification link
12. Get user pools `aws cognito-idp list-user-pools --max-results 10 --region us-west-2`, copy EndUserCognitoUserPool user pool id
13. Update EndUserCognitoUserPool email config `aws cognito-idp update-user-pool --email-configuration SourceArn=arn:aws:ses:us-west-2:{your aws account id}:identity/{email address from verification step},EmailSendingAccount=DEVELOPER,From={email address from verification step} --user-pool-id {user pool id from previous step} --region us-west-2`
14. Create a user by sending a POST request to `{api_url}/create-user` with the following payload (Body):
```
{
    "email": {your email address},
    "password": "Password1!"
}
```
15. Check your email, a message from SES should appear