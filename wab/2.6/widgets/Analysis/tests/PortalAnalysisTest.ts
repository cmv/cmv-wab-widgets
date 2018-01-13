/// <reference path="interfaces.d.ts" />

import bdd = require('intern!bdd');
import expect = require('intern/chai!expect');
import PortalAnalysis = require('widgets/Analysis/PortalAnalysis');
import portalSelfString = require('dojo/text!./res/PortalSelf.json');
import Role = require('jimu/Role');
import JSON = require('dojo/json');

let portalAnalysis: PortalAnalysis;
let role: Role;
let portalSelf: any = JSON.parse(portalSelfString);

bdd.describe('Analysis PortalAnalysis test', () => {
  bdd.describe('sub suite -- check role of online', () => {
    bdd.before(() => {
      portalSelf.isPortal = false;
      portalSelf.helperServices.analysis = null;
    });

    bdd.it('online org_admin should be able to perform analysis', () => {
      portalSelf.user.role = 'org_admin';

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.true;
    });

    bdd.it('online account_admin should be able to perform analysis', () => {
      portalSelf.user.role = 'account_admin';

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.true;
    });

    bdd.it('online org_publisher should be able to perform analysis', () => {
      portalSelf.user.role = 'org_publisher';

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.true;
    });

    bdd.it('online account_publisher should be able to perform analysis', () => {
      portalSelf.user.role = 'account_publisher';

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.true;
    });

    bdd.it('online custom role with full privileges should be able to perform analysis', () => {
      portalSelf.user.role = 'custom';
      portalSelf.user.privileges = [
          'portal:user:createItem',
          'portal:publisher:publishFeatures',
          'premium:user:spatialanalysis'
      ];

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      role.setPrivileges(portalSelf.user.privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.true;
    });

    bdd.it('online custom role without createItem privileges should not be able to perform analysis', () => {
      portalSelf.user.role = 'custom';
      portalSelf.user.privileges = [
        'portal:publisher:publishFeatures',
        'premium:user:spatialanalysis'
      ];

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      role.setPrivileges(portalSelf.user.privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.false;
    });

    bdd.it('online custom role without publishFeatures privileges should not be able to perform analysis', () => {
      portalSelf.user.role = 'custom';
      portalSelf.user.privileges = [
        'portal:user:createItem',
        'premium:user:spatialanalysis'
      ];

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      role.setPrivileges(portalSelf.user.privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.false;
    });

    bdd.it('online custom role without spatialanalysis privileges should not be able to perform analysis', () => {
      portalSelf.user.role = 'custom';
      portalSelf.user.privileges = [
        'portal:user:createItem',
        'portal:publisher:publishFeatures'
      ];

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      role.setPrivileges(portalSelf.user.privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.false;
    });
  });

  bdd.describe('sub suite -- check role of portal with analysis service defined', () => {
    bdd.before(() => {
      portalSelf.isPortal = true;
      portalSelf.helperServices.analysis = {
        url: 'http://analysis1.arcgis.com/arcgis/rest/services/tasks/GPServer'
      };
    });

    bdd.it('portal org_admin should be able to perform analysis', () => {
      portalSelf.user.role = 'org_admin';

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.true;
    });

    bdd.it('portal account_admin should be able to perform analysis', () => {
      portalSelf.user.role = 'account_admin';

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.true;
    });

    bdd.it('portal org_publisher should be able to perform analysis', () => {
      portalSelf.user.role = 'org_publisher';

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.true;
    });

    bdd.it('portal account_publisher should be able to perform analysis', () => {
      portalSelf.user.role = 'account_publisher';

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.true;
    });

    bdd.it('portal custom role with full privileges should be able to perform analysis', () => {
      portalSelf.user.role = 'custom';
      portalSelf.user.privileges = [
        'portal:user:createItem',
        'portal:publisher:publishFeatures',
        'premium:user:spatialanalysis'
      ];

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      role.setPrivileges(portalSelf.user.privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.true;
    });

    bdd.it('portal custom role without createItem privileges should not be able to perform analysis', () => {
      portalSelf.user.role = 'custom';
      portalSelf.user.privileges = [
        'portal:publisher:publishFeatures',
        'premium:user:spatialanalysis'
      ];

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      role.setPrivileges(portalSelf.user.privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.false;
    });

    bdd.it('portal custom role without publishFeatures privileges should not be able to perform analysis', () => {
      portalSelf.user.role = 'custom';
      portalSelf.user.privileges = [
        'portal:user:createItem',
        'premium:user:spatialanalysis'
      ];

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      role.setPrivileges(portalSelf.user.privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.false;
    });

    bdd.it('portal custom role without spatialanalysis privileges should not be able to perform analysis', () => {
      portalSelf.user.role = 'custom';
      portalSelf.user.privileges = [
        'portal:user:createItem',
        'portal:publisher:publishFeatures'
      ];

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      role.setPrivileges(portalSelf.user.privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.false;
    });
  });

  bdd.describe('sub suite -- check role of portal without analysis service defined', () => {
    bdd.before(() => {
      portalSelf.isPortal = true;
      portalSelf.helperServices.analysis = null;
    });

    bdd.it('portal org_admin should not be able to perform analysis', () => {
      portalSelf.user.role = 'org_admin';

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.false;
    });

    bdd.it('portal account_admin should not be able to perform analysis', () => {
      portalSelf.user.role = 'account_admin';

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.false;
    });

    bdd.it('portal org_publisher should not be able to perform analysis', () => {
      portalSelf.user.role = 'org_publisher';

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.false;
    });

    bdd.it('portal account_publisher should not be able to perform analysis', () => {
      portalSelf.user.role = 'account_publisher';

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.false;
    });

    bdd.it('portal custom role with full privileges should not be able to perform analysis', () => {
      portalSelf.user.role = 'custom';
      portalSelf.user.privileges = [
        'portal:user:createItem',
        'portal:publisher:publishFeatures',
        'premium:user:spatialanalysis'
      ];

      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
      role.setPrivileges(portalSelf.user.privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.canPerformAnalysis()).to.be.false;
    });
  });

  bdd.describe('sub suite -- check network capability', () => {
    bdd.beforeEach(() => {
      portalSelf = JSON.parse(portalSelfString);
      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
    });

    bdd.it('should be able to perform network using the default settings', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['networkanalysis'])).to.be.true;
    });

    bdd.it('should not be able to perform network if has no network privilege', () => {
      let privileges = [];
      portalSelf.user.privileges.forEach((p) => {
        if (p !== 'premium:user:networkanalysis') {
          privileges.push(p);
        }
      });
      role.setPrivileges(privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['networkanalysis'])).to.be.false;
    });

    bdd.it('should not be able to perform network if no asyncClosestFacility service defined', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalSelf.helperServices.asyncClosestFacility = null;

      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['networkanalysis'])).to.be.false;
    });

    bdd.it('should not be able to perform network if no asyncServiceArea service defined', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalSelf.helperServices.asyncServiceArea = null;

      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['networkanalysis'])).to.be.false;
    });

    bdd.it('should not be able to perform network if no asyncVRP service defined', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalSelf.helperServices.asyncVRP = null;

      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['networkanalysis'])).to.be.false;
    });
  });

  bdd.describe('sub suite -- check geoenrichment capability', () => {
    bdd.beforeEach(() => {
      portalSelf = JSON.parse(portalSelfString);
      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
    });

    bdd.it('should be able to perform geoenrichment using the default settings', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['geoenrichment'])).to.be.true;
    });

    bdd.it('should not be able to perform geoenrichment if has no geoenrichment privilege', () => {
      let privileges = [];
      portalSelf.user.privileges.forEach((p) => {
        if (p !== 'premium:user:geoenrichment') {
          privileges.push(p);
        }
      });
      role.setPrivileges(privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['geoenrichment'])).to.be.false;
    });

    bdd.it('should not be able to perform geoenrichment if no geoenrichment service defined', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalSelf.helperServices.geoenrichment = null;

      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['geoenrichment'])).to.be.false;
    });
  });

  bdd.describe('sub suite -- check elevation capability', () => {
    bdd.beforeEach(() => {
      portalSelf = JSON.parse(portalSelfString);
      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
    });

    bdd.it('should be able to perform elevation using the default settings', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['elevation'])).to.be.true;
    });

    bdd.it('should not be able to perform elevation if has no elevation privilege', () => {
      let privileges = [];
      portalSelf.user.privileges.forEach((p) => {
        if (p !== 'premium:user:elevation') {
          privileges.push(p);
        }
      });
      role.setPrivileges(privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['elevation'])).to.be.false;
    });

    bdd.it('should not be able to perform elevation if no elevation service defined', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalSelf.helperServices.elevation = null;

      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['elevation'])).to.be.false;
    });
  });

  bdd.describe('sub suite -- check drivetimearea capability', () => {
    bdd.beforeEach(() => {
      portalSelf = JSON.parse(portalSelfString);
      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
    });

    bdd.it('should be able to perform drivetimearea using the default settings', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['drivetimearea'])).to.be.true;
    });

    bdd.it('should not be able to perform drivetimearea if has no network privilege', () => {
      let privileges = [];
      portalSelf.user.privileges.forEach((p) => {
        if (p !== 'premium:user:networkanalysis') {
          privileges.push(p);
        }
      });
      role.setPrivileges(privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['drivetimearea'])).to.be.false;
    });

    bdd.it('should not be able to perform drivetimearea if no routingUtilities service defined', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalSelf.helperServices.routingUtilities = null;

      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['drivetimearea'])).to.be.false;
    });

    bdd.it('should not be able to perform drivetimearea if no asyncServiceArea service defined', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalSelf.helperServices.asyncServiceArea = null;

      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['drivetimearea'])).to.be.false;
    });
  });

  bdd.describe('sub suite -- check planroutes capability', () => {
    bdd.beforeEach(() => {
      portalSelf = JSON.parse(portalSelfString);
      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
    });

    bdd.it('should be able to perform planroutes using the default settings', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['planroutes'])).to.be.true;
    });

    bdd.it('should not be able to perform planroutes if has no network privilege', () => {
      let privileges = [];
      portalSelf.user.privileges.forEach((p) => {
        if (p !== 'premium:user:networkanalysis') {
          privileges.push(p);
        }
      });
      role.setPrivileges(privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['planroutes'])).to.be.false;
    });

    bdd.it('should not be able to perform planroutes if no routingUtilities service defined', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalSelf.helperServices.routingUtilities = null;

      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['planroutes'])).to.be.false;
    });

    bdd.it('should not be able to perform planroutes if no asyncVRP service defined', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalSelf.helperServices.asyncVRP = null;

      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['planroutes'])).to.be.false;
    });
  });

  bdd.describe('sub suite -- check od capability', () => {
    bdd.beforeEach(() => {
      portalSelf = JSON.parse(portalSelfString);
      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
    });

    bdd.it('should be able to perform od using the default settings', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['od'])).to.be.true;
    });

    bdd.it('should not be able to perform od if has no network privilege', () => {
      let privileges = [];
      portalSelf.user.privileges.forEach((p) => {
        if (p !== 'premium:user:networkanalysis') {
          privileges.push(p);
        }
      });
      role.setPrivileges(privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['od'])).to.be.false;
    });

    bdd.it('should not be able to perform od if no routingUtilities service defined', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalSelf.helperServices.routingUtilities = null;

      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['od'])).to.be.false;
    });

    bdd.it('should not be able to perform od if no asyncRoute service defined', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalSelf.helperServices.asyncRoute = null;

      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['od'])).to.be.false;
    });
  });

  bdd.describe('sub suite -- check combined capabilities', () => {
    bdd.beforeEach(() => {
      portalSelf = JSON.parse(portalSelfString);
      role = new Role({
        id: (portalSelf.user.roleId) ? portalSelf.user.roleId : portalSelf.user.role,
        role: portalSelf.user.role
      });
    });

    bdd.it('should be able to perform tool requries network and geoenrichment using the default settings', () => {
      role.setPrivileges(portalSelf.user.privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['networkanalysis', 'geoenrichment'])).to.be.true;
    });

    bdd.it('should not be able to perform tool requries network and geoenrichment if has no network privilege', () => {
      let privileges = [];
      portalSelf.user.privileges.forEach((p) => {
        if (p !== 'premium:user:networkanalysis') {
          privileges.push(p);
        }
      });
      role.setPrivileges(privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['networkanalysis', 'geoenrichment'])).to.be.false;
    });

    bdd.it('should not be able to perform tool requries network and geoenrichment if has no geoenrichment privilege', () => {
      let privileges = [];
      portalSelf.user.privileges.forEach((p) => {
        if (p !== 'premium:user:geoenrichment') {
          privileges.push(p);
        }
      });
      role.setPrivileges(privileges);
      portalAnalysis = new PortalAnalysis(role, portalSelf);

      expect(portalAnalysis.hasPrivileges(['networkanalysis', 'geoenrichment'])).to.be.false;
    });
  });
});
