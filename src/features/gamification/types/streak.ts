export interface Streak {
    id: number;
    current_streak: number;
    highest_streak: number;
    last_active_date: string | null; // ISO Date string (YYYY-MM-DD or full ISO)
    history: string[]; // JSON array of YYYY-MM-DD strings indicating active days
    freezes_available: number;
    freezes_used: number;
    updated_at: string;
}
