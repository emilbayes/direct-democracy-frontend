;(function(undefined){
    'use strict';

    this.Collections.Issues = Backbone.Collection.extend({
        url: Registry.ApiEndpoint + '/issues',
        model: Models.Issue
    });

}).call(this);