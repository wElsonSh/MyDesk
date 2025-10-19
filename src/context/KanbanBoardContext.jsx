import { createContext, useState } from "react";

const KanbanBoardContext = createContext()

const [BoardsArr, setBoardsArr] = useState(() => {
    try {
        const boards = localStorage.getItem("MyBoards");
        return boards ? JSON.parse(boards) : [];
    } catch {
        return [];
    }
})

export function KanbanBoardContextComponent() {
    return (
        <>
        </>
    );
}