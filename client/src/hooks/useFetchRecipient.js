import { useEffect, useState } from "react"
import { base_url, getRequest } from "../utils/services"

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null)
  const [error, setError] = useState(null)

  const recipientId = chat?.members?.find((id) => id !== user?._id)

  // console.log("recipientId", recipientId)

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return null

      const response = await getRequest(`${base_url}/users/find/${recipientId}`)

      // console.log("response", response)

      if (response.error) {
        return setError(response)
      }

      setRecipientUser(response)
    }

    getUser()
  }, [recipientId])

  return { recipientUser }
}
