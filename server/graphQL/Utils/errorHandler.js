import { GraphQLError } from "graphql";

export const throwCustomGraphQLError = (errorMessage, errorType) => {
  //  throw new GraphQL error with message and status code
  throw new GraphQLError(errorMessage, {
    extensions: {
      code: errorType.errorCode,
      http: {
        status: errorType.errorStatus,
      },
    },
  });
};
