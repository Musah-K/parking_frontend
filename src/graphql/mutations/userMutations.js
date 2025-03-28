import { gql } from "@apollo/client";

export const LoginMutation = gql`
  mutation Login($input: loginUserInput!) {
    loginUser(input: $input) {
      _id
      name
      phone
      role
      vehicle
    }
  }
`;

export const RegisterMutation = gql`
  mutation register($input: createUserInput!) {
    createUser(input: $input) {
      _id
      admin
      name
      phone
      role
      vehicle
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;

export const ADMINUPDATEUSER = gql`
  mutation AdminUpdateUser($input: adminUpdateUserInput!) {
    adminUpdateUser(input: $input) {
      _id
      name
      phone
      admin
      role
    }
  }
`;
export const ADMINCREATEUSER = gql`
  mutation AdminCreateUser($input: createUserInput!) {
    adminCreateUser(input: $input) {
      _id
      name
      phone
      vehicle
    }
  }
`;

export const UPDATEUSER = gql`
  mutation UpdateUser($id: ID!, $input: updateUserInput!) {
  updateUser(_id: $id, input: $input) {
    _id
    name
    phone
    vehicle
  }
}
`
