// ========== CATEGORIES ==========
export const CATEGORIES = [
    'Design & Creative',
    'Development & IT',
    'Writing & Translation',
    'Digital Marketing',
    'Video & Animation',
    'Music & Audio'
];

export const SUBCATEGORY_MAP: Record<string, string[]> = {
    'Design & Creative': ['Logo Design', 'Brand Style Guides', 'Illustration', 'UI/UX Design', 'Portrait Drawing'],
    'Development & IT': ['Web Development', 'Mobile App Development', 'Game Development', 'Support & IT'],
    'Writing & Translation': ['Articles & Blog Posts', 'Translation', 'Proofreading', 'Scriptwriting'],
    'Digital Marketing': ['Social Media Marketing', 'SEO', 'Content Marketing', 'Video Marketing'],
    'Video & Animation': ['Video Editing', 'Animation for Kids', '3D Product Animation', 'Visual Effects'],
    'Music & Audio': ['Voice Over', 'Mixing & Mastering', 'Producers & Composers', 'Singers & Vocalists'],
};

// ========== SERVICE TYPE ==========
export type Service = {
    id: number;
    title: string;
    label: string;
    price: string;
    description: string;
    image_url?: string;
    created_at: string;
    creator_id: string;
};

export const MOCK_SERVICES: Service[] = [
    {
        id: 1,
        title: 'Professional Logo Design',
        label: 'Logo Design',
        price: '2500',
        description: 'I will create a modern, clean, and professional logo for your brand. Includes 3 initial concepts, unlimited revisions, and final files in all formats.',
        image_url: 'https://picsum.photos/seed/logo/400/300',
        created_at: '2026-02-15T10:00:00Z',
        creator_id: 'mock-user-1',
    },
    {
        id: 2,
        title: 'Full Stack Web Development',
        label: 'Web Development',
        price: '15000',
        description: 'Complete web application development using React, Node.js, and PostgreSQL. Includes responsive design, API development, and deployment.',
        image_url: 'https://picsum.photos/seed/webdev/400/300',
        created_at: '2026-02-20T14:30:00Z',
        creator_id: 'mock-user-1',
    },
    {
        id: 3,
        title: 'Social Media Marketing Package',
        label: 'Social Media Marketing',
        price: '5000',
        description: 'Monthly social media management including content creation, scheduling, analytics reporting, and community engagement across all platforms.',
        image_url: 'https://picsum.photos/seed/social/400/300',
        created_at: '2026-03-01T09:00:00Z',
        creator_id: 'mock-user-1',
    },
    {
        id: 4,
        title: 'Professional Video Editing',
        label: 'Video Editing',
        price: '3500',
        description: 'High-quality video editing for YouTube, social media, and corporate projects. Includes color grading, transitions, motion graphics, and audio mixing.',
        image_url: 'https://picsum.photos/seed/video/400/300',
        created_at: '2026-03-05T16:00:00Z',
        creator_id: 'mock-user-1',
    },
];

// ========== ORDER TYPE ==========
export type OrderStatus = 'pending' | 'accepted' | 'in_progress' | 'delivered' | 'completed' | 'refunded' | 'cancelled' | 'rejected';

export type Order = {
    id: number;
    service_title: string;
    price: string;
    status: OrderStatus;
    created_at: string;
    updated_at: string;
    client_name: string;
    creator_name: string;
    image_url?: string;
    client_id: string;
    creator_id: string;
    due_date?: string;
};

