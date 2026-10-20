export type StreamErrorBox = { error: unknown };

/**
 * Streams model text as plain text. The AI SDK does not throw provider errors from
 * `textStream` (it reports them through `onError`), so callers pass a `errorBox` filled by
 * `onError`; if the model produced no text and an error was recorded, an error marker is sent.
 */
export function createPlainTextStreamResponse(
  textStream: AsyncIterable<string>,
  options?: { logLabel?: string; errorBox?: StreamErrorBox }
): Response {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const marker = (msg: string) => controller.enqueue(encoder.encode(`__ERR_EXTRACT__:${msg}`));
      let sentText = false;
      try {
        for await (const chunk of textStream) {
          sentText = true;
          controller.enqueue(encoder.encode(chunk));
        }
        if (!sentText && options?.errorBox?.error) {
          console.error(`[${options.logLabel ?? "Stream"} Error]:`, options.errorBox.error);
          marker("The AI model is currently unavailable. Please try again later.");
        }
      } catch (err) {
        console.error(`[${options?.logLabel ?? "Stream"} Error]:`, err);
        marker("Model service error, please try again.");
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
