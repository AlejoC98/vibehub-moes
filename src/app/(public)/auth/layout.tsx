import React, { ReactNode } from 'react'

const layout = ({ children} : {children: ReactNode}) => {
  return (
    <main style={{ padding: '0 3rem'}}>
        { children }
    </main>
  )
}

export default layout
