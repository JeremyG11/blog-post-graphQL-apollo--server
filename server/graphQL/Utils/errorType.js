import { ApolloServerErrorCode } from "@apollo/server/errors";

export const ErrorTypes = {
  BAD_USER_INPUT: {
    errorCode: ApolloServerErrorCode.BAD_USER_INPUT,
    errorStatus: 400,
  },
  BAD_REQUEST: {
    errorCode: ApolloServerErrorCode.BAD_REQUEST,
    errorStatus: 400,
  },
  NOT_FOUND: {
    errorCode: "NOT_FOUND",
    errorStatus: 404,
  },
  UNAUTHENTICATED: {
    errorCode: "UNAUTHENTICATED",
    errorStatus: 401,
  },
  UNAUTHORIZED: {
    errorCode: "UNAUTHORIZED",
    errorStatus: 403,
  },
  ALREADY_EXISTS: {
    errorCode: "ALREADY_EXISTS",
    errorStatus: 400,
  },

  EXPIRED_JWT_TOKEN: {
    errorCode: "EXPIRED_JWT_TOKEN",
    errorStatus: 401,
  },
  INVALID_JWT_TOKEN: {
    errorCode: "INVALID_JWT_TOKEN",
    errorStatus: 401,
  },
  INTERNAL_SERVER_ERROR: {
    errorCode: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
    errorStatus: 500,
  },
};
