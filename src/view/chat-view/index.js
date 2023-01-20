import React, { useState, useEffect } from "react"
import { Card, Form, Input, Button, message, Col, Row, Tabs, Select, TimePicker, DatePicker, Skeleton } from "antd"
import { userData } from "../../UserData"
import { useNavigate } from "react-router-dom"
import Chats from "./Chats"
import Contacts from "./Contacts"
import Profile from "./Profile"
import axios from "axios"
import { io } from "socket.io-client";

const MainChat = () => {
    const navigate = useNavigate()
    const URL = "http://localhost:5000"

    const [isLogin, setIsLogin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const [socket, setSocket] = useState(null)

    useEffect(() => {
        authenticated()
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

        socket.on("socket:new-user", (userId) => {
            console.log("New User Connected ", userId)
        })

        socket.on("socket:user-disconnect", (user) => {
            console.log("User Disconnect", user)
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
    }

    return (
        <>
            {isLogin ? <Row justify="center">
                <Card>
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="Chats" key="1">
                            <Chats></Chats>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Contacts" key="2">
                            <Contacts></Contacts>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Profile" key="3">
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