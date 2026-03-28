export interface Circle {
  id: number;
  name: string;
  penName: string;
  produceIdol: string;
  unit: string;
  characters: string[];
  space: string;
  links: {
    pixiv?: string;
    twitter?: string;
    other?: string;
  };
}
