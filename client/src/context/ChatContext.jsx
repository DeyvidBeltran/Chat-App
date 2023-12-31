import { createContext, useState, useEffect, useCallback } from "react"
import {base_url, getRequest, postRequest} from "../utils/services"

export const ChatContext = createContext()

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserChats] = useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false)
    const [userChatsError, setUserChatsError] = useState(null)
    const [potencialChats, setPotencialChats] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [isMessagesLoading, setIsMessagesLoading] = useState(false)
    const [messagesError, setMessagesError] = useState(null)
    const [sendTextMessageError, setSendTextMessageError] = useState(null) 
    const [newMessage, setNewMessage] = useState(null) 

    console.log("currentChat****", currentChat)
    console.log("messages", messages)

    useEffect(() => {
        const getUsers = async () => {
            const response = await getRequest(`${base_url}/users`)

            if(response.error){
                return console.log("Error fetching users", response)
            }

            const pChats = response?.filter((u) => {
                let isChatCreated = false

                if(user?._id === u._id) return false

                if(userChats){
                   isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id
                    })
                }

                return !isChatCreated
            })

            setPotencialChats(pChats)
        }

        getUsers()
    },[userChats])

    useEffect(() => {
        const getUserChats = async () => {
            if(user?._id) {
                setIsUserChatsLoading(true)
                setUserChatsError(null)

                const response = await getRequest(`${base_url}/chats/${user?._id}`)

                setIsUserChatsLoading(false)

                if(response.error){
                    return setUserChatsError(response)
                }

                setUserChats(response)
            }
        }

        getUserChats()
    }, [user])

    useEffect(() => {
        const getMessages = async () => {
                setIsMessagesLoading(true)
                setMessagesError(null)

                const response = await getRequest(`${base_url}/messages/${currentChat?._id}`)

                setIsMessagesLoading(false)

                if(response.error){
                    return setMessagesError(response)
                }

                setMessages(response)
        }

        getMessages()
    }, [currentChat])

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if(!textMessage) return console.log("You must type something...")

        const response = await postRequest(`${base_url}/messages`,
            JSON.stringify({
                chatId: currentChatId,
                senId: sender._id,
                text: textMessage
            })
        )

        if(response.error){
            return setSendTextMessageError(response)
        }

        setNewMessage(response)
        setMessages((prev)=> [...prev, response])
        setTextMessage("")
    }, [])

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat)
    },[])

    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(
            `${base_url}/chats`,
            JSON.stringify({
                firstId, 
                secondId
            })
        )
        if(response.error){
            return console.log("Error creating chat", response)
        }

        setUserChats((prev) => [...prev, response])
    },[])

    return (
    <ChatContext.Provider value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potencialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        sendTextMessage,
    }} >{children}</ChatContext.Provider>
    )
}