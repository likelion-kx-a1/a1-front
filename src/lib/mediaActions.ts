/**
 * 생성 결과 미디어(이미지/비디오) 클라이언트 액션
 */

/** 텍스트(보통 URL)를 클립보드에 복사 */
export async function copyTextToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

/** URL에서 파일을 받아 로컬에 다운로드 (CORS 실패 시 새 탭으로 열기) */
export async function downloadFromUrl(url: string, filename: string): Promise<void> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`download failed: ${res.status}`);
    }
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }
}

async function copyBlobToClipboard(
  url: string,
  mimePrefix: "image/" | "video/",
  fallbackType: string,
): Promise<"media" | "url"> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`fetch failed: ${res.status}`);
    }
    const blob = await res.blob();
    const type = blob.type.startsWith(mimePrefix) ? blob.type : fallbackType;
    await navigator.clipboard.write([new ClipboardItem({ [type]: blob })]);
    return "media";
  } catch {
    await copyTextToClipboard(url);
    return "url";
  }
}

/** 이미지를 클립보드에 복사. 실패하면 URL 텍스트 복사로 폴백 */
export async function copyImageToClipboard(url: string): Promise<"image" | "url"> {
  const mode = await copyBlobToClipboard(url, "image/", "image/png");
  return mode === "media" ? "image" : "url";
}

/** 비디오를 클립보드에 복사. 실패하면 URL 텍스트 복사로 폴백 */
export async function copyVideoToClipboard(url: string): Promise<"video" | "url"> {
  const mode = await copyBlobToClipboard(url, "video/", "video/mp4");
  return mode === "media" ? "video" : "url";
}

/** 다운로드 파일명 생성 */
export function buildMediaFilename(base: string, ext: string): string {
  const safe = base
    .trim()
    .slice(0, 40)
    .replace(/[^\w가-힣\-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${safe || "generated"}.${ext}`;
}
