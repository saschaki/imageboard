(function() {
    new Vue({
        el: "#main",
        data: {
            images: []
        },
        created: function() {
            console.log("created!");
        },
        mounted: function() {
            console.log("mounted!");

            axios.get("/images").then(
                function(resp) {
                    this.images = resp.data;
                }.bind(this)
            );
        },
        updated: function() {
            console.log("updated!");
        },
        methods: {}
    });
})();
