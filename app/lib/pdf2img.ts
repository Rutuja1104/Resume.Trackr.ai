// pdf2Img.ts — working with pdfjs-dist v4.x + Vite + React

export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
    try {
        if (typeof window === "undefined") {
            return { imageUrl: "", file: null, error: "Must run in browser" };
        }

        // Load pdf.js and worker dynamically (fix SSR)
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
        const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");

        pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return { imageUrl: "", file: null, error: "Could not get canvas context" };
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Required on v4.x legacy build
        await page.render({
            canvasContext: ctx,
            canvas,
            viewport
        }).promise;

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    resolve({
                        imageUrl: "",
                        file: null,
                        error: "canvas.toBlob() failed"
                    });
                    return;
                }

                const name = file.name.replace(/\.pdf$/i, "");
                const outFile = new File([blob], `${name}.png`, { type: "image/png" });

                resolve({
                    imageUrl: URL.createObjectURL(blob),
                    file: outFile
                });
            });
        });

    } catch (err: any) {
        return {
            imageUrl: "",
            file: null,
            error: "PDF conversion failed: " + err.message
        };
    }
}
