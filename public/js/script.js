(function() {
    new Vue({
        el: "#board",
        data: {
            //imageId: location.hash.slice,
            images: [],
            username: "",
            title: "",
            desc: "",
            file: null,
            selectedImage: location.hash.slice(1),
            oldestImageId: null,
            lowestImageId: null,
            isNotLastImage: true,
            error: "",
            created_at: ""
        },
        created: function() {},
        mounted: function() {
            var myVue = this;
            myVue.getImages();
            addEventListener("hashchange", function() {
                myVue.selectedImage = location.hash.slice(1);
            });
        },
        updated: function() {
            this.updateMoreButton();
        },
        destroyed: function() {},
        methods: {
            upload: function() {
                let myVue = this;
                const fd = new FormData();
                fd.append("image", this.file);
                fd.append("username", this.username);
                fd.append("title", this.title);
                fd.append("desc", this.desc);
                axios.post("/upload", fd).then(({ data }) => {
                    myVue.images.unshift(data);
                    this.resetForm();
                });
            },
            getImages: function() {
                axios
                    .get("/images")
                    .then(({ data }) => {
                        this.images = data;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            getMoreImages: function() {
                console.log();
                axios
                    .get(`/more-images/${this.oldestImageId}`)
                    .then(({ data }) => {
                        this.images = this.images.concat(...data);
                    })
                    .then(console.log(this.images[0].created_at))
                    .catch(err => {
                        console.log(err);
                    });
            },
            resetForm: function() {
                this.file = null;
                this.username = "";
                this.title = "";
                this.desc = "";
            },
            handleClick: function() {},
            fileSelected: function(e) {
                this.file = e.target.files[0];
            },
            closeImageModal: function(id) {
                this.selectedImage = id;
                history.replaceState(null, null, " "); //remove hash
                location.hash = "";
            },
            updateMoreButton: function() {
                if (this.images.length > 0) {
                    this.lowestImageId = this.images[
                        this.images.length - 1
                    ].lowest_id;
                    this.oldestImageId = this.images[this.images.length - 1].id;
                    if (this.oldestImageId === this.lowestImageId) {
                        this.isNotLastImage = false;
                    }
                }
            },
            modalpopup: function(id) {
                this.selectedImage = id;
            }
        }
    });

    Vue.component("first-component", {
        template: "#image-template",
        data: function() {
            return {
                count: 0,
                image: {},
                comments: [],
                username: "",
                comment: "",
                imageId: null,
                error: "",
                created_at: ""
            };
        },
        props: ["selectedImage"],
        mounted: function() {
            axios
                .get(`/images/${this.selectedImage}`)
                .then(({ data }) => {
                    this.image = data[0];
                    return axios.get(`/images/${this.selectedImage}/comments`);
                })
                .then(({ data }) => {
                    this.comments = data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        watch: {
            selectedImage: function() {
                console.log("I'm a watcher and the id just changed");
                axios
                    .get(`/images/${this.selectedImage}`)
                    .then(({ data }) => {
                        this.image = data[0];
                        return axios.get(
                            `/images/${this.selectedImage}/comments`
                        );
                    })
                    .then(({ data }) => {
                        this.comments = data;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },
        updated: function() {
            console.log("updated!");
        },
        methods: {
            closeImageModal: function() {
                this.$emit("close-image-modal");
            },
            deleteImage: function() {
                console.log("this", this.selectedImage.id);
                axios
                    .post(`/delete/${this.selectedImage}`)
                    .then(() => this.$emit("close-image-modal"));
            },
            submitComment: function() {
                let fd = {
                    username: this.username,
                    comment: this.comment,
                    imageId: this.selectedImage
                };
                axios
                    .post(`/images/${this.selectedImage}/comments`, fd)
                    .then(({ data }) => {
                        this.comments.unshift(data);
                        this.resetForm();
                    });
            },
            resetForm: function() {
                this.username = "";
                this.comment = "";
            }
        }
    });
})();
