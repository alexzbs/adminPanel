import React from 'react'
import Layout from './hoc/Layout/Layout'
import { Route, Switch, Redirect } from 'react-router-dom'
import StartPage from './containers/StartPage/StartPage'
import Auth from './containers/Auth/Auth'
import AdminPanel from './containers/AdminPanel/AdminPanel'
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { loader } from 'graphql.macro'

const ISLOGGEDIN = gql`${loader('./gql/Queries/isLoggedIn_QUERY.gql')}`
const MYROLE = gql`${loader('./gql/Queries/MyRole_QUERY.gql')}`

export default function App(props) {
  const { loading, data: roleQuery, refetch } = useQuery(MYROLE, {
    onCompleted: (data) => {
      console.log('from query', roleQuery)
    }
  });

  const { data, refetch: isLogged } = useQuery(ISLOGGEDIN);

  const PrivateRoute = ({ component: Component, accessFor, ...rest }) => {
    return (
      !loading && <Route {...rest} render={(props) => (
        accessFor.includes(roleQuery.myRole.name.toLowerCase())
          ? <Component {...props} />
          : <Redirect to='/auth' />
      )} />
    )
  }
  isLogged()
  refetch()
  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={StartPage} />
        <PrivateRoute path='/roles' component={AdminPanel} accessFor={['admin', 'user']} />
        {data.isLoggedIn ? <Redirect to='/' /> : <Route path="/auth" component={Auth} />}
        <Redirect to='/'/>
      </Switch>
    </Layout>
  )
}

