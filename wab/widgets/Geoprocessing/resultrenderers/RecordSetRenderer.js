define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/dom-construct',
  'dojo/dom-style',
  'dojo/dom-attr',
  'dojo/on',
  'dijit/_TemplatedMixin',
  'dojo/store/Memory',
  'dgrid/OnDemandGrid',
  'dgrid/extensions/ColumnResizer',
  'jimu/exportUtils',
  'jimu/dijit/ExportChooser',
  'jimu/LayerInfos/LayerInfos',
  'jimu/dijit/Popup',
  'dojo/text!./RecordSetRenderer.html',
  '../BaseResultRenderer'
], function(declare, lang, array, domConstruct, domStyle, domAttr, on, _TemplatedMixin,
  Memory, OnDemandGrid, ColumnResizer,
  exportUtils, ExportChooser, LayerInfos, Popup, template, BaseResultRenderer){
  return declare([BaseResultRenderer, _TemplatedMixin], {
    baseClass: 'jimu-gp-resultrenderer-base jimu-gp-renderer-table',
    templateString: template,

    postCreate: function(){
      this.inherited(arguments);
      var fields = [];
      if(!this.config.useDynamicSchema &&
          this.param.defaultValue &&
          this.param.defaultValue.output &&
          this.param.defaultValue.output.fields){
        fields = this.param.defaultValue.output.fields;
      }else if(this.value.fields){
        fields = this.value.fields;
      }else if(this.value.features && this.value.features.length > 0){
        for(var p in this.value.features[0].attributes){
          fields.push({
            name: p
          });
        }
      }

      if(this.config.shareResults){
        //add table to the map
        LayerInfos.getInstance(this.map, this.map.itemInfo)
          .then(lang.hitch(this, function(layerInfosObject){
            var featureCollection = {
              layerDefinition: {
                'fields': fields
              },
              featureSet: this.value
            };
            layerInfosObject.addTable({
              featureCollectionData: featureCollection,
              title: this.param.label || this.param.name
            });
          }));
      }

      var data = array.map(this.value.features, function(feature){
        return feature.attributes;
      });

      domAttr.set(this.magnifyNode, 'title', this.nls.enlargeView);
      this.own(on(this.magnifyNode, 'click', lang.hitch(this, this.magnifyTable)));

      if(this.config.showExportButton){
        domAttr.set(this.exportNode, 'title', this.nls.exportOutput);
        domStyle.set(this.exportNode, 'display', '');

        var ds = exportUtils.createDataSource({
          type: exportUtils.TYPE_TABLE,
          data: {
            fields: fields,
            datas: data
          },
          filename: this.param.name
        });
        this.exportChooser = new ExportChooser({
          dataSource: ds
        });
        this.exportChooser.hide();
        domConstruct.place(this.exportChooser.domNode, this.domNode);

        this.own(on(this.exportNode, 'click', lang.hitch(this, function(event){
          event.preventDefault();
          event.stopPropagation();
          this.exportChooser.show(event.clientX, event.clientY);
        })));
      }

      //Always creat table in output panel
      var columns = array.map(fields, function(field){
        return {
          label: field.alias || field.name,
          field: field.name
        };
      });

      var idProperty;
      array.some(this.value.fields, function(field){
        if(field.type === 'esriFieldTypeOID'){
          idProperty = field.name;
          return true;
        }
      });

      var memStore = new Memory({
        data: data,
        idProperty: idProperty
      });

      this.table = new (declare([OnDemandGrid, ColumnResizer]))({
        columns: columns,
        store: memStore
      });
      domConstruct.place(this.table.domNode, this.tableNode);
    },

    startup: function(){
      this.inherited(arguments);
      this.table.startup();
    },

    magnifyTable: function() {
      var container = domConstruct.create('div', {
        'class': 'gp-table-magnified'
      });
      domConstruct.place(this.table.domNode, container);

      var popup = new Popup({
        content: container,
        titleLabel: this.param.tooltip || this.param.label || '',
        container: 'main-page',
        onClose: lang.hitch(this, function(){
          domConstruct.place(this.table.domNode, this.tableNode);
          this.table.resize();
        })
      });
      domStyle.set(popup.domNode, {
        top: '5%',
        left: '5%',
        width: '90%',
        height: '90%'
      });
      popup.startup();
      this.table.resize();
    }
  });
});
