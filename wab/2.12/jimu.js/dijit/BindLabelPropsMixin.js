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
  'dojo/_base/declare',
  'dojo/_base/html',
  'dojo/query',
  'dojo/_base/array',
  'jimu/utils'
], function(declare, html, query, array, jimuUtils) {
  return declare('jimu-bind-label-props-mixin', null, {
    isRenderIdForAttrs: false,//if add attrs for screen readers.
    /*
      //two templates
      <span data-a11y-label-id="a">span string</span>
      <label data-a11y-label-id="a">label string</span>
      <input data-a11y-label-by="a" value="myValue" />

      <label data-label-for="b">label string</label>
      <input data-label-id="b" value="myValue" />
    */

    buildRendering: function(){
      this.inherited(arguments);
      if(!this.isRenderIdForAttrs){
        return;
      }
      var a11yLabelId = 'data-a11y-label-id', a11yLabelBy = 'data-a11y-label-by';
      var labelFor = 'data-label-for', labelId = 'data-label-id';
      var labelledDoms = query("[" + a11yLabelId + "],[" + a11yLabelBy + "], [" + labelFor +
       "], [" + labelId + "]", this.domNode);

      var idByDict = {}; //{'groupName':{labelledBy: operateDom, labelList: [labelledDomList]}}
      var idForDict = {};//{'groupName':{idDom: operateDom, forDom: labelDom}}
      //Init dict
      array.forEach(labelledDoms, function(labelledDom) {
        var _a11yLabelId = html.getAttr(labelledDom, a11yLabelId);
        var _a11yLabelBy = html.getAttr(labelledDom, a11yLabelBy);
        var _labelFor = html.getAttr(labelledDom, labelFor);
        var _labelId = html.getAttr(labelledDom, labelId);
        //Id & labelledby
        if(_a11yLabelId){
          if(idByDict.hasOwnProperty(_a11yLabelId)){
            idByDict[_a11yLabelId].labelList.push(labelledDom);
          }else{
            idByDict[_a11yLabelId] = {};
            idByDict[_a11yLabelId].labelList = [labelledDom];
          }
        }else if(_a11yLabelBy){
          if(!idByDict.hasOwnProperty(_a11yLabelBy)){
            idByDict[_a11yLabelBy] = {};
            idByDict[_a11yLabelBy].labelList = [];
          }
          idByDict[_a11yLabelBy].labelledBy = labelledDom;
        }
        //For & id
        else if(_labelFor){
          if(!idForDict.hasOwnProperty(_labelFor)){
            idForDict[_labelFor] = {};
          }
          idForDict[_labelFor].forDom = labelledDom;
        }else{
          if(!idForDict.hasOwnProperty(_labelId)){
            idForDict[_labelId] = {};
          }
          idForDict[_labelId].idDom = labelledDom;
        }
      });

      //Add attributes from Dict
      var uniqName = 'jimuUniqName_';
      for(var idx1 in idByDict){//ids & aria-labelledby
        var ids = [];
        var _uniqName = uniqName + jimuUtils.getUUID();
        array.forEach(idByDict[idx1].labelList, function(item, _idx) {
          var _id = _uniqName + '_' + _idx;
          html.removeAttr(item, a11yLabelId);
          html.setAttr(item, 'id', _id);
          ids.push(_id);
        });
        var labelledbyDom = idByDict[idx1].labelledBy;
        html.removeAttr(labelledbyDom, a11yLabelBy);
        html.setAttr(labelledbyDom, 'aria-labelledby', ids.join(' '));
      }
      for(var idx2 in idForDict){//for & id
        var _id = uniqName + jimuUtils.getUUID();
        var forDom = idForDict[idx2].forDom;
        var idDom = idForDict[idx2].idDom;
        html.removeAttr(forDom, labelFor);
        html.removeAttr(idDom, labelId);
        html.setAttr(forDom, 'for', _id);
        html.setAttr(idDom, 'id', _id);
      }
    }
  });
});