import { createContext, useEffect, useMemo, useState } from "react";

export const KanbanBoardContext = createContext(null);

export function KanbanBoardContextComponent({ children }) {
    // Boards state with persistence
    const [BoardsArr, setBoardsArr] = useState(() => {
        try {
            const boards = localStorage.getItem("MyBoards");
            return boards ? JSON.parse(boards) : [];
        } catch {
            return [];
        }
    });

    const [selectedBoardId, setSelectedBoardId] = useState(() => {
        try {
            const id = localStorage.getItem("lastBoardId");
            return id !== null ? Number(id) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        localStorage.setItem("MyBoards", JSON.stringify(BoardsArr));
    }, [BoardsArr]);

    useEffect(() => {
        if (selectedBoardId === null || selectedBoardId === undefined) {
            localStorage.removeItem("lastBoardId");
        } else {
            localStorage.setItem("lastBoardId", String(selectedBoardId));
        }
    }, [selectedBoardId]);

    const currentBoard = useMemo(
        () => BoardsArr.find((b) => b.id === selectedBoardId) || null,
        [BoardsArr, selectedBoardId]
    );

    // Helpers
    const getNextBoardId = (boards) => {
        if (!boards.length) return 1;
        return Math.max(...boards.map((b) => Number(b.id) || 0)) + 1;
    };

    const getNextColumnId = (board) => {
        if (!board?.columns?.length) return 1;
        return (
            Math.max(
                ...board.columns.map((c) => (typeof c.id === "number" ? c.id : Number(c.id) || 0))
            ) + 1
        );
    };

    // Actions
    const createBoard = (name) => {
        const trimmed = String(name ?? "").trim();
        if (!trimmed) return;

        setBoardsArr((prev) => {
            const newId = getNextBoardId(prev);
            const newBoard = { id: newId, name: trimmed, columns: [] };
            const next = [...prev, newBoard];
            // select the newly created board
            setSelectedBoardId(newId);
            return next;
        });
    };

    const selectBoard = (id) => {
        if (id === undefined || id === null) return;
        setSelectedBoardId(Number(id));
    };

    const addColumnToBoard = (boardId, columnName) => {
        const trimmed = String(columnName ?? "").trim();
        if (!trimmed) return;

        setBoardsArr((prev) =>
            prev.map((b) => {
                if (b.id !== Number(boardId)) return b;
                const newColumn = { id: getNextColumnId(b), name: trimmed, tasks: [] };
                return { ...b, columns: [...(b.columns || []), newColumn] };
            })
        );
    };

    const addTask = (boardId, columnId, taskName) => {
        const trimmed = String(taskName ?? "").trim();
        if (!trimmed) return;

        setBoardsArr((prev) =>
            prev.map((b) => {
                if (b.id !== Number(boardId)) return b;
                return {
                    ...b,
                    columns: (b.columns || []).map((c) =>
                        c.id === Number(columnId) ? { ...c, tasks: [...(c.tasks || []), trimmed] } : c
                    ),
                };
            })
        );
    };
    const delBoard = () => {
        // Удаляем выбранную доску и на основе нового массива досок выставляем корректный selectedBoardId
        setBoardsArr((prev) => {
            const removedIndex = prev.findIndex((b) => b.id === Number(selectedBoardId));
            const nextBoards = prev.filter((b) => b.id !== Number(selectedBoardId));

            if (nextBoards.length === 0) {
                // Нет досок — сброс
                setSelectedBoardId(null);
                return nextBoards;
            }

            // Выбираем ближайший доступный индекс после удаления
            const fallbackIndex = Math.min(Math.max(removedIndex, 0), nextBoards.length - 1);
            const nextSelectedId = nextBoards[fallbackIndex]?.id ?? nextBoards[0].id;
            setSelectedBoardId(Number(nextSelectedId));

            return nextBoards;
        });
    }



    const delColumn = (idColumn) => {
        setBoardsArr(prev => {
            const boardIndex = prev.findIndex(b => b.id === selectedBoardId);
            // findIndex возвращает первый найденный индекс элемента массива, который удовлетворяет условию заданному в самом findIndex, в нашем случае это элемент чей id === selectedBoardId
            if (boardIndex < 0) {
                return prev;
                // в случае если findIndex не находит ни одного элемента удовлетворяющего условию он возвращает "-1" , поэтому если такое случается мы просто возвразаем предыдущее значение в setBoardsArr
            }
            const board = prev[boardIndex];
            // создаем новую переменну, в которую помещаем доску найденого элемента, сделано это просто для удобства, можно и не указывать
            const newColumns = (board.columns || []).filter(c => c.id !== Number(idColumn));
            // а здесь мы создаём новый список колонок, из которого выуживаем все колонки с нужным нам индекосм, такую процедуру мы уже проводили
            if (newColumns.length === (board.columns || []).length) {
                return prev;
                // здесь выполняем простейшую проверку на изменения, и говорим, что если ничего в плане длинны не изменилось, то в setBoardsArr возвращаем предыдущее значение
            }
            const updatedBoard = { ...board, columns: newColumns };
            // а здесь уже создаем новую, обновлённую доску с новым параметром columns, в который помещаем наш newColumns
            return prev.map((b, i) => (i === boardIndex ? updatedBoard : b));
            // а здесб точно также проводим проверку, если индекс == boardIndex то с помощью map вставляем updatedBoard, если же нет то прсото возвращаем жлемент и идем дальше
        })
    }

    const delTask = (indexTask, idColumn) => {
        setBoardsArr(prev => {
            const boardIndex = prev.findIndex(b => b.id === selectedBoardId);

            if (boardIndex < 0) {
                return prev
            }
            const board = prev[boardIndex];

            const columnIndex = (board.columns).findIndex(c => c.id === idColumn);

            const column = board.columns[columnIndex];

            const newTasks = (column.tasks || []).filter((e, i) => i !== Number(indexTask))

            if (newTasks.length === (column.tasks || []).length) {
                return prev;
            }
            const updatedColumn = { ...column, tasks: newTasks };

            const newColumns = board.columns.map((e, i) => (i === columnIndex ? updatedColumn : e));

            const updatedBoard = { ...board, columns: newColumns };

            return prev.map((b, i) => (i === boardIndex ? updatedBoard : b));

        })
    }

    const [isAlertVisible, setIsAlertVisible] = useState(false)
    const [nameAlert, setNameAlert] = useState("")

    const handleSetIsAlertVisible = (name) => {
        setIsAlertVisible(true)
        setNameAlert(name)
        setTimeout(() => {
            setIsAlertVisible(false)
        }, 2000)
    }

    const value = {
        BoardsArr,
        currentBoard,
        selectedBoardId,
        isAlertVisible,
        nameAlert,
        createBoard,
        selectBoard,
        addColumnToBoard,
        addTask,
        delColumn,
        delBoard,
        handleSetIsAlertVisible,
        delTask,
    };

    return (
        <KanbanBoardContext.Provider value={value}>
            {children}
        </KanbanBoardContext.Provider>
    );
}
