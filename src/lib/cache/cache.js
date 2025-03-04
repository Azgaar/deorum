export default class Cache {
  constructor({ debug }) {
    var _cache = Object.create(null);
    var _hitCount = 0;
    var _missCount = 0;
    var _size = 0;
    var _debug = debug;

    this.put = function (key, value, time, timeoutCallback) {
      if (_debug) {
        console.info('caching: %s = %j (@%s)', key, value, time);
      }

      if (typeof time !== 'undefined' && (typeof time !== 'number' || isNaN(time) || time <= 0)) {
        throw new Error('Cache timeout must be a positive number');
      } else if (typeof timeoutCallback !== 'undefined' && typeof timeoutCallback !== 'function') {
        throw new Error('Cache timeout callback must be a function');
      }

      var oldRecord = _cache[key];
      if (oldRecord) {
        clearTimeout(oldRecord.timeout);
      } else {
        _size++;
      }

      var record = {
        value: value,
        expire: time + Date.now()
      };

      if (!isNaN(record.expire)) {
        record.timeout = setTimeout(
          function () {
            _del(key);
            if (timeoutCallback) {
              timeoutCallback(key, value);
            }
          }.bind(this),
          time
        );
      }

      _cache[key] = record;

      return value;
    };

    this.del = function (key) {
      var canDelete = true;

      var oldRecord = _cache[key];
      if (oldRecord) {
        clearTimeout(oldRecord.timeout);
        if (!isNaN(oldRecord.expire) && oldRecord.expire < Date.now()) {
          canDelete = false;
        }
      } else {
        canDelete = false;
      }

      if (canDelete) {
        _del(key);
      }

      return canDelete;
    };

    function _del(key) {
      _size--;
      delete _cache[key];
    }

    this.clear = function () {
      for (var key in _cache) {
        clearTimeout(_cache[key].timeout);
      }
      _size = 0;
      _cache = Object.create(null);
      if (_debug) {
        _hitCount = 0;
        _missCount = 0;
      }
    };

    this.get = function (key) {
      var data = _cache[key];
      if (typeof data != 'undefined') {
        if (isNaN(data.expire) || data.expire >= Date.now()) {
          if (_debug) _hitCount++;
          return data.value;
        } else {
          // free some space
          if (_debug) _missCount++;
          _size--;
          delete _cache[key];
        }
      } else if (_debug) {
        _missCount++;
      }
      return null;
    };

    this.size = function () {
      return _size;
    };

    this.debug = function (bool) {
      _debug = bool;
    };

    this.hits = function () {
      return _hitCount;
    };

    this.misses = function () {
      return _missCount;
    };

    this.keys = function () {
      return Object.keys(_cache);
    };

    this.invalidate = function (collection, args = []) {
      var count = 0;
      for (var key in _cache) {
        if (key.startsWith(collection) && args.every((arg) => key.includes(arg))) {
          this.del(key);
          count++;
        }
      }

      return count;
    };

    this.update = function (collection, id, value) {
      var count = 0;

      for (const key in _cache) {
        if (key.startsWith(collection)) {
          const dataType = key.split('-').at(-1);
          const data = _cache[key].value;

          if (dataType === '$element' && data.id === id) {
            if (_debug) console.info('Updating cache $element');
            _cache[key].value = { ...data, ...value };
            count++;
          } else if (dataType === '$page') {
            const items = data.items.map((item) => (item.id === id ? { ...item, ...value } : item));
            if (_debug) console.info('Updating cache $page');
            _cache[key].value = { ...data, items };
            count++;
          } else if (dataType === '$list') {
            const items = data.map((item) => (item.id === id ? { ...item, ...value } : item));
            if (_debug) console.info('Updating cache $list');
            _cache[key].value = items;
            count++;
          }
        }
      }

      return count;
    };

    this.exportJson = function () {
      var plainJsCache = {};

      // Discard the `timeout` property.
      // Note: JSON doesn't support `NaN`, so convert it to `'NaN'`.
      for (var key in _cache) {
        var record = _cache[key];
        plainJsCache[key] = {
          value: record.value,
          expire: record.expire || 'NaN'
        };
      }

      return JSON.stringify(plainJsCache);
    };

    this.importJson = function (jsonToImport, options) {
      var cacheToImport = JSON.parse(jsonToImport);
      var currTime = Date.now();

      var skipDuplicates = options && options.skipDuplicates;

      for (var key in cacheToImport) {
        // eslint-disable-next-line no-prototype-builtins
        if (cacheToImport.hasOwnProperty(key)) {
          if (skipDuplicates) {
            var existingRecord = _cache[key];
            if (existingRecord) {
              if (_debug) {
                console.info("Skipping duplicate imported key '%s'", key);
              }
              continue;
            }
          }

          var record = cacheToImport[key];

          // record.expire could be `'NaN'` if no expiry was set.
          // Try to subtract from it; a string minus a number is `NaN`, which is perfectly fine here.
          var remainingTime = record.expire - currTime;

          if (remainingTime <= 0) {
            // Delete any record that might exist with the same key, since this key is expired.
            this.del(key);
            continue;
          }

          // Remaining time must now be either positive or `NaN`,
          // but `put` will throw an error if we try to give it `NaN`.
          remainingTime = remainingTime > 0 ? remainingTime : undefined;

          this.put(key, record.value, remainingTime);
        }
      }

      return this.size();
    };
  }
}
