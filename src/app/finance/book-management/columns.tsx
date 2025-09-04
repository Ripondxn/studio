
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { JournalEntry } from "./data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { useAuthorization } from "@/context/permission-context"
import { updateJournalEntryStatus } from "./actions"


export const columns: ColumnDef<JournalEntry>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "debitAccountId",
    header: "Debit Account",
  },
  {
    accessorKey: "creditAccountId",
    header: "Credit Account",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "default";

      switch (status) {
        case "PENDING_ADMIN_APPROVAL":
          variant = "secondary";
          break;
        case "PENDING_SUPER_ADMIN_APPROVAL":
          variant = "outline";
          break;
        case "POSTED":
          variant = "default";
          break;
        case "DRAFT":
        default:
          variant = "destructive";
          break;
      }

      return <Badge variant={variant}>{status}</Badge>;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const entry = row.original
      const { userRole } = useAuthorization();

      const handleUpdateStatus = async (status: JournalEntry['status']) => {
        await updateJournalEntryStatus(entry.id, status);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {userRole === 'Admin' && entry.status === 'DRAFT' && (
              <DropdownMenuItem onClick={() => handleUpdateStatus('PENDING_SUPER_ADMIN_APPROVAL')}>
                Request Super Admin Approval
              </DropdownMenuItem>
            )}
            {userRole === 'Super Admin' && entry.status === 'PENDING_SUPER_ADMIN_APPROVAL' && (
              <DropdownMenuItem onClick={() => handleUpdateStatus('POSTED')}>
                Post Journal Entry
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
