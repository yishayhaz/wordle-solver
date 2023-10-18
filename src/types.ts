export type AnyObject = {
  [key: string]: any;
};

export type Filter = {
  type: "exclude" | "include" | "is" | "not";
  value: string;
  pos: "all" | "1" | "2" | "3" | "4" | "5";
};

export const defaultFilter: Filter = {
  type: "exclude",
  value: "",
  pos: "all",
};
