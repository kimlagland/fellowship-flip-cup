import type { Faction } from "@/data/characters";

/** Snapshot the TV/computer host broadcasts to connected phones. */
export interface RemoteState {
  players: { player: string; character: string; faction: Faction }[];
  out: Record<string, number>;
  running: boolean;
  elapsed: number;
  winners: string[] | null;
}

export type RemoteCommand =
  | { action: "hello" }
  | { action: "eliminate" | "revive"; player: string }
  | { action: "wrath" | "toggle" };

/** Shared broadcast room name for host and phones. */
export const roomChannel = (code: string) => `baraddur-room-${code.toUpperCase()}`;

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ";
export const makeRoomCode = () =>
  Array.from({ length: 4 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
