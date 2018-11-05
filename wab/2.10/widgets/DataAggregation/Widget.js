define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'jimu/BaseWidget',
  'dojo/Deferred',
  'dojo/DeferredList',
  'dojo/dom-construct',
  'jimu/LayerStructure',
  'jimu/portalUtils',
  'jimu/dijit/Message',
  'jimu/dijit/Popup',
  'esri/lang',
  'esri/request',
  './js/UI/PageContainer',
  './js/UI/Home',
  './js/UI/StartPage',
  './js/UI/LocationType',
  'jimu/utils'],
  function (declare,
    lang,
    array,
    BaseWidget,
    Deferred,
    DeferredList,
    domConstruct,
    LayerStructure,
    portalUtils,
    Message,
    Popup,
    esriLang,
    esriRequest,
    PageContainer,
    Home,
    StartPage,
    LocationType,
    jimuUtils) {
    return declare([BaseWidget], {
      baseClass: 'jimu-widget-critical-facilities-ui',

      portal: null,
      editLayer: null,

      _configLayerInfo: null,
      _url: '',
      _geocodeSources: null,
      _fsFields: null,
      _singleFields: null,
      _multiFields: null,
      _pageContainer: null,
      _userCanEdit: true,
      _userHasCredits: false,
      _hasLocators: true,
      _locationMappingComplete: false,
      _fieldMappingComplete: false,
      _tempResultsAdded: false,

      postCreate: function () {
        this.inherited(arguments);
        this.nls = lang.mixin(this.nls, window.jimuNls.common);
        this._initEditLayerNode();
        if (this.editLayerNode) {
          this._initUserProperties().then(lang.hitch(this, function () {
            this._initThemeAndConfig();
          }));
        }
      },

      _initUserProperties: function(){
        var def = new Deferred();
        this.validatePrivileges().then(lang.hitch(this, function (result) {
          this._userCanEdit = result.canEdit;
          this._userHasCredits = result.hasCredits;
          if (!this._userCanEdit || !this._userHasCredits) {
            this._alertUser().then(lang.hitch(this, function (hasLocators) {
              this._hasLocators = hasLocators;
              def.resolve(true);
            }));
          } else {
            def.resolve(true);
          }
        }));
        return def;
      },

      _initEditLayerNode: function(){
        this._configLayerInfo = this.config.layerSettings.layerInfo;
        this.layerStructure = LayerStructure.getInstance();
        this.editLayerNode = this.layerStructure.getNodeById(this._configLayerInfo.featureLayer.id);
        if ([null, undefined].indexOf(this.editLayerNode) !== -1) {
          this._showNoEditLayerMessage();
        }
      },

      _showNoEditLayerMessage: function () {
        this._userCanEdit = false;
        this._userHasCredits = false;
        var br = "</br></br>";
        var messages = [this.nls.startPage.appropriateCredentials + br,
        this.nls.startPage.or + br, esriLang.substitute({
          layerName: this.config.layerSettings.layerInfo.featureLayer.title
        }, this.nls.startPage.shared)];
        this._showPopup(messages, esriLang.substitute({
          layerName: this.config.layerSettings.layerInfo.featureLayer.title
        }, this.nls.startPage.unableToAccess));
      },

      _initThemeAndConfig: function () {
        this._initConfigInfo();
        this._initEditLayerInfo().then(lang.hitch(this, function () {
          this._initBaseArgs();
          this._initPageContainer(false);
        }));
      },

      _alertUser: function () {
        var def = new Deferred();
        if (!this._userCanEdit) {
          //the user cannot edit or anonymous editing is not enabled
          this.showEditMessage();
          def.resolve(false);
        } else {
          //the user does not have credits no need to retain the world locator if one is configured
          this._removeWorldLocator(true).then(function(results){
            def.resolve(results.length > 0);
          });
        }
        return def;
      },

      _removeWorldLocator: function () {
        var def = new Deferred();

        var locatorRequests = [];
        var locatorUrls = [];
        array.forEach(this.config.sources, function (source) {
          locatorUrls.push(source.url);
          locatorRequests.push(
            esriRequest({
              url: source.url,
              content: {
                f: 'json'
              },
              handleAs: 'json'
            }));
        });

        var locatorList = new DeferredList(locatorRequests);
        locatorList.then(lang.hitch(this, function (locatorResults) {
          if (locatorResults) {
            var worldLocators = [];
            var locatorTests = [];
            for (var i = 0; i < locatorResults.length; i++) {
              var lr = locatorResults[i][1];
              locatorTests.push(this._validateLocator(lr, locatorUrls[i]));
            }
            var locatorListTest = new DeferredList(locatorTests);
            locatorListTest.then(lang.hitch(this, function (locatorResults) {
              array.forEach(locatorResults, lang.hitch(this, function(res){
                if(res[1]){
                  worldLocators.push(res[1]);
                }
              }));
              this._updateSources(worldLocators);
              def.resolve(this.config.sources);
            }));
          }
        }));
        return def;
      },

      _validateLocator: function (locator, url) {
        var def = new Deferred();
        if (locator && locator.locatorProperties) {
          if (locator.locatorProperties.isAGOWorldLocator) {
            //Test for 32 length hex char item id
            var proxyItem = /\/[0-9A-Fa-f]{32}\//.exec(url);
            var itemID = proxyItem && proxyItem.length ? proxyItem[0].substr(1).slice(0, -1) : false;
            if (itemID) {
              esriRequest({
                url: this.appConfig.portalUrl + 'sharing/rest/content/items/' + itemID,
                content: {
                  f: 'json'
                },
                handleAs: 'json'
              }).then(lang.hitch(this, function (a) {
                def.resolve((!a.access || a.access !== 'public') ? url : false);
              }), function (err) {
                console.log(err);
              });
            } else {
              def.resolve(url);
            }
          } else {
            def.resolve(false);
          }
        } else {
          //used when app is shared publicly but the locator does not use a public proxy
          // credential manager presents a message and they do not log in
          def.resolve(url);
        }
        return def;
      },

      _updateSources: function(worldLocators){
        if (worldLocators.length > 0) {
          //remove world locators if the user does not have credits or public url via a proxy
          var removedLocators = [];
          this.config.sources = this.config.sources.filter(function (source) {
            if (worldLocators.indexOf(source.url) === -1) {
              return true;
            } else {
              removedLocators.push(source.name);
              return false;
            }
          });
          var messages = this._getMessages(removedLocators);
          this._showPopup(messages, esriLang.substitute({
            widgetName: this.label
          }, this.nls.startPage.cannotUseLocator));
        }
      },

      _getMessages: function (removedLocators) {
        var messages = [];
        var msg = '';
        if (removedLocators) {
          array.forEach(removedLocators, lang.hitch(this, function (loc) {
            msg += esriLang.substitute({
              widgetName: this.label,
              locator: loc
            }, this.nls.startPage.userCredits);
            msg += '</br></br>';
          }));
        } else {
          msg += this.nls.startPage.notEnoughCredits;
          msg += '</br></br>';
        }
        if (msg !== '') {
          messages.push(msg);
          messages.push(this.nls.startPage.contactAdmin + '</br></br>');
          if (this.config.sources.length > 0) {
            //allow them to still use the non-credit based locators
            msg = '';
            array.forEach(this.config.sources, lang.hitch(this, function (source) {
              msg += esriLang.substitute({
                locator: source.name
              }, this.nls.startPage.canUseLocator);
              msg += '</br></br>';
            }));
            messages.push(msg);
          }
        }
        return messages;
      },

      _showPopup: function(messages, title){
        var content = domConstruct.create('div');
        domConstruct.create('div', {
          "className": "cf-warning-icon",
          style: 'float: ' + (window.isRTL ? 'right; margin-left' : 'left; margin-right') + ': 10px;'
        }, content);

        var msgPadding = 'padding-' + (window.isRTL ? 'right' : 'left') + ': 50px;';
        for (var i = 0; i < messages.length; i++) {
          var msg = messages[i];
          domConstruct.create('div', {
            innerHTML: msg,
            style: (i === 0 ? 'padding-top:10px; ' : '') + msgPadding + "word-wrap: break-word;"
          }, content);
        }

        var warningMessage = new Popup({
          width: 500,
          autoHeight: true,
          content: content,
          titleLabel: title,
          buttons: [{
            label: this.nls.ok,
            onClick: lang.hitch(this, function () {
              warningMessage.close();
              warningMessage = null;
            })
          }],
          onClose: function () {
            warningMessage = null;
          }
        });
      },

      _initBaseArgs: function () {
        this._baseArgs = {
          nls: this.nls,
          map: this.map,
          parent: this,
          config: this.config,
          appConfig: this.appConfig,
          theme: this.theme,
          styleColor: this.styleColor,
          singleEnabled: this.singleEnabled,
          multiEnabled: this.multiEnabled,
          xyEnabled: this.xyEnabled
        };
      },

      /*jshint unused:false*/
      onAppConfigChanged: function (appConfig, reason, changedData) {
        switch (reason) {
          case 'themeChange':
            break;
          case 'layoutChange':
            break;
          case 'styleChange':
            break;
          case 'widgetChange':
            this._clearResults();
            break;
          case 'mapChange':
            break;
        }
      },

      _initConfigInfo: function () {
        if (this._configLayerInfo) {
          this._valid = true;
          this._url = this._configLayerInfo.featureLayer.url;
          this._geocodeSources = this.config.sources;
          this._symbol = this.config.layerSettings.symbol;
          this.xyEnabled = this.config.xyEnabled;
          this.multiEnabled = false;
          this.singleEnabled = false;
          this._fsFields = [];

          array.forEach(this._configLayerInfo.fieldInfos, lang.hitch(this, function (field) {
            if (field && field.visible) {
              this._fsFields.push({
                name: field.fieldName,
                label: field.label,
                value: field.type,
                isRecognizedValues: field.isRecognizedValues,
                duplicate: field.duplicate
              });
            }
          }));

          var updateRecognizedValues = function (f1, f2) {
            array.forEach(f1.isRecognizedValues, function (v) {
              if (f2.isRecognizedValues.indexOf(v) === -1) {
                f2.isRecognizedValues.push(v);
              }
            });
          };

          this._singleFields = [];
          this._multiFields = [];
          var multiFieldLabels = [];
          var multiFieldNames = [];
          var singleFieldLabels = [];
          var singleFieldNames = [];
          if (this._geocodeSources) {
            array.forEach(this._geocodeSources, lang.hitch(this, function (source) {
              this.singleEnabled = !this.singleEnabled ? source.singleEnabled : this.singleEnabled;
              this.multiEnabled = !this.multiEnabled ? source.multiEnabled : this.multiEnabled;

              if (source.singleEnabled) {
                var singleAddressField = source.singleAddressFields[0];
                var singleFieldLabel = singleAddressField.label || singleAddressField.alias;
                var singleLabelIndex = singleFieldLabels.indexOf(singleFieldLabel);
                var singleFieldName = singleAddressField.fieldName || singleAddressField.name;
                var singleNameIndex = singleFieldNames.indexOf(singleFieldName);
                if (singleLabelIndex > -1 || singleNameIndex > -1) {
                  var i = singleLabelIndex > -1 ? singleLabelIndex : singleNameIndex;
                  updateRecognizedValues(singleAddressField, this._singleFields[i]);
                } else {
                  singleFieldLabels.push(singleFieldLabel);
                  singleFieldNames.push(singleFieldName);
                  this._singleFields.push({
                    label: singleFieldLabel,
                    value: singleFieldName,
                    type: "STRING",
                    isRecognizedValues: singleAddressField.isRecognizedValues
                  });
                }
              }

              if (source.multiEnabled) {
                array.forEach(source.addressFields, lang.hitch(this, function (field) {
                  if ((field && field.visible)) {
                    var label = field.label || field.alias;
                    var labelIndex = multiFieldLabels.indexOf(label);
                    var name = field.fieldName || field.name;
                    var nameIndex = multiFieldNames.indexOf(name);
                    if (labelIndex > -1 || nameIndex > -1) {
                      var updateField = this._multiFields[labelIndex > -1 ? labelIndex : nameIndex];
                      if (typeof (updateField.fieldList) === 'undefined') {
                        updateField.fieldList = [updateField.value, name];
                      } else {
                        updateField.fieldList.push(name);
                      }
                      updateRecognizedValues(field, this._multiFields[labelIndex > -1 ? labelIndex : nameIndex]);
                    } else {
                      multiFieldLabels.push(label);
                      multiFieldNames.push(name);
                      this._multiFields.push({
                        label: label,
                        value: name,
                        type: "STRING",
                        isRecognizedValues: field.isRecognizedValues
                      });
                    }
                  }
                }));
                this.multiEnabled = this._multiFields.length > 0;
              }
            }));
          }

        }
      },

      _initEditLayerInfo: function(){
        var def = new Deferred();
        this.editLayerNode.getLayerObject().then(lang.hitch(this, function (layer) {
          this.infoTemplate = this.editLayerNode.getInfoTemplate();
          this.editLayer = layer;
          this.editLayerDefinition = jimuUtils.getFeatureLayerDefinition(layer);
          this._updateFsFields(this.editLayer, this.infoTemplate);
          def.resolve(true);
        }));
        return def;
      },

      _updateFsFields: function (lyr, infoTemplate) {
        var typeIdField = lyr.typeIdField;
        var ints = ["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle"];
        var dbls = ["esriFieldTypeDouble"];
        var date = "esriFieldTypeDate";
        var len = function (v) {
          return v.toString().length;
        };
        var getInfoTemplateField = function (name) {
          if (infoTemplate && infoTemplate.info && infoTemplate.info.fieldInfos) {
            var fieldInfos = infoTemplate.info.fieldInfos;
            field_info_loop:
            for (var index = 0; index < fieldInfos.length; index++) {
              var fi = fieldInfos[index];
              if (fi.fieldName === name) {
                return fi;
              }
            }
          }
        };
        var layerDef = this.editLayerDefinition;
        array.forEach(this._fsFields, function (fsField) {
          field_loop:
          for (var i = 0; i < lyr.fields.length; i++) {
            var lyrField = lyr.fields[i];
            if (lyrField.name === fsField.name) {
              fsField.domain = lyrField.domain;
              fsField.length = lyrField.length;
              fsField.isTypeIdField = fsField.name === typeIdField;
              fsField.subtypes = lyr.subtypes;

              //set the type
              var supportsInt = true;
              var domain = fsField.domain;
              var nameSupportsNumeric = true;
              var list;
              if (domain || fsField.isTypeIdField) {
                list = jimuUtils.getCodedValueListForCodedValueOrSubTypes(layerDef, fsField.name, {});
              }
              if (list) {
                fsField.domainValues = list;
                fsField.codes = [];
                fsField.values = [];
                for (var index = 0; index < list.length; index++) {
                  var cv = list[index];
                  fsField.codes.push(cv.value);
                  if (nameSupportsNumeric) {
                    nameSupportsNumeric = (!isNaN(parseInt(cv.label, 10)) &&
                      (!isNaN(parseFloat(cv.label)) && len(parseFloat(cv.label)) === len(cv.label)));
                  }
                  fsField.values.push(cv.label);
                }
                coded_value_loop:
                for (var ii = 0; ii < list.length; ii++) {
                  var v = list[ii].value;
                  supportsInt = ((!isNaN(parseInt(v, 10))) && len(parseInt(v, 10)) === len(v));
                  if (!supportsInt) {
                    break coded_value_loop;
                  }
                }
              }
              var type = lyrField.type;
              fsField.type = (ints.indexOf(type) > -1 && nameSupportsNumeric) ? "int" :
                (dbls.indexOf(type) > -1 && nameSupportsNumeric) ? "float" : date === type ? "date" :
                  (domain && supportsInt && nameSupportsNumeric) ? "domainInt" : domain ? "domain" : "other";
              fsField.esriFieldType = type;
              if (fsField.type === 'date') {
                fsField.fieldInfo = getInfoTemplateField(fsField.name);
              }
              fsField.nullable = lyrField.nullable;
              break field_loop;
            }
          }
        });
      },

      _initPageContainer: function (validate) {
        //get base views that are not dependant on the user data
        this._initHomeView(validate).then(lang.hitch(this, function(homeView){
          if (this._pageContainer) {
            this._locationMappingComplete = false;
            this._fieldMappingComplete = false;
            this._tempResultsAdded = false;
            this._pageContainer.reset();
            this._pageContainer.displayControllerOnStart = false;
            this._pageContainer.toggleController(true);
          } else {
            this._pageContainer = new PageContainer({
              nls: this.nls,
              appConfig: this.appConfig,
              displayControllerOnStart: false,
              parent: this,
              styleColor: this.styleColor
            }, this.pageNavigation);
          }

          var startPageView = this._initStartPageView();
          var views = [homeView, startPageView];
          //when both coordinate and address input are supported create a view
          // that will allow the user to choose the type they will use
          if (this.xyEnabled && (this.multiEnabled || this.singleEnabled)) {
            var locationTypeView = this._initLocationTypeView();
            views.push(locationTypeView);
          }
          this._pageContainer.views = views;
          this._pageContainer.startup();
        }));
      },

      _initHomeView: function (validate) {
        var def = new Deferred();
        //re-validate user edit privileges and credits each time the home view is re-instantiated
        //skip this validation on startup as it occurs earlier in the process and you would see
        // duplicate messages in the case of invalid edit or credit
        if (validate) {
          this._initUserProperties().then(lang.hitch(this, function () {
            def.resolve(this._getHome());
          }));
        } else {
          def.resolve(this._getHome());
        }
        return def;
      },

      _getHome: function(){
        return new Home(lang.mixin({
          _geocodeSources: this._geocodeSources,
          _fsFields: this._fsFields,
          _singleFields: this._singleFields,
          _multiFields: this._multiFields,
          userName: this.userName,
          disabled: !this._userCanEdit || (!this._userHasCredits && !this._hasLocators)
        }, this._baseArgs));
      },

      _initStartPageView: function () {
        return new StartPage(this._baseArgs);
      },

      _initLocationTypeView: function () {
        return new LocationType(this._baseArgs);
      },

      _clearResults: function () {
        if (this._pageContainer) {
          var homeView = this._pageContainer.getViewByTitle('Home');
          if (homeView) {
            homeView._clearStore(true);
            homeView._clearMapping();
          }
        }
      },

      validatePrivileges: function () {
        var def = new Deferred();
        this.portal = this.portal || portalUtils.getPortal(this.appConfig.portalUrl);
        this.portal.getUser().then(lang.hitch(this, function (user) {
          this.userName = user.username;
          //user.availableCredits only has a value when credit limits are enabled
          this.userCredits = typeof (user.availableCredits) !== 'undefined' ?
            user.availableCredits : typeof (this.portal.availableCredits) !== 'undefined' ?
            this.portal.availableCredits : 0;
          this._checkLayerEditable(this.userCredits > 0).then(function (result) {
            def.resolve(result);
          });
        }), lang.hitch(this, function (err) {
          console.log(err);
          this._checkLayerEditable(false).then(function (result) {
            def.resolve(result);
          });
        }));
        return def;
      },

      _checkLayerEditable: function (hasCredits) {
        var def = new Deferred();
        //added isEditable check to verify if anonymous editing is enabled
        this.editLayerNode.isEditable().then(lang.hitch(this, function (isEditable) {
          def.resolve({
            canEdit: isEditable,
            hasCredits: hasCredits
          });
        }));
        return def;
      },

      showEditMessage: function () {
        var messages = [];
        //if userName is set they are logged in...when logged in they must have edit privileges
        var br = "</br></br>";
        if (typeof(this.userName) !== 'undefined') {
          messages = [this.nls.startPage.userPrivilege + br, this.nls.startPage.contactAdminEdit];
        } else {
          this.portal = this.portal || portalUtils.getPortal(this.appConfig.portalUrl);
          messages = [esriLang.substitute({
            layerName: this.editLayer.name
          }, this.nls.startPage.noAnonymousEdit + br),
          esriLang.substitute({
            org: this.portal.name
          }, this.nls.startPage.pleaseLogin)];
        }
        this._showPopup(messages, this.nls.startPage.invalidEdit);
      },

      locatorError: function (url, nextLocator) {
        var messages = [url + "</br></br>"];
        if (nextLocator) {
          messages.push(esriLang.substitute({
            locator: nextLocator
          }, this.nls.startPage.canUseLocator));
        }
        this._showPopup(messages, this.nls.warningsAndErrors.locatorError);
      }
    });
  });