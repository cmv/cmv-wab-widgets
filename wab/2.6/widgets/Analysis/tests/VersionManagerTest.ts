import bdd = require('intern!bdd');
import expect = require('intern/chai!expect');
import VersionManager = require('widgets/Analysis/VersionManager');

let versionManager: VersionManager;
let oldConfig = {
  analysisTools: [
    {name: 'AggregatePoints'},
    {name: 'ExtractData'},
    {name: 'PlanRoutes'}
  ]
};

bdd.describe('Analysis versionManager test', () => {
  bdd.before(() => {
    versionManager = new VersionManager();
  });

  bdd.it('should upgrade correctly from 1.2 to 1.3', () => {
    let item, newConfig = versionManager.upgrade(oldConfig, '1.2', '1.3');

    expect(newConfig.analysisTools.length).to.equal(oldConfig.analysisTools.length);
    item = newConfig.analysisTools[1];

    expect(item.name).to.equal('ExtractData');
    expect(item.showHelp).to.be.true;
    expect(item.showCredits).to.be.true;
    expect(item.showChooseExtent).to.be.true;
    expect(item.showReadyToUseLayers).to.be.true;
  });
});
