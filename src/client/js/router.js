;(function(undefined){
    'use strict';

    var changePage = function(PageClass) {
        var p = new PageClass({ 
            el: $('main').first(),
            model: new Models.Test() 
        })
        .render();
    };

    this.AppRouter = Backbone.Router.extend({
        routes: {
            '':                 'indexAction',
            'issue/:id':       'issueAction'
        },

        indexAction: function() {
            alert('splat');
        },

        issueAction: function(id) {
            var m = new Models.Issue({id: id});
            var p = new Views.Issue({
                el: $('main').first(),
                model: m
            });

            m.fetch();
            p.render();
        }
    });

}).call(this);