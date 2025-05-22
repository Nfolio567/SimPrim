/*! SimPrim-Simple Image Trimming Library v1.0.6 | Nfolio | ISC | https://github.com/Nfolio567/SimPrim */
declare class SimPrim {
    private inputCvs;
    private img;
    private inputCtx;
    private trimming;
    private previewCvs;
    private cx;
    private cy;
    private dx;
    private dy;
    private beforeDx;
    private beforeDy;
    private scaleWidth;
    private scaleHeight;
    private resizing;
    private dragging;
    private isDragging;
    private decisionWH;
    private isAnimating;
    private defaultCursor;
    private drawTrimmingWidth;
    private drawTrimmingHeight;
    constructor(inputCvs: HTMLCanvasElement);
    /**
     * Initialize the SimPrim instance with an image, preview canvas, and trimming path.
     * @param img - The image to be edited.
     * @param inputCvsHeight - Optional : The height of the input canvas when height is longer than width. If you want to trim a vertical image, you must explicitly specify it.
     * @param inputCvsWidth - Optional : The width of the input canvas when height is longer than width. If you want to trim a vertical image, you must explicitly specify it.
     * @param trimmingPath - The path to the trimming image(Default : https://cdn.nfolio.one/trimming.png).
     */
    init(img: HTMLImageElement, inputCvsHeight?: String, inputCvsWidth?: String, trimmingPath?: string): void;
    /**
     * Detects mouse drag events on the canvas and allows for dragging the trimming area.
     * @param previewCvs - Optional : The canvas for previewing the trimmed image.
     */
    dragDetection(previewCvs?: HTMLCanvasElement): void;
    private requestFrame;
    /**
     * Detects mouse drag events on the corners of the trimming area, allowing it to be resized.
     */
    sizeChange(): void;
    private previewImg;
    /**
     * Exports the trimmed image to a specified canvas.
     * @param exportCvs - The canvas to which the trimmed image will be exported.
     */
    exportImg(exportCvs: HTMLCanvasElement): void;
}
export { SimPrim };
