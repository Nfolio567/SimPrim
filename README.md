# SimPrim

> **SimPrim** is a simple JavaScript library for trimming images into square shapes only.

---

## 📦 How to Include SimPrim

Use a `<script>` tag to include the library:

```html
<!-- Uncompressed -->
<script src="https://cdn.nfolio.one/simprim-1.1.3.js" integrity="sha256-n1Fi3QGr3RwtrVFCMnoDqmi1n9WvuFYmuHD8M6J3bn0=" crossorigin="anonymous"></script>

<!-- Minified -->
<script src="https://cdn.nfolio.one/simprim-1.1.3.min.js" integrity="sha256-sjhuiPj/Uw1j4QWoGlficf4YGNF6QqHm+EfJLF4FCCE=" crossorigin="anonymous"></script>
```

---

## 🚀 Usage

Create a new `SimPrim` instance by passing an input object:

```javascript
const simprim = new SimPrim();
```

### 🧾 Input Object Properties

| **Property**     | **Type** | **Required** | **Description**                                                             |
| ---------------- | -------- | ------------ | --------------------------------------------------------------------------- |
| `img`            | `Image`  | ✅            | The image to be trimmed                                                     |
| `inputCvs`       | `Canvas` | ✅            | Canvas used to edit the image                                               |
| `exportCvs`      | `Canvas` | ✅            | Canvas used to draw the trimmed image                                       |
| `inputCvsWidth`  | `number` | Optional     | Width of the input canvas (used when height > width)                        |
| `inputCvsHeight` | `number` | Optional     | Height of the input canvas (used when height > width)                       |
| `previewCvs`     | `Canvas` | Optional     | Canvas used for preview display                                             |
| `trimmingPath`   | `string` | Optional     | URL of trimming mask image (default: `https://cdn.nfolio.one/trimming.png`) |

---



## 🛠 Available Methods

```javascript
simprim.init(inputCvs, img, inputCvsWidth, inputCvsHeight, trimmingPath);
simprim.dragDetection(previewCvs);
simprim.sizeChange();
simprim.exportImg(exportCvs);
```

---

## 📝 Notes

- SimPrim only supports square trimming.
- Sample page : [https://nfolio567.github.io/SimPrim-example/](https://nfolio567.github.io/SimPrim-example/)