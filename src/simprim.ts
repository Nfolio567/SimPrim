class SimPrim {
    private inputCvs: HTMLCanvasElement; // 編集するキャンバス
    private img: HTMLImageElement | undefined; // 編集させられる画像
    private inputCtx: CanvasRenderingContext2D | null; // 編集するキャンバスのコンテキスト
    private trimming: HTMLImageElement | undefined; // トリミングする範囲を指定する画像 as トリミング野郎
    private previewCvs: HTMLCanvasElement | undefined; // プレビュー用キャンバス
    private cx: number | undefined; // トリミング領域の中心X座標
    private cy: number | undefined; // トリミング領域の中心Y座標
    private dx: number | undefined; // トリミング画像の描画位置（X軸）
    private dy: number | undefined; // トリミング画像の描画位置（Y軸）
    private beforeDx = 0; // 前フレームのX座標
    private beforeDy = 0; // 前フレームのY座標
    private scaleWidth = 0; // キャンバス幅とクライアント幅の比率
    private scaleHeight = 0; // キャンバス高さとクライアント高さの比率
    private resizing = false; // サイズ変更中かどうか
    private dragging = false; // 範囲内でのドラッグフラグ
    private isDragging = false; // ドラッグ中かどうか
    private decisionWH = false; // 横長か縦長か
    private isAnimating = false; // アニメーション中かどうか
    private defaultCursor = true; // デフォルトカーソルのフラグ
    private drawTrimmingWidth = 0; // トリミングの幅
    private drawTrimmingHeight = 0; // トリミングの高さ
    private draggingFrame: number | undefined; // ドラッグ中のフレーム

    constructor(inputCvs: HTMLCanvasElement) {
        this.inputCvs = inputCvs;
        this.inputCtx = this.inputCvs.getContext("2d");
    }

    /**
     * Initialize the SimPrim instance with an image, preview canvas, and trimming path.
     * @param img - The image to be edited.
     * @param trimmingPath - The path to the trimming image.
     * @param inputCvsHeight - Optional : The height of the input canvas when height is longer than width.　If you want to trim a vertical image, you must explicitly specify it.
     * @param inputCvsWidth - Optional : The width of the input canvas when height is longer than width. If you want to trim a vertical image, you must explicitly specify it.
     */
    init(img: HTMLImageElement, trimmingPath: string, inputCvsHeight?: String, inputCvsWidth?: String) {
        //　変数初期化
        this.img = img;
        let drawWidth = 0;
        let drawHeight = 0;
        this.cx = 0;
        this.cy = 0;
        this.dx = 0;
        this.dy = 0;

        this.inputCvs.width = this.img.width;
        this.inputCvs.height = this.img.height;

        // 画像の縦横比を判定し、縦長の場合は高さ優先に設定
        if (this.img.width <= this.img.height) {
            this.decisionWH = false;
            this.inputCvs.style.cssText += "height:" + inputCvsHeight + ";" + "width:" + inputCvsWidth + ";";
        } else {
            this.decisionWH = true;
        }

        // Canvasに画像を描画する際の幅と高さを設定
        drawWidth = this.inputCvs.width;
        drawHeight = this.inputCvs.height;

        this.inputCtx?.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, drawWidth, drawHeight);

        // トリミング画像を初期化
        const trimming = new Image();
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
                console.log("#####################");
            }
        };
        this.trimming.src = trimmingPath;

        this.inputCvs.addEventListener("mousemove", () => {
            if (this.defaultCursor) {
                this.inputCvs.style.cursor = "default"; // マウスを普通に戻す
            }
        });

        // windowにしてるのは、マウスがキャンバスから出てもドラッグを続けられるようにするため
        window.addEventListener("mouseup", () => {
            this.isDragging = false;
            this.resizing = false;
            this.dragging = false;
            if (this.draggingFrame) cancelAnimationFrame(this.draggingFrame); // 既存のアニメーションをキャンセル
        });
    }

    /**
     * Detects mouse drag events on the canvas and allows for dragging the trimming area.
     * @param previewCvs - Optional : The canvas for previewing the trimmed image.
     */
    dragDetection(previewCvs?: HTMLCanvasElement) {
        if (previewCvs) this.previewImg(previewCvs); // プレビューcanvasに描画

        this.inputCvs.addEventListener("mousedown", () => {
            this.isDragging = true; // ドラッグフラグ
        });

        this.inputCvs.addEventListener("mousemove", (e) => {
            //if (this.draggingFrame) cancelAnimationFrame(this.draggingFrame); // 既存のアニメーションをキャンセル

            if (this.defaultCursor) {
                this.inputCvs.style.cursor = "default"; //　マウスを普通に戻す
            }

            this.scaleWidth = this.inputCvs.width / this.inputCvs.clientWidth; // 比率計算
            this.scaleHeight = this.inputCvs.height / this.inputCvs.clientHeight; // 同じく
            if (this.dx !== undefined) this.cx = this.dx / this.scaleWidth + this.drawTrimmingWidth / this.scaleWidth / 2; // 中心座標計算
            if (this.dy !== undefined) this.cy = this.dy / this.scaleHeight + this.drawTrimmingHeight / this.scaleHeight / 2; // 同じく
            if (this.cx !== undefined && this.cy !== undefined) {
                if (e.offsetX >= this.cx - 10 && e.offsetX <= this.cx + 10 && e.offsetY >= this.cy - 10 && e.offsetY <= this.cy + 10) {
                    this.inputCvs.style.cursor = "move"; //　マウスを十字キーに
                    this.defaultCursor = false;
                    if (this.isDragging) {
                        this.dragging = true;
                    }
                } else {
                    this.defaultCursor = true;
                }
            }

            if (this.dragging) {
                this.inputCvs.style.cursor = "move"; //　上の指定範囲から出てもドラッグ中は十字キーにするようにする
                if (this.dx !== undefined) this.beforeDx = this.dx;
                if (this.dy !== undefined) this.beforeDy = this.dy;

                // マウスドラッグによるトリミング領域の移動
                this.dx = (e.offsetX - this.drawTrimmingWidth / this.scaleWidth / 2) * this.scaleWidth;
                this.dy = (e.offsetY - this.drawTrimmingHeight / this.scaleHeight / 2) * this.scaleHeight;

                // トリミング領域のはみ出しチェック
                if (this.trimming && this.img) {
                    if (this.dx <= 0) this.dx = 0;
                    if (this.dy <= 0) this.dy = 0;
                    if (this.dx + this.drawTrimmingWidth >= this.img.width) this.dx = this.img.width - this.drawTrimmingWidth;
                    if (this.dy + this.drawTrimmingHeight >= this.img.height) this.dy = this.img.height - this.drawTrimmingHeight;

                    if (!this.isAnimating) {
                        this.isAnimating = true;
                        this.draggingFrame = requestAnimationFrame(() => {
                            if (this.img && this.trimming && this.beforeDx && this.beforeDy && this.dx !== undefined && this.dy !== undefined) {
                                this.inputCtx?.drawImage(this.img, this.beforeDx - 1, this.beforeDy - 1, this.drawTrimmingWidth + 2, this.drawTrimmingHeight + 2, this.beforeDx - 1, this.beforeDy - 1, this.drawTrimmingWidth + 2, this.drawTrimmingHeight + 2);
                                this.inputCtx?.drawImage(this.trimming, 0, 0, this.trimming.width, this.trimming.height, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight);
                            }
                            if (previewCvs) this.previewImg(previewCvs); // フレームが生成された時にプレビューキャンバスにトリミング範囲を描画
                        });
                        this.isAnimating = false;
                    }
                }
            }
        });
    }

    /**
     * Detects mouse drag events on the corners of the trimming area, allowing it to be resized.
     */
    sizeChange() {
        let property = ""; // マウスが今どこにいるか
        let beforeWidth = 0; // サイズ変更前の幅
        let beforeHeight = 0; // サイズ変更前の高さ

        // サイズ変更可能エリアのマウスオーバー判定
        this.inputCvs.addEventListener("mousemove", (e) => {
            // 左側のサイズ変更エリア
            if (this.dx !== undefined && this.dy !== undefined) {
                if (e.offsetX * this.scaleWidth >= this.dx - 15 && e.offsetX * this.scaleWidth <= this.dx + 15) {
                    // 左上
                    if (e.offsetY * this.scaleHeight >= this.dy - 15 && e.offsetY * this.scaleHeight <= this.dy + 15) {
                        property = "upL";
                        this.inputCvs.style.cursor = "nwse-resize";
                        this.defaultCursor = false;
                        if (this.isDragging) {
                            this.resizing = true;
                        }
                    } else {
                        this.defaultCursor = true;
                    }
                    // 左下
                    if (e.offsetY * this.scaleHeight >= this.dy + this.drawTrimmingHeight - 15 && e.offsetY * this.scaleHeight <= this.dy + this.drawTrimmingHeight + 15) {
                        property = "downL";
                        this.inputCvs.style.cursor = "nesw-resize";
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

                // 右側のサイズ変更エリア
                if (e.offsetX * this.scaleWidth >= this.dx + this.drawTrimmingWidth - 15 && e.offsetX * this.scaleWidth <= this.dx + this.drawTrimmingWidth + 15) {
                    // 右上
                    if (e.offsetY * this.scaleHeight >= this.dy - 15 && e.offsetY * this.scaleHeight <= this.dy + 15) {
                        property = "upR";
                        this.inputCvs.style.cursor = "nesw-resize";
                        this.defaultCursor = false;
                        if (this.isDragging) {
                            this.resizing = true;
                        }
                    } else {
                        this.defaultCursor = true;
                    }
                    // 右下
                    if (e.offsetY * this.scaleHeight >= this.dy + this.drawTrimmingHeight - 15 && e.offsetY * this.scaleHeight <= this.dy + this.drawTrimmingHeight + 15) {
                        property = "downR";
                        this.inputCvs.style.cursor = "nwse-resize";
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

                // トリミング領域のサイズ変更処理
                if (this.resizing) {
                    beforeWidth = this.drawTrimmingWidth;
                    beforeHeight = this.drawTrimmingHeight;
                    if (property == "downR" && this.img) {
                        this.inputCvs.style.cursor = "nwse-resize";

                        // サイズ変更判定
                        if (e.movementX != 0) this.drawTrimmingWidth += e.movementX * this.scaleWidth;
                        if (e.movementY != 0) this.drawTrimmingHeight += e.movementY * this.scaleHeight;
                        if (e.movementX != 0 && e.movementY != 0) {
                            this.drawTrimmingWidth += 2 * (e.movementX / this.scaleWidth / 4) - e.movementX / this.scaleWidth / 2;
                            this.drawTrimmingHeight += 2 * (e.movementY / this.scaleHeight / 4) - e.movementX / this.scaleHeight / 2;
                        }
                        this.drawTrimmingHeight = this.drawTrimmingWidth;
                        // はみ出し判定
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

                        // サイズ変更判定
                        if (e.movementX != 0) {
                            this.dy -= e.movementX * this.scaleWidth;
                            this.drawTrimmingWidth += e.movementX * this.scaleWidth;
                        }
                        this.drawTrimmingHeight = this.drawTrimmingWidth;
                        // はみ出し判定
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

                        // サイズ変更判定
                        if (e.movementX != 0) {
                            this.dx += e.movementX * this.scaleWidth;
                            this.drawTrimmingWidth -= e.movementX * this.scaleWidth;
                        }
                        this.drawTrimmingHeight = this.drawTrimmingWidth;

                        // はみ出し判定
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

                        // サイズ変更判定
                        if (e.movementX != 0) {
                            this.dx += e.movementX * this.scaleWidth;
                            this.dy += e.movementX * this.scaleWidth;
                            this.drawTrimmingWidth -= e.movementX * this.scaleWidth;
                        }
                        this.drawTrimmingHeight = this.drawTrimmingWidth;

                        // はみ出し判定
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
                        if (this.img) this.inputCtx?.drawImage(this.img, this.beforeDx - 1, this.beforeDy - 1, beforeWidth + 2, beforeHeight + 2, this.beforeDx - 1, this.beforeDy - 1, beforeWidth + 2, beforeHeight + 2);
                    }
                    if (this.trimming) this.inputCtx?.drawImage(this.trimming, 0, 0, this.trimming.width, this.trimming.height, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight);
                }
            }
        });
    }

    // プレビューキャンバスにトリミング範囲を描画
    private previewImg(previewCvs: HTMLCanvasElement) {
        this.previewCvs = previewCvs;
        const previewCtx = this.previewCvs.getContext("2d");
        previewCtx?.clearRect(0, 0, previewCvs.width, previewCvs.height);
        if (this.img && this.dx !== undefined && this.dy !== undefined) previewCtx?.drawImage(this.img, this.dx, this.dy, this.drawTrimmingWidth, this.drawTrimmingHeight, 0, 0, previewCvs.width, previewCvs.height);
    }

    /**
     * Exports the trimmed image to a specified canvas.
     * @param exportCvs - The canvas to which the trimmed image will be exported.
     */
    // トリミング領域をエクスポート用Canvasに描画
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
