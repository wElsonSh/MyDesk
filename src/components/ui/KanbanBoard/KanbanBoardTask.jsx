import styles from "@/styles/components/ui/KanbanBoard/KanbanBoardTask.module.scss";
import { IoCloseSharp } from "react-icons/io5";
import { MdDelete, MdDragIndicator, MdMoreVert } from "react-icons/md";

export function KanbanBoardTask({ index, isTaskMenuOpen, taskIndex, columnId, column, handleOpenTaskMenu, setIsTaskMenuOpen, delTask, task }) {
    return (
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
                <div className={styles.task_editing_btnsContainer}
                    style={{ display: isTaskMenuOpen && taskIndex == index && columnId == column.id ? 'block' : 'none' }}>
                    <ul className={styles.task_editingList}>
                        <li className={styles.task_editingList_item}>
                            <MdDelete
                                style={{ display: isTaskMenuOpen && taskIndex == index && columnId == column.id ? 'block' : 'none' }}
                                onClick={() => {
                                    setIsTaskMenuOpen(false)
                                    delTask(index, column.id)
                                }}
                                id={styles.del_btn_icon}
                                className='task_del_btn' />
                        </li>
                        <li className={styles.task_editingList_item}>
                            <MdDragIndicator
                                style={{ display: isTaskMenuOpen && taskIndex == index && columnId == column.id ? 'block' : 'none' }}

                                id={styles.drag_btn_icon}
                            />
                        </li>
                        <li className={styles.task_editingList_item}>
                            <IoCloseSharp
                                style={{ display: isTaskMenuOpen && taskIndex == index && columnId == column.id ? 'block' : 'none' }}

                                onClick={() => {
                                    setIsTaskMenuOpen(false)
                                }}

                                id={styles.close_btn_icon}
                            />
                        </li>
                    </ul>
                </div>

            </div>
            <div className={styles.KanbanBoardDesk_column_tasksList_item_textContainer}>
                <div className={styles.KanbanBoardDesk_column_tasksList_item_text}>
                    <p>{task}</p>
                </div>
            </div>
        </li>
    );
}