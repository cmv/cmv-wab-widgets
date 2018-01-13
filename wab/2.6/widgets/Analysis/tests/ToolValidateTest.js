define(["require", "exports", 'intern!bdd', 'intern/chai!expect', 'widgets/Analysis/toolValidate'], function (require, exports, bdd, expect, ToolValidate) {
    "use strict";
    var point1 = {
        id: 'layer0',
        geometryType: 'esriGeometryPoint'
    }, point2 = {
        id: 'layer1',
        geometryType: 'esriGeometryPoint'
    }, line1 = {
        id: 'layer2',
        geometryType: 'esriGeometryPolyline'
    }, line2 = {
        id: 'layer3',
        geometryType: 'esriGeometryPolyline'
    }, polygon1 = {
        id: 'layer4',
        geometryType: 'esriGeometryPolygon'
    }, polygon2 = {
        id: 'layer5',
        geometryType: 'esriGeometryPolygon'
    };
    bdd.describe('Analysis toolValidate test', function () {
        bdd.describe('sub suite -- find feature layer whose geometry type matches', function () {
            bdd.it('should find all matched layers if a sinlge geometry type is provided', function () {
                expect(ToolValidate.findMatchedFeatureLayers([polygon2, point1, point2], ['esriGeometryPoint']))
                    .to.deep.equal([point1.id, point2.id]);
            });
            bdd.it('should find the all layers if geometry type is *', function () {
                expect(ToolValidate.findMatchedFeatureLayers([polygon2, point1, point2], ['*']))
                    .to.have.lengthOf(3);
            });
            bdd.it('should find the all matched layer if there is multiple geometry types', function () {
                expect(ToolValidate.findMatchedFeatureLayers([polygon2, point1, point2, line1], ['esriGeometryPoint', 'esriGeometryPolygon'])).to.have.lengthOf(3);
            });
            bdd.it('should not find any layer if geometry type is not match', function () {
                expect(ToolValidate.findMatchedFeatureLayers([polygon2, line2, line1], ['esriGeometryPoint'])).to.have.lengthOf(0);
                expect(ToolValidate.findMatchedFeatureLayers([polygon2, point2, point1], ['esriGeometryPolyline'])).to.have.lengthOf(0);
                expect(ToolValidate.findMatchedFeatureLayers([line1, point2], ['esriGeometryPolygon'])).to.have.lengthOf(0);
                expect(ToolValidate.findMatchedFeatureLayers([point1, point2], ['esriGeometryPolygon', 'esriGeometryPolyline'])).to.have.lengthOf(0);
            });
        });
        bdd.describe('sub suite -- check whether param is available', function () {
            bdd.it('should check the existence of analysis layer, no requiredParam', function () {
                var layer = {
                    name: 'analysisLayer',
                    geomTypes: ['esriGeometryPoint']
                };
                expect(ToolValidate.paramAvailable([point1], layer)).to.be.true;
                expect(ToolValidate.paramAvailable([line1], layer)).to.be.false;
                expect(ToolValidate.paramAvailable([polygon1], layer)).to.be.false;
                layer.geomTypes = ['esriGeometryPolyline'];
                expect(ToolValidate.paramAvailable([point1], layer)).to.be.false;
                expect(ToolValidate.paramAvailable([line1], layer)).to.be.true;
                expect(ToolValidate.paramAvailable([polygon1], layer)).to.be.false;
                layer.geomTypes = ['esriGeometryPolygon'];
                expect(ToolValidate.paramAvailable([point1], layer)).to.be.false;
                expect(ToolValidate.paramAvailable([line1], layer)).to.be.false;
                expect(ToolValidate.paramAvailable([polygon1], layer)).to.be.true;
                layer.geomTypes = ['esriGeometryPoint', 'esriGeometryPolygon'];
                expect(ToolValidate.paramAvailable([point1], layer)).to.be.true;
                expect(ToolValidate.paramAvailable([line1], layer)).to.be.false;
                expect(ToolValidate.paramAvailable([polygon1], layer)).to.be.true;
                layer.geomTypes = ['esriGeometryPoint', 'esriGeometryPolyline'];
                expect(ToolValidate.paramAvailable([point1], layer)).to.be.true;
                expect(ToolValidate.paramAvailable([line1], layer)).to.be.true;
                expect(ToolValidate.paramAvailable([polygon1], layer)).to.be.false;
                layer.geomTypes = ['esriGeometryPolygon', 'esriGeometryPolyline'];
                expect(ToolValidate.paramAvailable([point1], layer)).to.be.false;
                expect(ToolValidate.paramAvailable([line1], layer)).to.be.true;
                expect(ToolValidate.paramAvailable([polygon1], layer)).to.be.true;
                layer.geomTypes = ['*'];
                expect(ToolValidate.paramAvailable([point1], layer)).to.be.true;
                expect(ToolValidate.paramAvailable([line1], layer)).to.be.true;
                expect(ToolValidate.paramAvailable([polygon1], layer)).to.be.true;
            });
            bdd.it('should check the existence of analysis layer, has requiredParam', function () {
                var layer = {
                    name: 'analysisLayer',
                    geomTypes: ['esriGeometryPoint']
                }, requiredParam = {
                    name: 'otherLayer',
                    geomTypes: ['esriGeometryPoint']
                };
                expect(ToolValidate.paramAvailable([point1], layer, requiredParam)).to.be.false;
                expect(ToolValidate.paramAvailable([point1, point2], layer, requiredParam)).to.be.true;
                layer.geomTypes = ['*'];
                expect(ToolValidate.paramAvailable([line1, point1], layer, requiredParam)).to.be.true;
                expect(ToolValidate.paramAvailable([point1, line1], layer, requiredParam)).to.be.true;
                expect(ToolValidate.paramAvailable([polygon1, line1], layer, requiredParam)).to.be.false;
                layer.geomTypes = ['esriGeometryPoint', 'esriGeometryPolyline'];
                expect(ToolValidate.paramAvailable([line1, point1], layer, requiredParam)).to.be.true;
                expect(ToolValidate.paramAvailable([point1, line1], layer, requiredParam)).to.be.true;
                expect(ToolValidate.paramAvailable([point1, polygon2], layer, requiredParam)).to.be.false;
            });
        });
        bdd.describe('sub suite -- check merge tool', function () {
            bdd.it('merge should be availble if there are two layers with the same geometry type', function () {
                expect(ToolValidate.mergeAvailable([point1, point2])).to.be.true;
                expect(ToolValidate.mergeAvailable([line1, line2])).to.be.true;
                expect(ToolValidate.mergeAvailable([polygon1, polygon2])).to.be.true;
                expect(ToolValidate.mergeAvailable([point1, line1, point2])).to.be.true;
                expect(ToolValidate.mergeAvailable([point1, point2, line1, line2, polygon1, polygon2])).to.be.true;
            });
            bdd.it('merge should not be availble if there are not two layers with the same geometry type', function () {
                expect(ToolValidate.mergeAvailable([point1])).to.be.false;
                expect(ToolValidate.mergeAvailable([line1])).to.be.false;
                expect(ToolValidate.mergeAvailable([polygon1])).to.be.false;
                expect(ToolValidate.mergeAvailable([point1, line1, polygon1])).to.be.false;
                expect(ToolValidate.mergeAvailable([point1, polygon2])).to.be.false;
            });
        });
        bdd.describe('sub suite -- check extract data tool, simple layer type', function () {
            var _this = this;
            bdd.before(function () {
                _this.privilegeUtil = {
                    getUser: function () {
                        return {};
                    },
                    isPortal: function () {
                        return true;
                    }
                };
            });
            bdd.it('GeoRSSLayer should support extract', function () {
                var layerObject = {
                    id: 'geo_rss',
                    geometryType: '',
                    declaredClass: 'esri.layers.GeoRSSLayer'
                };
                expect(ToolValidate.extractAvailable([layerObject], _this.privilegeUtil)).to.be.true;
                expect(layerObject.capabilities).to.contain('Extract');
            });
            bdd.it('CSVLayer should support extract', function () {
                var layerObject = {
                    id: 'geo_rss',
                    geometryType: 'esriGeometryPoint',
                    declaredClass: 'esri.layers.CSVLayer'
                };
                expect(ToolValidate.extractAvailable([layerObject], _this.privilegeUtil)).to.be.true;
                expect(layerObject.capabilities).to.contain('Extract');
            });
            bdd.it('WFSLayer should support extract', function () {
                var layerObject = {
                    id: 'geo_wfs',
                    geometryType: 'esriGeometryPoint',
                    declaredClass: 'esri.layers.WFSLayer'
                };
                expect(ToolValidate.extractAvailable([layerObject], _this.privilegeUtil)).to.be.true;
                expect(layerObject.capabilities).to.contain('Extract');
            });
            bdd.it('FeatureLayer without url should support extract', function () {
                var layerObject = {
                    id: 'layer0',
                    geometryType: 'esriGeometryPoint',
                    declaredClass: 'esri.layers.FeatureLayer'
                };
                expect(ToolValidate.extractAvailable([layerObject], _this.privilegeUtil)).to.be.true;
                expect(layerObject.capabilities).to.contain('Extract');
            });
        });
        bdd.describe('sub suite -- check extract data tool for portal, featurelayer with url', function () {
            var _this = this;
            bdd.before(function () {
                _this.privilegeUtil = {
                    getUser: function () {
                        return {
                            role: 'org_admin',
                            orgId: 'oC086ufSSQ6Avnw2',
                            privileges: [
                                'portal:user:createItem'
                            ],
                            username: 'test@esri.com'
                        };
                    },
                    isPortal: function () {
                        return true;
                    }
                };
            });
            bdd.it('User is admin and itemControl is admin should support extract', function () {
                var layerObject = {
                    id: 'layer0',
                    geometryType: 'esriGeometryPoint',
                    declaredClass: 'esri.layers.FeatureLayer',
                    url: 'http://www.arcgis.com/oC086ufSSQ6Avnw2/services/xxx',
                    itemInfo: {
                        itemControl: 'admin'
                    }
                };
                _this.privilegeUtil.isAdmin = function () {
                    return true;
                };
                expect(_this.privilegeUtil.isAdmin()).to.be.true;
                expect(ToolValidate.extractAvailable([layerObject], _this.privilegeUtil)).to.be.true;
                expect(layerObject.capabilities).to.contain('Extract');
            });
            bdd.it('User is admin but itemControl is not admin should not support extract', function () {
                var layerObject = {
                    id: 'layer0',
                    geometryType: 'esriGeometryPoint',
                    declaredClass: 'esri.layers.FeatureLayer',
                    url: 'http://www.arcgis.com/oC086ufSSQ6Avnw2/services/xxx',
                    itemInfo: {
                        itemControl: 'me'
                    }
                };
                _this.privilegeUtil.isAdmin = function () {
                    return true;
                };
                expect(_this.privilegeUtil.isAdmin()).to.be.true;
                expect(ToolValidate.extractAvailable([layerObject], _this.privilegeUtil)).to.be.false;
                expect(layerObject.capabilities).to.be.undefined;
            });
            bdd.it('User is admin but no itemInfo should not support extract', function () {
                var layerObject = {
                    id: 'layer0',
                    geometryType: 'esriGeometryPoint',
                    declaredClass: 'esri.layers.FeatureLayer',
                    url: 'http://www.arcgis.com/oC086ufSSQ6Avnw2/services/xxx'
                };
                _this.privilegeUtil.isAdmin = function () {
                    return true;
                };
                expect(_this.privilegeUtil.isAdmin()).to.be.true;
                expect(ToolValidate.extractAvailable([layerObject], _this.privilegeUtil)).to.be.false;
                expect(layerObject.capabilities).to.be.undefined;
            });
            bdd.it('User is not admin or owner should not support extract', function () {
                var layerObject = {
                    id: 'layer0',
                    geometryType: 'esriGeometryPoint',
                    declaredClass: 'esri.layers.FeatureLayer',
                    url: 'http://www.arcgis.com/oC086ufSSQ6Avnw2/services/xxx',
                    itemInfo: {
                        owner: 'user@esri.com'
                    }
                };
                _this.privilegeUtil.isAdmin = function () {
                    return false;
                };
                expect(_this.privilegeUtil.isAdmin()).to.be.false;
                expect(ToolValidate.extractAvailable([layerObject], _this.privilegeUtil)).to.be.false;
                expect(layerObject.capabilities).to.be.undefined;
            });
            bdd.it('User is not admin and layerObject has no itemInfo should not support extract', function () {
                var layerObject = {
                    id: 'layer0',
                    geometryType: 'esriGeometryPoint',
                    declaredClass: 'esri.layers.FeatureLayer',
                    url: 'http://www.arcgis.com/oC086ufSSQ6Avnw2/services/xxx'
                };
                _this.privilegeUtil.isAdmin = function () {
                    return false;
                };
                expect(_this.privilegeUtil.isAdmin()).to.be.false;
                expect(ToolValidate.extractAvailable([layerObject], _this.privilegeUtil)).to.be.false;
                expect(layerObject.capabilities).to.be.undefined;
            });
            bdd.it('User is not admin but is owner should support extract', function () {
                var layerObject = {
                    id: 'layer0',
                    geometryType: 'esriGeometryPoint',
                    declaredClass: 'esri.layers.FeatureLayer',
                    url: 'http://www.arcgis.com/oC086ufSSQ6Avnw2/services/xxx',
                    itemInfo: {
                        owner: 'test@esri.com'
                    }
                };
                _this.privilegeUtil.isAdmin = function () {
                    return false;
                };
                expect(_this.privilegeUtil.isAdmin()).to.be.false;
                expect(ToolValidate.extractAvailable([layerObject], _this.privilegeUtil)).to.be.true;
                expect(layerObject.capabilities).to.contain('Extract');
            });
        });
        bdd.describe('sub suite -- check extract data tool for online, featurelayer with url', function () {
            var _this = this;
            bdd.before(function () {
                _this.privilegeUtil = {
                    getUser: function () {
                        return {
                            role: 'org_admin',
                            orgId: 'oC086ufSSQ6Avnw2',
                            privileges: [
                                'portal:user:createItem'
                            ],
                            username: 'test@esri.com'
                        };
                    },
                    isPortal: function () {
                        return false;
                    }
                };
            });
            bdd.it('User is admin and url contains orgId should support extract', function () {
                var layerObject = {
                    id: 'layer0',
                    geometryType: 'esriGeometryPoint',
                    declaredClass: 'esri.layers.FeatureLayer',
                    url: 'http://www.arcgis.com/oC086ufSSQ6Avnw2/services/xxx'
                };
                _this.privilegeUtil.isAdmin = function () {
                    return true;
                };
                expect(_this.privilegeUtil.isAdmin()).to.be.true;
                expect(ToolValidate.extractAvailable([layerObject], _this.privilegeUtil)).to.be.true;
                expect(layerObject.capabilities).to.contain('Extract');
            });
            bdd.it('User is admin but url doesnot contain orgId should not support extract', function () {
                var layerObject = {
                    id: 'layer0',
                    geometryType: 'esriGeometryPoint',
                    declaredClass: 'esri.layers.FeatureLayer',
                    url: 'http://www.arcgis.com/customOrg/services/xxx'
                };
                _this.privilegeUtil.isAdmin = function () {
                    return true;
                };
                expect(_this.privilegeUtil.isAdmin()).to.be.true;
                expect(ToolValidate.extractAvailable([layerObject], _this.privilegeUtil)).to.be.false;
                expect(layerObject.capabilities).to.be.undefined;
            });
            bdd.it('User is not admin or owner should not support extract', function () {
                var layerObject = {
                    id: 'layer0',
                    geometryType: 'esriGeometryPoint',
                    declaredClass: 'esri.layers.FeatureLayer',
                    url: 'http://www.arcgis.com/oC086ufSSQ6Avnw2/services/xxx',
                    itemInfo: {
                        owner: 'user@esri.com'
                    }
                };
                _this.privilegeUtil.isAdmin = function () {
                    return false;
                };
                expect(_this.privilegeUtil.isAdmin()).to.be.false;
                expect(ToolValidate.extractAvailable([layerObject], _this.privilegeUtil)).to.be.false;
                expect(layerObject.capabilities).to.be.undefined;
            });
            bdd.it('User is owner and url contains orgId should support extract', function () {
                var layerObject = {
                    id: 'layer0',
                    geometryType: 'esriGeometryPoint',
                    declaredClass: 'esri.layers.FeatureLayer',
                    url: 'http://www.arcgis.com/oC086ufSSQ6Avnw2/services/xxx',
                    itemInfo: {
                        owner: 'test@esri.com'
                    }
                };
                _this.privilegeUtil.isAdmin = function () {
                    return false;
                };
                expect(_this.privilegeUtil.isAdmin()).to.be.false;
                expect(ToolValidate.extractAvailable([layerObject], _this.privilegeUtil)).to.be.true;
                expect(layerObject.capabilities).to.contain('Extract');
            });
            bdd.it('User is owner but url does not contain orgId should not support extract', function () {
                var layerObject = {
                    id: 'layer0',
                    geometryType: 'esriGeometryPoint',
                    declaredClass: 'esri.layers.FeatureLayer',
                    url: 'http://www.arcgis.com/customOrg/services/xxx',
                    itemInfo: {
                        owner: 'test@esri.com'
                    }
                };
                _this.privilegeUtil.isAdmin = function () {
                    return false;
                };
                expect(_this.privilegeUtil.isAdmin()).to.be.false;
                expect(ToolValidate.extractAvailable([layerObject], _this.privilegeUtil)).to.be.false;
                expect(layerObject.capabilities).to.be.undefined;
            });
        });
        bdd.describe('sub suite -- validate tool params', function () {
            var _this = this;
            bdd.before(function () {
                _this.tool_1 = {
                    id: 1,
                    dijitID: '',
                    title: '',
                    analysisLayer: {
                        name: 'inputLayer',
                        geomTypes: ['esriGeometryPolygon']
                    }
                };
                _this.tool_2 = {
                    id: 2,
                    dijitID: 'MergeLayers',
                    title: '',
                    analysisLayer: {
                        name: 'inputLayer',
                        geomTypes: ['*']
                    },
                    requiredParam: {
                        name: 'mergeLayers',
                        isArray: true,
                        geomTypes: ['*']
                    }
                };
                _this.tool_3 = {
                    id: 3,
                    dijitID: '',
                    title: '',
                    analysisLayer: {
                        name: 'layer',
                        geomTypes: ['esriGeometryPoint', 'esriGeometryPolyline']
                    },
                    requiredParam: {
                        name: 'polygonLayers',
                        isArray: true,
                        geomTypes: ['esriGeometryPolygon']
                    }
                };
            });
            bdd.it('tool_1 validation should depend on polygon layer', function () {
                expect(ToolValidate.isValid([polygon1], _this.tool_1)).to.be.true;
                expect(ToolValidate.isValid([point1], _this.tool_1)).to.be.false;
            });
            bdd.it('tool_2 validation should depend on the number of layers with the same geometry type', function () {
                expect(ToolValidate.isValid([polygon1], _this.tool_2)).to.be.false;
                expect(ToolValidate.isValid([point1, line1, polygon1], _this.tool_2)).to.be.false;
                expect(ToolValidate.isValid([point1, point2], _this.tool_2)).to.be.true;
            });
            bdd.it('tool_3 validation should depend on the layers\' geometry type', function () {
                expect(ToolValidate.isValid([polygon1], _this.tool_3)).to.be.false;
                expect(ToolValidate.isValid([point1, polygon1], _this.tool_3)).to.be.true;
                expect(ToolValidate.isValid([line1, polygon1], _this.tool_3)).to.be.true;
                expect(ToolValidate.isValid([point1, point2, line1], _this.tool_3)).to.be.false;
            });
        });
    });
});
