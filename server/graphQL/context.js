import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ErrorTypes } from "./Utils/errorType.js";
import { throwCustomGraphQLError } from "./Utils/errorHandler.js";

const getUser = async (token) => {
  try {
    if (token) {
      const decodedToken = jwt.verify(token, process.env.SECRET_JWT);
      const expTimestamp = decodedToken.exp;
      const currTimestamp = Math.floor(Date.now() / 1000);

      if (currTimestamp >= expTimestamp) {
        throwCustomGraphQLError(
          "Token expire! Please login to your account",
          ErrorTypes.EXPIRED_JWT_TOKEN
        );
      } else if (!decodedToken) {
      }
      const user = await User.findById(decodedToken.id).select(
        "id username email role"
      );
      if (!user) {
        throwCustomGraphQLError("User not found", ErrorTypes.NOT_FOUND);
      }
      return user;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    if (err instanceof jwt.TokenExpiredError) {
      throwCustomGraphQLError(
        "Token has expired",
        ErrorTypes.EXPIRED_JWT_TOKEN
      );
    } else if (err instanceof jwt.JsonWebTokenError) {
      throwCustomGraphQLError("Invalid token", ErrorTypes.INVALID_JWT_TOKEN);
    } else {
      throwCustomGraphQLError("JWT error", ErrorTypes.INTERNAL_SERVER_ERROR);
    }
  }
};

const context = async ({ req }) => {
  // get the user token from the headers
  const token = req.headers.authorization || "";

  // try to retrieve a user with the token
  const user = await getUser(token);
  // console.log(token, user);
  // optionally block the user
  // we could also check user roles/permissions here
  if (user) {
    return { user };
  }
  // throwing a `GraphQLError` here allows us to specify an HTTP status code,
  // standard `Error`s will have a 500 status code by default
  // throw new GraphQLError("User is not authenticated", {
  //   extensions: {
  //     code: "UNAUTHENTICATED",
  //     http: { status: 401 },
  //   },

  // });

  // add the user to the context
  return {};
};

export default context;
