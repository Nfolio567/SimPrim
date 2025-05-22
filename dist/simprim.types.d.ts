/*! SimPrim-Simple Image Trimming Library v1.0.0 | Nfolio | ISC | https://github.com/Nfolio567/SimPrim */
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
    init(img: HTMLImageElement, inputCvsHeight?: String, inputCvsWidth?: String, trimmingPath?: string): void;
    dragDetection(previewCvs?: HTMLCanvasElement): void;
    private requestFrame;
    sizeChange(): void;
    private previewImg;
    exportImg(exportCvs: HTMLCanvasElement): void;
}
export { SimPrim };
