define(["require", "exports", 'intern!bdd', 'intern/chai!expect', 'widgets/Analysis/PrivilegeUtil', 'dojo/text!./res/PortalSelf.json', 'jimu/portalUtils', 'dojo/json', 'esri/kernel', 'intern/order!sinon', 'dojo/Deferred'], function (require, exports, bdd, expect, PrivilegeUtil, portalSelfString, PortalUtils, JSON, esriNS, sinon, Deferred) {
    "use strict";
    var privilegeUtil;
    var portalSelf = JSON.parse(portalSelfString);
    var portalUrl = 'http://mercury.chn.esri.com/arcgis/portal';
    bdd.describe('Analysis PrivilegeUtil test', function () {
        bdd.beforeEach(function () {
            privilegeUtil = new PrivilegeUtil(portalUrl);
        });
        bdd.it('should not work if privileges have not been loaded', function () {
            expect(privilegeUtil.canPerformAnalysis()).to.be.false;
            expect(privilegeUtil.getUser()).to.be.null;
            expect(privilegeUtil.getUserPortal()).to.be.null;
            expect(privilegeUtil.isAdmin()).to.be.false;
            expect(privilegeUtil.isPortal()).to.be.false;
            expect(privilegeUtil.hasPrivileges(['networkanalysis'])).to.be.false;
        });
        bdd.describe('sub suite -- have sign in', function () {
            bdd.beforeEach(function () {
                privilegeUtil = new PrivilegeUtil(portalUrl);
            });
            bdd.it('should load privilege successfully if loadSelfInfo is ok', function () {
                var _this = this;
                var spy1 = sinon.spy(), spy2 = sinon.spy();
                PortalUtils.getPortal = function () {
                    return {
                        haveSignIn: function () {
                            spy1.apply(_this);
                            return true;
                        },
                        loadSelfInfo: function () {
                            var def = new Deferred();
                            spy2.apply(_this);
                            def.resolve(portalSelf);
                            return def;
                        }
                    };
                };
                var dfd = this.async(1000);
                privilegeUtil.loadPrivileges().then(dfd.callback(function (result) {
                    expect(spy1.called).to.be.true;
                    expect(spy2.called).to.be.true;
                    expect(result).to.be.true;
                    expect(privilegeUtil.canPerformAnalysis()).to.be.true;
                    expect(privilegeUtil.getUser()).to.not.be.null;
                    expect(privilegeUtil.getUserPortal()).to.not.be.null;
                    expect(privilegeUtil.hasPrivileges(['networkanalysis'])).to.be.true;
                }));
            });
            bdd.it('should not load privilege if loadSelfInfo failed', function () {
                var _this = this;
                var spy1 = sinon.spy(), spy2 = sinon.spy();
                PortalUtils.getPortal = function () {
                    return {
                        haveSignIn: function () {
                            spy1.apply(_this);
                            return true;
                        },
                        loadSelfInfo: function () {
                            var def = new Deferred();
                            spy2.apply(_this);
                            def.reject('404');
                            return def;
                        }
                    };
                };
                var dfd = this.async(1000);
                privilegeUtil.loadPrivileges().then(dfd.callback(function (result) {
                    expect(spy1.called).to.be.true;
                    expect(spy2.called).to.be.true;
                    expect(result).to.be.false;
                    expect(privilegeUtil.canPerformAnalysis()).to.be.false;
                    expect(privilegeUtil.getUser()).to.be.null;
                    expect(privilegeUtil.getUserPortal()).to.be.null;
                    expect(privilegeUtil.hasPrivileges(['networkanalysis'])).to.be.false;
                }));
            });
            bdd.it('should not load privilege if loadSelfInfo returns value without user info', function () {
                var _this = this;
                var spy1 = sinon.spy(), spy2 = sinon.spy();
                PortalUtils.getPortal = function () {
                    return {
                        haveSignIn: function () {
                            spy1.apply(_this);
                            return true;
                        },
                        loadSelfInfo: function () {
                            var def = new Deferred();
                            spy2.apply(_this);
                            def.resolve({
                                name: 'unit_test'
                            });
                            return def;
                        }
                    };
                };
                var dfd = this.async(1000);
                privilegeUtil.loadPrivileges().then(dfd.callback(function (result) {
                    expect(spy1.called).to.be.true;
                    expect(spy2.called).to.be.true;
                    expect(result).to.be.false;
                    expect(privilegeUtil.canPerformAnalysis()).to.be.false;
                    expect(privilegeUtil.getUser()).to.be.null;
                    expect(privilegeUtil.getUserPortal()).to.be.null;
                    expect(privilegeUtil.hasPrivileges(['networkanalysis'])).to.be.false;
                }));
            });
        });
        bdd.describe('sub suite -- have not sign in, cross org', function () {
            bdd.beforeEach(function () {
                privilegeUtil = new PrivilegeUtil(portalUrl);
            });
            bdd.it('should not load privilege if loadSelfInfo for portal one rejected', function () {
                var _this = this;
                var spy1 = sinon.spy(), spy2 = sinon.spy();
                PortalUtils.getPortal = function (url) {
                    if (url === portalUrl) {
                        return {
                            haveSignIn: function () {
                                spy1.apply(_this);
                                return false;
                            },
                            loadSelfInfo: function () {
                                var def = new Deferred();
                                spy2.apply(_this);
                                def.reject('error');
                                return def;
                            }
                        };
                    }
                    return null;
                };
                var dfd = this.async(1000);
                privilegeUtil.loadPrivileges().then(dfd.callback(function (result) {
                    expect(spy1.called).to.be.true;
                    expect(spy2.called).to.be.true;
                    expect(result).to.be.false;
                    expect(privilegeUtil.canPerformAnalysis()).to.be.false;
                    expect(privilegeUtil.getUser()).to.be.null;
                    expect(privilegeUtil.getUserPortal()).to.be.null;
                    expect(privilegeUtil.hasPrivileges(['networkanalysis'])).to.be.false;
                }));
            });
            bdd.it('should not load privilege if portal two is null', function () {
                var _this = this;
                var spy1 = sinon.spy(), spy2 = sinon.spy();
                PortalUtils.getPortal = function (url) {
                    if (url === portalUrl) {
                        return {
                            haveSignIn: function () {
                                spy1.apply(_this);
                                return false;
                            },
                            loadSelfInfo: function () {
                                var def = new Deferred();
                                spy2.apply(_this);
                                def.resolve({
                                    name: 'unit test'
                                });
                                return def;
                            }
                        };
                    }
                    return null;
                };
                var dfd = this.async(1000);
                privilegeUtil.loadPrivileges().then(dfd.callback(function (result) {
                    expect(spy1.called).to.be.true;
                    expect(spy2.called).to.be.true;
                    expect(result).to.be.false;
                    expect(privilegeUtil.canPerformAnalysis()).to.be.false;
                    expect(privilegeUtil.getUser()).to.be.null;
                    expect(privilegeUtil.getUserPortal()).to.be.null;
                    expect(privilegeUtil.hasPrivileges(['networkanalysis'])).to.be.false;
                }));
            });
            bdd.it('should not load privilege if sign in portal two fails', function () {
                var _this = this;
                var spy1 = sinon.spy(), spy2 = sinon.spy(), spy3 = sinon.spy();
                PortalUtils.getPortal = function (url) {
                    if (url === portalUrl) {
                        return {
                            haveSignIn: function () {
                                spy1.apply(_this);
                                return false;
                            },
                            loadSelfInfo: function () {
                                var def = new Deferred();
                                spy2.apply(_this);
                                def.resolve({
                                    name: 'unit test'
                                });
                                return def;
                            }
                        };
                    }
                    else {
                        return {
                            signIn: function () {
                                var def = new Deferred();
                                spy3.apply(_this);
                                def.reject('sign in faled');
                                return def;
                            }
                        };
                    }
                };
                var dfd = this.async(1000);
                privilegeUtil.loadPrivileges().then(dfd.callback(function (result) {
                    expect(spy1.called).to.be.true;
                    expect(spy2.called).to.be.true;
                    expect(spy3.called).to.be.true;
                    expect(result).to.be.false;
                    expect(privilegeUtil.canPerformAnalysis()).to.be.false;
                    expect(privilegeUtil.getUser()).to.be.null;
                    expect(privilegeUtil.getUserPortal()).to.be.null;
                    expect(privilegeUtil.hasPrivileges(['networkanalysis'])).to.be.false;
                }));
            });
            bdd.it('should not load privilege if sign in and loadSelfInfo for portal two success', function () {
                var _this = this;
                var spy1 = sinon.spy(), spy2 = sinon.spy(), spy3 = sinon.spy(), spy4 = sinon.spy(), credentialSpy = sinon.spy();
                esriNS.id = {
                    registerToken: credentialSpy
                };
                PortalUtils.getPortal = function (url) {
                    if (url === portalUrl) {
                        return {
                            haveSignIn: function () {
                                spy1.apply(_this);
                                return false;
                            },
                            loadSelfInfo: function () {
                                var def = new Deferred();
                                spy2.apply(_this);
                                def.resolve({
                                    name: 'unit test'
                                });
                                return def;
                            }
                        };
                    }
                    else {
                        return {
                            signIn: function () {
                                var def = new Deferred();
                                spy3.apply(_this);
                                var credential = {
                                    toJson: function () {
                                        return {
                                            userId: 'unit',
                                            server: portalUrl,
                                            token: 'my_credential',
                                            expires: 1234567890,
                                            ssl: false,
                                            scope: 'portal'
                                        };
                                    }
                                };
                                def.resolve(credential);
                                return def;
                            },
                            loadSelfInfo: function () {
                                var def = new Deferred();
                                spy4.apply(_this);
                                def.resolve(portalSelf);
                                return def;
                            }
                        };
                    }
                };
                var dfd = this.async(1000);
                privilegeUtil.loadPrivileges().then(dfd.callback(function (result) {
                    expect(spy1.called).to.be.true;
                    expect(spy2.called).to.be.true;
                    expect(spy3.called).to.be.true;
                    expect(spy4.called).to.be.true;
                    expect(result).to.be.true;
                    expect(privilegeUtil.canPerformAnalysis()).to.be.true;
                    expect(privilegeUtil.getUser()).to.not.be.null;
                    expect(privilegeUtil.getUserPortal()).to.not.be.null;
                    expect(privilegeUtil.hasPrivileges(['networkanalysis'])).to.be.true;
                    var arg = credentialSpy.lastCall.args[0];
                    expect(arg.token).to.equal('my_credential');
                    expect(arg.expires).to.equal(1234567890);
                }));
            });
        });
    });
});
