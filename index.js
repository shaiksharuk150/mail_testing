// const { sendWelcomeEmail } = require('./sendEmail');

// // Type your recipient's email address here 👇
// sendWelcomeEmail(
//   'shaiksharuk5858@gmail.com', // <- Change this to your own or test email
//   {
//     name: 'Shaik Sharuk',     // This name will be used in the email template
//     platform: 'My Test App'   // This shows where they signed up
//   }
// );

// 2nd version



// const { sendWelcomeEmail } = require('./sendEmail');

// sendWelcomeEmail(
//   'shaiksharuk150@gmail.com', // recipient email
//   {
//     name: 'Shaik Sharuk',
//     platform: 'Redifine ERP'
//   }
// );


// 3rd version

const express = require("express");
const path = require("path");
const serverless = require("serverless-http"); 
const { sendDailyReportEmail,sendDailyTeamReportEmail,sendEndOfDayTeamReportEmail } = require("./sendEmail");
const users = require("./mockData");

const app = express();
const PORT = 3000;

// Parse JSON body
app.use(express.json());


// Parse form data (URL-encoded)
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));



app.post("/send-daily-reports", async (req, res) => {
  try {
    for (const user of users) {
      await sendDailyReportEmail(user);
    }
    res.send("✅ All daily reports sent!");
  } catch (err) {
    console.error("❌ Error sending reports:", err);
    res.status(500).send("❌ Failed to send some or all reports.");
  }
});

app.get("/hello", (req, res) => {
  console.log('hello')
  res.send("Hello, World!")
  
})

app.post("/send-daily-team-reports", async (req, res) => {
  console.log('team task to manager',req.body)
  const { teamData,manager } = req.body;

  try {
      await sendDailyTeamReportEmail(teamData,manager);
    
    res.send("✅ All team reports sent!");
  } catch (err) {
    console.error("❌ Error sending reports:", err);
    res.status(500).send("❌ Failed to send some or all reports.");
  }
});


app.post("/send-eod-team-reports", async (req, res) => {
  const { teamData, manager } = req.body;
  try {
    await sendEndOfDayTeamReportEmail(teamData, manager);
    res.send("✅ End-of-Day report sent!");
  } catch (err) {
    console.error("❌ Failed to send EOD report:", err);
    res.status(500).send("Failed to send EOD report.");
  }
});


if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
} else {
  module.exports = app; // optional if testing locally
  module.exports.handler = serverless(app); // 👈 required for Vercel
}
