import { promises as fs } from "fs";
import path from "path";

const langMap = {
  swahili: "ngina",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log(searchParams)
  const language = searchParams.get("language") as keyof typeof langMap;
  const text = searchParams.get("text");
  if (!language || !text) {
    return new Response("Missing language or text", { status: 400 });
  }
  if (!langMap[language]) {
    return new Response("Language not supported", { status: 400 });
  }

  const apiKey = process.env.NARAKEET_API_KEY;
  if (!apiKey) {
    return new Response("API key not configured", { status: 500 });
  }

  const cacheKey = `${language}-${text}`;
  const cacheFilePath = path.join(
    process.cwd(),
    "audioCache",
    `${cacheKey}.mp3`
  );
  try {
    const cachedAudio = await fs.readFile(cacheFilePath);
    return new Response(cachedAudio, {
      headers: { 
        "Content-Type": "audio/mp3",
        "Cache-Control": "public, max-age=31536000, immutable"
      },
    });
  } catch {
    const narakeetResponse = await fetch(
      "https://api.narakeet.com/text-to-speech/mp3?voice=" + langMap[language],
      {
        method: "POST",
        headers: {
          Accept: "application/octet-stream",
          "Content-Type": "text/plain",
          "x-api-key": apiKey,
        },
        body: text,
      }
    );
    if (!narakeetResponse.ok) {
      return new Response("Error calling Narakeet API", { status: 500 });
    }
    const audio = await narakeetResponse.arrayBuffer();
    await fs.writeFile(cacheFilePath, Buffer.from(audio));
    return new Response(audio, {
      headers: { 
        "Content-Type": "audio/mp3",
        "Cache-Control": "public, max-age=31536000, immutable"
      },
    });
  }
}
