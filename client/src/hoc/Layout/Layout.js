import React, { Component } from 'react'
import classes from './Layout.module.css'
// import MenuToggle from '../../components/Navigation/MenuToggle/MenuToggle'
// import Drawer from '../../components/Navigation/Drawer/Drawer'
import Menu from '../../components/Navigation/Menu/Menu'

class Layout extends Component {



  render() {
    return (
      <div className={classes.Layout}>
        <Menu/>
        <main>
          {this.props.children}
        </main>
      </div>
    )
  }
}

export default Layout