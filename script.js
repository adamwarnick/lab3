Vue.component('star-rating', VueStarRating.default);
let app = new Vue({
    el: '#app',
    data: {
        number: '',
        max: '',
        current: {
            title: '',
            img: '',
            alt: ''
        },
        loading: true,
        addedName: '',
        addedComment: '',
        comments: {},
        date: '',
        rating: 0,
        ratings: {},
    },
    created() {
        this.xkcd();
    },
    computed: {
        avgstar: {
            get() {
                if (!(this.number in this.ratings)) {
                    return 0;
                }
                var average = this.ratings[this.number].sum /this.ratings[this.number].total;
                return average;
            },
            set(value) {
                console.log("Set " + value);
            }
        }
    },
    watch: {
        number(value, oldvalue) {
            if (oldvalue === '') {
                this.max = value;
            }
            else {
                this.xkcd();
            }
        },
    },
    methods: {
        setRating: function(rating) {
            this.rating = rating;
        },
        xkcd() {
            this.loading = true;
            axios.get('https://xkcdapi.now.sh/' + this.number)
                .then(response => {
                    this.current = response.data;
                    this.number = response.data.num;
                    this.loading = false;
                    console.log(this.number)
                    return true;
                })
                .catch(error => {
                    console.log(error)
                    this.number = this.max;
                });
        },
        getRandom(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive
        },
        randomComic() {
            this.number = this.getRandom(1, this.max);
        },
        previousComic() {
            this.number = this.current.num - 1;
            if (this.number < 1)
                this.number = 1;
        },
        firstComic() {
            this.number = 1;
        },
        lastComic() {
            this.number = this.max;
        },
        nextComic() {
            this.number = this.current.num + 1;
            if (this.number > this.max)
                this.number = this.max
        },
        addComment() {
            if (!(this.number in this.comments))
                Vue.set(app.comments, this.number, new Array);
            var today = new Date();
            this.comments[this.number].push({
                author: this.addedName,
                text: this.addedComment,
                date: moment().format('MM/DD/YYYY'),
            });
            this.addedName = '';
            this.addedComment = '';
        },
        setRating (rating) {
            console.log(this.ratings);
            if(!(this.number in this.ratings))
                Vue.set(this.ratings,this.number, {
                    sum: 0,
                    total: 0
                });
                this.ratings[this.number].sum += rating;
                this.ratings[this.number].total += 1;
        }
    }
});
