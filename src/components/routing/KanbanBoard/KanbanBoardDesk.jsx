import styles from "@/styles/components/routing/KanbanBoard.module.scss";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
export function KanbanBoardDesk({ ArrDesk, DeskId, createdNewDesk }) {
    var indexDeskId = 0
    for (let i = 0; i in ArrDesk; i++) {
        if (ArrDesk[i].id == DeskId) {
            indexDeskId = i
        }
    }

    const ArrDeskColumns = [...ArrDesk[indexDeskId].columns]
    const scrollRef = useRef(null)

    const handleScrollWheel = (e) => {
        if (scrollRef.current) {
            e.preventDefault()
            scrollRef.current.scrollLeft += e.deltaY;
        }
    }





    const [isInpuCtVisible, seIstInputCVisible] = useState(false)
    const inputCRef = useRef(null)
    const [cInputValue, setCInputValue] = useState('')
    const handleCInputBlur = () => {
        seIstInputCVisible(false)
    }
    const handleCInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (cInputValue.trim() != '') {
                let newDeskItem = {
                    id: DeskId,
                    name: ArrDesk[indexDeskId].name,
                    columns: [...ArrDesk[indexDeskId].columns, cInputValue],
                    index: indexDeskId
                }
                createdNewDesk(newDeskItem)
            }
            else {
                console.log('Error')
            }
            seIstInputCVisible(false)
        }
    }
    useEffect(() => {
        if (isInpuCtVisible && inputCRef.current) {
            inputCRef.current.focus()
        } else {
            setCInputValue('')
        }
    }, [isInpuCtVisible])
    const handleCInputOnChange = (item) => {
        setCInputValue(item.target.value)
    }


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
                // Здесь добавьте логику создания задачи
                console.log('Создаем задачу:', tInputValue, 'в колонке:', tInputIndex);
            }
            setIsInputTVisible(false);
            setTInputValue('');
            setTInputIndex(null);
        }
    }


    return (
        <div className={styles.KanbanBoardDesk}>
            <div onWheel={handleScrollWheel} ref={scrollRef} className={styles.KanbanBoardDesk_container}>
                <div className={styles.KanbanBoardDesk_columns_list}>
                    {
                        ArrDeskColumns.length === 0 ? (
                            null
                        ) : (
                            ArrDeskColumns.map((column, index) => (
                                <div key={index} className={styles.KanbanBoardDesk_column}>
                                    <ul className={styles.KanbanBoardDesk_column_container}>

                                        <div className={styles.KanbanBoardDesk_column_title_container}>

                                            <div className={styles.KanbanBoardDesk_column_title}>
                                                <p>{column}</p>
                                            </div>
                                            <div className={styles.KanbanBoardDesk_column_taskCreator_container}>
                                                <span
                                                    onClick={() => { handleTInputVisible(index) }}
                                                    style={{ display: isInputTVisible && tInputIndex == index ? 'none' : 'flex' }}
                                                    className={styles.KanbanBoardDesk_column_taskCreator_btn}><p>Create new task</p> <FaPlus /></span>
                                                <input
                                                    value={tInputValue}
                                                    onKeyDown={handleTInputKeyDown}
                                                    onChange={handleTInputOnChange}
                                                    onBlur={handleTInputBlur}
                                                    style={{ display: isInputTVisible && tInputIndex == index ? 'block' : 'none' }}
                                                    ref={setTInputRef(index)}
                                                    type="text" placeholder="task name"
                                                />
                                            </div>
                                        </div>
                                    </ul>
                                </div>
                            ))
                        )
                    }
                    <div onClick={() => {
                        seIstInputCVisible(true)
                    }} className={styles.KanbanBoardDesk_column_creator}>
                        <div className={styles.KanbanBoardDesk_column_creator_container}>
                            <span style={{ display: isInpuCtVisible ? 'none' : 'flex' }} className={styles.KanbanBoardDesk_column_creator_btn}>Create new column<FaPlus /></span>
                            <span style={{ display: isInpuCtVisible ? 'block' : 'none' }} className={styles.KanbanBoardDesk_column_creator_input}>
                                <input
                                    onChange={handleCInputOnChange}
                                    value={cInputValue}
                                    onKeyDown={handleCInputKeyDown}
                                    ref={inputCRef}
                                    onBlur={handleCInputBlur} type="text"
                                    placeholder="column name:"
                                />
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}