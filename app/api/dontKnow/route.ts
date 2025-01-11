import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const chatString = searchParams.get('chat');
    const answer = searchParams.get('answer');
  
    if (!chatString || !answer) {
      return new Response(
        JSON.stringify({ error: 'The "chat" and "answer" parameters are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const chat = JSON.parse(chatString);
    const question = chat[chat.length - 2].question;

    const chats = chat.map((item: any) => {
        return {
            role: "user" in item ? "user" : "assistant",
            content: [
            {
                type: "text",
                text: item.user || item.question || item.information
            }
            ]
        }
    })

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            "role": "system",
            "content": [
              {
                "type": "text",
                "text": `You are a Swahili tutor. Your student has some confusion. You will guide them toward the right answer. You asked "${question}" and your student did not know the intended answer, "${answer}".\nYou will write a sentence or two describing the answer if relevant, then ask "${question}" again.`
              }
            ]
          },
          ...chats,
        ],
        response_format: {
          "type": "text"
        },
        temperature: 1,
        max_completion_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });
      
  
    return new Response(
      response.choices[0].message.content,
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }