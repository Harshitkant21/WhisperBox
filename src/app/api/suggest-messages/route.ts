import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be seperated by '||'. These questions are for the anonymous social messaging platform, like Qooh.me. and should be suitable for a wide audience. Avoid personal or sensitive topics, focus instead on universal theme that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you're recently started?||What's a book you've read recently?||What's a movie you've watched recently?' Ensure questions are intriguing, foster curiosity, and are open-ended to encourage thoughtful responses.";
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      max_tokens: 200,
      stream: true,
      prompt,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error("Error occured: ", error);
      const { name, headers, status, message } = error;
      return NextResponse.json(
        { name, headers, status, message },
        { status: 400 }
      );
    } else {
      console.error("Unexpected error occured: ", error);
      throw error;
    }
  }
}
