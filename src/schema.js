const { gql } = require('apollo-server')
const { Note, Upcoming } = require('./database')
var cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'xxxxx',
    api_key: 'xxxxx',
    api_secret: 'xxxxx'
});

const typeDefs = gql
`type Query {
    getNote(id: ID!): Note
    getNotes: [Note]
    getNoteByTitle(title: String!): [Note]
    getNoteByTags(tags: [Topics!]!): [Note]
    getNoteByDate(date: String!): [Note]
    getUpcoming: [Upcoming]
  }

  enum VideoCategory {
    LIVE_RECORD
    YOUTUBE
    DEVICE
  }

  enum Topics {
    Games
    History
    Education
    Literature
    Sports
    News
  }

  type Note {
    id:ID!
    title: String!
    date: String!
    url: String!
    content: String!
    video: VideoCategory!
    reminder: String!
    Image: String
    tags: [Topics!]!
  }

  type Upcoming {
    id:ID!
    title: String!
    date: String!
    url: String!
    content: String!
    video: VideoCategory!
    reminder: String!
    Image: String
    tags: [Topics!]!
  }

  type Mutation {
      addNote(title: String!, date: String!, url: String!, content: String!, video:VideoCategory!, reminder:String!, Image:String, tags: [Topics!]!): Note!,
      deleteNote(id: ID!): String,
      addImage(id: ID!, Image: String!): String,
      updateNote(id: ID!, title: String, date: String, url: String, content: String, video:VideoCategory, reminder:String, Image:String, tags: [Topics!]): String
  }`

const resolvers = {
    Query: {
        getNotes: () => Note.find(),
        getUpcoming: () => Upcoming.find(),
        getNote: async (_, { id }) => {
            var result = await Note.findById(id);
            return result;
        },
        getNoteByTitle: async (_, { title }) => {
            allNotes = await Note.find();
            var notes = allNotes.filter(b => b.title == title);
            return notes;
        },
        getNoteByTags: async (_, { tags }) => {
            allNotes = await Note.find();
            var notes = allNotes.filter((item) => {return (item.tags.indexOf(tags) >= 0); 
            })
            
            return notes;
        },
        getNoteByDate: async (_, { date }) => {
            allNotes = await Note.find();
            var notes = allNotes.filter(b => b.date == date);
            return notes;
        }
    },

    Mutation: {
        addNote: async (_, { title, date, url, content, video, reminder, Image, tags }) => {
            const note = new Note({ title, date, url, content, video, reminder, Image, tags });
            await note.save();
            const imagePath = Image;
            if (imagePath !== null) {
                cloudinary.uploader.upload(imagePath, { tags: 'note taking app', public_id: title + Image });
            };
            return note;
        },
        deleteNote: async (_, { id }) => {
            await Note.findByIdAndRemove(id);
            return "Note deleted";
        },
        addImage: async (_, { id, Image }) => {
            await Note.findByIdAndUpdate(id, { Image: Image });
            cloudinary.uploader.upload(Image, { tags: 'note taking app', public_id: id + Image });
            return "Added Image";
        },
        updateNote: async (_, { id, title, date, url, content, video, reminder, Image, tags }) => {
            await Note.findByIdAndUpdate(id, { title: title, date: date, url: url, content: content, video: video, reminder: reminder, Image: Image, tags: tags });
            return "Succesfully Updated";
        }
    }
}
// Note CSV Export
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const mongodb = require("mongodb").MongoClient;

let url = "mongodb+srv://admin:P@ssw0rd@cluster0.zo5ak.mongodb.net/newnotes?retryWrites=true&w=majority"

mongodb.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) throw err;
  
        client
            .db("newnotes")
            .collection("notes")
            .find({})
            .toArray((err, data) => {
            if (err) throw err;

            const json2csvParser = new Json2csvParser({ header: true });
            const csvData = json2csvParser.parse(data);
    
            fs.writeFile("Notes_Export.csv", csvData, function(error) {
                if (error) throw error;
                console.log("Write to Notes_Export.csv successfully!");
            });
    
            client.close();
        });
    }
);


module.exports = {
    resolvers,
    typeDefs,
}