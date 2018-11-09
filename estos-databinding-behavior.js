import '@polymer/polymer/polymer-legacy.js';
import 'observe-js/src/observe.js';

if (!Object.observe) {
  setInterval(Platform.performMicrotaskCheckpoint, 300);
}

window.EstosBehaviors = window.EstosBehaviors || {};
window.EstosBehaviors.EstosDataBindingBehavior = {

  properties: {
    __boundPathObservers: {
      type: Array,
      value: function() { return []; }
    },

    __boundArrayObservers: {
      type: Object,
      value: function() { return {}; }
    },

    _isDebugEnabled: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Searches for bound properties in this element and will install the required observers.
   */
  attached: function() {
    for (let property in this.properties) {
      let propertyInfo = this.properties[property];

      if (Array.isArray(propertyInfo.boundProperties)) {

        propertyInfo.boundProperties.forEach(function(subPath){
          let path =  property + '.' + subPath;

          this._bindingDebug('adding path observer for ', path, this.__data);

          let observer = new PathObserver(this, '__data.' + path);
          observer.open(this._boundPathChanged.bind(this, path));

          this.__boundPathObservers.push(observer);

        }.bind(this));
      }
    }
  },

  /**
   * Unregisters all installed observers.
   */
  detached: function() {
    this.__boundPathObservers.forEach(function(observer) {
      this._bindingDebug('removing path observer for ', observer.path_.toString());
      observer.close();
    }.bind(this));

    for (let path in this.__boundArrayObservers) {
      this._bindingDebug('removing array observer for ', path);
      this.__boundArrayObservers[path].close()
    }

    this.__boundPathObservers = [];
    this.__boundArrayObservers = {};
  },

  /**
   * Will be called if a bound property or the path of the property has changed and
   * will notify the polymer element about the new value.
   *
   * If the new value is an array it will install a new ArrayObserver on it.
   *
   * @param path
   * @param newValue
   * @private
   */
  _boundPathChanged: function(path, newValue) {
    this._bindingDebug('value changed for ', path);

    // If the path represents an array, register an ArrayObserver
    if (this.__boundArrayObservers[path]) {
      this._bindingDebug('removing array observer for ', path);

      this.__boundArrayObservers[path].close();
      delete this.__boundArrayObservers[path];
    }

    if (Array.isArray(newValue)) {
      this._bindingDebug('adding array observer for ', path);

      let observer = new ArrayObserver(newValue);
      observer.open(this._boundArrayChanged.bind(this, path));

      this.__boundArrayObservers[path] = observer;
    }

    // Notify changes
    this.notifyPath(path, newValue);
  },

  /**
   * Callback for changes in an array's structure (adding or removing an item).
   * which will notify the element about the changes.
   *
   * @param path
   * @param splices
   * @private
   */
  _boundArrayChanged: function(path, splices) {
    this._bindingDebug('array changed ', path);

    let array = this.get(path);

    splices.forEach(function(splice) {
      splice.object = array;
      splice.type = 'splice';
    });

    this.notifySplices(path, splices);
  },

  _bindingDebug: function() {
    if (this._isDebugEnabled) {
      arguments[0] = 'EstosDataBindingBehavior: ' + arguments[0];
      console.debug.apply(console, arguments);
    }
  }

};
