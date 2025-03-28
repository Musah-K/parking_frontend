import { gql } from "@apollo/client";

 export const Authenticate = gql`
 query GetAuthenticatedUser{
    authUser {
        _id
        admin
        role
        name
        phone
        vehicle
  }
 }
`

export const ALLUSERS = gql`
    query AllUsers {
        allUsers {
            _id
            name
            admin
            role
            vehicle
            phone
        }
}
`