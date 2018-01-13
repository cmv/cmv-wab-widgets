define(["require", "exports", 'intern!bdd', 'intern/chai!expect', 'widgets/Analysis/toolSettings'], function (require, exports, bdd, expect, toolSettings) {
    "use strict";
    var rows;
    bdd.describe('Analysis toolSettings test', function () {
        bdd.before(function () {
            rows = toolSettings.getAllSettings();
        });
        bdd.it('should find every tools\' name and config', function () {
            expect(rows).to.have.length.above(0);
            rows.forEach(function (row) {
                var name = row.name;
                expect(name).to.not.be.null;
                var setting = toolSettings.findToolSetting(name);
                expect(setting).to.not.be.null;
                expect(setting).to.deep.equal(row);
            });
        });
    });
});
