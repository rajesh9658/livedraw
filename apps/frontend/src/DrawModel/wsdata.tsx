export interface wsdata{
    type: "message"|"join_room"|"leave_room";
    roomId:number;
    message:string;
    db?:boolean;
}