export const MOCK_ORDERS: Order[] = [
    {
        id: 1,
        service_title: 'Professional Logo Design',
        price: '2500',
        status: 'in_progress',
        created_at: '2026-03-01T10:00:00Z',
        updated_at: '2026-03-03T14:00:00Z',
        client_name: 'Juan Dela Cruz',
        creator_name: 'Sarah Jenkins',
        image_url: 'https://picsum.photos/seed/order1/400/300',
        client_id: 'client-1',
        creator_id: 'creator-1',
        due_date: '2026-03-15T10:00:00Z',
    },
    {
        id: 2,
        service_title: 'Full Stack Web App',
        price: '15000',
        status: 'pending',
        created_at: '2026-03-06T09:00:00Z',
        updated_at: '2026-03-06T09:00:00Z',
        client_name: 'Maria Santos',
        creator_name: 'Mike Ross',
        image_url: 'https://picsum.photos/seed/order2/400/300',
        client_id: 'client-2',
        creator_id: 'creator-2',
    },
    {
        id: 3,
        service_title: 'Brand Identity Package',
        price: '8000',
        status: 'delivered',
        created_at: '2026-02-20T11:00:00Z',
        updated_at: '2026-03-05T16:00:00Z',
        client_name: 'Pedro Garcia',
        creator_name: 'Anna Smith',
        image_url: 'https://picsum.photos/seed/order3/400/300',
        client_id: 'client-3',
        creator_id: 'creator-3',
        due_date: '2026-03-10T11:00:00Z',
    },
    {
        id: 4,
        service_title: 'Social Media Campaign',
        price: '5000',
        status: 'completed',
        created_at: '2026-02-10T08:00:00Z',
        updated_at: '2026-03-01T12:00:00Z',
        client_name: 'Ana Reyes',
        creator_name: 'Sarah Jenkins',
        image_url: 'https://picsum.photos/seed/order4/400/300',
        client_id: 'client-4',
        creator_id: 'creator-1',
    },
    {
        id: 5,
        service_title: 'Video Editing - YouTube',
        price: '3500',
        status: 'cancelled',
        created_at: '2026-02-25T15:00:00Z',
        updated_at: '2026-02-28T10:00:00Z',
        client_name: 'Carlos Tan',
        creator_name: 'Mike Ross',
        image_url: 'https://picsum.photos/seed/order5/400/300',
        client_id: 'client-5',
        creator_id: 'creator-2',
    },
    {
        id: 6,
        service_title: 'Mobile App UI Design',
        price: '12000',
        status: 'accepted',
        created_at: '2026-03-07T10:00:00Z',
        updated_at: '2026-03-08T09:00:00Z',
        client_name: 'Lisa Gomez',
        creator_name: 'Anna Smith',
        image_url: 'https://picsum.photos/seed/order6/400/300',
        client_id: 'client-6',
        creator_id: 'creator-3',
    },
];

// ========== MESSAGE THREAD TYPE ==========
export type MessageThread = {
    partnerId: string;
    partnerName: string;
    partnerAvatar: string | null;
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
};

export const MOCK_THREADS: MessageThread[] = [
    {
        partnerId: 'user-1',
        partnerName: 'Sarah Jenkins',
        partnerAvatar: 'https://picsum.photos/seed/avatar1/100/100',
        lastMessage: 'Hey! I just finished the first draft of your logo. Check it out!',
        lastMessageTime: new Date('2026-03-09T06:30:00Z'),
        unreadCount: 2,
    },
    {
        partnerId: 'user-2',
        partnerName: 'Mike Ross',
        partnerAvatar: 'https://picsum.photos/seed/avatar2/100/100',
        lastMessage: 'The website is almost done. I need to finish the payment integration.',
        lastMessageTime: new Date('2026-03-08T22:15:00Z'),
        unreadCount: 0,
    },
    {
        partnerId: 'user-3',
        partnerName: 'Anna Smith',
        partnerAvatar: null,
        lastMessage: 'Can you send me the brand guidelines document?',
        lastMessageTime: new Date('2026-03-08T18:00:00Z'),
        unreadCount: 1,
    },
    {
        partnerId: 'user-4',
        partnerName: 'Pedro Garcia',
        partnerAvatar: 'https://picsum.photos/seed/avatar4/100/100',
        lastMessage: 'Thank you for the great work! I will definitely recommend you.',
        lastMessageTime: new Date('2026-03-07T14:30:00Z'),
        unreadCount: 0,
    },
    {
        partnerId: 'user-5',
        partnerName: 'Lisa Gomez',
        partnerAvatar: 'https://picsum.photos/seed/avatar5/100/100',
        lastMessage: 'When can we schedule a call to discuss the project?',
        lastMessageTime: new Date('2026-03-06T10:00:00Z'),
        unreadCount: 3,
    },
    {
        partnerId: 'user-6',
        partnerName: 'Carlos Tan',
        partnerAvatar: null,
        lastMessage: 'I saw your portfolio and I am interested in working with you.',
        lastMessageTime: new Date('2026-03-05T08:45:00Z'),
        unreadCount: 0,
    },
];

// ========== ANALYTICS ==========
export const MOCK_ANALYTICS = {
    todayEarnings: 5500,
    yesterdayEarnings: 3200,
    lastMonthEarnings: 45000,
    earningsTrend: '+72%',
    avgRating: '4.8',
    totalReviews: 24,
    totalOrders: 3,
    totalViews: 142,
    totalClicks: 38,
    ordersTrend: '+50%',
    activeProjectsCount: 3,
    viewsTrend: '+23%',
    clicksTrend: '+15%',
    ratingTrend: '+2%',
};

