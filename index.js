let response;
const validUrl = require('valid-url');
const chromium = require('chrome-aws-lambda');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk')
const fs = require("fs");
AWS.config.update({ region: 'ap-south-1' })
const bucketName = process.env.UploadBucket;
const s3 = new AWS.S3({ bucketName: bucketName });
let browser = null;
let buffer = null;


// overall constants
const screenWidth = 1920;
const screenHeight = 1080;
const prefix = 'screenshots/';

/**
 * @param {T|string} targetUrl
 * @param {string} image_path_prefix
 */
const getScreenshot = async (targetUrl, image_path_prefix) => {
    try{
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
        const page = await browser.newPage();
        const image_name = image_path_prefix+uuidv4()+"-"+new Date().getTime()+'.png';
        await page.setViewport({
            width: screenWidth,
            height: screenHeight,
            deviceScaleFactor: 1,
        });
        await page.goto(targetUrl, {
            waitUntil: 'networkidle0',
        });
        buffer = await page.screenshot();
        return {
            'name': image_name,
            'buffer': buffer,
        };

    } catch (error) {
        console.log("Something went wrong during getScreenshot");
        console.log(error)
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
};

async function uploadToS3(name, buffer, image_path_prefix) {
    let upload = null;
    const params = {
        Bucket: process.env.UploadBucket,
        Key: name,
        Body: buffer,
        ContentType: 'image/png',
    };
    upload = await s3.upload(params).promise();
    console.log("uploaded filed response",upload);
    return upload;
}

/**
 *
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 * @param {Object} context
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.handler = async (event, context) => {
    console.log(event);
    const targetUrl =  event.queryStringParameters.url ||  "https://www.google.com";
    // check if the given url is valid
    if (!validUrl.isUri(targetUrl)) {
        response = {
            'statusCode': 422,
            'body': JSON.stringify({
                message: "Invalid Url: Please provide a valid url, not:"+targetUrl,
            })
        }
    }

    try {
        let response = await getScreenshot(targetUrl, prefix);
        let getUploadedFile = await uploadToS3(response.name, response.buffer, prefix);
        response = {
            'statusCode': 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers":"*"
            },
            'body': JSON.stringify({
                message: {
                    "response" : "Screenshot successfully taken for your domain",
                    "image_key": getUploadedFile.Key,
                    "image_path": getUploadedFile.Location
                },

            })
        }

        //console.log("response", response);

        return response

    } catch (err) {
        console.log(err)
        response = {
            'statusCode': 500,
            'body': JSON.stringify({
                message: 'RenderingFailed : Unable to generate screenshot. Please contact administrator',
            })
        }
    }
    return response
};


