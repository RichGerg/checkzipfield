const https = require('https');

// Azure Timer Function checks webpage every hour
module.exports = async function (context, myTimer) {
    const url = 'https://domain.com/webpage/';
    let html = '';

    try {
        html = await new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data));
            }).on('error', reject);
        });

        // Change this to test the alert, otherwise ensure the name matches the id on the webpage
        const fieldFound = html.includes('name="name-of-zip-form-field-id"');

        if (!fieldFound) {
            context.log('❗ ZIP code field not found! Sending email...');
            await sendAlertEmail(`ZIP code field is missing on ${url}`);
        } else {
            context.log('✅ ZIP code field is present. No action needed.');
        }

    } catch (err) {
        context.log.error('⚠️ Error fetching the page:', err.message);
        await sendAlertEmail(`Error checking page: ${err.message}`);
    }
};

// sendAlertEmail function (no SendGrid package required)
async function sendAlertEmail(message) {
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
	// define the email addresses
    const data = JSON.stringify({
        personalizations: [{
            to: [{ email: "me@email.com" }],
            subject: "Form Field Alert"
        }],
        from: { email: "alert@email.com" },
        content: [{
            type: "text/html",
            value: `<strong>${message}</strong>`
        }]
    });

    const options = {
        hostname: 'api.sendgrid.com',
        path: '/v3/mail/send',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sendgridApiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let result = '';
            res.on('data', chunk => result += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('✅ Email sent successfully');
                    resolve();
                } else {
                    console.error(`❌ Failed to send email: ${res.statusCode} - ${result}`);
                    reject(new Error(result));
                }
            });
        });

        req.on('error', (e) => {
            console.error('❌ Error during SendGrid request:', e.message);
            reject(e);
        });

        req.write(data);
        req.end();
    });
}
// JavaScript Document