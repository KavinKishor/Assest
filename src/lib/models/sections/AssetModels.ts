import mongoose, { Schema } from "mongoose";

const baseOptions = { timestamps: true };

// 1. Desktop Schema
const DesktopSchema = new Schema({
    hostNameAssetId: String,
    cpu: String,
    processor: String,
    os: String,
    ipAddressHost: String,
    monitor1: String,
    monitor2: String,
    keyboard: String,
    mouse: String,
    voipBrand: String,
    ipAddressVoip: String,
    extension1: String,
    extension2: String,
    voipHeadphone: String,
    usbHeadphone: String,
    vendor: String,
    location: String
}, baseOptions);

// 2. Laptop Schema
const LaptopSchema = new Schema({
    hostNameAssetId: String,
    brand: String,
    model: String,
    serialNumber: String,
    processor: String,
    os: String,
    ipAddressHost: String,
    monitor1: String,
    monitor2: String,
    keyboard: String,
    mouse: String,
    voipBrand: String,
    ipAddressVoip: String,
    extension1: String,
    extension2: String,
    voipHeadphone: String,
    usbHeadphone: String,
    vendor: String,
    location: String
}, baseOptions);

// 3. Server Schema
const ServerSchema = new Schema({
    hostNameAssetId: String,
    cpu: String,
    processor: String,
    os: String,
    ipAddressHost: String,
    monitor1: String,
    keyboard: String,
    mouse: String,
    vendor: String,
    location: String
}, baseOptions);

// 4. Printer Schema
const PrinterSchema = new Schema({
    brand: String,
    model: String,
    serialNumber: String,
    type: String,
    ipAddress: String,
    vendor: String,
    location: String
}, baseOptions);

// 5. Wifi Schema
const WifiSchema = new Schema({
    brand: String,
    model: String,
    serialNumber: String,
    mac: String,
    ipAddress: String,
    vendor: String,
    location: String
}, baseOptions);

// 6. Mobile Schema
const MobileSchema = new Schema({
    mobileModel: String,
    team: String,
    location: String
}, baseOptions);

// 7. Firewall Schema
const FirewallSchema = new Schema({
    hostNameAssetId: String,
    brand: String,
    model: String,
    serialNumber: String,
    firmwareVersion: String,
    ipAddress: String,
    vendor: String,
    location: String
}, baseOptions);

// 8. NAS Schema
const NasSchema = new Schema({
    brand: String,
    model: String,
    serialNumber: String,
    firmwareVersion: String,
    ipAddress: String,
    storage: String,
    vendor: String,
    location: String
}, baseOptions);

// 9. CCTV Schema
const CctvSchema = new Schema({
    deviceName: String,
    model: String,
    serialNumber: String,
    firmwareVersion: String,
    ipAddress: String,
    vendor: String,
    location: String
}, baseOptions);

// 10. Others Schema
const OthersSchema = new Schema({
    brand: String,
    deviceName: String,
    quantity: String,
    vendor: String,
    location: String
}, baseOptions);

// 11. Biometric Schema
const BiometricSchema = new Schema({
    deviceModel: String,
    deviceType: String,
    deviceName: String,
    ipAddress: String,
    mac: String,
    vendor: String,
    location: String
}, baseOptions);

// Unified/Simplified Schema for new sections
const UnifiedAssetSchema = new Schema({
    assetId: { type: String, required: true },
    vendor: String,
    location: String,
    quantity: { type: Number, default: 1 },
    dateOfPurchase: String,
}, baseOptions);

export const Desktop = mongoose.models.Desktop || mongoose.model("Desktop", DesktopSchema);
export const Laptop = mongoose.models.Laptop || mongoose.model("Laptop", LaptopSchema);
export const Server = mongoose.models.Server || mongoose.model("Server", ServerSchema);
export const Printers = mongoose.models.Printers || mongoose.model("Printers", PrinterSchema);
export const Wifi = mongoose.models.Wifi || mongoose.model("Wifi", WifiSchema);
export const Mobile = mongoose.models.Mobile || mongoose.model("Mobile", MobileSchema);
export const Firewall = mongoose.models.Firewall || mongoose.model("Firewall", FirewallSchema);
export const NAS = mongoose.models.NAS || mongoose.model("NAS", NasSchema);
export const CCTV = mongoose.models.CCTV || mongoose.model("CCTV", CctvSchema);
export const Others = mongoose.models.Others || mongoose.model("Others", OthersSchema);
export const Biometric = mongoose.models.Biometric || mongoose.model("Biometric", BiometricSchema);

// Unified models
const createUnified = (name: string) => mongoose.models[name] || mongoose.model(name, UnifiedAssetSchema);
export const Voip = createUnified("Voip");
export const UsbHeadphones = createUnified("UsbHeadphones");
export const HardDisk = createUnified("HardDisk");
export const Pendrive = createUnified("Pendrive");
export const Moniters = createUnified("Moniters");
export const Keyboards = createUnified("Keyboards");
export const Mouse = createUnified("Mouse");

export const ModelMap: Record<string, mongoose.Model<unknown>> = {
    desktop: Desktop,
    laptop: Laptop,
    server: Server,
    printers: Printers,
    wifi: Wifi,
    mobile: Mobile,
    firewall: Firewall,
    nas: NAS,
    cctv: CCTV,
    "other devices": Others,
    biometric: Biometric,
    voip: Voip,
    "usb headphones": UsbHeadphones,
    "hard disk": HardDisk,
    pendrive: Pendrive,
    moniters: Moniters,
    keyboards: Keyboards,
    mouse: Mouse
};
