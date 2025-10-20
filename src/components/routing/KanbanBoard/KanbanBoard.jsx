import { KanbanBoardDesk } from "@/components/routing/KanbanBoard/KanbanBoardDesk";
import { KanbanBoardContext } from '@/context/KanbanBoardContext.jsx';
import styles from "@/styles/components/routing/KanbanBoard.module.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';

export function KanbanBoard() {
    const { BoardsArr, createBoard, selectBoard, selectedBoardId, delBoard, handleSetIsAlertVisible } = useContext(KanbanBoardContext);

    const [isInputVisible, setisInputVisible] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const inputRef = useRef(null)
    const scrollRef = useRef(null)
    useEffect(() => {
        if (isInputVisible && inputRef.current) {
            inputRef.current.focus()
        } else {
            setInputValue('')
        }
    }, [isInputVisible])

    const handleInputBlur = () => {
        setisInputVisible(false)
    }

    const handleInputKeyDown = (event) => {
        if (event.key === "Enter") {
            createBoard(inputValue)
            setisInputVisible(false)
        }
    }

    const handleInputOnChange = (item) => {
        setInputValue(item.target.value)
    }

    const handleScrollWheel = (e) => {
        if (scrollRef.current) {
            e.preventDefault()
            scrollRef.current.scrollLeft += e.deltaY;
        }
    }

    const handleSetDeskId = (id) => {
        selectBoard(id)
    }

    return (
        <div className={styles.kanbanBoard}>
            <header className={styles.kanbanBoard_header}>
                <div className={styles.kanbanBoard_header_Nav}>
                    <span
                        onClick={() => {
                            setisInputVisible(true)
                        }}
                        className={styles.kanbanBoard_header_Nav_item}>Create new board <FaPlus />
                    </span>
                    <span
                        style={{ display: isInputVisible ? 'flex' : "none" }}
                        className={styles.kanbanBoard_header_Nav_item_creater}>
                        <input
                            onChange={handleInputOnChange}
                            value={inputValue}
                            onKeyDown={handleInputKeyDown}
                            ref={inputRef}
                            onBlur={handleInputBlur}
                            type="text"
                            placeholder="desk name: " />
                        <IoCloseSharp
                            onClick={() => {
                                setisInputVisible(false)
                            }}
                            className={styles.close_icon} />
                    </span>
                </div>
                <nav
                    ref={scrollRef}
                    className={styles.kanbanBoard_header_containerNav}
                    onWheel={handleScrollWheel}>
                    <ul className={styles.kanbanBoard_header_containerNav_list}>
                        {[...BoardsArr].reverse().map((board) => (
                            <li

                                onClick={() => { handleSetDeskId(board.id) }}
                                className={styles.kanbanBoard_header_containerNav_list_item}
                                key={board.id}>
                                <NavLink
                                    onClick={() => selectBoard(board.id)}
                                    className={({ isActive }) =>
                                        `${styles.kanbanBoard_header_containerNav_list_item_Link} ${selectedBoardId === board.id ? styles.active : ''}`
                                    }
                                    to={'/taskscontroller/desk'}
                                >
                                    <p>{board.name}</p>
                                </NavLink>

                            </li>
                        ))}
                    </ul>
                </nav>
                <nav
                    style={{ display: selectedBoardId != null ? 'block' : 'none' }}
                    className={styles.kanbanBoard_header_containerNavControl}>
                    <ul className={styles.kanbanBoard_header_containerNavControl_list}>
                        <li className={styles.kanbanBoard_header_containerNavControl_list_item}>
                            <MdEdit id={styles.edit_icon} />
                        </li>
                        <li
                            onClick={delBoard}
                            className={styles.kanbanBoard_header_containerNavControl_list_item}>
                            <MdDelete
                                onClick={() => { handleSetIsAlertVisible('Board') }}
                                id={styles.delete_icon} />
                        </li>
                    </ul>
                </nav>
            </header>
            <Routes>
                <Route path="desk" element={selectedBoardId !== null ? (
                    <KanbanBoardDesk />
                ) : (
                    <span className={styles.clearBoard}>
                        <h1>Create a new desk</h1>
                    </span>
                )} />
                <Route path="*" element={<Navigate to="desk" replace />} />


            </Routes>
        </div >
    );
}