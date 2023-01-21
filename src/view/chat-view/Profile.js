import React, { useState, useEffect } from "react"
import { Card, Avatar } from "antd"
import { AvatarName } from "../../helpers/AvatarName"
import axios from "axios"

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
        <div style={{ height: "20rem", overflow: "auto" }}>
            <Card loading={isLoading}>
                <Avatar size={80} style={{ backgroundColor: "black" }}>{AvatarName(myData.full_name)}</Avatar>
                <p>{myData.full_name}</p>
                <i>{myData.email}</i>
                <br></br>
                <br></br>
            </Card>
        </div>
    );
}

export default Profile;
