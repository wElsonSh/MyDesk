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

    // Selected board id with persistence
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

        setBoardsArr(prev => prev.filter(b => b.id !== Number(selectedBoardId)))
        setSelectedBoardId(null)
    }



    const delColumn = (idColumn) => {
        setBoardsArr(prev => {
            const boardIndex = prev.findIndex(b => b.id === selectedBoardId);
            if (boardIndex < 0) {
                return prev;
            }
            const board = prev[boardIndex];
            const newColumns = (board.columns || []).filter(c => c.id !== Number(idColumn));
            // If nothing changes, return prev to avoid unnecessary updates
            if (newColumns.length === (board.columns || []).length) {
                return prev;
            }
            const updatedBoard = { ...board, columns: newColumns };
            // Rebuild array with updated board immutably
            return prev.map((b, idx) => (idx === boardIndex ? updatedBoard : b));
        })
    }

    const value = {
        BoardsArr,
        currentBoard,
        selectedBoardId,
        createBoard,
        selectBoard,
        addColumnToBoard,
        addTask,
        delBoard,
        delColumn,
    };

    return (
        <KanbanBoardContext.Provider value={value}>
            {children}
        </KanbanBoardContext.Provider>
    );
}
