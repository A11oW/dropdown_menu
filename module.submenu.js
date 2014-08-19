"use strict";

(function () {
    var Submenu = Submenu || {};
    var _eventHandlers = {}; // массив функций событий

    /**
     * Проврека является ли объект строкой
     *
     * @param {Var} obj - проверяемый объект
     * @returns {boolean}
     * @private
     */
    var _isString = function(obj) {
        return typeof obj === "string";
    };

    /**
     * Проврека является ли объект объектом
     *
     * @param obj - проверяемый объект
     * @returns {boolean}
     * @private
     */
    var _isObject = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    };

    /**
     * Объединение объектов
     * @param dest первый объект
     * @param source второй объект дополняет и\или перезаписывает первый
     * @returns {*} на выходе плучаем объединенный объект
     */
    var _extend = function(dest,source) {
        if(!source) { return dest; }
        for (var prop in source) {
            dest[prop] = source[prop];
        }
        return dest;
    };

    /**
     * Параметры плагина
     *
     * @type {{openClassName: string, isShow: boolean, nodeName: string}}
     * @private
     */
    var _options = {
        openClassName: 'expanded',
        isShow: false,
        nodeName: 'LI'
    }

    /**
     * Функция обработчик на нажатия по элементу меню
     *
     * Если нажали на пункт меню, то останавливаем всплытие события 'click'
     *
     * @param e - событие
     */
    var onClick = function (e) {
        if (e.target.nodeName === _options.nodeName) {
            e.stopPropagation();
            this.trigger.call(this, 'selectChild', e.target);
        } else {
            this.toggleMenu();
        }
        this.trigger.call(this, 'click', e);
    }

    /**
     * Конструктор
     *
     * Можно передать как строку с селектором, так и объект с параметрами
     * new Submenu(id) || new Submenu({params})
     *
     * @returns {boolean}
     * @constructor
     */
    Submenu = function () {
        // Если в качестве параметра передали строку. значит передали селектор элемента
        if (_isObject(arguments[0])) {
            this._options = _extend(_options, arguments[0]);
        }

        // Если в качестве параметра передали объект, значит передали параметры
        if (_isString(arguments[0])) {
            _options = _extend(_options, { selector: arguments[0] });
        }

        this.el = document.querySelector(_options.selector);

        if (this.el instanceof HTMLElement) {
            if(this.isShow()) {
                this.show();
            } else {
                this.hide();
            }
            this.el.addEventListener('click', onClick.bind(this));
        } else {
            return false;
        }
    };
    /**
     * public функции
     * @type {{on: on, off: off, trigger: trigger, isShow: isShow, hide: hide, show: show, toggleMenu: toggleMenu}}
     */
    Submenu.prototype = {
        /**
         * Подписка на событие
         * Использование:
         *  menu.on('select', function(item) { ... }
         *
         * @param eventName - название события
         * @param handler - функция обработчик
         */
        on: function(eventName, handler) {
            if (!_eventHandlers) _eventHandlers = [];
            if (!_eventHandlers[eventName]) {
                _eventHandlers[eventName] = [];
            }
            _eventHandlers[eventName].push(handler);
        },

        /**
         * Прекращение подписки
         *  menu.off('select',  handler)
         *
         * @param eventName - название события
         * @param handler - функция обработчик
         */
        off: function(eventName, handler) {
            var handlers = _eventHandlers[eventName];
            if (!handlers) return;
            for(var i=0; i<handlers.length; i++) {
                if (handlers[i] == handler) {
                    handlers.splice(i--, 1);
                }
            }
        },

        /**
         * Генерация события с передачей данных
         *  this.trigger('select', item);
         *
         * @param eventName - название события
         */
        trigger: function(eventName) {

            if (!_eventHandlers[eventName]) {
                return; // обработчиков для события нет
            }

            // вызвать обработчики
            var handlers = _eventHandlers[eventName];
            for (var i = 0; i < handlers.length; i++) {
                handlers[i].apply(this, [].slice.call(arguments, 1));
            }
        },
        /**
         * Возвращает состояние меню: открыто или закрыто
         *
         * @returns {boolean}
         */
        isShow: function () {
            return _options.isShow;
        },
        /**
         * Закрывает меню
         */
        hide: function () {
            this.el.classList.remove(_options.openClassName);
            _options.isShow = false;
            this.trigger('close');
        },
        /**
         * Открывает меню
         */
        show: function () {
            this.el.classList.add(_options.openClassName);
            _options.isShow = true;
            this.trigger('open');
        },
        /**
         * Функция открывает или закрывет меню в зависимости от его состояния
         */
        toggleMenu: function () {
            if(this.isShow()) {
                this.hide();
            } else {
                this.show();
            }
        }
    }

    window.Submenu = Submenu;
})();