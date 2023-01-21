import React, { useState, useEffect } from "react"
import { Card, Form, Input, Button, message, Col, Row, Tabs, Badge } from "antd"
import { userData } from "../../UserData"
import { useNavigate } from "react-router-dom"
import Chats from "./Chats"
import Contacts from "./Contacts"
import Notification from "./Notification"
import Profile from "./Profile"
import axios from "axios"
import { io } from "socket.io-client";

const MainChat = () => {
    const navigate = useNavigate()
    const URL = "http://localhost:5000"

    const [users, setUsers] = useState([])

    const [isLogin, setIsLogin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const [socket, setSocket] = useState(null)

    const [notifications, setNotifications] = useState([])
    const [notificationsCount, setNotificationsCount] = useState(0)

    const [onlineUsers, setOnlineUsers] = useState({})

    useEffect(() => {
        authenticated()
        getUsers()
    }, [])

    useEffect(() => {
        if (socket != null) {
            handleSocket()
        }
    }, [socket])

    const authenticated = () => {
        if (userData.user_id != "") {
            setSocket(io(URL))
        } else {
            navigate("/")
        }
    }

    const handleSocket = () => {
        socket.on("connect", () => {
            console.log("Im Connected to Socket id ", socket.id);
            socket.emit("socket:add-user", userData.user_id)
        });

        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`)
        });

        socket.on("socket:all-users", (users) => {
            console.log(users)
            setOnlineUsers(users)
        })

        socket.on("socket:new-user", (userId) => {
            setNotifications(notifications => [{
                name: "ID",
                title: "New User Online",
                user_id: userId
            }, ...notifications])

            setNotificationsCount(notificationsCount => notificationsCount + 1)
        })

        socket.on("socket:user-disconnect", (userId) => {
            setNotifications(notifications => [{
                name: "ID",
                title: "User Disconnected",
                user_id: userId
            }, ...notifications])

            setNotificationsCount(notificationsCount => notificationsCount + 1)
        })

        socket.on("socket:login", () => {
            setIsLogin(true)
        })

        socket.on("socket:alrealdy-login", () => {
            setIsLogin(false)
            message.destroy()
            message.error("Already Login!")
            navigate("/")
        })

        socket.on("socket:receive-conversation", (userId) => {
            setNotifications(notifications => [{
                name: "ID",
                title: "New Conversation from",
                user_id: userId
            }, ...notifications])

            setNotificationsCount(notificationsCount => notificationsCount + 1)
        })

        socket.on("socket:receive-delete-conversation", (userId) => {
            setNotifications(notifications => [{
                name: "ID",
                title: "Conversation Deleted by",
                user_id: userId
            }, ...notifications])

            setNotificationsCount(notificationsCount => notificationsCount + 1)
        })

        socket.on("socket:receive-message", (values) => {
            setNotifications(notifications => [{
                name: "ID",
                title: "New Message from",
                user_id: values.message_data.user_id._id
            }, ...notifications])

            setNotificationsCount(notificationsCount => notificationsCount + 1)
        })
    }

    const handleTabs = (key) => {
        if (key == 3) {
            setNotificationsCount(0)
        }
    }

    const getUsers = async () => {
        try {
            const response = await axios.get(`/api/users/get-all-users/${userData.user_id}`)
            setUsers(response.data)
            // setIsLoading(false)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {isLogin ? <Row justify="center" style={{ width: "100%" }}>
                <Card title="Simple Chat Application">
                    <Tabs defaultActiveKey="1" onChange={handleTabs}>
                        <Tabs.TabPane tab="Chats" key="1">
                            <Chats users={users} socket={socket}></Chats>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Contacts" key="2">
                            <Contacts userData={userData} data={onlineUsers}></Contacts>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={
                            <Badge count={notificationsCount}>
                                Notification
                            </Badge>
                        } key="3">
                            <Notification data={notifications}></Notification>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Profile" key="4">
                            <Profile userData={userData}></Profile>
                        </Tabs.TabPane>
                    </Tabs>
                </Card>
            </Row> :
                <></>
            }
        </>
    )
}

export default MainChat