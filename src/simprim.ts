/*! SimPrim-Simple Image Trimming Library v1.0.0 | Nfolio | ISC | https://github.com/Nfolio567/SimPrim */

class SimPrim {
    VERSION = "1.1.0";
    private inputCvs: HTMLCanvasElement; // Canvas to edit
    private img: HTMLImageElement | undefined; // Image to be edited
    private inputCtx: CanvasRenderingContext2D | null; // Context of the canvas to edit
    private trimming: HTMLImageElement | undefined; // Image specifying the trimming area
    private previewCvs: HTMLCanvasElement | undefined; // Canvas for preview
    private cx: number | undefined; // Center X coordinate of the trimming area
    private cy: number | undefined; // Center Y coordinate of the trimming area
    private dx: number | undefined; // Drawing position X of the trimming image
    private dy: number | undefined; // Drawing position Y of the trimming image
    private beforeDx: number | undefined; // Previous frame X coordinate
    private beforeDy: number | undefined; // Previous frame Y coordinate
    private scaleWidth = 0; // Ratio of canvas width to client width
    private scaleHeight = 0; // Ratio of canvas height to client height
    private resizing = false; // Whether resizing is in progress
    private dragging = false; // Drag flag within the area
    private resizable: boolean | undefined; // resize flag
    private isDragging = false; // Whether dragging is in progress
    private decisionWH = false; // Whether the image is landscape or portrait
    private isAnimating = false; // Whether animation is in progress
    private defaultCursor = true; // Default cursor flag
    private drawTrimmingWidth = 0; // Width of the trimming area
    private drawTrimmingHeight = 0; // Height of the trimming area

    constructor(inputCvs: HTMLCanvasElement) {
        this.inputCvs = inputCvs;
        this.inputCtx = this.inputCvs.getContext("2d");
    }

    /**
     * Initialize the SimPrim instance with an image, preview canvas, and trimming path.
     * @param img - The image to be edited.
     * @param inputCvsHeight - Optional : The height of the input canvas when height is longer than width. If you want to trim a vertical image, you must explicitly specify it.
     * @param inputCvsWidth - Optional : The width of the input canvas when height is longer than width. If you want to trim a vertical image, you must explicitly specify it.
     * @param trimmingPath - The path to the trimming image(Default : https://cdn.nfolio.one/trimming.png).
     */
    init(img: HTMLImageElement, inputCvsHeight?: String, inputCvsWidth?: String, trimmingPath: string = "https://cdn.nfolio.one/trimming.png") {
        // Initialize variables
        this.img = img;
        let drawWidth = 0;
        let drawHeight = 0;
        this.cx = 0;
        this.cy = 0;
        this.dx = 0;
        this.dy = 0;
        this.beforeDx = 0;
        this.beforeDy = 0;
        this.resizable = false;

        this.inputCvs.width = this.img.width;
        this.inputCvs.height = this.img.height;

        // Determine aspect ratio and set height priority for portrait images
        if (this.img.width <= this.img.height) {
            this.decisionWH = false;
            this.inputCvs.style.cssText += "height:" + inputCvsHeight + ";" + "width:" + inputCvsWidth + ";";
        } else {
            this.decisionWH = true;
        }

        // Set width and height for drawing the image on the canvas
        drawWidth = this.inputCvs.width;
        drawHeight = this.inputCvs.height;

        this.inputCtx?.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, drawWidth, drawHeight);

        // Initialize trimming image
        const trimming = new Image();
        trimming.crossOrigin = "anonymous";
        this.trimming = trimming;
        if (this.decisionWH) {
            this.drawTrimmingHeight = (this.inputCvs.height / 3) * 2;
            this.drawTrimmingWidth = this.drawTrimmingHeight;
        } else {
            this.drawTrimmingWidth = (this.inputCvs.width / 3) * 2;
            this.drawTrimmingHeight = this.drawTrimmingWidth;
        }
        this.trimming.onload = () => {
            if (this.trimming && this.dx !== undefined && this.dy !== undefined) {
                this.inputCtx?.drawImage(this.trimming, 0, 0, trimming.width, trimming.height, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight);
            }
        };
        this.trimming.src = trimmingPath;

        this.inputCvs.addEventListener("mousemove", () => {
            if (this.defaultCursor) {
                this.inputCvs.style.cursor = "default"; // Reset mouse to default
            }
        });

