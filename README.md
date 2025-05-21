# SimPrim

> ## SimPrim is a Simple Trimming Image Library

### Including SimPrim

Script tag

```html
//uncompressed
<script src="https://cdn.nfolio.one/simprim.js" integrity="sha256-qrPx0jmwpeft9mt670Gz0Cvc4kARXk7apLFAteQrftQ=" crossorigin="anonymous"></script>
//minifide
<script src="https://cdn.nfolio.one/simprim.min.js" integrity="sha256-WymoxirLBQrhCJCyYl4wdgo8a38vac1D7N8MAftf79M=" crossorigin="anonymous"></script>
```

---

### To use

```javascript
const simprim = new SimPrim(input);
```

It need 

- img: Image will be edited
- inputCvs: Canvas for edit image
- exportCvs: Cannas for draw edidited image
- Optional - inputCvsWidth: when height is longer than width
- Optional - inputCvsHeight: when height is longer than width
- Optional - previewCvs: Canvas for draw preview image
- Optional - trimmingPath: Image for specifying the edit range(Default: "[https://cdn.nfolio.one/trimming.png](https://cdn.nfolio.one/trimming.png)")



Methods

```javascript
simprim.init(img, inputCvsWidth, inputCvsWidth, trimmingPath);
simprim.dragDetection(previewCvs);
simprim.sizeChange();
simprim.exprotImg(exportCvs);
```