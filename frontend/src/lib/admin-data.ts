import fs from 'fs/promises';
import path from 'path';
import { getOrders, OrderEntry, CustomerDetails, OrderItem } from './storage';

// Shopify-grade Status Architecture
export type PaymentStatus = 'Unpaid' | 'Pending Review' | 'Paid' | 'Failed' | 'Refunded';
export type FulfillmentStatus = 'Reserved' | 'Queued' | 'Baking' | 'Packed' | 'Delivered' | 'Cancelled';

export interface OrderMeta {
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  notes: string;
  paymentProofUrl?: string; 
}

export interface MergedOrder extends OrderEntry {
  meta: OrderMeta;
  isRepeat: boolean;
  previousOrderCount: number;
}

export interface DropEntry {
  id: string;
  dropNumber: string;
  title: string;
  status: 'upcoming' | 'live' | 'closed' | 'fulfilled';
  slotLimit: number;
  startsAt: string;
  endsAt: string | null;
  notes: string;
}

const getMetaPath = () => path.join(process.cwd(), 'order-meta.json');
const getDropsPath = () => path.join(process.cwd(), 'drops.json');

// OFFICIAL BRANDED SOURCE OF TRUTH (Comprehensive Normalization)
const BRANDED_NAMES: Record<string, string> = {
  // Official
  'The Legend': 'The Legend',
  'The Naughty Nutella': 'The Naughty Nutella',
  'The Citrus Cloud': 'The Citrus Cloud',
  'Little Rebels': 'Little Rebels',
  
  // Legacy / Samples (Mapping strictly based on brand identity)
  'The Lazy Legend': 'The Legend',
  'Chocolate Chip': 'The Legend',
  'Classic Chocolate Chip': 'The Legend',
  'Classic Choco Chip': 'The Legend',
  'classic': 'The Legend',
  
  'The Golden Affair': 'The Naughty Nutella',
  'Nutella Stuffed': 'The Naughty Nutella',
  'Lotus Biscoff': 'The Naughty Nutella',
  'Brown Butter & Sea Salt': 'The Naughty Nutella',
  'brown-butter': 'The Naughty Nutella',
  
  'The Citrus Cloud': 'The Citrus Cloud',
  'Lemon Crinkle': 'The Citrus Cloud',
  
  'Salted Noir': 'Salted Noir',
  'Dark Chocolate + Salt': 'Salted Noir',
  'Dark Cocoa Espresso': 'Salted Noir',
  'dark-cocoa': 'Salted Noir',
  
  'Mini Chocolate Chip Bites': 'Little Rebels',
  'Mini Cookies': 'Little Rebels',
  'mini-cookies': 'Little Rebels'
};

export function normalizeProductName(name: string): string {
  return BRANDED_NAMES[name] || name;
}

export async function getDrops(): Promise<DropEntry[]> {
  try {
    const data = await fs.readFile(getDropsPath(), 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function getOrderMeta(): Promise<Record<string, OrderMeta>> {
  try {
    const data = await fs.readFile(getMetaPath(), 'utf-8');
    const rawData = JSON.parse(data);
    
    // Schema Migration & Normalization on the fly
    const normalizedMeta: Record<string, OrderMeta> = {};
    for (const [id, meta] of Object.entries(rawData)) {
      const m = meta as any;
      
      // Handle legacy 'orderStatus' -> 'fulfillmentStatus'
      const fStatus = m.fulfillmentStatus || m.orderStatus || 'Reserved';
      
      // Handle legacy 'Pending' -> 'Pending Review'
      let pStatus = m.paymentStatus || 'Unpaid';
      if (pStatus === 'Pending') pStatus = 'Pending Review';
      
      normalizedMeta[id] = {
        paymentStatus: pStatus as PaymentStatus,
        fulfillmentStatus: fStatus as FulfillmentStatus,
        notes: m.notes || '',
        paymentProofUrl: m.paymentProofUrl
      };
    }
    return normalizedMeta;
  } catch {
    return {};
  }
}

export async function updateOrderMeta(orderNumber: string, updates: Partial<OrderMeta>) {
  const meta = await getOrderMeta();
  const current = meta[orderNumber] || { paymentStatus: 'Unpaid', fulfillmentStatus: 'Reserved', notes: '' };
  meta[orderNumber] = { ...current, ...updates };
  await fs.writeFile(getMetaPath(), JSON.stringify(meta, null, 2));
}

export async function getMergedOrders(): Promise<MergedOrder[]> {
  const orders = await getOrders();
  const meta = await getOrderMeta();
  
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return sortedOrders.map((order, index) => {
    const previousOrders = sortedOrders.slice(index + 1).filter(
      o => o.customer.email.toLowerCase() === order.customer.email.toLowerCase()
    );

    const normalizedItems = order.items.map(item => ({
      ...item,
      name: normalizeProductName(item.name)
    }));

    return {
      ...order,
      items: normalizedItems,
      meta: meta[order.orderNumber] || { paymentStatus: 'Unpaid', fulfillmentStatus: 'Reserved', notes: '' },
      isRepeat: previousOrders.length > 0,
      previousOrderCount: previousOrders.length
    };
  });
}

function calculateDropStats(orders: MergedOrder[], dropId: string) {
  const dropOrders = orders.filter(o => o.orderNumber.startsWith(dropId));
  const totalRevenue = dropOrders.reduce((sum, o) => sum + o.total, 0);
  
  let cookieCount = 0;
  let packCount = 0;
  
  dropOrders.forEach(o => {
    o.items.forEach(i => {
      if (i.name === 'Little Rebels') {
        packCount += i.quantity;
      } else {
        cookieCount += i.quantity;
      }
    });
  });

  const orderCount = dropOrders.length;
  const paymentCount = dropOrders.filter(o => o.meta.paymentStatus === 'Paid').length;
  const deliveryCount = dropOrders.filter(o => o.meta.fulfillmentStatus === 'Delivered').length;
  
  return {
    revenue: totalRevenue,
    orders: orderCount,
    cookieCount,
    packCount,
    acv: orderCount > 0 ? totalRevenue / orderCount : 0,
    paymentCompletion: orderCount > 0 ? (paymentCount / orderCount) * 100 : 0,
    deliveryCompletion: orderCount > 0 ? (deliveryCount / orderCount) * 100 : 0
  };
}

export async function getBoutiqueAnalytics() {
  const orders = await getMergedOrders();
  
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const filterByTime = (start: Date) => orders.filter(o => new Date(o.timestamp) >= start);

  const todayOrders = filterByTime(startOfToday);
  const weekOrders = filterByTime(startOfWeek);
  const monthOrders = filterByTime(startOfMonth);

  const calculateStats = (ordersSubset: MergedOrder[]) => ({
    revenue: ordersSubset.reduce((sum, o) => sum + o.total, 0),
    count: ordersSubset.length,
    acv: ordersSubset.length > 0 ? ordersSubset.reduce((sum, o) => sum + o.total, 0) / ordersSubset.length : 0
  });

  const todayStats = calculateStats(todayOrders);
  const weekStats = calculateStats(weekOrders);
  const monthStats = calculateStats(monthOrders);

  const productPerformance: Record<string, number> = {};
  orders.forEach(o => {
    o.items.forEach(i => {
      productPerformance[i.name] = (productPerformance[i.name] || 0) + i.quantity;
    });
  });
  const bestSellers = Object.entries(productPerformance)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, quantity]) => ({ name, quantity }));

  const actionItems = {
    unpaidCount: orders.filter(o => ['Unpaid', 'Pending Review'].includes(o.meta.paymentStatus)).length,
    readyForFulfillment: orders.filter(o => o.meta.paymentStatus === 'Paid' && o.meta.fulfillmentStatus === 'Reserved').length,
    inProduction: orders.filter(o => ['Queued', 'Baking', 'Packed'].includes(o.meta.fulfillmentStatus)).length,
    todayOrders: todayOrders.length
  };

  return {
    hero: {
      today: todayStats,
      week: weekStats,
      month: monthStats,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      totalOrders: orders.length
    },
    actionItems,
    bestSellers,
    recentOrders: orders.slice(0, 10),
    repeatRate: (orders.filter(o => o.isRepeat).length / Math.max(1, orders.length)) * 100
  };
}

