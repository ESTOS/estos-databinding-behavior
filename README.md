# estos-databinding-behavior

Synchronizes changes in POJOs to Polymer properties. The databinding is comparable to Polymer 0.5. 

## Usage

Since Polymer 1.0 there isn't any implicit data binding anymore and you have to use  
`Polymer.set`, `Polymer.push`, etc. to propagate changes in your model to the GUI.

If you are using a third party library or want to keep your code separated from your
webcomponents you can use this behavior to bind the models to your Polymer elements.

## Example

To enable binding add `EstosDataBindingBehvior` to your behaviors and define which 
properties should be bound. For example:

```javascript
Polymer({
  is: 'test-element',

  behaviors: [
    EstosBehaviors.EstosDataBindingBehavior
  ],

  properties: {
    contact: {
      type: Object,
      boundProperties: [
        'firstname',
        'details.email',
        'details.addresses'
      ]
    }
  }
  
  ...
```

The behavior will listen to all paths defined in ```boundProperties``` and will notify the
Polymer element of any updates. For example this template will be in sync with your POJOs regardless
how they are changed:
 
```html
<h1>[[contact.firstname]]</div>

<template is="dom-repeat" items="[[contact.details.addresses]]">
  <div>[[item.street]]</div>
</template>
```

A more in depth demo is included in the source code. 
 

## Known limitations

* It uses [observe.js](https://github.com/polymer/observe-js) to listen for changes in the model, so there is a need for dirty-checking 
in every other browser than Chrome. At the moment it will automatically check every 300ms.

* It will notify structure changes of an array (add, remove, resort), but it will not notify
deep changes like `contact.details.addresses[0].street = 'test'`. As a workaround create a 
new element for `address`, define bindings to `street` in that element and just use the new address element
in `dom-repeat`.
  
  
## TODO

* The dirty-checking should be optional and configurable

