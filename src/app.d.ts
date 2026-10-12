// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  type ClassProperties<C> = {
    [K in keyof C as C[K] extends Function ? never : K]: C[K]
  }
}

export {}
