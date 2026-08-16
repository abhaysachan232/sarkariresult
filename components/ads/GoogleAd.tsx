"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    googletag: any;
  }
}

interface GoogleAdProps {
  adUnitPath: string;
  divId: string;
  sizes: any[];
  className?: string;
}

export default function GoogleAd({
  adUnitPath,
  divId,
  sizes,
  className = "",
}: GoogleAdProps) {
  useEffect(() => {
    window.googletag = window.googletag || {
      cmd: [],
    };

    window.googletag.cmd.push(() => {
      const existingSlot = window.googletag
        .pubads()
        .getSlots()
        .find(
          (slot: any) =>
            slot.getSlotElementId() === divId
        );

      if (existingSlot) {
        return;
      }

      const slot = window.googletag
        .defineSlot(
          adUnitPath,
          sizes,
          divId
        )
        ?.addService(
          window.googletag.pubads()
        );

      if (!slot) {
        console.error(
          "GAM slot creation failed:",
          divId
        );
        return;
      }

      window.googletag
        .pubads()
        .enableSingleRequest();

      window.googletag.enableServices();

      window.googletag.display(divId);
    });

    return () => {
      window.googletag?.cmd?.push(() => {
        const slot = window.googletag
          ?.pubads()
          ?.getSlots()
          ?.find(
            (slot: any) =>
              slot.getSlotElementId() === divId
          );

        if (slot) {
          window.googletag.destroySlots([slot]);
        }
      });
    };
  }, [adUnitPath, divId, sizes]);

  return (
    <div
      id={divId}
      className={`w-full flex justify-center overflow-hidden ${className}`}
      style={{
        minWidth: "88px",
        minHeight: "20px",
      }}
    />
  );
}