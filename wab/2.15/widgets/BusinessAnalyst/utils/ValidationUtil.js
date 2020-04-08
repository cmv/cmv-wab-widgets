///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define([
    "dojo/dom-class"
],
function (domClass) {

    return {

        MIN_RINGS_VALUE: 0,
        MAX_RINGS_VALUE: 1000,
        MIN_DTWT_VALUE: 0,
        MAX_DTWT_VALUE: 300,

        validateInvalidValues: function (textBox1, textBox2, textBox3, errorMessageDiv, invalidErrorMessage) {
            var value1 = textBox1.get("value"),
                value2 = textBox2.get("value"),
                value3 = textBox3.get("value"),
                valid = true;
    
            if (value1.length > 0 && this._tryParseFloat(value1) === null) {
                valid = false;
                domClass.remove(errorMessageDiv, "hidden");
                errorMessageDiv.innerHTML = invalidErrorMessage;
                domClass.add(textBox1.domNode, "invalidValue");
            }
            else {
                domClass.remove(textBox1.domNode, "invalidValue");
            }
    
            if (value2.length > 0 && this._tryParseFloat(value2) === null) {
                valid = false;
                domClass.remove(errorMessageDiv, "hidden");
                errorMessageDiv.innerHTML = invalidErrorMessage;
                domClass.add(textBox2.domNode, "invalidValue");
            }
            else {
                domClass.remove(textBox2.domNode, "invalidValue");
            }
    
            if (value3.length > 0 && this._tryParseFloat(value3) === null) {
                valid = false;
                domClass.remove(errorMessageDiv, "hidden");
                errorMessageDiv.innerHTML = invalidErrorMessage;
                domClass.add(textBox3.domNode, "invalidValue");
            }
            else {
                domClass.remove(textBox3.domNode, "invalidValue");
            }
    
            if (valid)
                domClass.add(errorMessageDiv, "hidden");
    
            return valid;
        },
    
        validateMinMaxValues: function (textBox1, textBox2, textBox3, minValue, maxValue, errorMessageDiv, invalidErrorMessage) {
            var value1 = textBox1.get("value"),
                value2 = textBox2.get("value"),
                value3 = textBox3.get("value"),
                valid = true;
            
            if (value1.length > 0) {
                var value = parseFloat(value1);
              
                if (value < minValue || value > maxValue) {
                    valid = false;
                  
                    domClass.remove(errorMessageDiv, "hidden");
                    errorMessageDiv.innerHTML = invalidErrorMessage;
                    domClass.add(textBox1.domNode, "invalidValue");
                }
                else
                    domClass.remove(textBox1.domNode, "invalidValue");
            }
            else
                domClass.remove(textBox1.domNode, "invalidValue");
            
            if (value2.length > 0) {
                var value = parseFloat(value2);
              
                if (value < minValue || value > maxValue) {
                    valid = false;
                  
                    domClass.remove(errorMessageDiv, "hidden");
                    errorMessageDiv.innerHTML = invalidErrorMessage;
                    domClass.add(textBox2.domNode, "invalidValue");
                }
                else
                    domClass.remove(textBox2.domNode, "invalidValue");
            }
            else
                domClass.remove(textBox2.domNode, "invalidValue");
            
            if (value3.length > 0) {
                var value = parseFloat(value3);

                if (value < minValue || value > maxValue) {
                    valid = false;

                    domClass.remove(errorMessageDiv, "hidden");
                    errorMessageDiv.innerHTML = invalidErrorMessage;
                    domClass.add(textBox3.domNode, "invalidValue");
                }
                else
                    domClass.remove(textBox3.domNode, "invalidValue");
            }
            else
                domClass.remove(textBox3.domNode, "invalidValue");
            
            
            if (valid)
                domClass.add(errorMessageDiv, "hidden");
            
            return valid;
        },
    
        _tryParseFloat: function (str) {
            var retValue = null;
            if (str !== null) {
                if (str.length > 0) {
                    if (!isNaN(str)) {
                        retValue = parseFloat(str);
                    }
                }
            }
            return retValue;
        }
    };
});
