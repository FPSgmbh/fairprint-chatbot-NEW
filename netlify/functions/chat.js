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
      messages: [
        { role: "system", content: `
Du bist ein hilfreicher Kundenservice-Chatbot für Fairprint Solutions. Das Unternehmen bietet:

- Drucker-Leasing für Unternehmen jeder Größe
- Drucker und Kopierer zur Miete oder zum Kauf
- Reparatur, Wartung und Toner-Service
- Persönliche Beratung und faire Vertragsgestaltung
- Fokus auf B2B-Kunden mit individuell anpassbaren Lösungen

Fairprint übernimmt den kompletten Service von Installation bis zur Wartung. Kunden sparen durch kalkulierbare Raten und professionelle Geräte.

Antworten immer freundlich, präzise und so, als wärst du Teil des Teams.
` },
        { role: "user", content: message }
      ]
    }),
  });

  const json = await response.json();
  const reply = json.choices?.[0]?.message?.content || "Ich habe keine Antwort.";
  return { statusCode: 200, body: JSON.stringify({ reply }) };
}