export const MOCK_ONGOING_PROJECTS = [
    {
        id: 1,
        service_title: 'Professional Logo Design',
        price: '₱2,500',
        status: 'in_progress',
        client_name: 'Juan Dela Cruz',
        image_url: 'https://picsum.photos/seed/proj1/400/300',
    },
    {
        id: 3,
        service_title: 'Brand Identity Package',
        price: '₱8,000',
        status: 'delivered',
        client_name: 'Pedro Garcia',
        image_url: 'https://picsum.photos/seed/proj3/400/300',
    },
];

// ========== CREATORS (for search) ==========
export type Creator = {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
    rating: string;
    reviewCount: number;
    location: string;
};

export const MOCK_CREATORS: Creator[] = [
    { id: 'c1', name: 'Sarah Jenkins', avatar: 'https://picsum.photos/seed/c1/100/100', role: 'UI/UX Designer', rating: '4.9', reviewCount: 47, location: 'Manila' },
    { id: 'c2', name: 'Mike Ross', avatar: 'https://picsum.photos/seed/c2/100/100', role: 'Web Developer', rating: '4.8', reviewCount: 32, location: 'Cebu' },
    { id: 'c3', name: 'Anna Smith', avatar: 'https://picsum.photos/seed/c3/100/100', role: 'Video Editor', rating: '5.0', reviewCount: 18, location: 'Davao' },
    { id: 'c4', name: 'David Lee', avatar: 'https://picsum.photos/seed/c4/100/100', role: 'Graphic Designer', rating: '4.7', reviewCount: 56, location: 'Quezon City' },
    { id: 'c5', name: 'Emma Wilson', avatar: null, role: 'Content Writer', rating: '4.6', reviewCount: 21, location: 'Makati' },
];

// ========== NOTIFICATIONS ==========
export type Notification = {
    id: number;
    title: string;
    message: string;
    type: 'order' | 'message' | 'system' | 'review';
    read: boolean;
    created_at: string;
};

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 1, title: 'New Order', message: 'You have a new order for "Logo Design" from Juan Dela Cruz.', type: 'order', read: false, created_at: '2026-03-09T06:00:00Z' },
    { id: 2, title: 'New Message', message: 'Sarah Jenkins sent you a message.', type: 'message', read: false, created_at: '2026-03-09T05:30:00Z' },
    { id: 3, title: 'Review Received', message: 'Pedro Garcia left a 5-star review on your service.', type: 'review', read: true, created_at: '2026-03-08T14:00:00Z' },
    { id: 4, title: 'Order Completed', message: 'Your order "Social Media Campaign" has been marked as completed.', type: 'order', read: true, created_at: '2026-03-07T12:00:00Z' },
    { id: 5, title: 'System Update', message: 'CreaTech has been updated with new features. Check them out!', type: 'system', read: true, created_at: '2026-03-06T09:00:00Z' },
];

// ========== CHAT MESSAGES ==========
export type ChatMessage = {
    id: number;
    senderId: string;
    content: string;
    created_at: string;
    is_read: boolean;
};

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    { id: 1, senderId: 'user-1', content: 'Hi! I need a logo for my new business.', created_at: '2026-03-08T10:00:00Z', is_read: true },
    { id: 2, senderId: 'mock-user-1', content: 'Sure! What kind of business is it? Can you describe your brand?', created_at: '2026-03-08T10:05:00Z', is_read: true },
    { id: 3, senderId: 'user-1', content: 'It\'s a coffee shop called "Brew & Bean". I want something modern and minimal.', created_at: '2026-03-08T10:10:00Z', is_read: true },
    { id: 4, senderId: 'mock-user-1', content: 'Great taste! I\'ll put together some initial concepts. Give me a day or two.', created_at: '2026-03-08T10:15:00Z', is_read: true },
    { id: 5, senderId: 'user-1', content: 'Sounds perfect. Looking forward to it!', created_at: '2026-03-08T10:20:00Z', is_read: true },
    { id: 6, senderId: 'user-1', content: 'Hey! I just finished the first draft of your logo. Check it out!', created_at: '2026-03-09T06:30:00Z', is_read: false },
];

// ========== CURRENCY HELPER ==========
export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};
