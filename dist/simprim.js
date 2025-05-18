(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SimPrim = {}));
})(this, (function (exports) { 'use strict';

    /*! SimPrim-Simple Image Trimming Library v1.0.0 | Nfolio | ISC | https://github.com/Nfolio567/SimPrim */
    class SimPrim {
        constructor(inputCvs) {
            this.scaleWidth = 0; // Ratio of canvas width to client width
            this.scaleHeight = 0; // Ratio of canvas height to client height
            this.resizing = false; // Whether resizing is in progress
            this.dragging = false; // Drag flag within the area
            this.isDragging = false; // Whether dragging is in progress
            this.decisionWH = false; // Whether the image is landscape or portrait
            this.isAnimating = false; // Whether animation is in progress
            this.defaultCursor = true; // Default cursor flag
            this.drawTrimmingWidth = 0; // Width of the trimming area
            this.drawTrimmingHeight = 0; // Height of the trimming area
            this.inputCvs = inputCvs;
            this.inputCtx = this.inputCvs.getContext("2d");
        }
        /**
         * Initialize the SimPrim instance with an image, preview canvas, and trimming path.
         * @param img - The image to be edited.
         * @param trimmingPath - The path to the trimming image.
         * @param inputCvsHeight - Optional : The height of the input canvas when height is longer than width. If you want to trim a vertical image, you must explicitly specify it.
         * @param inputCvsWidth - Optional : The width of the input canvas when height is longer than width. If you want to trim a vertical image, you must explicitly specify it.
         */
        init(img, inputCvsHeight, inputCvsWidth, trimmingPath = "https://cdn.nfolio.one/trimming.png") {
            var _a;
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
            this.inputCvs.width = this.img.width;
            this.inputCvs.height = this.img.height;
            // Determine aspect ratio and set height priority for portrait images
            if (this.img.width <= this.img.height) {
                this.decisionWH = false;
                this.inputCvs.style.cssText += "height:" + inputCvsHeight + ";" + "width:" + inputCvsWidth + ";";
            }
            else {
                this.decisionWH = true;
            }
            // Set width and height for drawing the image on the canvas
            drawWidth = this.inputCvs.width;
            drawHeight = this.inputCvs.height;
            (_a = this.inputCtx) === null || _a === void 0 ? void 0 : _a.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, drawWidth, drawHeight);
            // Initialize trimming image
            const trimming = new Image();
            trimming.crossOrigin = "anonymous";
            this.trimming = trimming;
            if (this.decisionWH) {
                this.drawTrimmingHeight = (this.inputCvs.height / 3) * 2;
                this.drawTrimmingWidth = this.drawTrimmingHeight;
            }
            else {
                this.drawTrimmingWidth = (this.inputCvs.width / 3) * 2;
                this.drawTrimmingHeight = this.drawTrimmingWidth;
            }
            this.trimming.onload = () => {
                var _a;
                if (this.trimming && this.dx !== undefined && this.dy !== undefined) {
                    (_a = this.inputCtx) === null || _a === void 0 ? void 0 : _a.drawImage(this.trimming, 0, 0, trimming.width, trimming.height, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight);
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
                this.resizing = false;
                this.dragging = false;
                //if (this.draggingFrame) cancelAnimationFrame(this.draggingFrame); // Cancel existing animation
            });
        }
        /**
         * Detects mouse drag events on the canvas and allows for dragging the trimming area.
         * @param previewCvs - Optional : The canvas for previewing the trimmed image.
         */
        dragDetection(previewCvs) {
            if (previewCvs)
                this.previewImg(previewCvs); // Draw to preview canvas
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
                if (this.dx !== undefined)
                    this.cx = this.dx / this.scaleWidth + this.drawTrimmingWidth / this.scaleWidth / 2; // Calculate center coordinate
                if (this.dy !== undefined)
                    this.cy = this.dy / this.scaleHeight + this.drawTrimmingHeight / this.scaleHeight / 2; // Calculate center coordinate
                if (this.cx !== undefined && this.cy !== undefined) {
                    if (e.offsetX >= this.cx - 10 && e.offsetX <= this.cx + 10 && e.offsetY >= this.cy - 10 && e.offsetY <= this.cy + 10) {
                        this.inputCvs.style.cursor = "move"; // Change mouse to move cursor
                        this.defaultCursor = false;
                        if (this.isDragging) {
                            this.dragging = true;
                            this.isAnimating = true;
                        }
                    }
                    else {
                        this.defaultCursor = true;
                    }
                }
                if (previewCvs !== undefined)
                    this.requestFrame(previewCvs, e);
            });
        }
        requestFrame(previewCvs, e) {
            if (!this.isAnimating)
                return;
            requestAnimationFrame(() => {
                var _a, _b, _c;
                this.inputCvs.style.cursor = "move"; // Keep move cursor during dragging even outside the specified area
                if (this.dx !== undefined)
                    this.beforeDx = this.dx;
                if (this.dy !== undefined)
                    this.beforeDy = this.dy;
                // Move the trimming area by mouse drag
                this.dx = (e.offsetX - this.drawTrimmingWidth / this.scaleWidth / 2) * this.scaleWidth;
                this.dy = (e.offsetY - this.drawTrimmingHeight / this.scaleHeight / 2) * this.scaleHeight;
                // Check for out-of-bounds of the trimming area
                if (this.trimming && this.img) {
                    if (this.dx <= 0)
                        this.dx = 0;
                    if (this.dy <= 0)
                        this.dy = 0;
                    if (this.dx + this.drawTrimmingWidth >= this.img.width)
                        this.dx = this.img.width - this.drawTrimmingWidth;
                    if (this.dy + this.drawTrimmingHeight >= this.img.height)
                        this.dy = this.img.height - this.drawTrimmingHeight;
                }
                if (this.img && this.trimming && this.dx !== undefined && this.dy !== undefined && this.beforeDx !== undefined && this.beforeDy !== undefined) {
                    (_a = this.inputCtx) === null || _a === void 0 ? void 0 : _a.clearRect(this.beforeDx - 1, this.beforeDy - 1, this.drawTrimmingWidth + 2, this.drawTrimmingHeight + 2);
                    (_b = this.inputCtx) === null || _b === void 0 ? void 0 : _b.drawImage(this.img, this.beforeDx - 1, this.beforeDy - 1, this.drawTrimmingWidth + 2, this.drawTrimmingHeight + 2, this.beforeDx - 1, this.beforeDy - 1, this.drawTrimmingWidth + 2, this.drawTrimmingHeight + 2);
                    (_c = this.inputCtx) === null || _c === void 0 ? void 0 : _c.drawImage(this.trimming, 0, 0, this.trimming.width, this.trimming.height, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight);
                }
                if (previewCvs)
                    this.previewImg(previewCvs); // Draw the trimming area to the preview canvas when the frame is generated
                console.log("#########################");
            });
            if (!this.dragging) {
                this.isAnimating = false;
            }
        }
        /**
         * Detects mouse drag events on the corners of the trimming area, allowing it to be resized.
         */
        sizeChange() {
            let property = ""; // Where the mouse is now
            let beforeWidth = 0; // Width before resizing
            let beforeHeight = 0; // Height before resizing
            // Mouseover detection for resizable area
            this.inputCvs.addEventListener("mousemove", (e) => {
                var _a, _b, _c, _d, _e;
                // Left resizable area
                if (this.dx !== undefined && this.dy !== undefined) {
                    if (e.offsetX * this.scaleWidth >= this.dx - 15 && e.offsetX * this.scaleWidth <= this.dx + 15) {
                        // Top left
                        if (e.offsetY * this.scaleHeight >= this.dy - 15 && e.offsetY * this.scaleHeight <= this.dy + 15) {
                            property = "upL";
                            this.inputCvs.style.cursor = "nwse-resize";
                            this.defaultCursor = false;
                            if (this.isDragging) {
                                this.resizing = true;
                            }
                        }
                        else {
                            this.defaultCursor = true;
                        }
                        // Bottom left
                        if (e.offsetY * this.scaleHeight >= this.dy + this.drawTrimmingHeight - 15 && e.offsetY * this.scaleHeight <= this.dy + this.drawTrimmingHeight + 15) {
                            property = "downL";
                            this.inputCvs.style.cursor = "nesw-resize";
                            this.defaultCursor = false;
                            if (this.isDragging) {
                                this.resizing = true;
                            }
                        }
                        else {
                            this.defaultCursor = true;
                        }
                    }
                    else {
                        this.defaultCursor = true;
                    }
                    // Right resizable area
                    if (e.offsetX * this.scaleWidth >= this.dx + this.drawTrimmingWidth - 15 && e.offsetX * this.scaleWidth <= this.dx + this.drawTrimmingWidth + 15) {
                        // Top right
                        if (e.offsetY * this.scaleHeight >= this.dy - 15 && e.offsetY * this.scaleHeight <= this.dy + 15) {
                            property = "upR";
                            this.inputCvs.style.cursor = "nesw-resize";
                            this.defaultCursor = false;
                            if (this.isDragging) {
                                this.resizing = true;
                            }
                        }
                        else {
                            this.defaultCursor = true;
                        }
                        // Bottom right
                        if (e.offsetY * this.scaleHeight >= this.dy + this.drawTrimmingHeight - 15 && e.offsetY * this.scaleHeight <= this.dy + this.drawTrimmingHeight + 15) {
                            property = "downR";
                            this.inputCvs.style.cursor = "nwse-resize";
                            this.defaultCursor = false;
                            if (this.isDragging) {
                                this.resizing = true;
                            }
                        }
                        else {
                            this.defaultCursor = true;
                        }
                    }
                    else {
                        this.defaultCursor = true;
                    }
                    // Trimming area resizing process
                    if (this.resizing) {
                        beforeWidth = this.drawTrimmingWidth;
                        beforeHeight = this.drawTrimmingHeight;
                        if (property == "downR" && this.img) {
                            this.inputCvs.style.cursor = "nwse-resize";
                            // Resize detection
                            if (e.movementX != 0)
                                this.drawTrimmingWidth += e.movementX * this.scaleWidth;
                            if (e.movementY != 0)
                                this.drawTrimmingHeight += e.movementY * this.scaleHeight;
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
                            (_a = this.inputCtx) === null || _a === void 0 ? void 0 : _a.drawImage(this.img, this.dx - 1, this.dy - 1, beforeWidth + 2, beforeHeight + 2, this.dx - 1, this.dy - 1, beforeWidth + 2, beforeHeight + 2);
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
                            if (this.dx + this.drawTrimmingWidth >= this.img.width)
                                this.drawTrimmingWidth = this.img.width - this.dx;
                            if (this.dy <= 0) {
                                this.dy = 0;
                                this.drawTrimmingHeight = beforeHeight;
                                this.drawTrimmingWidth = beforeWidth;
                            }
                            (_b = this.inputCtx) === null || _b === void 0 ? void 0 : _b.drawImage(this.img, this.dx - 1, this.beforeDy - 1, beforeWidth + 2, beforeHeight + 2, this.dx - 1, this.beforeDy - 1, beforeWidth + 2, beforeHeight + 2);
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
                            (_c = this.inputCtx) === null || _c === void 0 ? void 0 : _c.drawImage(this.img, this.beforeDx - 1, this.dy - 1, beforeWidth + 2, beforeHeight + 2, this.beforeDx - 1, this.dy - 1, beforeWidth + 2, beforeHeight + 2);
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
                            if (this.dy < -0) {
                                this.dy = 0;
                                this.dx = this.beforeDx;
                                this.drawTrimmingWidth = beforeWidth;
                                this.drawTrimmingHeight = beforeHeight;
                            }
                            if (this.img)
                                (_d = this.inputCtx) === null || _d === void 0 ? void 0 : _d.drawImage(this.img, this.beforeDx - 1, this.beforeDy - 1, beforeWidth + 2, beforeHeight + 2, this.beforeDx - 1, this.beforeDy - 1, beforeWidth + 2, beforeHeight + 2);
                        }
                        if (this.trimming)
                            (_e = this.inputCtx) === null || _e === void 0 ? void 0 : _e.drawImage(this.trimming, 0, 0, this.trimming.width, this.trimming.height, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight);
                    }
                }
            });
        }
        // Draw the trimming area to the preview canvas
        previewImg(previewCvs) {
            this.previewCvs = previewCvs;
            const previewCtx = this.previewCvs.getContext("2d");
            previewCtx === null || previewCtx === void 0 ? void 0 : previewCtx.clearRect(0, 0, previewCvs.width, previewCvs.height);
            if (this.img && this.dx !== undefined && this.dy !== undefined)
                previewCtx === null || previewCtx === void 0 ? void 0 : previewCtx.drawImage(this.img, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight, 0, 0, previewCvs.width, previewCvs.height);
        }
        /**
         * Exports the trimmed image to a specified canvas.
         * @param exportCvs - The canvas to which the trimmed image will be exported.
         */
        // Draw the trimming area to the export canvas
        exportImg(exportCvs) {
            var _a;
            let exportCtx = exportCvs.getContext("2d");
            let exportImgObject = (_a = this.previewCvs) === null || _a === void 0 ? void 0 : _a.toDataURL();
            let exportImgElement = new Image();
            exportImgElement.onload = () => {
                if (exportImgObject)
                    exportCtx === null || exportCtx === void 0 ? void 0 : exportCtx.drawImage(exportImgElement, 0, 0);
            };
            if (exportImgObject)
                exportImgElement.src = exportImgObject;
        }
    }
    if (typeof window !== "undefined") {
        window.SimPrim = SimPrim;
    }

    exports.SimPrim = SimPrim;

}));
