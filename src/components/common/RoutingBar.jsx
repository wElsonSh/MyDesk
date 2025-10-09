import styles from "@/styles/components/common/RoutingBar.module.scss";
import { FaTasks } from "react-icons/fa";
import { LuNotebookPen } from "react-icons/lu";
import { MdMoreHoriz } from "react-icons/md";
import { NavLink } from 'react-router-dom';


export function RoutingBar() {
    return (
        <div className={styles.routingBar}>
            <div className={styles.routingBar_title}>
                <h1><a href="/">MyDesk</a></h1>
            </div>
            <nav className={styles.routingBar_container}>
                <h5>Tools:</h5>
                <ul className={styles.routingBar_list}>
                    <li className={styles.routingBar_list_item}>
                        <NavLink className={styles.routingBar_list_item_NavLink} index to='/taskscontroller'><FaTasks />Kanban board</NavLink>
                    </li>
                    <li className={styles.routingBar_list_item}>
                        <NavLink className={styles.routingBar_list_item_NavLink} to='/diary'><LuNotebookPen /> Diary</NavLink>
                    </li>
                    <li className={styles.routingBar_list_item}>
                        <NavLink className={styles.routingBar_list_item_NavLink} to='/others'><MdMoreHoriz />Others</NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
}