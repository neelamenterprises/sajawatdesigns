import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlatformButtonProps {
    platform: "amazon" | "flipkart" | "meesho";
    url: string;
}

const platformConfig = {
    amazon: {
        label: "Buy on Amazon",
        color: "#FF9900",
        bgColor: "#FF990015",
        hoverBg: "#FF990025",
    },
    flipkart: {
        label: "Buy on Flipkart",
        color: "#2874F0",
        bgColor: "#2874F015",
        hoverBg: "#2874F025",
    },
    meesho: {
        label: "Buy on Meesho",
        color: "#E91E63",
        bgColor: "#E91E6315",
        hoverBg: "#E91E6325",
    },
};

export function PlatformButton({ platform, url }: PlatformButtonProps) {
    const config = platformConfig[platform];

    return (
        <Button
            asChild
            variant="outline"
            className="h-12 gap-2 rounded-xl border-2 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
            style={{
                borderColor: config.color,
                color: config.color,
                backgroundColor: config.bgColor,
            }}
        >
            <a href={url} target="_blank" rel="noopener noreferrer">
                {config.label}
                <ExternalLink className="h-4 w-4" />
            </a>
        </Button>
    );
}

interface PlatformButtonGroupProps {
    amazonUrl?: string | null;
    flipkartUrl?: string | null;
    meeshoUrl?: string | null;
}

export function PlatformButtonGroup({
    amazonUrl,
    flipkartUrl,
    meeshoUrl,
}: PlatformButtonGroupProps) {
    const buttons: { platform: "amazon" | "flipkart" | "meesho"; url: string }[] = [];

    if (amazonUrl) buttons.push({ platform: "amazon", url: amazonUrl });
    if (flipkartUrl) buttons.push({ platform: "flipkart", url: flipkartUrl });
    if (meeshoUrl) buttons.push({ platform: "meesho", url: meeshoUrl });

    if (buttons.length === 0) return null;

    return (
        <div className="flex flex-col gap-3 sm:flex-row">
            {buttons.map(({ platform, url }) => (
                <PlatformButton key={platform} platform={platform} url={url} />
            ))}
        </div>
    );
}
