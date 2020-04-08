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
  'dojo/_base/lang',
  'jimu/BaseFeatureAction',
  'jimu/WidgetManager'
], function (
  declare,
  lang,
  BaseFeatureAction,
  WidgetManager
) {
  var clazz = declare(BaseFeatureAction, {

    _widgetInstance: null, // to store widget instance
    _config: null, // to store widget config
    iconClass: 'esriCT-feature-action-unskip-icon',
    iconFormat: 'PNG',

    /**
     * This function is used to get the configuration of a widget
     */
    _getWidgetConfig: function () {
      if (!this._widgetInstance) {
        this._widgetInstance = WidgetManager.getInstance().getWidgetById(this.widgetId);
      }
      // once widget is found get its config
      if (this._widgetInstance) {
        this._config = this._widgetInstance.config;
      }
      if (this._config) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * This function detects whether to display action in infowindow or not
     */
    isFeatureSupported: function (featureSet, layerParam) {
      var currentLayerId, featureSkipDetails;
      // when no records are displayed in info-window layerparam is undefined
      currentLayerId = layerParam && layerParam.id ? layerParam.id : layerParam;
      // get config
      var hasValidConfig = this._getWidgetConfig();
      if (!hasValidConfig) {
        return false;
      }
      //check if curernt layer id is found in skipableLayers
      if (currentLayerId && this._config && this._config.skipableLayers &&
        this._config.skipableLayers.indexOf(currentLayerId) >= 0) {
        //check if current feature is skipped or not
        featureSkipDetails = this._widgetInstance._checkSkipLocationXY(featureSet.features[0]);
        //if feature is skipped then only show skip feature action in infowindow
        if (featureSkipDetails.isFeatureSkipped) {
          return true;
        }
      }
      return false;
    },

    /**
     * This function gets executed when user clicks on feature action in info-window
     */
    onExecute: function (featureSet, layerParam) {
      var layer = layerParam ||
        lang.getObject('_wabProperties.popupInfo.layerForActionWithEmptyFeatures', false, this.map.infoWindow);
      this._widgetInstance.unSkipFromTrace(featureSet.features, layer);
    }
  });
  return clazz;
});