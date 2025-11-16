import type { Restaurant } from './restaurant'

export const demoRestaurants: Restaurant[] = [
  {
    id: 'demo-1',
    name: '橙意便当',
    address: '上海市静安区幸福路 88 号',
    phone: '021-88886666',
    latitude: 31.237,
    longitude: 121.4705,
    category: '简餐便当',
    rating: 4.6,
    priceLevel: 2,
    isOpen: true,
    openingHours: '09:30-21:00',
    photos: [],
    distance: 320
  },
  {
    id: 'demo-2',
    name: '一锅成湘·口味坊',
    address: '上海市黄浦区人民路 66 号',
    phone: '021-55557777',
    latitude: 31.2308,
    longitude: 121.475,
    category: '湘菜馆',
    rating: 4.8,
    priceLevel: 3,
    isOpen: true,
    openingHours: '10:00-22:00',
    photos: [],
    distance: 850
  },
  {
    id: 'demo-3',
    name: '良食轻食吧',
    address: '上海市徐汇区漕溪北路 18 号',
    phone: '021-77775555',
    latitude: 31.193,
    longitude: 121.436,
    category: '轻食/沙拉',
    rating: 4.2,
    priceLevel: 2,
    isOpen: true,
    openingHours: '08:00-20:00',
    photos: [],
    distance: 1200
  },
  {
    id: 'demo-4',
    name: '炭喜炭火串串',
    address: '上海市浦东新区世纪大道 100 号',
    phone: '021-66668888',
    latitude: 31.235,
    longitude: 121.506,
    category: '火锅/串串',
    rating: 4.4,
    priceLevel: 3,
    isOpen: true,
    openingHours: '11:00-01:00',
    photos: [],
    distance: 1500
  }
]
