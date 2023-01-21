import React, { useState, useEffect } from "react"
import { Card, Form, Input, Button, message, Col, Row, Avatar, Badge } from "antd"
import { AvatarName } from "../../helpers/AvatarName";
import axios from "axios";

const Contacts = ({ userData, data }) => {
    const [users, setUsers] = useState([])
    const [onlineUsers, setOnlineUsers] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getUsers()
    }, [])

    useEffect(() => {
        if (!isLoading) {
            setOnlineUsers(data)
            handleOnlineUsers()
        }

    }, [data])

    const getUsers = async () => {
        try {
            const response = await axios.get(`/api/users/get-all-users/${userData.user_id}`)
            console.log("Contacts")
            setUsers(response.data)
            setIsLoading(false)

        } catch (error) {
            console.log(error)
        }
    }

    const handleOnlineUsers = () => {
        let newUsers = []

        users.map((value, i) => {
            newUsers.push(value)

            for (let key in onlineUsers) {
                if (key == value._id) {
                    newUsers[i].online = true
                }
            }
        })

        setUsers(newUsers)
    }

    const goToConversation = (_id) => {
        console.log(_id)
    }

    return (
        <>
            <div style={{ height: "20rem", overflow: "auto" }}>
                {
                    isLoading ?
                        <Card loading={isLoading}>
                        </Card> :
                        <>
                            {users.map((value, i) =>
                                <Card style={{ cursor: "pointer", marginBottom: "1rem" }} key={i} onClick={() => goToConversation(value._id)}>
                                    <Badge dot={true} style={{ backgroundColor: value.online ? "green" : "red" }}>
                                        <Avatar style={{ backgroundColor: "black" }}>
                                            {AvatarName(value.full_name)}
                                        </Avatar>
                                    </Badge>
                                    <span style={{ marginLeft: "0.5rem" }}>{value.full_name}</span>
                                </Card>
                            )}
                        </>
                }
            </div>
        </>
    );
}

export default Contacts
