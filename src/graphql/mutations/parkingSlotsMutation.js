import { gql } from "@apollo/client";

export const UpdateExpired = gql`
  mutation updateExpired {
    removeExpiredSlots {
      acknowledged
      matchedCount
      modifiedCount
    }
  }
`;
export const EMPLOYEERESERVESPORT = gql`
  mutation UpdateParkingSlot($id: ID!, $input: updateParkingSlotInput!) {
    updateParkingSlot(_id: $id, input: $input) {
      _id
      slotNumber
      isAvailable
      mpesa
      validFrom
      validTill
    }
  }
`
