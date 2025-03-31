"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText } from "lucide-react"
import { formatDate } from "@/lib/utils/format"

interface Invoice {
  id: string
  date: string
  amount: number
  status: "paid" | "pending" | "failed"
  description: string
}

export function BillingHistory() {
  const invoices: Invoice[] = [
    {
      id: "INV-001",
      date: "2023-03-01",
      amount: 29.99,
      status: "paid",
      description: "Professional Plan - Monthly",
    },
    {
      id: "INV-002",
      date: "2023-02-01",
      amount: 29.99,
      status: "paid",
      description: "Professional Plan - Monthly",
    },
    {
      id: "INV-003",
      date: "2023-01-01",
      amount: 29.99,
      status: "paid",
      description: "Professional Plan - Monthly",
    },
  ]

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100"
      case "pending":
        return "text-yellow-600 bg-yellow-100"
      case "failed":
        return "text-red-600 bg-red-100"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>View and download your past invoices</CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{formatDate(new Date(invoice.date))}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No billing history available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

