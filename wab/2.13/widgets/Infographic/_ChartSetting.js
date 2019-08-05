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
  'dojo/on',
  'dojo/query',
  'dijit/focus',
  'dojo/Evented',
  'dojo/keys',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dojo/text!./_ChartSetting.html'
], function(declare, html, on, query, focusUtil, Evented, keys, _WidgetBase, _TemplatedMixin, template) {
  var clazz = declare([_WidgetBase, _TemplatedMixin, Evented], {
    templateString: template,
    baseClass: 'ig-chart-setting-dlg',

    postCreate: function() {
      var config = this.chartJson.config || {};
      var data = config.data || {};
      var display = config.display || {};
      var chartType = data.type;

      if (chartType === 'pie') {
        html.setStyle(this.verticalAxisSection, 'display', 'none');
        html.setStyle(this.horizontalAxisSection, 'display', 'none');
        html.setStyle(this.withoutRecordsSection, 'display', 'none');
      } else {
        html.setStyle(this.dataLabelsSection, 'display', 'none');
      }

      //date config
      if (!data.dateConfig) {
        html.setStyle(this.withoutRecordsSection, 'display', 'none');
      }

      var legendDisplay = this._calcuteLegendDisplay(data, display);
      if (!legendDisplay) {
        html.setStyle(this.legendSection, 'display', 'none');
      }

      if ((data.mode === 'count' || data.mode === 'field') &&
        chartType !== 'pie') {
        html.setStyle(this.legendSection, 'display', 'none');
      }

      var legend = display.legend;
      if (legend && legend.show) {
        this._toggle(this.legendToggle);
      }
      var dataLabel = display.dataLabel;
      if (dataLabel && dataLabel.show) {
        this._toggle(this.dataLabelsToggle);
      }
      var xAxis = display.xAxis;
      if (xAxis && xAxis.show) {
        this._toggle(this.horizontalAxisToggle);
      }
      var yAxis = display.yAxis;
      if (yAxis && yAxis.show) {
        this._toggle(this.verticalAxisToggle);
      }

      if (data.dateConfig && data.dateConfig.isNeedFilled) {
        this._toggle(this.withoutRecordsToggle);
      }

      this.own(on(this.domNode, 'keydown', function(event) {
        if (event.keyCode === keys.ESCAPE) {
          this.emit('escape');
        }
      }.bind(this)));
    },

    focusFirst: function() {
      var toggles = query('.toggle', this.domNode);
      if (!toggles || !toggles.length) {
        return;
      }
      var firstToggleNode = null;
      toggles.some(function(node) {
        var display = html.getStyle(node, 'display');
        if (display !== 'none') {
          firstToggleNode = node;
          return true;
        }
        return false;
      });
      if (firstToggleNode) {
        focusUtil.focus(firstToggleNode);
      }
    },

    _calcuteLegendDisplay: function(data, display) {
      var mode = data.mode;
      var type = data.type;
      var legendDisplay;
      if (type === 'pie') {
        legendDisplay = true;
      } else {
        legendDisplay = true;
        if (mode === 'count' || mode === 'field') {
          legendDisplay = false;
        } else {
          if (display.seriesStyle) {
            legendDisplay = display.seriesStyle.type !== 'layerSymbol';
          }
        }
      }
      return legendDisplay;
    },

    _toggle: function(target) {
      if (html.hasClass(target, 'toggle-on')) {
        html.removeClass(target, 'toggle-on');
        html.addClass(target, 'toggle-off');
        target.setAttribute('aria-pressed', false);
      } else {
        html.removeClass(target, 'toggle-off');
        html.addClass(target, 'toggle-on');
        target.setAttribute('aria-pressed', true);
      }
    },

    _onToggleClick: function(evt) {
      var target = evt.target,
        isShow;

      this._toggle(target);
      if (html.hasClass(target, 'toggle-on')) {
        isShow = true;
      } else {
        isShow = false;
      }

      var dataId = html.attr(target, 'data-id');
      if (dataId === 'legend') {
        this.chartJson.config.display.legend.show = isShow;
      } else if (dataId === 'dataLabels') {
        this.chartJson.config.display.dataLabel.show = isShow;
      } else if (dataId === 'horizontalAxis') {
        this.chartJson.config.display.xAxis.show = isShow;
      } else if (dataId === 'verticalAxis') {
        this.chartJson.config.display.yAxis.show = isShow;
      } else if (dataId === 'withoutRecords') {
        if (this.chartJson.config.data.dateConfig) {
          this.chartJson.config.data.dateConfig.isNeedFilled = isShow;
        }
      }

      this.chartDijit.setConfig(this.chartJson.config);
      this.chartDijit.startRendering();
    }

  });
  return clazz;
});