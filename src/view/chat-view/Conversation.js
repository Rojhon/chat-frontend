import React, { useState, useEffect } from "react"
import { Card, Form, Input, Button, message, Col, Row, Popconfirm } from "antd"
import { userData } from "../../UserData";
import axios from "axios";

const Conversation = ({ conversationId, setOnIndex }) => {
    const [conversation, setConversation] = useState({
        messages: []
    })
    const [isLoading, setIsloading] = useState(true)

    useEffect(() => {
        getConversation()
    }, [])

    const handleConversation = () => {
        setOnIndex(false)
    }

    const getConversation = async () => {
        try {
            const response = await axios.get(`/api/chats/get-conversation/${conversationId}`)
            console.log(response.data)
            setConversation(response.data)
            setIsloading(false)
        } catch (error) {
        }

    }

    const deleteConversation = async () => {
        try {
            const response = await axios.delete(`/api/chats/delete-conversation/${conversationId}`)
            message.success(response.data)
            setOnIndex(false)
        } catch (error) {
            message.error(error.response.data)
        }

    }

    return (
        <>
            <div>
                <Button style={{ marginRight: "1rem" }} type="primary" onClick={handleConversation}>Back</Button>

                <Popconfirm
                    placement="top"
                    title="Are you sure to Delete this Conversation?"
                    onConfirm={deleteConversation}
                    okText="Yes"
                    cancelText="No">
                    <Button type="primary" danger>Delete</Button>

                </Popconfirm>

                {
                    conversation.messages.map((value, i) =>
                        value.user_id == userData.user_id ?
                            <p>Me: {value.content}</p>
                            :
                            <p>{value.content}</p>
                    )
                }
            </div>
        </>
    );
}

export default Conversation;
