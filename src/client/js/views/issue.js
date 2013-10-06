;(function(undefined){
    'use strict';

    this.Views.Issue = Backbone.View.extend({
        template: Templates['issue-page'],

        initialize: function() {
            this.listenTo(this.model, 'change', this.render.bind(this));
        },
    
        render: function() {
            this.$el.html(
                this.template.render(this.model.toJSON(), {
                    'comment-partial': Templates['comment-partial']
                })
            );
    
            return this.trigger('render');
        }
    });

}).call(this);