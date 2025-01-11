"use client";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Button from "../components/Button"; // Adjust the path as necessary
import { languageData } from "../languageData";
import { useState } from "react";

export interface LanguageCardProps {
    title: string;
    description: string;
    to: string;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({ title, description, to }) => {
    return (
        <div className={"flex flex-col items-start mb-4 py-10"}>
            <div className="text-4xl tracking-tighter text-primary-text">{title}</div>
            <div className="self-stretch mt-2 text-secondary-text mb-2">
                {description}
            </div>
            <Button to={to} text="Enter" Icon={ArrowRightIcon} shadow={false} customClassName="hover:!shadow-[0px_0px_20px_rgba(246,140,90,1)]" />
        </div>
    );
};


export default () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isInside, setIsInside] = useState(false);

    return (
        <div
            className="font-serif sm:flex relative flex-col items-end"
            onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
            onMouseEnter={() => setIsInside(true)}
            onMouseLeave={() => setIsInside(false)}
        >
            <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a58fafe4bd1bb770390ab80d922cbc6ba31ca3ff3dd776cc9a38822542d4fb44?placeholderIfAbsent=true&apiKey=fcfbe47732904b758424102efb7b4fa0"
                className="object-cover inset-0 h-full size-full fixed"
                alt=""
            />
            <div className="backdrop-blur bg-gradient-to-r from-transparent via-background to-background flex divide-y divide-tertiary-text/50 relative z-10 flex-col justify-center px-16 max-w-lg sm:py-12 m-0 max-md:px-8 max-md:mb-2.5 max-sm:!mt-96 max-sm:!min-w-full max-sm:bg-gradient-to-b">
                {Object.values(languageData).map((language, index) => (
                    <LanguageCard
                        key={index}
                        title={language.title}
                        description={language.description}
                        to={`/learn/${language.code}`}
                    />
                ))}
            </div>
            <div
                className={`absolute h-20 bg-[#f68c5a] rounded-full w-screen ${!isInside ? "transition-all duration-300" : "!w-20"}`}
                style={{
                    top: isInside ? mousePos.y : "auto",
                    bottom: isInside ? "auto" : 0,
                    left: isInside ? mousePos.x : "50%",
                    transform: isInside
                        ? "translate(-50%, -50%)"
                        : "translate(-50%, 0)",
                    filter: `blur(${isInside ? 50 : 200}px)`,
                }}
            />
        </div>
    );
};