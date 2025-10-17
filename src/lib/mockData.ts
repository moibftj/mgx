export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'rider';
  profilePicture?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  description: string;
  warehouseStock: number;
}

export interface Transaction {
  id: string;
  date: string;
  riderId: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

export interface RiderStock {
  riderId: string;
  productId: string;
  quantity: number;
}

export interface TaxSettings {
  enabled: boolean;
  rate: number;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Fadlan Nafian',
    email: 'Fadlannafian@gmail.com',
    role: 'admin',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Ahmad Rider',
    email: 'rider1@example.com',
    role: 'rider'
  },
  {
    id: '3',
    name: 'Siti Kasir',
    email: 'rider2@example.com',
    role: 'rider'
  },
  {
    id: '4',
    name: 'Budi Sales',
    email: 'rider3@example.com',
    role: 'rider'
  },
  {
    id: '5',
    name: 'Rina Admin',
    email: 'admin2@example.com',
    role: 'admin'
  }
];

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Makanan Ringan',
    description: 'Berbagai jenis makanan ringan dan camilan'
  },
  {
    id: '2',
    name: 'Minuman',
    description: 'Minuman segar dan berkarbonasi'
  },
  {
    id: '3',
    name: 'Makanan Berat',
    description: 'Makanan utama dan lauk pauk'
  },
  {
    id: '4',
    name: 'Peralatan Rumah Tangga',
    description: 'Peralatan dan perlengkapan rumah tangga'
  },
  {
    id: '5',
    name: 'Elektronik',
    description: 'Perangkat elektronik dan aksesoris'
  },
  {
    id: '6',
    name: 'Pakaian',
    description: 'Pakaian dan aksesoris fashion'
  }
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Keripik Kentang Original',
    price: 15000,
    categoryId: '1',
    description: 'Keripik kentang renyah dengan rasa original',
    warehouseStock: 50
  },
  {
    id: '2',
    name: 'Coca Cola 330ml',
    price: 8000,
    categoryId: '2',
    description: 'Minuman berkarbonasi segar',
    warehouseStock: 100
  },
  {
    id: '3',
    name: 'Nasi Gudeg Kaleng',
    price: 25000,
    categoryId: '3',
    description: 'Gudeg khas Yogyakarta dalam kemasan kaleng',
    warehouseStock: 30
  },
  {
    id: '4',
    name: 'Aqua 600ml',
    price: 3000,
    categoryId: '2',
    description: 'Air mineral dalam kemasan botol',
    warehouseStock: 200
  },
  {
    id: '5',
    name: 'Indomie Goreng',
    price: 3500,
    categoryId: '3',
    description: 'Mie instan goreng rasa ayam',
    warehouseStock: 150
  },
  {
    id: '6',
    name: 'Teh Botol Sosro',
    price: 5000,
    categoryId: '2',
    description: 'Teh manis dalam kemasan botol',
    warehouseStock: 80
  },
  {
    id: '7',
    name: 'Biskuit Marie',
    price: 12000,
    categoryId: '1',
    description: 'Biskuit marie renyah dan manis',
    warehouseStock: 40
  },
  {
    id: '8',
    name: 'Sabun Mandi Lifebuoy',
    price: 4500,
    categoryId: '4',
    description: 'Sabun mandi antibakteri',
    warehouseStock: 60
  },
  {
    id: '9',
    name: 'Shampoo Clear 170ml',
    price: 18000,
    categoryId: '4',
    description: 'Shampoo anti ketombe untuk pria',
    warehouseStock: 25
  },
  {
    id: '10',
    name: 'Coklat Silverqueen',
    price: 22000,
    categoryId: '1',
    description: 'Coklat premium dengan kacang almond',
    warehouseStock: 35
  },
  {
    id: '11',
    name: 'Kopi Kapal Api',
    price: 2500,
    categoryId: '2',
    description: 'Kopi bubuk sachet siap seduh',
    warehouseStock: 120
  },
  {
    id: '12',
    name: 'Roti Tawar Sari Roti',
    price: 8500,
    categoryId: '3',
    description: 'Roti tawar lembut untuk sarapan',
    warehouseStock: 45
  },
  {
    id: '13',
    name: 'Pasta Gigi Pepsodent',
    price: 9500,
    categoryId: '4',
    description: 'Pasta gigi dengan fluoride untuk gigi sehat',
    warehouseStock: 55
  },
  {
    id: '14',
    name: 'Susu Ultra Milk 250ml',
    price: 6500,
    categoryId: '2',
    description: 'Susu UHT rasa coklat',
    warehouseStock: 90
  },
  {
    id: '15',
    name: 'Minyak Goreng Tropical 1L',
    price: 16000,
    categoryId: '3',
    description: 'Minyak goreng kelapa sawit berkualitas',
    warehouseStock: 20
  }
];

