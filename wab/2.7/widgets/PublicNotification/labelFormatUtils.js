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
define([
  'dojo/_base/array',
  'dojo/Deferred',
  'dojo/promise/all',
  'dojo/string',
  'jimu/utils'
], function (
  array,
  Deferred,
  all,
  string,
  jimuUtils
) {
  var mo = {};
  /*------------------------------------------------------------------------------------------------------------------*/

  mo.convertPopupToLabelSpec = function (popupDesc) {
    var desc;
    // e.g., Occupant<br/>{FULLADDR}<br />{MUNICIPALITY}, IL {PSTLZIP5}
    // Sanitize the description after converting <br>s to line breaks
    desc = jimuUtils.sanitizeHTML(mo.convertBreaksToEOLs(popupDesc));

    // Remove remaining tags
    // Mike Samuel https://stackoverflow.com/a/430240/5090610
    var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
    var tagOrComment = new RegExp(
        '<(?:' +
        // Comment body.
        '!--(?:(?:-*[^->])*--+|-?)' +
        // Special "raw text" elements whose content should be elided.
        '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*' +
        '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*' +
        // Regular name
        '|/?[a-z]' +
        tagBody +
        ')>',
        'gi');
    function removeTags(html) {
      var oldHtml;
      do {
        oldHtml = html;
        html = html.replace(tagOrComment, '');
      } while (html !== oldHtml);
      return html.replace(/</g, '&lt;');
    }
    desc = removeTags(desc);

    // Change the open brace used for attribute names to "${" so that we can use dojo/string's substitute()
    desc = desc.replace(/\{/g, '${');

    // Split on the line breaks
    return desc.split('\n');
  };

  mo.createLabelsFromFeatures = function (features, labelRules) {
    var deferred = new Deferred(), content = [], promises = [];

    if (labelRules.relationships) {
      // For each feature,
      array.forEach(features, function (feature) {

        // For each relationship in the label,
        mo.objEach(labelRules.relationships, function (relationship, relationshipId) {
          var promise = new Deferred(), relatedQuery = relationship.relatedQuery, objectId;
          promises.push(promise);

          // Query the relationship for this feature
          objectId = feature.attributes[relationship.operLayer.layerObject.objectIdField];
          relatedQuery.objectIds = [objectId];
          relationship.operLayer.layerObject.queryRelatedFeatures(relatedQuery, function (relatedRecords) {
            var labels = [], relatedFeatures;

            if (relatedRecords[objectId] && relatedRecords[objectId].features) {
              relatedFeatures = relatedRecords[objectId].features;

              array.forEach(relatedFeatures, function (relatedFeature) {
                var labelLines = [], attributes, prefix, newKey;

                // Merge the base and related feature attributes and create the label
                // Prefix related feature's attributes with "relationships/<id>/" to match popup
                attributes = feature.attributes;
                prefix = 'relationships/' + relationshipId + '/';
                mo.objEach(relatedFeature.attributes, function (value, key) {
                  newKey = prefix + key;
                  attributes[newKey] = value;
                });

                array.forEach(labelRules, function (labelLineRule) {
                  // Add the line to the label's list of lines after replacing any attributes it contains
                  labelLines.push(string.substitute(labelLineRule, attributes, mo.useEmptyStringForNull));
                });
                labels.push(labelLines);
              });
            }

            promise.resolve(labels);
          });
        });
      });

      all(promises).then(function (results) {
        array.forEach(results, function (labels) {
          array.forEach(labels, function (labelLines) {
            content.push(labelLines);
          });
        });
        deferred.resolve(content);
      });

    } else {
      array.forEach(features, function (feature) {
        var labelLines = [];
        array.forEach(labelRules, function (labelLineRule) {
          // Add the line to the label's list of lines after replacing any attributes it contains
          labelLines.push(string.substitute(labelLineRule, feature.attributes, mo.useEmptyStringForNull));
        });
        content.push(labelLines);
      });
      deferred.resolve(content);
    }

    return deferred;
  };

  mo.convertBreaksToEOLs = function (html) {
    var html2 = html, matches = html.match(/<br\s*\/?>/gi);
    array.forEach(matches, function (match) {
      html2 = html2.replace(match, '\n');
    });
    return html2;
  };

  mo.useEmptyStringForNull = function (str) {
    return str ? str : '';
  };


  /**
   * Interates over the items in an associative array (forIn).
   * @param {object} obj Object to interate over
   * @param {function} f Function to call for each item
   * @param {object} scope Scope to apply to function call
   */
  // by hugomg https://stackoverflow.com/a/7681980
  mo.objEach = function (obj, f, scope){
    for(var key in obj){
      if(obj.hasOwnProperty(key)){
        f.call(scope, obj[key], key);
      }
    }
  };

  /*------------------------------------------------------------------------------------------------------------------*/
  return mo;
});
