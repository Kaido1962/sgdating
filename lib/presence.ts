export function isOnline(lastSeen: any): boolean {
    if (!lastSeen) return false;

    // Firestore Timestamp or JS Date
    const lastSeenDate = lastSeen.toDate ? lastSeen.toDate() : new Date(lastSeen);
    const now = new Date();

    // Consider online if seen in the last 3 minutes
    const diffInMinutes = (now.getTime() - lastSeenDate.getTime()) / 60000;

    return diffInMinutes < 3;
}
