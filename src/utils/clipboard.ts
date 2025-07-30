/**
 * クリップボードにテキストをコピー
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // サーバーサイドでは false を返す
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return false;
  }

  try {
    // Clipboard APIが利用可能な場合
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);

      return true;
    }

    // Fallback: execCommandを使用
    return fallbackCopyToClipboard(text);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to copy to clipboard:", error);

    return false;
  }
}

/**
 * Fallback: execCommandを使用したクリップボードコピー
 */
function fallbackCopyToClipboard(text: string): boolean {
  // サーバーサイドでは実行しない
  if (typeof document === "undefined") {
    return false;
  }

  try {
    // 一時的なテキストエリアを作成
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);

    // テキストを選択してコピー
    textArea.focus();
    textArea.select();
    const result = document.execCommand("copy");

    // 一時的な要素を削除
    document.body.removeChild(textArea);

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Fallback copy failed:", error);

    return false;
  }
}

/**
 * クリップボード機能が利用可能かチェック
 */
export function isClipboardSupported(): boolean {
  // サーバーサイドでは false を返す
  if (typeof navigator === "undefined" || typeof document === "undefined") {
    return false;
  }

  return !!(
    navigator.clipboard ||
    (document.queryCommandSupported && document.queryCommandSupported("copy"))
  );
}

/**
 * セキュアなコンテキストかチェック（HTTPS環境等）
 */
export function isSecureContext(): boolean {
  // サーバーサイドでは false を返す
  if (typeof window === "undefined") {
    return false;
  }

  return window.isSecureContext;
}