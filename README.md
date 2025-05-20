# SimPrim

> ## SimPrim is a Simple Trimming Image Library

### Including SimPrim

Script tag

```html
//uncompressed
<script src="https://cdn.nfolio.one/simprim.js" integrity="8b75d89cdd3fd996d3c334489a2145a233b17d582b428bb10f94c8123ed29a9a" crossorigin="anonymous"></script>
//minifide
<script src="https://cdn.nfolio.one/simprim.min.js" integrity="5b29a8c62acb050ae10890b2625e30760a3c6b7f2f69cd43ecdf0c01fb5fefd3" crossorigin="anonymous"></script>
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