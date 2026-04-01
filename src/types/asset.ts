export type AssetCategory =
    | "Desktop"
    | "Laptop"
    | "Servers"
    | "Printers"
    | "Wifi"
    | "Mobile"
    | "Firewall"
    | "Biometric"
    | "Others"
    | "NAS"
    | "CCTV";

export interface AssetDetail {
    id: string;
    sNo: string;
    hostNameAssetId: string;
    cpu: string;
    processor: string;
    os: string;
    ipAddressHost: string;
    monitor1: string;
    monitor2: string;
    keyboard: string;
    mouse: string;
    voipBrand: string;
    ipAddressVoip: string;
    extension1: string;
    extension2: string;
    voipHeadphone: string;
    usbHeadphone: string;
    vendor: string;
    location: string;
    category: AssetCategory;
}

export type AssetVariant = "blue" | "green" | "orange" | "purple" | "red" | "indigo" | "pink";

export interface AssetSummary {
    id: string;
    title: string;
    count: number;
    variant: AssetVariant;
    iconName: string;
    category: string;
}
