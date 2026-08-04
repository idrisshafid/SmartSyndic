export interface Announcement {
    id          : string;
    syndic_id : string;
    residence_id : string;
    title     : string ;
    content     : string ;
    is_pinned   ? : boolean ;
    created_at ?  : Date ;
    updated_at ? : Date ;
}