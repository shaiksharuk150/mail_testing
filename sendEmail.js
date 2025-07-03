// const sgMail = require('@sendgrid/mail');
// const ejs = require('ejs');
// const fs = require('fs');
// const path = require('path');
// require('dotenv').config();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// async function sendWelcomeEmail(toEmail, data) {
//   try {
//     const templatePath = path.join(__dirname, 'templates', 'welcome.ejs');
//     const templateStr = fs.readFileSync(templatePath, 'utf-8');
//     const htmlContent = ejs.render(templateStr, data);

//     const msg = {
//       to: toEmail,
//       from: process.env.FROM_EMAIL,
//       subject: 'Welcome to Our Service!',
//       html: htmlContent,
//     };

//     await sgMail.send(msg);
//     console.log(`Email sent to ${toEmail}`);
//   } catch (error) {
//   if (error.response && error.response.body && error.response.body.errors) {
//     console.error('❌ SendGrid API Error:', error.response.body.errors);
//   } else {
//     console.error('❌ General Error:', error.message || error);
//   }
// }

// }

// module.exports = { sendWelcomeEmail };

require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const ejs = require("ejs");
const path = require("path");

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;

if (!SENDGRID_API_KEY || !FROM_EMAIL) {
  throw new Error("SENDGRID_API_KEY or FROM_EMAIL is missing in .env");
}

sgMail.setApiKey(SENDGRID_API_KEY);

async function sendWelcomeEmail(name, email, platform) {
  const templatePath = path.join(__dirname, "templates", "welcome.ejs");
  const htmlContent = await ejs.renderFile(templatePath, { name, platform });

  const msg = {
    to: email,
    from: FROM_EMAIL,
    subject: `Welcome to ${platform}`,
    html: htmlContent
  };

  await sgMail.send(msg);
}

async function sendDailyReportEmail(user) {
  const templatePath = path.join(__dirname, "templates", "dailyReport.ejs");
  const htmlContent = await ejs.renderFile(templatePath, user);

  const msg = {
    to: user.email,
    from: FROM_EMAIL,
    subject: `Your Daily Report - ${user.project}`,
    html: htmlContent
  };

  await sgMail.send(msg);
  console.log(`✅ Daily report sent to ${user.name}`);
}

async function sendDailyTeamReportEmail(teamData,manager) {
  const date = new Date().toLocaleString('en-IN', {
  timeZone: 'Asia/Kolkata',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
});
  const templatePath = path.join(__dirname, "templates", "teamReport.ejs");
  const htmlContent = await ejs.renderFile(templatePath, { 
    team: teamData,
    manager,
    date });

  const msg = {
    to: manager.email,
    from: FROM_EMAIL,
    subject: `Team Daily Report - ${manager.project}`,
    html: htmlContent
  };

  await sgMail.send(msg);
  console.log(`✅ Daily report sent to ${manager.name}`);
}


async function sendEndOfDayTeamReportEmail(teamData, manager) {
  const date = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const templatePath = path.join(__dirname, "templates", "eodTeamReport.ejs");
  const htmlContent = await ejs.renderFile(templatePath, {
    team: teamData,
    manager,
    date
  });

  const msg = {
    to: manager.email,
    from: FROM_EMAIL,
    subject: `End of Day Team Report - ${manager.project}`,
    html: htmlContent
  };

  await sgMail.send(msg);
  console.log(`📤 EOD report sent to ${manager.name}`);
}


module.exports = {
  sendWelcomeEmail,
  sendDailyReportEmail,
  sendDailyTeamReportEmail,
  sendEndOfDayTeamReportEmail
};
