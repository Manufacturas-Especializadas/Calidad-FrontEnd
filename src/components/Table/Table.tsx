import DataTable, { type TableColumn } from "react-data-table-component";

interface Props<T extends { id?: number | string }> {
    columns: TableColumn<T>[];
    data: T[];
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onView?: (row: T) => void;
    onRowClicked?: (row: T) => void;
    title?: string;
    loading?: boolean;
    pagination?: boolean;
    selectableRows?: boolean;
    actionLoading?: number | string | null;
}

export const Table = <T extends { id?: number | string }>({
    columns,
    data,
    onEdit,
    onDelete,
    onView,
    title,
    loading = false,
    pagination = true,
    selectableRows = false,
    onRowClicked,
    actionLoading,
}: Props<T>) => {
    const getRowId = (row: T): number | string | undefined => {
        return row.id !== undefined ? row.id : undefined;
    };

    const actionColumn: TableColumn<T> | null = onEdit || onDelete || onView
        ? {
            name: "Acciones",
            cell: (row: T) => {
                const rowId = getRowId(row);

                return (
                    <div className="flex gap-2">
                        {onView && (
                            <ActionButton
                                label="Detalles"
                                color="blue"
                                onClick={() => onView(row)}
                                loading={actionLoading === rowId}
                                disabled={actionLoading !== null && actionLoading !== rowId}
                            />
                        )}
                        {onEdit && (
                            <ActionButton
                                label="Editar"
                                color="orange"
                                onClick={() => onEdit(row)}
                                loading={actionLoading === rowId}
                                disabled={actionLoading !== null && actionLoading !== rowId}
                            />
                        )}
                        {onDelete && (
                            <ActionButton
                                label="Eliminar"
                                color="red"
                                onClick={() => onDelete(row)}
                                loading={actionLoading === rowId}
                                disabled={actionLoading !== null && actionLoading !== rowId}
                            />
                        )}
                    </div>
                );
            },
            ignoreRowClick: true,
            width: "200px",
            center: true,
        }
        : null;

    const finalColumns = actionColumn ? [...columns, actionColumn] : columns;

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: "#0071ab",
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
                padding: "12px",
                letterSpacing: "0.5px"
            },
        },
        cells: {
            style: {
                padding: "12px",
                fontSize: "14px",
                color: "#333"
            }
        },
        rows: {
            style: {
                minHeight: "50px",
                transition: "background-color 0.2s ease",
                "&:nth-child(even)": {
                    backgroundColor: "rgba(0, 164, 228, 0.05)",
                },
                "&:hover": {
                    backgroundColor: "rgba(0, 142, 212, 0.1)",
                    cursor: onRowClicked ? "pointer" : "default",
                },
            },
        },
        pagination: {
            style: {
                borderTop: "none",
                justifyContent: "center",
                marginTop: "16px",
                padding: "8px 0",
            }
        }
    };


    return (
        <div className="space-y-4">
            {title && (
                <h3 className="text-xl font-bold text-primary-700 mb-6">
                    {title}
                </h3>
            )}

            <DataTable
                highlightOnHover
                columns={finalColumns}
                data={data}
                customStyles={customStyles}
                progressPending={loading}
                pagination={pagination}
                selectableRows={selectableRows}
                onRowClicked={onRowClicked}
                pointerOnHover={!!onRowClicked}
                noDataComponent={
                    <div className="py-8 text-center text-gray-500 text-sm">
                        No hay datos disponibles
                    </div>
                }
                responsive
            />
        </div>
    );
};

const ActionButton = ({
    label,
    color,
    onClick,
    loading,
    disabled,
}: {
    label: string;
    color: "blue" | "orange" | "red";
    onClick: () => void;
    loading: boolean | undefined;
    disabled: boolean;
}) => {
    const colors = {
        blue: "bg-blue-600 hover:bg-blue-700 text-white",
        orange: "bg-orange-500 hover:bg-orange-600 text-white",
        red: "bg-red-500 hover:bg-red-600 text-white",
    };

    const baseClasses = "px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 flex items-center gap-1";

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${colors[color]} ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""} hover:cursor-pointer`}
            aria-label={label}
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cargando...
                </>
            ) : (
                label
            )}
        </button>
    );
};

export type { Props };