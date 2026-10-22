export type InstallPlatform = "apple" | "android" | "desktop";

export interface InstallPromptEvent extends Event {
  prompt(): Promise<{ outcome: "accepted" | "dismissed" } | void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function getInstallPlatform(device: {
  userAgent: string;
  platform: string;
  maxTouchPoints: number;
}): InstallPlatform {
  if (
    /iPad|iPhone|iPod/.test(device.userAgent) ||
    (device.platform === "MacIntel" && device.maxTouchPoints > 1)
  )
    return "apple";
  return /Android/.test(device.userAgent) ? "android" : "desktop";
}

export function isEmbeddedBrowser(userAgent: string) {
  return /FBAN|FBAV|Instagram|Line\/|MicroMessenger|; wv\)/i.test(userAgent);
}

export async function requestInstallation(prompt: InstallPromptEvent) {
  const result = await prompt.prompt();
  // Earlier Chromium versions resolve prompt() without a value and expose the
  // outcome separately through userChoice.
  const choice = result ?? (await prompt.userChoice);
  if (!choice) throw new Error("Installation outcome unavailable");
  return choice.outcome;
}
