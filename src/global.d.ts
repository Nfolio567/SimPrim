declare global {
    interface window {
        SimPrim: typeof import("./simprim").SimPrim;
    }
}

export {};