import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'

export default function DropDownMenu(props) {

    return (
        <Dropdown
            item
            icon={props.type === 'icon' ? props.title : null}
            text={props.type === 'text' ? props.title : null}
            simple
        >
            <Dropdown.Menu>
                {
                    props.menuItems.map((item, index) => {
                        return <Dropdown.Item key = {`${item.label}_${index}`}>
                            <NavLink  to={item.to} exact={item.exact}>
                                {item.label}
                            </NavLink>
                        </Dropdown.Item>
                    })
                }
            </Dropdown.Menu>
        </Dropdown>
    )
}
