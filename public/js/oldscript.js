(function() {
    new Vue({
        el: "#main",
        data: {
            title: "My Vue Journey of Self-Discovery",
            color: "red",
            className: "funky",
            chicken: "Jody",
            famousChickens: []
        },
        created: function() {
            console.log("created!");
        },
        mounted: function() {
            console.log("mounted!");
            //var myVue = this;
            axios.get("/chickens").then(
                function(resp) {
                    this.famousChickens = resp.data;
                }.bind(this)
            );
        },
        updated: function() {
            console.log("updated!");
        },
        methods: {
            handleClick: function() {
                this.logChicken();
            },
            logChicken: function() {
                console.log(this.chicken);
            }
        }
    });
})();

/*axios.get("/chickens").then(function({resp})=> {
this.famousChickens = resp.data);*/
