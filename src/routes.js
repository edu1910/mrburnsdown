import React from 'react'

const New = React.lazy(() => import('./views/New'))
const Burndown = React.lazy(() => import('./views/Burndown'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/:key', name: 'Burndown', element: Burndown },
  { path: '/new', name: 'New', element: New },
]

export default routes
