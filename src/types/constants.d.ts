import { Cities, Countries } from "../constants";

type ListingsProvider = "coworker" | "allospaces";

type Country = keyof typeof Countries;
type City = keyof typeof Cities;

export { ListingsProvider, Country, City };
