
  cordova.define('cordova/plugin_list', function(require, exports, module) {
    module.exports = [
      {
          "id": "cordova-plugin-inappbrowser.inappbrowser",
          "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
          "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
          "cordova.InAppBrowser.open"
        ]
        },
      {
          "id": "cordova-plugin-safariviewcontroller.SafariViewController",
          "file": "plugins/cordova-plugin-safariviewcontroller/www/SafariViewController.js",
          "pluginId": "cordova-plugin-safariviewcontroller",
        "clobbers": [
          "SafariViewController"
        ]
        }
    ];
    module.exports.metadata =
    // TOP OF METADATA
    {
      "cordova-plugin-inappbrowser": "5.0.0",
      "cordova-plugin-safariviewcontroller": "2.0.0"
    };
    // BOTTOM OF METADATA
    });
    