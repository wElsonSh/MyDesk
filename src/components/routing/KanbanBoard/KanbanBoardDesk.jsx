import styles from "@/styles/components/routing/KanbanBoard.module.scss";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
export function KanbanBoardDesk({ ArrDesk, DeskId, createdNewDesk }) {
    if (ArrDesk.length === 0) {
        return null;
    }
    else {
        var indexDeskId = 0
        for (let i = 0; i in ArrDesk; i++) {
            if (ArrDesk[i].id == DeskId) {
                indexDeskId = i
            }
        }

        const ArrDeskColumns = [...ArrDesk[indexDeskId].columns]
        const [isInpuCtVisible, setInputCVisible] = useState(false)
        const inpurCRef = useRef(null)
        const [cInputValue, setCInputValue] = useState('')
        const scrollRef = useRef(null)

        const handleScrollWheel = (e) => {
            if (scrollRef.current) {
                e.preventDefault()
                scrollRef.current.scrollLeft += e.deltaY;
            }
        }

        const handleCInputBlur = () => {
            setInputCVisible(false)
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
                setInputCVisible(false)
            }
        }
        useEffect(() => {
            if (isInpuCtVisible && inpurCRef.current) {
                inpurCRef.current.focus()
            } else {
                setCInputValue('')
            }
        }, [isInpuCtVisible])
        const handleCInputOnChange = (item) => {
            setCInputValue(item.target.value)
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
                                        <div className={styles.KanbanBoardDesk_column_container}>
                                            <div className={styles.KanbanBoardDesk_column_title}>
                                                <p>{column}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                        }
                        <div onClick={() => {
                            setInputCVisible(true)
                        }} className={styles.KanbanBoardDesk_column_creator}>
                            <div className={styles.KanbanBoardDesk_column_creator_container}>
                                <span style={{ display: isInpuCtVisible ? 'none' : 'flex' }} className={styles.KanbanBoardDesk_column_creator_btn}>Create new column<FaPlus /></span>
                                <span style={{ display: isInpuCtVisible ? 'block' : 'none' }} className={styles.KanbanBoardDesk_column_creator_input}>
                                    <input
                                        onChange={handleCInputOnChange} value={cInputValue}
                                        onKeyDown={handleCInputKeyDown}
                                        ref={inpurCRef}
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
}