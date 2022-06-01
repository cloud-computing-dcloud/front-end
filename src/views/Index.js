import React from "react";
import {Button} from "antd";
import {Link} from "react-router-dom";

/**
 * 主页
 */
class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }

    }

    render() {
        return (
            <div className={"indexApp"}>
                <div className={"middlePanel"}>
                    <div className={"title"}>D-Cloud</div><br/>
                    <Link to={"/login"}>
                        <Button type={"primary"}>Login</Button>
                    </Link><br/>
                    <Link to={"/register"}>
                        <Button type={"primary"}>Register</Button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default App;
