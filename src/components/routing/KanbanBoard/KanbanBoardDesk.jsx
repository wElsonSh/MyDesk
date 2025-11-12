import { KanbanBoardDeskColumns } from "@/components/routing/KanbanBoard/KanbanBoardDeskColumns";
import { KanbanBoardContext } from '@/context/KanbanBoardContext.jsx';
import styles from "@/styles/components/routing/KanbanBoard.module.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
export function KanbanBoardDesk() {

    const { currentBoard, selectedBoardId, addColumnToBoard } = useContext(KanbanBoardContext);

    const ArrDeskColumns = [...(currentBoard?.columns || [])];

    const [isInpuCtVisible, seIstInputCVisible] = useState(false)
    const inputCRef = useRef(null)
    const [cInputValue, setCInputValue] = useState('')
    const handleCInputBlur = () => {
        seIstInputCVisible(false)
    }
    const handleCInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (cInputValue.trim() != '') {
                addColumnToBoard(selectedBoardId, cInputValue)
            } else {
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


    return (
        <div className={styles.KanbanBoardDesk}>
            <div className={styles.KanbanBoardDesk_container}>
                <div className={styles.KanbanBoardDesk_columns_list}>
                    {
                        ArrDeskColumns.length === 0 ? (
                            null
                        ) : (
                            <KanbanBoardDeskColumns columns={ArrDeskColumns} />
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