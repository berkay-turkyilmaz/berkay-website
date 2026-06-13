export function createPlainTextStreamResponse(
  textStream: AsyncIterable<string>,
  options?: { logLabel?: string }
): Response {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of textStream) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        console.error(`[${options?.logLabel ?? "Stream"} Error]:`, err);
        const errMsg =
          err instanceof Error ? err.message : "Bilinmeyen model hatası";
        controller.enqueue(encoder.encode(`__ERR_EXTRACT__:${errMsg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
