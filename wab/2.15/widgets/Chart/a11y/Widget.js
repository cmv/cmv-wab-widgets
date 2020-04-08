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
    'dojo/keys',
    'dojo/_base/html',
    'dijit/focus'
  ],
  function(keys, html, focusUtil) {
    var mo = {};
    //Chart list enter
    mo._onChartListKeydown = function(event) {
      if (event.keyCode === keys.ENTER) {
        var tr = event.target || event.srcElement;
        this._enterIntoChartTr(tr);
      }
    };
    //For chart params page esc
    mo._onChartParamsKeydown = function(event) {
      if (event.keyCode === keys.ESCAPE) {
        event.stopPropagation();
        focusUtil.focus(this.paramsBack);
      }
    };
    //Back to chart list button
    mo._onBtnParamsBackKeydown = function(event) {
      if (event.keyCode === keys.ENTER) {
        this._onBtnParamsBackClicked();
      }
    };
    //In chart params page, when tapping the tab key on the clear button, move focus to apply btn
    mo._onClearBtnKeydown = function(event) {
      var isChartParamsPage = html.getStyle(this.chartParams, 'display') !== 'none';
      var isChartResults = html.getStyle(this.chartResults, 'display') !== 'none';
      if (event.keyCode === keys.ESCAPE) {
        event.stopPropagation();
        if (isChartParamsPage) {
          focusUtil.focus(this.paramsBack);
        } else if (isChartResults) {
          focusUtil.focus(this.backOptions);
        }
      }
      if (event.keyCode === keys.TAB && !event.shiftKey) {
        if (isChartParamsPage) {
          event.preventDefault();
          focusUtil.focus(this.btnApply);
        } else if (isChartResults) {
          event.preventDefault();
          focusUtil.focus(this.resultsContainer);
        }
      }
      if (event.keyCode === keys.ENTER) {
        this._onBtnClearAllClicked();
      }
    };
    //Apply button enter
    mo._onApplyBtnKeydown = function(event) {
      if (event.keyCode === keys.ENTER) {
        this._onBtnApplyClicked();
      }

    };
    //For chart params page esc
    mo._onChartResultsKeydown = function(event) {
      if (event.keyCode === keys.ESCAPE) {
        event.stopPropagation();
        focusUtil.focus(this.backOptions);
      }

    };
    //Back to chart params button
    mo._onResultsBackKeydown = function(event) {
      if (event.keyCode === keys.ENTER) {
        this._onBtnResultsBackClicked();
      }
    };
    return mo;
  });