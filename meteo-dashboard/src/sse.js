const clients = new Set();

export function setupSSE(app) {
  app.get("/stream", (req, res) => {
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.write("retry: 1000\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
  });
}

// Enviar info leída a la interfaz
export function emitReading(reading) {
  const pkt = `event: reading\ndata: ${JSON.stringify(reading)}\n\n`;
  for (const res of clients) res.write(pkt);
}
