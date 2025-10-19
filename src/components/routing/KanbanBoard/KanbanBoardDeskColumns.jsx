import styles from "@/styles/components/routing/KanbanBoard.module.scss";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";

export function KanbanBoardDeskColumns({ ArrDeskColumns, createdNewTask }) {

    const [ArrDeskColumnTasks, setArrDeskColumnTasks] = useState(['Создай новую задачу'])

    if (ArrDeskColumns.tasks === undefined) {
        console.log(' ')
    } else {
        setArrDeskColumnTasks([])
        setArrDeskColumnTasks([...ArrDeskColumns.tasks])
    }

    // console.log(ArrDeskColumnTasks)

    const [isInputTVisible, setIsInputTVisible] = useState(false)
    const [tInputValue, setTInputValue] = useState('')
    const inputTRef = useRef([])
    const [tInputIndex, setTInputIndex] = useState(null)

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

    const handleTInputKeyDown = (event) => {
        if (event.key === "Enter") {
            if (tInputValue.trim() !== '') {
                createdNewTask(tInputValue)
            } else {
                console.log('Error')
            }
            setIsInputTVisible(false);
            setTInputValue('');
            setTInputIndex(null);
        }
    }
    return (
        ArrDeskColumns.map((column) => (
            <div key={column.id} className={styles.KanbanBoardDesk_column}>
                <div className={styles.KanbanBoardDesk_column_container}>

                    <div className={styles.KanbanBoardDesk_column_title_container}>

                        <div className={styles.KanbanBoardDesk_column_title}>
                            <p>{column.name}</p>
                        </div>
                        <div className={styles.KanbanBoardDesk_column_taskCreator_container}>
                            <span
                                onClick={() => { handleTInputVisible(column.id) }}
                                style={{ display: isInputTVisible && tInputIndex == column.id ? 'none' : 'flex' }}
                                className={styles.KanbanBoardDesk_column_taskCreator_btn}><p>Create new task</p> <FaPlus /></span>
                            <input
                                value={tInputValue}
                                onKeyDown={handleTInputKeyDown}
                                onChange={handleTInputOnChange}
                                onBlur={handleTInputBlur}
                                style={{ display: isInputTVisible && tInputIndex == column.id ? 'block' : 'none' }}
                                ref={setTInputRef(column.id)}
                                type="text" placeholder="task name"
                            />
                        </div>

                    </div>

                    {ArrDeskColumnTasks.map((task, index) => (
                        <ul key={index} className={`${styles.KanbanBoardDesk_column_tasksList} ${ArrDeskColumnTasks[0] == 'Создай новую задачу' ? (styles.clear) : (styles.no_clear)}`}>
                            <li className={styles.KanbanBoardDesk_column_tasksList_item}><p>{task}</p></li>
                        </ul>
                    ))}
                </div>
            </div>
        ))
    );
}