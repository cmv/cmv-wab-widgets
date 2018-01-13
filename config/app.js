(function () {
    var path = location.pathname.replace(/[^\/]+$/, '');

    // make it easier to update the demo. optional
    var versions = {
        cmv: 'v2.0.0-beta.2',
        wab: '2.6'
    };

    window.dojoConfig = {
        locale: 'en-us',
        async: true,
        packages: [{
            name: 'viewer',
            location: 'https://cdn.rawgit.com/cmv/cmv-app/' + versions.cmv + '/viewer/js/viewer'
        }, {
            name: 'gis',
            location: 'https://cdn.rawgit.com/cmv/cmv-app/' + versions.cmv + '/viewer/js/gis'
        }, {
            name: 'proj4js',
            location: '//cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.15'
        }, {
            name: 'flag-icon-css',
            location: '//cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.8.0'
        }, {
            name: 'widgets',
            location: path + 'widgets'
        /* customizations for WAB widgets */
        }, {
            name: 'jimu',
            location: path + 'wab/' + versions.wab + '/jimu.js'
        }, {
            name: 'libs',
            location: path + 'wab/' + versions.wab + '/libs'
        }, {
            name: 'wabwidgets',
            location: path + 'wab/' + versions.wab + '/widgets'
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
        'viewer/_SidebarMixin', // for mobile sidebar

        'config/_WABMixin', // cusom mix-in to use WAB widgets

        // needed by some wab widgets like Print
        'libs/caja-html-sanitizer-minified',

        // needed by some wab widgets like Bookmarks (WAB v 2.6)
        'libs/Sortable',

        // needed by some wab widgets like Chart (WAB v 2.6)
        'libs/moment/twix',

        // jimu stylesheet needed for WAB widgets
        'xstyle/css!jimu/css/jimu-theme.css',

        // needed so that jimu styles play nice with cmv
        'xstyle/css!./css/cmv-jimu.css',
        // some css tweaks for WAB widgets (optional)
        'xstyle/css!./css/cmv-wab.css'

    ], function (
        declare,

        _ControllerBase,
        _ConfigMixin,
        _LayoutMixin,
        _MapMixin,
        _WidgetsMixin,
        _SidebarMixin,

        _WABMixin

    ) {
        var App = declare([
            // Mixin for Mobile Sidebar
            _SidebarMixin,

            _LayoutMixin,
            _WidgetsMixin,
            _MapMixin,

            _WABMixin,

            _ConfigMixin,

            _ControllerBase

        ]);
        var app = new App();
        app.startup();
    });
})();