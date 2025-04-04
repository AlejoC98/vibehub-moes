import React, { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const layout = ({ children} : {children: ReactNode}) => {
  return (
    <main style={{ padding: '0 3rem'}}>
      <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          theme="light"
        />
        { children }
    </main>
  )
}

export default layout
