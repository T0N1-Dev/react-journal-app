import React from 'react'

export const LoadingScreen = () => {
  return (
    <div>
        <iframe 
            src="loading.html" 
            title="Loading Page" 
            style={{ width: '100%', height: '100vh', border: 'none' }} 
        />
    </div>
  )
}
