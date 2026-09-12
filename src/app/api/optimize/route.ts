import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: NextRequest) {
  try {
    const { pendingContracts, ports, vessels } = await request.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured in .env.local" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const systemPrompt = `You are PortFlow AI, an enterprise fleet optimization AI.
You have been given a list of pending shipping contracts, along with available port and vessel data.
Your job is to optimize the fleet. 

For each contract:
1. Identify the optimal vessel class based on the cargo volume and the destination port's draft limit.
2. Calculate the estimated predicted savings (in USD, typically between 800,000 and 2,500,000) by combining spot shipments into multi-voyage contracts.
3. Determine a realistic realized savings (slightly lower or higher than predicted).

You MUST output strictly in the following JSON format:
{
  "optimizedContracts": [
    {
      "id": "MV-CT-903",
      "predictedSavings": 1500000,
      "realizedSavings": 1450000,
      "vesselClassRecommendation": "Capesize",
      "rationale": "Port draft allows Capesize, maximizing economy of scale for 160k MT volume."
    }
  ]
}
Only output valid JSON.`;

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Pending Contracts: ${JSON.stringify(pendingContracts)}\nPorts Data: ${JSON.stringify(ports)}\nVessels Data: ${JSON.stringify(vessels)}` 
        }
      ],
    });

    const responseContent = response.choices[0].message.content;
    
    let result;
    try {
      result = JSON.parse(responseContent || "{}");
    } catch (e) {
      console.error("Failed to parse JSON from LLM:", responseContent);
      result = { optimizedContracts: [] };
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Optimize API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
