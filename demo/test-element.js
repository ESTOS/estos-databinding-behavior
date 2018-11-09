import '@polymer/polymer/polymer-legacy.js';
import '../estos-databinding-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style>

    </style>

    <h3>Element <span>[[id]]</span></h3>

      <u>Properties</u>

      <div>contact.firstname: <span>[[contact.firstname]]</span></div>
      <div>contact.lastname: <span>[[contact.lastname]]</span></div>
      <div>contact.details.email: <span>[[contact.details.email]]</span></div>

      <br>

      <u>Collections</u>

      <div>
        contact.details.addresses:

        <template is="dom-repeat" items="[[contact.details.addresses]]">
          <br> <em>Index <span>[[index]]</span></em>: <span>[[item.zip]]</span> - <span>[[item.city]]</span>
        </template>
      </div>
`,

  is: 'test-element',

  behaviors: [
    EstosBehaviors.EstosDataBindingBehavior
  ],

  properties: {
    id: String,

    contact: {
      type: Object,
      boundProperties: [
        'firstname',
        'lastname',
        'details',
        'details.email',
        'details.addresses'
      ]
    }
  }
});
