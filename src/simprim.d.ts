import { SimPrim as SimPrimClass} from "./simprim";

declare global {
    interface window {
        SimPrim: typeof SimPrimClass;
    }
    var SimPrim: typeof SimPrimClass;
}

export {};