import React, { useState, useEffect } from "react"
import { Card, Form, Input, Button, message, Col, Row, Tabs, Select, TimePicker, DatePicker, Avatar } from "antd"
import ComponseMessage from "./ComposeMessage"
import { userData } from "../../UserData";
import { useNavigate } from "react-router-dom"
import Conversation from "./Conversation";
import axios from "axios";

const Chats = ({ users }) => {
    const navigate = useNavigate()
    const [conversations, setConversations] = useState([])

    // For Compose Message
    const [onComposeMessage, setOnComposeMessage] = useState(false)
    const [onSuccessMessage, setOnSuccessMessage] = useState(false)

    // For Conversation
    const [onConversations, setOnConversations] = useState(false)
    const [conversationId, setConversationId] = useState("")
    const [onIndex, setOnIndex] = useState(true)

    const [isLoading, setIsloading] = useState(true)

    useEffect(() => {
        getConversations()
    }, [])

    useEffect(() => {
        if (onIndex == false) {
            getConversations()
            setOnConversations(false)
            setOnIndex(true)
            setIsloading(true)
        }
    }, [onIndex])

    useEffect(() => {
        if (onSuccessMessage == true) {
            getConversations()
            setOnComposeMessage(false)
        }
    }, [onSuccessMessage])

    const handleComponseMessage = () => {
        setOnComposeMessage(!onComposeMessage)
    }

    const getConversations = async () => {
        try {
            const response = await axios.get(`/api/chats/get-conversations/${userData.user_id}`)
            console.log(response.data)
            setConversations(response.data)
            setIsloading(false)

        } catch (error) {
            console.log(error)
        }
    }

    const goToConversation = (_id) => {
        setOnConversations(true)
        setConversations([])
        setConversationId(_id)
    }

    return (
        <>
            <div style={{ height: "20rem", overflow: "auto" }} >
                {
                    !onConversations ?
                        <Button type="primary" onClick={handleComponseMessage} style={{marginBottom: "1rem"}}>
                            {
                                !onComposeMessage ?
                                    <>Compose Message</>
                                    :
                                    <>Discard</>
                            }
                        </Button>
                        :
                        <></>
                }

                {
                    (onComposeMessage) ?
                        <ComponseMessage users={users} setOnSuccessMessage={setOnSuccessMessage}></ComponseMessage>
                        :
                        isLoading ?
                            <Card loading={isLoading}></Card>
                            :
                            conversations.length != 0 ?
                                conversations.map((value, i) =>
                                    <Card style={{ cursor: "pointer", marginBottom: "1rem" }}
                                        key={value._id}
                                        onClick={() => goToConversation(value._id)}>
                                        <Avatar style={{ backgroundColor: "black" }}>C</Avatar>
                                        <span> Participants {value.participants.length}</span>
                                        <p>{value._id}</p>
                                        <p>{value.messages[value.messages.length - 1].content}</p>
                                    </Card>
                                )
                                :
                                <></>
                }

                {
                    onConversations ?
                        <Conversation conversationId={conversationId} setOnIndex={setOnIndex}></Conversation>
                        :
                        <></>
                }

            </div>
        </>
    );
}

export default Chats;
