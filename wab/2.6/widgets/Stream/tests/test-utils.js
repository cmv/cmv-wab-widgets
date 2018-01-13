define([
  'intern!object',
  'intern/chai!assert',
  'widgets/Stream/setting/utils'
], function(registerSuite, assert, utils) {
  registerSuite(function(){
    return {
      name: 'Stream widget utils test',

      'test getStreamLayerName': function(){
        var url = 'http://ec2-75-101-155-202.compute-1.amazonaws.com' +
            ':6080/arcgis/rest/services/Flights/StreamServer';
        assert.strictEqual(
          utils.getStreamLayerName(url),
          'Flights', 'Error getStreamLayerName');
      }
    };
  });
});
