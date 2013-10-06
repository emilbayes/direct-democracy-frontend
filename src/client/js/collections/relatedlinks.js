;(function(undefined){
    'use strict';

    this.Collections.relatedLinks = Backbone.Collection.extend({
        url: Registry.ApiEndpoint + '/relatedlinks',
        model: Models.relatedLinks
    });

}).call(this);