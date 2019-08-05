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
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/dom-attr',
    'dojo/dom-construct',
    "dojo/query",
    'dojo/on',
    'dojo/keys',
    "dijit/a11yclick",
    'jimu/utils'
  ],
  function (lang, html, domAttr, domConstruct, query, on, keys, a11yclick, jimuUtils) {
    var mo = {};

    mo.a11y_initFirstFocusNode = function () {
      jimuUtils.initFirstFocusNode(this.domNode, this.toolsSection);
    };

    mo.a11y_initLastFocusNode = function () {
      var itemNodes = query('.tools-table-item', this.toolsTbody);
      var lastNode = itemNodes[itemNodes.length - 1];
      if (lastNode) {
        jimuUtils.initLastFocusNode(this.domNode, lastNode);
      }
    };

    mo.a11y_addTool = function (toolItemDOM, nameDiv, isValid) {
      var uniqId = jimuUtils.getUUID();
      //toolItemDOM
      domAttr.set(toolItemDOM, 'role', 'button');
      domAttr.set(toolItemDOM, 'tabindex', '0');

      //nameDiv
      var uniqNameId = 'jimuUniq_name_' + uniqId;
      domAttr.set(nameDiv, 'id', uniqNameId);

      //isValid & tipDiv
      if (isValid === true) {
        domAttr.set(toolItemDOM, 'aria-labelledby', uniqNameId);
      } else {
        //add hidden tip
        var uniqTipId = 'jimuUniq_tip_' + uniqId;
        domConstruct.create("div", {
          'id': uniqTipId,
          'class': 'icon-section screen-readers-only',
          innerHTML: this.nls.toolNotAvailable
        }, toolItemDOM);
        domAttr.set(toolItemDOM, 'aria-disabled', 'true');
        domAttr.set(toolItemDOM, 'aria-labelledby', uniqNameId + ' ' + uniqTipId);
      }
    };

    mo.a11y_analysisTool_backBtn = function (backBtn, submitButton) {
      domAttr.set(backBtn, 'role', 'button');
      domAttr.set(backBtn, 'tabindex', '0');
      this.currentAnalysisDijit.own(on(backBtn, 'keydown', lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.TAB) {
          evt.preventDefault();
          if (evt.shiftKey) {
            this.toolPanel.focus();
          } else {
            var _nextNode = (html.getStyle(submitButton, 'display') !== 'none') ? submitButton : this.toolPanel;
            _nextNode.focus();
          }
        }
      })));
    };

    mo.a11y_analysisTool_submitBtn = function (backBtn, submitButton) {
      var lastNode;
      if (html.getStyle(submitButton, 'display') !== 'none') {
        var _submitBtn = query('[role="button"]', submitButton)[0];
        var _submitBtnLabel = html.getAttr(_submitBtn, 'aria-labelledby');
        html.setAttr(submitButton, 'aria-labelledby', _submitBtnLabel);
        html.setAttr(submitButton, 'tabindex', '0');
        html.setAttr(submitButton, 'role', 'button');
        this.currentAnalysisDijit.own(on(submitButton, a11yclick, lang.hitch(this, function () {
          _submitBtn.click();
        })));

        this.currentAnalysisDijit.own(on(submitButton, 'keydown', lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.TAB) {
            evt.preventDefault();
            if (evt.shiftKey) {
              var _nextNode = backBtn ? backBtn : this.toolPanel;
              _nextNode.focus();
            } else {
              this.toolPanel.focus();
            }
          }
        })));
        lastNode = submitButton;
      } else if (backBtn) {
        lastNode = backBtn;
      } else { //no backBtn & sumitBtn is hidden
        lastNode = this.toolPanel;
      }

      if (this.toolCountInList === 1) {
        jimuUtils.initFirstFocusNode(this.domNode, this.toolPanel);
        jimuUtils.initLastFocusNode(this.domNode, lastNode);
      }
    };

    mo.a11y_analysisTool_toolPanel = function (backBtn, submitButton) {
      this.own(on(this.toolPanel, 'keydown', lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ESCAPE && backBtn) { //has back btn
          evt.stopPropagation();
          backBtn.focus();
        } else if (html.hasClass(evt.target, 'tool-panel') && evt.keyCode === keys.TAB) {
          evt.preventDefault();
          var _submitBtn = (html.getStyle(submitButton, 'display') !== 'none') ? submitButton : null;
          var _nextNode;
          if (evt.shiftKey) {
            _nextNode = _submitBtn || backBtn || this.toolPanel;
          } else if (!evt.shiftKey) {
            _nextNode = backBtn || _submitBtn || this.toolPanel;
          }
          _nextNode.focus();
        }
      })));
    };

    mo.a11y_updateTitleForMsgDom = function(jobStatus, JobInfo){
      //update msg status
      // this.messageStatusNode.innerHTML = jimuUtils.stripHTML(jobMsg);
      //update aira-labelledby
      var titleId = html.getAttr(this.toolTitle, 'id');
      var statusId = html.getAttr(this.messageStatusNode, 'id');
      var idsArray = [titleId, statusId];
      if(jobStatus ===  JobInfo.STATUS_SUCCEEDED){//add noteTips when status's succeeded.
        idsArray.push(html.getAttr(this.outputtip, 'id'));
      }
      html.setAttr(this.messagePanel, 'aria-labelledby', idsArray.join(' '));
    };

    mo.a11y_addAttrsAndEventForCancelBtn = function( closeImg){
      domAttr.set(closeImg, 'role', 'button');
      domAttr.set(closeImg, 'tabindex', '0');
      this.own(on(closeImg, 'keydown', lang.hitch(this, function(evt){
        if (!evt.shiftKey && evt.keyCode === keys.TAB) { //has back btn
          evt.preventDefault();
          this.messagePanel.focus();
        }
      })));
    };

    mo.a11y_addAttrsForOutputLink = function(outputLink){
      domAttr.set(outputLink, 'role', 'link');
    };

    mo.a11y_addAttrsForExportNode = function(exportNode){
      domAttr.set(exportNode, 'role', 'button');
      domAttr.set(exportNode, 'aria-haspopup', 'true');
      domAttr.set(exportNode, 'aria-label', this.nls.action);
      domAttr.set(exportNode, 'tabindex', '0');
    };

    mo.a11y_addMessagePanelEvent = function(){
      this.own(on(this.messagePanel, 'keydown', lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ESCAPE) {
          evt.stopPropagation();
          if(html.getStyle(this.buttonSection, 'display') !== 'none'){//if has backBtn
            this.backBtn.focus();
          }
        } else if (html.hasClass(evt.target, 'message-panel') && evt.keyCode === keys.TAB) {
          var cancelBtn = query('.job-cancel-icon', this.messageSection)[0];
          var lastNode = cancelBtn || (html.getStyle(this.buttonSection, 'display') !== 'none' ? this.homeBtn : null);
          if(!lastNode){
            evt.preventDefault();
          }else if(evt.shiftKey){//shift+tab: focus on last node
            evt.preventDefault();
            lastNode.focus();
          }
        }
      })));
    };

    mo.a11y_switchToPrevious = function(evt) {
      if(evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE){
        this._switchToPrevious();
      }
    };

    mo.a11y_switchToHome = function(evt) {
      if(evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE){
        this._switchToHome();
      }else if(!evt.shiftKey && evt.keyCode === keys.TAB){
        evt.preventDefault();
        this.messagePanel.focus();
      }
    };

    mo.a11y_switchView_toolList = function () {
      if (this.toolCountInList === 1) {
        this.toolPanel.focus();
      } else {
        this.toolsSection.focus();
      }
    };

    mo.a11y_switchView_others = function (idx, ANALYSIS_VIEW) {
      if (idx === ANALYSIS_VIEW) {
        this.toolPanel.focus();
      } else {
        this.messagePanel.focus();
      }
    };

    return mo;
  });