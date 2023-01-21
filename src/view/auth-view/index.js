import React, { useEffect } from "react"
import { Card, Row, Tabs } from "antd"
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import { userData } from "../../UserData"

const MainForm = () => {
    useEffect(() => {
        setUserData()
    }, [])

    const setUserData = () => {
        userData.user_id = ""
    }

    return (
        <>
            <Row justify="center">
                <Card>
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="Sign In" key="1">
                            <SignIn></SignIn>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Sign Up" key="2">
                            <SignUp></SignUp>
                        </Tabs.TabPane>
                    </Tabs>
                </Card>
            </Row>
        </>
    )
}

export default MainForm