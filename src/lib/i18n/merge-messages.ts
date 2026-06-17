type MessageTree = Record<string, unknown>;

/** Locale messages override fallback; missing keys inherit from fallback (en). */
export function mergeMessages(
  localeMessages: MessageTree,
  fallbackMessages: MessageTree
): MessageTree {
  const merged: MessageTree = { ...fallbackMessages };

  for (const key of Object.keys(localeMessages)) {
    const localeValue = localeMessages[key];
    const fallbackValue = fallbackMessages[key];

    if (
      localeValue !== null &&
      typeof localeValue === "object" &&
      !Array.isArray(localeValue) &&
      fallbackValue !== null &&
      typeof fallbackValue === "object" &&
      !Array.isArray(fallbackValue)
    ) {
      merged[key] = mergeMessages(
        localeValue as MessageTree,
        fallbackValue as MessageTree
      );
    } else {
      merged[key] = localeValue;
    }
  }

  return merged;
}
