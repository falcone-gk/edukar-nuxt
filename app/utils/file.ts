export function downloadFile(file: Blob, filename: string) {
  const urlObject = window.URL.createObjectURL(file);

  const anchor = document.createElement("a");
  anchor.href = urlObject;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();

  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(urlObject);
}
