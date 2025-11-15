import { KanbanBoardTask } from '@/components/ui/KanbanBoard/KanbanBoardTask';
import { KanbanBoardContext } from '@/context/KanbanBoardContext.jsx';
import styles from "@/styles/components/routing/KanbanBoard/KanbanBoard.module.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
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
                className={styles.KanbanBoardDesk_column}
            >
                <div className={styles.KanbanBoardDesk_column_container}>

                    <div className={styles.KanbanBoardDesk_column_title_container}>

                        <div className={styles.KanbanBoardDesk_column_title}>
                            <p>{column.name}</p>
                            <divKanbanBoardDesk_column_tasksList
                                className={styles.KanbanBoardDesk_column_title_delContainer}>
                                <MdDelete
                                    onClick={() => {
                                        handleDelColumn(column.id)

                                    }}
                                    id={styles.delete_icon} />
                            </divKanbanBoardDesk_column_tasksList>
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
                                <KanbanBoardTask index={index} isTaskMenuOpen={isTaskMenuOpen} taskIndex={taskIndex} columnId={columnId} column={column} handleOpenTaskMenu={handleOpenTaskMenu} setIsTaskMenuOpen={setIsTaskMenuOpen} delTask={delTask} task={task} />
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