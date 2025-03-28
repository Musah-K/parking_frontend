import { gql } from "@apollo/client";

export const AvailableSlots = gql`
  query GetavailableSlots($availabe: Boolean!) {
    availableSlots(available: $available) {
      _id
      slotNumber
      isAvailable
    }
  }
`;
export const UserSlots = gql`
  query slots {
    userSlots {
      _id
      slotNumber
      validFrom
      validTill
      paymentId
    }
  }
`;

export const PARKINGSLOTS = gql`
  query AllParkingSlots {
    allParkingSlots {
      _id
      isAvailable
    }
  }
`;

export const ALLPARKINGSLOTS = gql`
  query AllParkingSlots {
    allParkingSlots {
      _id
      isAvailable
      validFrom
      validTill
      slotNumber
      bookedBy {
        _id
        name
        vehicle
      }
    }
  }
`

export const AVAILABLE_SLOTS = gql`
  query AvailableSlots($available: Boolean!) {
    availableSlots(available: $available) {
      _id
      slotNumber
      isAvailable
      validFrom
      validTill
      bookedBy {
        _id
        name
        vehicle
      }
    }
  }
`;
