export type tools = 
    |"select"
    |"pencil"
    |"eraser"
    |"rectangle"
    |"ellipse"
    |"diamond"
    |"draw"
    |"text"
    |"arrow"
    |"line"
    |"curve"


export type Shape = {
    id:number;
    type:"line"|"text"|"draw"|"rectangle"|"ellipse"|"arrow"|"diamond";
    color:string;
    startX:number;
    startY:number;
    endX:number;
    endY:number;
    rotation?:number;
    controlX?:number;
    controlY?:number;
    text?:string;
    path?:{x:number,y:number}[];
}