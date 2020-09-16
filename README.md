# wackystack

A jQuery plugin that transforms your content into a 3D stack of cards. Flip through each card in the stack by scrolling down the page.

## Usage
```html
<div class="my-selector">
  <div class="cards">
    <div class="card">
      ...
    </ div>
    <div class="card">
      ...
    </ div>
    <div class="card">
      ...
    </ div>
  </ div>
</ div>
```
``` javascript
$('.my-selector').wackystack();
```
---
accepted options
``` javascript
$('.my-selector').wackystack({
  classes: {
    cards: 'cards',
    card: 'card',
  },
  cardOffset: 15,
  cardScaleMultiplyer: .02,
  scrollThreshold: 1000,
});
```
