import React from 'react'
import { AppContent } from '../components/index'

const DefaultLayout = () => {
  return (
    <>
      <div className="wrapper d-flex flex-column min-vh-100 bg-light bg-opacity-50 dark:bg-transparent">
        <div className="body flex-grow-1">
          <AppContent />
        </div>
      </div>
    </>
  )
}

export default DefaultLayout