// Mock Rider Stocks
export const mockRiderStocks: RiderStock[] = [
  { riderId: '2', productId: '1', quantity: 10 },
  { riderId: '2', productId: '2', quantity: 15 },
  { riderId: '2', productId: '4', quantity: 20 },
  { riderId: '3', productId: '3', quantity: 5 },
  { riderId: '3', productId: '5', quantity: 25 },
  { riderId: '3', productId: '6', quantity: 12 },
  { riderId: '4', productId: '7', quantity: 8 },
  { riderId: '4', productId: '8', quantity: 15 },
  { riderId: '4', productId: '9', quantity: 6 },
  { riderId: '2', productId: '10', quantity: 7 },
  { riderId: '3', productId: '11', quantity: 30 },
  { riderId: '4', productId: '12', quantity: 10 }
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'TXN001',
    date: '2024-01-15T10:30:00Z',
    riderId: '2',
    products: [
      { productId: '1', quantity: 2, price: 15000 },
      { productId: '2', quantity: 3, price: 8000 }
    ],
    total: 54000
  },
  {
    id: 'TXN002',
    date: '2024-01-15T11:45:00Z',
    riderId: '3',
    products: [
      { productId: '3', quantity: 1, price: 25000 },
      { productId: '4', quantity: 2, price: 3000 }
    ],
    total: 31000
  },
  {
    id: 'TXN003',
    date: '2024-01-15T14:20:00Z',
    riderId: '2',
    products: [
      { productId: '5', quantity: 5, price: 3500 },
      { productId: '6', quantity: 2, price: 5000 }
    ],
    total: 27500
  },
  {
    id: 'TXN004',
    date: '2024-01-16T09:15:00Z',
    riderId: '4',
    products: [
      { productId: '7', quantity: 1, price: 12000 },
      { productId: '8', quantity: 3, price: 4500 }
    ],
    total: 25500
  },
  {
    id: 'TXN005',
    date: '2024-01-16T13:30:00Z',
    riderId: '3',
    products: [
      { productId: '9', quantity: 1, price: 18000 },
      { productId: '10', quantity: 2, price: 22000 }
    ],
    total: 62000
  },
  {
    id: 'TXN006',
    date: '2024-01-16T16:45:00Z',
    riderId: '2',
    products: [
      { productId: '11', quantity: 10, price: 2500 },
      { productId: '12', quantity: 2, price: 8500 }
    ],
    total: 42000
  },
  {
    id: 'TXN007',
    date: '2024-01-17T08:20:00Z',
    riderId: '4',
    products: [
      { productId: '13', quantity: 2, price: 9500 },
      { productId: '14', quantity: 4, price: 6500 }
    ],
    total: 45000
  },
  {
    id: 'TXN008',
    date: '2024-01-17T12:10:00Z',
    riderId: '3',
    products: [
      { productId: '15', quantity: 1, price: 16000 },
      { productId: '1', quantity: 1, price: 15000 },
      { productId: '2', quantity: 2, price: 8000 }
    ],
    total: 47000
  },
  {
    id: 'TXN009',
    date: '2024-01-17T15:35:00Z',
    riderId: '2',
    products: [
      { productId: '3', quantity: 2, price: 25000 },
      { productId: '4', quantity: 5, price: 3000 }
    ],
    total: 65000
  },
  {
    id: 'TXN010',
    date: '2024-01-18T10:50:00Z',
    riderId: '4',
    products: [
      { productId: '5', quantity: 3, price: 3500 },
      { productId: '6', quantity: 3, price: 5000 },
      { productId: '7', quantity: 1, price: 12000 }
    ],
    total: 37500
  },
  {
    id: 'TXN011',
    date: '2024-01-18T14:25:00Z',
    riderId: '3',
    products: [
      { productId: '8', quantity: 2, price: 4500 },
      { productId: '9', quantity: 1, price: 18000 }
    ],
    total: 27000
  },
  {
    id: 'TXN012',
    date: '2024-01-18T17:40:00Z',
    riderId: '2',
    products: [
      { productId: '10', quantity: 1, price: 22000 },
      { productId: '11', quantity: 8, price: 2500 },
      { productId: '12', quantity: 1, price: 8500 }
    ],
    total: 50500
  }
];

// Mock Tax Settings
export const mockTaxSettings: TaxSettings = {
  enabled: true,
  rate: 10
};