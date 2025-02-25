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
            'You are an AI that analyzes images to determine if they show a real, physical gym or fitness center currently in operation. Photos of gyms or drawings/illustrations of gyms should return {result: false}. Only return {result: true} if the image shows a real, operating gym or fitness center in its actual physical space. Respond with JSON format {result: true/false}.',
        },
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            {
              type: 'text',
              text: 'Is this image showing a real, operating gym (not a photo or drawing of a gym)?',
            },
          ],
        },
      ],
    });

    return JSON.parse(completion.choices[0].message.content);
  }
}
