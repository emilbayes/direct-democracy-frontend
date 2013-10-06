;(function(undefined){
    'use strict';

    this.Models.Issue = Backbone.Model.extend({
        urlRoot: Registry.ApiEndpoint + '/issues',
    });

}).call(this);