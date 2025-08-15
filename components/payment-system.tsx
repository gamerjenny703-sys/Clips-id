"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  CreditCard,
  DollarSign,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Lock,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"

interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "bank" | "crypto"
  name: string
  details: string
  isDefault: boolean
  isVerified: boolean
}

interface Transaction {
  id: string
  type: "deposit" | "payout" | "fee" | "refund"
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "cancelled"
  description: string
  contestId?: string
  contestTitle?: string
  createdAt: string
  completedAt?: string
  method: string
}

interface PaymentSystemProps {
  userType: "creator" | "user"
  onPaymentComplete?: (transaction: Transaction) => void
}

export default function PaymentSystem({ userType, onPaymentComplete }: PaymentSystemProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string>("")

  const paymentMethods: PaymentMethod[] = [
    {
      id: "1",
      type: "card",
      name: "Visa ending in 4242",
      details: "Expires 12/25",
      isDefault: true,
      isVerified: true,
    },
    {
      id: "2",
      type: "paypal",
      name: "PayPal Account",
      details: "user@example.com",
      isDefault: false,
      isVerified: true,
    },
    {
      id: "3",
      type: "bank",
      name: "Bank Account",
      details: "****1234",
      isDefault: false,
      isVerified: false,
    },
  ]

  const transactions: Transaction[] = [
    {
      id: "txn_1",
      type: "deposit",
      amount: 500,
      currency: "USD",
      status: "completed",
      description: "Contest deposit for Best Gaming Highlights",
      contestId: "contest_1",
      contestTitle: "Best Gaming Highlights",
      createdAt: "2024-01-20T10:00:00Z",
      completedAt: "2024-01-20T10:02:00Z",
      method: "Visa ****4242",
    },
    {
      id: "txn_2",
      type: "payout",
      amount: 300,
      currency: "USD",
      status: "pending",
      description: "Contest winnings payout",
      contestId: "contest_2",
      contestTitle: "Funny Moments Compilation",
      createdAt: "2024-01-19T15:30:00Z",
      method: "PayPal",
    },
    {
      id: "txn_3",
      type: "fee",
      amount: 25,
      currency: "USD",
      status: "completed",
      description: "Platform fee (5%)",
      createdAt: "2024-01-18T12:15:00Z",
      completedAt: "2024-01-18T12:15:00Z",
      method: "Visa ****4242",
    },
  ]

  const balance = {
    available: 1247.5,
    pending: 300.0,
    total: 1547.5,
  }

  const handlePayment = async (amount: number, contestId?: string) => {
    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        type: userType === "creator" ? "deposit" : "payout",
        amount,
        currency: "USD",
        status: "completed",
        description: userType === "creator" ? "Contest deposit" : "Contest winnings",
        contestId,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        method: selectedMethod || "Visa ****4242",
      }

      onPaymentComplete?.(newTransaction)
      console.log("[v0] Payment processed:", newTransaction)
    } catch (error) {
      console.error("[v0] Payment failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const PaymentMethodIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-4 w-4" />
      case "paypal":
        return <Wallet className="h-4 w-4" />
      case "bank":
        return <DollarSign className="h-4 w-4" />
      case "crypto":
        return <Lock className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-primary" />
      case "pending":
        return <Clock className="h-4 w-4 text-accent" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Available Balance</span>
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div className="text-3xl font-bold">${balance.available.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for withdrawal</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Pending</span>
              <Clock className="h-4 w-4 text-accent" />
            </div>
            <div className="text-3xl font-bold">${balance.pending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Processing payouts</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Total Earnings</span>
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </div>
            <div className="text-3xl font-bold">${balance.total.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Tabs */}
      <Card className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Payment Management</CardTitle>
          <CardDescription>Manage your payments, methods, and transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-muted border-2 border-border">
              <TabsTrigger value="overview" className="font-bold">
                Overview
              </TabsTrigger>
              <TabsTrigger value="methods" className="font-bold">
                Payment Methods
              </TabsTrigger>
              <TabsTrigger value="transactions" className="font-bold">
                Transactions
              </TabsTrigger>
              <TabsTrigger value="settings" className="font-bold">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {userType === "creator" ? (
                <Card className="border-2 border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Deposit Funds</CardTitle>
                    <CardDescription>Add funds to create contests and pay winners</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="deposit-amount">Amount</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="deposit-amount"
                            type="number"
                            placeholder="500.00"
                            className="border-2 bg-background pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                          <SelectTrigger className="border-2 bg-background">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((method) => (
                              <SelectItem key={method.id} value={method.id}>
                                <div className="flex items-center gap-2">
                                  <PaymentMethodIcon type={method.type} />
                                  {method.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Alert className="border-2 border-primary bg-primary/10">
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Funds are held in escrow until contest completion. A 5% platform fee applies.
                      </AlertDescription>
                    </Alert>
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                      disabled={isProcessing}
                      onClick={() => handlePayment(500)}
                    >
                      {isProcessing ? "Processing..." : "Deposit Funds"}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Withdraw Earnings</CardTitle>
                    <CardDescription>Transfer your contest winnings to your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="withdraw-amount">Amount</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="withdraw-amount"
                            type="number"
                            placeholder={balance.available.toString()}
                            max={balance.available}
                            className="border-2 bg-background pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Withdrawal Method</Label>
                        <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                          <SelectTrigger className="border-2 bg-background">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods
                              .filter((m) => m.isVerified)
                              .map((method) => (
                                <SelectItem key={method.id} value={method.id}>
                                  <div className="flex items-center gap-2">
                                    <PaymentMethodIcon type={method.type} />
                                    {method.name}
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Alert className="border-2 border-accent bg-accent/10">
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        Withdrawals typically process within 1-3 business days. Minimum withdrawal: $10.
                      </AlertDescription>
                    </Alert>
                    <Button
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                      disabled={isProcessing || balance.available < 10}
                      onClick={() => handlePayment(balance.available)}
                    >
                      {isProcessing ? "Processing..." : "Withdraw Funds"}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="methods" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Payment Methods</h3>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                  Add Method
                </Button>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className="border-2 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <PaymentMethodIcon type={method.type} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{method.name}</span>
                              {method.isDefault && (
                                <Badge variant="secondary" className="text-xs">
                                  Default
                                </Badge>
                              )}
                              {method.isVerified ? (
                                <Badge className="text-xs bg-primary text-primary-foreground">Verified</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  Pending
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{method.details}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-2 bg-transparent">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="border-2 bg-transparent text-destructive">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Transaction History</h3>
                <Button variant="outline" className="border-2 bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <Card key={transaction.id} className="border-2 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg">
                            {transaction.type === "deposit" || transaction.type === "fee" ? (
                              <ArrowDownLeft className="h-4 w-4 text-destructive" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{transaction.description}</span>
                              <StatusIcon status={transaction.status} />
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{transaction.method}</span>
                              <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                              {transaction.contestTitle && (
                                <span className="text-primary">{transaction.contestTitle}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${
                              transaction.type === "deposit" || transaction.type === "fee"
                                ? "text-destructive"
                                : "text-primary"
                            }`}
                          >
                            {transaction.type === "deposit" || transaction.type === "fee" ? "-" : "+"}$
                            {transaction.amount.toFixed(2)}
                          </div>
                          <Badge
                            variant={transaction.status === "completed" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Payment Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="font-bold">Auto-withdraw earnings</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically withdraw earnings when they reach $100
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="font-bold">Email notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notified about payments and transactions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="font-bold">Two-factor authentication</Label>
                      <p className="text-sm text-muted-foreground">Require 2FA for withdrawals over $500</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-2 border-primary bg-primary/10">
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Your payment information is encrypted and secure. We never store your full card details.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full border-2 bg-transparent">
                      <Eye className="mr-2 h-4 w-4" />
                      View Security Log
                    </Button>
                    <Button variant="outline" className="w-full border-2 bg-transparent">
                      <Lock className="mr-2 h-4 w-4" />
                      Change Payment PIN
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
