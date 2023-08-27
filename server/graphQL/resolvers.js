import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { ErrorTypes } from "./Utils/errorType.js";
import { throwCustomGraphQLError } from "./Utils/errorHandler.js";
import Blog from "../models/Blog.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

export const resolvers = {
  Query: {
    blogs: async () => {
      return await Blog.find({});
    },
    getUsers: async () => {
      return await User.find({});
    },
    getUser: async (_, args) => {
      try {
        const { id } = args;
        console.log(id);
        const user = await User.findById(id);

        if (!user) {
          throw new Error("User not found");
        }

        return user;
      } catch (error) {
        console.error("Error while querying user:", error);
        throw new Error("Failed to fetch user");
      }
    },
    // Login User
    login: async (_, args) => {
      try {
        const { username, password } = args;
        const user = await User.findOne({ username });
        if (user && argon2.verify(user.password, password)) {
          const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username },
            process.env.SECRET_JWT,
            { expiresIn: "5d" }
          );

          return token;
        }
      } catch (err) {
        console.error("Error during login:", err);
        throwCustomGraphQLError(err.message, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },
  },

  Mutation: {
    // user
    signUpUser: async (parent, args) => {
      try {
        const { username, email, password, role } = args;
        if (!username || !email || !password) {
          throwCustomGraphQLError(
            "Please add all the required fields",
            ErrorTypes.BAD_REQUEST
          );
        }
        const userXist = await User.findOne({ username });
        if (userXist) {
          throwCustomGraphQLError(
            "User with that username already exist.",
            ErrorTypes.ALREADY_EXISTS
          );
        }
        const hashedPassword = await argon2.hash(password);
        console.log(
          User.schema.path("role").enumValues.includes(role),
          role,
          args
        );
        const userRole = User.schema.path("role").enumValues.includes(role)
          ? role
          : "reader";

        const user = await User.create({
          username,
          email,
          password: hashedPassword,
          role: userRole,
        });

        return user;
      } catch (err) {
        console.log(err);
        throwCustomGraphQLError(err.message, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },
    // blogs
    postBlog: async (_, args, contextValue) => {
      try {
        const { title, content } = args;
        const { user } = contextValue;
        console.log(user);

        if (!user) {
          throwCustomGraphQLError(
            "User is not authenticated.",
            ErrorTypes.UNAUTHENTICATED
          );
        }
        const blog = await Blog.create({
          title,
          content,
          author: user.id,
        });
        return blog;
      } catch (err) {
        console.log(err);
        throwCustomGraphQLError(err.message, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },

    // Update Single blog
    updateBlog: async (_, args, contextValue) => {
      try {
        const { id } = args;
        const { user } = contextValue;
        const blog = await Blog.findById(id);

        if (user.role !== "admin" || user.id !== blog.author._id) {
          throwCustomGraphQLError(
            "You don't a permission to update this blog",
            ErrorTypes.UNAUTHORIZED
          );
        }
        const updatedBlog = await Blog.findByIdAndUpdate(
          blog.id,
          {
            ...args,
          },
          { new: true }
        );
        if (!updatedBlog) {
          throwCustomGraphQLError(
            "Couldn't update blog",
            ErrorTypes.INTERNAL_SERVER_ERROR
          );
        }
        return updatedBlog;
      } catch (err) {
        console.log(err);
        throwCustomGraphQLError(err.message, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },
    // Delete blog
    deleteBlog: async (_, args, contextValue) => {
      try {
        const { id } = args;
        const { user } = contextValue;
        const blog = await Blog.findById(id);

        if (user.role !== "admin" || user.id !== blog.author._id) {
          throwCustomGraphQLError(
            "You don't a permission to delete this blog",
            ErrorTypes.UNAUTHORIZED
          );
        }
        const deletedBlog = await Blog.findByIdAndDelete(blog.id);
        if (!deletedBlog) {
          throwCustomGraphQLError(
            "Couldn't delete the blog. Something went wrong",
            ErrorTypes.INTERNAL_SERVER_ERROR
          );
        }
        return deletedBlog;
      } catch (err) {
        throwCustomGraphQLError(err.message, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },
  },
};
