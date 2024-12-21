import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai'

const Message = `
## 要求事項
- アイスブレイクのお題を1つ生成し、生成した結果のみを出力してください。
- ただし、下記履歴と同様のお題は除外していてください。

## 履歴
`

export const server = {
  myAction: defineAction({
    handler: async (input: string[]) => {
      const apiKey = import.meta.env.GOOGLE_AI_API_KEY
      const genAI = new GoogleGenerativeAI(apiKey)

      const model = genAI.getGenerativeModel({
        model: import.meta.env.GOOGLE_AI_MODEL,
      })

      const generationConfig = {
        temperature: 2,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      }

      const chatSession = model.startChat({
        generationConfig,
        history: [],
      })
      const sendMessage = Message + '- ' + input.join('- ')

      const result = await chatSession.sendMessage(sendMessage)
      return result.response.text()
    },
  }),
}
