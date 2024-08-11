import { useState } from "react"
import { IStory } from "./types"

export const useStories = () => {
    const [stories, setStories] = useState<IStory[]>([])
    const [isLoading, setIsLoading] = useState(false)

    return {stories, isLoading}
}
