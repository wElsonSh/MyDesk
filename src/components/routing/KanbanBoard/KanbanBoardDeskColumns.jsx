import { KanbanBoardContext } from '@/context/KanbanBoardContext.jsx';
import styles from "@/styles/components/routing/KanbanBoard.module.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdDelete, MdMoreVert } from "react-icons/md";
export function KanbanBoardDeskColumns({ columns }) {

    const { addTask, selectedBoardId, delColumn, delTask } = useContext(KanbanBoardContext);


    const [isInputTVisible, setIsInputTVisible] = useState(false)
    const [tInputValue, setTInputValue] = useState('')
    const inputTRef = useRef([])
    const [tInputIndex, setTInputIndex] = useState(null)
    const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false)

    const setTInputRef = (index) => (element) => {
        inputTRef.current[index] = element;
    };

    const handleTInputVisible = (index) => {
        setTInputIndex(index);
        setIsInputTVisible(true);
    };

    useEffect(() => {
        if (isInputTVisible && tInputIndex !== null && inputTRef.current[tInputIndex]) {
            inputTRef.current[tInputIndex].focus();
        }
    }, [isInputTVisible, tInputIndex]);
    const handleTInputBlur = () => {
        setIsInputTVisible(false);
        setTInputIndex(null);
    }
    const handleTInputOnChange = (item) => {
        setTInputValue(item.target.value);
    }

    const handleTInputKeyDown = (event, columnId) => {
        if (event.key === "Enter") {
            if (tInputValue.trim() !== '') {
                addTask(selectedBoardId, columnId, tInputValue)
            } else {
                console.log('Error')
            }
            setIsInputTVisible(false);
            setTInputValue('');
            setTInputIndex(null);
        }
    }

    const handleDelColumn = (columnId) => {
        delColumn(columnId)
    }
    const [taskIndex, setTaskIndex] = useState()
    const [columnId, setColumnId] = useState()
    const handleOpenTaskMenu = (index, columnId) => {
        setColumnId(columnId)
        setTaskIndex(index)
        setIsTaskMenuOpen(true)
    }

    useEffect(() => {
        if (!isTaskMenuOpen) return
        const handleClickDel = (event) => {
            if (event.target.closest('.task_del_btn') && event.target.closest('.task_more_btn')) {
                console.log("hello world!")
            } else if (!event.target.closest('.task_del_btn') && !event.target.closest('.task_more_btn')) {
                setIsTaskMenuOpen(false)
            }
        }
        document.addEventListener('click', handleClickDel)

        return () => {
            document.removeEventListener('click', handleClickDel)
        }
    }, [isTaskMenuOpen])

    return (
        columns.map((column) => (
            <div
                key={column.id}
                className={styles.KanbanBoardDesk_column}>
                <div className={styles.KanbanBoardDesk_column_container}>

                    <div className={styles.KanbanBoardDesk_column_title_container}>

                        <div className={styles.KanbanBoardDesk_column_title}>
                            <p>{column.name}</p>
                            <div
                                className={styles.KanbanBoardDesk_column_title_delContainer}>
                                <MdDelete
                                    onClick={() => {
                                        handleDelColumn(column.id)

                                    }}
                                    id={styles.delete_icon} />
                            </div>
                        </div>
                        <div className={styles.KanbanBoardDesk_column_taskCreator_container}>
                            <span
                                onClick={() => { handleTInputVisible(column.id) }}
                                style={{ display: isInputTVisible && tInputIndex == column.id ? 'none' : 'flex' }}
                                className={styles.KanbanBoardDesk_column_taskCreator_btn}><p>Create new task</p> <FaPlus /></span>
                            <input
                                value={tInputValue}
                                onKeyDown={(e) => handleTInputKeyDown(e, column.id)}
                                onChange={handleTInputOnChange}
                                onBlur={handleTInputBlur}
                                style={{ display: isInputTVisible && tInputIndex == column.id ? 'block' : 'none' }}
                                ref={setTInputRef(column.id)}
                                type="text" placeholder="task name"
                            />
                        </div>

                    </div>

                    {(column.tasks && column.tasks.length > 0) ? (
                        <ul className={`${styles.KanbanBoardDesk_column_tasksList} ${styles.no_clear}`}>
                            {column.tasks.map((task, index) => (
                                <li
                                    key={index}
                                    className={styles.KanbanBoardDesk_column_tasksList_item}>
                                    <div className={styles.KanbanBoardDesk_column_tasksList_item_header}>
                                        <span className={styles.task_id}><p>#{index + 1}</p></span>
                                        <MdMoreVert
                                            style={{ display: isTaskMenuOpen && taskIndex == index && columnId == column.id ? 'none' : 'block' }}
                                            onClick={() => {
                                                handleOpenTaskMenu(index, column.id)
                                            }}
                                            id={styles.more_icon}
                                            className='task_more_btn' />
                                        <MdDelete
                                            style={{ display: isTaskMenuOpen && taskIndex == index && columnId == column.id ? 'block' : 'none' }}
                                            onClick={() => {
                                                setIsTaskMenuOpen(false)
                                                delTask(index, column.id)
                                            }}
                                            id={styles.del_btn_icon}
                                            className='task_del_btn' />
                                    </div>
                                    <div className={styles.KanbanBoardDesk_column_tasksList_item_textContainer}>
                                        <div className={styles.KanbanBoardDesk_column_tasksList_item_text}>
                                            <p>{task}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul className={`${styles.KanbanBoardDesk_column_tasksList} ${styles.clear}`}>
                            <li className={styles.KanbanBoardDesk_column_tasksList_item}><p>Создай новую задачу</p></li>
                        </ul>
                    )}
                </div>
            </div >
        ))
    );
}