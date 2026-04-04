const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const axios = require('axios');

const router = express.Router();

router.use(authenticateToken);

router.post('/ai/complete', async (req, res) => {
  try {
    const { prompt, content } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that helps users with their Markdown content. Provide concise and relevant responses.'
          },
          {
            role: 'user',
            content: `${prompt}\n\nCurrent content:\n${content || ''}`
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      completion: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error('AI completion error:', error);
    res.status(500).json({ error: 'AI completion failed' });
  }
});

router.post('/ai/summarize', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes Markdown content. Provide a concise summary of the given content.'
          },
          {
            role: 'user',
            content: `Summarize the following Markdown content:\n\n${content}`
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      summary: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error('AI summarize error:', error);
    res.status(500).json({ error: 'AI summarize failed' });
  }
});

router.post('/ai/improve', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that improves Markdown content. Enhance the given content for clarity, grammar, and readability while preserving the original meaning.'
          },
          {
            role: 'user',
            content: `Improve the following Markdown content:\n\n${content}`
          }
        ],
        temperature: 0.5
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      improved: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error('AI improve error:', error);
    res.status(500).json({ error: 'AI improve failed' });
  }
});

module.exports = router;