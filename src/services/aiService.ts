import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateInitialPatientResponse(patientInfo: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        text: `你现在是一名病人，请根据以下信息建立人设：${patientInfo}。
        由于你现在正处于医疗面谈阶段，请以病人的语气回答医生的第一个问题（通常是简单的问候或询问症状）。
        保持语气真实、自然，可能带有一些焦虑或疑惑（根据病史决定）。
        不要一次性说完所有信息，等待医生进一步提问。`
      }
    ]
  });
  return response.text;
}

export async function getPatientResponse(history: { role: string, content: string }[], patientInfo: string) {
  const contents = history.map(h => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: h.content }]
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: `系统规则：你现在扮演这里的模拟病人。你的背景信息是：${patientInfo}。
        请在随后的对话中严格遵循此人设。不要表现出你是AI。如果你已经告诉医生某个信息，不要重复提问。保持简明扼要的回答。` }]
      },
      ...contents as any
    ]
  });
  return response.text;
}

export async function evaluateDoctorPerformance(chatHistory: string, patientCase: string) {
  const prompt = `
  请你作为医学导师，对医生与模拟病人的对话进行打分和评估。
  
  模拟病人病例：${patientCase}
  
  对话历史记录：
  ${chatHistory}
  
  请从以下几个维度进行评估（1-100分）：
  1. 沟通技巧：是否亲切，是否能有效提取信息。
  2. 问诊逻辑：是否系统地询问了病史、症状。
  3. 临床思维：是否能根据病人描述引导到正确的检查或诊断方向。
  4. 治疗方案（如果涉及）：是否符合医学逻辑。

  最后请给出总分（0-100），并提供一段中文点评。
  
  请以JSON格式返回：
  {
    "scores": { "communication": number, "logic": number, "clinical": number, "plan": number },
    "totalScore": number,
    "feedback": "string"
  }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [{ text: prompt }],
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text);
}
