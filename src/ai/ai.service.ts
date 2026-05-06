import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'ANGRY' | 'CONFUSED';
@Injectable()
export class AiService {
  private client: OpenAI | null;
  constructor(private config: ConfigService) { const key = config.get<string>('OPENAI_API_KEY'); this.client = key ? new OpenAI({ apiKey: key }) : null; }
  async generateSupportReply(input: { customerMessage: string; context?: string; tone?: string }) {
    if (!this.client) return { reply: `Thanks for reaching out. I understand your request: "${input.customerMessage}". An agent can review this shortly.`, confidence: 0.55, usedFallback: true };
    const res = await this.client.chat.completions.create({ model: this.config.get('OPENAI_MODEL') || 'gpt-4o-mini', messages: [ { role:'system', content:'You are a concise, helpful customer support AI. Reply professionally and escalate when needed.'}, {role:'user', content:`Context:\n${input.context || 'No context'}\n\nCustomer message:\n${input.customerMessage}`} ], temperature:0.3 });
    return { reply: res.choices[0]?.message?.content || 'I can help with that.', confidence: 0.82, usedFallback: false };
  }
  async analyzeSentiment(text: string): Promise<{label: Sentiment; score: number; shouldEscalate: boolean}> {
    const lowered=text.toLowerCase();
    if (/(angry|terrible|scam|fraud|lawsuit|unacceptable|hate)/.test(lowered)) return {label:'ANGRY',score:0.92,shouldEscalate:true};
    if (/(confused|don't understand|not clear|unclear)/.test(lowered)) return {label:'CONFUSED',score:0.75,shouldEscalate:false};
    if (/(bad|failed|issue|problem|refund)/.test(lowered)) return {label:'NEGATIVE',score:0.7,shouldEscalate:false};
    return {label:'NEUTRAL',score:0.6,shouldEscalate:false};
  }
  async embed(text: string): Promise<number[]> {
    if (!this.client) return Array.from({length:32}, (_,i)=>((text.charCodeAt(i%text.length)||1)%97)/97);
    const res = await this.client.embeddings.create({ model: this.config.get('OPENAI_EMBEDDING_MODEL') || 'text-embedding-3-small', input: text });
    return res.data[0].embedding;
  }
  async transcribeAudio(_buffer: Buffer, filename: string) { return `Transcription placeholder for ${filename}. Wire this to OpenAI Whisper or another STT provider.`; }
}
