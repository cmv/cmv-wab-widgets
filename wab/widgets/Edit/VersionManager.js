define(['jimu/shared/BaseVersionManager'],
function(BaseVersionManager) {

  function VersionManager(){
    this.versions = [{
      version: '1.0',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    }, {
      version: '1.1',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    }, {
      version: '1.2',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    }, {
      version: '1.3',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    }, {
      version: '1.4',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    }, {
      version: '2.0Beta',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    }, {
      version: '2.0',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    }, {
      version: '2.0.1',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    }, {
      version: '2.1',
      upgrader: function(oldConfig){
        var newConfig = oldConfig;
        newConfig.snappingTolerance = 15;
        newConfig.popupTolerance = 5;
        newConfig.stickyMoveTolerance = 0;
        return newConfig;
      }
    }];
  }

  VersionManager.prototype = new BaseVersionManager();
  VersionManager.prototype.constructor = VersionManager;
  return VersionManager;
});
