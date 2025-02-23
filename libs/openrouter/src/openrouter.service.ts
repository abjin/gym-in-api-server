import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenrouterService {
  private readonly openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  async validateGymImage(imageUrl: string): Promise<{ result: boolean }> {
    const completion = await this.openai.chat.completions.create({
      model: 'google/gemini-flash-1.5-8b',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are an AI that analyzes images to determine if they show a gym or fitness center. Respond with JSON format {result: true/false}.',
        },
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            {
              type: 'text',
              text: 'Is this image a gym?',
            },
          ],
        },
      ],
    });

    return JSON.parse(completion.choices[0].message.content);
  }
}
