import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: "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" });

export async function POST(request: Request) {
  try {
    const { language, text } = await request.json();
    console.log('language:', language);
    console.log('text:', text);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          'role': 'system',
          'content': `
          You will be provided with a sentence. Your tasks are to:
          - Detect what language the sentence is in
          - Translate the sentence into ${language}
          Do not return anything other than the translated sentence.
        `,
        },
        {
          'role': 'user',
          'content': text,
        },
      ],
      temperature: 0.7,
      max_tokens: 64,
      top_p: 1,
    });

    return NextResponse.json({
      text: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error handling POST request:', error);

    return NextResponse.json({
      message: 'Error processing request',
      // error,
    }, { status: 400 });
  }
}

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     res.status(200).json({ message: 'Hello from Next.js!' })
//     // Process a POST request
//   } else {
//     // Handle any other HTTP method
//   }
// }

// export async function POST(request: Request) {
//   const { language, text } = await request.json();
//
//   const response = await openai.chat.completions.create({
//     model: 'gpt-4o-mini',
//     messages: [
//       {
//         'role': 'system',
//         'content': `
//           You will be provided with a sentence. Your tasks are to:
//           - Detect what language the sentence is in
//           - Translate the sentence into ${language}
//           Do not return anything other than the translated sentence.
//         `,
//       },
//       {
//         'role': 'user',
//         'content': text,
//       },
//     ],
//     temperature: 0.7,
//     max_tokens: 64,
//     top_p: 1,
//   });
//
//   return NextResponse.json({
//     text: `${language} : ${text}`,
//   });
// }
