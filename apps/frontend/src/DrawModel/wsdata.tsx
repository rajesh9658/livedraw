export interface wsdata{
    type: "message"|"join_room"|"leave_room";
    roonId:number;
    message:string;
    dbconnection?:boolean;
}