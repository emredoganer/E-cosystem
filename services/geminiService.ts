
import { GoogleGenAI } from "@google/genai";
import { DIRECTORY_DATA } from "../constants";
import { DirectoryItem, Category } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || ''; // Ideally loaded from env
const ai = new GoogleGenAI({ apiKey });

export const askEcosystemAssistant = async (userQuery: string): Promise<string> => {
  if (!apiKey) {
    return "Demo Mode: API Key missing. Please configure process.env.API_KEY to use the live AI assistant.";
  }

  // Create a context-aware system prompt
  const contextData = JSON.stringify(DIRECTORY_DATA.map(item => ({
    name: item.name,
    category: item.category,
    description: item.description,
    tags: item.tags,
    techStack: item.techStack,
    partners: item.partners
  })));

  const systemInstruction = `
    You are an expert consultant for the Turkish E-commerce Ecosystem.
    You have access to a database of Brands, Tools, and Agencies in JSON format:
    ${contextData}

    Your goal is to help users navigate this ecosystem.
    - If asked about a brand, mention their tech stack if available.
    - If asked about a tool, explain what it does and who uses it.
    - If asked for recommendations (e.g., "Find me a Shopify agency"), list relevant entries.
    - Keep answers concise, professional, and helpful. 
    - Use a polite, slightly formal but warm tone.
    - Format the response in Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // Low temperature for factual consistency based on context
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the knowledge base right now. Please try again later.";
  }
};

export const inspectUrlWithGemini = async (url: string, categoryHint?: string): Promise<Partial<DirectoryItem>> => {
  if (!apiKey) {
    throw new Error("API Key missing");
  }

  const prompt = `
    Analyze the website/entity at this URL: ${url}.
    The user suggests it might be a ${categoryHint || "Brand, Tool, or Agency"}.

    Return a valid JSON object matching this structure (do not include markdown formatting, just raw JSON):
    {
      "name": "Entity Name",
      "category": "Brand" | "Tech & Tools" | "Agency",
      "description": "A concise, technical description (max 20 words).",
      "tags": ["Tag1", "Tag2", "Tag3"],
      "logoUrl": "https://picsum.photos/100/100", 
      "websiteUrl": "${url}",
      "pricingModel": "Free/Paid/Enterprise" (only if Tool),
      "services": ["Service1", "Service2"] (only if Agency),
      "techStack": [{"name": "ToolName", "category": "Category"}] (only if Brand, guess widely known stacks if public info exists)
    }

    If you don't know the specific tech stack, return an empty array.
    Prioritize data relevant to the Turkish E-commerce market if applicable.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Inspector Error:", error);
    throw new Error("Failed to inspect URL. AI Analysis failed.");
  }
};
