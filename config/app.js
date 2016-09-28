(function () {
    var path = location.pathname.replace(/[^\/]+$/, '');
    window.dojoConfig = {
        locale: 'en-us',
        async: true,
        packages: [{
            name: 'viewer',
            location: path + 'cmv/js/viewer'
        }, {
            name: 'gis',
            location: path + 'cmv/js/gis'
        }, {
            name: 'widgets',
            location: path + 'widgets'
        }, {
            name: 'put-selector',
            main: 'put',
            location: 'https://cdn.rawgit.com/kriszyp/put-selector/v0.3.6'
        }, {
            name: 'xstyle',
            main: 'css',
            location: 'https://cdn.rawgit.com/kriszyp/xstyle/v0.3.2'
        /* customizations for WAB widgets */
        }, {
            name: 'jimu',
            location: path + 'wab/jimu.js'
        }, {
            name: 'libs',
            location: path + 'wab/libs'
        }, {
            name: 'wabwidgets',
            location: path + 'wab/widgets'
        /* end customizations for WAB widgets */
        }, {
            name: 'config',
            location: path + 'config'
        }]
    };

    require(window.dojoConfig, [
        'dojo/_base/declare',

        // minimal Base Controller
        'viewer/_ControllerBase',

        // *** Controller Mixins
        // Use the core mixins, add custom mixins
        // or replace core mixins with your own
        'viewer/_ConfigMixin', // manage the Configuration
        'viewer/_LayoutMixin', // build and manage the Page Layout and User Interface
        'viewer/_MapMixin', // build and manage the Map
        'viewer/_WidgetsMixin', // build and manage the Widgets

        'viewer/_WABMixin' // cusom mix-in to use WAB widgets

    ], function (
        declare,

        _ControllerBase,
        _ConfigMixin,
        _LayoutMixin,
        _MapMixin,
        _WidgetsMixin,

        _WABMixin

    ) {
        var controller = new (declare([
            _ControllerBase,
            _ConfigMixin,
            _LayoutMixin,
            _MapMixin,
            _WidgetsMixin,
            _WABMixin
        ]))();
        controller.startup();
    });
})();