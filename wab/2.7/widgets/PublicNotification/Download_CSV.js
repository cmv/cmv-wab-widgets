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
  'dojo/_base/declare',
  'dojo/Deferred'
  ], function(
    array,
    declare,
    Deferred
  ) {
    return declare(null, {

      /**
       * Loads the download.
       * @memberOf Download_CSV#
       */
      save: function(contentArray, filenameRoot) {
        var labels, done = new Deferred();

        labels = array.map(contentArray, function (labelLines) {
          return '"' + labelLines.join('","') + '"\n';
        });

        // Save the content
        this._createAndSaveCSV(labels, filenameRoot);
        done.resolve(true);

        return done;
      },

      _createAndSaveCSV: function(contentArray, filenameRoot) {
        // Supports Chrome, Firefox, Edge, IE 11, Mac Safari
        // From Stack Overflow https://stackoverflow.com/a/33542499
        // CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/)
        // Ludovic Feltz (https://stackoverflow.com/users/2576706/ludovic-feltz),
        // Smi (https://stackoverflow.com/users/1128737/smi)
        var blob = new Blob(contentArray, {type: 'text/csv'});
        if(window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, filenameRoot + '.csv');
        }
        else{
          var elem = window.document.createElement('a');
          elem.href = window.URL.createObjectURL(blob);
          elem.download = filenameRoot + '.csv';
          document.body.appendChild(elem);
          elem.click();
          document.body.removeChild(elem);
          window.URL.revokeObjectURL(blob);
        }
      }

    });
  }
);
