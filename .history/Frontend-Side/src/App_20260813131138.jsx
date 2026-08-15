 import React from 'react'
import "./App.css";import "./index.css"
 function App() {
   return (
     <div>
  <div className="drawer">
  <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content">
    {/* Page content here */}
    <label htmlFor="my-drawer-1" className="btn drawer-button">Open drawer</label>
  </div>
  <div className="drawer-side">
    <label htmlFor="my-drawer-1" aria-label="close sidebar" className="drawer-overlay"></label>
    <ul className="bg-base-200 p-4 w-80 min-h-full menu">
      {/* Sidebar content here */}
      <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li>
    </ul>
  </div>
</div>
     </div>
   )
 }
 
 export default App
 