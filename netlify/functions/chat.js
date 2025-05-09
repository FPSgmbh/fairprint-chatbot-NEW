export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { message } = JSON.parse(event.body || "{}");
  if (!message) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing input message" }) };
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    }),
  });

  const json = await response.json();
  const reply = json.choices?.[0]?.message?.content || "Ich habe keine Antwort.";
  return { statusCode: 200, body: JSON.stringify({ reply }) };
}