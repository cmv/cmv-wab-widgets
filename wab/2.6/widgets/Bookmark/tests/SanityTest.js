define([
  'intern/chai!assert',
  'intern!bdd',
  'dojo/_base/html',
  'dojo/promise/all',
  'dojo/query',
  'dojo/on',
  'testjimu/WidgetManager',
  'testjimu/globals',
  'intern/order!sinon'
], function (assert, bdd, html, all, query, on, TestWidgetManager, globals, sinon) {

  var widgetJson = {
    id: 'bookmark1',
    uri: 'widgets/Bookmark/Widget'
  };

  bdd.describe('web map has no bookmark', function(){
    var wm, map;
    bdd.before(function(){
      wm = TestWidgetManager.getInstance();
      map = TestWidgetManager.getDefaultMap();
      map.setExtent = function(){};
      wm.prepare('theme1', map);
    });

    bdd.beforeEach(function(){
      wm.destroyWidget('bookmark1');
    });

    bdd.it('empty config', function(){
      widgetJson.config = {
        "bookmarks2D": [],
        "bookmarks3D": [],
        "flyTime": 3000
      };
      return wm.loadWidget(widgetJson).then(function(widget){
        wm.openWidget(widget);
        assert.deepEqual(widget.bookmarks, []);
        assert.strictEqual(html.hasClass(query('.btn-delete', widget.domNode)[0], 'jimu-state-disabled'), true);
      });
    });

    bdd.describe('one bookmark, basic operations', function(){
      bdd.it('check display, click, delete', function(){
        widgetJson.config = {
          "bookmarks2D": [{
            name: 'aa',
            displayName: 'aa',//??
            extent: {
              "type": "extent",
              "xmin": -20201384.548170276,
              "ymin": -1439065.6306170467,
              "xmax": 2497355.3713897783,
              "ymax": 14215237.76218299,
              "spatialReference": {
                "wkid": 102100
              }
            }
          }],
          "bookmarks3D": [],
          "flyTime": 3000
        };
        return wm.loadWidget(widgetJson).then(function(widget){
          wm.openWidget(widget);
          assert.deepEqual(widget.bookmarks.length, 1);
          assert.strictEqual(html.hasClass(query('.btn-delete', widget.domNode)[0], 'jimu-state-disabled'), true);

          var setExtentSpy = sinon.spy(map, 'setExtent');
          widget._onBookmarkClick(widgetJson.config.bookmarks2D[0]);
          assert.strictEqual(setExtentSpy.called, true);

          assert.strictEqual(html.hasClass(query('.btn-delete', widget.domNode)[0], 'jimu-state-disabled'), false);

          widget._onDeleteBtnClicked();
          assert.deepEqual(widget.bookmarks.length, 0);
        });
      });
    });
  });
});