        // Use window to allow dragging even if the mouse leaves the canvas
        window.addEventListener("mouseup", () => {
            this.isDragging = false;
            this.dragging = false;
            this.resizing = false;
            //if (this.draggingFrame) cancelAnimationFrame(this.draggingFrame); // Cancel existing animation
        });
    }

    /**
     * Detects mouse drag events on the canvas and allows for dragging the trimming area.
     * @param previewCvs - Optional : The canvas for previewing the trimmed image.
     */
    dragDetection(previewCvs?: HTMLCanvasElement) {
        let property = ""; // Where the mouse is now
        let beforeProperty = "";
        let beforeWidth = 0; // Width before resizing
        let beforeHeight = 0; // Height before resizing

        this.previewCvs = previewCvs;
        const previewCtx = previewCvs?.getContext("2d");
        if (this.previewCvs && previewCtx) this.previewImg(this.previewCvs, previewCtx);

        this.inputCvs.addEventListener("mousedown", () => {
            this.isDragging = true; // Drag flag
        });

        this.inputCvs.addEventListener("mousemove", (e) => {
            //if (this.draggingFrame) cancelAnimationFrame(this.draggingFrame); // Cancel existing animation

            if (this.defaultCursor) {
                this.inputCvs.style.cursor = "default"; // Reset mouse to default
            }

            this.scaleWidth = this.inputCvs.width / this.inputCvs.clientWidth; // Calculate ratio
            this.scaleHeight = this.inputCvs.height / this.inputCvs.clientHeight; // Calculate ratio
            if (this.dx !== undefined) this.cx = this.dx / this.scaleWidth + this.drawTrimmingWidth / this.scaleWidth / 2; // Calculate center coordinate
            if (this.dy !== undefined) this.cy = this.dy / this.scaleHeight + this.drawTrimmingHeight / this.scaleHeight / 2; // Calculate center coordinate
            if (this.cx !== undefined && this.cy !== undefined) {
                if (e.offsetX >= this.cx - 10 && e.offsetX <= this.cx + 10 && e.offsetY >= this.cy - 10 && e.offsetY <= this.cy + 10) {
                    this.inputCvs.style.cursor = "move"; // Change mouse to move cursor
                    this.defaultCursor = false;
                    if (this.isDragging) {
                        this.dragging = true;
                        this.isAnimating = true;
                    }
                } else {
                    this.defaultCursor = true;
                }
            }

            // Mouseover detection for resizable area
            if (this.dx !== undefined && this.dy !== undefined /* && !this.resizing*/) {
                // Left resizable area
                if (e.offsetX * this.scaleWidth >= this.dx - 15 && e.offsetX * this.scaleWidth <= this.dx + 15) {
                    // Top left
                    if (e.offsetY * this.scaleHeight >= this.dy - 15 && e.offsetY * this.scaleHeight <= this.dy + 15) {
                        property = "upL";
                        if (!this.resizing) this.inputCvs.style.cursor = "nwse-resize";
                        this.defaultCursor = false;
                        if (this.isDragging) {
                            this.resizing = true;
                        }
                    } else {
                        this.defaultCursor = true;
                    }
                    // Bottom left
                    if (e.offsetY * this.scaleHeight >= this.dy + this.drawTrimmingHeight - 15 && e.offsetY * this.scaleHeight <= this.dy + this.drawTrimmingHeight + 15) {
                        property = "downL";
                        if (!this.resizing) this.inputCvs.style.cursor = "nesw-resize";
                        this.defaultCursor = false;
                        if (this.isDragging) {
                            this.resizing = true;
                        }
                    } else {
                        this.defaultCursor = true;
                    }
                } else {
                    this.defaultCursor = true;
                }

                // Right resizable area
                if (e.offsetX * this.scaleWidth >= this.dx + this.drawTrimmingWidth - 15 && e.offsetX * this.scaleWidth <= this.dx + this.drawTrimmingWidth + 15) {
                    // Top right
                    if (e.offsetY * this.scaleHeight >= this.dy - 15 && e.offsetY * this.scaleHeight <= this.dy + 15) {
                        property = "upR";
                        if (!this.resizing) this.inputCvs.style.cursor = "nesw-resize";
                        this.defaultCursor = false;
                        if (this.isDragging) {
                            this.resizing = true;
                        }
                    } else {
                        this.defaultCursor = true;
                    }
                    // Bottom right
                    if (e.offsetY * this.scaleHeight >= this.dy + this.drawTrimmingHeight - 15 && e.offsetY * this.scaleHeight <= this.dy + this.drawTrimmingHeight + 15) {
                        property = "downR";
                        if (!this.resizing) this.inputCvs.style.cursor = "nwse-resize";
                        this.defaultCursor = false;
                        if (this.isDragging) {
                            this.resizing = true;
                        }
                    } else {
                        this.defaultCursor = true;
                    }
                } else {
                    this.defaultCursor = true;
                }
            }

            if (previewCtx) this.requestFrame(previewCtx, e, property, beforeProperty, beforeWidth, beforeHeight);
        });
    }

    private requestFrame(previewCtx: CanvasRenderingContext2D, e: MouseEvent, property: String, beforeProperty: String, beforeWidth: number, beforeHeight: number) {
        if (!this.isAnimating) return;

        requestAnimationFrame(() => {
            this.moveDrag(e);
            if (this.previewCvs && previewCtx) this.previewImg(this.previewCvs, previewCtx); // Draw to preview canvas
            if (this.resizable) this.resizeDrag(e, property, beforeProperty, beforeWidth, beforeHeight);
        });

        if (!this.dragging && !this.resizing) {
            this.isAnimating = false;
        }
    }

    /**
     * Detects mouse drag events on the corners of the trimming area, allowing it to be resized.
     */
    sizeChange() {
        this.resizable = true;
    }

    private resizeDrag(e: MouseEvent, property: String, beforeProperty: String, beforeWidth: number, beforeHeight: number) {
        funcResizing.call(this, e);
        beforeProperty = property;

        function funcResizing(this: SimPrim, e: MouseEvent) {
            // Trimming area resizing process
            if (this.resizing && this.dx !== undefined && this.dy !== undefined) {
                if (this.drawTrimmingWidth <= 0 || this.drawTrimmingHeight <= 0) {
                    this.drawTrimmingHeight = 0;
                    this.drawTrimmingWidth = this.drawTrimmingHeight;
                }
                this.dragging = false;
                property = beforeProperty;
                this.isAnimating = true;
                beforeWidth = this.drawTrimmingWidth;
                beforeHeight = this.drawTrimmingHeight;
                if (property == "downR" && this.img) {
                    this.inputCvs.style.cursor = "nwse-resize";

                    // Resize detection
                    if (e.movementX != 0) this.drawTrimmingWidth += e.movementX * this.scaleWidth;
                    if (e.movementY != 0) this.drawTrimmingHeight += e.movementY * this.scaleHeight;
                    if (e.movementX != 0 && e.movementY != 0) {
                        this.drawTrimmingWidth += 2 * (e.movementX / this.scaleWidth / 4) - e.movementX / this.scaleWidth / 2;
                        this.drawTrimmingHeight += 2 * (e.movementY / this.scaleHeight / 4) - e.movementX / this.scaleHeight / 2;
                    }
                    this.drawTrimmingHeight = this.drawTrimmingWidth;
                    // Out-of-bounds check
                    if (this.dx + this.drawTrimmingWidth >= this.img.width) {
                        this.drawTrimmingWidth = this.img.width - this.dx;
                        this.drawTrimmingHeight = this.drawTrimmingWidth;
                    }
                    if (this.dy + this.drawTrimmingHeight >= this.img.height) {
                        this.drawTrimmingHeight = this.img.height - this.dy;
                        this.drawTrimmingWidth = this.drawTrimmingHeight;
                    }

                    this.inputCtx?.drawImage(this.img, this.dx - 1, this.dy - 1, beforeWidth + 2, beforeHeight + 2, this.dx - 1, this.dy - 1, beforeWidth + 2, beforeHeight + 2);
                }
                if (property == "upR" && this.img) {
                    this.beforeDy = this.dy;
                    this.inputCvs.style.cursor = "nesw-resize";

                    // Resize detection
                    if (e.movementX != 0) {
                        this.dy -= e.movementX * this.scaleWidth;
                        this.drawTrimmingWidth += e.movementX * this.scaleWidth;
                    }
                    this.drawTrimmingHeight = this.drawTrimmingWidth;
                    // Out-of-bounds check
                    if (this.dx + this.drawTrimmingWidth >= this.img.width) this.drawTrimmingWidth = this.img.width - this.dx;
                    if (this.dy <= 0) {
                        this.dy = 0;
                        this.drawTrimmingHeight = beforeHeight;
                        this.drawTrimmingWidth = beforeWidth;
                    }

                    this.inputCtx?.drawImage(this.img, this.dx - 1, this.beforeDy - 1, beforeWidth + 2, beforeHeight + 2, this.dx - 1, this.beforeDy - 1, beforeWidth + 2, beforeHeight + 2);
                }
                if (property == "downL" && this.img) {
                    this.beforeDx = this.dx;
                    this.inputCvs.style.cursor = "nesw-resize";

                    // Resize detection
                    if (e.movementX != 0) {
                        this.dx += e.movementX * this.scaleWidth;
                        this.drawTrimmingWidth -= e.movementX * this.scaleWidth;
                    }
                    this.drawTrimmingHeight = this.drawTrimmingWidth;

                    // Out-of-bounds check
                    if (this.dx <= 0) {
                        this.dx = 0;
                        this.drawTrimmingWidth = beforeWidth;
                        this.drawTrimmingHeight = beforeHeight;
                    }
                    if (this.dy + this.drawTrimmingHeight >= this.img.height) {
                        this.drawTrimmingHeight = this.img.height - this.dy;
                        this.drawTrimmingWidth = this.drawTrimmingHeight;
                        this.dx = this.beforeDx;
                    }
                    this.inputCtx?.drawImage(this.img, this.beforeDx - 1, this.dy - 1, beforeWidth + 2, beforeHeight + 2, this.beforeDx - 1, this.dy - 1, beforeWidth + 2, beforeHeight + 2);
                }
                if (property == "upL") {
                    this.beforeDx = this.dx;
                    this.beforeDy = this.dy;
                    this.inputCvs.style.cursor = "nwse-resize";

                    // Resize detection
                    if (e.movementX != 0) {
                        this.dx += e.movementX * this.scaleWidth;
                        this.dy += e.movementX * this.scaleWidth;
                        this.drawTrimmingWidth -= e.movementX * this.scaleWidth;
                    }
                    this.drawTrimmingHeight = this.drawTrimmingWidth;

                    // Out-of-bounds check
                    if (this.dx <= 0) {
                        this.dx = 0;
                        this.dy = this.beforeDy;
                        this.drawTrimmingWidth = beforeWidth;
                        this.drawTrimmingHeight = beforeHeight;
                    }
                    if (this.dy <= 0) {
                        this.dy = 0;
                        this.dx = this.beforeDx;
                        this.drawTrimmingWidth = beforeWidth;
                        this.drawTrimmingHeight = beforeHeight;
                    }
                    if (this.img) this.inputCtx?.drawImage(this.img, this.beforeDx - 1, this.beforeDy - 1, beforeWidth + 2, beforeHeight + 2, this.beforeDx - 1, this.beforeDy - 1, beforeWidth + 2, beforeHeight + 2);
                }
                if (this.trimming) this.inputCtx?.drawImage(this.trimming, 0, 0, this.trimming.width, this.trimming.height, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight);
            }
        }
    }

    // Draw the trimming area to the preview canvas
    private previewImg(previewCvs: HTMLCanvasElement, previewCtx: CanvasRenderingContext2D) {
        previewCtx?.clearRect(0, 0, previewCvs.width, previewCvs.height);
        if (this.img && this.dx !== undefined && this.dy !== undefined) previewCtx?.drawImage(this.img, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight, 0, 0, previewCvs.width, previewCvs.height);
    }

    private moveDrag(e: MouseEvent) {
        if (this.dragging) {
            this.inputCvs.style.cursor = "move"; // Keep move cursor during dragging even outside the specified area
            if (this.dx !== undefined) this.beforeDx = this.dx;
            if (this.dy !== undefined) this.beforeDy = this.dy;

            // Move the trimming area by mouse drag
            this.dx = (e.offsetX - this.drawTrimmingWidth / this.scaleWidth / 2) * this.scaleWidth;
            this.dy = (e.offsetY - this.drawTrimmingHeight / this.scaleHeight / 2) * this.scaleHeight;

            // Check for out-of-bounds of the trimming area
            if (this.trimming && this.img) {
                if (this.dx <= 0) this.dx = 0;
                if (this.dy <= 0) this.dy = 0;
                if (this.dx + this.drawTrimmingWidth >= this.img.width) this.dx = this.img.width - this.drawTrimmingWidth;
                if (this.dy + this.drawTrimmingHeight >= this.img.height) this.dy = this.img.height - this.drawTrimmingHeight;
            }

            if (this.img && this.trimming && this.dx !== undefined && this.dy !== undefined && this.beforeDx !== undefined && this.beforeDy !== undefined) {
                this.inputCtx?.drawImage(this.img, this.beforeDx - 1, this.beforeDy - 1, this.drawTrimmingWidth + 2, this.drawTrimmingHeight + 2, this.beforeDx - 1, this.beforeDy - 1, this.drawTrimmingWidth + 2, this.drawTrimmingHeight + 2);
                this.inputCtx?.drawImage(this.trimming, 0, 0, this.trimming.width, this.trimming.height, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight);
            }
        }
    }

    /**
     * Exports the trimmed image to a specified canvas.
     * @param exportCvs - The canvas to which the trimmed image will be exported.
     */
    // Draw the trimming area to the export canvas
    exportImg(exportCvs: HTMLCanvasElement) {
        let exportCtx = exportCvs.getContext("2d");
        let exportImgObject = this.previewCvs?.toDataURL();
        let exportImgElement = new Image();
        exportImgElement.onload = () => {
            if (exportImgObject) exportCtx?.drawImage(exportImgElement, 0, 0);
        };
        if (exportImgObject) exportImgElement.src = exportImgObject;
    }
}

if (typeof window !== "undefined") {
    (window as any).SimPrim = SimPrim;
}

export { SimPrim };
