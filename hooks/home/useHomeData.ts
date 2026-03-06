export const useHomeData = () => {
    return {
        userName: 'John Doe',
        userAvatar: 'https://via.placeholder.com/150',
        mainCategories: [
            { id: '1', label: 'Design', icon: 'brush' },
            { id: '2', label: 'Tech', icon: 'code-slash' },
            { id: '3', label: 'Marketing', icon: 'megaphone' }
        ],
        creators: [
            { firebase_uid: 'c1', full_name: 'Jane Smith', role: 'UI Designer', avatar_url: 'https://via.placeholder.com/150', bio: 'Expert in Figma and UI/UX design.', skills: ['Figma', 'Sketch'] },
            { firebase_uid: 'c2', full_name: 'Alice Johnson', role: 'Frontend Dev', avatar_url: 'https://via.placeholder.com/150', bio: 'React Native aficionado.', skills: ['React Native', 'Expo'] }
        ],
        recentMatches: [
            { id: 'm1', creator: { full_name: 'Jane Smith', role: 'UI Designer' }, match_score: 95 },
            { id: 'm2', creator: { full_name: 'Mike Brown', role: 'Backend Dev' }, match_score: 88 }
        ],
        creatorServices: [
            { id: 's1', title: 'Mobile App Design', label: 'Design', price: '5000', creator: { full_name: 'Jane Smith' }, image_url: 'https://via.placeholder.com/300' },
            { id: 's2', title: 'Landing Page Build', label: 'Tech', price: '3000', creator: { full_name: 'Alice Johnson' }, image_url: 'https://via.placeholder.com/300' }
        ],
        blockedIds: [],
        loading: false,
        role: 'client',
        roleLoading: false,
        hasMatches: true,
    };
};
