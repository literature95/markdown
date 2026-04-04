import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import axios from 'axios';

const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const isAIEnabled = Boolean(OPENAI_API_KEY);

router.use(authenticateToken);

router.use('/ai', (req, res, next) => {
  if (!isAIEnabled) {
    return res.status(503).json({
      error: 'AI功能未启用',
      details: '请在环境变量中配置 OPENAI_API_KEY 以启用AI功能',
      hint: '在 .env 文件中添加: OPENAI_API_KEY=your-api-key'
    });
  }
  next();
});

router.post('/ai/complete', async (req, res) => {
  try {
    const { prompt, content } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
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
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      completion: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error('AI completion error:', error);
    res.status(500).json({
      error: 'AI completion failed',
      details: error.response?.data?.error?.message || 'Unknown error'
    });
  }
});

router.post('/ai/summarize', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes Markdown content. Provide concise summaries.'
          },
          {
            role: 'user',
            content: `Summarize the following content:\n\n${content}`
          }
        ],
        temperature: 0.5
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      summary: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error('AI summarize error:', error);
    res.status(500).json({
      error: 'AI summarization failed',
      details: error.response?.data?.error?.message || 'Unknown error'
    });
  }
});

export default router;
