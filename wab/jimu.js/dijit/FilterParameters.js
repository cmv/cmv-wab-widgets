///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
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
  'dojo/on',
  'dojo/Evented',
  'dojo/Deferred',
  'dojo/promise/all',
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/query',
  'dijit/registry',
  'jimu/filterUtils',
  'jimu/utils',
  './_SingleFilterParameter'
],
  function(on, Evented, Deferred, all, declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang,
  html, array, query, registry, filterUtils, jimuUtils, _SingleFilterParameter) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'jimu-filter-parameters',
      templateString: '<div>' +
                        '<table style="width:100%;border-collapse:collapse;">' +
                          '<tbody data-dojo-attach-point="tbody"></tbody>' +
                        '</table>' +
                      '</div>',
      nls: null,
      partsObj: null,
      layerInfo: null,
      OPERATORS: null,
      url: null,

      _filterUtils:null,

      //events:
      //change

      postMixInProperties:function(){
        this.nls = window.jimuNls.filterBuilder;
        this._filterUtils = new filterUtils();
        this.OPERATORS = lang.clone(this._filterUtils.OPERATORS);
      },

      destroy: function(){
        this.clear();
        this._filterUtils = null;
        this.inherited(arguments);
      },

      //the default value of showErrorTip is true
      getFilterExpr:function(showErrorTip){
        if(showErrorTip === undefined){
          showErrorTip = true;
        }
        var newPartsObj = this.partsObj;
        var spArray = this._getAllInteractiveSinglePartArray(newPartsObj);
        for(var i = 0; i < spArray.length; i++){
          var singlePart = spArray[i];
          var id = singlePart.spId;
          if(id){
            var selector = '#' + id;
            var spDom = query(selector, this.tbody)[0];
            if(spDom){
              var sp = registry.byNode(spDom);
              var newValueObj = sp.getValueObj(showErrorTip);
              if(!newValueObj){
                return null;
              }
              singlePart.valueObj = newValueObj;
            }
          }
        }
        this._filterUtils.isHosted = jimuUtils.isHostedService(this.url);
        var expr = this._filterUtils.getExprByFilterObj(newPartsObj);
        return expr;
      },

      clear:function(){
        this.url = null;
        var spDoms = query('.jimu-widget-query-single-parameter', this.tbody);
        array.forEach(spDoms, lang.hitch(this, function(spDom){
          var sp = registry.byNode(spDom);
          sp.destroy();
        }));
        html.empty(this.tbody);
        this.partsObj = null;
        this.layerInfo = null;
      },

      //return a deferred object
      //if resolved, means it build successfully
      //if rejected, means it fail to build
      build:function(url, layerInfo, partsObj){
        var resultDef = new Deferred();
        this.clear();
        this.url = url;
        this.layerInfo = layerInfo;
        this.partsObj = lang.clone(partsObj);
        var interactiveSPA = this._getAllInteractiveSinglePartArray(this.partsObj);

        if(interactiveSPA.length > 0){
          var defs = array.map(interactiveSPA, lang.hitch(this, function(singlePart){
            var def = new Deferred();
            var tr = html.create('tr', {innerHTML:'<td></td>'}, this.tbody);
            var td = query('td', tr)[0];
            var fieldName = singlePart.fieldObj.name;
            var fieldInfo = this._getFieldInfo(fieldName, this.layerInfo);
            var args = {
              nls: this.nls,
              part: singlePart,
              fieldInfo: fieldInfo,
              OPERATORS: this.OPERATORS,
              url: this.url
            };
            var sp = new _SingleFilterParameter(args);
            this.own(on(sp, 'change', lang.hitch(this, this._onSingleFilterParameterChanged)));
            sp.placeAt(td);
            sp.startup();
            singlePart.spId = sp.id;
            this.own(on(sp, 'build-done', lang.hitch(this, function(){
              def.resolve();
            })));
            this.own(on(sp, 'build-error', lang.hitch(this, function(err){
              def.reject(err);
            })));
            return def;
          }));
          all(defs).then(lang.hitch(this, function(){
            resultDef.resolve();
          }), lang.hitch(this, function(){
            resultDef.reject();
          }));
        }else{
          resultDef.resolve();
        }

        return resultDef;
      },

      _getFieldInfo:function(fieldName, lyrDef){
        var fieldInfos = lyrDef.fields;
        for(var i = 0;i < fieldInfos.length; i++){
          var fieldInfo = fieldInfos[i];
          if(fieldName === fieldInfo.name){
            return fieldInfo;
          }
        }
        return null;
      },

      _getAllInteractiveSinglePartArray:function(partsObj){
        var result = [];
        for(var i = 0; i < partsObj.parts.length; i++){
          var p = partsObj.parts[i];
          if(p.parts){
            for(var j = 0; j < p.parts.length; j++){
              var p2 = p.parts[j];
              if(p2.interactiveObj){
                result.push(p2);
              }
            }
          }
          else{
            if(p.interactiveObj){
              result.push(p);
            }
          }
        }
        return result;
      },

      _onSingleFilterParameterChanged: function(){
        //when changed, we should get the filter silently and don't show error tip
        this.emit('change', this.getFilterExpr(false));
      }

    });
  });