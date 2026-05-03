import React from 'react';
import { Link } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2 } from 'lucide-react';

const DataTable = ({ 
    columns, 
    data, 
    pagination = null, 
    isLoading = false,
    emptyMessage = "Tidak ada data ditemukan"
}) => {
    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableHead 
                                    key={index} 
                                    className={column.className}
                                >
                                    {column.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <span className="text-sm text-muted-foreground">Memuat data...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <TableRow key={row.id || rowIndex}>
                                    {columns.map((column, colIndex) => (
                                        <TableCell key={colIndex} className={column.className}>
                                            {column.cell ? column.cell(row) : row[column.accessorKey]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && pagination.links && pagination.links.length > 3 && (
                <div className="flex items-center justify-between px-2 py-4">
                    <div className="text-sm text-muted-foreground">
                        Menampilkan {pagination.from ?? 0} sampai {pagination.to ?? 0} dari {pagination.total} data
                    </div>
                    <div className="flex items-center space-x-2">
                        {pagination.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                                    link.active 
                                        ? 'bg-primary text-white border-primary' 
                                        : link.url 
                                            ? 'bg-white hover:bg-gray-50 text-gray-700' 
                                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveScroll
                                preserveState
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
