import { writable } from "svelte/store";

export const User = writable({
    email: "",
    name: "",
    id: "",
    role: "",
    authToken: "",
});