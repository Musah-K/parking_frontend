import React from 'react'
import Dashbord from './admin/Dashbord'
import { Outlet } from 'react-router-dom'

const Admin = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default Admin