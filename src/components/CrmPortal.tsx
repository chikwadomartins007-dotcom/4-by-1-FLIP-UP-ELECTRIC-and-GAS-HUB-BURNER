import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  RefreshCw,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Truck,
  Check,
  Phone,
  MessageCircle,
  Search,
  Filter,
  Shield,
  Zap,
  Settings,
  ListOrdered,
  FileText,
  Webhook,
  ExternalLink,
  ChevronRight,
  Eye,
  Trash2,
  DollarSign,
  Layers,
  ArrowUpRight,
  HelpCircle,
  Copy,
  CheckCheck,
} from "lucide-react";
import { CrmOrder, CrmStatusResponse, CapiLogEntry, OrderStatus } from "../types";
import { formatNaira } from "../utils/pricing";

interface CrmPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrmPortal: React.FC<CrmPortalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"orders" | "capi" | "logs" | "webhook">("orders");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Data state
  const [orders, setOrders] = useState<CrmOrder[]>([]);
  const [statusData, setStatusData] = useState<CrmStatusResponse | null>(null);
  const [logs, setLogs] = useState<CapiLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // CAPI Config form state
  const [pixelIdInput, setPixelIdInput] = useState<string>("");
  const [accessTokenInput, setAccessTokenInput] = useState<string>("");
  const [testEventCodeInput, setTestEventCodeInput] = useState<string>("");
  const [autoFireLead, setAutoFireLead] = useState<boolean>(true);
  const [autoFirePurchase, setAutoFirePurchase] = useState<boolean>(true);
  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);

  // Test event state
  const [isTestingCapi, setIsTestingCapi] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Selected Order for detail modal
  const [selectedOrder, setSelectedOrder] = useState<CrmOrder | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const fetchCrmData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [ordersRes, statusRes, logsRes] = await Promise.all([
        fetch("/api/crm/orders"),
        fetch("/api/crm/status"),
        fetch("/api/crm/logs?limit=40"),
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }

      if (statusRes.ok) {
        const stData = await statusRes.json();
        setStatusData(stData);
        if (stData.config) {
          setPixelIdInput(stData.config.pixelId || "");
          setTestEventCodeInput(stData.config.testEventCode || "");
          setAutoFireLead(stData.config.autoFireLeadOnOrder ?? true);
          setAutoFirePurchase(stData.config.autoFirePurchaseOnDelivery ?? true);
        }
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData.logs || []);
      }
    } catch (err: any) {
      console.error("Failed to load CRM data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchCrmData();
    }
  }, [isOpen, fetchCrmData]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    setActionMessage(null);
    try {
      const payload: any = {
        pixelId: pixelIdInput.trim(),
        testEventCode: testEventCodeInput.trim(),
        autoFireLeadOnOrder: autoFireLead,
        autoFirePurchaseOnDelivery: autoFirePurchase,
      };
      if (accessTokenInput.trim()) {
        payload.accessToken = accessTokenInput.trim();
      }

      const res = await fetch("/api/crm/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: "success", text: "Meta Conversions API settings updated and saved!" });
        setAccessTokenInput("");
        fetchCrmData();
      } else {
        setActionMessage({ type: "error", text: data.error || "Failed to update configuration" });
      }
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Network error" });
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleSendTestEvent = async (eventName: "TestEvent" | "Purchase" | "Lead" = "TestEvent") => {
    setIsTestingCapi(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/crm/test-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName,
          testEventCode: testEventCodeInput.trim(),
        }),
      });
      const data = await res.json();
      setTestResult(data);
      fetchCrmData();
    } catch (err: any) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setIsTestingCapi(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/crm/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          noteText: `Status updated to ${newStatus.replace("_", " ").toUpperCase()}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (newStatus === "delivered_paid") {
          setActionMessage({
            type: "success",
            text: `Order ${orderId} marked as Delivered & Paid! Meta Conversions API Purchase Event automatically dispatched.`,
          });
        }
        fetchCrmData();
      }
    } catch (err: any) {
      console.error("Failed to update status:", err);
    }
  };

  const handleManualCapiSend = async (orderId: string, eventType: "Purchase" | "Lead") => {
    try {
      const res = await fetch(`/api/crm/orders/${orderId}/send-capi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({
          type: "success",
          text: `Meta CAPI ${eventType} event dispatched for Order ${orderId}!`,
        });
        fetchCrmData();
      } else {
        setActionMessage({ type: "error", text: data.error || "Failed to dispatch CAPI event" });
      }
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to remove order ${orderId} from CRM?`)) return;
    try {
      const res = await fetch(`/api/crm/orders/${orderId}`, { method: "DELETE" });
      if (res.ok) {
        fetchCrmData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.customer_name?.toLowerCase().includes(q) ||
      o.customer_phone?.includes(q) ||
      o.order_reference?.toLowerCase().includes(q) ||
      o.state?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "delivered_paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Check className="w-3 h-3 stroke-[3]" />
            Delivered & Paid
          </span>
        );
      case "in_transit":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Truck className="w-3 h-3" />
            In Transit
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
            <X className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3" />
            Pending Confirmation
          </span>
        );
    }
  };

  const webhookUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/api/crm/webhook`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden text-slate-100">
        
        {/* 1. Header Bar */}
        <div className="px-4 sm:px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-[#C5A059] flex items-center justify-center text-white shadow-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-base sm:text-lg text-white tracking-tight">
                  CRM & Meta Conversions API Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Direct Server Connection
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Order fulfillment management & Server-to-Server Meta CAPI synchronization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchCrmData}
              disabled={isLoading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh CRM data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Portal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Top Executive Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-slate-950/60 border-b border-slate-800/80 text-xs">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-400 block">Total Orders</span>
            <span className="text-xl font-heading font-black text-white">
              {statusData?.stats?.totalOrders ?? orders.length}
            </span>
            <span className="text-[10px] text-amber-400 block mt-0.5">
              {statusData?.stats?.pendingCount ?? 0} Pending Confirmation
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-400 block">Delivered Revenue</span>
            <span className="text-xl font-heading font-black text-emerald-400">
              ₦{(statusData?.stats?.totalRevenue ?? 0).toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">
              {statusData?.stats?.deliveredOrders ?? 0} Delivered Units
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-400 block">Meta CAPI Leads</span>
            <span className="text-xl font-heading font-black text-blue-400">
              {statusData?.stats?.capiLeadsSent ?? 0}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Auto-tracked on form submit
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">CAPI Purchases</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  statusData?.config?.hasAccessToken ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
            </div>
            <span className="text-xl font-heading font-black text-[#E5C378]">
              {statusData?.stats?.capiPurchasesSent ?? 0}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {statusData?.config?.hasAccessToken ? "Token Connected ✓" : "Offline / Logged"}
            </span>
          </div>
        </div>

        {/* Action notification banner */}
        {actionMessage && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-between ${
              actionMessage.type === "success"
                ? "bg-emerald-950/80 border-b border-emerald-800 text-emerald-200"
                : "bg-red-950/80 border-b border-red-800 text-red-200"
            }`}
          >
            <span>{actionMessage.text}</span>
            <button
              type="button"
              onClick={() => setActionMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 3. Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-slate-800 bg-slate-950/30 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "orders"
                ? "border-emerald-500 text-emerald-400 bg-slate-800/40 rounded-t-lg"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Orders Pipeline ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("capi")}
            className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "capi"
                ? "border-[#C5A059] text-[#E5C378] bg-slate-800/40 rounded-t-lg"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Meta Conversions API Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "logs"
                ? "border-blue-500 text-blue-400 bg-slate-800/40 rounded-t-lg"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>CAPI Transmission Logs ({logs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("webhook")}
            className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "webhook"
                ? "border-purple-500 text-purple-400 bg-slate-800/40 rounded-t-lg"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Webhook className="w-4 h-4" />
            <span>External Webhook</span>
          </button>
        </div>

        {/* 4. Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900">
          
          {/* TAB 1: ORDERS CRM */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {/* Search & Filter Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by customer name, phone, order ref, state..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">All Statuses ({orders.length})</option>
                    <option value="pending_confirmation">Pending Confirmation</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered_paid">Delivered & Paid (Purchase Fired)</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-3">Order Ref</th>
                        <th className="py-3 px-3">Customer Details</th>
                        <th className="py-3 px-3">Location & Delivery</th>
                        <th className="py-3 px-3">Items / Value</th>
                        <th className="py-3 px-3">Fulfillment Status</th>
                        <th className="py-3 px-3">Meta CAPI Sync</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                            No orders found matching this filter.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => {
                          const cleanPhone = order.customer_phone?.replace(/\D/g, "") || "";
                          const waPhone = cleanPhone.startsWith("0") ? `234${cleanPhone.substring(1)}` : cleanPhone;
                          const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
                            `Hello ${order.customer_name}, this is MAX Luxury Bathrooms regarding your order ${order.order_reference} for the 5-Burner Built-In Cooktop.`
                          )}`;

                          return (
                            <tr key={order.id} className="hover:bg-slate-900/60 transition-colors">
                              {/* Order Ref & Source */}
                              <td className="py-3 px-3 font-mono font-bold text-white">
                                <div>{order.order_reference}</div>
                                <span className="text-[10px] text-slate-500 font-sans font-normal block">
                                  {new Date(order.created_at).toLocaleDateString("en-NG", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </td>

                              {/* Customer Details */}
                              <td className="py-3 px-3">
                                <div className="font-bold text-slate-200">{order.customer_name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <a
                                    href={`tel:${order.customer_phone}`}
                                    className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>{order.customer_phone}</span>
                                  </a>
                                  <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 rounded bg-emerald-950 text-emerald-400 hover:bg-emerald-900"
                                    title="Open WhatsApp chat with customer"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                  </a>
                                </div>
                                {order.customer_email && (
                                  <span className="text-[10px] text-slate-500 block truncate max-w-[160px]">
                                    {order.customer_email}
                                  </span>
                                )}
                              </td>

                              {/* Location */}
                              <td className="py-3 px-3">
                                <span className="font-semibold text-slate-300 block">{order.state}</span>
                                <span className="text-[11px] text-slate-400 block line-clamp-1 max-w-[200px]" title={order.delivery_address}>
                                  {order.delivery_address}
                                </span>
                              </td>

                              {/* Amount & Items */}
                              <td className="py-3 px-3">
                                <div className="font-extrabold text-[#E5C378]">
                                  ₦{order.total_amount?.toLocaleString()}
                                </div>
                                <span className="text-[10px] text-slate-400 block">
                                  Qty: {order.quantity} unit{order.quantity > 1 ? "s" : ""}
                                </span>
                              </td>

                              {/* Fulfillment Status & Dropdown */}
                              <td className="py-3 px-3">
                                <div className="mb-1">{getStatusBadge(order.status)}</div>
                                <select
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                  className="text-[11px] py-1 px-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none focus:border-emerald-500"
                                >
                                  <option value="pending_confirmation">Pending Confirmation</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="in_transit">In Transit</option>
                                  <option value="delivered_paid">Delivered & Paid (Auto CAPI)</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>

                              {/* Meta CAPI Sync Status */}
                              <td className="py-3 px-3">
                                <div className="flex flex-col gap-1 text-[10px]">
                                  {/* Lead event */}
                                  <span
                                    className={`inline-flex items-center gap-1 font-semibold ${
                                      order.capi_events?.lead?.sent ? "text-emerald-400" : "text-slate-500"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        order.capi_events?.lead?.sent ? "bg-emerald-400" : "bg-slate-600"
                                      }`}
                                    />
                                    Lead: {order.capi_events?.lead?.sent ? "Sent ✓" : "Pending"}
                                  </span>

                                  {/* Purchase event */}
                                  <span
                                    className={`inline-flex items-center gap-1 font-semibold ${
                                      order.capi_events?.purchase?.sent ? "text-[#E5C378]" : "text-slate-500"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        order.capi_events?.purchase?.sent ? "bg-[#E5C378]" : "bg-slate-600"
                                      }`}
                                    />
                                    Purchase: {order.capi_events?.purchase?.sent ? "Dispatched ⚡" : "Awaiting Delivery"}
                                  </span>
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Trigger CAPI Purchase manually */}
                                  <button
                                    type="button"
                                    onClick={() => handleManualCapiSend(order.id, "Purchase")}
                                    className="p-1.5 rounded bg-slate-800 hover:bg-[#C5A059] text-slate-300 hover:text-black transition-colors"
                                    title="Manually trigger Meta CAPI Purchase event now"
                                  >
                                    <Zap className="w-3.5 h-3.5" />
                                  </button>
                                  
                                  <button
                                    type="button"
                                    onClick={() => setSelectedOrder(order)}
                                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                    title="View full order details & attribution"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className="p-1.5 rounded bg-slate-800 hover:bg-red-900 text-slate-400 hover:text-white transition-colors"
                                    title="Delete order"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: META CONVERSIONS API CONFIGURATION */}
          {activeTab === "capi" && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Connection Status Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      statusData?.config?.hasAccessToken
                        ? "bg-emerald-950 border border-emerald-500/40 text-emerald-400"
                        : "bg-amber-950 border border-amber-500/40 text-amber-400"
                    }`}
                  >
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-sm sm:text-base text-white">
                      Meta Conversions API (Graph API v19.0)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {statusData?.config?.hasAccessToken
                        ? "Active & Connected: Direct Server-to-Server tracking with SHA-256 data hashing."
                        : "Ready for Token: Running in local safe audit mode. Enter your Meta System User Access Token below to dispatch directly to Facebook Business Manager."}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 border ${
                    statusData?.config?.hasAccessToken
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}
                >
                  {statusData?.config?.hasAccessToken ? "Connected ✓" : "Offline / Needs Token"}
                </span>
              </div>

              {/* Form Settings */}
              <form onSubmit={handleSaveConfig} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#C5A059]" />
                  <span>Meta Pixel & Conversions API Credentials</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Meta Pixel ID (Dataset ID)
                  </label>
                  <input
                    type="text"
                    value={pixelIdInput}
                    onChange={(e) => setPixelIdInput(e.target.value)}
                    placeholder="e.g. 1690563088540181"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#C5A059] font-mono"
                    required
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Found in Meta Events Manager &gt; Data Sources &gt; Settings &gt; Dataset ID
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Meta System User Access Token (Conversions API)
                  </label>
                  <input
                    type="password"
                    value={accessTokenInput}
                    onChange={(e) => setAccessTokenInput(e.target.value)}
                    placeholder={
                      statusData?.config?.hasAccessToken
                        ? `Token currently saved (${statusData.config.accessTokenMasked}). Enter new token to change.`
                        : "Paste Meta Access Token (starts with EAAB...)"
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#C5A059] font-mono"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Generate in Meta Business Settings &gt; System Users &gt; Generate Token with <code>ads_management</code> &amp; <code>business_management</code> scopes, or Events Manager &gt; Settings &gt; Set up Conversions API &gt; Generate Access Token.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Meta Test Event Code (Optional, for Live Verification)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={testEventCodeInput}
                      onChange={(e) => setTestEventCodeInput(e.target.value)}
                      placeholder="e.g. TEST12345"
                      className="flex-1 min-w-[160px] px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#C5A059] font-mono uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendTestEvent("Purchase")}
                      disabled={isTestingCapi}
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm"
                      title="Send test Purchase event (₦280,000) to Meta Events Manager"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{isTestingCapi ? "Sending..." : "Test Purchase (₦280k)"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendTestEvent("Lead")}
                      disabled={isTestingCapi}
                      className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm"
                      title="Send test Lead event to Meta Events Manager"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isTestingCapi ? "Sending..." : "Test Lead"}</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Found in Meta Events Manager &gt; Test Events tab &gt; Test Server Events.
                  </span>
                </div>

                {/* Automation Toggles */}
                <div className="pt-3 border-t border-slate-800 space-y-2.5">
                  <span className="text-xs font-bold text-white block">Event Synchronization Automations:</span>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoFirePurchase}
                      onChange={(e) => setAutoFirePurchase(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        Auto-fire Meta CAPI "Purchase" event when order is marked "Delivered &amp; Paid"
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Sends exact customer phone/email hash and revenue amount (₦280,000+) to optimize Meta ad campaigns.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoFireLead}
                      onChange={(e) => setAutoFireLead(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        Auto-fire Meta CAPI "Lead" event on order form submission
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Server-to-server lead generation event with deduplication event ID.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSavingConfig}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{isSavingConfig ? "Saving..." : "Save Meta CAPI Configuration"}</span>
                  </button>
                </div>
              </form>

              {/* Test Result Box if tested */}
              {testResult && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Live Meta CAPI Test Result:
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        testResult.result?.success ? "bg-emerald-950 text-emerald-300" : "bg-amber-950 text-amber-300"
                      }`}
                    >
                      {testResult.result?.dispatched ? "Dispatched to Meta" : "Logged Server-Side"}
                    </span>
                  </div>
                  <pre className="p-3 rounded-lg bg-black text-[11px] font-mono text-emerald-300 overflow-x-auto">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}

              {/* Step by Step Guide */}
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 text-slate-300">
                <h5 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  <span>How to connect your Facebook Business Manager to this CRM:</span>
                </h5>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-400">
                  <li>
                    Open <strong className="text-white">Meta Events Manager</strong> and select your Pixel (Dataset ID: <code className="text-[#E5C378]">{statusData?.config?.pixelId}</code>).
                  </li>
                  <li>
                    Go to the <strong className="text-white">Settings</strong> tab and scroll down to <strong className="text-white">Conversions API</strong>.
                  </li>
                  <li>
                    Click <strong className="text-white">Generate Access Token</strong> under "Set up direct integration".
                  </li>
                  <li>
                    Copy the token and paste it into the field above, then click <strong className="text-white">Save Meta CAPI Configuration</strong>.
                  </li>
                  <li>
                    To test, copy your <strong className="text-white">Test Event Code</strong> from the "Test Events" tab, paste it above, and click <strong className="text-white">Send Test Event</strong>. You will immediately see events pop up in Events Manager!
                  </li>
                </ol>
              </div>

            </div>
          )}

          {/* TAB 3: TRANSMISSION LOGS */}
          {activeTab === "logs" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Recent Meta Conversions API events dispatched server-to-server:</span>
                <span>{logs.length} logs recorded</span>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/60 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Event Name</th>
                        <th className="py-2.5 px-3">Order Ref / Event ID</th>
                        <th className="py-2.5 px-3">Match Parameters Hashed</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Response</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                      {logs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-500 font-sans">
                            No CAPI transmission logs yet. Submit an order or send a test event to see live logs.
                          </td>
                        </tr>
                      ) : (
                        logs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-900/60">
                            <td className="py-2 px-3 text-slate-400 whitespace-nowrap">
                              {new Date(log.created_at).toLocaleTimeString()}
                            </td>
                            <td className="py-2 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  log.event_name === "Purchase"
                                    ? "bg-[#C5A059]/20 text-[#E5C378]"
                                    : log.event_name === "Lead"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-slate-800 text-slate-300"
                                }`}
                              >
                                {log.event_name}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-slate-300">
                              <div>{log.order_reference || "Direct"}</div>
                              <span className="text-[10px] text-slate-500 block truncate max-w-[180px]">
                                {log.event_id}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <div className="flex flex-wrap gap-1 font-sans text-[10px]">
                                {log.user_match_keys?.map((k) => (
                                  <span key={k} className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                                    {k}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-2 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                                  log.status === "dispatched"
                                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                    : log.status === "logged_offline"
                                    ? "bg-amber-950 text-amber-300 border border-amber-800"
                                    : "bg-red-950 text-red-300 border border-red-800"
                                }`}
                              >
                                {log.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 max-w-[200px] truncate text-slate-400">
                              {log.meta_response
                                ? JSON.stringify(log.meta_response)
                                : log.error_message || "—"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXTERNAL WEBHOOK INTEGRATION */}
          {activeTab === "webhook" && (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Webhook className="w-4 h-4 text-purple-400" />
                  <span>External CRM &amp; Logistics Webhook Receiver</span>
                </h4>
                <p className="text-xs text-slate-400">
                  If your business manages deliveries through Google Sheets, Zapier, Zoho, WooCommerce, or external courier dispatchers, send a POST request to this webhook whenever an order is delivered. It will automatically synchronize the CRM and trigger the Meta Conversions API Purchase event.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Inbound Webhook URL:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={webhookUrl}
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-[#E5C378] select-all"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(webhookUrl, "url")}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedText === "url" ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedText === "url" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sample JSON Payload:
                  </label>
                  <pre className="p-3 rounded-lg bg-black text-[11px] font-mono text-slate-300 overflow-x-auto">
{`{
  "order_reference": "MAX-849201",
  "status": "delivered_paid",
  "paid_amount": 280000
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Selected Order Detailed Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-5 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <span className="text-xs text-slate-400 font-mono">Order Details</span>
                <h4 className="font-heading font-black text-lg text-white">
                  {selectedOrder.order_reference}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Name:</span>
                  <span className="font-bold text-white">{selectedOrder.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <a href={`tel:${selectedOrder.customer_phone}`} className="font-bold text-emerald-400 hover:underline">
                    {selectedOrder.customer_phone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-slate-200">{selectedOrder.customer_email || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">State:</span>
                  <span className="font-semibold text-white">{selectedOrder.state}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Address:</span>
                  <span className="text-slate-200 block bg-slate-900 p-2 rounded border border-slate-800">
                    {selectedOrder.delivery_address}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Product:</span>
                  <span className="font-bold text-white">5-Burner Cooktop</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quantity:</span>
                  <span className="font-bold text-white">{selectedOrder.quantity} Unit(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Amount:</span>
                  <span className="font-extrabold text-[#E5C378] text-sm">
                    ₦{selectedOrder.total_amount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment:</span>
                  <span className="text-slate-300">{selectedOrder.payment_preference}</span>
                </div>
              </div>

              {/* Attribution */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-[11px] font-mono">
                <span className="text-xs font-bold font-sans text-slate-300 block mb-1">
                  Traffic &amp; Meta Attribution:
                </span>
                <div>Source: {selectedOrder.attribution?.utm_source || "direct"}</div>
                <div>Campaign: {selectedOrder.attribution?.utm_campaign || "—"}</div>
                <div>FBCLID: {selectedOrder.attribution?.fbclid || "—"}</div>
                <div>FBP: {selectedOrder.attribution?.fbp || "—"}</div>
              </div>

              {/* Action */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleManualCapiSend(selectedOrder.id, "Purchase");
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#B38C40] text-black font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Send CAPI Purchase</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
