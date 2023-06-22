import React from 'react'
import "./NetSideBarTab.css"

function NetSideBarTab({Icon,text}) {
    console.log(Icon);
    console.log(text);
  return (
    <div className='Icontab'>
       {Icon &&( <Icon className="sidebaricon" />)}
        {text} 
    </div>
  )
}

export default NetSideBarTab