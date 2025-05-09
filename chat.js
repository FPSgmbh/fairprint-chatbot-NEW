export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const { message } = JSON.parse(event.body || "{}");
  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing input message" }),
    };
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
        {
          role: "system",
          content: `Du bist ein freundlicher und kompetenter KI-Chatbot von Fairprint Solutions. Antworte auf Fragen basierend auf diesen Informationen:

- Fairprint Solutions ist spezialisiert auf Drucker-Leasing, Wartung und den Verkauf hochwertiger Drucksysteme für Unternehmen.
- Auf der Seite 'Produkte' werden verschiedene Drucklösungen angeboten, individuell anpassbar je nach Unternehmensgröße.
- Unter 'Drucker-Leasing' wird erklärt, dass Kunden modernste Geräte zu planbaren Raten erhalten, inklusive Service.
- Die 'Service'-Seite beschreibt einen umfassenden Wartungs- und Reparaturdienst für alle angebotenen Systeme.
- Unter 'Über uns' und 'Unternehmen' erfährt man, dass Fairprint sich durch persönliche Betreuung, schnelle Reaktion und transparente Beratung auszeichnet.
- Kontaktaufnahme ist über die Seite 'Kontakt' möglich, dort findet man Telefonnummer, Kontaktformular und E-Mail.
- Kunden profitieren von zuverlässigem Support, individuellem Leasing und fairen Vertragsbedingungen.

Sprich den Nutzer ruhig direkt an und beantworte Fragen kurz, klar und ehrlich. Sei professionell, aber persönlich.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    }),
  });

  const json = await response.json();
  const reply = json.choices?.[0]?.message?.content || "Ich habe keine Antwort.";

  return {
    statusCode: 200,
    body: JSON.stringify({ reply }),
  };
}
