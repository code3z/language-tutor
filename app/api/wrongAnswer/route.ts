import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const language = "Swahili";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chatString = searchParams.get('chat');
  const intendedAnswer = searchParams.get('intendedAnswer');
  const nextStatement = searchParams.get('nextStatement');

  if (!chatString || !intendedAnswer) {
    return new Response(
      JSON.stringify({ error: 'The "chat" and "intendedAnswer" parameters are required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const chat = JSON.parse(chatString);
  const userAnswer = chat[chat.length - 1].user;
  const question = chat[chat.length - 2].question;

  const chats = chat.map((item: any) => ({
    role: "user" in item ? "user" : "assistant",
    content: [
      {
        type: "text",
        text: item.user || item.question || item.information
      }
    ]
  }));

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a ${language} tutor. Determine if your student's answer "${userAnswer}" is close enough to the intended answer "${intendedAnswer}" for question "${question}". Answer only with "Yes" or "No" or "Typo". Note that for answers with a written explanation, accepting a shortened form is fine. For example, if you want the student to say "We get rid of the *to*, *ku*." it is also fine if they simply answer "ku"`
            },
      ...chats,
    ],
    response_format: {
      type: "text"
    },
    temperature: 0,
    max_completion_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });

  const responseText = response.choices[0].message.content;
  console.log(responseText)

  if (!responseText) {
    return new Response(
      JSON.stringify({ error: 'Incorrect response from OpenAI.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const answerType = responseText.split("\n").find((line: string) => ["Yes", "No", "Typo"].includes(line.trim()))?.trim().toLowerCase() as "yes" | "no" | "typo";

  if (answerType === "yes") {
    return new Response(
      JSON.stringify({ correct: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
  else if (answerType === "no") {
    const guidanceResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a ${language} tutor. You asked "${question}", and your student incorrectly answered "${userAnswer}. Explain the correct answer, "${intendedAnswer}". You may want to break down the answer into parts. Don't introduce new words into your guidance unless necessary. After a sentence or two of guidance, ask "${question}" again.`
        },
        ...chats
      ],
      response_format: {
        type: "text"
      },
      temperature: 0,
      max_completion_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    const guidanceText = guidanceResponse.choices[0].message.content;

    return new Response(
      JSON.stringify({ correct: false, guidance: guidanceText }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
  else if (answerType === "typo") {
    const typoResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": `You are a Swahili tutor. Where is the typo? Answer briefly.\n\nAnswer: ${userAnswer}\nIntended answer: ${intendedAnswer}`
            }
          ]
        }]
      });

      if (typeof typoResponse.choices[0].message.content !== "string") {
        return new Response(
          JSON.stringify({ error: 'No response from OpenAI for typo response.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": `You are a Swahili tutor. Where is the typo? Answer briefly.\n\nAnswer: ${userAnswer}\nIntended answer: ${intendedAnswer}`
              }
            ]
          },
          {
            "role": "assistant",
            "content": [
              {
                "type": "text",
                "text": typoResponse.choices[0].message.content
              }
            ]
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": `Your next statement to the student is:\n\n\`\`\`\n${nextStatement}\n\`\`\`\n\nBriefly incorporate the feedback on their typo into the next statement. The feedback and the next statement are seperate things, you do not always need to connect them, as some connections do not make sense in the context of the lesson. However, it should fit together well. Saying the student is wrong and then telling them "very good" doesn't fit together well. No need to put the next statement in quotes. Don't be too positive; tell them they were wrong.`
              }
            ]
          }
        ],
        response_format: {
          "type": "text"
        },
      });

      console.log(response.choices)
    

    return new Response(
      JSON.stringify({ correct: true, typo: true, guidance: response.choices[0].message.content }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } else {
    return new Response(
      JSON.stringify({ error: 'Incorrect response from OpenAI.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

}

/*
      Typo examples:
      if they write kulal instead of kulala - "Almost, don't forget that extra "a" to make "kulala""
      if they write ku lala instead of kulala - "Correct, but remember that kulala is written as one word"`
*/