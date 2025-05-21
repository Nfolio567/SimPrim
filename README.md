# SimPrim

> **SimPrim** is a simple JavaScript library for trimming images into square shapes only.

---

## 📦 How to Include SimPrim

Use a `<script>` tag to include the library:

```html
<!-- Uncompressed -->
<script src="https://cdn.nfolio.one/simprim.js" integrity="sha256-qrPx0jmwpeft9mt670Gz0Cvc4kARXk7apLFAteQrftQ=" crossorigin="anonymous"></script>

<!-- Minified -->
<script src="https://cdn.nfolio.one/simprim.min.js" integrity="sha256-WymoxirLBQrhCJCyYl4wdgo8a38vac1D7N8MAftf79M=" crossorigin="anonymous"></script>
```

---

## 🚀 Usage

Create a new `SimPrim` instance by passing an input object:

```javascript
const simprim = new SimPrim(input);
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
simprim.init(img, inputCvsWidth, inputCvsHeight, trimmingPath);
simprim.dragDetection(previewCvs);
simprim.sizeChange();
simprim.exportImg(exportCvs);
```

---

## 📝 Notes

- SimPrim only supports square trimming.