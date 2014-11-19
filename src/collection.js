/**
 * Collection.js is small but yet powerfull localstorage based database.
 *
 * @author Dawid Kraczowski <Crac>
 * @license MIT
 */
var Collection = (function() {

    try {
        localStorage.setItem('collection.js', 1);
        localStorage.removeItem('collection.js');
    } catch(e) {
        throw new Error('Local storage is not supported!');
    }

    /**
     * Checks if given value is an array
     * @param {*} object
     * @returns {boolean}
     * @private
     */
    function _isArray(object) {
        return Object.prototype.toString.call(object) === '[object Array]';
    }

    /**
     * Checks if given value is an object
     * @param {*} object
     * @returns {boolean}
     * @private
     */
    function _isObject(object) {
        return typeof object === 'object';
    }

    /**
     * Checks if given value is a function
     * @param {*} object
     * @returns {boolean}
     * @private
     */
    function _isFunction(object) {
        return typeof object === 'function';
    }

    /**
     * Clones object and returns its copy.
     * Copies Objects, Arrays, Functions and primitives.
     *
     * @param {Object} object
     * @private
     */
    function _cloneObject(object) {
        var copy;
        var property;
        var type;

        if (!_isObject(object) || object === null) {
            copy = object;
            return copy;
        }

        if (_isArray(object)) {
            copy = [];
            for (var i = 0, l = object.length; i < l; i++) {
                copy[i] = _cloneObject(object[i]);
            }
            return copy;
        }

        try {
            copy = new object.constructor();
        } catch (e) {
            copy = {};
        }

        for (property in object) {
            if (!object.hasOwnProperty(property)) {
                continue;
            }

            if (_isObject(object[property]) && object[property] !== null) {
                copy[property] = _cloneObject(object[property]);
            } else {
                copy[property] = object[property];
            }
        }
        return copy;
    }

    /**
     * Gets collection's meta data
     * @param {Collection} collectionObj
     * @returns {*}
     * @private
     */
    function _getMeta(collectionObj) {
        var meta = window.localStorage.getItem(collectionObj.name + '_meta');
        if (meta) {
            return JSON.parse(meta);
        }

        return {
            name: collectionObj.name,
            length: 0,
            lastId: 0,
            map: []
        };
    }

    /**
     * Saves collection's meta data
     * @param {Collection} collectionObj
     * @private
     */
    function _saveMeta(collectionObj) {
        window.localStorage.setItem(collectionObj.name + '_meta', JSON.stringify(collectionObj._meta));
    }

    /**
     * Loads collection's data from localstorage and unserialize the objects
     * @param {Collection} collectionObj
     * @returns {*}
     * @private
     */
    function _loadCollection(collectionObj) {

        if (collectionObj._meta.length === 0) {
            return [];
        }
        var data = {};
        collectionObj.length = collectionObj._meta.length;
        for (var i = 0; i < collectionObj._meta.length; i++) {
            var id = collectionObj._meta.map[i];
            var entity = JSON.parse(window.localStorage.getItem(collectionObj.name + '_' + id));
            data[id] = collectionObj._unserialize ? collectionObj._unserialize(entity) : entity;
            if (!_isObject(data[id])) {
                throw new Error('unserialize function must return an object');
            }
            //never allow for overriding id
            Object.defineProperty(data[id], '_id', {
                enumerable: false,
                writable: false,
                configurable: false,
                value: id
            });
            collectionObj._index[id] = i;
            collectionObj[i] = data[id];
        }
        return data;
    }

    /**
     * Removes item from collection
     * This function is only used as an internal helper
     * @param {Collection} collectionObj
     * @param {Object} entity
     * @returns {*}
     * @private
     */
    function _removeFromCollection(collectionObj, entity) {
        var index = -1;
        for (var i = 0; i < collectionObj.length; i++) {
            if (collectionObj[i] === entity) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            return null;
        }
        delete collectionObj[index];

        for (var i = ++index; i < collectionObj.length; i++) {
            collectionObj[i - 1] = collectionObj[i];
        }
        delete collectionObj[i - 1];
        --collectionObj.length;

        return entity;
    }

    /**
     * Resets collection status
     * @param {Collection} collectionObj
     * @private
     */
    function _resetCollection(collectionObj) {
        for (var i = 0; i < collectionObj.length; i++) {
            delete collectionObj[i];
        }
        collectionObj.length = 0;
    }

    /**
     * Rewrites internal entities to collection
     * @param {Collection} collectionObj
     * @private
     */
    function _rewriteData(collectionObj) {
        _resetCollection(collectionObj);
        var i = 0;
        for (var k in collectionObj._data) {
            collectionObj[i++] = collectionObj._data[k];
        }
        collectionObj.length = i + 1;
    }

    /**
     * Creates new collection object
     * @param name collection's name
     * @param unserialize function called when data is loaded from localstorage
     * @param serialize function called before data is saved to localstorage
     * @constructor
     */
    function Collection(name, unserialize, serialize) {
        var serialize = _isFunction(serialize) ? serialize : false;
        var unserialize = _isFunction(unserialize) ? unserialize : false;

        Object.defineProperties(this, {
            name: {
                enumerable: false,
                writable: true,
                value: name
            },
            _index: {
                enumerable: false,
                writable: true,
                value: {}
            },
            _cursor: {
                enumerable: false,
                writable: true,
                value: 0
            },
            _meta: {
                enumerable: false,
                writable: true,
                value: {}
            },
            _data: {
                enumerable: false,
                writable: true,
                value: {}
            },
            _query : {
                enumerable: false,
                writable: true,
                value: null
            },
            _serialize : {
                enumerable: false,
                writable: false,
                value: serialize
            },
            _unserialize : {
                enumerable: false,
                writable: false,
                value: unserialize
            },
            length: {
                writable: true,
                value: 0
            }

        });
        this._meta = _getMeta(this);
        this._data = _loadCollection(this);
    }
    Object.defineProperties(Collection.prototype, {
        id: {
            enumerable: false,
            writable: true
        },
        save: {
            enumerable: false,
            writable: true
        },
        remove: {
            enumerable: false,
            writable: true
        },
        find: {
            enumerable: false,
            writable: true
        },
        drop: {
            enumerable: false,
            writable: true
        },
        sort: {
            enumerable: false,
            writable: true
        }
    });

    /**
     * Gets entity  by its id
     * @param {Number} id
     * @returns {Object}
     */
    Collection.prototype.id = function(id) {
        return this._data.hasOwnProperty(id) ? this._data[id] : null;
    };

    /**
     * Saves or updates entity in the collection
     * @param {Object} item
     * @returns {Number} entity's id
     */
    Collection.prototype.save = function(item) {

        var store = _isFunction(this._serialize) ? this._serialize(_cloneObject(item)) : item;
        if (!_isObject(store)) {
            throw new Error('serialize function must return object');
        }

        if (item._id) {
            if (!this._data.hasOwnProperty(item._id)) {
                throw new Error('Could not find entity with id ' + item._id + ' in collection ' + this.name);
            }
            this._data[item._id] = item;
            window.localStorage.setItem(this.name + '_' + item._id, JSON.stringify(store));
            return item._id;
        }
        //never allow for overriding id
        Object.defineProperty(item, '_id', {
            enumerable: false,
            writable: false,
            configurable: false,
            value: ++this._meta.lastId
        });

        this._data[item._id] = item;
        window.localStorage.setItem(this.name + '_' + item._id, JSON.stringify(store));
        this._meta.map.push(item._id);

        if (_isFunction(this._query)) {
            if (this._query(item)) {
                this[this._meta.length] = item;
                this.length = this._meta.length;
            }
        } else {
            this[this._meta.length] = item;
            this.length = this._meta.length;
        }

        this._meta.length++;
        this._index[this._meta.lastId] = this._meta.length - 1;
        _saveMeta(this);

        return item._id;
    };

    /**
     * Removes entity from the collection
     * @param {Object} item
     * @returns {boolean} true if entity was removed otherwise false
     */
    Collection.prototype.remove = function(item) {
        var id;
        if (_isObject(item)) {
            if (item.hasOwnProperty('_id')) {
                id = item._id;
            } else {
                return false;
            }
        } else {
            id = item;
        }

        if (!this._data.hasOwnProperty(id)) {
            return false;
        }

        localStorage.removeItem(this.name + '_' + id);
        _removeFromCollection(this, this._data[id]);
        delete this._data[id];
        this._meta.length--;
        this._meta.map.splice(this._index[id], 1);
        delete this._index[id];
        _saveMeta(this);
    };

    /**
     * Finds matching entities and updates the collection
     * @param {Function} query optional filter function
     * @param {Function} sort optional sorting function
     */
    Collection.prototype.find = function(query, sort) {
        if (!_isFunction(query)) {
            this._query = null;

            if (_isFunction(sort)) {
                var arr = [];
                for (var key in this._data) {
                    arr.push(this._data[key]);
                }
                arr.sort(sort);
                for (var i = 0, l = arr.length; i < l; i++) {
                    this[i] = arr[i];
                }
                this.length = arr.length;
            } else {
                _rewriteData(this);
            }
            return;
        } else {
            this._query = query;
        }
        _resetCollection(this);

        var arr = [];
        for (var key in this._data) {
            var item = this._data[key];
            if (this._query(item)) {
                arr.push(item);
            }
        }
        if (_isFunction(sort)) {
            arr.sort(sort);
        }

        for (var i = 0, l = arr.length; i < arr.length; i++) {
            this[i] = arr[i];
        }
        this.length = arr.length;
    };

    /**
     * Sorts the collection
     * @param {Function} sort sorting function
     */
    Collection.prototype.sort = function(sort) {
        var arr = [];
        for (var i = 0; i < this.length; i++) {
            arr.push(this[i]);
        }
        arr.sort(sort);
        _resetCollection(this);
        for (var i = 0, l = arr.length; i < l; i++) {
            this[i] = arr[i];
        }
        this.length = arr.length;
    };

    /**
     * Destroys entire collection
     */
    Collection.prototype.drop = function() {
        for (var i in this._data) {
            localStorage.removeItem(this.name + '_' + i);
        }
        localStorage.removeItem(this.name + '_meta');
        _resetCollection(this);
        this._data = {};
        this._meta = _getMeta(this);
    };


    return Collection;
})();