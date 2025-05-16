declare class SimPrim {
    cvs: HTMLCanvasElement;
    img: HTMLImageElement | undefined;
    ctx: CanvasRenderingContext2D | null;
    trimming: HTMLImageElement | undefined;
    previewCvs: HTMLCanvasElement | undefined;
    cx: number;
    cy: number;
    dx: number;
    dy: number;
    beforeDx: number;
    beforeDy: number;
    scaleWidth: number;
    scaleHeight: number;
    resizing: boolean;
    isDragging: boolean;
    decisionWH: boolean;
    defaultCursor: boolean;
    drawTrimmingWidth: number;
    drawTrimmingHeight: number;
    constructor(cvs: HTMLCanvasElement);
    init(img: HTMLImageElement, previewCvs: HTMLCanvasElement): void;
    dragDetection(): void;
    sizeChange(): void;
    previewImg(previewCvs: HTMLCanvasElement): void;
    exportImg(exportCvs: HTMLCanvasElement): void;
}
export { SimPrim };
