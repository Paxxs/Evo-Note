import { atom, useAtom } from "jotai";

import { testFilesData } from "./test-files-data";
import { NoteItemType } from "./ui/file-list";

type Config = {
  selected: NoteItemType["id"] | null;
};

const configAtom = atom<Config>({
  selected: testFilesData[0].id,
});

/**
 * A custom hook for using the note functionality.
 *
 * @return {AtomTuple<NoteConfig>} The atom tuple containing the note configuration.
 */
export function useNote() {
  return useAtom(configAtom);
}
