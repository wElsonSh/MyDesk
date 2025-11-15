import { RoutingBar } from "@/components/common/RoutingBar";
import { KanbanBoard } from "@/components/routing/KanbanBoard/KanbanBoard";
import styles from "@/styles/components/sections/Wrapper.module.scss";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

export function Wrapper() {
    return (
        <BrowserRouter>
            <main className={styles.wrapper}>
                <div className={styles.wrapper_container}>
                    <RoutingBar />
                    <section className={styles.wrapper_routingOutput}>
                        <Routes>
                            <Route
                                path="/taskscontroller/*"
                                element={<KanbanBoard />}
                            />
                            <Route path="/diary" element={'Obsidian'} />
                            <Route path="/others" element={'hello world'} />
                            <Route path="*" element={<Navigate to="/taskscontroller" replace />} />
                        </Routes>
                    </section>
                </div>
            </main>
        </BrowserRouter>
    );
}