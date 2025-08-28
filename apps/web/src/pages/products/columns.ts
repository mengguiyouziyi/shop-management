import { ColumnDef } from "@tanstack/react-table"
import { Product } from "@/types"

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "商品名称",
  },
  {
    accessorKey: "category",
    header: "分类",
  },
  {
    accessorKey: "price",
    header: "价格",
    cell: ({ row }) => `¥${row.getValue('price')}`
  },
  {
    accessorKey: "stock",
    header: "库存",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">操作</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>编辑</DropdownMenuItem>
          <DropdownMenuItem>删除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]