class SimPrim {
    cvs: HTMLCanvasElement;
    img: HTMLImageElement | undefined;
    ctx: CanvasRenderingContext2D | null;
    trimming: HTMLImageElement | undefined;
    previewCvs: HTMLCanvasElement | undefined;
    cx = 0;
    cy = 0;
    dx = 0;
    dy = 0;
    beforeDx = 0;
    beforeDy = 0;
    scaleWidth = 0;
    scaleHeight = 0;
    resizing = false;
    isDragging = false;
    decisionWH = false;
    defaultCursor = true;
    drawTrimmingWidth = 0;
    drawTrimmingHeight = 0;
    constructor(cvs: HTMLCanvasElement) {
        this.cvs = cvs;
        this.ctx = this.cvs.getContext("2d");
    }

    init(img: HTMLImageElement, previewCvs: HTMLCanvasElement, trimmingPath: string) {
        this.img = img;
        let drawWidth = 0;
        let drawHeight = 0;

        this.cvs.width = this.img.width;
        this.cvs.height = this.img.height;

        if (this.img.width <= this.img.height) {
            this.decisionWH = false;
            this.cvs.style.cssText += "height: 70vh; width: auto;";
        } else {
            this.decisionWH = true;
        }

        drawWidth = this.cvs.width;
        drawHeight = this.cvs.height;

        this.ctx?.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, drawWidth, drawHeight);

        const trimming = new Image();
        this.trimming = trimming;
        if (this.decisionWH) {
            this.drawTrimmingHeight = (this.cvs.height / 3) * 2;
            this.drawTrimmingWidth = this.drawTrimmingHeight;
        } else {
            this.drawTrimmingWidth = (this.cvs.width / 3) * 2;
            this.drawTrimmingHeight = this.drawTrimmingWidth;
        }
        this.trimming.onload = () => {
            if (this.trimming) {
                this.ctx?.drawImage(this.trimming, 0, 0, trimming.width, trimming.height, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight);
            }
        };
        this.trimming.src = trimmingPath;

        this.previewImg(previewCvs);

