
export type NeologismStatus = "Draft" | "Ready" | "Rejected";

export type Category = {
  id: string;
  name: string;
};

export type Neologism = {
  id: string;
  name: string;
  rootWords: string[];
  categoryId: string;
  category?: string;
  definition: string;
  imageUrl?: string;
  status: NeologismStatus;
  createdAt: Date;
};
