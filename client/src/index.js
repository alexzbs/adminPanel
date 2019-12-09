import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { BrowserRouter } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { setContext } from 'apollo-link-context';
import { resolvers, typeDefs } from './resolvers';
import { ApolloProvider } from '@apollo/react-hooks';


const cache = new InMemoryCache();
const authLink = setContext((_, { headers }) => {
    const localToken = localStorage.getItem('jwt');

    return {
        headers: {
          ...headers,
          authorization: localToken ? `Bearer ${localToken}` : "",
        }
      }
});

const httpLink = new HttpLink({
    uri: 'http://' + process.env.REACT_APP_URL
});

const wsLink = new WebSocketLink({
    uri: `ws://` + process.env.REACT_APP_URL,
    options: {
        reconnect: true
    }
});

const link = split(

    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );
    if (networkError) console.log(`[Network error]: ${networkError}`);
})

const client = new ApolloClient({
    cache,
    link: ApolloLink.from([errorLink, authLink, link]),
    typeDefs,
    resolvers
});

cache.writeData({
    data: {
        isLoggedIn: !!localStorage.getItem('jwt')
    },
});

const app = (
    <ApolloProvider client={client}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ApolloProvider >
)
ReactDOM.render(app, document.getElementById('root'));
