import React, { useState, useEffect } from "react"
import { Card } from "antd"

const Notification = ({ data }) => {
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        setNotifications(data)
    }, [data])

    return (
        <>
            <div style={{ height: "20rem", overflow: "auto" }}>
                {
                    notifications.length != 0 ?
                        notifications.map((value, i) =>
                            <Card key={i} >
                                <h4>{value.title}</h4>
                                <p>{value.name}: {value.user_id}</p>
                            </Card>
                        )
                        :
                        <p>No Notification</p>
                }

            </div>

        </>
    );
}

export default Notification
