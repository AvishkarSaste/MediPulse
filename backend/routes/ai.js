const express = require('express');
const OpenAI = require('openai');
const auth = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI (if API key is provided)
const openai = process.env.AI_API_KEY ? new OpenAI({
  apiKey: process.env.AI_API_KEY,
}) : null;

// AI Report Summarization
router.post('/summarize-report', auth, async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ 
        message: 'AI services not available. Please configure OpenAI API key.' 
      });
    }

    const { reportText, reportType } = req.body;

    const prompt = `Please summarize the following ${reportType || 'medical'} report in patient-friendly language. 
    Focus on key findings, recommendations, and any important medical terms that need explanation:

    ${reportText}

    Please provide:
    1. A clear summary of the main findings
    2. Any recommendations or next steps
    3. Explanation of any complex medical terms`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.3
    });

    res.json({
      summary: completion.choices[0].message.content,
      originalReport: reportText
    });
  } catch (error) {
    console.error('AI summarization error:', error);
    res.status(500).json({ message: 'Error processing report with AI' });
  }
});

// AI FAQ Chat
router.post('/chat', auth, async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ 
        message: 'AI services not available. Please configure OpenAI API key.' 
      });
    }

    const { message, context } = req.body;

    const systemPrompt = `You are a helpful medical assistant for MediPulse. 
    Provide helpful, accurate, and patient-friendly responses to medical questions. 
    Always remind users to consult with healthcare professionals for serious concerns.
    Context: ${context || 'General medical inquiry'}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    res.json({
      response: completion.choices[0].message.content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: 'Error processing chat message' });
  }
});

// Explain Medical Terms
router.post('/explain-terms', auth, async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ 
        message: 'AI services not available. Please configure OpenAI API key.' 
      });
    }

    const { terms } = req.body;

    const prompt = `Please explain the following medical terms in simple, patient-friendly language:
    ${terms.join(', ')}

    For each term, provide:
    1. A simple definition
    2. What it means for the patient
    3. Any related information that might be helpful`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
      temperature: 0.3
    });

    res.json({
      explanations: completion.choices[0].message.content,
      terms: terms
    });
  } catch (error) {
    console.error('AI term explanation error:', error);
    res.status(500).json({ message: 'Error explaining medical terms' });
  }
});

module.exports = router;
