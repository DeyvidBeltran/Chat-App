import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotencialChats = () => {
    const {user} = useContext(AuthContext)
    const { potencialChats, createChat } = useContext(ChatContext)

    return (
        <>
            <div className="all-users">
                {potencialChats && potencialChats.map((u, index) => {
                    return (
                        <div className="single-user" key={index} onClick={()=> createChat(user._id, u._id)}>
                            {u.name}
                            <span className="user-online"></span>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default PotencialChats