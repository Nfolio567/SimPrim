/*! SimPrim - Simple Image Trimming Library v1.1.4 | (c) Nfolio | ISC | https://github.com/Nfolio567/SimPrim */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SimPrim = {}));
})(this, (function (exports) { 'use strict';

    class SimPrim {
        constructor() {
            this.VERSION = "1.1.3";
            this.resizing = false; // Whether resizing is in progress
            this.areaMoving = false; // Drag flag within the area
            this.isDragging = false; // Whether dragging is in progress
            this.decisionWH = false; // Whether the image is landscape or portrait
            this.isAnimating = false; // Whether animation is in progress
            this.isAnimatingOK = false; // Animation ready
            this.defaultCursor = true; // Default cursor flag
            this.drawTrimmingWidth = 0; // Width of the trimming area
            this.drawTrimmingHeight = 0; // Height of the trimming area
        }
        /**
         * Initialize the SimPrim instance with an image, preview canvas, and trimming path.
         * @param img - The image to be edited.
         * @param inputCvsHeight - Optional : The height of the input canvas when height is longer than width. If you want to trim a vertical image, you must explicitly specify it.
         * @param inputCvsWidth - Optional : The width of the input canvas when height is longer than width. If you want to trim a vertical image, you must explicitly specify it.
         * @param trimmingPath - The path to the trimming image(Default : https://cdn.nfolio.one/trimming.png).
         */
        init(inputCvs, img, inputCvsHeight, inputCvsWidth, trimmingPath = "https://cdn.nfolio.one/trimming.png") {
            var _a;
            console.log(this.animationFrameID);
            if (this.animationFrameID !== undefined) {
                cancelAnimationFrame(this.animationFrameID);
                this.animationFrameID = undefined;
            }
            // Initialize variables
            this.inputCvs = inputCvs;
            this.inputCtx = this.inputCvs.getContext("2d");
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
            // Use window to allow dragging even if the mouse leaves the canvas
            window.addEventListener("mouseup", () => {
                this.isDragging = false;
                this.areaMoving = false;
                this.resizing = false;
            });
        }
        /**
         * Detects mouse drag events on the canvas and allows for dragging the trimming area.
         * @param previewCvs - Optional : The canvas for previewing the trimmed image.
         */
        dragDetection(previewCvs) {
            var _a, _b;
            let property = ""; // Where the mouse is now
            let beforeProperty = "";
            let beforeWidth = 0; // Width before resizing
            let beforeHeight = 0; // Height before resizing
            this.deltaX = 0;
            this.deltaY = 0;
            this.previewCvs = previewCvs;
            const previewCtx = previewCvs === null || previewCvs === void 0 ? void 0 : previewCvs.getContext("2d");
            if (this.previewCvs && previewCtx)
                this.previewImg(this.previewCvs, previewCtx);
            (_a = this.inputCvs) === null || _a === void 0 ? void 0 : _a.addEventListener("mousedown", () => {
                this.isDragging = true; // Drag flag
            });
            (_b = this.inputCvs) === null || _b === void 0 ? void 0 : _b.addEventListener("mousemove", (e) => {
                if (previewCtx && this.isDragging)
                    this.requestFrame(previewCtx, e, property, beforeProperty, beforeWidth, beforeHeight);
                if (this.defaultCursor && this.inputCvs)
                    this.inputCvs.style.cursor = "default"; // Reset mouse to default
                if (this.dx !== undefined)
                    this.cx = this.dx / this.scaleWidth() + this.drawTrimmingWidth / this.scaleWidth() / 2; // Calculate center coordinate
                if (this.dy !== undefined)
                    this.cy = this.dy / this.scaleHeight() + this.drawTrimmingHeight / this.scaleHeight() / 2; // Calculate center coordinate
                if (this.cx !== undefined && this.cy !== undefined) {
                    if (e.offsetX >= this.cx - 10 && e.offsetX <= this.cx + 10 && e.offsetY >= this.cy - 10 && e.offsetY <= this.cy + 10) {
                        this.defaultCursor = false;
                        if (this.inputCvs)
                            this.inputCvs.style.cursor = "move"; // Change mouse to move cursor
                        if (this.isDragging) {
                            this.areaMoving = true;
                            this.isAnimatingOK = true;
                        }
                    }
                    else if (!this.isDragging) {
                        this.defaultCursor = true;
                    }
                }
                // Mouseover detection for resizable area
                if (this.dx !== undefined && this.dy !== undefined /* && !this.resizing*/) {
                    // Left resizable area
                    if (e.offsetX * this.scaleWidth() >= this.dx - 15 && e.offsetX * this.scaleWidth() <= this.dx + 15) {
                        // Top left
                        if (e.offsetY * this.scaleHeight() >= this.dy - 15 && e.offsetY * this.scaleHeight() <= this.dy + 15) {
                            property = "upL";
                            this.defaultCursor = false;
                            if (!this.resizing && this.inputCvs)
                                this.inputCvs.style.cursor = "nwse-resize";
                            if (this.isDragging) {
                                this.resizing = true;
                                this.isAnimatingOK = true;
                            }
                        }
                        else if (!this.isDragging) {
                            this.defaultCursor = true;
                        }
                        // Bottom left
                        if (e.offsetY * this.scaleHeight() >= this.dy + this.drawTrimmingHeight - 15 && e.offsetY * this.scaleHeight() <= this.dy + this.drawTrimmingHeight + 15) {
                            property = "downL";
                            this.defaultCursor = false;
                            if (!this.resizing && this.inputCvs)
                                this.inputCvs.style.cursor = "nesw-resize";
                            if (this.isDragging) {
                                this.resizing = true;
                                this.isAnimatingOK = true;
                            }
                        }
                        else if (!this.isDragging) {
                            this.defaultCursor = true;
                        }
                    }
                    else if (!this.isDragging) {
                        this.defaultCursor = true;
                    }
                    // Right resizable area
                    if (e.offsetX * this.scaleWidth() >= this.dx + this.drawTrimmingWidth - 15 && e.offsetX * this.scaleWidth() <= this.dx + this.drawTrimmingWidth + 15) {
                        // Top right
                        if (e.offsetY * this.scaleHeight() >= this.dy - 15 && e.offsetY * this.scaleHeight() <= this.dy + 15) {
                            property = "upR";
                            this.defaultCursor = false;
                            if (!this.resizing && this.inputCvs)
                                this.inputCvs.style.cursor = "nesw-resize";
                            if (this.isDragging) {
                                this.resizing = true;
                                this.isAnimatingOK = true;
                            }
                        }
                        else if (!this.isDragging) {
                            this.defaultCursor = true;
                        }
                        // Bottom right
                        if (e.offsetY * this.scaleHeight() >= this.dy + this.drawTrimmingHeight - 15 && e.offsetY * this.scaleHeight() <= this.dy + this.drawTrimmingHeight + 15) {
                            property = "downR";
                            this.defaultCursor = false;
                            if (!this.resizing && this.inputCvs)
                                this.inputCvs.style.cursor = "nwse-resize";
                            if (this.isDragging) {
                                this.resizing = true;
                                this.isAnimatingOK = true;
                            }
                        }
                        else if (!this.isDragging) {
                            this.defaultCursor = true;
                        }
                    }
                    else if (!this.isDragging) {
                        this.defaultCursor = true;
                    }
                }
                if (!this.areaMoving && !this.resizing) {
                    this.isAnimatingOK = false;
                }
            });
        }
        requestFrame(previewCtx, e, property, beforeProperty, beforeWidth, beforeHeight) {
            if (!this.isAnimatingOK)
                return;
            if (!this.isAnimating) {
                this.isAnimating = true;
                this.animationFrameID = requestAnimationFrame(() => {
                    if (this.areaMoving)
                        this.moveDrag(e);
                    if (this.resizable && this.resizing)
                        this.resizeDrag(e, property, beforeProperty, beforeWidth, beforeHeight);
                    if (this.previewCvs && previewCtx)
                        this.previewImg(this.previewCvs, previewCtx); // Draw to preview canvas
                    this.isAnimating = false;
                });
            }
        }
        /**
         * Detects mouse drag events on the corners of the trimming area, allowing it to be resized.
         */
        sizeChange() {
            this.resizable = true;
        }
        resizeDrag(e, property, beforeProperty, beforeWidth, beforeHeight) {
            const zoomClearance = 2;
            beforeProperty = property;
            funcResizing.call(this, e);
            function funcResizing(e) {
                var _a, _b, _c, _d, _e;
                // Trimming area resizing process
                if (this.resizing && this.dx !== undefined && this.dy !== undefined && this.deltaX !== undefined && this.deltaY !== undefined) {
                    // 236~247 is for Safari
                    let veloX = e.clientX - this.deltaX;
                    let veloY = e.clientY - this.deltaY;
                    console.log(`${e.clientX} , ${this.deltaX}`);
                    this.deltaX = e.clientX;
                    this.deltaY = e.clientY;
                    if (veloX == e.clientX)
                        veloX = 0;
                    if (veloY == e.clientY)
                        veloY = 0;
                    if (veloX == 0 && e.movementX > 0)
                        veloX = 1; //To avoid going to 0.
                    if (veloX == 0 && e.movementX < 0)
                        veloX = -1;
                    if (veloY == 0 && e.movementY > 0)
                        veloY = 1;
                    if (veloY == 0 && e.movementY < 0)
                        veloY = -1;
                    if (!(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent))) {
                        veloX = e.movementX;
                        veloY = e.movementY;
                    }
                    if (this.drawTrimmingWidth <= 0 || this.drawTrimmingHeight <= 0) {
                        this.drawTrimmingHeight = 0;
                        this.drawTrimmingWidth = this.drawTrimmingHeight;
                    }
                    this.areaMoving = false;
                    property = beforeProperty;
                    this.isAnimatingOK = true;
                    beforeWidth = this.drawTrimmingWidth;
                    beforeHeight = this.drawTrimmingHeight;
                    console.log(`${veloX} , ${veloY}`);
                    if (property == "downR" && this.img !== undefined && this.inputCvs) {
                        this.inputCvs.style.cursor = "nwse-resize";
                        // Resize detection
                        if (e.movementX !== 0 && e.movementY === 0)
                            this.drawTrimmingWidth += (veloX * this.scaleWidth()) / zoomClearance;
                        if (e.movementY !== 0 && e.movementX === 0)
                            this.drawTrimmingWidth += (veloY * this.scaleHeight()) / zoomClearance;
                        if (e.movementX !== 0 && e.movementY !== 0) {
                            this.drawTrimmingWidth += (veloX * this.scaleWidth()) / zoomClearance;
                            this.drawTrimmingWidth += (veloY * this.scaleHeight()) / zoomClearance;
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
                    if (property == "upR" && this.img && this.inputCvs) {
                        this.beforeDy = this.dy;
                        this.inputCvs.style.cursor = "nesw-resize";
                        // Resize detection
                        if (e.movementX != 0 && e.movementY == 0) {
                            this.dy -= (e.movementX * this.scaleWidth()) / zoomClearance;
                            this.drawTrimmingWidth += (e.movementX * this.scaleWidth()) / zoomClearance;
                        }
                        if (e.movementY != 0 && e.movementX == 0) {
                            this.dy += (e.movementY * this.scaleHeight()) / zoomClearance;
                            this.drawTrimmingWidth -= (e.movementY * this.scaleHeight()) / zoomClearance;
                        }
                        if (e.movementX != 0 && e.movementY != 0) {
                            this.dy -= (e.movementX * this.scaleWidth()) / zoomClearance;
                            this.dy += (e.movementY * this.scaleHeight()) / zoomClearance;
                            this.drawTrimmingWidth += (e.movementX * this.scaleWidth()) / zoomClearance;
                            this.drawTrimmingWidth -= (e.movementY * this.scaleHeight()) / zoomClearance;
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
                    if (property == "downL" && this.img && this.inputCvs) {
                        this.beforeDx = this.dx;
                        this.inputCvs.style.cursor = "nesw-resize";
                        // Resize detection
                        if (e.movementX != 0 && e.movementY == 0) {
                            this.dx += (e.movementX * this.scaleWidth()) / zoomClearance;
                            this.drawTrimmingWidth -= (e.movementX * this.scaleWidth()) / zoomClearance;
                        }
                        if (e.movementY != 0 && e.movementX == 0) {
                            this.dx -= (e.movementY * this.scaleHeight()) / zoomClearance;
                            this.drawTrimmingWidth += (e.movementY * this.scaleHeight()) / zoomClearance;
                        }
                        if (e.movementX != 0 && e.movementY != 0) {
                            this.dx += (e.movementX * this.scaleWidth()) / zoomClearance;
                            this.dx -= (e.movementY * this.scaleHeight()) / zoomClearance;
                            this.drawTrimmingWidth -= (e.movementX * this.scaleWidth()) / zoomClearance;
                            this.drawTrimmingWidth += (e.movementY * this.scaleHeight()) / zoomClearance;
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
                    if (property == "upL" && this.img && this.inputCvs) {
                        this.beforeDx = this.dx;
                        this.beforeDy = this.dy;
                        this.inputCvs.style.cursor = "nwse-resize";
                        // Resize detection
                        if (e.movementX != 0 && e.movementY == 0) {
                            this.dx += (e.movementX * this.scaleWidth()) / zoomClearance;
                            this.dy += (e.movementX * this.scaleWidth()) / zoomClearance;
                            this.drawTrimmingWidth -= (e.movementX * this.scaleWidth()) / zoomClearance;
                        }
                        if (e.movementY != 0 && e.movementX == 0) {
                            this.dx += (e.movementY * this.scaleHeight()) / zoomClearance;
                            this.dy += (e.movementY * this.scaleHeight()) / zoomClearance;
                            this.drawTrimmingWidth -= (e.movementY * this.scaleHeight()) / zoomClearance;
                        }
                        if (e.movementX != 0 && e.movementY != 0) {
                            this.dx += (e.movementX * this.scaleWidth()) / zoomClearance;
                            this.dy += (e.movementX * this.scaleWidth()) / zoomClearance;
                            this.dx += (e.movementY * this.scaleHeight()) / zoomClearance;
                            this.dy += (e.movementY * this.scaleHeight()) / zoomClearance;
                            this.drawTrimmingWidth -= (e.movementX * this.scaleWidth()) / zoomClearance;
                            this.drawTrimmingWidth -= (e.movementY * this.scaleHeight()) / zoomClearance;
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
                        (_d = this.inputCtx) === null || _d === void 0 ? void 0 : _d.drawImage(this.img, this.beforeDx - 1, this.beforeDy - 1, beforeWidth + 2, beforeHeight + 2, this.beforeDx - 1, this.beforeDy - 1, beforeWidth + 2, beforeHeight + 2);
                    }
                    if (this.trimming)
                        (_e = this.inputCtx) === null || _e === void 0 ? void 0 : _e.drawImage(this.trimming, 0, 0, this.trimming.width, this.trimming.height, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight);
                }
            }
        }
        // Ratio of canvas width to client width
        scaleWidth() {
            if (this.inputCvs)
                return this.inputCvs.width / this.inputCvs.clientWidth;
            return 1;
        }
        // Ratio of canvas height to client height
        scaleHeight() {
            if (this.inputCvs)
                return this.inputCvs.height / this.inputCvs.clientHeight;
            return 1;
        }
        // Draw the trimming area to the preview canvas
        previewImg(previewCvs, previewCtx) {
            previewCtx === null || previewCtx === void 0 ? void 0 : previewCtx.clearRect(0, 0, previewCvs.width, previewCvs.height);
            if (this.img && this.dx !== undefined && this.dy !== undefined)
                previewCtx === null || previewCtx === void 0 ? void 0 : previewCtx.drawImage(this.img, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight, 0, 0, previewCvs.width, previewCvs.height);
        }
        // Dragging trimming area
        moveDrag(e) {
            var _a, _b;
            if (this.areaMoving && this.inputCvs) {
                this.inputCvs.style.cursor = "move"; // Keep move cursor during dragging even outside the specified area
                if (this.dx !== undefined)
                    this.beforeDx = this.dx;
                if (this.dy !== undefined)
                    this.beforeDy = this.dy;
                // Move the trimming area by mouse drag
                this.dx = (e.offsetX - this.drawTrimmingWidth / this.scaleWidth() / 2) * this.scaleWidth();
                this.dy = (e.offsetY - this.drawTrimmingHeight / this.scaleHeight() / 2) * this.scaleHeight();
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
                    (_a = this.inputCtx) === null || _a === void 0 ? void 0 : _a.drawImage(this.img, this.beforeDx - 1, this.beforeDy - 1, this.drawTrimmingWidth + 2, this.drawTrimmingHeight + 2, this.beforeDx - 1, this.beforeDy - 1, this.drawTrimmingWidth + 2, this.drawTrimmingHeight + 2);
                    (_b = this.inputCtx) === null || _b === void 0 ? void 0 : _b.drawImage(this.trimming, 0, 0, this.trimming.width, this.trimming.height, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight);
                }
            }
        }
        /**
         * Exports the trimmed image to a specified canvas.
         * @param exportCvs - The canvas to which the trimmed image will be exported.
         */
        // Draw the trimming area to the export canvas
        exportImg(exportCvs) {
            var _a;
            const exportCtx = exportCvs.getContext("2d");
            const exportImgObject = (_a = this.previewCvs) === null || _a === void 0 ? void 0 : _a.toDataURL();
            const exportImgElement = new Image();
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
