export const typeDefs = `#graphql
    type Query{
        blogs:[Blog]
        blog(id:ID!):Blog
        getUsers:[User]
        getUser(id:ID!):User
        fetchUserByToken(token:String!):User
        comments:[Comment]
        login(username: String!, password: String!): String

    }
    type Blog{
        id:ID!
        title:String!
        author:[User!]
        content:String
        comments:[Comment]
        likes:Int
    }
    type Comment{
        id:ID!
        author:String!
        text:String!
         
    }

    type User{
        id: ID!
        username: String!
        email:String!
        password: String!
        role: String
        likedPosts:[String]
    }

    input UserInput {
        username: String!
        email:String!
        password:String!
        role:String
    }


    type Mutation {
        updateBlog(id: ID!, title: String!, content: String!, author:UserInput, likes: [String!]): Blog
        postBlog(title: String!, content: String!, author:UserInput likes: [String!]): Blog
        deleteBlog(id: ID!): Boolean!
        
        #USER
        signUpUser(username: String!, email: String!, password: String!, role: String): User

    } 

   
 
`;
