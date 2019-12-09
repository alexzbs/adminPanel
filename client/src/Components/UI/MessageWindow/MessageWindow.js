import React from 'react'
import { Message } from 'semantic-ui-react'

const MessageWindow = props => {
    return (
        <Message
            error={false || props.error}
            success={false || props.success}
            header={props.header}
            content={props.content}
        />
    )
}
export default MessageWindow