export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { message } = JSON.parse(event.body || "{}");

  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing input message" }),
    };
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  try {
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
            content:
              "Du bist ein freundlicher und kompetenter KI-Chatbot von Fairprint Solutions. Antworte auf Fragen auf Basis dieser Infos:\n" +
              "- Drucker-Leasing\n- Servicevertrag\n- Produkte\n- Über uns / Kontaktmöglichkeiten\n",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });
});
    const json = await response.json();

    if (!json.choices || !json.choices[0]?.message?.content) {
      console.error("❌ Antwort unvollständig:", JSON.stringify(json));
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: "Es gab ein Problem mit der Antwort von OpenAI.",
          debug: json,
        }),
      };
    }

    const reply = json.choices[0].message.content;
    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };

  } catch (err) {
    console.error("❌ Fehler bei OpenAI-Aufruf:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Serverfehler", detail: err.message }),
    };
  }
}
