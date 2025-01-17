// Load environment variables from .env file
import dotenv from 'dotenv';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
const port = 3001;

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// function encodeImage(imagePath) {
//   const image = fs.readFileSync(imagePath);
//   return image.toString('base64');
// }

app.post('/openai', async (req, res) => {
  try {

    const { image } = req.body;
    // const base64Image = encodeImage(image);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze the image of the animal provided in the request. Return the following details as a single line of comma-separated values: Animal Name, Species, Endangered Level, short desciption without any commas. Make sure there is no additional text, just the CSV data." },
            {
              type: "image_url",
              image_url: {
                "url": `${image}`,
              },
            },
          ],
        },
      ],
    });
    
    res.json(response.choices[0]);

  } catch (error) {
    console.error('Error during label detection:', error);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
