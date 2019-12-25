import { Photo } from './Photo';

export interface Users {
    id: number;
    userName: string;
    gender: string;
    age: number;
    knownAs: string;
    city: string;
    country: string;
    created: Date;
    lastActive: Date;
    PhotoUrl: string;
    interests?: string;
    introduction?: string;
    lookingFor?: string;
    photos?: Photo[];
}
