# SimPrim

> **SimPrim** is a simple JavaScript library for trimming images into square shapes only.

---

## 📦 How to Include SimPrim

Use a `<script>` tag to include the library:

```html
<!-- Uncompressed -->
<script src="https://cdn.nfolio.one/simprim-1.1.4.js" integrity="sha256-3C65YTaZPsSMQZaaKL/+wRwg4etFaXXzOFx4oAgGj5I=" crossorigin="anonymous"></script>

<!-- Minified -->
<script src="https://cdn.nfolio.one/simprim-1.1.4.min.js" integrity="sha256-2hJl6QpWYuSJvXrSPY88zg8hagcrmVDAKyK7JE98Ou4=" crossorigin="anonymous"></script>
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