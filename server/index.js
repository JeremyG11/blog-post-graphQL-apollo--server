import dotenv from "dotenv";
dotenv.config();
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import { typeDefs } from "../server/graphQL/typeDefs.js";
import { resolvers } from "../server/graphQL/resolvers.js";
import context from "./graphQL/context.js";
const port = process.env.PORT || 6767;

// conenct with mongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/blog_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoBD connected successfully!");
  })
  .catch((err) => {
    console.log(err);
  });
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

await startStandaloneServer(server, {
  listen: { port: port },
  context: context,
})
  .then(({ url }) => console.log(`Server ready on ${url}`))
  .catch((error) => console.log(error));
