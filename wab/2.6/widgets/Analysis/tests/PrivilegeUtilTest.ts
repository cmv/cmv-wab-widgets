/// <reference path="interfaces.d.ts" />

import bdd = require('intern!bdd');
import expect = require('intern/chai!expect');
import PrivilegeUtil = require('widgets/Analysis/PrivilegeUtil');
import portalSelfString = require('dojo/text!./res/PortalSelf.json');
import PortalUtils = require('jimu/portalUtils');
import JSON = require('dojo/json');
import esriNS = require('esri/kernel');
import sinon = require('intern/order!sinon');
import Deferred = require('dojo/Deferred');

let privilegeUtil: PrivilegeUtil;
let portalSelf = JSON.parse(portalSelfString);
let portalUrl = 'http://mercury.chn.esri.com/arcgis/portal';

bdd.describe('Analysis PrivilegeUtil test', () => {
  bdd.beforeEach(() => {
    privilegeUtil = new PrivilegeUtil(portalUrl);
  });

  bdd.it('should not work if privileges have not been loaded', () => {
    expect(privilegeUtil.canPerformAnalysis()).to.be.false;
    expect(privilegeUtil.getUser()).to.be.null;
    expect(privilegeUtil.getUserPortal()).to.be.null;
    expect(privilegeUtil.isAdmin()).to.be.false;
    expect(privilegeUtil.isPortal()).to.be.false;
    expect(privilegeUtil.hasPrivileges(['networkanalysis'])).to.be.false;
  });

  bdd.describe('sub suite -- have sign in', () => {
    bdd.beforeEach(() => {
      privilegeUtil = new PrivilegeUtil(portalUrl);
    });

    bdd.it('should load privilege successfully if loadSelfInfo is ok', function() {
      let spy1 = sinon.spy(),
          spy2 = sinon.spy();

      PortalUtils.getPortal = (): any => {
        return {
          haveSignIn: () => {
            spy1.apply(this);
            return true;
          },

          loadSelfInfo: () => {
            let def = new Deferred<any>();
            spy2.apply(this);
            def.resolve(portalSelf);
            return def;
          }
        };
      };

      let dfd = this.async(1000);

      privilegeUtil.loadPrivileges().then(dfd.callback((result) => {
        expect(spy1.called).to.be.true;
        expect(spy2.called).to.be.true;
        expect(result).to.be.true;
        expect(privilegeUtil.canPerformAnalysis()).to.be.true;
        expect(privilegeUtil.getUser()).to.not.be.null;
        expect(privilegeUtil.getUserPortal()).to.not.be.null;
        expect(privilegeUtil.hasPrivileges(['networkanalysis'])).to.be.true;
      }));
    });

    bdd.it('should not load privilege if loadSelfInfo failed', function() {
      let spy1 = sinon.spy(),
          spy2 = sinon.spy();

      PortalUtils.getPortal = (): any => {
        return {
          haveSignIn: () => {
            spy1.apply(this);
            return true;
          },

          loadSelfInfo: () => {
            let def = new Deferred<any>();
            spy2.apply(this);
            def.reject('404');
            return def;
          }
        };
      };

      let dfd = this.async(1000);

      privilegeUtil.loadPrivileges().then(dfd.callback((result) => {
        expect(spy1.called).to.be.true;
        expect(spy2.called).to.be.true;
        expect(result).to.be.false;
        expect(privilegeUtil.canPerformAnalysis()).to.be.false;
        expect(privilegeUtil.getUser()).to.be.null;
        expect(privilegeUtil.getUserPortal()).to.be.null;
        expect(privilegeUtil.hasPrivileges(['networkanalysis'])).to.be.false;
      }));
    });

    bdd.it('should not load privilege if loadSelfInfo returns value without user info', function() {
      let spy1 = sinon.spy(),
          spy2 = sinon.spy();

      PortalUtils.getPortal = (): any => {
        return {
          haveSignIn: () => {
            spy1.apply(this);
            return true;
          },

          loadSelfInfo: () => {
            let def = new Deferred<any>();
            spy2.apply(this);
            def.resolve({
              name: 'unit_test'
            });
            return def;
          }
        };
      };

      let dfd = this.async(1000);

      privilegeUtil.loadPrivileges().then(dfd.callback((result) => {
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

  bdd.describe('sub suite -- have not sign in, cross org', () => {
    bdd.beforeEach(() => {
      privilegeUtil = new PrivilegeUtil(portalUrl);
    });

    bdd.it('should not load privilege if loadSelfInfo for portal one rejected', function() {
      let spy1 = sinon.spy(),
          spy2 = sinon.spy();

      PortalUtils.getPortal = (url: string): any => {
        if (url === portalUrl) {
          return {
            haveSignIn: () => {
              spy1.apply(this);
              return false;
            },

            loadSelfInfo: () => {
              let def = new Deferred<any>();
              spy2.apply(this);
              def.reject('error');
              return def;
            }
          };
        }
        return null;
      };

      let dfd = this.async(1000);

      privilegeUtil.loadPrivileges().then(dfd.callback((result) => {
        expect(spy1.called).to.be.true;
        expect(spy2.called).to.be.true;
        expect(result).to.be.false;
        expect(privilegeUtil.canPerformAnalysis()).to.be.false;
        expect(privilegeUtil.getUser()).to.be.null;
        expect(privilegeUtil.getUserPortal()).to.be.null;
        expect(privilegeUtil.hasPrivileges(['networkanalysis'])).to.be.false;
      }));
    });

    bdd.it('should not load privilege if portal two is null', function() {
      let spy1 = sinon.spy(),
          spy2 = sinon.spy();

      PortalUtils.getPortal = (url: string): any => {
        if (url === portalUrl) {
          return {
            haveSignIn: () => {
              spy1.apply(this);
              return false;
            },

            loadSelfInfo: () => {
              let def = new Deferred<any>();
              spy2.apply(this);
              def.resolve({
                name: 'unit test'
              });
              return def;
            }
          };
        }
        return null;
      };

      let dfd = this.async(1000);

      privilegeUtil.loadPrivileges().then(dfd.callback((result) => {
        expect(spy1.called).to.be.true;
        expect(spy2.called).to.be.true;
        expect(result).to.be.false;
        expect(privilegeUtil.canPerformAnalysis()).to.be.false;
        expect(privilegeUtil.getUser()).to.be.null;
        expect(privilegeUtil.getUserPortal()).to.be.null;
        expect(privilegeUtil.hasPrivileges(['networkanalysis'])).to.be.false;
      }));
    });

    bdd.it('should not load privilege if sign in portal two fails', function() {
      let spy1 = sinon.spy(),
          spy2 = sinon.spy(),
          spy3 = sinon.spy();

      PortalUtils.getPortal = (url: string): any => {
        if (url === portalUrl) { // first portal
          return {
            haveSignIn: () => {
              spy1.apply(this);
              return false;
            },

            loadSelfInfo: () => {
              let def = new Deferred<any>();
              spy2.apply(this);
              def.resolve({
                name: 'unit test'
              });
              return def;
            }
          };
        } else { // second portal
          return {
            signIn: () => {
              let def = new Deferred<any>();
              spy3.apply(this);
              def.reject('sign in faled');
              return def;
            }
          };
        }
      };

      let dfd = this.async(1000);

      privilegeUtil.loadPrivileges().then(dfd.callback((result) => {
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

    bdd.it('should not load privilege if sign in and loadSelfInfo for portal two success', function() {
      let spy1 = sinon.spy(),
          spy2 = sinon.spy(),
          spy3 = sinon.spy(),
          spy4 = sinon.spy(),
          credentialSpy = sinon.spy();

      esriNS.id = {
        registerToken: credentialSpy
      };

      PortalUtils.getPortal = (url: string): any => {
        if (url === portalUrl) { // first portal
          return {
            haveSignIn: () => {
              spy1.apply(this);
              return false;
            },

            loadSelfInfo: () => {
              let def = new Deferred<any>();
              spy2.apply(this);
              def.resolve({
                name: 'unit test'
              });
              return def;
            }
          };
        } else { // second portal
          return {
            signIn: () => {
              let def = new Deferred<any>();
              spy3.apply(this);
              let credential = {
                toJson: function() {
                  return {
                    userId:  'unit',
                    server:  portalUrl,
                    token:   'my_credential',
                    expires: 1234567890,
                    ssl:     false,
                    scope:   'portal'
                  };
                }
              };
              def.resolve(credential);
              return def;
            },

            loadSelfInfo: () => {
              let def = new Deferred<any>();
              spy4.apply(this);
              def.resolve(portalSelf);
              return def;
            }
          };
        }
      };

      let dfd = this.async(1000);

      privilegeUtil.loadPrivileges().then(dfd.callback((result) => {
        expect(spy1.called).to.be.true;
        expect(spy2.called).to.be.true;
        expect(spy3.called).to.be.true;
        expect(spy4.called).to.be.true;
        expect(result).to.be.true;
        expect(privilegeUtil.canPerformAnalysis()).to.be.true;
        expect(privilegeUtil.getUser()).to.not.be.null;
        expect(privilegeUtil.getUserPortal()).to.not.be.null;
        expect(privilegeUtil.hasPrivileges(['networkanalysis'])).to.be.true;

        let arg = credentialSpy.lastCall.args[0];
        expect(arg.token).to.equal('my_credential');
        expect(arg.expires).to.equal(1234567890);
      }));
    });
  });
});
