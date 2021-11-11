# Serverless Screen Grab Service
A serverless solution to screen grab a website and send it to a S3 bucket.

## Screenshot

![Imgur](https://i.imgur.com/I7GvBSi.jpg)

![Imgur](https://i.imgur.com/gudx4k9.jpg)

![Imgur](https://i.imgur.com/UqaVVQR.jpg)

![Imgur](https://i.imgur.com/YNtbEjA.jpg)

# Under the hood

1. [Serverless Framework](https://serverless.com/framework/)
2. [AWS SDK](https://aws.amazon.com/sdk-for-javascript/)
3. [Puppeteer Package](https://www.npmjs.com/package/puppeteer)
4. [Chrome Headless](https://www.google.com/chrome/browser/desktop/index.html)
5. [S3](https://aws.amazon.com/s3/)

# Service Setup

1. Clone the repo
2. Install the dependencies
3. Setup aws-cli locally on your system.
4. Setup serverless locally on your system.
5. Edit `serverless.yml` and replace the `<your-bucket-name>` with your S3 bucket name
6. Edit `serverless.yml` and replace the `<your-service-name>` with your service name.
7. Edit `serverless.yml` and replace the `<your-region>` with your region.
8. Once you have setup the serverless environment, run `make deploy` to deploy your service.
9. This will output the URL of your service.
   `Your service is deployed at: https://<your-service-name>.execute-api.<your-region>.amazonaws.com/grab`

# Usage

1. Open any browser and navigate to the URL of your service.
2. The service will take a screenshot of the page and send it to your S3 bucket.
3. You can now access the screenshot from your S3 bucket.
4. You can also access the screenshot from your browser.

```
GET : https://<your-service-name>.execute-api.<your-region>.amazonaws.com/grab=https://www.google.com

url: https://www.google.com
```

# Local Testing

1. To invoke the service locally, run `npm run invoke`
2. You can modify the event payload to test different scenarios from `./events/event.json` file.
3. To modify the invoke command, edit the `invoke` script from `package.json` file.
4. Make sure to keep the function name in `serverless.yml` and `package.json` `invoke` function same.

# Author

[Sagar Chauhan](https://twitter.com/sagarchauhan005) works as a Project Manager - Technology at [Greenhonchos](https://www.greenhonchos.com).
In his spare time, he hunts bug as a Bug Bounty Hunter.
Follow him at [Instagram](https://www.instagram.com/sagarchauhan005/), [Twitter](https://twitter.com/sagarchauhan005),  [Facebook](https://facebook.com/sagar.chauhan3),
[Github](https://github.com/sagarchauhan005)

# License
MIT
