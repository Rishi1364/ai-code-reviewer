// Simple Express server that wraps Google Generative AI (Gemini) functionality.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
// 1. Enable CORS for your Vercel Frontend
app.use(cors({
    origin: ["https://ai-code-reviewer-21xj.vercel.app", "http://localhost:3000"], // Allow both Live and Local
    methods: ["GET", "POST"],
    credentials: true
}));

// 2. Parse JSON bodies
app.use(express.json());

// --- Initialize Google Generative AI ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Test Route ---
app.get('/', (req, res) => {
    res.send('AI Code Reviewer Backend is Running! 🚀');
});

// --- API Endpoint: /review (Fixed: Removed '/api') ---
app.post('/review', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ error: 'Code is required.' });

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `
            🧑‍💻 Please act as an expert code reviewer.
            Analyze the following code snippet and provide structured feedback using markdown formatting.

            Start with:
            - 🧠 **Programming Language**
            - 🌟 **Code Quality Rating** (out of 10)

            Then review: Bugs, Performance, Best Practices, and Improvements.

            Code Snippet:
            \`\`\`
            ${code}
            \`\`\`
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const reviewText = response.text();
        res.json({ review: reviewText });

    } catch (error) {
        console.error("Error in /review:", error);
        res.status(500).json({ error: error.message || 'Failed to get review.' });
    }
});

// --- API Endpoint: /fix (Fixed: Removed '/api') ---
app.post('/fix', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ error: 'Code is required.' });

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `
            Act as an expert programmer. Fix bugs in this code.
            Response ONLY with the corrected code in a single markdown block.
            \`\`\`
            ${code}
            \`\`\`
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let fixedCodeText = response.text();
        const cleanedCode = fixedCodeText.replace(/```[a-zA-Z0-9+\-]*\n?/g, '').replace(/```/g, '').trim();
        res.json({ fixedCode: cleanedCode });

    } catch (error) {
        console.error("Error in /fix:", error);
        res.status(500).json({ error: 'Failed to fix code.' });
    }
});

// --- API Endpoint: /complexity (Fixed: Removed '/api') ---
app.post('/complexity', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ error: 'Code is required.' });

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `
            Analyze time and space complexity of this code in markdown format.
            \`\`\`
            ${code}
            \`\`\`
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const analysisText = response.text();
        res.json({ analysis: analysisText });

    } catch (error) {
        console.error("Error in /complexity:", error);
        res.status(500).json({ error: 'Failed to analyze complexity.' });
    }
});

// --- API Endpoint: /document (Fixed: Removed '/api') ---
app.post('/document', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ error: 'Code is required.' });

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `
            Generate clean markdown documentation for this code.
            \`\`\`
            ${code}
            \`\`\`
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const documentedCode = response.text();
        res.json({ documentation: documentedCode });

    } catch (error) {
        console.error("Error in /document:", error);
        res.status(500).json({ error: 'Failed to generate documentation.' });
    }
});

// --- API Endpoint: /convert (Fixed: Removed '/api') ---
app.post('/convert', async (req, res) => {
    try {
        const { code, sourceLanguage, targetLanguage } = req.body;
        if (!code || !sourceLanguage || !targetLanguage) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `
            Convert this ${sourceLanguage} code to ${targetLanguage}.
            Respond ONLY with code.
            \`\`\`
            ${code}
            \`\`\`
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let convertedText = response.text();
        convertedText = convertedText.replace(/```[a-zA-Z0-9+\-]*\n?/g, '').replace(/```/g, '').trim();
        res.json({ convertedCode: convertedText });

    } catch (error) {
        console.error("Error in /convert:", error);
        res.status(500).json({ error: 'Failed to convert code.' });
    }
});

// --- Start server ---
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});