import React from 'react'
import { CSpinner } from '@coreui/react-pro'

const Loading = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        zIndex: '9999',
        backgroundColor: '#fff',
      }}
    >
      <CSpinner color="primary" />
    </div>
  )
}

export default React.memo(Loading)
