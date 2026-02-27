import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY no está configurada en .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

export async function generateEmbedding(text: string) {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
}
