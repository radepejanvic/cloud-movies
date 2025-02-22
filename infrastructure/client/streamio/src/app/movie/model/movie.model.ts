export interface MovieDB{
    size?: {S : number};
    directory?: {S : string};
    lastModified?: {S : string};
    createdAt?: {S : string};
    actors?: {S : string};
    resolution?: {S : string};
    description?: {S : string};
    uploaded?: {BOOL : boolean};
    genres?: {S : string};
    directors?: {S : string};
    title?: {S : string};
    type?: {S : string};
    thumbnail?: {S : string};
}
export interface TopicArn{
    TopicArn?: string;
}

export interface UserSubscriptions{
    topics?: {SS : string[]};
}