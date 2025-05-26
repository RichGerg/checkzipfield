# 🌐 Web Form Monitor with Azure Functions

A lightweight, serverless solution that checks a target webpage every hour to detect if a critical form field (e.g. ZIP code input) is missing. If the field is not found, the system sends an automatic email alert using SendGrid.

This tool is useful for detecting silent form failures or broken landing pages - especially those running paid traffic.

---

## 🚀 Features

- ✅ Runs automatically every hour via Azure Timer Trigger
- 🔍 Scans webpage HTML for presence of specific input field
- 📬 Sends real-time email alerts via SendGrid if field is missing or page errors
- ⚙️ Built using only native Node.js modules — no external packages required
- 💰 Free to run using Azure Consumption Plan + SendGrid Free Tier

---

## 🛠️ Tools & Technologies

- **Azure Functions** (JavaScript runtime, Timer Trigger)
- **Azure Blob Storage** (for schedule tracking and runtime state)
- **SendGrid API** (email alerts)
- **Node.js native modules**: `https`, `Promise`
- **CRON syntax** for hourly scheduling (`0 0 * * * *`)

---

## 🔧 How It Works

1. Azure Function is triggered every hour via CRON.
2. It fetches the HTML from the specified target URL.
3. Checks for the presence of a specific `input` field by name or ID.
4. If the field is missing (or page fails to load), it sends an email alert via SendGrid.
5. API key and settings are stored securely in Azure App Configuration.

---

## 🔑 Environment Variables (App Settings in Azure)

| Variable              | Description                   |
|-----------------------|-------------------------------|
| `SENDGRID_API_KEY`    | Your SendGrid API key         |

---

## 📌 Setup Instructions

1. Create a new Azure Function App (JavaScript, Timer Trigger).
2. Add Azure Blob Storage and connect it via `AzureWebJobsStorage`.
3. Paste `index.js` into your function's code editor.
4. Set up your SendGrid account and verify a sender email/domain.
5. Add `SENDGRID_API_KEY` to your Function App’s **Configuration → Application settings**.
6. Test manually using the Azure portal, or let it run on schedule.

---

## 🧪 Testing Tips

- Change the field name in the code to something fake to simulate a failure.
- Watch the Azure logs and verify email delivery from SendGrid.

---

## ⚠️ Known Limitations

- Does **not support `require()` packages like `axios` or `@sendgrid/mail`** when used via Azure portal UI.
- To use external libraries, you must deploy via VS Code or GitHub with a full function project and `package.json`.

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

## ✉️ Credits

Created by RichGerg - built as a lightweight client-side monitoring solution to support lead gen reliability during a high-traffic ad campaign.
