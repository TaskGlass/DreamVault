"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255", 
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {





  return (
    <div
      className={cn(
        "h-full w-full relative overflow-hidden",
        containerClassName
      )}
      style={{
        '--gradient-background-start': gradientBackgroundStart,
        '--gradient-background-end': gradientBackgroundEnd,
        '--first-color': firstColor,
        '--second-color': secondColor,
        '--third-color': thirdColor,
        '--fourth-color': fourthColor,
        '--fifth-color': fifthColor,
        '--size': size,
        '--blending-value': blendingValue,
      } as React.CSSProperties}
    >
      <div className={cn("h-full w-full relative", className)}>
        <div className="h-full w-full relative">
          <div className="gradients-container h-full w-full">
            <div
              className={cn(
                `absolute w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
                `[transform-origin:center_center] animate-first opacity-100`,
                `[background:radial-gradient(circle_at_center,_rgba(var(--first-color),_0.8)_0,_rgba(var(--first-color),_0)_50%)_no-repeat]`,
                `[mix-blend-mode:var(--blending-value)]`
              )}
              style={{
                background: `radial-gradient(circle at center, rgba(${firstColor}, 0.8) 0, rgba(${firstColor}, 0) 50%) no-repeat`,
                mixBlendMode: blendingValue as any,
              }}
            ></div>
            <div
              className={cn(
                `absolute w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
                `[transform-origin:calc(50%-400px)] animate-second opacity-100`,
                `[background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]`,
                `[mix-blend-mode:var(--blending-value)]`
              )}
              style={{
                background: `radial-gradient(circle at center, rgba(${secondColor}, 0.8) 0, rgba(${secondColor}, 0) 50%) no-repeat`,
                mixBlendMode: blendingValue as any,
              }}
            ></div>
            <div
              className={cn(
                `absolute w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
                `[transform-origin:calc(50%+400px)] animate-third opacity-100`,
                `[background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]`,
                `[mix-blend-mode:var(--blending-value)]`
              )}
              style={{
                background: `radial-gradient(circle at center, rgba(${thirdColor}, 0.8) 0, rgba(${thirdColor}, 0) 50%) no-repeat`,
                mixBlendMode: blendingValue as any,
              }}
            ></div>
            <div
              className={cn(
                `absolute w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
                `[transform-origin:calc(50%-200px)] animate-fourth opacity-70`,
                `[background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]`,
                `[mix-blend-mode:var(--blending-value)]`
              )}
              style={{
                background: `radial-gradient(circle at center, rgba(${fourthColor}, 0.8) 0, rgba(${fourthColor}, 0) 50%) no-repeat`,
                mixBlendMode: blendingValue as any,
              }}
            ></div>
            <div
              className={cn(
                `absolute w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
                `[transform-origin:calc(50%-800px)_calc(50%+800px)] animate-fifth opacity-100`,
                `[background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]`,
                `[mix-blend-mode:var(--blending-value)]`
              )}
              style={{
                background: `radial-gradient(circle at center, rgba(${fifthColor}, 0.8) 0, rgba(${fifthColor}, 0) 50%) no-repeat`,
                mixBlendMode: blendingValue as any,
              }}
            ></div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
