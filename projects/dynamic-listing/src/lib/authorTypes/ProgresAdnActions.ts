export class Progress {
  title : string;
  selected : boolean;
}

export class ActionButtons {
  title : string;
  type : number;
  function : string;
  items : any[];
  disabled? : boolean = false;
}