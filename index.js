const { ApolloServer } = require('apollo-server');
const { resolvers, typeDefs } = require('./src/schema')

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:P@ssw0rd@cluster0.zo5ak.mongodb.net/newnotes?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('useFindAndModify', false);


mongoose.connection.once("open", function () {
    const port = process.env.PORT || 9000
    new ApolloServer({ resolvers, typeDefs }).listen({ port }, () =>
        console.log(`Server ready at: http://localhost:${port}`),
    )
});
