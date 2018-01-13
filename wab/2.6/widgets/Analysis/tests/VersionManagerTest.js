define(["require", "exports", 'intern!bdd', 'intern/chai!expect', 'widgets/Analysis/VersionManager'], function (require, exports, bdd, expect, VersionManager) {
    "use strict";
    var versionManager;
    var oldConfig = {
        analysisTools: [
            { name: 'AggregatePoints' },
            { name: 'ExtractData' },
            { name: 'PlanRoutes' }
        ]
    };
    bdd.describe('Analysis versionManager test', function () {
        bdd.before(function () {
            versionManager = new VersionManager();
        });
        bdd.it('should upgrade correctly from 1.2 to 1.3', function () {
            var item, newConfig = versionManager.upgrade(oldConfig, '1.2', '1.3');
            expect(newConfig.analysisTools.length).to.equal(oldConfig.analysisTools.length);
            item = newConfig.analysisTools[1];
            expect(item.name).to.equal('ExtractData');
            expect(item.showHelp).to.be.true;
            expect(item.showCredits).to.be.true;
            expect(item.showChooseExtent).to.be.true;
            expect(item.showReadyToUseLayers).to.be.true;
        });
    });
});
