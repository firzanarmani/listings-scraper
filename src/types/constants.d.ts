import { Cities, Countries } from "../constants";

type ListingsProvider = "coworker" | "allospaces" | "filmplace";

type Country = keyof typeof Countries;
type City = keyof typeof Cities;

export { ListingsProvider, Country, City };
