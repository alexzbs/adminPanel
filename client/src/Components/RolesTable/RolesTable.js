import React, { Fragment } from 'react'
import { Table } from 'semantic-ui-react'

import RightsCells from './RightsCells/RightsCells';

import MessageWindow from '../UI/MessageWindow/MessageWindow'

export default class RolesTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: {
        error: false,
        messageText: ''
      }
    }
  }
  componentDidMount() {
    this.props.subToAddingOperation()
    this.props.subToDeletingOperation()
    this.props.subToAddingRole()
    this.props.subToDeletingRole()
  }

  setMessage = (error, text) => {
    this.setState({
      message:
      {
        //Нужна регулярка которая при ошибке отрезает "GraphQL Error:"
        error: error ? true : false,
        messageText: !error ? '' : text
      }
    })
  }

  resetMessage = () => {
    this.setState({
      message: {
        error: false,
        messageText: ''
      },
    })
  }

  render() {
    let roles = []
    if (!this.props.loading) {
      roles = this.props.data.allRoles
    }
    
    if (this.state.message.error) {
      setTimeout(() => {
        this.resetMessage()
      }, 3000);
    }

    return (
      <Fragment>
        <Table
          celled
          structured
          size='small'
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan='2' />
              {
                roles.map((role, index) => {
                  return <Table.HeaderCell
                    key={index}
                    textAlign='center'

                  >
                    {role.name}
                  </Table.HeaderCell>
                })
              }
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {!this.props.loading
              ?
              Object.keys(this.props.operations).map((operation, index) => {
                return <RightsCells
                  key={index}
                  type={this.props.operations[operation]}
                  typeName={operation}
                  roleRights={roles}
                  setMessage={this.setMessage}
                />
              })
              :
              null
            }

          </Table.Body>
        </Table>
        {this.state.message.error && <MessageWindow
          error={!this.state.message.error}
          content={this.state.message.messageText}
        />
        }
      </Fragment >
    )
  }
}

