import { RoutingBar } from "@/components/common/RoutingBar";
import { KanbanBoard } from "@/components/routing/KanbanBoard/KanbanBoard";
import styles from "@/styles/components/sections/Wrapper.module.scss";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

export function Wrapper() {

    const [BoardsArr, setBoardsArr] = useState(() => {
        try {
            const boards = localStorage.getItem("MyBoards");
            return boards ? JSON.parse(boards) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("MyBoards", JSON.stringify(BoardsArr));
    }, [BoardsArr])

    const createdNewBoard = (newBoard) => {
        let newBoardElement = {
            id: BoardsArr.length + 1,
            name: newBoard.trim(),
            columns: []
        }

        let newBoardNameTrim = newBoard.trim()
        let newBoardNameTrimArr = newBoardNameTrim.split('')

        if (newBoardNameTrimArr == 0) {
            console.log("error")
        } else {
            setBoardsArr(prev => [...prev, newBoardElement])
        }
    }

    const createdNewDesk = (newDesk) => {
        console.log(newDesk)
        // console.log(BoardsArr[newDesk].id)
        let newDeskElement = {
            id: newDesk.id,
            name: newDesk.name,
            columns: newDesk.columns
        }
        setBoardsArr(prev => prev.filter(desk => desk.id !== BoardsArr[newDesk.index].id))
        setBoardsArr(prev => [...prev, newDeskElement])
    }

    return (
        <BrowserRouter>
            <main className={styles.wrapper}>
                <div className={styles.wrapper_container}>
                    <RoutingBar />
                    <section className={styles.wrapper_routingOutput}>
                        <Routes>
                            <Route
                                path="/taskscontroller/*"
                                element={
                                    <KanbanBoard
                                        createdNewBoard={createdNewBoard}
                                        BoardsArr={BoardsArr}
                                        createdNewDesk={createdNewDesk}
                                    />}
                            />
                            <Route path="/diary" element={'Obsidian'} />
                            <Route path="/others" element={'hello world'} />
                            <Route path="*" element={<Navigate to="/taskscontroller" replace />} />
                        </Routes>
                    </section>
                </div>
            </main>
        </BrowserRouter>
    );
}