dropdown menu
=========

Модуль, который реализовывает логику «выпадающего меню», с возможностью отследить события раскрытие/скрытие «выпадашки» и выбора элемента внутри неё. Никаких библиотек, только нативный js

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
