import { atom, useAtom } from "jotai";

import { NoteItemType } from "./ui/file-list";

type Config = {
  selected: NoteItemType["id"] | null;
};

const configAtom = atom<Config>({
  selected: null,
});

/**
 * A custom hook for using the note functionality.
 *
 * @return {AtomTuple<NoteConfig>} The atom tuple containing the note configuration.
 */
export function useNote() {
  return useAtom(configAtom);
}
