"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentMethod {
  id: string
  type: "card"
  last4: string
  brand: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

export function PaymentMethods() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_1",
      type: "card",
      last4: "4242",
      brand: "visa",
      expMonth: 12,
      expYear: 2024,
      isDefault: true,
    },
  ])
  const [isAddCardOpen, setIsAddCardOpen] = useState(false)
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardholderName: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  })

  const handleDeleteCard = (id: string) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id))

    toast({
      title: "Payment method removed",
      description: "The payment method has been removed successfully.",
    })
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )

    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated.",
    })
  }

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newPaymentMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: "card",
        last4: newCard.cardNumber.slice(-4),
        brand: "visa", // In a real app, this would be determined by the payment processor
        expMonth: Number.parseInt(newCard.expMonth),
        expYear: Number.parseInt(newCard.expYear),
        isDefault: paymentMethods.length === 0,
      }

      setPaymentMethods((prev) => [...prev, newPaymentMethod])

      setNewCard({
        cardNumber: "",
        cardholderName: "",
        expMonth: "",
        expYear: "",
        cvc: "",
      })

      setIsAddCardOpen(false)
      setIsLoading(false)

      toast({
        title: "Payment method added",
        description: "Your new payment method has been added successfully.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods for billing</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-muted p-2 rounded">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expMonth.toString().padStart(2, "0")}/{method.expYear}
                      </p>
                      {method.isDefault && (
                        <Badge variant="outline" className="mt-1 bg-primary/10 text-primary">
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)}>
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCard(method.id)}
                      disabled={method.isDefault && paymentMethods.length > 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No payment methods found</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-end">
          <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
            <DialogTrigger asChild>
              <Button>Add Payment Method</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>Add a new credit or debit card for billing</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCard}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={newCard.cardNumber}
                      onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      value={newCard.cardholderName}
                      onChange={(e) => setNewCard({ ...newCard, cardholderName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expMonth">Expiry Month</Label>
                      <Select
                        value={newCard.expMonth}
                        onValueChange={(value) => setNewCard({ ...newCard, expMonth: value })}
                      >
                        <SelectTrigger id="expMonth">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                            <SelectItem key={month} value={month.toString()}>
                              {month.toString().padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expYear">Expiry Year</Label>
                      <Select
                        value={newCard.expYear}
                        onValueChange={(value) => setNewCard({ ...newCard, expYear: value })}
                      >
                        <SelectTrigger id="expYear">
                          <SelectValue placeholder="YY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={newCard.cvc}
                        onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddCardOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Card"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  )
}
