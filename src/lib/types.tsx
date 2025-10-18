export type Post = {
    _id?: string,
    title: string;
    content: string;
    user_id: number;
    date_created: Date;
    upvotes: Number;
    upvotes_user_id?: []
    downvotes_user_id?: []


}

export type Comment = {
    _id?: string,
    body: string;
    user_id: string;
    comment_replies_ids?: string[];
    reply_to: string,
    parent_comment_id?: string,
    post_id: string,
    date_created: Date,
    upvotes: Number,
    upvotes_user_id?: []
    downvotes_user_id?: []
}