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
  'dojo/_base/array',
  'dojo/_base/kernel',
  'dojo/_base/lang',
  'dojo/Deferred',
  'dojo/promise/all',
  'esri/arcade/arcade',
  'esri/arcade/Feature',
  'esri/graphic',
  './generalUtils'
], function (
  array,
  kernel,
  lang,
  Deferred,
  all,
  Arcade,
  ArcadeFeature,
  Graphic,
  generalUtils
) {
  var mo = {};
  /*------------------------------------------------------------------------------------------------------------------*/

  /**
   * Converts the text of a custom popup into a multiline label
   * specification; conversion splits text into lines on <br>s,
   * removes HTML tags, and changes field tags from popup style to
   * string.substitute form.
   * @param {object} popupInfo Layer's popupInfo structure containing description, fieldInfos, and expressionInfos
   * @return {string} Label spec
   */
  mo.convertPopupToLabelSpec = function (popupInfo) {
    var desc, fieldNamesCol = [], description, fields, expressionInfos;
    description = popupInfo.description;
    fields = popupInfo.fieldInfos;
    expressionInfos = popupInfo.expressionInfos;

    // e.g., Occupant<br/>{FULLADDR}<br />{MUNICIPALITY}, IL {PSTLZIP5}
    // Sanitize the description after converting <br>s and </p>s to line breaks
    desc = generalUtils.sanitizeNoTags(mo.convertBreaksToEOLs(mo.convertEndParasToEOLs(description))).trim();

    // Change the open brace used for attribute names to "${" so that we can use dojo/string's substitute()
    desc = desc.replace(/\{/gi, '${');

    // Remove non-breaking spaces, which aren't rendered correctly in CSV output and aren't needed in PDF output
    desc = desc.replace(/\u00a0/gi, ' ');

    // Split on the line breaks
    desc = desc.split('\n');

    // Trim each line, since HTML pretty much does that
    desc = array.map(desc, function (line) {
      var fieldNamesUsed = "";
      //For each line perform two operation
      //1. Replace the fieldName used in custom popup with the fieldName in layer(gitHub Ticket #9)
      //2. Add the used field name for each col in an array so that it can be used as csv header
      line = line.replace(/\{([^}]+)\}/g, function (m, p1) {
        var fieldName;
        array.some(fields, function (field) {
          var fieldTitle;
          //match the fieldname from layer and field name used in custom popup
          //by converting them in lowercase
          if (field.fieldName.toLowerCase() === p1.toLowerCase()) {
            fieldName = field.fieldName;
            fieldTitle = field.label || field.fieldName;
            //look for field title in expressions object when label in not available
            if (!field.hasOwnProperty("label") && expressionInfos) {
              for (var i = 0; i < expressionInfos.length; i++){
                if (fieldTitle === 'expression/' + expressionInfos[i].name) {
                  fieldTitle = expressionInfos[i].title;
                }
              }
            }
            //for each col their could be multiple fields used so contact fieldNamesUsed in each col
            if (fieldNamesUsed === "") {
              fieldNamesUsed = fieldTitle;
            } else {
              fieldNamesUsed = fieldNamesUsed + " " + fieldTitle;
            }
            return true;
          }
        });
        //if field name matched use it
        if(fieldName){
          return (p1) ? "{" + fieldName + "}" : m;
        } else {
          return (p1) ? "{" + p1 + "}" : m;
        }
      });
      //push the fieldnames used for this col in an array
      //finally this ary will have titles for each col
      fieldNamesCol.push(fieldNamesUsed);
      return line.trim();
    });
    //store fieldNamesCol as csv header titles, which can be used while creating csv
    desc.csvHeaderRow = fieldNamesCol;
    return desc;
  };

  /**
   * Creates labels from features.
   * @param {array} features Features whose attributes are to be
   *        used to populate labels
   * @param {string} labelLineTemplates Label specification as created by
   *        convertPopupToLabelSpec
   * @return {Deferred} Array of labels; each label is an array of
   *         label line strings
   */
  mo.createLabelsFromFeatures = function (features, labelLineTemplates) {
    var deferred = new Deferred(), content = [], promises = [], relatedRecordsFound = 0;

    if (labelLineTemplates.relationships) {
      // For each feature,
      array.forEach(features, function (feature) {

        // For each relationship in the label,
        mo.objEach(labelLineTemplates.relationships, function (relationship, relationshipId) {
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
                var attributes, prefix, newKey, featureWithRelationshipAttribs;

                // Merge the base and related feature attributes and create the label
                // Prefix related feature's attributes with "relationships/<id>/" to match popup
                attributes = feature.attributes;
                prefix = 'relationships/' + relationshipId + '/';
                mo.objEach(relatedFeature.attributes, function (value, key) {
                  newKey = prefix + key;
                  attributes[newKey] = value;
                });

                featureWithRelationshipAttribs = new Graphic(feature.geometry, null, attributes);

                // Substitute attribute values and resolved Arcade expressions into label lines
                labels.push(mo.populateLabelLines(featureWithRelationshipAttribs, labelLineTemplates));
              });
            }

            promise.resolve(labels);
          });
        });
      });

      all(promises).then(function (results) {
        // Look at the related records for each found address
        array.forEach(results, function (labels) {
          // For each found address, save its labels
          array.forEach(labels, function (labelLines) {
            ++relatedRecordsFound;
            content.push(labelLines);
          });
        });
        console.log(relatedRecordsFound + ' related address features found');
        deferred.resolve(content);
      });

    } else {
      array.forEach(features, function (feature) {
        // Substitute attribute values and resolved Arcade expressions into label lines
        content.push(mo.populateLabelLines(feature, labelLineTemplates));
      });
      deferred.resolve(content);
    }

    return deferred;
  };

  /**
   * Substitutes attribute values and resolved Arcade expressions into label lines.
   * @param {object} feature Feature whose attributes are to be used to populate the label
   * @param {array} labelLineTemplates Label specification as created by
   *        convertPopupToLabelSpec
   */
  mo.populateLabelLines = function (feature, labelLineTemplates) {
    var labelLines = [];

    array.forEach(labelLineTemplates, function (labelLineRule) {
      labelLines.push(
        mo.substitute(
          labelLineRule,
          mo.combineFeatureAttributesAndExpressionResolutions(feature, labelLineTemplates.parsedExpressions),
          mo.useEmptyStringForNull
        )
      );
    });

    return labelLines;
  };

  /**
   * Substitutes symbols in a template using values in a map, subject to an optional pre-substitution transform.
   * @param {string} template
   * @param {object} map
   * @param {function?} transform
   */
  mo.substitute = function (template, map, transform) {
    var thisObject = kernel.global;
    transform = transform ? lang.hitch(thisObject, transform) : function(v){ return v; };

    return template.replace(/\$\{([^\s\:\}]*)(?:\:([^\s\:\}]+))?\}/g,
      function(match, key){
        /*jshint unused:false*/
        if (key === ''){
          return '$';  // `${}` escapes `$`
        }
        var value = map[key];
        var result = transform(value, key);

        if (typeof result === 'undefined') {
          throw new Error('string.substitute could not find key "' + key + '" in template');
        }

        return result.toString();
      }); // String
  };

  /**
   * Parses Arcade expression infos.
   * @param {array} expressionInfos Expression info list from popupInfo
   * @return {object} List of parsed expressions keyed by the expression name
   */
  mo.parseArcadeExpressions = function (expressionInfos) {
    var parsedExpressions;
    if (Array.isArray(expressionInfos) && expressionInfos.length > 0) {
      parsedExpressions = {};
      array.forEach(expressionInfos, function (info) {
        parsedExpressions[info.name] = Arcade.parseScript(info.expression);
      });
    }
    return parsedExpressions;
  };

  /**
   * Initializes the Arcade context with an ArcadeFeature.
   * @param {object} feature Feature to convert into an ArcadeFeature and to add to the context's vars object
   * @return {object} Arcade context object
   */
  mo.initArcadeContext = function (feature) {
    var context = {
      vars: {}
    };
    context.vars.$feature = ArcadeFeature.createFromGraphicLikeObject(feature.geometry, feature.attributes);
    return context;
  };

  /**
   * Creates a list of feature attributes and resolved Arcade expressions for the feature.
   * @param {object} feature Feature whose attributes are to be used
   * @param {object} parsedExpressions Parsed Arcade expressions keyed by the expression name; each expression
   *        is resolved and added to the output object keyed by 'expression/' + the expression's name
   * @return {object} Combination of feature attributes and resolved expressions
   */
  mo.combineFeatureAttributesAndExpressionResolutions = function (feature, parsedExpressions) {
    var attributesAndExpressionResolutions, arcadeContext, name, resolvedExpression;

    // Resolve Arcade expressions for this feature; convert to string in case its return type is not already string
    attributesAndExpressionResolutions = lang.mixin({}, feature.attributes);
    if (parsedExpressions) {
      arcadeContext = mo.initArcadeContext(feature);

      for (name in parsedExpressions) {
        resolvedExpression = Arcade.executeScript(parsedExpressions[name], arcadeContext);
        attributesAndExpressionResolutions['expression/' + name] =
          resolvedExpression ? resolvedExpression.toString() : '';
      }
    }

    return attributesAndExpressionResolutions;
  };

  /**
   * Converts </p>s into CRLFs.
   * @param {string} html Text to scan
   * @return {string} Converted text
   */
  mo.convertEndParasToEOLs = function (html) {
    var html2 = html, matches = html.match(/<\/p>/gi);
    array.forEach(matches, function (match) {
      html2 = html2.replace(match, '\n');
    });
    return html2;
  };

  /**
   * Converts <br>s into CRLFs.
   * @param {string} html Text to scan
   * @return {string} Converted text
   */
  mo.convertBreaksToEOLs = function (html) {
    var html2 = html, matches = html.match(/<br\s*\/?>/gi);
    array.forEach(matches, function (match) {
      html2 = html2.replace(match, '\n');
    });
    return html2;
  };

  /**
   * Insures that a string is not undefined or null.
   * @param {string} str String to check
   * @return {string} str, or '' if str is undefined, null, or
   *         empty
   */
  mo.useEmptyStringForNull = function (str) {
    return str ? str : '';
  };

  /**
   * Interates over the items in an associative array (forIn).
   * @param {object} obj Object to interate over
   * @param {function} fcn Function to call for each item
   * @param {object} scope Scope to apply to function call
   */
  mo.objEach = function (obj, fcn, scope){
    var key;
    for (key in obj){
      if(obj.hasOwnProperty(key)){
        fcn.call(scope, obj[key], key);
      }
    }
  };

  /*------------------------------------------------------------------------------------------------------------------*/
  return mo;
});
