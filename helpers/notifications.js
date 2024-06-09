/*
    Title: Uptime Monitoring API (Sending Notifications)
    Author: Monayem Hossain Limon
*/

// dependencies
const https = require("https");
const { twilio } = require("./environments");

// App Object - Module Scaffolding
const notifications = {};

// Send SMS to user with Twilio
notifications.sendTwilioSms = (phone, msg, callback) => {
  const userPhone =
    typeof phone === "string" && phone.trim().length === 11
      ? phone.trim()
      : false;

  const userMsg =
    typeof msg === "string" &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg.trim()
      : false;

  if (userPhone && userMsg) {
    // Configure the request payload
    const payload = {
      From: twilio.fromPhone,
      To: `+880${userPhone}`,
      Body: userMsg,
    };

    // Stringify the payload
    const stringPayload = JSON.stringify(payload);

    // Configure the request details
    const requestDetails = {
    //   protocol: "https:",
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
      auth: `${twilio.accountSid}:${twilio.authToken}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Content-Length": Buffer.byteLength(stringPayload),
      },
    };

    // Instantiate the request object
    const req = https.request(requestDetails, (res) => {
        // Get the status code
      const status = res.statusCode;
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`Error: Status code returned was ${status}`);
      }
    });

    // Bind to the error event so it doesn't get thrown
    req.on("error", (e) => {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();

  } else {
    callback("Error: Missing required fields");
  }
};

// Module Export
module.exports = notifications;
