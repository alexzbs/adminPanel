import React, { Fragment } from 'react'
import { Menu, Header } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'

import { useApolloClient, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { loader } from 'graphql.macro'

const ISLOGGEDIN = gql`${loader('../../../gql/Queries/isLoggedIn_QUERY.gql')}`
const MYROLE = gql`${loader('../../../gql/Queries/MyRole_QUERY.gql')}`
const ME = gql`${loader('../../../gql/Queries/me_QUERY.gql')}`

export default function MenuTab(props) {
  const client = useApolloClient();

  const links = [
    { to: '/', name: 'homepage', label: 'Home Page', exact: true }
  ]

  const { data: userStatus } = useQuery(ISLOGGEDIN);
  const { loading: roleLoading, data: roleQuery } = useQuery(MYROLE);
  const {
    loading: loadMe,
    data: userInfo,
    refetch: refetchMe,
    startPolling,
    stopPolling } = useQuery(ME);


  const logout = () => {
    client.writeData({ data: { isLoggedIn: false } });
    localStorage.clear();
    userInfo && refetchMe()

  }

  if (userStatus.isLoggedIn && !roleLoading && roleQuery.myRole.name.toLowerCase() === 'admin') {
    links.push({ to: '/roles', name: 'roles', label: 'Roles', exact: false })

  }

  userStatus.isLoggedIn && startPolling(500)
  userInfo && userInfo.me && stopPolling()
  return (
    <Menu>
      {links.map(link => {
        return <Menu.Item
          name={link.name}
          key={link.name}
        >
          <NavLink to={link.to} exact={link.exact}>
            {link.label}
          </NavLink>
        </Menu.Item>

      })}
      <Menu.Menu position='right'>
        {
          userStatus.isLoggedIn ?
            <Fragment>
              <Menu.Item>
                {!loadMe && typeof userInfo !== 'undefined' ?
                  <Header as='h4' >
                    {userInfo.me && userInfo.me.surname}
                  </Header> : null}
              </Menu.Item>
              <Menu.Item icon='sign-out' onClick={logout}>

              </Menu.Item>
            </Fragment>
            :
            <Fragment>
              <Menu.Item
                name='signup'
              >
                <NavLink to={{
                  pathname: '/auth',
                  state: {
                    type: 'signup'
                  }
                }
                }
                  exact={false}>
                  Registration
          </NavLink>
              </Menu.Item>
              <Menu.Item
                name='signup'
              >
                <NavLink to={{
                  pathname: '/auth',
                  state: {
                    type: 'login'
                  }
                }
                }
                  exact={false}>
                  Login
          </NavLink>
              </Menu.Item>
            </Fragment>
        }
      </Menu.Menu>
    </Menu >
  )
}