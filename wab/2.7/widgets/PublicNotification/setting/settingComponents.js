/*
 | Copyright 2017 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
//====================================================================================================================//
define([
  'dojo/_base/array',
  'dojo/dom-class',
  'dojo/dom-construct',
  'dojo/dom-style',
  'dijit/form/CheckBox',
  'dijit/form/NumberTextBox',
  'dijit/form/Select',
  'dijit/form/TextBox',
  'jimu/utils',
  './SettingSimpleTable'
], function(
  array,
  domClass,
  domConstruct,
  domStyle,
  CheckBox,
  NumberTextBox,
  Select,
  TextBox,
  jimuUtils,
  SimpleTable
) {
  var mo = {};
  /*------------------------------------------------------------------------------------------------------------------*/

  /**
   * Creates a container div with class(es) `classes` containing
   * `contents` divs each separated using the margin in
   * `gapClass`.
   * @param {string} classes One or more classes to apply to created div
   * @param {string?} gapClass Class to be applied to each
   *        contained item but the last to provide trailing
   *        spacing; gaps for horizontal contents should define
   *        ltr/rtl gap class pairs
   * @param {array?} contents Divs to be added to the container
   * @return {object} The created div
   */
  mo.container = function (classes, gapClass, contents) {
    var lastIndex = contents.length - 1,
      div = mo._createDiv('outlineBlockBlue1 ' + (classes || ''));
    array.forEach(contents, function (subcomponent, i) {
      domConstruct.place(subcomponent, div);
      if (i < lastIndex && gapClass) {
        domClass.add(subcomponent, gapClass);
      }
    });
    return div;
  };

  /**
   * Creates a fieldset container div with class(es) `classes`
   * containing `contents` divs each separated using the margin in
   * `gapClass`.
   * @param {string} groupLabel Label to show in fieldset's border
   * @param {string} groupClasses One or more classes to apply to
   *        created div
   * @param {string} classes One or more classes to apply to the
   *        div inside the fieldset
   * @param {string?} gapClass Class to be applied to each
   *        contained item but the last to provide trailing
   *        spacing; gaps for horizontal contents should define
   *        ltr/rtl gap class pairs
   * @param {array?} contents Divs to be added to the container
   * @return {object} The created div
   */
  mo.fieldsetContainer = function (groupLabel, groupClasses, classes, gapClass, contents) {
    var div, fieldset, lastIndex = contents.length - 1, innerContainer;
    div = mo._createDiv(groupClasses);

    fieldset = domConstruct.create('fieldset', {
      'class': 'fieldset'
    }, div);

    if (groupLabel) {
      domConstruct.create('legend', {
        'class': 'fieldsetLegend',
        innerHTML: groupLabel
      }, fieldset);
    }

    innerContainer =
      mo._createDiv('outlineBlockBlue1 fieldsetMainContainer ' + (classes ? classes : ''), fieldset);
    array.forEach(contents, function (subcomponent, i) {
      domConstruct.place(subcomponent, innerContainer);
      if (i < lastIndex && gapClass) {
        domClass.add(subcomponent, gapClass);
      }
    });

    return div;
  };

  /**
   * Creates a WAB "Add..." dropdown div.
   * @param {string} classes One or more classes to apply to created div
   * @param {string} label Text to show in button
   * @param {array} menuItemLabels List of strings for dropdown
   *        menu items
   * @return {object} The created div
   */
  mo.addTextButtonDropdownCtl = function (classes, label, menuItemLabels) {
    var div, control, addButton, addButtonLabel, dropdownMenu;
    div = mo._createDiv('addTextButton-button ' + (classes ? classes : ''));

    addButton = mo._createDiv('button', div);
    addButtonLabel = mo._createSpan('button-text', addButton);
    addButtonLabel.innerHTML = label;

    control = dropdownMenu = domConstruct.create('ul', {
      'class': 'addTextButton-menu'
    }, div);

    array.forEach(menuItemLabels, function (menuItemLabel) {
      domConstruct.create('li', {
        'class': 'addTextButton-item',
        innerHTML: menuItemLabel
      }, dropdownMenu);
    });

    return {
      'div': div,
      'ctl': control
    };
  };

  /**
   * Creates a checkbox div.
   * @param {string} classes One or more classes to apply to created div
   * @param {boolean} initiallyChecked Indicates if the checkbox
   *        should be checked when created; default is false
   * @return {object} The created div
   */
  mo.checkboxCtl = function (classes, initiallyChecked) {
    var div, control;
    div = mo._createDiv(classes);
    control = new CheckBox({
      style: 'margin-top: 3px;',
      checked: initiallyChecked
    });
    domConstruct.place(control.domNode, div);
    control.startup();
    return {
      'div': div,
      'ctl': control
    };
  };

  /**
   * Creates a div containing a Select dropdown.
   * @param {string} divClasses One or more classes to apply to
   *        created div
   * @param {string} dropdownClasses One or more classes to apply
   *        to created dropdown dijit
   * @param {array} options List of objects containing `label` and
   *        `value`--one for each option in the dropdown
   * @return {object} The created div
   * @example `options`:
   * [
   *   {label: "Feet", value: "Feet"},
   *   {label: "Yards", value: "Yards"},
   *   {label: "Meters", value: "Meters", selected: true},
   *   {label: "Kilometers", value: "Kilometers"},
   *   {label: "Miles", value: "Miles"}
   * ]
   */
  mo.dropdownCtl = function (divClasses, dropdownClasses, options) {
    var div = mo._createDiv(divClasses);
    return {
      'div': div,
      'ctl': mo.dropdown(div, dropdownClasses, options)
    };
  };

  mo.dropdown = function (div, dropdownClasses, options) {
    var control;
    control = new Select({
      options: options,
      'class': dropdownClasses
    });
    domConstruct.place(control.domNode, div);
    control.startup();
    return control;
  };

  /**
   * Creates a div button.
   * @param {string} classes One or more classes to apply to created div
   * @param {string} tooltip Button's tooltip
   * @param {function} onClick Event handler to call when button
   *        is clicked; preserves 'this' context
   * @return {object} The created div
   */
  mo.iconButton = function (classes, tooltip) {
    var div = mo._createDiv(classes);
    domStyle.set(div, 'display', 'inline-block');
    div.title = tooltip;
    return div;
  };

  /**
   * Creates a div containing a numeric text input box.
   * @param {string} classes One or more classes to apply to created div
   * @param {string} placeholder Hint to show in input box
   * @return {object} The created div
   */
  mo.numberInputCtl = function (classes, placeholder) {
    var div, control;
    div = mo._createDiv(classes);
    control = new NumberTextBox({
      style: 'width: 100%;',
      required: true,
      placeHolder: placeholder
    });
    control.startup();
    domConstruct.place(control.domNode, div);
    return {
      'div': div,
      'ctl': control
    };
  };

  /**
   * Creates a div containing a WAB SimpleTable.
   * @param {string} classes One or more classes to apply to created div
   * @param {object} definition Defines table general parameters
   *        and the field information for each column; the field
   *        type 'actions' is a special column for re-ordering
   *        table rows
   * @param {array?} initialValues Array of rows; each row has
   *        tags corresponding to the names of the fields in the
   *        definition
   * @return {object} The created div
   * @example `definition`:
   * {
   *   autoHeight: true,
   *   selectable: false,
   *   fields: [{
   *     name: 'name',
   *     title: 'Name',
   *     width: 'auto',
   *     type: 'text',
   *     editable: false
   *   }, {
   *     name: 'actions',
   *     title: '',
   *     width: '70px',
   *     type: 'actions',
   *     actions: ['up', 'down', 'delete']
   *   }
   * }
   */
  mo.tableCtl = function (classes, definition, initialValues) {
    var div, control;
    div = mo._createDiv(classes);
    control = new SimpleTable(definition);
    control.placeAt(div);
    control.startup();

    if (Array.isArray(initialValues) && initialValues.length > 0) {
      control.addRows(initialValues);
    }

    return {
      'div': div,
      'ctl': control
    };
  };

  /**
   * Creates a div with text.
   * @param {string} classes One or more classes to apply to created div
   * @param {string} contents Text to put into div
   * @return {object} The created div
   */
  mo.text = function (classes, contents) {
    var div = mo._createDiv('outlineBlockRed1 ' + (classes || ''));
    div.innerHTML = jimuUtils.sanitizeHTML(contents || '');
    return div;
  };

  /**
   * Creates a text button.
   * @param {string} classes One or more classes to apply to created div
   * @param {string} label Text to put into button
   * @param {string} tooltip Button's tooltip
   * @param {function} onClick Event handler to call when button
   *        is clicked; preserves 'this' context
   * @return {object} The created div
   */
  mo.textButton = function (classes, label, tooltip) {
    var div = mo._createDiv('jimu-btn ' + (classes || ''));
    div.innerHTML = label;
    div.title = tooltip;
    return div;
  };

  /**
   * Creates a div containing a text input box.
   * @param {string} classes One or more classes to apply to created div
   * @param {string} placeholder Hint to show in input box
   * @return {object} The created div
   */
  mo.textInputCtl = function (classes, placeholder) {
    var div, control;
    div = mo._createDiv('outlineBlockGreen1 ' + (classes || ''));
    control = new TextBox({
      style: 'width: 100%;',
      placeHolder: placeholder
    });
    control.startup();
    domConstruct.place(control.domNode, div);
    return {
      'div': div,
      'ctl': control
    };
  };

  /*------------------------------------------------------------------------------------------------------------------*/

  /**
   * Creates a span.
   * @param {string} spanClass Class(es) to apply to span
   * @param {object?} parentSpan Div to contain created span
   * @return {object} The created span
   */
  mo._createSpan = function (spanClass, parentSpan) {
    var span = domConstruct.create('span', {
      'class': spanClass
    }, parentSpan);
    return span;
  };

  /**
   * Creates a div.
   * @param {string} divClass Class(es) to apply to div
   * @param {object?} parentDiv Div to contain created div
   * @return {object} The created div
   */
  mo._createDiv = function (divClass, parentDiv) {
    var div = domConstruct.create('div', {
      'class': divClass
    }, parentDiv);
    return div;
  };

  /*------------------------------------------------------------------------------------------------------------------*/
  return mo;
});
