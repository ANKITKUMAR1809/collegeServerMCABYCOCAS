const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.postChat = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
        });

        const reply = completion.choices[0].message.content;
        return res.status(200).json({ reply });
    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        res.status(500).json({ message: 'Failed to get response from OpenAI' });
    }
};
