export interface  FeedbackCreateData {
    type: string,
    comment: string,
    screenshot?: string,
    created_at: Date,
    user_id:string,
    
}
export interface FeedbackRepository {
    create: (data: FeedbackCreateData) => Promise<void>;
}