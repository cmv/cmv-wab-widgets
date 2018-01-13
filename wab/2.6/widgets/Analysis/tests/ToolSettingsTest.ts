/**
 * Created by wangjian on 16/3/18.
 */
import bdd = require('intern!bdd');
import expect = require('intern/chai!expect');
import toolSettings = require('widgets/Analysis/toolSettings');

let rows: Analysis.ToolSetting[];

bdd.describe('Analysis toolSettings test', () => {
  bdd.before(() => {
    rows = toolSettings.getAllSettings();
  });

  bdd.it('should find every tools\' name and config', () => {
    expect(rows).to.have.length.above(0);

    rows.forEach((row: Analysis.ToolSetting) => {
      let name = row.name;
      expect(name).to.not.be.null;

      let setting: Analysis.ToolSetting = toolSettings.findToolSetting(name);
      expect(setting).to.not.be.null;
      expect(setting).to.deep.equal(row);
    });
  });
});
