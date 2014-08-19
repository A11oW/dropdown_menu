dropdown menu
=========

#### Плагин для «выпадающего меню»
##### Использование
```javascript
var submenu = new Submenu({
                    selector: '.dd',
                    isShow: true
                });
```
##### События
```javascript
submenu.on('click', function (event) {
});
submenu.on('selectChild', function (child) {
});
```
