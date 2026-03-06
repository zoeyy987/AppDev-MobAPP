export const isBlocked = (creatorId: string, blockedIds: string[]) => false;

export const handleBookService = async (service: any, user: any, blockedIds: string[], callbacks: any) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    callbacks.onSuccess();
};
