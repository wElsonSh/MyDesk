import styles from "@/styles/components/routing/KanbanBoard.module.scss";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
export function KanbanBoard({ createdNewBoard, BoardsArr }) {

    const [isInputVisible, setisInputVisible] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const inputRef = useRef(null)
    const scrollRef = useRef(null)

    useEffect(() => {
        if (isInputVisible && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isInputVisible])

    const handleInputBlur = () => {
        setisInputVisible(false)
    }

    const handleInputKeyDown = (event) => {
        if (event.key === "Enter") {
            createdNewBoard(inputValue)
            setisInputVisible(false)
            setInputValue('')
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

    return (
        <div className={styles.kanbanBoard}>
            <header className={styles.kanbanBoard_header}>
                <nav
                    ref={scrollRef}
                    className={styles.kanbanBoard_header_containerNav}
                    onWheel={handleScrollWheel}>
                    <ul className={styles.kanbanBoard_header_containerNav_list}>
                        <li
                            onClick={() => {
                                setisInputVisible(true)
                            }}
                            className={styles.kanbanBoard_header_containerNav_list_item}>Create new board <FaPlus />
                        </li>
                        <li
                            style={{ display: isInputVisible ? 'flex' : "none" }}
                            className={styles.kanbanBoard_header_containerNav_list_item_creater}>
                            <input
                                onChange={handleInputOnChange}
                                value={inputValue}
                                onKeyDown={handleInputKeyDown}
                                ref={inputRef}
                                onBlur={handleInputBlur}
                                type="text"
                                placeholder="name: " />
                            <IoCloseSharp
                                onClick={() => {
                                    setisInputVisible(false)
                                }}
                                className={styles.close_icon} />
                        </li>
                        {BoardsArr.map((board => (
                            <li
                                className={styles.kanbanBoard_header_containerNav_list_item}
                                key={board.id}>
                                {board.name}
                            </li>
                        )))}
                    </ul>
                </nav>
            </header>
            <div className={styles.kanbanBoard_container}>

            </div>
        </div >
    );
}