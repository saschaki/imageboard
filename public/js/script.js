(function() {
    new Vue({
        el: "#main",
        data: {
            username: "",
            description: "",
            title: "",
            images: [],
            file: null,
            error: false
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
        methods: {
            upload: function() {
                console.log("uploading...");
                var fd = new FormData();
                fd.append("image", this.file);
                fd.append("username", this.username);
                fd.append("title", this.title);
                fd.append("description", this.description);
                var vue = this;
                axios
                    .post("/upload", fd)
                    .then(function(res) {
                        //unshift the new image into the array
                        vue.images.us;
                        //with arrow function this.images
                        this.file = res.data.file;
                        this.username = res.data.username;
                        this.title = res.data.title;
                        //this.desc = res.data.desc;
                        this.description = res.data.description;
                    })
                    .catch(() => (this.error = true));
            },
            fileSelected: function(e) {
                this.file = e.target.files[0];
            }
        }
    });
})();