export async function getAdminAnalytics() {
  const orders = await getMergedOrders();
  const drops = await getDrops();
  
  const liveDrop = drops.find(d => d.status === 'live');
  const sortedDrops = [...drops].sort((a,b) => b.dropNumber.localeCompare(a.dropNumber));
  
  const activeDrop = liveDrop || sortedDrops[0] || { id: 'default', dropNumber: '1', slotLimit: 100, status: 'closed' };
  const previousDrop = sortedDrops.find(d => d.dropNumber < activeDrop.dropNumber);

  const activeStats = calculateDropStats(orders, activeDrop.id);
  const prevStats = previousDrop ? calculateDropStats(orders, previousDrop.id) : null;

  const getDelta = (curr: number, prev: number | undefined) => {
    if (prev === undefined || prev === 0) return null;
    return ((curr - prev) / prev) * 100;
  };

  const fillRate = (activeStats.orders / activeDrop.slotLimit) * 100;
  const performanceNote = `${activeStats.orders} of ${activeDrop.slotLimit} slots reserved (${Math.round(fillRate)}%)`;

  const productPerformance: Record<string, number> = {};
  const activeOrders = orders.filter(o => o.orderNumber.startsWith(activeDrop.id));
  activeOrders.forEach(o => {
    o.items.forEach(i => {
      productPerformance[i.name] = (productPerformance[i.name] || 0) + i.quantity;
    });
  });
  const bestSellerEntry = Object.entries(productPerformance).sort((a, b) => b[1] - a[1])[0];
  const bestSeller = activeOrders.length > 3 && bestSellerEntry 
    ? { name: bestSellerEntry[0], quantity: bestSellerEntry[1] } 
    : null;

  const actionItems = {
    unpaidCount: orders.filter(o => ['Unpaid', 'Pending Review'].includes(o.meta.paymentStatus)).length,
    readyForFulfillment: orders.filter(o => o.meta.paymentStatus === 'Paid' && o.meta.fulfillmentStatus === 'Reserved').length,
    inProduction: orders.filter(o => ['Queued', 'Baking', 'Packed'].includes(o.meta.fulfillmentStatus)).length
  };

  return {
    activeDropMetrics: {
      ...activeDrop,
      ...activeStats,
      revenueDelta: getDelta(activeStats.revenue, prevStats?.revenue),
      ordersDelta: getDelta(activeStats.orders, prevStats?.orders),
      bestSeller,
      performanceNote,
      slotsRemaining: Math.max(0, activeDrop.slotLimit - activeStats.orders),
      fillRate
    },
    lifetimeMetrics: {
      revenue: orders.reduce((sum, o) => sum + o.total, 0),
      orders: orders.length,
      acv: orders.length > 0 ? (orders.reduce((sum, o) => sum + o.total, 0) / orders.length) : 0,
      repeatRate: (orders.filter(o => o.isRepeat).length / Math.max(1, orders.length)) * 100
    },
    actionItems,
    recentOrders: orders.slice(0, 8),
    drops: sortedDrops.map(d => ({
      ...d,
      stats: calculateDropStats(orders, d.id)
    }))
  };
}