        this.cvs.addEventListener("mousemove", () => {
            if (this.defaultCursor) {
                this.cvs.style.cursor = "default"; //マウスを普通に戻す
            }
            this.previewImg(previewCvs);
        });
    }

    dragDetection() {
        let dragging = false;

        this.cvs.addEventListener("mousedown", () => {
            this.isDragging = true;
        });

        this.cvs.addEventListener("mousemove", (e) => {
            this.scaleWidth = this.cvs.width / this.cvs.clientWidth;
            this.scaleHeight = this.cvs.height / this.cvs.clientHeight;
            this.cx = this.dx / this.scaleWidth + this.drawTrimmingWidth / this.scaleWidth / 2;
            this.cy = this.dy / this.scaleHeight + this.drawTrimmingHeight / this.scaleHeight / 2;
            if (e.offsetX >= this.cx - 10 && e.offsetX <= this.cx + 10 && e.offsetY >= this.cy - 10 && e.offsetY <= this.cy + 10) {
                this.cvs.style.cursor = "move"; //マウスを十字キーに
                this.defaultCursor = false;
                if (this.isDragging) {
                    dragging = true;
                }
            } else {
                this.defaultCursor = true;
            }

            if (dragging) {
                this.cvs.style.cursor = "move";
                this.beforeDx = this.dx;
                this.beforeDy = this.dy;
                this.dx = (e.offsetX - this.drawTrimmingWidth / this.scaleWidth / 2) * this.scaleWidth;
                this.dy = (e.offsetY - this.drawTrimmingHeight / this.scaleHeight / 2) * this.scaleHeight;

                if (this.trimming && this.img) {
                    if (this.dx <= 0) this.dx = 0;
                    if (this.dy <= 0) this.dy = 0;
                    if (this.dx + this.drawTrimmingWidth >= this.img.width) this.dx = this.img.width - this.drawTrimmingWidth;
                    if (this.dy + this.drawTrimmingHeight >= this.img.height) this.dy = this.img.height - this.drawTrimmingHeight;

                    this.ctx?.drawImage(this.img, this.beforeDx - 1, this.beforeDy - 1, this.drawTrimmingWidth + 2, this.drawTrimmingHeight + 2, this.beforeDx - 1, this.beforeDy - 1, this.drawTrimmingWidth + 2, this.drawTrimmingHeight + 2);
                    this.ctx?.drawImage(this.trimming, 0, 0, this.trimming.width, this.trimming.height, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight);
                }
            }
        });

        window.addEventListener("mouseup", () => {
            this.isDragging = false;
            this.resizing = false;
            dragging = false;
        });
    }

    sizeChange() {
        let property = "";
        let beforeWidth = 0;
        let beforeHeight = 0;

        this.cvs.addEventListener("mousemove", (e) => {
            //左ズ
            if (e.offsetX * this.scaleWidth >= this.dx - 15 && e.offsetX * this.scaleWidth <= this.dx + 15) {
                //左上
                if (e.offsetY * this.scaleHeight >= this.dy - 15 && e.offsetY * this.scaleHeight <= this.dy + 15) {
                    property = "upL";
                    this.cvs.style.cursor = "nwse-resize";
                    this.defaultCursor = false;
                    if (this.isDragging) {
                        this.resizing = true;
                    }
                } else {
                    this.defaultCursor = true;
                }
                //左下
                if (e.offsetY * this.scaleHeight >= this.dy + this.drawTrimmingHeight - 15 && e.offsetY * this.scaleHeight <= this.dy + this.drawTrimmingHeight + 15) {
                    property = "downL";
                    this.cvs.style.cursor = "nesw-resize";
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

            //右ズ
            if (e.offsetX * this.scaleWidth >= this.dx + this.drawTrimmingWidth - 15 && e.offsetX * this.scaleWidth <= this.dx + this.drawTrimmingWidth + 15) {
                //右上
                if (e.offsetY * this.scaleHeight >= this.dy - 15 && e.offsetY * this.scaleHeight <= this.dy + 15) {
                    property = "upR";
                    this.cvs.style.cursor = "nesw-resize";
                    this.defaultCursor = false;
                    if (this.isDragging) {
                        this.resizing = true;
                    }
                } else {
                    this.defaultCursor = true;
                }
                //右下
                if (e.offsetY * this.scaleHeight >= this.dy + this.drawTrimmingHeight - 15 && e.offsetY * this.scaleHeight <= this.dy + this.drawTrimmingHeight + 15) {
                    property = "downR";
                    this.cvs.style.cursor = "nwse-resize";
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

            //サイズ変更ロジック
            if (this.resizing) {
                beforeWidth = this.drawTrimmingWidth;
                beforeHeight = this.drawTrimmingHeight;
                if (property == "downR" && this.img) {
                    this.cvs.style.cursor = "nwse-resize";

                    //サイズ変更判定
                    if (e.movementX != 0) this.drawTrimmingWidth += e.movementX * this.scaleWidth;
                    if (e.movementY != 0) this.drawTrimmingHeight += e.movementY * this.scaleHeight;
                    if (e.movementX != 0 && e.movementY != 0) {
                        this.drawTrimmingWidth += 2 * (e.movementX / this.scaleWidth / 4) - e.movementX / this.scaleWidth / 2;
                        this.drawTrimmingHeight += 2 * (e.movementY / this.scaleHeight / 4) - e.movementX / this.scaleHeight / 2;
                    }
                    this.drawTrimmingHeight = this.drawTrimmingWidth;
                    //はみ出し判定
                    if (this.dx + this.drawTrimmingWidth >= this.img.width) {
                        this.drawTrimmingWidth = this.img.width - this.dx;
                        this.drawTrimmingHeight = this.drawTrimmingWidth;
                    }
                    if (this.dy + this.drawTrimmingHeight >= this.img.height) {
                        this.drawTrimmingHeight = this.img.height - this.dy;
                        this.drawTrimmingWidth = this.drawTrimmingHeight;
                    }

                    this.ctx?.drawImage(this.img, this.dx - 1, this.dy - 1, beforeWidth + 2, beforeHeight + 2, this.dx - 1, this.dy - 1, beforeWidth + 2, beforeHeight + 2);
                }
                if (property == "upR" && this.img) {
                    this.beforeDy = this.dy;
                    this.cvs.style.cursor = "nesw-resize";

                    //サイズ変更判定
                    if (e.movementX != 0) {
                        this.dy -= e.movementX * this.scaleWidth;
                        this.drawTrimmingWidth += e.movementX * this.scaleWidth;
                    }
                    this.drawTrimmingHeight = this.drawTrimmingWidth;
                    //はみ出し判定
                    if (this.dx + this.drawTrimmingWidth >= this.img.width) this.drawTrimmingWidth = this.img.width - this.dx;
                    if (this.dy <= 0) {
                        this.dy = 0;
                        this.drawTrimmingHeight = beforeHeight;
                        this.drawTrimmingWidth = beforeWidth;
                    }

                    this.ctx?.drawImage(this.img, this.dx - 1, this.beforeDy - 1, beforeWidth + 2, beforeHeight + 2, this.dx - 1, this.beforeDy - 1, beforeWidth + 2, beforeHeight + 2);
                }
                if (property == "downL" && this.img) {
                    this.beforeDx = this.dx;
                    this.cvs.style.cursor = "nesw-resize";

                    //サイズ変更判定
                    if (e.movementX != 0) {
                        this.dx += e.movementX * this.scaleWidth;
                        this.drawTrimmingWidth -= e.movementX * this.scaleWidth;
                    }
                    this.drawTrimmingHeight = this.drawTrimmingWidth;

                    //はみ出し判定
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
                    this.ctx?.drawImage(this.img, this.beforeDx - 1, this.dy - 1, beforeWidth + 2, beforeHeight + 2, this.beforeDx - 1, this.dy - 1, beforeWidth + 2, beforeHeight + 2);
                }
                if (property == "upL") {
                    this.beforeDx = this.dx;
                    this.beforeDy = this.dy;
                    this.cvs.style.cursor = "nwse-resize";

                    //サイズ変更判定
                    if (e.movementX != 0) {
                        this.dx += e.movementX * this.scaleWidth;
                        this.dy += e.movementX * this.scaleWidth;
                        this.drawTrimmingWidth -= e.movementX * this.scaleWidth;
                    }
                    this.drawTrimmingHeight = this.drawTrimmingWidth;

                    //はみ出し判定
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
                    if (this.img) this.ctx?.drawImage(this.img, this.beforeDx - 1, this.beforeDy - 1, beforeWidth + 2, beforeHeight + 2, this.beforeDx - 1, this.beforeDy - 1, beforeWidth + 2, beforeHeight + 2);
                }
                if (this.trimming) this.ctx?.drawImage(this.trimming, 0, 0, this.trimming.width, this.trimming.height, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight);
            }
        });
    }

    previewImg(previewCvs: HTMLCanvasElement) {
        this.previewCvs = previewCvs;
        const previewCtx = this.previewCvs.getContext("2d");
        if (this.img) previewCtx?.drawImage(this.img, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight, 0, 0, previewCvs.width, previewCvs.height);
    }

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

export {SimPrim};
