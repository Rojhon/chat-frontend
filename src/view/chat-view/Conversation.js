import React, { useState, useEffect, useRef } from "react"
import { Card, Form, Input, Button, message, Popconfirm } from "antd"
import { userData } from "../../UserData";
import axios from "axios";

const Conversation = ({ conversationId, setOnIndex, socket }) => {
    const [form] = Form.useForm()
    const [conversation, setConversation] = useState({
        messages: []
    })
    const [isLoading, setIsloading] = useState(true)

    const messageEndRef = useRef(null)

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        getConversation()
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [conversation])

    useEffect(() => {
        handleSocket()
    }, [socket])

    const handleSocket = () => {
        socket.on("socket:receive-message", (values) => {
            setConversation(conversation => ({
                messages: [...conversation.messages, values.message_data]
            }))
        })
    }

    const handleConversation = () => {
        setOnIndex(false)
    }

    const getConversation = async () => {
        try {
            const response = await axios.get(`/api/chats/get-conversation/${conversationId}`)
            setConversation(response.data)
            setIsloading(false)
        } catch (error) {
        }

    }

    const deleteConversation = async () => {
        try {
            const response = await axios.delete(`/api/chats/delete-conversation/${conversationId}`)
            message.success(response.data)
            socket.emit("socket:delete-conversation", conversation.participants, userData.user_id)
            setOnIndex(false)
        } catch (error) {
            message.error(error.response.data)
        }

    }

    const sendMessage = async (values) => {
        try {
            const response = await axios.post("/api/chats/send-message", values)
            message.destroy()
            message.success(response.data.message)
            form.resetFields()

            setConversation(conversation => ({
                messages: [...conversation.messages, response.data.message_data]
            }))

            socket.emit("socket:send-message", response.data)


        } catch (error) {
            console.log(error)
            message.destroy()
            message.success(error.response.data)
        }
    }

    const onFinish = () => {
        form
            .validateFields()
            .then((values) => {
                message.loading("Loading...")
                values.user_id = userData.user_id
                values.conversation_id = conversationId
                sendMessage(values)
            })
            .catch((error) => {
            })
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
                    isLoading ?
                        <Card loading={isLoading}></Card>
                        : <></>
                }

                <div style={{ height: "12rem", overflow: "auto" }} >
                    {
                        conversation.messages.map((value, i) =>
                            <span key={i} ref={messageEndRef} >
                                {
                                    value.user_id._id == userData.user_id ?
                                        <div style={{ inlineSize: "15rem", overflow: "break-word", padding: "0.5rem" }}>
                                            Me: {value.content}
                                        </div>
                                        :
                                        <div style={{ inlineSize: "15rem", overflow: "break-word", padding: "0.5rem" }}>
                                            {value.user_id.full_name.split(" ")[0]}: {value.content}
                                        </div>
                                }
                            </span>
                        )
                    }
                </div>
            </div>

            <Form form={form}>
                <Form.Item name="content" rules={[{ required: true }]}>
                    <Input placeholder="Message" />
                </Form.Item>
            </Form>
            <Button type="primary" onClick={() => onFinish()} htmlType="submit">
                Send
            </Button>
        </>
    );
}

export default Conversation;
