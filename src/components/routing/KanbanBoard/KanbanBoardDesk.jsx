import styles from "@/styles/components/routing/KanbanBoard.module.scss";
import { useRef } from "react";
export function KanbanBoardDesk({ ArrDesk, DeskId }) {

    const ArrDeskColumns = [...ArrDesk[DeskId - 1].columns]
    console.log(ArrDeskColumns)

    const scrollRef = useRef(null)
    const handleScrollWheel = (e) => {
        if (scrollRef.current) {
            e.preventDefault()
            scrollRef.current.scrollLeft += e.deltaY;
        }
    }
    return (
        <div className={styles.KanbanBoardDesk}>
            <div onWheel={handleScrollWheel} ref={scrollRef} className={styles.KanbanBoardDesk_container}>
                <ul className={styles.KanbanBoardDesk_list}>
                    {
                        ArrDeskColumns.length === 0 ? (
                            <li className={styles.KanbanBoardDesk_list_clear}>
                                Nothin list(
                            </li>
                        ) : (
                            ArrDeskColumns.map((column, index) => (
                                <li key={index} className={styles.KanbanBoardDesk_list_item}>
                                    {column}
                                </li>
                            ))
                        )
                    }

                </ul>
            </div>
        </div>
    );
}