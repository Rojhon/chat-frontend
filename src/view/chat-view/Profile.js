import React, { useState, useEffect } from "react"
import { Card, Form, Input, Button, message, Col, Row, Tabs, Select, TimePicker, DatePicker, } from "antd";
import axios from "axios";

const Profile = ({ userData }) => {
    const [myData, setMyData] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        try {
            const response = await axios.get(`/api/users/${userData.user_id}`)
            setMyData(response.data)
            setIsLoading(false)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Card loading={isLoading}>
            <p>{myData.email}</p>
            <p>{myData.full_name}</p>
        </Card>
    );
}

export default Profile;
