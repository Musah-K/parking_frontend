import { gql } from "@apollo/client";

export const ALLPAYMENTS = gql`
    query GetAllPayments {
        getAllPayments {
            _id
            amount
            createdAt
            user
        }
}
`