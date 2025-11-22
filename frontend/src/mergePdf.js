import { PDFDocument } from "pdf-lib";

export default async function mergePdfs(pdfUrls) {
  if (pdfUrls.length === 0) {
    alert("select at least one file.");
    return;
  }
  try {
    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();

    for (const file of pdfUrls) {
      // Fetch each PDF file
      let response;
      try {
        response = await fetch(file.url);
      } catch (err) {
        throw new Error(`Network error while fetching: ${file.name}`);
      }

      if (!response.ok) {
        console.error("Unable to fetch:", file.name, response.status);
        throw new Error(`Unable to fetch: ${file.name}`);
      }
      const pdfBytes = await response.arrayBuffer();

      // Load the PDF
      const pdf = await PDFDocument.load(pdfBytes);

      // Copy all pages to mergedPdf
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // Save merged PDF
    const mergedPdfBytes = await mergedPdf.save();

    // Create a blob and download
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pyqs_selected.pdf";
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
  } catch (error) {
    throw ("Error merging PDFs:", error);
  }
}
