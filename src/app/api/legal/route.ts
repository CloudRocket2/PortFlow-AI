import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: NextRequest) {
  try {
    const { clauseText } = await request.json();

    if (!clauseText) {
      return NextResponse.json({ error: "Missing clause text" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured in .env.local" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const systemPrompt = `You are a maritime legal AI expert. You specialize in analyzing Charter Party contracts (like GENCON 94, NYPE).
The user will provide the text of a charter party clause.
Analyze it for commercial, operational, and legal risks.

You MUST respond strictly in the following JSON format:
{
  "risks": [
    {
      "category": "High Risk | Medium Risk | Low Risk",
      "title": "Short title of the risk (e.g., Force Majeure Ambiguity)",
      "description": "Detailed explanation of why this is a risk for the charterer/owner.",
      "mitigation": "What clause or wording to add to mitigate this risk."
    }
  ]
}

Only return valid JSON. Do not return markdown code blocks, just the raw JSON object.`;

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this clause:\n\n${clauseText}` }
      ],
    });

    const responseContent = response.choices[0].message.content;
    
    let result;
    try {
      result = JSON.parse(responseContent || "{}");
    } catch (e) {
      console.error("Failed to parse JSON from LLM:", responseContent);
      result = { risks: [{ category: "Error", title: "Parse Error", description: "Failed to parse AI response.", mitigation: "N/A" }] };
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Legal AI API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
