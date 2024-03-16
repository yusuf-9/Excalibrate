import * as Atoms from "@/store/atoms"

export const useStore = () => {
  return {
    ...Atoms,
  }
};