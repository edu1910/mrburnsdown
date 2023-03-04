import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react-pro'

// routes config
import routes from '../routes'

const AppContent = () => {
  return (
    <CContainer lg style={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '100%' }}>
        <Suspense fallback={<CSpinner color="primary" />}>
          <Routes>
            {routes.map((route, idx) => {
              return (
                route.element && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={<route.element />}
                  />
                )
              )
            })}
            <Route path="/" element={<Navigate to="new" replace />} />
            <Route path="*" element={<Navigate to="new" replace />} />
          </Routes>
        </Suspense>
      </div>
    </CContainer>
  )
}

export default React.memo(AppContent)
