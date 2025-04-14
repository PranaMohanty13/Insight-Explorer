# Insight-Explorer

Insight Explorer is an interactive AI-powered dashboard designed for non-technical users. The application empowers non-technical users to effortlessly analyze call campaign performance using an intuitive time-series graph. Users can highlight or circle specific anomalies on the graph and click the "Investigate" button. This action triggers a backend process that retrieves relevant data—such as call transcripts and campaign descriptions—and then leverages the DeepSeek API to generate a comprehensive report explaining the changes. The report provides actionable insights, key quotes, and recommendations, enabling users to understand the reasons behind performance shifts and make informed decisions.


![insight-explorer-demo](https://github.com/user-attachments/assets/8bdc2b8a-cf0d-48d3-ad85-aef221646bea)


# 🚀 Insight-Explorer

A visual platform for analyzing campaign sentiment and investigating patterns interactively.

---

## ⚙️ Quick Start

Follow the steps below to get the app running locally.

---

### ✅ Prerequisites

Make sure you have the following installed:

- [Node.js & npm](https://nodejs.org/)
- [Docker Desktop (running)](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/)

---

### 📥 1. Clone the Repository


`git clone https://github.com/PranaMohanty13/Insight-Explorer.git`

`cd insight-explorer`

### 📦 2. Install Dependencies
`npm install`

### 📝 3. Create Environment File
Create a .env file in the project root and add the following:
I have sent you the .env file

### 🐳 4. Start the Database
`docker compose up -d`

### 🔧 5. Generate Prisma client
`npx prisma generate`

### 🔄 6. Push Prisma Schema
`npx prisma db push`

### 🌱 7. Seed the Database
`npx tsx seed.ts`

### 🧪 8. Run the App
`npm run dev`


