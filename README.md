<div align="center">

  # 🤖 AI Code Reviewer
  ### **Your Intelligent Coding Companion**

  ![Version](https://img.shields.io/badge/version-2.0.0-blue.svg?style=for-the-badge)
  ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
  ![Gemini AI](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
  ![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)

  <p align="center">
    <strong>Analyze, Debug, Share, and Save your code instantly using the power of Google's Gemini AI.</strong>
    <br />
    <br />
    <a href="#-demo">View Demo</a>
    ·
    <a href="#-run-locally">Run Locally</a>
    ·
    <a href="https://github.com/Rishi1364/ai-code-reviewer/issues">Report Bug</a>
  </p>
</div>

---

## **📖 About The Project**

**AI Code Reviewer** is a sophisticated development tool designed to elevate your coding workflow. By leveraging **Google's Gemini AI**, this application acts as your personal pair programmer.

It goes beyond simple analysis — offering **secure user authentication**, a **persistent history** of your past reviews, and the ability to **share your code snippets** with the world instantly.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🔐 Secure Authentication** | Sign in securely using **Google Authentication**, ensuring data safety with support for multiple accounts and seamless switching. |
| **📜 Intelligent History Management** | Automatically **stores all code reviews in the cloud**, allowing users to view, manage, and delete previous analyses anytime. |
| **📤 One-Click Sharing** | Instantly share code reviews via **WhatsApp, Telegram, LinkedIn**, or through a secure sharable link. |
| **🧠 AI-Powered Code Review** | Performs deep analysis to detect **bugs, logic flaws, security vulnerabilities**, and provides a quality score (1–10) with improvement suggestions. |
| **⚡ Instant Auto-Fix** | Automatically generates **optimized and corrected code**, resolving detected issues in a single click. |
| **📊 Complexity Analysis** | Calculates **Time & Space Complexity (Big O Notation)** to ensure efficient and optimized algorithms. |
| **📝 Smart Auto-Documentation** | Generates **clean, professional documentation, comments, and docstrings** to clearly explain code logic. |
| **🔄 Multi-Language Code Converter** | Converts code seamlessly across programming languages (e.g., **Java → Python**, **JavaScript → C++**, and more). |
| **🌗 Dark & Light Mode UI** | Fully responsive, modern **glassmorphism-inspired interface** with smooth switching between light and dark themes for better user experience. |

---


---

## **📸 Screenshots**

<div align="center">
  <h3>Dark Mode & Analysis</h3>
  <img src="./assets/screenshot-dark.png" alt="Dark Mode" width="80%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.5);">
  <br/><br/>
  <h3>History & Login Panel</h3>
  <img src="./assets/screenshot-history.png" alt="History Panel" width="80%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
</div>

---

## **🛠️ Tech Stack**

This project is built using a modern, scalable stack:

### **Frontend**
* ![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB) **React.js** - Component-based UI.
* ![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=flat&logo=firebase&logoColor=white) **Firebase** - Authentication & Firestore Database.
* ![Axios](https://img.shields.io/badge/axios-671ddf?style=flat&logo=axios&logoColor=white) **Axios** - API requests.
* **Framer Motion** - Smooth animations.
* **Monaco Editor / UIW** - Professional code editing experience.

### **Backend**
* ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white) **Node.js** - Runtime environment.
* ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=flat&logo=express&logoColor=%2361DAFB) **Express.js** - Server framework.
* **Google Generative AI** - The brain behind the reviews.

---

## **🚀 Run Locally**

Follow these simple steps to set up the project on your machine.

### **Prerequisites**
* **Node.js** (v18 or higher)
* **npm**
* A valid **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).
* A **Firebase Project** setup (for Auth & Database).

### **1. Clone the Repository**
```bash
git clone [https://github.com/Rishi1364/ai-code-reviewer.git](https://github.com/Rishi1364/ai-code-reviewer.git)
cd ai-code-reviewer
```

**2.Configure the Backend**

- Navigate to the server directory:
```bash
  cd ai-code-reviewer/server
```

- Install Server dependencies:

```bash
  npm install
```
- Create a ``` .env ``` file inside server and add your credentials:
```bash
  GEMINI_API_KEY=YOUR_API_KEY_HERE
  PORT=5000
```
- Start the backend server:
```bash
  node index.js
```
**3.Configure the Frontend :**

- Open new terminal and Navigate to the client directory:
```bash
  cd ai-code-reviewer/client 
```
- Install client dependencies:

```bash
  npm install
```
Start the React development server:
```bash
  npm start
```
The application will open automatically in your browser at http://localhost:3000.




## **✍️ Author**

Rushikesh Kale 
- **LinkedIn:** [Rushikesh-kale](https://www.linkedin.com/in/rushikesh-kale-8749502b4/)
- **GitHub:** [Rushikesh_kale](https://github.com/Rishi1364)



