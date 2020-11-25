const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:P@ssw0rd@cluster0.zo5ak.mongodb.net/newnotes?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var mongooseConnect = mongoose.connection;

mongoose.set('useFindAndModify', false);

const Note = mongoose.model("Note", {
    title: String,
    date: String,
    url: String,
    content: String,
    video: String,
    reminder: String,
    Image: String,
    tags: [{type: String}]
});

const Upcoming = mongoose.model("Upcoming", {
    title: String,
    date: String,
    url: String,
    content: String,
    video: String,
    reminder: String,
    Image: String,
    tags: [{type: String}]
});

module.exports = {
    Note,
    Upcoming,
}