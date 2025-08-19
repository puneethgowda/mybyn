"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/supabase/client";
import {
  getAllCollabApplicationsOptions,
  useAcceptOrRejectApplicationMutation,
} from "@/utils/react-query/business/applications";
import { APPLICATION_STATUS } from "@/utils/enums";
import { formatDateForDisplay, timeAgo } from "@/utils/date";
import { ConfirmationModal } from "@/components/business/ConfirmationModal";

type CollabApplicationRow = {
  id: string;
  created_at: string;
  status: keyof typeof APPLICATION_STATUS | string;
  message: string | null;
  creator_profile: {
    name: string;
    instagram_handle: string;
    followers_count: number | null;
    profile_pic_url: string | null;
  } | null;
};

export default function ApplicantsDataTable({
  collabId,
  businessId,
}: {
  businessId: string;
  collabId: string;
}) {
  const supabase = createClient();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState<
    (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS] | "All"
  >("All");

  const page = pageIndex + 1;

  const { data: paged, isPending } = useQuery(
    getAllCollabApplicationsOptions(supabase, businessId, collabId, {
      page,
      pageSize,
      status,
    }),
  );

  const rows: CollabApplicationRow[] = useMemo(
    () => (paged?.data as unknown as CollabApplicationRow[]) ?? [],
    [paged],
  );
  const total = paged?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const acceptOrRejectApplicationMutation =
    useAcceptOrRejectApplicationMutation(supabase);

  const [confirmAccept, setConfirmAccept] = useState<{
    open: boolean;
    id: string | null;
    name: string;
  }>({ open: false, id: null, name: "" });

  const [confirmReject, setConfirmReject] = useState<{
    open: boolean;
    id: string | null;
    name: string;
  }>({ open: false, id: null, name: "" });

  const [messageDialog, setMessageDialog] = useState<{
    open: boolean;
    name: string;
    message: string;
  }>({ open: false, name: "", message: "" });

  const columns: ColumnDef<CollabApplicationRow>[] = [
    {
      header: "Name",
      accessorKey: "creator_profile.name",
      cell: ({ row }) => {
        const name = row.original.creator_profile?.name || "-";
        const handle = row.original.creator_profile?.instagram_handle;
        const pic = row.original.creator_profile?.profile_pic_url || "";
        const initials =
          name && name.trim().length > 0
            ? name
                .split(" ")
                .map((s) => s[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            : "IN";

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={pic} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{name}</span>
              {handle ? (
                <span className="text-xs text-muted-foreground">@{handle}</span>
              ) : null}
            </div>
          </div>
        );
      },
    },
    {
      header: "Followers",
      accessorKey: "creator_profile.followers_count",
      size: 120,
      cell: ({ row }) => {
        const followers = row.original.creator_profile?.followers_count ?? 0;

        return followers.toLocaleString();
      },
    },
    {
      header: "Applied",
      accessorKey: "created_at",
      size: 200,
      cell: ({ row }) => {
        const d = row.original.created_at;

        return (
          <div className="flex flex-col">
            <span className="">{formatDateForDisplay(d)}</span>
            <span className="text-xs text-muted-foreground">{timeAgo(d)}</span>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 120,
      cell: ({ row }) => {
        const s = String(row.original.status);
        const cls =
          s === APPLICATION_STATUS.ACCEPTED
            ? "bg-emerald-500 text-white"
            : s === APPLICATION_STATUS.REJECTED
              ? "bg-destructive text-destructive-foreground"
              : "bg-muted-foreground/40 text-foreground";

        return <Badge className={cn(cls)}>{s}</Badge>;
      },
    },
    {
      header: "Message",
      accessorKey: "message",
      cell: ({ row }) => {
        const msg = row.original.message || "-";
        const name = row.original.creator_profile?.name || "Applicant";
        const MAX_LEN = 20;
        const isLong = msg.length > MAX_LEN;
        const preview = isLong ? msg.slice(0, MAX_LEN).trimEnd() + "…" : msg;

        return (
          <div className="max-w-[440px] text-sm text-muted-foreground">
            <p className={isLong ? "line-clamp-2" : ""}>{preview}</p>
            {isLong ? (
              <Button
                className="h-auto p-0 text-xs mt-1"
                size="sm"
                variant="ghost"
                onClick={() =>
                  setMessageDialog({ open: true, name, message: msg })
                }
              >
                Read more
              </Button>
            ) : null}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      size: 60,
      cell: ({ row }) => {
        const app = row.original;
        const name = app.creator_profile?.name || "";

        if (app.status === APPLICATION_STATUS.PENDING) {
          return (
            <div className="flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setConfirmAccept({ open: true, id: app.id, name })
                }
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() =>
                  setConfirmReject({ open: true, id: app.id, name })
                }
              >
                Reject
              </Button>
            </div>
          );
        }

        if (app.status === APPLICATION_STATUS.ACCEPTED) {
          return (
            <div className="flex items-center justify-end gap-2">
              <Link href="/business/dashboard/messages">
                <Button size="sm" variant="outline">
                  Message
                </Button>
              </Link>
            </div>
          );
        }

        return (
          <div className="flex justify-end">
            <Badge variant="destructive">Rejected</Badge>
          </div>
        );
      },
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
    pageCount,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const next = updater({ pageIndex, pageSize });

        setPageIndex(next.pageIndex);
        setPageSize(next.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
  });

  const onConfirmAccept = () => {
    if (!confirmAccept.id) return;
    acceptOrRejectApplicationMutation.mutate({
      collabApplicationId: confirmAccept.id,
      status: APPLICATION_STATUS.ACCEPTED,
      collabId,
      businessId,
    });
  };

  const onConfirmReject = () => {
    if (!confirmReject.id) return;
    acceptOrRejectApplicationMutation.mutate({
      collabApplicationId: confirmReject.id,
      status: APPLICATION_STATUS.REJECTED,
      collabId,
      businessId,
    });
  };

  const statusOptions = useMemo(
    () => ["All", ...Object.values(APPLICATION_STATUS)],
    [],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">Applicants ({total})</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Select
              value={status}
              onValueChange={(value) => {
                setPageIndex(0);
                setStatus(
                  value as
                    | (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS]
                    | "All",
                );
              }}
            >
              <SelectTrigger className="w-[160px]" id="status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11"
                    style={{
                      width: header.getSize()
                        ? `${header.getSize()}px`
                        : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!isPending && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  {isPending ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <Label className="max-sm:sr-only" htmlFor="rows-per-page">
            Rows per page
          </Label>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageIndex(0);
              setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="" id="rows-per-page">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50].map((ps) => (
                <SelectItem key={ps} value={String(ps)}>
                  {ps}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-muted-foreground flex grow text-sm whitespace-nowrap">
            <p
              aria-live="polite"
              className="text-muted-foreground text-sm whitespace-nowrap"
            >
              <span className="text-foreground">
                {total === 0 ? 0 : pageIndex * pageSize + 1}-
                {Math.min((pageIndex + 1) * pageSize, total)}
              </span>{" "}
              of <span className="text-foreground">{total.toString()}</span>
            </p>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  aria-label="Prev page"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  disabled={pageIndex <= 0}
                  size="icon"
                  variant="outline"
                  onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                >
                  <ChevronLeftIcon aria-hidden="true" size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  aria-label="Next page"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  disabled={pageIndex + 1 >= pageCount}
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setPageIndex((p) => Math.min(pageCount - 1, p + 1))
                  }
                >
                  <ChevronRightIcon aria-hidden="true" size={16} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <ConfirmationModal
        cancelText="Cancel"
        confirmText="Yes, Accept"
        isOpen={confirmAccept.open}
        message={
          confirmAccept.name
            ? `Are you sure you want to accept ${confirmAccept.name}?`
            : "Are you sure you want to accept this application?"
        }
        title="Accept Application"
        onClose={() => setConfirmAccept({ open: false, id: null, name: "" })}
        onConfirm={onConfirmAccept}
      />
      <ConfirmationModal
        cancelText="Cancel"
        confirmText="Yes, Reject"
        isOpen={confirmReject.open}
        message={
          confirmReject.name
            ? `Are you sure you want to reject ${confirmReject.name}? This action is irreversible.`
            : "Are you sure you want to reject this application? This action is irreversible."
        }
        title="Reject Application"
        onClose={() => setConfirmReject({ open: false, id: null, name: "" })}
        onConfirm={onConfirmReject}
      />

      <Dialog
        open={messageDialog.open}
        onOpenChange={(open) =>
          !open && setMessageDialog((m) => ({ ...m, open: false }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message from {messageDialog.name}</DialogTitle>
            <DialogDescription>
              <div className="whitespace-pre-wrap text-foreground text-sm">
                {messageDialog.message}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
